# 02 — HELIO PRODUCT, USER FEATURES & USER EXPERIENCE

This document provides the exhaustive specification for all **25 production features** across the four primary interfaces of the Helio AI platform.

---

## 🖥️ Interface 1: Global Landing Page (`home`)
* **URL:** `https://helio-client-dashboard.onrender.com` (or root route)
* **Target Audience:** Hospital Executives, Clinicians, Patients, General Visitors.

| Feature # | Feature Name | Purpose | User | What It Does | Where It Appears | What The User Sees | Supporting Component | Live Demo Status |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **F-01** | **Animated Hero Section** | Establish value proposition and mission. | All | Renders animated title, mission tagline, and quick-access gates. | Top of Home Page | Gradient header, pulsing status LED, primary CTA buttons. | React JSX + CSS Grid | 🟢 Live |
| **F-02** | **Decentralized Trust Showcase Card** | Explain blockchain consent mechanics. | Executives / SREs | Details Hyperledger Besu smart contract registry and non-repudiation. | Features Grid (Card 1) | Glassmorphism card with Web3 icon and technical summary. | Solidity Architecture Docs | 🟢 Live |
| **F-03** | **Local PII Privacy Card** | Explain zero-cloud-leak PHI scrubbing. | CISOs / Compliance | Details Gemma 2 vLLM on-premise privacy boundary. | Features Grid (Card 2) | Glassmorphism card highlighting 18 HIPAA identifier masking. | Gemma Scrubber Specs | 🟢 Live |
| **F-04** | **Agentic RAG Swarm Card** | Explain parallel specialized clinical AI. | Clinicians / IT | Details Antigravity swarm architecture (Timeline, Meds, Allergy, Risk). | Features Grid (Card 3) | Glassmorphism card explaining multi-agent token distillation. | Swarm Coordinator Docs | 🟢 Live |
| **F-05** | **Portal Access Gateways** | Provide direct navigation to portals. | Patients & Doctors | Routes user to `login_patient` or `login_doctor`. | Hero Action Row | "Patient Portal Access" & "Clinician Console" buttons. | React Router State | 🟢 Live |

---

## 👤 Interface 2: Patient Portal (`login_patient` $\rightarrow$ `patient_dashboard`)
* **Target Audience:** Patients (Julian Vance), Caregivers, Health Proxies.
* **Credentials:** `Username: julian` / `Password: vance`

| Feature # | Feature Name | Purpose | User | What It Does | Where It Appears | What The User Sees | Supporting Component | Live Demo Status |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **F-06** | **Patient Authentication Gateway** | Authenticate patient identity. | Patient | Validates credentials with error handling. | Patient Login Screen | Login card with Username/Password inputs and demo helper text. | Cloud Identity Auth Mock | 🟢 Live |
| **F-07** | **Live On-Chain Consent Manager** | Toggle provider access rights. | Patient | Toggles `true/false` access state for Dr. Evelyn Harper in real time. | Left Panel (Consent Registry) | Green "Granted" or Red "Revoked" interactive button. | Smart Contract State Mapper | 🟢 Live |
| **F-08** | **Temporal Access Selector** | Bound access duration. | Patient | Selects duration window: **1 Hour**, **24 Hours**, or **7 Days**. | Left Panel (Below toggles) | Dropdown selector setting expiration timestamps on-chain. | Solidity Expiry Timestamp | 🟢 Live |
| **F-09** | **Decrypted Patient Vault Explorer** | View verified patient profile. | Patient | Displays decrypted demographic records from the local EHR store. | Right Panel (Patient Vault) | Julian Vance, Male, DOB 1992-06-15, Address: 742 Evergreen Terr. | Local MCP Vault Data | 🟢 Live |
| **F-10** | **Blockchain Document Hash Registry** | Verify record integrity commitments. | Patient | Displays on-chain document hashes (`0xc9815885f...`) with status badges. | Right Panel (Record Hashes) | File names (`oncology-report-2024.json`) + 32-byte SHA-256 hash. | Besu Registry Contract | 🟢 Live |

---

## 🩺 Interface 3: Clinician Console (`login_doctor` $\rightarrow$ `doctor_dashboard`)
* **Target Audience:** Clinicians (Dr. Evelyn Harper), Oncologists, Nurses.
* **Credentials:** `Clinician ID: evelyn` / `Password: harper`

