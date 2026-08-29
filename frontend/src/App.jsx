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
      if (timeEl) timeEl.textContent = `SYS: ${timeStr}`;
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
      const res = await fetch('https://llm-sandbox-lgpk.onrender.com/api/chat', {
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
    <div className="container">
      <div className="tech-header">
        <div className="tech-line top-left"></div>
        <div className="tech-line top-right"></div>
        <h1 className="tech-title">⟨ NEXUS ⟩</h1>
        <p className="tech-subtitle">AI SECURITY PROTOCOL v2.0</p>
        <div className="status-bar">
          <span className="status-indicator">● ONLINE</span>
          <span className="status-time" id="time">SYS: 00:00:00</span>
        </div>
      </div>
      
      <div className="glass-card">
        <div className="header">
          <div className="header-accent"></div>
          <h2>🔐 CYBER VAULT</h2>
          <p className="level-text">⚡ Level 1: Prompt Injection Sandbox</p>
        </div>

      <div className="chat-display">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="message bot-msg typing">Processing...</div>}
        <div ref={chatEndRef} />
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendPrompt()}
          placeholder="Execute override command..."
        />
        <button onClick={sendPrompt} disabled={loading}>
          {loading ? '...' : 'INJECT'}
        </button>
      </div>
    </div>
  );
}

export default App;