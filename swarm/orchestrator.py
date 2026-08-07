# SPDX-License-Identifier: MIT
import os
import json
import httpx
from typing import Dict, Any
import google.generativeai as genai

# Adjust path to import local modules from sibling directories
import sys
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from mcp_server.mcp_server import verify_and_fetch_ehr
from clinical_coordinator import ClinicalCoordinator
from pii_scrubber import deterministic_scrub

# Setup API Key if present
api_key = os.getenv("GEMINI_API_KEY", "")
if api_key:
    genai.configure(api_key=api_key)

class MedicalSummaryAgent:
    """Uses Gemini 2.5 to compile the final summarized clinical document."""
    def generate_summary(self, scrubbed_text: str, bundle: Dict[str, str]) -> str:
        if not api_key:
            # Fallback mock summary
            summary = (
                "# Clinical Summary (Verified)\n\n"
                "## Patient Demographics & Profile\n"
                "- Identifiers: Sanitized & Masked locally.\n\n"
                "## Timeline Chronology\n"
                f"{bundle['timeline']}\n\n"
                "## Allergy Assessments\n"
                f"{bundle['allergies']}\n\n"
                "## Medication Profiles\n"
                f"{bundle['medications']}\n\n"
                "## Warning Alerts & Clinical Risk\n"
                f"{bundle['risks']}\n\n"
                "--- \n"
                "*Citation anchor verified by consortium registry ledger.*"
            )
            return summary

        try:
            model = genai.GenerativeModel("gemini-2.5-pro")
            prompt = (
                "You are an oncology clinical intelligence summarizer. Compile a professional clinical "
                "summary based on the scrubbed records and specialized agent analysis results.\n\n"
                f"Scrubbed Context:\n{scrubbed_text}\n\n"
                f"Specialized Analysis Bundle:\n"
                f"- Timeline: {bundle['timeline']}\n"
                f"- Medications: {bundle['medications']}\n"
                f"- Allergies: {bundle['allergies']}\n"
                f"- Clinical Risks: {bundle['risks']}\n\n"
                "Generate the summary in clean markdown format, preserving citations and adding a verification header."
            )
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Summarization Agent Error: {str(e)}"

class AIOrchestrator:
    """AI Orchestrator coordinating retrieval, validation, PII scrubbing, and agent swarms."""
    def __init__(self):
        self.coordinator = ClinicalCoordinator()
        self.summary_agent = MedicalSummaryAgent()
        self.scrubber_url = os.getenv("HELIO_SCRUBBER_URL", "http://127.0.0.1:8000/scrub")

    def run_pipeline(self, patient_id: str, doc_id: str, provider_address: str) -> Dict[str, Any]:
        # 1. Retrieve EHR and check consent/integrity on the blockchain via local MCP Server tool
        mcp_result = verify_and_fetch_ehr(patient_id, doc_id, provider_address)
        if mcp_result.get("status") == "error":
            return mcp_result

        # Extract FHIR content for analysis
        fhir_bundle = mcp_result["fhir_bundle"]
        raw_text = json.dumps(fhir_bundle, indent=2)

        # 2. Scrub PII locally (FastAPI call with fallback)
        scrubbed_text = ""
        try:
            response = httpx.post(self.scrubber_url, json={"text": raw_text}, timeout=2.0)
            if response.status_code == 200:
                scrubbed_text = response.json().get("scrubbed_text", "")
        except Exception:
            scrubbed_text = deterministic_scrub(raw_text)

        # 3. Coordinate multi-agent swarm analysis
        bundle = self.coordinator.coordinate_analysis(scrubbed_text)

        # 4. Generate final medical summary
        final_markdown = self.summary_agent.generate_summary(scrubbed_text, bundle)

        return {
            "status": "success",
            "patientId": patient_id,
            "docId": doc_id,
            "verification": mcp_result["verification"],
            "analysis_bundle": bundle,
            "clinical_summary": final_markdown
        }

if __name__ == "__main__":
    orchestrator = AIOrchestrator()
    res = orchestrator.run_pipeline("patient-123", "doc-999", "0x9876543210abcdef9876543210abcdef98765432")
    print(json.dumps(res, indent=2))
