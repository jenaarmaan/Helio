# 01 — HELIO CORE PROJECT OVERVIEW

## 1. Project Identity & Overview
* **Project Name:** Helio AI
* **Domain:** Decentralized AI-Driven Electronic Health Records (EHR) & Clinical Assistant Platform
* **One-Line Definition:** 
  > *"Helio is an enterprise decentralized clinical intelligence platform that combines a private blockchain consent ledger, local on-premise PII scrubbing (Gemma 2), and a parallel multi-agent swarm (Google Antigravity + Gemini 2.5) to deliver doctor-ready patient briefings in 1.4 seconds with zero cloud data leaks."*

---

## 2. The Healthcare Problem Helio Addresses
Modern healthcare suffers from three compounding, systemic crises:
1. **The Fragmented-Record Crisis:** A patient's medical history is scattered across disparate hospitals, outpatient clinics, surgical centers, and diagnostic labs. Data is locked inside competing, incompatible EHR vendors (Epic, Cerner, Meditech), fragmenting prescriptions, surgeries, allergy reports, laboratory results, diagnoses, and medication regimens.
2. **The Physician Information-Processing Burden:** Clinicians spend over **2 hours navigating EHR systems for every 1 hour of direct patient care**. When a patient arrives with a 50-page unstructured chart history, reviewing it manually under 15-minute appointment constraints leads to cognitive overload, physician burnout, and catastrophic diagnostic oversights.
3. **Trust, Consent & Cloud Privacy Leaks:** Patient consent registries are administrative and easily bypassed or tampered with. Transmitting raw Protected Health Information (PHI) to public cloud LLMs violates HIPAA/GDPR, creating multi-million-dollar liability risks for hospital networks.

---

## 3. The Complete Helio Solution
Helio AI is **not a chatbot** and **not simply "AI + Blockchain"**. 
* It is an **end-to-end clinical intelligence workflow** that transforms raw, multi-source, heterogeneous medical charts into verified, doctor-ready clinical summaries.
* **Why it is not a chatbot:** Chatbots generate ungrounded conversational text. Helio executes an asynchronous pipeline of deterministic parsers, local privacy scrubbers, parallel domain-specific agent extractors, and citation-anchored synthesizers.
* **Why it is not simply "AI + Blockchain":** Blockchain is used strictly as a **32-byte cryptographic integrity and consent ledger** (never storing medical files), while local GPU models (Gemma 2) and cloud reasoning engines (Gemini 2.5) handle privacy and intelligence respectively.

---

## 4. The Three Primary Actors & Their Roles

```
┌───────────────────────────┬───────────────────────────┬───────────────────────────┐
│        1. PATIENT         │       2. CLINICIAN        │  3. HEALTHCARE ORG (HIE)  │
│   (e.g., Julian Vance)    │  (e.g., Dr. Evelyn Harper)│   (Hospital / IT / CISO)  │
├───────────────────────────┼───────────────────────────┼───────────────────────────┤
│ - Grants/revokes consent  │ - Authenticates securely  │ - Runs private Besu node  │
│ - Sets temporal limits    │ - Queries patient history │ - Operates local MCP proxy│
│ - Views encrypted vault   │ - Reviews 4 agent cards   │ - Enforces local scrubber │
│ - Audits doctor access    │ - Edits brief in HITL     │ - Collects BigQuery audits│
└───────────────────────────┴───────────────────────────┴───────────────────────────┘
```

---

## 5. The Three Core Pillars & Conceptual Statements

1. **The Clinical Pillar:**
   * *Conceptual Statement:* **"AI Proposes; Physician Disposes."** Helio acts strictly as a Clinical Decision Support (CDS) engine with mandatory Human-In-The-Loop (HITL) verification, keeping the licensed physician in complete legal and diagnostic control.
2. **The Privacy Pillar:**
   * *Conceptual Statement:* **"Zero PHI Leaves the Hospital Firewall."** All 18 HIPAA personal identifiers are stripped locally inside the hospital network boundary on GPU-accelerated Gemma 2 instances before any external AI processing occurs.
3. **The Integrity Pillar:**
   * *Conceptual Statement:* **"Mathematical Non-Repudiation Across Institutions."** Cross-hospital consent policies and 32-byte document checksums are permanently anchored on a consortium blockchain, preventing retrospective record tampering.

---

## 6. Core Project Numbers & Metrics Matrix

| Metric / Dimension | Documented Value | Context & Status |
| :--- | :--- | :--- |
| **P95 Response Latency** | **< 1.4 Seconds (1.39s)** | Tested parallel async swarm vs. 13.1s sequential baseline |
| **Token Cost Reduction** | **94.6% Reduction** | $15,000\text{ raw tokens} \rightarrow 1,800\text{ prompt tokens}$ |
| **Cost Per Query** | **\$0.0600 $\rightarrow$ \$0.0032** | Direct API spend savings per summarized chart |
| **Swarm Architecture** | **4 Specialized Agents + 1 Coordinator** | Timeline, Medication, Allergy, Risk + Meta-Orchestrator |
| **On-Chain Document Hash** | **32 Bytes (`bytes32 docHash`)** | SHA-256 zero-bloat state commitment |
| **Emergency Break-Glass** | **2-Hour Read-Only Access** | Irrevocable blockchain event + compliance notification |
| **Local PHI Scrubbing** | **18 HIPAA Identifiers Masked** | Containerized Gemma 2 on hospital GPU nodes |
| **Physician Verification** | **100% Mandatory HITL Review** | Citation-anchored Markdown editor + BigQuery stream |

---

## 7. End-to-End High-Level Architecture

```
[ Patient Portal (Julian) ] ──► Grants Temporal Consent ──► [ Solidity Registry (Besu) ]
                                                                       ▲
                                                                       │ (1. Check Consent)
[ Clinician Console (Dr. Harper) ] ──► Query Summary ──► [ Edge Gateway (Apigee) ]
                                                                       │
                                                                       ▼ (2. Pull EHR)
                                                             [ Local MCP Server ]
                                                                       │ (3. Checksum Hash)
                                                                       ▼
                                                             [ Gemma PII Scrubber ]
                                                                       │ (4. Strip 18 Identifiers)
                                                                       ▼
                                                       [ Clinical Coordinator Swarm ]
                                                                       │
                                             ┌─────────────────┼─────────────────┐
                                             ▼                 ▼                 ▼
                                      [Timeline Agent]  [Allergy Agent]   [Risk Agent]
                                             │                 │                 │
                                             └─────────────────┼─────────────────┘
                                                               ▼ (5. 1,800-Token Bundle)
                                                       [ Gemini 2.5 Flash ]
                                                               │ (6. Citation Synthesis)
                                                               ▼
                                                  [ HITL Verification Editor ]
                                                               │ (7. Save & Attest)
                                                               ▼
                                                  [ BigQuery Non-Repudiation ]
```

---

## 8. The Project's Strongest One-Line Explanation
> *"Helio is the only clinical AI platform that combines **local zero-leak PII scrubbing**, a **decentralized blockchain consent ledger**, and **parallel multi-agent swarms** to deliver doctor-ready summaries in **1.4 seconds at 94.6% lower cost** than legacy cloud LLMs."*
