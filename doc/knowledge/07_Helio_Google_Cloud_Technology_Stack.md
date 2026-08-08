# 07 — HELIO GOOGLE CLOUD TECHNOLOGY STACK

This document details the Google Cloud Platform and Google DeepMind technologies integrated into the Helio AI platform.

---

## 1. Google Technology-to-Feature Mapping Matrix

| Google Technology | Helio Component | Architectural Purpose | User-Visible Feature | Performance / Security Role |
| :--- | :--- | :--- | :--- | :--- |
| **1. Gemini 2.5 (Flash/Pro)** | `Medical Summary Agent` | Synthesizes multi-agent structured reports into citation-anchored briefings. | Clinician Summary Markdown Brief | >100 tokens/sec generation with sub-500ms synthesis. |
| **2. Gemma 2 (2B/9B Instruct)**| `pii_scrubber.py` | Local on-premise model running via vLLM to scrub 18 HIPAA PII identifiers. | PII Scrubber Console (Green Box) | Zero-cloud-leak PHI boundary ($0 API cost). |
| **3. Google Antigravity Framework** | `clinical_coordinator.py` | Multi-agent runtime managing parallel execution and state across 4 worker agents. | 4 Specialized Agent Cards | Non-blocking async execution (`asyncio.gather`). |
| **4. Google Cloud Apigee** | `Edge Gateway Proxy` | Ingress gateway enforcing rate limits, OAuth2 tokens, and on-chain consent checks. | Red "Access Denied" Security Banner | Intercepts unauthorized clinician queries at the edge. |
| **5. Google Cloud Armor** | `Edge WAF & DDoS Shield`| Protects public API endpoints from DDoS floods and OWASP Top 10 vulnerabilities. | Global System Uptime Indicator | Enforces Anycast IP edge security and IP whitelisting. |
| **6. Google BigQuery** | `audit_logs.json / BigQuery Sink` | Petabyte-scale non-repudiation audit ledger recording consent checks and doctor edits. | BigQuery Audit Logs (Telemetry Panel)| Immutable, append-only compliance logs for HIPAA audits. |
| **7. Google Cloud Identity** | `Auth Gateways` | Enterprise identity management supporting WebAuthn and biometric Passkeys (FaceID).| Patient/Doctor Login Portals | Eliminates raw 12-word cryptocurrency seed phrases. |
| **8. Google Cloud KMS** | `Encrypted Vault Manager` | Manages Customer-Managed Encryption Keys (CMEK) for envelope encryption. | Registered Document Cryptographic Hashes| AES-256-GCM encryption for data at rest. |
| **9. Google Cloud Storage (GCS)**| `EHR Document Vault` | Object storage hosting encrypted clinical FHIR and C-CDA document blobs. | Patient Vault Record List | Generates temporary, signed URLs for local MCP reads. |
| **10. Cloud Run & GKE** | `Compute Infrastructure`| Serverless container hosting for FastAPI microservices and GPU nodes for vLLM. | Live Website Response Speed | Autoscales 0 to 1,000+ pods; manages NVIDIA L4 GPUs. |
| **11. Google Fonts (Outfit)** | `client/src/index.css` | Premium typography CDN providing modern Outfit and Inter fonts. | High-Aesthetic Glassmorphism UI | Fast CDN typography rendering. |

---

## 2. Infrastructure & Compute Interconnections

```
[ Ingress Traffic ] ──► [ Cloud Armor WAF ] ──► [ Apigee Gateway (Cloud Run) ]
                                                        │
                                                        ▼
[ Hospital Edge Intranet ] ──► [ GKE GPU Cluster (NVIDIA L4) ] ──► [ vLLM (Gemma 2) ]
                                                        │
                                                        ▼
[ Cloud AI Reasoning ] ──► [ Vertex AI / GenAI SDK ] ──► [ Gemini 2.5 Flash ]
                                                        │
                                                        ▼
[ Audit & Compliance Sink ] ──► [ Cloud Pub/Sub ] ──► [ Google BigQuery ]
```

* **vLLM + PagedAttention on GKE:** Manages GPU VRAM efficiently, preventing allocation fragmentation and delivering high-throughput local inference.
* **GCS + Cloud KMS Relationship:** Files in GCS are encrypted with distinct Data Encryption Keys (DEKs). Destroying the key in Cloud KMS renders the file permanently unrecoverable for GDPR compliance.
* **Serverless Cloud Run Autoscaling:** Automatically scales the FastAPI gateway and agent swarms based on request traffic, maintaining sub-second latency under peak loads.
