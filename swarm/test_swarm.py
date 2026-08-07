# SPDX-License-Identifier: MIT
import os
import json
import pytest
from fastapi.testclient import TestClient
from pii_scrubber import app, deterministic_scrub
from specialized_agents import TimelineAgent, AllergyAgent
from clinical_coordinator import ClinicalCoordinator
from orchestrator import AIOrchestrator

# Setup FastAPI test client
client = TestClient(app)

def test_pii_scrubber_endpoint():
    input_text = "Patient Julian Vance contacted us at julian.vance@example.com or 555-019-2834."
    response = client.post("/scrub", json={"text": input_text})
    
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["status"] == "success"
    
    scrubbed = res_data["scrubbed_text"]
    assert "[PATIENT_NAME]" in scrubbed
    assert "[EMAIL]" in scrubbed
    assert "[PHONE]" in scrubbed
    assert "Julian" not in scrubbed
    assert "julian.vance" not in scrubbed

def test_specialized_agents_mock_output():
    timeline_agent = TimelineAgent()
    allergy_agent = AllergyAgent()
    
    timeline_res = timeline_agent.analyze("oncology-report-2024")
    assert "Stage II breast cancer" in timeline_res
    
    allergy_res = allergy_agent.analyze("allergy-penicillin")
    assert "Penicillin allergy detected" in allergy_res

def test_coordinator_parallels():
    coordinator = ClinicalCoordinator()
    context = "Patient allergy-penicillin and oncology-report-2024 active."
    
    bundle = coordinator.coordinate_analysis(context)
    assert "timeline" in bundle
    assert "allergies" in bundle
    assert "medications" in bundle
    assert "risks" in bundle
    
    assert "Stage II breast cancer" in bundle["timeline"]
    assert "Penicillin" in bundle["allergies"]

def test_orchestrator_pipeline_success():
    orchestrator = AIOrchestrator()
    provider_address = "0x9876543210abcdef9876543210abcdef98765432"
    
    res = orchestrator.run_pipeline("patient-123", "doc-999", provider_address)
    
    assert res["status"] == "success"
    assert res["patientId"] == "patient-123"
    assert res["docId"] == "doc-999"
    assert res["verification"]["status"] == "verified"
    
    assert "clinical_summary" in res
    assert "# Clinical Summary" in res["clinical_summary"]
