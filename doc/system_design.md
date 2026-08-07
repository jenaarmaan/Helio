# System Design & Pipeline Architecture: Helio AI

## Project: Helio AI
**Role:** Senior Software Architect (FAANG-level)  
**Date:** August 7, 2026  
**Status:** Approved Architecture Draft  

---

## 1. High-Level Features
1. **Dynamic Patient Consent Management:** Patient registers provider access controls directly onto a private consortium blockchain ledger.
2. **Cryptographic Record Verification:** Reads patient charts locally and verifies document SHA-256 hashes against blockchain records to ensure data integrity.
3. **Local PII Privacy Scrubbing:** Strips patient identifiers (PII/PHI) within the secure local hospital network boundary before cloud processing.
4. **Coordinated Swarm Planning:** Executes specialized AI agents (Allergy, Medication, Timeline, Risk) via the **Antigravity Framework**, compiling findings into a unified clinical bundle.
5. **Interactive Summary Editor:** Renders summaries on a **Human-In-The-Loop (HITL) Dashboard** with citations, enabling doctor review and feedback.

---

## 2. Module-Wise Component Breakdown

The architecture at [Helio architecture (3).png](file:///d:/projects/Helio/doc/Helio%20architecture%20(3).png) comprises several core layers:

```
[Ingress & Edge Security] ──► [AI Orchestrator Swarm] ──► [Data & Integrity Layer]
```

### 2.1 Ingress & Edge Security Layer
*   **Global Load Balancer & Cloud Armor:** Handles global entry traffic, edge SSL termination, and WAF protection against DDoS and OWASP Top 10 exploits.
*   **Helio API Gateway (Apigee):** Enforces rate limiting, validates credentials, and queries the Blockchain Service to confirm patient consent before forwarding requests.
*   **FHIR Gateway:** An interoperability gateway supporting FHIR R4, HL7, and SMART on FHIR specifications for external queries.

### 2.2 Collaborative Agent Swarm (Google ADK & Antigravity Framework)
*   **AI Orchestrator & Antigravity Orchestrator:** Manages the lifecycle, execution paths, and state variables of the agent runtimes.
*   **Retrieval Agent (MCP):** Connects to the local Model Context Protocol (MCP) Server to retrieve raw clinical records.
*   **Gemma PII Scrubber (vLLM):** Runs Gemma 2 (9B/27B) inside a GPU-accelerated Cloud Run instance (local network) to scrub personal patient identifiers from retrieved records.
*   **Clinical Coordinator Swarm:** Coordinates specialized analysis runtimes in parallel:
    *   *Timeline Agent:* Compiles chronological patient medical histories.
    *   *Medication Agent:* Identifies active drug profiles, dosage details, and potential interactions.
    *   *Allergy Agent:* Identifies and verifies patient allergy listings.
    *   *Risk Agent:* Detects potential clinical warning signs (red flags).
    *   *Clinical Coordinator:* Aggregates the specialized reports into a structured clinical bundle.
*   **Medical Summary Agent:** Processes the clinical bundle and scrubbed records to generate the final summarized markdown document.

### 2.3 Security, Trust & DevOps Layer
*   **Blockchain Service (Hyperledger Besu):** Runs a private consortium network validating record hashes (`verifyRecord`) and patient consent records (`checkConsent`).
*   **Cloud KMS & Secret Manager:** Encrypts data at rest (CMEK) and manages API keys and blockchain credentials.
*   **Cloud Pub/Sub & Dataflow:** Streams logging telemetry, audit trials, and performance metrics to BigQuery and Cloud Monitoring.

---

## 3. End-to-End Data Flow Pipeline

```mermaid
graph LR
    A[Provider Query] --> B[API Gateway]
    B -->|Consent Validated| C[AI Orchestrator]
    C -->|MCP Pull| D[Raw EHR Records]
    D -->|Integrity Verified| E[Gemma PII Scrubber]
    E -->|Cleaned Text| F[Clinical Coordinator Swarm]
    F -->|Analysis Bundle| G[Medical Summary Agent]
    G -->|Markdown Summary| H[HITL Doctor Dashboard]
```

1.  **Request Ingress:** A provider requests a chart summary. Apigee validates patient consent on the Hyperledger Besu registry.
2.  **Retrieval & Verification:** The Retrieval Agent queries the MCP Server. The MCP Server retrieves encrypted medical documents from GCS, calculates their SHA-256 hashes, and verifies them on-chain to detect tampering.
3.  **Local Scrubbing:** The verified raw records are passed to the Gemma PII Scrubber. The local model masks names, IDs, and other identifiers.
4.  **Multi-Agent Swarm Processing:** The Clinical Coordinator passes the scrubbed text to the Timeline, Medication, Allergy, and Risk agents in parallel. Their outputs are compiled into a unified clinical bundle.
5.  **Summarization & HITL Logging:** The Medical Summary Agent uses Gemini 2.5 to compile the bundle into a markdown summary. The summary is displayed on the HITL Dashboard, and audit logs are written to BigQuery.

---

## 4. API Request/Response Flow (Summarization Cycle)

### 4.1 Request Payload
*   **HTTP Method:** `POST`
*   **Endpoint:** `/api/v1/patient/summary`
*   **Headers:**
    *   `Content-Type: application/json`
    *   `Authorization: Bearer <JWT_TOKEN>`
*   **Body:**
```json
{
  "patientId": "patient-123",
  "providerAddress": "0x9876543210abcdef9876543210abcdef98765432",
  "options": {
    "forceRefresh": false,
    "detailLevel": "comprehensive"
  }
}
```

### 4.2 Response Payload
*   **Status Code:** `200 OK`
*   **Body:**
```json
{
  "status": "success",
  "patientId": "patient-123",
  "summaryId": "sum-777",
  "timestamp": "2026-08-07T14:31:00Z",
  "verification": {
    "integrityStatus": "verified",
    "blockNumber": 140234,
    "consentStatus": "authorized"
  },
  "summary": {
    "markdown": "# Clinical Summary: Patient 123\n\n## Chronology\n* **2024-03-12**: Diagnosed with Stage II breast cancer [Doc-999: Page 1].\n\n## Allergy Alerts\n* **Penicillin**: Active allergy, confirmed severity high [Doc-999: Page 1].",
    "citations": [
      {
        "docId": "doc-999",
        "docHash": "0xe29837a7b8e19c92b23a0781298ccb831fa8120b4119d80312cb89efb319aa28",
        "verified": true
      }
    ]
  }
}
```

---

## 5. Technology Stack Mapping

| Layer | Component | Technologies |
|---|---|---|
| **Client Interfaces** | Patient Mobile App | React Native, TypeScript, Google Cloud Identity |
| | Provider Dashboard | Next.js, Tailwind CSS, Vertex AI SDK |
| | HITL Dashboard | Next.js, HTML5 Editor, Feedback API |
| **Edge & Security** | Load Balancing & WAF | Cloud Load Balancer, Cloud Armor, Apigee API Gateway |
| | Interoperability | FHIR Gateway (Google Cloud Healthcare API) |
| **Agent Swarm** | Swarm Runtimes | Google ADK, Antigravity Framework, Python 3.11+, Cloud Run |
| | Local PII Scrubber | Gemma 2 (9B/27B) on vLLM (Cloud Run GPU instances) |
| | Data Connector | Model Context Protocol (MCP) Server |
| **Security & Trust** | Blockchain Registry | Hyperledger Besu (PoA), Web3.py, Solidity v0.8.20 |
| | Data Security | Cloud KMS, Secret Manager, Envelope Encryption |
| **Data & Storage** | Files & Vectors | Cloud Storage (EHR), Vertex AI Vector Search |
| | Database & Cache | PostgreSQL (Cloud SQL Postgres 15), Memorystore (Redis Cache) |
| **DevOps & Analytics**| Telemetry & CI/CD | Cloud Pub/Sub, Dataflow, Cloud Monitoring & Trace, BigQuery, Cloud Build |

---

## 6. Scalability, Fault Tolerance, & Security Considerations

### 6.1 Scalability
*   **Scale-to-Zero Run:** Agent microservices are deployed on Google Cloud Run, scaling down to zero when idle to minimize costs, and scaling up to handle traffic spikes.
*   **Vector Search Performance:** Vertex AI Vector Search utilizes Hierarchical Navigable Small World (HNSW) graphs, delivering sub-100ms vector query times under high concurrency.

### 6.2 Fault Tolerance
*   **Multi-Provider RPC Fallback:** The MCP Server is configured with a list of RPC endpoints. If one endpoint fails, it automatically falls back to alternative nodes.
*   **Gemma Scrubber Scaling:** The vLLM GPU containers auto-scale based on concurrency metrics to avoid queue blockages.

### 6.3 Security Considerations
*   **PII Separation:** The Gemma PII Scrubber runs locally, ensuring that raw medical records containing PHI are scrubbed before being sent to the Medical Summary Agent.
*   **VPC Service Controls:** Databases, vector indexes, and file stores are restricted inside a private Google Cloud VPC, denying access from outside public IPs.
