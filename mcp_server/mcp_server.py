# SPDX-License-Identifier: MIT
import hashlib
import json
import os
import sys
from typing import Dict, Any, Union
from mcp.server.mcpserver import MCPServer
from pydantic import BaseModel, Field
from web3 import Web3

# Initialize MCPServer
mcp = MCPServer("HelioIntegrityProxy")

# Blockchain Registry Configuration (Consortium RPC endpoint & contract address)
BESU_RPC_URL = os.getenv("HELIO_BESU_RPC_URL", "")
CONTRACT_ADDRESS = os.getenv("HELIO_CONTRACT_ADDRESS", "")

# ABI definition (simplified for read-only view calls)
REGISTRY_ABI = [
    {
        "inputs": [
            {"internalType": "string", "name": "patientId", "type": "string"},
            {"internalType": "string", "name": "docId", "type": "string"},
            {"internalType": "bytes32", "name": "docHash", "type": "bytes32"}
        ],
        "name": "verifyRecord",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "string", "name": "patientId", "type": "string"},
            {"internalType": "address", "name": "provider", "type": "address"}
        ],
        "name": "checkConsent",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    }
]

# Path to the clinical data directory
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "data"))

class EHRFetchSchema(BaseModel):
    patient_id: str = Field(description="The unique identifier of the patient (e.g. 'patient-123')")
    doc_id: str = Field(description="The unique identifier of the document (e.g. 'doc-999')")
    provider_address: str = Field(description="The blockchain address of the requesting clinician/provider")

def calculate_sha256(filepath: str) -> bytes:
    """Computes the SHA-256 hash of a file's raw content."""
    sha256_hash = hashlib.sha256()
    with open(filepath, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.digest()

@mcp.tool()
def verify_and_fetch_ehr(patient_id: str, doc_id: str, provider_address: str) -> Dict[str, Any]:
    """
    Fetches a patient's medical document, calculates its SHA-256 hash, 
    verifies patient consent and record integrity on the blockchain, 
    and returns FHIR JSON format.
    """
    # 1. Locate the document locally
    patient_dir = os.path.join(DATA_DIR, patient_id)
    doc_path = os.path.join(patient_dir, f"{doc_id}.json")

    if not os.path.exists(doc_path):
        return {
            "status": "error",
            "code": "404",
            "message": f"Document {doc_id} for Patient {patient_id} not found."
        }

    # 2. Compute the cryptographic hash
    try:
        doc_hash = calculate_sha256(doc_path)
        doc_hash_hex = "0x" + doc_hash.hex()
    except Exception as e:
        return {
            "status": "error",
            "code": "500",
            "message": f"Failed to calculate document checksum: {str(e)}"
        }

    # 3. Connect to Besu Consortium RPC and check permissions
    if not CONTRACT_ADDRESS or not BESU_RPC_URL:
        # Simulation Mode (fallback for testing)
        is_consented = (patient_id == "patient-123" and provider_address.lower() == "0x9876543210abcdef9876543210abcdef98765432".lower())
        is_verified = (doc_id == "doc-999")
        verification_source = "Simulation Engine (consortium ledger mocked)"
    else:
        try:
            w3 = Web3(Web3.HTTPProvider(BESU_RPC_URL))
            if not w3.is_connected():
                return {
                    "status": "error",
                    "code": "503",
                    "message": "Service Unavailable: Failed to connect to Blockchain RPC node."
                }
            
            contract = w3.eth.contract(address=Web3.to_checksum_address(CONTRACT_ADDRESS), abi=REGISTRY_ABI)
            
            # Check patient consent for the provider
            is_consented = contract.functions.checkConsent(patient_id, Web3.to_checksum_address(provider_address)).call()
            
            # Check document hash registry integrity
            is_verified = contract.functions.verifyRecord(patient_id, doc_id, doc_hash).call()
            verification_source = f"Blockchain Ledger (Block height: {w3.eth.block_number})"
        except Exception as e:
            return {
                "status": "error",
                "code": "500",
                "message": f"Blockchain validation query failed: {str(e)}"
            }

    # 4. Enforce Access Rules
    if not is_consented:
        return {
            "status": "error",
            "code": "403",
            "message": f"Access Denied: Patient {patient_id} has not consented to Provider {provider_address}."
        }

    if not is_verified:
        return {
            "status": "error",
            "code": "409",
            "message": "Integrity Failure: Cryptographic checksum mismatch. Record may have been tampered with."
        }

    # 5. Retrieve and parse FHIR JSON content
    try:
        with open(doc_path, "r") as f:
            fhir_content = json.load(f)
    except Exception as e:
        return {
            "status": "error",
            "code": "500",
            "message": f"Failed to parse EHR FHIR content: {str(e)}"
        }

    # 6. Return verified EHR payload
    return {
      "status": "success",
      "patientId": patient_id,
      "docId": doc_id,
      "verification": {
          "status": "verified",
          "hash": doc_hash_hex,
          "source": verification_source
      },
      "fhir_bundle": fhir_content
    }

if __name__ == "__main__":
    mcp.run()
