# 09 — HELIO LIVE DEMO RUNBOOK

This document provides the definitive step-by-step demonstration runbook for showcasing the Helio AI platform to judges, evaluators, and hospital executives.

---

## 🌐 Production Environment Access
* **Live Website URL:** [https://helio-client-dashboard.onrender.com](https://helio-client-dashboard.onrender.com)
* **Patient Demo Credentials:** `Username: julian` | `Password: vance`
* **Clinician Demo Credentials:** `Clinician ID: evelyn` | `Password: harper`
* **Default Query Parameters:** `Patient ID: patient-123` | `Provider: 0x9876543210abcdef9876543210abcdef98765432` | `Key: helio-test-key`

---

## 🎬 The Primary 2-Minute Judge Demo Sequence

```
[ 1. Home Page ] ──► [ 2. Patient Portal ] ──► Revoke Consent (Red)
                                                       │
                                                       ▼
[ 4. Patient Portal ] ◄── Access Denied Block ◄── [ 3. Clinician Console ]
        │
        ▼ Grant Consent (Green)
[ 5. Clinician Console ] ──► Query Summary ──► [ 6. Brief + 4 Agent Cards ]
                                                       │
                                                       ▼
[ 8. Telemetry Dashboard ] ◄── Save & Audit ◄── [ 7. HITL Markdown Editor ]
- Blockchain Mining Blocks
- PII Masking Console
- BigQuery Audit Stream
```

---

### Step-by-Step Demonstration Actions

| Step # | Screen / Route | Clinician/Presenter Action | Expected Visual Result | Technical Concept Proven | Judge Takeaway |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | **Home Page** (`/`) | Navigate to root URL and highlight the 3 architecture cards. | Glassmorphism cards animate with Outfit typography. | Decentralized Trust, Local Privacy, and Multi-Agent RAG. | Helio is an enterprise clinical architecture, not a chatbot. |
| **2** | **Patient Portal** (`login_patient`) | Log in as `julian`/`vance`. Click green "Granted" button. | Button turns **Red ("Revoked")**. Click **Log Out**. | Dynamic smart contract consent state toggling on Besu. | Patient has absolute self-sovereignty over medical data. |
| **3** | **Clinician Console** (`login_doctor`) | Log in as `evelyn`/`harper`. Click **Query Patient Summary**. | Red security banner appears: **"Query Blocked by Edge Security - Access Denied"**. | Atomic Three-Factor Authorization at the Apigee Gateway. | Unauthorized doctors are blocked at the edge before data retrieval. |
| **4** | **Patient Portal** (`login_patient`) | Re-login as `julian`/`vance`. Click red button to toggle back to **Granted (Green)**. | Button turns **Green ("Granted")**. Click **Log Out**. | Real-time state reconciliation on the blockchain ledger. | Consent updates take effect immediately without database sync delays. |
| **5** | **Clinician Console** (`login_doctor`) | Re-login as `evelyn`/`harper`. Click **Query Patient Summary**. | Synthesized Markdown clinical briefing renders in under 1.5s. | End-to-end multi-agent orchestration and Gemini 2.5 synthesis. | Fast, citation-anchored medical history generated in real time. |
| **6** | **Specialized Widgets** | Scroll down to the 4 agent cards below the summary. | 4 cards render: **Timeline**, **Allergy (Penicillin)**, **Meds**, and **Risk (Oncology)**. | Google Antigravity parallel swarm execution (`asyncio.gather`). | Division of labor eliminates hallucination of critical allergies. |
| **7** | **HITL Editor** | Click **HITL Verification Editor** tab. Modify text and click 5 gold stars. | Text area allows live Markdown edits. Click **Save Summary & Audit**. Green confirmation banner displays. | Human-In-The-Loop (HITL) physician governance and BigQuery streaming. | Physician retains final diagnostic control ("AI proposes; doctor disposes"). |
| **8** | **Telemetry Panel** (`system_ops`) | Click **Telemetry Panel** in the top navigation bar. | Terminal streams live Besu blocks; center panel shows Raw vs. Gemma-Masked PHI; right panel shows BigQuery log. | Live SRE observability, local PII boundary, and immutable non-repudiation. | Complete HIPAA audit preparedness and enterprise transparency. |

---

## 🎯 Targeted Feature Proof Routes

1. **To Prove Blockchain Non-Repudiation:** Show `system_ops` left panel $\rightarrow$ Live Besu block production at $0.00 Gwei gas cost.
2. **To Prove Zero-Cloud-Leak HIPAA Privacy:** Show `system_ops` center panel $\rightarrow$ Raw `Julian Vance` transformed to `[PATIENT_NAME]` on-premise.
3. **To Prove Token Cost Optimization:** Explain how 15,000 raw EHR tokens are reduced to 1,800 tokens before Gemini 2.5 synthesis, cutting costs by 94.6%.
