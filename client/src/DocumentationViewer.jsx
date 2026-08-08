import React, { useState } from 'react';

export default function DocumentationViewer() {
  const [activeDoc, setActiveDoc] = useState('01_overview');

  const docs = [
    { id: '01_overview', label: '01. Core Overview', icon: '🏛️' },
    { id: '02_features', label: '02. 25 Product Features', icon: '📱' },
    { id: '03_ai_swarm', label: '03. AI & Swarm Architecture', icon: '🐝' },
    { id: '04_privacy', label: '04. Privacy & Compliance', icon: '🛡️' },
    { id: '05_blockchain', label: '05. Blockchain & Integrity', icon: '⛓️' },
    { id: '06_interop', label: '06. EHR Interoperability (MCP)', icon: '🔌' },
    { id: '07_google_stack', label: '07. Google Tech Stack (10)', icon: '🌐' },
    { id: '08_scaling', label: '08. Scaling & Performance', icon: '⚡' },
    { id: '09_demo_runbook', label: '09. Live Demo Runbook', icon: '🎬' },
    { id: '10_master_qa', label: '10. Master Q&A (Q1-Q50)', icon: '🎯' },
    { id: '11_business_gtm', label: '11. Business & GTM', icon: '💼' },
    { id: '12_pitch_usps', label: '12. Pitches & 6 USPs', icon: '🏆' },
    { id: '13_claims_register', label: '13. Claims & Evidence Register', icon: '📊' }
  ];

  return (
    <div className="glass-panel" style={{ minHeight: '850px', padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="title-gradient" style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Helio AI Enterprise Documentation Hub</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Complete 13-document knowledge repository preserving all source specifications, architectures, benchmarks, and judge defense guides.
          </p>
        </div>
        <span className="badge badge-cyan" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>13 Official Knowledge Docs</span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
        {docs.map(d => (
          <button
            key={d.id}
            onClick={() => setActiveDoc(d.id)}
            className={activeDoc === d.id ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.45rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <span>{d.icon}</span>
            <span>{d.label}</span>
          </button>
        ))}
      </div>

      {/* Document Viewports */}
      <div className="glass-panel" style={{ background: 'rgba(255, 255, 255, 0.015)', border: '1px solid var(--border-glass)', padding: '2rem', lineHeight: '1.8', fontSize: '0.95rem' }}>
        
        {/* 01. Overview */}
        {activeDoc === '01_overview' && (
          <div>
            <h1 className="title-gradient" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>01 — Helio Core Project Overview</h1>
            <p><strong>One-Line Definition:</strong> <em>"Helio is an enterprise decentralized clinical intelligence platform that combines a private blockchain consent ledger, local on-premise PII scrubbing (Gemma 2), and a parallel multi-agent swarm (Google Antigravity + Gemini 2.5) to deliver doctor-ready patient briefings in 1.4 seconds with zero cloud data leaks."</em></p>
            <h3 className="section-title title-gradient" style={{ marginTop: '1.5rem' }}>Core Metrics</h3>
            <ul>
              <li><strong>P95 Latency:</strong> 1.39s (Tested async swarm vs. 13.1s sequential baseline).</li>
              <li><strong>Token Cost Reduction:</strong> 94.6% ($0.0600 → $0.0032 per query).</li>
              <li><strong>Swarm Architecture:</strong> 4 Specialized Agents (Timeline, Meds, Allergy, Risk) + 1 Meta-Orchestrator.</li>
              <li><strong>Zero PHI on Chain:</strong> 32-Byte docHash commitments only.</li>
            </ul>
          </div>
        )}

        {/* 02. Features */}
        {activeDoc === '02_features' && (
          <div>
            <h1 className="title-gradient" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>02 — Helio Product, User Features & UX</h1>
            <p>Complete inventory of <strong>25 production features</strong> across Home, Patient Portal, Clinician Console, and Telemetry Dashboard.</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem' }}>#</th>
                  <th style={{ padding: '0.5rem' }}>Feature</th>
                  <th style={{ padding: '0.5rem' }}>Interface</th>
                  <th style={{ padding: '0.5rem' }}>Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-glass)' }}><td>F-01 to F-05</td><td>Hero & Architecture Cards</td><td>Global Home</td><td>Value proposition & portal routing</td></tr>
                <tr style={{ borderBottom: '1px solid var(--border-glass)' }}><td>F-06 to F-10</td><td>Consent Manager & Vault</td><td>Patient Portal</td><td>Live Besu consent toggles & document hashes</td></tr>
                <tr style={{ borderBottom: '1px solid var(--border-glass)' }}><td>F-11 to F-21</td><td>Swarm Brief & HITL Editor</td><td>Doctor Console</td><td>Citation-anchored summary, 4 agent cards & BigQuery audit</td></tr>
                <tr><td>F-22 to F-25</td><td>Block Monitor & PII Scrubber</td><td>Telemetry Ops</td><td>Live Besu block production & PII masking proof</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {/* 03. AI Swarm */}
        {activeDoc === '03_ai_swarm' && (
          <div>
            <h1 className="title-gradient" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>03 — AI & Agentic Architecture</h1>
            <p>Built on the <strong>Google Antigravity Framework</strong>, decomposing clinical tasks across 4 parallel specialized agents supervised by a Clinical Coordinator.</p>
            <h3 className="section-title title-gradient" style={{ marginTop: '1.5rem' }}>The 4 Specialized Agents</h3>
            <ul>
              <li><strong>Timeline Agent:</strong> Extracts chronological hospital admissions, diagnoses, and surgical dates.</li>
              <li><strong>Allergy Agent:</strong> Identifies active sensitivities and reaction criticality (e.g. penicillin allergy).</li>
              <li><strong>Medication Agent:</strong> Extracts active prescription regimens, dosages, and treatment cycles.</li>
              <li><strong>Risk Agent:</strong> Detects oncology surgical margins and critical follow-up warnings.</li>
            </ul>
          </div>
        )}

        {/* 04. Privacy */}
        {activeDoc === '04_privacy' && (
          <div>
            <h1 className="title-gradient" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>04 — Privacy, Security & Compliance</h1>
            <p>Enforces a strict <strong>Hospital Edge Boundary</strong> where containerized Gemma 2 on vLLM strips all 18 HIPAA personal identifiers on-premise.</p>
            <h3 className="section-title title-gradient" style={{ marginTop: '1.5rem' }}>Three-Factor Authorization (3FA)</h3>
            <ol>
              <li><strong>Factor 1:</strong> Apigee API Key (Hospital Tenant Authentication).</li>
              <li><strong>Factor 2:</strong> Clinician Web3 Signature (Doctor Cryptographic Identity).</li>
              <li><strong>Factor 3:</strong> On-Chain Patient Consent (Hyperledger Besu Smart Contract).</li>
            </ol>
          </div>
        )}

        {/* 05. Blockchain */}
        {activeDoc === '05_blockchain' && (
          <div>
            <h1 className="title-gradient" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>05 — Blockchain & Decentralized Consent</h1>
            <p>Operates a <strong>Private Consortium Network (Hyperledger Besu / Kaleido)</strong> with Proof-of-Authority (IBFT 2.0) delivering zero gas fees and 2,500+ TPS.</p>
            <p><strong>Zero Medical Data Stored On-Chain:</strong> Only stores 32-byte SHA-256 document hashes (`docHash`) and boolean consent flags.</p>
          </div>
        )}

        {/* 06. Interoperability */}
        {activeDoc === '06_interop' && (
          <div>
            <h1 className="title-gradient" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>06 — EHR Interoperability (MCP & FHIR)</h1>
            <p>Uses the <strong>Model Context Protocol (MCP)</strong> as an edge translation proxy connecting legacy HL7 v2, C-CDA XML, and FHIR R4 JSON in-place.</p>
            <p>Decomposes large records into semantic sections (Encounters, Meds, Allergies, Labs) routed to specific specialized agents.</p>
          </div>
        )}

        {/* 07. Google Stack */}
        {activeDoc === '07_google_stack' && (
          <div>
            <h1 className="title-gradient" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>07 — Google Cloud Technology Stack (10)</h1>
            <p>Full integration across Google AI and Cloud Infrastructure:</p>
            <ul>
              <li><strong>1. Gemini 2.5:</strong> High-speed clinical synthesis and citation anchoring.</li>
              <li><strong>2. Gemma 2:</strong> Local on-premise PII/PHI sanitization.</li>
              <li><strong>3. Antigravity:</strong> Multi-agent swarm runtime coordination.</li>
              <li><strong>4. Apigee:</strong> API Gateway and healthcare routing.</li>
              <li><strong>5. Cloud Armor:</strong> WAF and DDoS protection.</li>
              <li><strong>6. BigQuery:</strong> Immutable non-repudiation compliance logs.</li>
              <li><strong>7. Cloud Identity:</strong> Biometric Passkey / WebAuthn login.</li>
              <li><strong>8. Cloud KMS:</strong> Customer-Managed Encryption Keys.</li>
              <li><strong>9. Google Cloud Storage:</strong> Encrypted FHIR document vault.</li>
              <li><strong>10. Cloud Run & GKE:</strong> Serverless container autoscaling and GPU infrastructure.</li>
            </ul>
          </div>
        )}

        {/* 08. Scaling */}
        {activeDoc === '08_scaling' && (
          <div>
            <h1 className="title-gradient" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>08 — Infrastructure, Scaling & Performance</h1>
            <p>Scales to 1 Million users with sub-1.4s response times via Cloud Run autoscaling (0 to 1,000+ pods), vLLM PagedAttention continuous batching, and Redis edge caching (&lt;5ms lookup).</p>
            <p><strong>Hospital Hardware Capex:</strong> Commodity server with NVIDIA L4/RTX 4090 under $3,500 one-time cost.</p>
          </div>
        )}

        {/* 09. Live Demo */}
        {activeDoc === '09_demo_runbook' && (
          <div>
            <h1 className="title-gradient" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>09 — Live Demo Runbook (2-Minute Judge Script)</h1>
            <ol>
              <li><strong>Home:</strong> Introduce 3 core architecture cards.</li>
              <li><strong>Patient Portal:</strong> Login (`julian`/`vance`) → Revoke consent (Red button).</li>
              <li><strong>Doctor Console:</strong> Login (`evelyn`/`harper`) → Query summary → Show <strong>Access Denied Security Block</strong>.</li>
              <li><strong>Patient Portal:</strong> Re-login → Grant consent (Green button).</li>
              <li><strong>Doctor Console:</strong> Query summary → Show <strong>Synthesized Brief + 4 Specialized Agent Cards</strong>.</li>
              <li><strong>HITL Editor:</strong> Edit note, rate 5 stars, click <strong>Save & Audit to BigQuery</strong>.</li>
              <li><strong>Telemetry Panel:</strong> Show live Besu block production, PII masking proof, and BigQuery audit logs!</li>
            </ol>
          </div>
        )}

        {/* 10. Master QA */}
        {activeDoc === '10_master_qa' && (
          <div>
            <h1 className="title-gradient" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>10 — Master Judge Q&A Repository (Q1 – Q50)</h1>
            <p>Full 50-question viva and judge defense guide preserved across Core Project, Advanced Architecture, Clinical Infrastructure, Regulatory/HIPAA, and Market Strategy.</p>
            <p><em>(Refer to <code>doc/knowledge/10_Helio_Master_Judge_QA.md</code> for the complete unabridged transcript of all 50 answers).</em></p>
          </div>
        )}

        {/* 11. Business */}
        {activeDoc === '11_business_gtm' && (
          <div>
            <h1 className="title-gradient" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>11 — Business Model, Competition & GTM</h1>
            <p><strong>Revenue Streams:</strong> B2B Clinician SaaS ($199/doctor/mo), Usage-Based Gateway API ($0.02/query), Consortium Node Licensing ($50k setup + $20k/yr).</p>
            <p><strong>Unit Economics:</strong> $0.0032 COGS vs. $0.0200 revenue yields an <strong>84% Gross Profit Margin</strong>.</p>
          </div>
        )}

        {/* 12. Pitch USPs */}
        {activeDoc === '12_pitch_usps' && (
          <div>
            <h1 className="title-gradient" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>12 — Pitches & 6 Unique Selling Propositions</h1>
            <p>The 6 Core USPs: 1) Zero-Cloud-Leak Local PII Scrubber, 2) Cryptographic Non-Repudiation, 3) 94.6% Lower Token Cost, 4) 100% EHR-Agnostic Interoperability, 5) Physician-Governed HITL Loop, and 6) Sub-2-Second Latency.</p>
            <p><strong>Closing Punchline:</strong> <em>"Helio combines local zero-leak privacy, blockchain legal certainty, and multi-agent AI to deliver doctor-ready summaries in 1.4 seconds at 94% lower cost."</em></p>
          </div>
        )}

        {/* 13. Claims Register */}
        {activeDoc === '13_claims_register' && (
          <div>
            <h1 className="title-gradient" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>13 — Master Claims & Evidence Register</h1>
            <p>Official register categorizing project claims and providing safe judge phrasing for HIPAA, GDPR Article 17, FDA CDS exemption, benchmarks, and financial targets.</p>
          </div>
        )}

      </div>
    </div>
  );
}
