# Project Implementation & Development Plan: Helio AI

## Project: Helio AI
**Role:** Technical Project Manager  
**Date:** August 7, 2026  
**Status:** Approved Implementation Schedule  

---

## 1. Project Phases & High-Level Milestones

```
Phase 1: Foundation ──► Phase 2: Interoperability ──► Phase 3: Agentic Swarm ──► Phase 4: Frontend & Edge
(Weeks 1-4)             (Weeks 5-8)                 (Weeks 9-12)                (Weeks 13-16)
```

### 1.1 Phase 1: Cryptographic Foundation (Weeks 1–4)
*   **Milestone 1:** Deploy Solidity registry on private Hyperledger Besu consortium nodes.
*   **Milestone 2:** Validate access authorization, record hash registration, and temporal patient consent.

### 1.2 Phase 2: Local Interoperability (Weeks 5–8)
*   **Milestone 3:** Deploy Model Context Protocol (MCP) servers inside hospital firewalls.
*   **Milestone 4:** Map raw EHR files to standardized HL7 FHIR formats and configure Web3 contract queries.

### 1.3 Phase 3: Agentic Swarm & PII Scrubber (Weeks 9–12)
*   **Milestone 5:** Deploy the Gemma PII Scrubber running on local GPU-accelerated Cloud Run containers.
*   **Milestone 6:** Integrate the **Antigravity Framework** and Clinical Coordinator Swarm (Timeline, Medication, Allergy, Risk agents).

### 1.4 Phase 4: User Interfaces & Edge Security (Weeks 13–16)
*   **Milestone 7:** Deploy Global Load Balancer, Cloud Armor, Apigee API Gateway, and FHIR Gateway.
*   **Milestone 8:** Launch Patient App, Provider Dashboard, and the HITL Summary Editor dashboard.

---

## 2. Detailed Sprint-Wise Task Breakdown

### 2.1 Sprint 1 & 2: Blockchain Cryptographic Foundation (Weeks 1–4)
*   **Task 1:** Initialize Hardhat project. Write [HelioIntegrityRegistry.sol](file:///d:/projects/Helio/contracts/HelioIntegrityRegistry.sol).
*   **Task 2:** Setup Mocha/Chai test suites for access validations and temporal consent checks.
*   **Task 3:** Spin up Hyperledger Besu consortium node network.

### 2.2 Sprint 3 & 4: Interoperability & PII Scrubber (Weeks 5–8)
*   **Task 4:** Build local python [mcp_server.py](file:///d:/projects/Helio/mcp_server/mcp_server.py).
*   **Task 5:** Map database files to HL7 FHIR schemas.
*   **Task 6:** Create the Gemma PII Scrubber vLLM Docker container; deploy on GPU-enabled Cloud Run.

### 2.3 Sprint 5 & 6: Coordinated Swarm & AI Orchestration (Weeks 9–12)
*   **Task 7:** Write the specialized agents (Timeline, Medication, Allergy, Risk) using the Google ADK.
*   **Task 8:** Configure the Clinical Coordinator and Antigravity Orchestrator runtime handlers.
*   **Task 9:** Connect the Medical Summary Agent (Gemini 2.5) with page-level citations.

### 2.4 Sprint 7 & 8: Frontends, Edge Gateways, & Staging (Weeks 13–16)
*   **Task 10:** Build Next.js Provider Dashboard and Patient React Native App.
*   **Task 11:** Implement the Next.js HITL Dashboard Editor with Feedback APIs.
*   **Task 12:** Configure Cloud Armor, Global Load Balancer, Apigee Gateway, and Cloud Build CI/CD pipelines.

---

## 3. Git Branching & CI/CD Pipeline Strategy

### 3.1 Git Branching Model
We use a GitFlow branching model:
*   `main`: Production deployments.
*   `release/*`: Staging releases and audits.
*   `develop`: Integration branch for sprints.
*   `feature/*`: Individual developer tasks (e.g. `feature/mcp-server`).
*   `hotfix/*`: Emergency patches.

### 3.2 CI/CD Pipeline Flow (Cloud Build)
```
[Git Push to develop] ──► [Cloud Build Pipeline] ──► [ESLint & Pytest Tests]
                                                               │
                                                               ▼ (If Passed)
[Staging Deploy] ◄── [Vulnerability Scanner] ◄── [Docker Build & Push]
```

1.  **Trigger:** Developer pushes code to `develop` or merges a PR.
2.  **Lint & Test:** Cloud Build executes Node lints and Python Pytests.
3.  **Build Container:** Builds microservice Docker images (Orchestrator, Gemma Scrubber, MCP Server).
4.  **Vulnerability Scan:** Runs GCP Container Analysis vulnerability scan.
5.  **Artifact Push:** Pushes secure images to Artifact Registry.
6.  **Deploy Run:** Deploys services to staging Cloud Run instances behind the load balancer.

---

## 4. Testing & Verification Strategy

### 4.1 Unit & Integration Testing
*   **Solidity Contracts:** Evaluated using Hardhat Ethers and Chai assert test suites.
*   **MCP Server & PII Scrubber:** Tested locally using PyTest with mock database folders.

### 4.2 Load & Concurrency Testing
*   **Locust Script:** Simulates 1,000 concurrent clinicians requesting summaries within a 1-second window. Target metric: 95th percentile latency must remain under 3.0 seconds.

### 4.3 Audits & Security Controls
*   **HIPAA Audit:** Verify that no unmasked PHI ever passes from the local network to cloud generative endpoints.
*   **Blockchain Security:** Audit smart contract methods for reentrancy and access check exploits.
