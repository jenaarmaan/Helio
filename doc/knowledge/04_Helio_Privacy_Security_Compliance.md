# 04 — HELIO PRIVACY, SECURITY & COMPLIANCE

This document details the defense-in-depth security, local privacy boundaries, cryptographic authorization, and regulatory compliance architecture of Helio AI.

---

## 1. Privacy, PII & PHI: The Hospital Edge Boundary

### Definition of PHI (Protected Health Information)
Under the **Health Insurance Portability and Accountability Act (HIPAA)**, Protected Health Information (PHI) is defined as any health or medical data combined with any of the **18 personal identifiers (PII)** that can identify an individual:

$$\mathbf{PHI} = \text{Personal Identity (PII)} + \text{Health / Medical Data}$$

### The 18 HIPAA Identifiers Scrubbed by Helio
1. Patient Names
2. Geographic data (addresses, cities, zip codes)
3. All dates (Date of Birth, admission, discharge, surgery)
4. Telephone numbers
5. Fax numbers
6. Email addresses
7. Social Security Numbers (SSNs)
8. Medical Record Numbers (MRNs / Patient IDs)
9. Health plan beneficiary numbers
10. Account numbers
11. Certificate / license numbers
12. Vehicle identifiers / license plates
13. Device identifiers & serial numbers
14. Web Universal Resource Locators (URLs)
15. Internet Protocol (IP) addresses
16. Biometric identifiers (fingerprints, retinal scans)
17. Full-face photographs
18. Any unique identifying number or characteristic

---

### Local Privacy Scrubber Architecture (Gemma 2 on vLLM)
* **The Raw PHI Boundary:** Raw medical records containing personal identifiers **never leave the hospital network perimeter**.
* **On-Premise Execution:** A containerized **Gemma 2 (2B/9B)** model runs locally behind the hospital firewall on dedicated GPU instances via `vLLM`.
* **Sanitization:** All 18 HIPAA identifiers are stripped and replaced with generic tokens (e.g. `Julian Vance` $\rightarrow$ `[PATIENT_NAME]`, `1992-06-15` $\rightarrow$ `[DATE]`).
* **External Transmission:** Only sanitized, de-identified clinical text is transmitted to external Gemini 2.5 APIs for final synthesis.

---

## 2. Three-Factor Authorization (3FA) & Consent Verification

Every clinical query must pass through a strict **Three-Factor Authorization** sequence at the Edge Gateway before any data retrieval begins:

```
[ Incoming Clinician Query ]
             │
             ▼
[ Factor 1: Apigee API Key ] ──► Validates authorized hospital network tenant
             │
             ▼
[ Factor 2: Clinician Web3 Signature ] ──► Verifies doctor's cryptographic identity
             │
             ▼
[ Factor 3: On-Chain Patient Consent ] ──► Checks active temporal consent on Besu
             │
     ┌───────┴───────┐
     ▼               ▼
[ Allowed: True ]  [ Allowed: False ] ──► 403 Forbidden: "Access Denied"
```

* **Atomic Verification:** Consent is verified both at **query ingress** and at **response delivery**, preventing race conditions if a patient revokes access mid-flight.
* **Temporal Authorization:** Patients configure expiration bounds (**1 Hour, 24 Hours, 7 Days**); expired permissions are automatically rejected by the Solidity smart contract.

---

## 3. Emergency Security: The Break-Glass Protocol

In unconscious trauma scenarios where a patient cannot grant consent:
1. **Emergency Authentication:** Licensed emergency physicians authenticate using biometric hospital credentials and trigger the `Break-Glass Emergency Mode`.
2. **On-Chain Commitment:** The smart contract emits an immutable, public event:
   ```solidity
   event EmergencyAccessTriggered(address indexed doctor, string patientId, uint256 timestamp);
   ```
3. **Time-Bound Ingress:** Edge Gateway grants temporary **2-Hour Read-Only Access** to critical records (blood type, active allergies, surgical histories).
4. **Post-Event Audit:** An automated high-priority alert is dispatched to the Hospital Compliance Officer, requiring signed clinical justification within 24 hours.

---

## 4. Advanced Security Architecture

### A. Prompt Injection Defense
* Raw clinical text is wrapped inside strict XML/JSON data boundaries by the MCP ingestion layer.
* Known prompt injection delimiter sequences (`###`, `SYSTEM:`, `[INST]`) are stripped deterministically before agent processing.
* Response structures are enforced via strict Pydantic schemas, neutralizing executable code injection.

### B. Smart Contract Hardening
* Built on audited **OpenZeppelin** libraries (`OwnableUpgradeable`, `ReentrancyGuardUpgradeable`).
* Continuous automated static analysis via **Slither** and **Mythril** testing for integer overflows, reentrancy attacks, and access control edge cases.
* 100% test coverage across Hardhat Mocha/Chai regression suites.

### C. Post-Quantum Cryptographic (PQC) Agility
* SHA-256 and Keccak-256 hash algorithms are mathematically resistant to quantum collision attacks.
* Upgradable smart contract proxies support NIST-standardized quantum-resistant signature algorithms (**CRYSTALS-Dilithium, Falcon**) for long-term cryptographic future-proofing.

---

## 5. Regulatory & Compliance Positioning

* **GDPR Article 17 (Right to be Forgotten):** Because only 32-byte document hashes reside on-chain (zero PHI), deleting the raw hospital record and shredding its Cloud KMS encryption key permanently severs the mathematical link, fulfilling GDPR and HIPAA data destruction mandates.
* **FDA 21st Century Cures Act Exemption (Section 3060):** Positioned as a **Non-Device Clinical Decision Support (CDS)** tool because it provides transparent, citation-anchored summaries and requires independent physician attestation prior to clinical action.
* **Pediatric & Dependent Governance:** Minor accounts (<18 years) are bound to legal guardian DIDs with multi-signature access controls.
