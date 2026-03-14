import React, { useState, useEffect, useRef } from 'react';
import { Send, Cpu, Activity, AlertTriangle, CheckCircle, BrainCircuit, Network, Wrench, ShieldCheck, Database, FileText } from 'lucide-react';
import axios from 'axios';
import './index.css';

const API_BASE = 'http://localhost:8000/api';

const Dashboard = () => {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--panel-border)', paddingBottom: '1rem' }}>
        <Activity size={22} color="var(--accent-primary)" style={{ animation: 'pulse-intense 2s infinite' }} />
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)' }}>Sentinel SRE Co-Worker</h2>
      </header>
      <div style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
        <p>Welcome. I am your Sentinel Agent, designed to act as your SRE co-worker.</p>
        <p style={{ marginTop: '0.5rem' }}>My core workflow operates in 3 distinct phases to help you resolve incidents rapidly:</p>
        <ol style={{ marginTop: '1rem', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <li><strong>Detection:</strong> Triaging the issue instantly (Application vs Infra Health).</li>
          <li><strong>Reasoning:</strong> Reading through Confluence, architecture docs, and GitHub commits to understand the error.</li>
          <li><strong>Remediation:</strong> Providing a complete end-to-end workflow to fix the issue, and capturing your past experience for the Knowledge Base to share with other SREs.</li>
        </ol>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
        <div style={{ background: 'rgba(37, 99, 235, 0.04)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--panel-border)' }}>
          <h4 style={{ color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={16} color="var(--accent-primary)"/> Live System Metrics</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
               <span style={{ color: 'var(--text-muted)' }}>Production CPU</span>
               <span style={{ color: 'var(--status-healthy)', fontWeight: 600 }}>42%</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
               <span style={{ color: 'var(--text-muted)' }}>Memory Usage</span>
               <span style={{ color: 'var(--status-warning)', fontWeight: 600 }}>78%</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
               <span style={{ color: 'var(--text-muted)' }}>API Latency (p99)</span>
               <span style={{ color: 'var(--status-healthy)', fontWeight: 600 }}>120ms</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
               <span style={{ color: 'var(--text-muted)' }}>Active Alerts</span>
               <span style={{ color: 'var(--status-critical)', fontWeight: 600 }}>2 Critical</span>
             </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(14, 165, 233, 0.04)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--accent-secondary-glow)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontWeight: 600, marginBottom: '8px' }}>
              <ShieldCheck size={18} color="var(--accent-primary)" /> SRE Co-Worker Status
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>Proactive triaging & automation active. Traditional MTTD/MTTR tracking is deprecated.</div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontStyle: 'italic', marginTop: '1rem' }}>● Sentinel AI Connected & Monitoring</p>
        </div>
      </div>
    </div>
  );
};

