# 13 — HELIO CLAIMS & EVIDENCE REGISTER

This document establishes the official Claims & Evidence Register for Helio AI, categorizing every quantitative, clinical, regulatory, security, and financial claim in the source material and providing safe judge phrasing.

---

## 📊 Master Claims & Evidence Matrix

| # | Claim Domain | Exact Source Wording | Source Category | Status & Evidence | Safe Judge Phrasing |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **C-01** | **HIPAA Compliance** | *"100% Zero-Leak HIPAA Compliance"* | Regulatory Claim | Designed around HIPAA de-identification standards; formal compliance depends on deployment context. | *"The platform implements HIPAA Safe Harbor de-identification on local GPUs before cloud processing."* |
| **C-02** | **GDPR Article 17** | *"Fulfills GDPR Article 17 Right to be Forgotten"* | Regulatory Claim | Architectural cryptographic erasure via Cloud KMS key shredding; verified mathematically. | *"Cryptographic key destruction severs the on-chain hash, aligning with GDPR erasure principles."* |
| **C-03** | **FDA Regulation** | *"Exempt under FDA 21st Century Cures Act Section 3060"* | Regulatory Positioning | Positioned as Non-Device Clinical Decision Support (CDS) with mandatory physician verification. | *"Designed to meet FDA criteria for non-device Clinical Decision Support software with human review."* |
| **C-04** | **Response Latency** | *"1.39 Seconds (P95 Latency)"* | Project Benchmark | Tested across parallel asynchronous swarm execution vs. sequential cloud baseline. | *"Demonstrated sub-1.4-second response times using parallel agent concurrency."* |
| **C-05** | **Token Cost Reduction**| *"94.6% API Cost Reduction (\$0.06 $\rightarrow$ \$0.0032)"* | Economic Benchmark | Calculated based on 15,000 raw EHR tokens distilled to 1,800 prompt tokens via local MCP. | *"Reduces cloud token payload from ~15k to ~1.8k tokens, cutting API costs by up to 94%."* |
| **C-06** | **Grounded Accuracy** | *"≥ 99% Grounded Accuracy Rating"* | Quality Target | Target evaluation metric measured via citation anchoring and LLM-as-a-Judge benchmark suites. | *"Targets ≥99% clinical groundedness by enforcing direct citation links back to source records."* |
| **C-07** | **Hallucination Rate**| *"Hallucination rate < 0.2%"* | Quality Target | Benchmarked target using Ragas / G-Eval suites over synthetic clinical datasets. | *"Designed to minimize hallucinations through specialized agent division of labor and citation anchors."* |
| **C-08** | **Record Linkage Match**| *"99.8% Identity Match Accuracy"* | Architecture Claim | Theoretical accuracy of Salted Bloom Filter Privacy-Preserving Record Linkage (PPRL). | *"Utilizes cryptographic bloom filters targeting high-accuracy cross-hospital record linkage."* |
| **C-09** | **Cloud Run Scale** | *"Autoscales 0 to 1,000+ Instances"* | Infrastructure Claim | Google Cloud Run serverless platform concurrency capability. | *"Architected on Google Cloud Run to autoscale dynamically from 0 to enterprise container volumes."* |
| **C-10** | **Local Throughput** | *"150+ Tokens / Second on vLLM"* | Performance Target | Target throughput on NVIDIA L4 GPU with PagedAttention continuous batching. | *"Leverages vLLM PagedAttention designed to deliver high-throughput on-premise inference."* |
| **C-11** | **Consent Read Latency**| *"< 5 Milliseconds Consent Lookup"* | Performance Benchmark | In-memory Redis edge cache lookup time ($O(1)$ complexity). | *"Delivers sub-5ms consent validation at the edge via distributed memory caching."* |
| **C-12** | **Test Coverage** | *"100% Smart Contract Test Coverage"* | Verification Fact | Hardhat Mocha/Chai test suite validating boundary and temporal access logic in repository. | *"Verified with comprehensive Hardhat smart contract regression test suites."* |
| **C-13** | **Hardware Capex** | *"Under \$3,500 One-Time Hardware Cost"* | Cost Estimate | Commodity enterprise workstation with NVIDIA RTX 4090 / L4 GPU. | *"Engineered to run on cost-effective commodity GPU hardware under \$3,500 per hospital site."* |
| **C-14** | **Onboarding Speed** | *"Deploys in under 5 business days"* | Operational Target | Standardized Docker / Kubernetes Helm chart deployment workflow. | *"Designed for rapid deployment in under a week using containerized edge proxies."* |
| **C-15** | **Insurance Discount** | *"10% to 18% Malpractice Premium Discounts"* | Commercial Proposition | Industry estimate based on verifiable CDS and non-repudiation audit trails. | *"Aims to lower malpractice risk and settlement liabilities through verifiable audit trails."* |
| **C-16** | **Financial Target** | *"\$1.8M ARR by Month 18 across 35 institutions"* | Business Projection | 18-month commercial business plan projection based on \$1.5M Seed round. | *"Projects \$1.8M ARR in our 18-month roadmap by targeting 35 healthcare institutions."* |

---

## 🎯 Safe Phrasebook for Presentation & Viva

1. **When Asked About Compliance:**
   * *Phrase:* *"Helio is engineered around HIPAA Safe Harbor and GDPR privacy principles by stripping identifiers locally on-premise before external processing."*
2. **When Asked About Accuracy:**
   * *Phrase:* *"We enforce 'AI proposes, physician disposes'—every statement is anchored with citations, and the licensed doctor retains final review and attestation in the HITL Editor."*
3. **When Asked About Performance:**
   * *Phrase:* *"Our parallel multi-agent swarm architecture demonstrates sub-1.4-second response times, compared to over 13 seconds for sequential pipelines."*
