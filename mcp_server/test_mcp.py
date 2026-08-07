import os
import json
import pytest
from mcp_server import verify_and_fetch_ehr, calculate_sha256, DATA_DIR

def test_fetch_nonexistent_document():
    # Attempt to fetch document that doesn't exist
    result = verify_and_fetch_ehr("patient-123", "nonexistent-doc", "0x9876543210abcdef9876543210abcdef98765432")
    assert result["status"] == "error"
    assert result["code"] == "404"
    assert "not found" in result["message"]

def test_fetch_without_patient_consent():
    # Attempt to fetch with unauthorized provider address
    unauthorized_provider = "0x0000000000000000000000000000000000000000"
    result = verify_and_fetch_ehr("patient-123", "doc-999", unauthorized_provider)
    assert result["status"] == "error"
    assert result["code"] == "403"
    assert "Access Denied" in result["message"]

def test_fetch_success():
    # Fetch with valid consent and document ID
    provider_address = "0x9876543210abcdef9876543210abcdef98765432"
    result = verify_and_fetch_ehr("patient-123", "doc-999", provider_address)
    
    assert result["status"] == "success"
    assert result["patientId"] == "patient-123"
    assert result["docId"] == "doc-999"
    assert result["verification"]["status"] == "verified"
    
    # Verify hash value matches local file calculation
    doc_path = os.path.join(DATA_DIR, "patient-123", "doc-999.json")
    expected_hash = "0x" + calculate_sha256(doc_path).hex()
    assert result["verification"]["hash"] == expected_hash
    
    # Verify FHIR structure
    assert result["fhir_bundle"]["resourceType"] == "Bundle"
    assert len(result["fhir_bundle"]["entry"]) > 0
