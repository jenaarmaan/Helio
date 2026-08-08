# 05 — HELIO BLOCKCHAIN & DECENTRALIZED CONSENT

This document details the blockchain architecture, cryptographic consent management, document integrity anchoring, and consortium governance of Helio AI.

---

## 1. Why Blockchain? (The Multi-Hospital Consortium Problem)

Conventional centralized databases (PostgreSQL/MySQL) fail in multi-hospital healthcare environments due to three foundational flaws:
1. **The Trust Dilemma:** Competing hospital networks (e.g. Apollo, Fortis, Mayo Clinic) will not permit competitors or third-party brokers to maintain write access over their private databases.
2. **The DBA Tampering Risk:** In centralized databases, database administrators (DBAs) or privileged users can execute `UPDATE consent SET allowed=true` retroactively during a medical malpractice lawsuit, destroying non-repudiation.
3. **Data Siloing:** Patient consent is fragmented across dozens of proprietary hospital portals rather than belonging to the patient as a self-sovereign entity.

**The Helio Solution:** A **Private Federated Consortium Blockchain** provides a neutral, immutable, shared source of truth where access policies and document integrity checksums are cryptographically enforced across all healthcare institutions.

---

## 2. Federated Consortium Architecture (Hyperledger Besu / Kaleido)

```
[ Hospital Network A Node ] ──┐
                              │
[ Hospital Network B Node ] ──┼──► [ IBFT 2.0 Consensus Engine ] ──► [ Shared State Registry ]
                              │    - 1-second block times           - HelioIntegrityRegistry.sol
[ State Health Registry ]   ──┤    - Zero gas costs ($0.00)         - 2,500+ TPS per subnet
                              │    - Tolerates 1/3 node failure
[ Diagnostic Imaging Lab ]  ──┘
```

* **Consortium Participants:** Validator nodes are operated by participating hospital networks, state health registries, and accredited diagnostic networks.
* **Consensus Mechanism:** **Proof-of-Authority (PoA) via IBFT 2.0**, requiring $2F+1$ active nodes. If 1 validator goes offline, block production and verification continue uninterrupted.
* **Zero Gas Fees:** Consortium nodes validate transactions without volatile public gas fees, ensuring **$0.00 cost per transaction** for hospitals and patients.

---

## 3. What is Stored vs. NOT Stored On-Chain

```
┌──────────────────────────────────────────┬──────────────────────────────────────────┐
│          STORED ON-CHAIN (32 Bytes)      │        NEVER STORED ON-CHAIN (0 Bytes)   │
├──────────────────────────────────────────┼──────────────────────────────────────────┤
│ ✅ 32-Byte Document Checksums (docHash)   │ ❌ Medical Records / PDFs / JSON Files   │
│ ✅ Boolean Consent Flags (allowed)       │ ❌ Patient Names / Personal Identifiers  │
│ ✅ Temporal Expiration Timestamps        │ ❌ Clinical Diagnoses & Lab Values       │
│ ✅ Clinician Ethereum Addresses          │ ❌ Radiology / DICOM Medical Images      │
│ ✅ Emergency Access Event Signatures     │ ❌ Any Protected Health Information (PHI)│
└──────────────────────────────────────────┴──────────────────────────────────────────┘
```

* **Storage Footprint:** 1 Million active patient consent mappings occupy **less than 64 Megabytes** of on-chain state, eliminating blockchain bloat.

---

## 4. Smart Contract Architecture ([HelioIntegrityRegistry.sol](file:///d:/projects/Helio/contracts/HelioIntegrityRegistry.sol))

```solidity
// Core On-Chain Data Structures
struct ConsentRule {
    bool allowed;
    uint256 expiry;
}

// Patient ID => Doctor Address => Consent
mapping(string => mapping(address => ConsentRule)) public consentRegistry;

// Patient ID => Document ID => SHA-256 Hash
mapping(string => mapping(string => bytes32)) public documentRegistry;
```

### Key Contract Functions:
1. `setConsent(string patientId, address provider, bool allowed, uint256 duration)`: Patient configures provider permissions and temporal limit.
2. `checkConsent(string patientId, address provider)`: Intercepted by Edge Gateway at query time; returns boolean authorization.
3. `registerDocHash(string patientId, string docId, bytes32 docHash)`: Records cryptographic checksum of raw EHR file.
4. `checkDocHash(string patientId, string docId)`: MCP server verifies retrieved file matches on-chain hash commitment.

---

## 5. Account Abstraction & Zero-Crypto UX

* **No Seed Phrases:** Patients and physicians never manage raw 12-word recovery phrases or private keys.
* **Passkeys & WebAuthn (ERC-4337):** Users authenticate via **Google Cloud Identity / FaceID / Biometrics**, while underlying smart accounts manage cryptographic signatures seamlessly behind the scenes.
* **Social Recovery Guardians:** Account recovery is governed by multi-party consensus between the patient's verified email, the health system, and a designated family proxy.

---

## 6. Upgradability & State Pruning

* **ERC-1967 Transparent Upgradeable Proxy Pattern:** Smart contract logic is decoupled into Proxy and Implementation contracts, allowing contract improvements without losing historical state.
* **State Pruning & Merkle Epoch Archival:** Expired temporal rules are automatically cleared from active storage slots. Historical commitments are snapshotted annually into Merkle roots stored in decentralized cold storage (IPFS/Filecoin), keeping active node state under **5 Gigabytes**.
