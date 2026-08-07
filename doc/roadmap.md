# Strategic Development Roadmap: Helio AI

## Project: Helio AI
**Date:** August 7, 2026  
**Status:** Updated Master Timeline  

---

## 1. Roadmap Overview & Timeline

The roadmap covers 16 weeks of structured development divided into 4 sequential phases.

```
Phase 1 (COMPLETED) ──► Phase 2 (COMPLETED) ──► Phase 3 (UPCOMING) ──► Phase 4 (UPCOMING)
(Weeks 1-4)             (Weeks 5-8)             (Weeks 9-12)           (Weeks 13-16)
```

---

## 2. Phase-Wise Details & Status

### 2.1 Phase 1: Cryptographic Foundation (Weeks 1–4)
*   **Status:** **[COMPLETED]**
*   **Objectives:** Implement a Solidity registry on private Hyperledger Besu consortium nodes to store dynamic access consent and clinical file hashes.
*   **Key Deliverables:**
    *   `[x]` Solidity Contract: [HelioIntegrityRegistry.sol](file:///d:/projects/Helio/contracts/HelioIntegrityRegistry.sol) managing authorizations and temporal consent rules.
    *   `[x]` Mocha/Chai Test Suite: [HelioIntegrityRegistry.js](file:///d:/projects/Helio/test/HelioIntegrityRegistry.js) passing all 9 validations.

---

### 2.2 Phase 2: Local Interoperability (Weeks 5–8)
*   **Status:** **[COMPLETED]**
*   **Objectives:** Deploy a local Model Context Protocol (MCP) server inside the hospital network boundary to query local documents, compute SHA-256 hashes, verify block registries, and translate files to HL7 FHIR formats.
*   **Key Deliverables:**
    *   `[x]` Python Server: [mcp_server.py](file:///d:/projects/Helio/mcp_server/mcp_server.py) using the standard `MCPServer` library.
    *   `[x]` Mock Database Structure: FHIR Patient Bundle files in the [data/](file:///d:/projects/Helio/mcp_server/data/) directory.
    *   `[x]` PyTest Suite: [test_mcp.py](file:///d:/projects/Helio/mcp_server/test_mcp.py) passing all 3 integration verifications.

---

### 2.3 Phase 3: Agentic Swarm & PII Scrubber (Weeks 9–12)
*   **Status:** **[UPCOMING]** (Scheduled Start: August 10, 2026)
*   **Objectives:** Deploy the Gemma PII Scrubber (vLLM local instance) and integrate the specialized multi-agent planning swarm coordinated via the Clinical Coordinator on the Antigravity Framework.
*   **Key Tasks:**
    *   `[ ]` Package Gemma 2 (9B/27B) as a Docker container targeting Cloud Run GPU nodes.
    *   `[ ]` Build the Timeline, Medication, Allergy, and Risk agents using the Google ADK.
    *   `[ ]` Configure the Clinical Coordinator to aggregate reports into a unified clinical bundle.
    *   `[ ]` Deploy the main AI Orchestrator and Medical Summary Agent (Gemini 2.5) with page-level citations.

---

### 2.4 Phase 4: User Interfaces & Edge Security (Weeks 13–16)
*   **Status:** **[UPCOMING]** (Scheduled Start: September 7, 2026)
*   **Objectives:** Configure Edge Security (Global Load Balancer, Cloud Armor, Apigee, FHIR Gateway) and launch the Next.js Dashboards (Provider/HITL) and Patient Mobile App.
*   **Key Tasks:**
    *   `[ ]` Build the Next.js HITL Dashboard Editor with Feedback API loops.
    *   `[ ]` Build the Next.js Provider Dashboard and Patient React Native App.
    *   `[ ]` Configure Global Load Balancer SSL, Cloud Armor WAF profiles, and Apigee API Gateway consent query hooks.
    *   `[ ]` Conduct complete system integration, locust load testing, and CI/CD automated deployment.
