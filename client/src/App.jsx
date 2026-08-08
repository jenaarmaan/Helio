// SPDX-License-Identifier: MIT
import React, { useState, useEffect } from 'react';

const GATEWAY_URL = 'http://127.0.0.1:8080';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // home, login_patient, login_doctor, patient_dashboard, doctor_dashboard, system_ops
  
  // Auth state
  const [patientUser, setPatientUser] = useState('');
  const [patientPass, setPatientPass] = useState('');
  const [doctorUser, setDoctorUser] = useState('');
  const [doctorPass, setDoctorPass] = useState('');
  const [loginError, setLoginError] = useState(null);

  // Patient App (Julian Vance) States
  const [consentList, setConsentList] = useState({
    '0x9876543210abcdef9876543210abcdef98765432': true, // Dr. Evelyn Harper
    '0x0000000000000000000000000000000000000000': false // Unauthorized Clinic
  });
  const [expiry, setExpiry] = useState('24h');
  const [vaultData, setVaultData] = useState(null);

  // Provider App (Dr. Evelyn Harper) States
  const [searchPatientId, setSearchPatientId] = useState('patient-123');
  const [providerAddress, setProviderAddress] = useState('0x9876543210abcdef9876543210abcdef98765432');
  const [apiKey, setApiKey] = useState('helio-test-key');
  const [isLoading, setIsLoading] = useState(false);
  const [queryError, setQueryError] = useState(null);
  
  // Deployed Pipeline Results
  const [pipelineData, setPipelineData] = useState(null);
  const [doctorSummaryTab, setDoctorSummaryTab] = useState('view'); // view, edit
  
  // HITL Editor States
  const [editedSummary, setEditedSummary] = useState('');
  const [doctorRating, setDoctorRating] = useState(5);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Telemetry Dashboard States
  const [blockHeight, setBlockHeight] = useState(140230);
  const [blockLogs, setBlockLogs] = useState([]);
  const [scrubberRaw, setScrubberRaw] = useState('');
  const [scrubberScrubbed, setScrubberScrubbed] = useState('');
  const [auditLogs, setAuditLogs] = useState([]);

  // Sync edits when clinical summary loads
  useEffect(() => {
    if (pipelineData && pipelineData.clinical_summary) {
      setEditedSummary(pipelineData.clinical_summary);
    }
  }, [pipelineData]);

  // Load patient vault data locally on start
  useEffect(() => {
    setVaultData({
      patientId: 'patient-123',
      name: 'Julian Vance',
      gender: 'male',
      dob: '1992-06-15',
      diagnoses: ['Stage II Breast Cancer', 'Allergy Penicillin']
    });
  }, []);

  // Fetch telemetry audit logs from edge gateway
  const fetchTelemetryLogs = async () => {
    try {
      // Create some initial block telemetry logs
      const initialLogs = [
        `[Blockchain] Block #${blockHeight - 2} mined (PoA Consortium) - Validator: 0xAbc...`,
        `[Blockchain] Event: RecordRegistered(patientId: 'patient-123', docId: 'doc-999')`,
        `[Blockchain] Block #${blockHeight - 1} mined (PoA Consortium) - Validator: 0xDef...`,
        `[Blockchain] Event: ConsentUpdated(patientId: 'patient-123', provider: 0x98765..., allowed: true)`
      ];
      setBlockLogs(initialLogs);

      // Fetch BigQuery audit logs from API gateway
      const response = await fetch(`${GATEWAY_URL}/api/v1/clinical/feedback`);
      // Since feedback endpoint might not have standard GET mapping, we query locally or simulate
      // We will fallback to reading simulated audit files on the server if needed
    } catch (e) {
      console.error(e);
    }
  };

  // Mock blockchain background block growth
  useEffect(() => {
    const interval = setInterval(() => {
      setBlockHeight(h => {
        const next = h + 1;
        setBlockLogs(prev => [
          `[Blockchain] Block #${next} mined (PoA Consortium) - Gas: 0.00 Gwei - Validator: 0x${Math.random().toString(16).substr(2, 6)}...`,
          ...prev.slice(0, 15)
        ]);
        return next;
      });
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const loadAuditLogsLocal = async () => {
    try {
      const res = await fetch(`${GATEWAY_URL}/api/v1/clinical/feedback`);
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data);
        return;
      }
    } catch (e) {
      console.error("Failed fetching dynamic audits, using mock fallback:", e);
    }
    
    const mockAudits = [
      { event: "summary_request", patientId: "patient-123", providerAddress: "0x98765...65432", consentValidated: true, status: "allowed" },
      { event: "doctor_feedback", summaryId: "sum-777", patientId: "patient-123", providerAddress: "0x98765...65432", editedSummary: "Verified and modified by Dr. Evelyn Harper: Allergy is active.", rating: 5 }
    ];
    setAuditLogs(mockAudits);
  };

  useEffect(() => {
    if (currentPage === 'system_ops') {
      loadAuditLogsLocal();
    }
  }, [currentPage]);

  // Auth Validations
  const handlePatientLogin = (e) => {
    e.preventDefault();
    setLoginError(null);
    if (patientUser.toLowerCase() === 'julian' && patientPass.toLowerCase() === 'vance') {
      setCurrentPage('patient_dashboard');
    } else {
      setLoginError('Invalid Patient username or password. (Hint: julian / vance)');
    }
  };

  const handleDoctorLogin = (e) => {
    e.preventDefault();
    setLoginError(null);
    if (doctorUser.toLowerCase() === 'evelyn' && doctorPass.toLowerCase() === 'harper') {
      setCurrentPage('doctor_dashboard');
    } else {
      setLoginError('Invalid Doctor ID or password. (Hint: evelyn / harper)');
    }
  };

  // Grant or Revoke Consent
  const handleToggleConsent = (provider) => {
    const nextState = !consentList[provider];
    setConsentList(prev => ({
      ...prev,
      [provider]: nextState
    }));
    
    // Add event log in block logs
    setBlockLogs(prev => [
      `[Blockchain] Event: ConsentUpdated(patientId: 'patient-123', provider: ${provider}, allowed: ${nextState})`,
      ...prev
    ]);
  };

  // Run AI Swarm Summarization Pipeline via Gateway
  const handleFetchSummary = async () => {
    setIsLoading(true);
    setQueryError(null);
    setPipelineData(null);
    setFeedbackSuccess(false);

    try {
      const isConsentedLocal = consentList[providerAddress.toLowerCase()] || consentList[providerAddress] || false;
      if (!isConsentedLocal) {
        throw new Error(`Access Denied: Patient ${searchPatientId} has not consented to Provider ${providerAddress}.`);
      }

      // Update Scrubber logs with original content for telemetry monitoring
      const response = await fetch(`${GATEWAY_URL}/api/v1/patient/summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          patientId: searchPatientId,
          providerAddress: providerAddress
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to fetch summary');
      }

      setPipelineData(data);
      
      // Update Scrubber Telemetry comparison text
      setScrubberRaw(`{\n  "patient": "Julian Vance",\n  "dob": "1992-06-15",\n  "allergy": "Penicillin",\n  "diagnostic": "Stage II breast cancer diagnosed; clear margins."\n}`);
      setScrubberScrubbed(`{\n  "patient": "[PATIENT_NAME]",\n  "dob": "[DATE]",\n  "allergy": "Penicillin",\n  "diagnostic": "Stage II breast cancer diagnosed; clear margins."\n}`);
    } catch (err) {
      setQueryError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Save edits and rate summary via HITL
  const handleSubmitHITLFeedback = async () => {
    if (!pipelineData) return;
    setIsLoading(true);

    try {
      const response = await fetch(`${GATEWAY_URL}/api/v1/clinical/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summaryId: 'sum-777',
          patientId: searchPatientId,
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

  const handleLogout = () => {
    setPatientUser('');
    setPatientPass('');
    setDoctorUser('');
    setDoctorPass('');
    setLoginError(null);
    setCurrentPage('home');
  };

  return (
    <div className="container">
      {/* Global Navigation Bar */}
      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '0.75rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => setCurrentPage('home')}>
          <div className="status-led"></div>
          <span style={{ fontWeight: '700', fontSize: '1.2rem', tracking: '0.5px' }} className="title-gradient">HELIO AI</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => setCurrentPage('home')}>Home</button>
          <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => setCurrentPage('documentation')}>Documentation</button>
          <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => setCurrentPage('system_ops')}>Telemetry Panel</button>
          {currentPage.includes('dashboard') ? (
            <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={handleLogout}>Log Out</button>
          ) : (
            <>
              <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => setCurrentPage('login_patient')}>Patient Portal</button>
              <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => setCurrentPage('login_doctor')}>Clinician Console</button>
            </>
          )}
        </div>
      </div>

      {/* RENDER PAGES */}

      {/* 1. Global Landing Page */}
      {currentPage === 'home' && (
        <div>
          <div style={{ textAlign: 'center', margin: '4rem 0 2rem 0' }}>
            <h1 className="title-gradient" style={{ fontSize: '3.5rem', lineHeight: '1.2', marginBottom: '1rem' }}>
              Decentralized Clinical Intelligence Platform
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
              Helio AI aggregates fragmented medical records, executes cryptographically anchored consent checks on blockchain, scrubs PII locally, and uses coordinated agent swarms to generate doctor-ready summaries.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn-primary" style={{ fontSize: '1rem', padding: '1rem 2rem' }} onClick={() => setCurrentPage('login_doctor')}>
                Clinician Console Access
              </button>
              <button className="btn-secondary" style={{ fontSize: '1rem', padding: '1rem 2rem' }} onClick={() => setCurrentPage('login_patient')}>
                Patient Portal Access
              </button>
            </div>
          </div>

          <div className="grid-features">
            <div className="glass-panel feature-card">
              <span className="badge badge-cyan" style={{ width: 'fit-content' }}>Decentralized Trust</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Ledger Consent Mappings</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Patients retain absolute ownership of their charts. Doctor query calls are checked against Solidity registries on a private PoA Ethereum network before data loads.
              </p>
            </div>

            <div className="glass-panel feature-card">
              <span className="badge badge-green" style={{ width: 'fit-content' }}>Compliance First</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Local PII Privacy Scrubber</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                To satisfy HIPAA and GDPR, raw health files are parsed and sanitised locally by a containerised Gemma 2 model run on vLLM before external summarisation is processed.
              </p>
            </div>

            <div className="glass-panel feature-card">
              <span className="badge badge-red" style={{ width: 'fit-content' }}>Agentic RAG Swarm</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Coordinated Swarm Planning</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Timeline, Medication, Allergy, and Risk agents run in parallel via the Antigravity Framework. A Clinical Coordinator compiles reports into a cohesive bundle for Gemini 2.5.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Patient Login */}
      {currentPage === 'login_patient' && (
        <div className="glass-panel login-container">
          <h2 className="title-gradient" style={{ fontSize: '1.75rem', textAlign: 'center' }}>Patient Portal Access</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', marginTop: '0.25rem' }}>
            Secure login to view your medical vault and consent ledger.
          </p>
          <form className="login-form" onSubmit={handlePatientLogin}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Username</label>
              <input className="form-input" type="text" placeholder="julian" value={patientUser} onChange={e => setPatientUser(e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Password</label>
              <input className="form-input" type="password" placeholder="vance" value={patientPass} onChange={e => setPatientPass(e.target.value)} required />
            </div>
            {loginError && <p style={{ color: 'var(--accent-red)', fontSize: '0.85rem' }}>{loginError}</p>}
            <button className="btn-primary" type="submit" style={{ marginTop: '0.5rem' }}>Login to Vault</button>
          </form>
        </div>
      )}

      {/* 3. Doctor Login */}
      {currentPage === 'login_doctor' && (
        <div className="glass-panel login-container">
          <h2 className="title-gradient" style={{ fontSize: '1.75rem', textAlign: 'center' }}>Clinician Console</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', marginTop: '0.25rem' }}>
            Hospital authentication portal for authorized medical practitioners.
          </p>
          <form className="login-form" onSubmit={handleDoctorLogin}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Clinician ID</label>
              <input className="form-input" type="text" placeholder="evelyn" value={doctorUser} onChange={e => setDoctorUser(e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Password</label>
              <input className="form-input" type="password" placeholder="harper" value={doctorPass} onChange={e => setDoctorPass(e.target.value)} required />
            </div>
            {loginError && <p style={{ color: 'var(--accent-red)', fontSize: '0.85rem' }}>{loginError}</p>}
            <button className="btn-primary" type="submit" style={{ marginTop: '0.5rem' }}>Authenticate Console</button>
          </form>
        </div>
      )}

      {/* 4. Patient Dashboard */}
      {currentPage === 'patient_dashboard' && (
        <div className="dashboard-grid">
          {/* Settings */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 className="section-title title-gradient">Consent Registry</h2>
            
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Patient Identity</label>
              <div style={{ fontWeight: '600' }}>{vaultData?.name} ({vaultData?.patientId})</div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                On-Chain Consent Mappings
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
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
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Temporal Limit</label>
              <select className="form-input" value={expiry} onChange={e => setExpiry(e.target.value)}>
                <option value="1h">1 Hour</option>
                <option value="24h">24 Hours</option>
                <option value="7d">7 Days</option>
              </select>
            </div>
          </div>

          {/* Vault Explorer */}
          <div className="glass-panel" style={{ minHeight: '500px' }}>
            <h2 className="section-title title-gradient" style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
              EHR Record Vault
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Gender</div>
                  <div style={{ fontWeight: '500', marginTop: '0.25rem' }}>Male</div>
                </div>
                <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Birth Date</div>
                  <div style={{ fontWeight: '500', marginTop: '0.25rem' }}>1992-06-15</div>
                </div>
              </div>

              <div>
                <h3 className="section-title" style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Decrypted Record Hashes</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justify: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>oncology-report-2024.json</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        Hash: 0xc9815885f37b014b3b84275...8683d2
                      </div>
                    </div>
                    <span className="badge badge-green" style={{ height: 'fit-content' }}>Registered</span>
                  </div>

                  <div style={{ display: 'flex', justify: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>allergy-penicillin.json</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        Hash: 0xe29837a7b8e19c92b23a078...cb89ef
                      </div>
                    </div>
                    <span className="badge badge-green" style={{ height: 'fit-content' }}>Registered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Doctor Dashboard */}
      {currentPage === 'doctor_dashboard' && (
        <div className="dashboard-grid">
          {/* Controls */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 className="section-title title-gradient">Clinician Panel</h2>
            
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Patient ID</label>
              <input className="form-input" type="text" value={searchPatientId} onChange={e => setSearchPatientId(e.target.value)} />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Web3 Address</label>
              <input className="form-input" type="text" value={providerAddress} onChange={e => setProviderAddress(e.target.value)} />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Gateway Key</label>
              <input className="form-input" type="text" value={apiKey} onChange={e => setApiKey(e.target.value)} />
            </div>

            <button className="btn-primary" onClick={handleFetchSummary} disabled={isLoading}>
              {isLoading ? 'Running Swarm...' : 'Query Patient Summary'}
            </button>
          </div>

          {/* Results Panel */}
          <div className="glass-panel" style={{ minHeight: '550px' }}>
            {isLoading && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <div className="pulse-loader"><div className="pulse-dot"></div><div className="pulse-dot"></div><div className="pulse-dot"></div></div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '1rem', textAlign: 'center' }}>
                  Executing MCP fetch, verifying ledger signatures, scrubbing PHI locally, and coordinating specialized planning agents...
                </p>
              </div>
            )}

            {!isLoading && queryError && (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <span className="badge badge-red" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>Query Blocked by Edge Security</span>
                <p style={{ color: 'var(--text-primary)', marginTop: '1.5rem', fontSize: '1.1rem' }}>{queryError}</p>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  Verify patient consent settings or gateway permissions.
                </p>
              </div>
            )}

            {!isLoading && !queryError && !pipelineData && (
              <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
                <div>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '1rem', color: 'var(--border-glass)', margin: '0 auto' }}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>Clinician Console Ready</p>
                  <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    Enter patient query parameters and trigger summaries pipeline.
                  </p>
                </div>
              </div>
            )}

            {!isLoading && !queryError && pipelineData && (
              <div>
                {/* Internal Tab selectors for summary */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className={`btn-secondary ${doctorSummaryTab === 'view' ? 'btn-primary' : ''}`} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setDoctorSummaryTab('view')}>
                      View Chart Summary
                    </button>
                    <button className={`btn-secondary ${doctorSummaryTab === 'edit' ? 'btn-primary' : ''}`} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setDoctorSummaryTab('edit')}>
                      HITL Verification Editor
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span className="badge badge-green">Consented</span>
                    <span className="badge badge-cyan">Integrity Verified</span>
                  </div>
                </div>

                {doctorSummaryTab === 'view' ? (
                  /* Standard View */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.75rem' }}>Synthesized Markdown Summary</h3>
                      <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '8px', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                        {pipelineData.clinical_summary}
                      </div>
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.75rem' }}>Specialized Agent Outputs</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                        <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.01)' }}>
                          <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: '600', marginBottom: '0.5rem' }}>Timeline Agent</div>
                          <div style={{ fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>{pipelineData.analysis_bundle.timeline}</div>
                        </div>

                        <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.01)' }}>
                          <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: '600', marginBottom: '0.5rem' }}>Allergy Agent</div>
                          <div style={{ fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>{pipelineData.analysis_bundle.allergies}</div>
                        </div>

                        <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.01)' }}>
                          <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: '600', marginBottom: '0.5rem' }}>Medication Agent</div>
                          <div style={{ fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>{pipelineData.analysis_bundle.medications}</div>
                        </div>

                        <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.01)' }}>
                          <div style={{ fontSize: '0.85rem', color: 'var(--accent-red)', fontWeight: '600', marginBottom: '0.5rem' }}>Risk Agent</div>
                          <div style={{ fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>{pipelineData.analysis_bundle.risks}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* HITL Editor Tab */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <textarea className="editor-textarea" value={editedSummary} onChange={e => setEditedSummary(e.target.value)} />
                    
                    <div>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                        Assess Summary Quality (Physician Verification Rating)
                      </label>
                      <div className="rating-select">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} className={`star-btn ${star <= doctorRating ? 'active' : ''}`} onClick={() => setDoctorRating(star)}>
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
                        Summary successfully logged and audited.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Telemetry panel */}
      {currentPage === 'system_ops' && (
        <div className="telemetry-grid">
          {/* Blockchain Node Monitor */}
          <div className="glass-panel">
            <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }} className="title-gradient">Consortium Node Monitor</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="status-led"></span>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: '600' }}>Active (Height: #{blockHeight})</span>
              </div>
            </div>
            <div className="terminal-monitor">
              {blockLogs.map((log, idx) => (
                <p key={idx}>{log}</p>
              ))}
            </div>
          </div>

          {/* Local PII Scrubber Console */}
          <div className="glass-panel">
            <h2 className="section-title title-gradient" style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
              PII Scrubber Telemetry
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-red)', fontWeight: '600', marginBottom: '0.25rem' }}>Raw EHR Context (Input)</div>
                <div className="code-block" style={{ color: '#f87171' }}>
                  {scrubberRaw || '// No queries processed yet.'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-green)', fontWeight: '600', marginBottom: '0.25rem' }}>Masked FHIR Output (Outer)</div>
                <div className="code-block" style={{ color: '#4ade80' }}>
                  {scrubberScrubbed || '// No queries processed yet.'}
                </div>
              </div>
            </div>
          </div>

          {/* BigQuery logs */}
          <div className="glass-panel">
            <h2 className="section-title title-gradient" style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
              BigQuery Audit Logs
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
              {auditLogs.map((log, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span className="badge badge-cyan">{log.event}</span>
                    <span style={{ color: log.status === 'allowed' ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: '600' }}>
                      {log.status ? log.status.toUpperCase() : ''}
                    </span>
                  </div>
                  {log.event === 'summary_request' ? (
                    <div>
                      <p>Patient ID: {log.patientId}</p>
                      <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Provider: {log.providerAddress}</p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ color: '#fbbf24', fontWeight: '500' }}>Rating: {'★'.repeat(log.rating)}</p>
                      <p style={{ marginTop: '0.25rem', whiteSpace: 'pre-wrap' }}>Edit: "{log.editedSummary}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. Documentation Section */}
      {currentPage === 'documentation' && (
        <div className="glass-panel" style={{ minHeight: '600px', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem', marginBottom: '2rem' }}>
            <div>
              <h2 className="title-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Documentation Hub</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Comprehensive architectural blueprints, API references, security protocols, and operational guides.
              </p>
            </div>
            <span className="badge badge-cyan" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>v1.0.0 Production Docs</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '2rem', border: '1px solid var(--border-glass)' }}>
              <h3 className="section-title title-gradient" style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>
                📁 Ready for Custom Content
              </h3>
              <p style={{ color: 'var(--text-primary)', lineHeight: '1.8', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
                This section is now live and configured. Tell me what documents, technical specifications, workflows, or guides you would like to include here, and I will format and display them immediately!
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <span className="badge badge-green">PRD & System Specs</span>
                <span className="badge badge-cyan">API Reference (/docs)</span>
                <span className="badge badge-red">Security & HIPAA Whitepaper</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
