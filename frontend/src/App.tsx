import React, { useState, useRef, useEffect } from 'react';
import './App.css';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

function App() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add a welcome message when the component mounts
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: Date.now(),
        text: "Hi! I'm Khalid's AI assistant. Ask me anything about his work, skills, or experience.",
        sender: 'bot'
      }]);
    }
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageToSend = inputValue.trim();
    if (!messageToSend) return;

    const userMsg: Message = {
      id: Date.now(),
      text: messageToSend,
      sender: 'user',
    };
    setMessages((msgs) => [...msgs, userMsg]);
    setInputValue('');
    setIsSending(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend }),
      });
      const data = await response.json();
      
      setMessages((msgs) => [
        ...msgs,
        {
          id: Date.now() + 1,
          text: data.text,
          sender: 'bot'
        },
      ]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        {
          id: Date.now() + 1,
          text: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
          sender: 'bot',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="portfolio-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-brand">Khalid Khan</div>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#experience">Experience</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      <div className="main-content">
        {/* Chatbot Sidebar */}
        <div className="chatbot-sidebar">
          <div className="chat-header">
            <div className="chat-title">AI Assistant</div>
            <div className="chat-subtitle">Ask me anything</div>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                <div className="message-content">{msg.text}</div>
              </div>
            ))}
            
            {isSending && (
              <div className="message bot">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSend} className="chat-input-form">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about Khalid..."
              className="chat-input"
              disabled={isSending}
            />
            <button type="submit" className="chat-send-btn" disabled={isSending || !inputValue.trim()}>
              →
            </button>
          </form>
        </div>

        {/* Portfolio Content */}
        <div className="portfolio-content">
          <section id="about" className="hero-section">
            <div className="hero-content">
              <h1 className="hero-title">
                I am <span className="highlight">Khalid</span>
              </h1>
              <p className="hero-subtitle">
                A passionate technologist crafting digital experiences that bridge imagination and innovation
              </p>
              <div className="hero-description">
                <p>
                  In the vast canvas of technology, I paint with code, sculpt with algorithms, and compose with data. 
                  Every project is a story waiting to be told, every line of code a brushstroke on the digital canvas.
                </p>
                <p>
                  I believe in the poetry of problem-solving, where elegant solutions emerge from the harmony of 
                  creativity and logic. My work is not just about building software—it's about creating experiences 
                  that resonate with the human spirit.
                </p>
              </div>
            </div>
          </section>

          <section id="experience" className="section">
            <h2 className="section-title">Journey Through Time</h2>
            <div className="experience-grid">
              <div className="experience-card">
                <div className="experience-header">
                  <h3>Software Engineer</h3>
                  <span className="experience-period">2023 - Present</span>
                </div>
                <p className="experience-description">
                  Crafting digital solutions that transform ideas into reality, one algorithm at a time.
                </p>
              </div>
              
              <div className="experience-card">
                <div className="experience-header">
                  <h3>Full Stack Developer</h3>
                  <span className="experience-period">2022 - 2023</span>
                </div>
                <p className="experience-description">
                  Weaving the threads of frontend and backend into seamless digital tapestries.
                </p>
              </div>
            </div>
          </section>

          <section id="projects" className="section">
            <h2 className="section-title">Digital Artifacts</h2>
            <div className="projects-grid">
              <div className="project-card">
                <h3>AI-Powered Portfolio</h3>
                <p>A conversational interface that brings my story to life through intelligent dialogue.</p>
              </div>
              
              <div className="project-card">
                <h3>Data Symphony</h3>
                <p>Orchestrating complex datasets into harmonious visual narratives.</p>
              </div>
              
              <div className="project-card">
                <h3>Cloud Architecture</h3>
                <p>Building scalable foundations that support the dreams of tomorrow.</p>
              </div>
            </div>
          </section>

          <section id="contact" className="section">
            <h2 className="section-title">Let's Create Together</h2>
            <div className="contact-content">
              <p>
                Ready to embark on a journey of digital innovation? Let's transform your vision into reality.
              </p>
              <div className="contact-links">
                <a href="mailto:khalid@example.com" className="contact-link">Email</a>
                <a href="https://linkedin.com/in/khalid" className="contact-link">LinkedIn</a>
                <a href="https://github.com/khalid" className="contact-link">GitHub</a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
