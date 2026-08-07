// SPDX-License-Identifier: MIT
import React, { useState, useEffect } from 'react';

// Configure gateway backend URL
const GATEWAY_URL = 'http://127.0.0.1:8080';

export default function App() {
  const [activeTab, setActiveTab] = useState('patient'); // patient, provider, hitl
  
  // Patient App States (Julian Vance)
  const [consentList, setConsentList] = useState({
    '0x9876543210abcdef9876543210abcdef98765432': true, // Dr. Evelyn Harper
    '0x0000000000000000000000000000000000000000': false // Unauthorized Clinic
  });
  const [expiry, setExpiry] = useState('24h');
  
  // Provider Dashboard States (Dr. Evelyn Harper)
  const [patientId, setPatientId] = useState('patient-123');
  const [providerAddress, setProviderAddress] = useState('0x9876543210abcdef9876543210abcdef98765432');
  const [apiKey, setApiKey] = useState('helio-test-key');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Deployed Pipeline Results
  const [pipelineData, setPipelineData] = useState(null);
  
  // HITL Editor States
  const [editedSummary, setEditedSummary] = useState('');
  const [doctorRating, setDoctorRating] = useState(5);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Sync edited summary when new data arrives
  useEffect(() => {
    if (pipelineData && pipelineData.clinical_summary) {
      setEditedSummary(pipelineData.clinical_summary);
    }
  }, [pipelineData]);

  // Handle granting / revoking consent
  const handleToggleConsent = (provider) => {
    setConsentList(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  // Run end-to-end RAG Orchestrator pipeline via Edge Gateway
  const handleFetchSummary = async () => {
    setIsLoading(true);
    setError(null);
    setPipelineData(null);
    setFeedbackSuccess(false);

    try {
      const isConsentedLocal = consentList[providerAddress.toLowerCase()] || consentList[providerAddress] || false;
      
      if (!isConsentedLocal) {
        throw new Error(`Access Denied: Patient ${patientId} has not consented to Provider ${providerAddress}.`);
      }

      const response = await fetch(`${GATEWAY_URL}/api/v1/patient/summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          patientId,
          providerAddress
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to fetch summary');
      }

      setPipelineData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit edits and ratings via HITL Dashboard to BigQuery Audits
  const handleSubmitHITLFeedback = async () => {
    if (!pipelineData) return;
    setIsLoading(true);

    try {
      const response = await fetch(`${GATEWAY_URL}/api/v1/clinical/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          summaryId: 'sum-777',
          patientId: patientId,
          providerAddress: providerAddress,
          editedSummary: editedSummary,
          rating: doctorRating
        })
      });

      if (response.ok) {
        setFeedbackSuccess(true);
        setPipelineData(prev => ({
          ...prev,
          clinical_summary: editedSummary
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Helio AI Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Decentralized Agentic Clinical EHR Integrity Platform</p>
      </header>

      {/* Navigation tabs */}
      <div className="glass-panel" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', padding: '0.75rem' }}>
        <button className={`btn-secondary ${activeTab === 'patient' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('patient')}>
          Julian Vance (Patient App)
        </button>
        <button className={`btn-secondary ${activeTab === 'provider' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('provider')}>
          Dr. Evelyn Harper (Provider Portal)
        </button>
        {pipelineData && (
          <button className={`btn-secondary ${activeTab === 'hitl' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('hitl')}>
            HITL Summary Editor
          </button>
        )}
      </div>

      <div className="dashboard-grid">
        {/* Left Side: Parameters / Settings */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {activeTab === 'patient' ? (
            <>
              <h2 className="section-title title-gradient">Patient Consent Settings</h2>
              
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                  Identity Owner
                </label>
                <div style={{ fontWeight: '600' }}>Julian Vance (patient-123)</div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                  On-Chain Consent Registry
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                  {/* Dr. Evelyn Harper */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>Dr. Evelyn Harper</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>0x98765...65432</div>
                    </div>
                    <button 
                      className={`btn-secondary ${consentList['0x9876543210abcdef9876543210abcdef98765432'] ? 'badge-green' : 'badge-red'}`} 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                      onClick={() => handleToggleConsent('0x9876543210abcdef9876543210abcdef98765432')}
                    >
                      {consentList['0x9876543210abcdef9876543210abcdef98765432'] ? 'Granted' : 'Revoked'}
                    </button>
                  </div>

                  {/* Unauthorized Clinic */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>Unauthorized Clinic</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>0x00000...00000</div>
                    </div>
                    <button 
                      className={`btn-secondary ${consentList['0x0000000000000000000000000000000000000000'] ? 'badge-green' : 'badge-red'}`} 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                      onClick={() => handleToggleConsent('0x0000000000000000000000000000000000000000')}
                    >
                      {consentList['0x0000000000000000000000000000000000000000'] ? 'Granted' : 'Revoked'}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                  Temporal Rules Duration
                </label>
                <select className="form-input" value={expiry} onChange={(e) => setExpiry(e.target.value)}>
                  <option value="1h">1 Hour (Temporary)</option>
                  <option value="24h">24 Hours (Standard)</option>
                  <option value="7d">7 Days (Oncology Treatment Cycle)</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <h2 className="section-title title-gradient">Provider Parameters</h2>
              
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                  Patient Registry ID
                </label>
                <input className="form-input" type="text" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                  Clinician Web3 Address
                </label>
                <input className="form-input" type="text" value={providerAddress} onChange={(e) => setProviderAddress(e.target.value)} />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                  Gateway Authorization Key (Apigee)
                </label>
                <input className="form-input" type="text" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
              </div>

              <button className="btn-primary" onClick={handleFetchSummary} disabled={isLoading}>
                {isLoading ? 'Processing Swarm...' : 'Query Clinical Summary'}
              </button>
            </>
          )}
        </div>

        {/* Right Side: Output Panel */}
        <div className="glass-panel" style={{ minHeight: '500px' }}>
          {isLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <div className="pulse-loader">
                <div className="pulse-dot"></div>
                <div className="pulse-dot"></div>
                <div className="pulse-dot"></div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', textAlign: 'center', marginTop: '1rem' }}>
                Executing local MCP fetch, validating blockchain registries, scrubbing PHI context, and running specialized swarms...
              </p>
            </div>
          )}

          {!isLoading && error && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <span className="badge badge-red" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>Query Blocked by Edge Security</span>
              <p style={{ color: 'var(--text-primary)', marginTop: '1.5rem', fontSize: '1.1rem' }}>{error}</p>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                Verify patient consent mappings or API credentials key rules.
              </p>
            </div>
          )}

          {!isLoading && !error && !pipelineData && (
            <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
              <div>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '1rem', color: 'var(--border-glass)', margin: '0 auto' }}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>Platform Idle</p>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  {activeTab === 'patient' 
                    ? 'Grant consent and select the Provider Portal tab to execute a summary.' 
                    : 'Enter clinician parameters and execute search query to trigger RAG Orchestration.'}
                </p>
              </div>
            </div>
          )}

          {!isLoading && !error && pipelineData && (
            <div>
              {activeTab === 'hitl' ? (
                /* HITL Tab */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className="section-title title-gradient">Human-In-The-Loop Editor</h2>
                    <span className="badge badge-cyan">Summary Edit State</span>
                  </div>

                  <textarea 
                    className="editor-textarea" 
                    value={editedSummary} 
                    onChange={(e) => setEditedSummary(e.target.value)} 
                  />

                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                      Assess AI Summary Quality (Clinician Rating)
                    </label>
                    <div className="rating-select">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star} 
                          className={`star-btn ${star <= doctorRating ? 'active' : ''}`}
                          onClick={() => setDoctorRating(star)}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <button className="btn-primary" onClick={handleSubmitHITLFeedback}>
                    Save Summary & Audit to BigQuery
                  </button>

                  {feedbackSuccess && (
                    <div style={{ color: 'var(--accent-green)', fontWeight: '600', fontSize: '0.9rem', padding: '0.75rem', background: 'rgba(0, 255, 135, 0.1)', border: '1px solid rgba(0,255,135,0.3)', borderRadius: '8px', textAlign: 'center' }}>
                      Doctor feedback successfully saved and audited to non-repudiation logging ledger.
                    </div>
                  )}
                </div>
              ) : (
                /* Provider Tab Output */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {/* Status header bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Patient Records View</h2>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        Source: {pipelineData.verification.source}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span className="badge badge-green">Consented</span>
                      <span className="badge badge-cyan">Hash Verified</span>
                    </div>
                  </div>

                  {/* Diagnostic Summary */}
                  <div>
                    <h3 className="section-title" style={{ fontSize: '1.1rem' }}>Synthesized Markdown Summary</h3>
                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '8px', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                      {pipelineData.clinical_summary}
                    </div>
                  </div>

                  {/* Specialized Swarm analysis widgets */}
                  <div>
                    <h3 className="section-title" style={{ fontSize: '1.1rem' }}>Specialized Agent Outputs</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginTop: '1rem' }}>
                      {/* Timeline */}
                      <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.01)' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: '600', marginBottom: '0.5rem' }}>Timeline Agent</div>
                        <div style={{ fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>{pipelineData.analysis_bundle.timeline}</div>
                      </div>
                      
                      {/* Allergies */}
                      <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.01)' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: '600', marginBottom: '0.5rem' }}>Allergy Agent</div>
                        <div style={{ fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>{pipelineData.analysis_bundle.allergies}</div>
                      </div>

                      {/* Medications */}
                      <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.01)' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: '600', marginBottom: '0.5rem' }}>Medication Agent</div>
                        <div style={{ fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>{pipelineData.analysis_bundle.medications}</div>
                      </div>

                      {/* Risks */}
                      <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.01)' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--accent-red)', fontWeight: '600', marginBottom: '0.5rem' }}>Risk Agent</div>
                        <div style={{ fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>{pipelineData.analysis_bundle.risks}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