| Feature # | Feature Name | Purpose | User | What It Does | Where It Appears | What The User Sees | Supporting Component | Live Demo Status |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **F-11** | **Clinician Authentication** | Secure hospital login. | Clinician | Authenticates physician credentials. | Clinician Login Screen | Hospital portal login with badge indicators. | Role-Based Auth Mock | 🟢 Live |
| **F-12** | **Edge Query Parameter Form** | Configure target patient query. | Clinician | Inputs Patient ID (`patient-123`), Clinician Address, and API Key. | Left Sidebar | Pre-filled form with "Query Patient Summary" trigger button. | Ingress Parameter State | 🟢 Live |
| **F-13** | **Real-Time Edge Security Gating** | Enforce zero-trust consent. | Clinician | Intercepts query on-chain; blocks execution if consent is revoked. | Right Output Panel | Red warning banner: *"Query Blocked by Edge Security - Access Denied"*. | Apigee Edge Security | 🟢 Live |
| **F-14** | **Synthesized Markdown Briefing** | Deliver doctor-ready brief. | Clinician | Displays citation-anchored summary generated by Gemini 2.5. | Right Panel (Summary Tab) | Formatted Markdown brief with timeline, surgery, and risk sections. | Gemini 2.5 Flash Engine | 🟢 Live |
| **F-15** | **Timeline Agent Output Widget** | Show chronological history. | Clinician | Highlights extracted dates of diagnoses, surgeries, and admissions. | Below Summary (Card 1) | `1992-06-15: Born`, `2024-03-12: Lumpectomy performed`. | Timeline Agent Worker | 🟢 Live |
| **F-16** | **Allergy Agent Output Widget** | Highlight immune sensitivities. | Clinician | Displays active drug allergies and reaction severity. | Below Summary (Card 2) | `Penicillin allergy: Status Active, Criticality HIGH`. | Allergy Agent Worker | 🟢 Live |
| **F-17** | **Medication Agent Output Widget** | Review active prescriptions. | Clinician | Lists current prescription regimens, dosages, and cycles. | Below Summary (Card 3) | Prescription list review status and follow-up flags. | Medication Agent Worker | 🟢 Live |
| **F-18** | **Risk Agent Output Widget** | Highlight diagnostic alerts. | Clinician | Flags post-surgical oncology risks and follow-up schedules. | Below Summary (Card 4) | `HIGH RISK: Verify surgical margins & schedule mammogram`. | Risk Agent Worker | 🟢 Live |
| **F-19** | **Human-In-The-Loop (HITL) Editor**| Enable doctor note edits. | Clinician | Provides editable Markdown text area to review and modify AI notes. | Right Panel (HITL Tab) | Full-width text editor pre-loaded with generated brief. | HITL React Component | 🟢 Live |
| **F-20** | **5-Star Physician Rating** | Score AI quality for audits. | Clinician | Allows physician to click 1–5 stars to score summary accuracy. | HITL Tab Footer | Interactive gold star rating bar (`★ ★ ★ ★ ★`). | Telemetry Rating State | 🟢 Live |
| **F-21** | **Save Summary & Audit Trigger** | Commit attested note to log. | Clinician | Submits feedback to `/api/v1/clinical/feedback` and logs to BigQuery. | HITL Tab Footer | Green banner: *"Summary saved and audited to BigQuery successfully!"*. | BigQuery Log Ingestion | 🟢 Live |

---

## 📊 Interface 4: System Operations & Telemetry Panel (`system_ops`)
* **Target Audience:** SREs, DevOps Engineers, Hospital Compliance Officers, HIPAA Auditors.

| Feature # | Feature Name | Purpose | User | What It Does | Where It Appears | What The User Sees | Supporting Component | Live Demo Status |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **F-22** | **Consortium Node Block Monitor** | Monitor blockchain health. | SRE / DevOps | Displays simulated real-time block mining, gas cost, and event logs. | Left Column | Terminal window: `Block #140520 mined... Gas: 0.00 Gwei`. | Besu Node Telemetry | 🟢 Live |
| **F-23** | **PII Scrubber Telemetry Console** | Prove local HIPAA privacy. | Compliance / CISO| Shows side-by-side Raw EHR Input vs. Gemma-Masked Output. | Center Column | Red box (Raw PHI) vs. Green box (Masked `[PATIENT_NAME]` / `[DATE]`). | Local Gemma Scrubber | 🟢 Live |
| **F-24** | **BigQuery Non-Repudiation Audit Ledger** | Audit all system events. | Auditor / Legal | Streams live compliance entries (queries, allowed/blocked, doctor edits). | Right Column | Live audit feed cards with timestamps, status, and star ratings. | BigQuery Sink Stream | 🟢 Live |
| **F-25** | **Pulsing Status LEDs** | Visual operational health. | All | Real-time animated green indicators reflecting connected microservices. | Navbar & Card Headers | Glowing emerald LEDs pulsing at 1.5s intervals. | CSS Keyframe Engine | 🟢 Live |
