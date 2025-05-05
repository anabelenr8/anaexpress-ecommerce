import React, { useState } from 'react';
import { FaComments, FaTimes } from 'react-icons/fa';
import '../../styles/ChatSupport.css';


const ChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! How can we help you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState('');

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Fake bot reply after 1 second
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: "Thanks for your message! We'll get back to you soon.", sender: "bot" }]);
    }, 1000);
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
        }}
      >
        {isOpen ? (
          <div style={{ width: '300px', height: '400px', background: '#fff', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.2)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#0d6efd', padding: '10px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Live Chat</span>
              <FaTimes style={{ cursor: 'pointer' }} onClick={toggleChat} />
            </div>
            <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
              {messages.map((msg, index) => (
                <div key={index} style={{ textAlign: msg.sender === "user" ? "right" : "left", marginBottom: '10px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '8px 12px',
                      borderRadius: '20px',
                      background: msg.sender === "user" ? '#dcf8c6' : '#f1f0f0',
                      maxWidth: '80%',
                    }}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
            </div>
            <form onSubmit={handleSend} style={{ display: 'flex', borderTop: '1px solid #ccc' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                style={{ flex: 1, padding: '10px', border: 'none' }}
              />
              <button type="submit" style={{ padding: '10px', background: '#0d6efd', color: '#fff', border: 'none' }}>Send</button>
            </form>
          </div>
        ) : (
          <button onClick={toggleChat} style={{ background: '#0d6efd', color: '#fff', borderRadius: '50%', padding: '15px', border: 'none', boxShadow: '0 0 10px rgba(0,0,0,0.3)' }}>
            <FaComments size={24} />
          </button>
        )}
      </div>
    </>
  );
};

export default ChatSupport;

