# SPDX-License-Identifier: MIT
import os
import json
import pytest
from fastapi.testclient import TestClient
from edge_gateway import app, AUDIT_LOG_PATH

# Setup FastAPI test client
client = TestClient(app)

@pytest.fixture(autouse=True)
def clean_audit_logs():
    # Remove audit logs before and after each test
    if os.path.exists(AUDIT_LOG_PATH):
        os.remove(AUDIT_LOG_PATH)
    yield
    if os.path.exists(AUDIT_LOG_PATH):
        os.remove(AUDIT_LOG_PATH)

def test_api_key_unauthorized():
    response = client.post(
        "/api/v1/patient/summary", 
        json={"patientId": "patient-123", "providerAddress": "0x9876543210abcdef9876543210abcdef98765432"},
        headers={"x-api-key": "invalid-key"}
    )
    assert response.status_code == 401
    assert "Unauthorized" in response.json()["detail"]

def test_consent_denied():
    unauthorized_provider = "0x0000000000000000000000000000000000000000"
    response = client.post(
        "/api/v1/patient/summary",
        json={"patientId": "patient-123", "providerAddress": unauthorized_provider},
        headers={"x-api-key": "helio-test-key"}
    )
    assert response.status_code == 403
    assert "Access Denied" in response.json()["detail"]
    
    assert os.path.exists(AUDIT_LOG_PATH)
    with open(AUDIT_LOG_PATH, "r") as f:
        logs = json.load(f)
    assert len(logs) == 1
    assert logs[0]["event"] == "summary_request"
    assert logs[0]["consentValidated"] is False
    assert logs[0]["status"] == "blocked"

def test_summary_success():
    provider = "0x9876543210abcdef9876543210abcdef98765432"
    response = client.post(
        "/api/v1/patient/summary",
        json={"patientId": "patient-123", "providerAddress": provider},
        headers={"x-api-key": "helio-test-key"}
    )
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["status"] == "success"
    assert "clinical_summary" in res_data
    
    assert os.path.exists(AUDIT_LOG_PATH)
    with open(AUDIT_LOG_PATH, "r") as f:
        logs = json.load(f)
    assert len(logs) == 1
    assert logs[0]["event"] == "summary_request"
    assert logs[0]["consentValidated"] is True

def test_submit_feedback_audit():
    response = client.post(
        "/api/v1/clinical/feedback",
        json={
            "summaryId": "sum-777",
            "patientId": "patient-123",
            "providerAddress": "0x9876543210abcdef9876543210abcdef98765432",
            "editedSummary": "# Summary\nVerified edits",
            "rating": 5
        }
    )
    assert response.status_code == 200
    assert response.json()["status"] == "success"
    
    assert os.path.exists(AUDIT_LOG_PATH)
    with open(AUDIT_LOG_PATH, "r") as f:
        logs = json.load(f)
    assert len(logs) == 1
    assert logs[0]["event"] == "doctor_feedback"
    assert logs[0]["summaryId"] == "sum-777"
    assert logs[0]["rating"] == 5
    assert "Verified edits" in logs[0]["editedSummary"]
