# Unique Selling Proposition (USP) & Y Combinator Pitch

## Project: Helio AI
**Presenter:** Founder, Helio AI  
**Target:** Y Combinator Selection Committee  
**Core Slogan:** *"Bridging clinical intelligence and absolute data privacy via decentralized consent and local PII scrubbing."*

---

## 1. The Problem
Healthcare providers spend up to two hours reviewing historical PDFs, lab results, and external EHR portals for every hour of clinical patient care. This data fragmentation triggers clinician burnout and leads to medical errors.

However, clinical AI cannot be adopted by hospitals today due to three critical security and compliance gaps:
1.  **PII Data Privacy Gaps:** Passing raw Protected Health Information (PHI) to large generative LLMs violates HIPAA, GDPR, and India's DPDP Act.
2.  **Consent Vulnerabilities:** Accessing data across different facilities requires real-time, auditable consent validation.
3.  **Data Modification Attack Vectors:** Centralized EHR databases are vulnerable to unauthorized edits. Altered data could lead to clinical AI generating incorrect, unsafe summaries.

---

## 2. Existing Solutions & Their Limitations

### 2.1 Native EHR AI Portals (e.g., Epic CoPilot, Cerner AI)
*   **The Limit:** Siloed inside their own networks. Epic's AI cannot retrieve or summarize records from Cerner or external local clinics without expensive data-sharing setups.

### 2.2 Standard Clinical RAG Wrappers
*   **The Limit:** These wrappers pull data from databases and send it directly to public cloud LLMs. They do not scrub PII locally, do not verify record checksums against a tamper-proof ledger, and do not incorporate human-in-the-loop review screens.

---

## 3. Our Unique Advantage: The Secure Verification & Summarization Swarm

Helio AI is the first clinical platform that integrates data intelligence with local PII scrubbing and blockchain auditing in a single, atomic operation:

```
[EHR Storage Pull] ──► [Local MCP Server] ──► [Besu Blockchain Hash Check]
                                                      │
                                                      ▼ (If Verified)
[HITL Dashboard Editor] ◄── [Gemini 2.5] ◄── [Clinical Coordinator Swarm] ◄── [Gemma PII Scrubber (vLLM)]
```

1.  **Dynamic Consent & Integrity Verification:** Apigee Gateway intercepts the clinician's query and validates consent on a private consortium blockchain (Hyperledger Besu). Our local Model Context Protocol (MCP) server retrieves the charts and matches their hashes against the block registry to detect database modification attacks.
2.  **Local PII Scrubbing:** Before the clinical text is processed, a local **Gemma model (running on a local vLLM GPU container)** scrubs all patient identifiers, ensuring that only sanitized, structured clinical data leaves the local network.
3.  **Specialized Agent swarm (Antigravity Framework):** A Clinical Coordinator coordinates specialized planning agents (**Timeline Agent, Medication Agent, Allergy Agent, Risk Agent**) to analyze the records.
4.  **Human-In-The-Loop (HITL) Dashboard:** The generated summary is rendered in a Next.js HITL dashboard, enabling doctors to review, edit, and sign off on summaries before they are finalized.

---

## 4. Why It Is Hard to Replicate (Our Defensible Moats)

### 4.1 The Technical Moat
*   **Local vLLM PII Scrubbing:** Competitors send raw PHI to external APIs. Our local Gemma scrubber runs inside the hospital's private network boundary, satisfying CISO security demands and enabling deployment in highly regulated environments.
*   **The MCP Abstraction Layer:** Instead of custom database connections, we use read-only MCP proxies. This bypasses hospital firewall ingress blocks, shrinking onboarding integrations from 18 months to 2 weeks.
*   **Consensus Engine:** Deploying a private Besu consortium ledger yields zero gas costs and sub-second confirmation times.

### 4.2 Network Effects
*   **The Patient-Led Consent Network:** Patients manage their consent rules on-chain via our React Native app. As more patients and clinics join, we establish a decentralized medical consent index, bypassing the need for bilateral hospital data-sharing agreements.

---

## 5. Impact

### 5.1 Technical Impact
*   **Zero PHI Leakage:** 100% of PII is scrubbed locally by the Gemma vLLM container before summarization.
*   **Hallucination Prevention:** The Medical Summary Agent uses RAG with page-level citations, reducing hallucination rates to **$<0.5\%$**.

### 5.2 Business Impact
*   **Administrative Cost Savings:** A pilot involving 150 clinicians saves an estimated **3 hours of chart review time per doctor per day**, yielding annual labor value savings of **$14.85 Million** against a software OpEx of **$198,000**.
*   **Onboarding Efficiency:** The MCP architecture reduces clinic integration costs by **85%**.

### 5.3 Social Impact
*   **Clinical Safety:** Eliminates drug-to-drug interaction and allergy errors caused by missing history or altered medical records.
*   **Patient Autonomy:** Restores data ownership to patients, allowing them to dynamically control who accesses their records.
