# 11 — HELIO BUSINESS, COMPETITION & GO-TO-MARKET

This document details the business model, unit economics, competitive landscape, commercial pricing streams, and go-to-market strategy of Helio AI.

---

## 1. Business Problem vs. Helio Solution Mapping

| Hospital Business Problem | Industry Impact | Helio Architectural Solution | Commercial Value Created |
| :--- | :--- | :--- | :--- |
| **1. Physician Chart Review Overhead** | Doctors spend 2+ hrs/day reading 50-page charts; severe clinician burnout. | Parallel Antigravity Agent Swarms condense charts into 30s briefs. | **Saves 2 hours / doctor / day**; increases patient throughput by 20%. |
| **2. Public Cloud PHI Leaks & HIPAA Fines**| HIPAA penalties up to \$1.9M per leak; hospitals fear public cloud LLMs. | Local on-premise Gemma 2 PII scrubber strips all 18 identifiers behind firewall.| **100% Zero-Leak HIPAA Compliance**; unblocks compliance approval. |
| **3. Malpractice Lawsuit Liability** | Retrospective chart alteration claims cost hospitals millions in litigation. | Cryptographic SHA-256 document hashing & Besu blockchain non-repudiation.| **Irrefutable Legal Audit Trail**; cuts malpractice discovery costs by 90%. |
| **4. Exorbitant Cloud AI OpEx** | Sending 15k raw tokens costs \$0.06/query (\$60k/mo at 1M queries). | Local MCP + agent distillation creates an 1,800-token prompt bundle.| **94.6% API Cost Reduction** (\$0.0032 / query). |
| **5. EHR Vendor Lock-in** | Epic Cosmos & Cerner block cross-system interoperability. | Open MCP translation proxies connect in-place with zero database migration.| **EHR-Agnostic Interoperability**; deploys in under 5 business days. |

---

## 2. Commercial Revenue Model & Unit Economics

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                HELIO UNIT ECONOMICS                                    │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  Selling Price / Query:               $0.0200                                          │
│  Cost of Goods Sold (COGS) / Query:   $0.0032 (Gemini 2.5 Flash 1,800 tokens)          │
│  Gross Profit Margin:                 84.0%                                            │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### The 4 Commercial Revenue Streams:
1. **B2B Clinician Seat SaaS (Primary):** **\$199 / clinician / month** (billed annually) for hospital health systems (\$120,000 – \$500,000 ACV).
2. **Usage-Based Gateway API (Pay-as-you-Go):** **\$0.02 per summarized chart** for outpatient clinics, diagnostic centers, and telemedicine platforms.
3. **Consortium Validator Node Licensing:** **\$50,000 one-time setup + \$20,000/yr maintenance** per Hyperledger Besu validator node for state health authorities and hospital groups.
4. **Consented Clinical Trial Discovery Exchange:** **\$10 – \$35 per verified, cryptographically consented patient record match** paid by pharmaceutical CROs.

---

## 3. Competitive Breakdown: Top 6 Competitors

```
                      ┌───────────────────────────────────────────┐
                      │             COMPETITIVE LANDSCAPE         │
                      └─────────────────────┬─────────────────────┘
                                            │
         ┌───────────────────┬──────────────┴──────────────┬───────────────────┐
         ▼                   ▼                             ▼                   ▼
┌──────────────────┐┌──────────────────┐          ┌──────────────────┐┌──────────────────┐
│ 1. Nuance DAX    ││ 2. Abridge       │          │ 3. Epic Cosmos   ││ 4. Redox Engine  │
│ - Cloud voice AI ││ - Ambient audio  │          │ - Walled garden  ││ - Dumb pipe      │
│ - High OpEx ($300││ - Leaks PHI      │          │ - Epic-only lock ││ - No AI / Swarm  │
└──────────────────┘└──────────────────┘          └──────────────────┘└──────────────────┘
```

| Competitor | Category | Fatal Limitations | How Helio Wins |
| :--- | :--- | :--- | :--- |
| **Nuance DAX Copilot (Microsoft)** | Ambient Listening | Only summarizes live audio; cannot pull multi-hospital history; costs \$300–\$500/doctor/mo. | Helio aggregates **multi-hospital historical EHRs** with local PII scrubbing at 90% lower cost. |
| **Abridge** | Ambient Dictation | Uploads raw audio/text to cloud LLMs; lacks cryptographic non-repudiation in court. | Helio anchors **immutable SHA-256 hashes on Besu** and scrubs PHI locally before cloud API calls. |
| **Suki AI** | Voice EHR Assistant | Monolithic prompt pipeline frequently hallucinates on dense surgical/oncology charts. | Helio uses **4 parallel specialized agents** whose outputs are verified before synthesis. |
| **Epic Cosmos** | Native EHR Analytics | Walled garden—completely blocked if a patient visits Cerner or an independent clinic. | Helio is **100% EHR-Agnostic** via open MCP connectors and patient-controlled consent. |
| **Redox Engine** | Cloud Integration | "Dumb data pipe"—moves raw data without clinical AI summarization; high licensing fees. | Helio combines **interoperability with agentic intelligence**, delivering doctor-ready briefs. |
| **Particle Health** | Record Aggregator | Dumps unreadable 1,000-page XML files; vulnerable to vendor network cutoffs. | Helio **distills noisy records into a 30-second summary** secured by neutral smart contracts. |

---

## 4. The 6-Layer Competitive Moat

1. **Privacy Moat:** Local Gemma 2 scrubber enables instant hospital CISO/HIPAA compliance approval.
2. **Integrity Moat:** Blockchain document hash commitments provide legally binding malpractice defenses.
3. **Clinical Moat:** Mandatory physician HITL governance eliminates autonomous diagnostic liabilities.
4. **Interoperability Moat:** Open MCP adapters connect to legacy HL7 and modern FHIR in-place.
5. **Multi-Agent AI Moat:** Specialized division of labor eliminates hallucination of critical allergies/risks.
6. **Cost & Latency Moat:** Sub-1.4s response times and 94.6% lower token OpEx than monolithic cloud RAG.

---

## 5. Go-To-Market & Financial Roadmap (18-Month Target)

* **Months 1–4 (Beachhead Outpatient Clinics):** Deploy across 15 outpatient oncology & diagnostic imaging centers (30-day sales cycle via Edge Gateway API).
* **Months 5–8 (EHR App Marketplaces):** Publish Helio on the **Epic Connection Hub and Oracle Cerner App Store** for 1-click hospital IT provisioning.
* **Months 9–12 (Consortium Expansion):** Partner with state Health Information Exchanges (HIEs) to license consortium validator nodes.
* **Capital Requirement:** Raising **\$1.5M Seed Round** (45% Engineering, 30% Pilot Deployments, 15% SOC2/HIPAA Auditing, 10% Legal/Ops).
* **Target Milestone:** **\$1.8M ARR by Month 18** across 35 contracted healthcare institutions.
