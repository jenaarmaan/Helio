# Provisional Patent Application Draft

## 1. Title of Invention
DECENTRALIZED AGENTIC CLINICAL INTELLIGENCE ARCHITECTURE WITH CRYPTOGRAPHIC RECORD INTEGRITY AND LOCAL PRIVACY-PRESERVING PILES

---

## 2. Field of Invention
This invention relates generally to computerized medical record systems and artificial intelligence architectures. More particularly, the invention relates to a system and method for secure, patient-consented medical record retrieval, local PII scrubbing using lightweight open models, multi-agent clinical coordination, and cryptographic document validation using private blockchain consortium ledgers.

---

## 3. Background of the Invention
Modern healthcare systems rely on electronic health records (EHR) hosted in centralized and fragmented databases. Accessing these records across hospital networks is slowed by manual consent workflows and lack of standard database integrations. 

Furthermore, clinical large language model (LLM) assistant systems raise three critical security and operational concerns:
1.  **Patient Privacy Violations:** Sending raw Protected Health Information (PHI) containing personal identifiers (names, SSNs, phone numbers) to cloud-based external APIs violates HIPAA and GDPR.
2.  **Lack of Document Integrity Checks:** Centralized databases are vulnerable to unauthorized document modification. A modified record (e.g. altering active drug lists or allergy profiles post-signature) will be processed by clinical AI tools without trigger warnings.
3.  **Hallucination Risks:** General-purpose AI summarization tools lack grounding and often hallucinate clinical conclusions, posing clinical safety risks.

There exists a critical need for an architecture that combines decentralized consent enforcement, local cryptographic document integrity checks, local PII scrubbing before external processing, and a multi-agent planning swarm to ensure grounded clinical summaries.

---

## 4. Summary of the Invention
The present invention is an agentic clinical intelligence architecture that enforces patient privacy and cryptographic document validation in a single pipeline. The system comprises:
1.  **A Local Model Context Protocol (MCP) Server:** Integrates with local databases, retrieves EHR data, converts them to HL7 FHIR formats, and computes SHA-256 file checksums.
2.  **A Private Blockchain Consensus Ledger (Hyperledger Besu):** Stores patient consent rules and cryptographic file hashes. A gateway interceptor queries the ledger to confirm consent and document validity before records are released.
3.  **A Local Gemma PII Scrubber (vLLM):** A local containerized model running on GPU resources inside the hospital firewall. It scrubs all personal patient identifiers from retrieved records.
4.  **An Agentic RAG Pipeline (Google ADK & Antigravity Framework):** Coordinates a multi-agent planning swarm (**Timeline Agent, Medication Agent, Allergy Agent, Risk Agent**) via a **Clinical Coordinator** to construct a clinical bundle. A **Medical Summary Agent (Gemini 2.5)** generates the final summary with page-level citations.
5.  **A Human-In-The-Loop (HITL) Dashboard:** Renders the summary, enabling the doctor to review, edit, and submit feedback.

---

## 5. Detailed Description of the Invention

### 5.1 System Architecture & Data Flow Pipeline

```
[Patient Mobile App] ────► Register Consent ────► [Consortium Blockchain]
                                                           ▲
                                                           │ (verifyConsent & verifyHash)
[EHR Data Store] ──► [MCP Server] ──► [PII Scrubber] ──────┴──► [Specialized Swarm] ──► [HITL Dashboard]
```

1.  **Consent Anchoring:** The patient registers consent records on-chain via the Patient Mobile App.
2.  **Request Ingress:** A clinician requests a chart summary. Traffic passes through a Global Load Balancer, Cloud Armor, and Apigee Gateway. Apigee checks patient consent on-chain.
3.  **Record Retrieval & Hashing:** The AI Orchestrator triggers the Antigravity Orchestrator. The Retrieval Agent calls the local MCP Server to pull documents. The MCP Server calculates the document's SHA-256 hash and validates it against the blockchain registry.
4.  **PII Scrubbing:** The verified raw text is passed to the local Gemma PII Scrubber (vLLM GPU container), which scrubs all HIPAA Safe Harbor identifiers.
5.  **Multi-Agent Coordination Swarm:** The Clinical Coordinator coordinates specialized agents (Timeline, Medication, Allergy, Risk agents) using the Antigravity Framework to compile reports into a clinical bundle.
6.  **Summarization & HITL Review:** The Medical Summary Agent (Gemini 2.5) compiles the clinical bundle and scrubbed records into a markdown summary. The summary is displayed on the HITL Dashboard, where the clinician can verify and edit it.

---

## 6. Claims

**We Claim:**

1.  A system for secure, privacy-preserving clinical record retrieval and summarization, comprising:
    *   an edge security gateway configured to receive clinical query requests and check patient consent rules;
    *   a private blockchain ledger storing patient consent records and document cryptographic hashes;
    *   a local translation server configured to retrieve clinical documents, format them to a standardized structure, and compute document cryptographic checksums;
    *   a local PII scrubbing microservice executing a containerized open large language model on a graphics processing unit (GPU) inside a private hospital network to strip personal identifiers from the documents;
    *   an agent runtime orchestrator configured to initialize and manage specialized clinical analysis agents;
    *   a clinical coordinator agent configured to compile specialized agent reports into a clinical bundle; and
    *   a medical summary agent configured to generate a cited clinical summary from said clinical bundle and scrubbed documents.

2.  The system of claim 1, wherein the local translation server utilizes the Model Context Protocol (MCP) to read data and returns HL7 FHIR-compliant JSON objects.

3.  The system of claim 1, wherein the blockchain ledger comprises a private Proof-of-Authority Hyperledger Besu blockchain network.

4.  The system of claim 1, wherein the local PII scrubbing microservice uses a Gemma model run on a vLLM inference engine to strip patient identifiers before sending data to the medical summary agent.

5.  The system of claim 1, wherein the agent runtime orchestrator coordinates a Timeline Agent, a Medication Agent, an Allergy Agent, and a Risk Agent in parallel.

6.  The system of claim 1, further comprising a Human-In-The-Loop (HITL) dashboard that allows doctors to edit, verify, and submit feedback on the generated clinical summary.

---

## 7. Novelty, Inventive Step, & Industrial Applicability

### 7.1 Novelty
The combination of a private blockchain registry for consent validation, a local MCP server for document hashing, a local GPU-accelerated Gemma PII scrubber, and a coordinated multi-agent planning swarm represents a novel and secure approach to clinical RAG.

### 7.2 Inventive Step
By performing PII scrubbing and hash integrity checking locally prior to external summarization, the system solves the HIPAA compliance and database tampering issues of cloud-based clinical AI tools without adding database overhead.

### 7.3 Industrial Applicability
This invention can be deployed across hospitals, clinics, and clinical trial networks, and can be integrated into legacy EHR screens (Epic, Cerner).