const ChatInterface = ({ onAgentAction }) => {
  const [messages, setMessages] = useState([{ sender: 'agent', text: 'SRE co-worker connected. Hello! I am your Sentinel Agent, ready to help with incident triaging, remediation, or planning your day. Use the action prompts below or type your query.' }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const messagesEndRef = useRef(null);

  const predefinedPrompts = [
    "JWT Token Expiry Issue Detected",
    "API Gateway Connectivity Failure",
    "Show Recommendation from Knowledge Base",
    "Plan My Day - SRE Activities",
    "Show Past SRE Learnings (Time Map)"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textOverride = null) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;
    
    setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await axios.post(`${API_BASE}/chat`, { message: textToSend });
      setMessages(prev => [...prev, { sender: 'agent', text: res.data.response }]);
      if (res.data.action_type) {
        onAgentAction(res.data.action_type, res.data.data);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'agent', text: 'Error interacting with Sentinel API.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
       <header style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--panel-border)', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(37, 99, 235, 0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-primary-glow)', border: '1px solid var(--accent-primary)' }}>
             <Cpu size={18} color="var(--accent-primary)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 600 }}>Sentinel Agent</h2>
            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>● Connected SRE co-worker</div>
          </div>
       </header>

       <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%', animation: 'fadeIn 0.2s ease-out' }}>
              <div style={{ 
                padding: '0.85rem 1.1rem', 
                borderRadius: msg.sender === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0', 
                background: msg.sender === 'user' ? 'var(--accent-primary)' : 'rgba(37, 99, 235, 0.04)',
                border: msg.sender === 'user' ? 'none' : '1px solid var(--panel-border)',
                color: msg.sender === 'user' ? '#fff' : 'var(--text-main)',
                lineHeight: 1.6,
                fontSize: '0.9rem',
                boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(37, 99, 235, 0.2)' : 'none'
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
             <div style={{ alignSelf: 'flex-start', padding: '0.75rem 1rem', borderRadius: '12px 12px 12px 0', background: 'rgba(37, 99, 235, 0.04)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
               <span style={{ animation: 'pulse-subtle 1s infinite' }}>Analyzing requests...</span>
             </div>
          )}
          <div ref={messagesEndRef} />
       </div>

       <div style={{ padding: '1.25rem', borderTop: '1px solid var(--panel-border)', background: 'rgba(37, 99, 235, 0.02)' }}>
         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: showPrompts ? '0.75rem' : 0 }}>
           <button
             onClick={() => setShowPrompts(prev => !prev)}
             style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
           >
             {showPrompts ? '▾ Hide' : '▸ Show'} Quick Actions
           </button>
         </div>
         {showPrompts && (
           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', animation: 'fadeIn 0.2s ease-out' }}>
              {predefinedPrompts.map((p, i) => (
                 <button key={i} className="pill-button" onClick={() => handleSend(p)}>
                   {p}
                 </button>
              ))}
           </div>
         )}
         <div style={{ display: 'flex', gap: '0.75rem', background: '#fff', padding: '0.6rem', borderRadius: '10px', border: '1px solid var(--panel-border)' }}>
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Describe the issue or query..." 
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', padding: '0 0.5rem', fontSize: '0.95rem' }}
            />
            <button onClick={() => handleSend()} disabled={isTyping} style={{ background: 'var(--accent-primary)', color: '#fff', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <Send size={16} /> Send
            </button>
         </div>
       </div>
    </div>
  );
};

// Next-Gen Interactive Workflow (Detection -> Reasoning -> Remediation)
const NextGenWorkflow = ({ data }) => {
  const [activeTab, setActiveTab] = useState('detection');
  const [sreInput, setSreInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!data) return null;
  const phases = data.phases;

  const handleKBSumbit = async () => {
    if(!sreInput.trim()) return;
    try {
      await axios.post(`${API_BASE}/knowledge`, {
        incident_id: data.incident_id || "INC-2099",
        sre_experience: sreInput,
        solution_applied: "Executed workflow and added manual context."
      });
      setSubmitted(true);
      setSreInput("");
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', animation: 'fadeIn 0.3s ease-out' }}>
      <header style={{ marginBottom: '1rem' }}>
          <h3 style={{ color: 'var(--text-main)', margin: 0, fontSize: '1.1rem' }}>SRE Co-Worker Triaging Dashboard</h3>
      </header>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--panel-border)', marginBottom: '1rem' }}>
        <button onClick={() => setActiveTab('detection')} className={`layer-tab ${activeTab === 'detection' ? 'active' : ''}`}>
          1. Detection
        </button>
        <button onClick={() => setActiveTab('reasoning')} className={`layer-tab ${activeTab === 'reasoning' ? 'active' : ''}`}>
          2. Reasoning
        </button>
        <button onClick={() => setActiveTab('remediation')} className={`layer-tab ${activeTab === 'remediation' ? 'active' : ''}`}>
          3. Remediation
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
        {activeTab === 'detection' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <h4 style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}><Network size={16} color="var(--accent-primary)"/> Triaging Issue vs Infra</h4>
             <div style={{ background: 'rgba(37, 99, 235, 0.04)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--panel-border)' }}>
               <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}>Incident Source</div>
               <div style={{ color: 'var(--text-main)', fontWeight: 500 }}>{phases.detection.source}</div>
             </div>
             <div style={{ background: 'var(--status-critical-bg)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--status-critical)' }}>
               <div style={{ color: 'var(--status-critical)', fontWeight: 600, marginBottom: '4px' }}>Application Issue Detected</div>
               <div style={{ color: 'var(--text-main)' }}>{phases.detection.details}</div>
             </div>
             <div style={{ background: 'var(--status-healthy-bg)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--status-healthy)' }}>
               <div style={{ color: 'var(--status-healthy)', fontWeight: 600, marginBottom: '4px' }}>Infrastructure Health</div>
               <div style={{ color: 'var(--text-main)' }}>{phases.detection.infra_health}</div>
             </div>
          </div>
        )}

        {activeTab === 'reasoning' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <h4 style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={16} color="var(--accent-primary)"/> Docs & Architecture Review</h4>
             
             <div style={{ background: 'rgba(37, 99, 235, 0.04)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--panel-border)' }}>
               <div style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.85rem', textTransform: 'uppercase' }}>Sources Read by Agent</div>
               <ul style={{ paddingLeft: '1.5rem', color: 'var(--accent-primary)' }}>
                 {phases.reasoning.docs_analyzed.map((doc, i) => <li key={i}>{doc}</li>)}
               </ul>
             </div>

             <div style={{ background: 'rgba(37, 99, 235, 0.06)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--accent-primary-glow)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                 <div style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '1.05rem' }}>Understanding the Error (RCA)</div>
                 <div style={{ color: '#fff', fontSize: '0.85rem', background: 'var(--accent-primary)', padding: '2px 8px', borderRadius: '12px' }}>{phases.reasoning.confidence} Match</div>
               </div>
               <div style={{ color: 'var(--text-main)', lineHeight: 1.5 }}>{phases.reasoning.root_cause_analysis}</div>
             </div>
          </div>
        )}

        {activeTab === 'remediation' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <h4 style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}><Wrench size={16} color="var(--status-warning)"/> End-to-End Workflow Suggestion</h4>
             
             <div style={{ background: 'rgba(37, 99, 235, 0.04)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--panel-border)' }}>
               <div style={{ color: 'var(--status-warning)', fontWeight: 500, marginBottom: '1rem', fontSize: '0.95rem' }}>
                 <strong>Suggestion:</strong> {phases.remediation.suggestion}
               </div>
               <div style={{ color: 'var(--text-main)', fontWeight: 600, marginBottom: '0.5rem' }}>Automated Workflow Journey:</div>
               <ol style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', color: 'var(--text-main)', lineHeight: 1.8 }}>
                 {phases.remediation.workflow.map((step, i) => <li key={i}>{step}</li>)}
               </ol>
             </div>

             {/* Knowledge Base Input */}
             <div style={{ background: 'rgba(14, 165, 233, 0.04)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(14, 165, 233, 0.15)' }}>
                <h4 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BrainCircuit size={18} color="var(--accent-primary)"/> Experience Capture
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
                  Share your past experience with other SREs via the Knowledge Base. 
                </p>
                {submitted ? (
                  <div style={{ color: 'var(--status-healthy)', background: 'var(--status-healthy-bg)', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                    <CheckCircle size={18} /> Experience successfully logged and shared with other SREs.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <textarea 
                      value={sreInput} 
                      onChange={e => setSreInput(e.target.value)}
                      placeholder="e.g. Cleared Redis cache manually before rollback to prevent stale session locking..." 
                      style={{ width: '100%', height: '80px', background: '#fff', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-main)', padding: '0.75rem', fontFamily: 'inherit', resize: 'vertical' }}
                    />
                    <button onClick={handleKBSumbit} style={{ alignSelf: 'flex-start', background: 'var(--accent-primary)', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Database size={16} /> Save to Knowledge Base
                    </button>
                  </div>
                )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Past Learnings Time Map (Timeline Component)
const PastLearningsTimeline = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>
        No past experiences found in Knowledge Base.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.3s ease-out' }}>
      <header style={{ marginBottom: '1rem' }}>
        <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database color="var(--accent-primary)" /> Shared SRE Experiences (Time Map)
        </h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px', lineHeight: 1.5 }}>
          Showing past experiences and manual overrides shared by SREs.
        </p>
      </header>
      
      <div style={{ position: 'relative', borderLeft: '2px solid var(--accent-primary-glow)', marginLeft: '1rem', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {data.map((item, idx) => (
          <div key={item.id || idx} style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '-1.85rem', top: '4px', width: '14px', height: '14px', borderRadius: '50%', background: 'var(--accent-primary)', border: '2px solid var(--bg-color)', boxShadow: '0 0 8px var(--accent-primary-glow)' }}></div>
            
            <div style={{ background: 'rgba(37, 99, 235, 0.04)', border: '1px solid var(--panel-border)', padding: '1.25rem', borderRadius: '8px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <span style={{ background: 'var(--status-critical-bg)', color: 'var(--status-critical)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{item.incident_id}</span>
                   <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(item.timestamp).toLocaleString()}</span>
                 </div>
               </div>
               
               <div style={{ marginBottom: '1rem' }}>
                 <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem', display: 'block', marginBottom: '4px' }}>SRE Past Experience:</strong>
                 <div style={{ background: 'rgba(14, 165, 233, 0.06)', padding: '0.75rem', borderRadius: '6px', color: 'var(--accent-primary)', fontSize: '0.9rem', fontStyle: 'italic', borderLeft: '2px solid var(--accent-primary)' }}>
                   "{item.sre_experience}"
                 </div>
               </div>
               
               <div>
                 <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem', display: 'block', marginBottom: '4px' }}>Remediation Applied:</strong>
                 <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                   {item.solution_applied}
                 </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Daily Plan Component
const DailyPlanView = ({ data }) => {
  if (!data) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.3s ease-out' }}>
      <header>
        <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity color="var(--accent-primary)" /> SRE Daily Action Plan
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Here is your optimized day based on current system health and pending items.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ background: 'rgba(37, 99, 235, 0.04)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--panel-border)' }}>
          <h4 style={{ color: 'var(--accent-primary)', marginBottom: '1rem', fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wrench size={16} /> Prioritized Tasks
          </h4>
          <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            {data.tasks.map((task, i) => (
              <li key={i}>{task}</li>
            ))}
          </ul>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'var(--status-critical-bg)', padding: '1.25rem', borderRadius: '12px', borderLeft: '3px solid var(--status-critical)' }}>
            <h4 style={{ color: 'var(--status-critical)', marginBottom: '0.5rem', fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={16} /> Critical Alerts
            </h4>
            <div style={{ color: 'var(--text-main)', fontSize: '1.5rem', fontWeight: 700 }}>{data.critical_alerts}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Requires immediate triage.</div>
          </div>

          <div style={{ background: 'rgba(14, 165, 233, 0.04)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--panel-border)' }}>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontSize: '0.95rem', fontWeight: 600 }}>Upcoming Syncs</h4>
            <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              {data.upcoming_meetings.map((meeting, i) => (
                <li key={i}>{meeting}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Active Issues List Component
const ActiveIssuesView = ({ data }) => {
  if (!data || data.length === 0) return <div style={{ color: 'var(--text-muted)', padding: '1rem' }}>No active issues found.</div>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.3s ease-out' }}>
      <header>
        <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle color="var(--status-critical)" /> Active System Issues
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Current anomalies and alerts detected from downstream telemetry.</p>
      </header>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {data.map((issue, idx) => (
          <div key={idx} style={{ background: 'var(--status-critical-bg)', padding: '1.25rem', borderRadius: '12px', borderLeft: '3px solid var(--status-critical)' }}>
             <h4 style={{ color: 'var(--status-critical)', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>{issue.title}</h4>
             <div style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{issue.description}</div>
             <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(issue.timestamp).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Available Flows Component
const AvailableFlowsView = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.3s ease-out' }}>
      <header>
        <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Network color="var(--accent-primary)" /> Available SRE Automation Flows
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Standard remediation workflows ready for execution.</p>
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        {data.map((flow, idx) => (
          <div key={idx} style={{ background: 'rgba(37, 99, 235, 0.04)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div>
                <h4 style={{ color: 'var(--text-main)', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>{flow.name}</h4>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{flow.description}</div>
             </div>
             <div style={{ background: 'var(--status-healthy-bg)', color: 'var(--status-healthy)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
               {flow.status}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Remediation Recommendation Component
const RecommendationView = ({ data }) => {
  if (!data) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.3s ease-out' }}>
      <header>
        <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BrainCircuit color="var(--accent-primary)" /> AI Remediation Recommendation
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Proposed proactive fix for: <strong>{data.incident}</strong></p>
      </header>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ background: 'rgba(37, 99, 235, 0.06)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--accent-primary-glow)' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '1.05rem' }}>Execution Plan</div>
              <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, background: 'var(--status-healthy)', padding: '2px 10px', borderRadius: '12px' }}>{data.confidence} Match</div>
           </div>
           <ol style={{ paddingLeft: '1.2rem', listStyleType: 'none', margin: 0, color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
             {data.steps.map((step, i) => <li key={i}>{step}</li>)}
           </ol>
        </div>

        <div style={{ background: 'rgba(14, 165, 233, 0.04)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px', textTransform: 'uppercase' }}>Associated Workflow</div>
            <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>{data.associated_flow}</div>
          </div>
          <button onClick={() => alert("Flow Execution Triggered")} style={{ background: 'var(--accent-primary)', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 8px rgba(37,99,235,0.25)' }}>
            <CheckCircle size={16} /> Execute Flow
          </button>
        </div>
      </div>
    </div>
  );
};


// Past Sessions Sidebar
const PastSessionsSidebar = () => {
  const [history, setHistory] = useState([]);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API_BASE}/chat/history`);
        if (res.data) setHistory(res.data);
      } catch (e) { /* no history */ }
    };
    load();
  }, []);

  if (history.length === 0) return null;

  return (
    <div className="glass-panel" style={{ maxHeight: '280px', display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.3s ease-out' }}>
      <div
        onClick={() => setExpanded(prev => !prev)}
        style={{ padding: '0.75rem 1rem', borderBottom: expanded ? '1px solid var(--panel-border)' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(37, 99, 235, 0.04)' }}
      >
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Database size={14} color="var(--accent-primary)" /> Past Sessions
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{expanded ? '▾' : '▸'}</span>
      </div>
      {expanded && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0.75rem' }}>
          {history.map((entry, idx) => (
            <div key={idx} style={{
              padding: '0.5rem 0.75rem',
              borderLeft: entry.sender === 'user' ? '2px solid var(--accent-primary)' : '2px solid var(--status-healthy)',
              marginBottom: '0.5rem',
              background: entry.sender === 'user' ? 'rgba(37, 99, 235, 0.03)' : 'rgba(16, 185, 129, 0.03)',
              borderRadius: '0 6px 6px 0',
              fontSize: '0.8rem'
            }}>
              <div style={{ fontWeight: 600, color: entry.sender === 'user' ? 'var(--accent-primary)' : 'var(--status-healthy)', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '2px' }}>
                {entry.sender === 'user' ? 'SRE' : 'Agent'}
              </div>
              <div style={{ color: 'var(--text-main)', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {entry.text}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem', marginTop: '2px' }}>
                {new Date(entry.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


// Main App Component
function App() {
  const [contextData, setContextData] = useState(null);

  const handleAgentAction = (actionType, data) => {
    setContextData({ type: actionType, data });
  };

  const renderContextContent = () => {
    if (!contextData) {
      return <Dashboard />;
    }

    if (contextData.type === 'show_next_gen_workflow') {
      return <NextGenWorkflow data={contextData.data[0]} />;
    }

    if (contextData.type === 'show_knowledge_base') {
      return <PastLearningsTimeline data={contextData.data} />;
    }

    if (contextData.type === 'show_daily_plan') {
      return <DailyPlanView data={contextData.data[0]} />;
    }

    if (contextData.type === 'show_issues') {
      return <ActiveIssuesView data={contextData.data} />;
    }

    if (contextData.type === 'show_flows') {
      return <AvailableFlowsView data={contextData.data} />;
    }

    if (contextData.type === 'show_recommendation') {
      return <RecommendationView data={contextData.data[0]} />;
    }
    
    // Default fallback
    return <Dashboard />;
  };

  return (
    <div className="app-container">
      {/* Central Chat Interface */}
      <ChatInterface onAgentAction={handleAgentAction} />
      
      {/* Right Navigation / Work Area */}
      <div style={{ flex: 1.4, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="glass-panel" style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.3s ease-out', border: '1px solid rgba(37, 99, 235, 0.15)', boxShadow: '0 4px 24px rgba(37, 99, 235, 0.04)' }}>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {renderContextContent()}
          </div>
        </div>
        <PastSessionsSidebar />
      </div>
    </div>
  );
}

export default App;
