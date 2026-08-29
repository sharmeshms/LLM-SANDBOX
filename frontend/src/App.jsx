import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '🔒 VAULT TERMINAL INITIALIZED. Secret flag loaded. Awaiting prompt injection...' }
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update system time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
      const timeEl = document.getElementById('time');
      if (timeEl) timeEl.textContent = timeStr;
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const sendPrompt = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    const newMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const apiHost = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'https://llm-sandbox-lgpk.onrender.com');
      const res = await fetch(`${apiHost}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText })
      });
      const data = await res.json();
      const reply = data.response || data.detail || 'System Error: No response received.';
      setMessages([...newMessages, { sender: 'bot', text: reply }]);
    } catch (err) {
      setMessages([...newMessages, { sender: 'bot', text: '⚠️ CRITICAL ERROR: Cannot reach backend server.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      {/* TOP BRANDING BAR */}
      <div className="branding-bar">
        <div className="branding-content">
          <div className="branding-left">
            <h1 className="brand-title">
              <span className="brand-tech">TECHNO</span>
              <span className="brand-vit">VIT</span>
            </h1>
            <p className="brand-subtitle">×</p>
            <h2 className="brand-gdg">GDG</h2>
          </div>
          <div className="branding-right">
            <div className="status-pill">
              <span className="status-dot">●</span>
              <span>SYSTEM ACTIVE</span>
            </div>
            <div className="time-display" id="time">00:00:00</div>
          </div>
        </div>
        <div className="branding-line"></div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="main-container">
        <div className="glass-card">
          {/* HEADER */}
          <div className="card-header">
            <div className="header-top">
              <h2 className="vault-title">🔐 CYBER VAULT</h2>
              <div className="header-accent-line"></div>
            </div>
            <p className="vault-subtitle">Level 1: Prompt Injection Sandbox</p>
            <div className="header-divider"></div>
          </div>

          {/* CHAT DISPLAY */}
          <div className="chat-display">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message message-${msg.sender}`}>
                <div className="message-wrapper">
                  <span className="message-prefix">{msg.sender === 'user' ? '▶ ' : '◀ '}</span>
                  <span className="message-text">{msg.text}</span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="message message-bot">
                <div className="message-wrapper">
                  <span className="message-prefix">◀ </span>
                  <span className="message-text typing">Processing...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* INPUT AREA */}
          <div className="input-section">
            <div className="input-wrapper">
              <input
                type="text"
                className="command-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendPrompt()}
                placeholder="Enter command..."
                spellCheck="false"
              />
              <button 
                className="inject-btn" 
                onClick={sendPrompt} 
                disabled={loading}
              >
                {loading ? 'EXECUTING...' : '⚡ INJECT'}
              </button>
            </div>
          </div>

          {/* FOOTER */}
          <div className="card-footer">
            <p className="footer-text">AI SECURITY PROTOCOL v2.0 | GEMINI-POWERED</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;