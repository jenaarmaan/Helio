# 03 — HELIO AI & AGENTIC ARCHITECTURE

This document details the multi-agent AI architecture of Helio AI, explaining the complete pathway from raw clinical records to verified, doctor-ready clinical briefings.

---

## 1. Why an Agentic Architecture? (Rejection of the Monolithic LLM)

Legacy healthcare AI systems attempt to pass entire 50-page unstructured clinical charts into a single monolithic LLM prompt. This approach fails in production due to three critical flaws:
1. **Context Saturation & Hallucination:** Single LLMs suffer from the "lost-in-the-middle" phenomenon, missing subtle drug interactions or surgical margins buried across thousands of lines of text.
2. **Exorbitant Token OpEx:** Passing 15,000 to 30,000 raw tokens per query directly to cloud APIs costs \$0.06 to \$0.12 per call, making enterprise scale financially unfeasible.
3. **Lack of Domain Specialization:** Clinical synthesis requires distinct cognitive tasks—chronological extraction, immunological safety checks, pharmacological interaction analysis, and oncological risk assessment.

**The Helio Solution:** Helio implements a **Hierarchical Multi-Agent Swarm** orchestrated by the **Google Antigravity Framework**. The problem is decomposed across 4 specialized worker agents operating concurrently, supervised by a Clinical Meta-Orchestrator.

---

## 2. Swarm Component Breakdown & Responsibilities

```
                         ┌───────────────────────────────────────────┐
                         │   Clinical Coordinator (Meta-Orchestrator)│
                         │   - Built on Google Antigravity Framework │
                         │   - Dispatches tasks via asyncio.gather   │
                         └─────────────────────┬─────────────────────┘
                                               │
             ┌─────────────────────┬───────────┴─────────┬─────────────────────┐
             ▼                     ▼                     ▼                     ▼
┌────────────────────────┐┌────────────────────────┐┌────────────────────────┐┌────────────────────────┐
│    Timeline Agent      ││     Allergy Agent      ││    Medication Agent    ││       Risk Agent       │
│ - Chronology specialist││ - Immunology specialist││ - Pharmacology spec.   ││ - Warning specialist   │
│ - Extracts dates & ops ││ - Severity & reactions ││ - Dosages & cycles     ││ - Margins & lab alerts │
└────────────────────────┘└────────────────────────┘└────────────────────────┘└────────────────────────┘
             │                     │                     │                     │
             └─────────────────────┼─────────────────────┼─────────────────────┘
                                   ▼
                         ┌───────────────────────────────────────────┐
                         │   Unified Prompt Bundle (< 1,800 tokens)  │
                         └─────────────────────┬─────────────────────┘
                                               ▼
                         ┌───────────────────────────────────────────┐
                         │   Gemini 2.5 Flash Synthesis Layer        │
                         │   - Citation-anchored Markdown Brief      │
                         └─────────────────────┬─────────────────────┘
                                               ▼
                         ┌───────────────────────────────────────────┐
                         │   Human-In-The-Loop (HITL) Doctor Review  │
                         └───────────────────────────────────────────┘
```

---

### Detailed Agent Specifications

| Agent Name | Source File | Core Task | Input Payload | Output Schema |
| :--- | :--- | :--- | :--- | :--- |
| **1. Clinical Coordinator (Leader)** | `swarm/clinical_coordinator.py` | **Meta-Orchestrator:** Dispatches parallel worker tasks, monitors timeout thresholds, and merges structured outputs into an 1,800-token prompt. | Scrubbed clinical text from Gemma PII scrubber. | Unified clinical prompt bundle for Gemini 2.5. |
| **2. Timeline Agent** | `swarm/specialized_agents.py` | **Chronology Specialist:** Scans records for dates of birth, hospital admissions, surgical procedures, and diagnostic milestones. | Sanitized clinical notes & encounter sections. | Chronologically ordered JSON array of `{date, event, type}`. |
| **3. Allergy Agent** | `swarm/specialized_agents.py` | **Immunology Specialist:** Identifies active substance sensitivities, drug classes, and reaction criticality. | Sanitized allergy & intolerance notes. | Structured list of `{allergen, status, criticality, reaction}`. |
| **4. Medication Agent** | `swarm/specialized_agents.py` | **Pharmacology Specialist:** Extracts active prescription regimens, dosages, treatment cycles, and discontinued drugs. | Sanitized medication & prescription notes. | Structured list of `{medication, dosage, frequency, status}`. |
| **5. Risk Agent** | `swarm/specialized_agents.py` | **Diagnostic Warning Specialist:** Detects high-risk diagnostic alerts, post-surgical oncology flags, and lab abnormalities. | Sanitized pathology & surgical notes. | Array of `{risk_level, category, alert_description, action}`. |

---

## 3. Asynchronous Parallel Execution (`asyncio.gather`)

In traditional sequential LLM pipelines, executing 4 reasoning steps takes $4 \times 1.5\text{s} = 6.0\text{ seconds}$. 

Helio executes all 4 agents **concurrently using non-blocking asynchronous coroutines** (`asyncio.gather`):

$$\text{Swarm Execution Time} = \max(T_{\text{timeline}}, T_{\text{allergy}}, T_{\text{medication}}, T_{\text{risk}}) \approx \mathbf{650ms}$$

Combined with local MCP caching and Gemini 2.5 synthesis, the end-to-end response time drops from **13.1 seconds to 1.39 seconds (P95)**.

---

## 4. Context Window Management & Token Economics

```
[ Raw Multi-Source Record ] ──► ~15,000 Tokens (Raw XML/JSON/PDF)
             │
             ▼ (Local MCP Ingestion & Gemma Scrubber - $0 Cloud Cost)
[ Filtered Semantic Chunks ] ──► Distributed across 4 parallel specialized agents
             │
             ▼ (Structured Agent Extractions)
[ Compact JSON Bundle ]     ──► ~1,800 Tokens (88% reduction in token weight)
             │
             ▼ (Gemini 2.5 Flash Synthesis)
[ Grounded Markdown Brief ] ──► ~350 Output Tokens (Total API Cost: $0.0032)
```

* **Recursive Map-Reduce:** The MCP server chunks large C-CDA XML/FHIR files into semantic sections (Encounters, Labs, Medications), routing only relevant sections to specific agents.
* **Cost Optimization:** Passing a structured 1,800-token prompt instead of a 15,000-token raw dump reduces cloud API spend by **94.6%** (\$0.0600 $\rightarrow$ \$0.0032 per query).

---

## 5. Inference Optimization & Serving Stack

1. **vLLM Continuous Batching:** The local Gemma 2 scrubber runs on containerized vLLM instances using **PagedAttention**, eliminating memory fragmentation and achieving **>150 tokens/second throughput**.
2. **Redis Semantic Caching:** Pre-computed embedding structures and active consent permissions are cached in-memory ($O(1)$ lookup, **<5ms response**).
3. **Server-Sent Events (SSE) Streaming:** Summarized Markdown tokens stream directly to the Clinician Console in real-time, achieving a First-Contentful-Paint (FCP) of **<300ms**.

---

## 6. Clinical Safety Boundaries & Hallucination Safeguards

* **Decision Support, Not an Autonomous Doctor:** Helio is explicitly engineered as a **Clinical Decision Support (CDS)** tool. It does not issue autonomous diagnoses or write prescriptions.
* **Citation Anchoring:** Every clinical claim produced by Gemini 2.5 includes explicit citation anchors referencing the source document sections.
* **Mandatory Physician Verification (HITL):** Notes cannot be committed to hospital records without the physician reviewing, editing, and clicking **Save Summary & Audit** in the HITL Editor.
