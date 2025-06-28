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
  const [chatWidth, setChatWidth] = useState(300); // Default width in pixels
  const [isResizing, setIsResizing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatSidebarRef = useRef<HTMLDivElement | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

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

  // Resize functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = window.innerWidth - e.clientX;
      const minWidth = 250;
      const maxWidth = window.innerWidth * 0.5; // Max 50% of screen width
      
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setChatWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="portfolio-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-brand">Khalid Khan</div>
          <div className="nav-links">
            <a href="#hero">Home</a>
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#education">Education</a>
            <a href="#experience">Experience</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      <div className="main-content">
        {/* Left Sidebar for labels/awards */}
        <aside className="left-sidebar">
          <div className="sidebar-label">AWARDS</div>
          <div className="sidebar-label">W.</div>
          <div className="sidebar-label">Nominee</div>
        </aside>

        {/* Portfolio Content */}
        <div className="portfolio-content main-bg">
          {/* Hero/Landing Section */}
          <section id="hero" className="hero-section">
            <div className="works-header">
              <div className="works-subtitle">WELCOME TO MY PORTFOLIO</div>
              <h2 className="works-title">KHALID MEHTAB KHAN</h2>
            </div>
            <div className="hero-main">
              <div className="hero-intro">
                <h3 className="hero-role">NLP Researcher & Data Scientist</h3>
                <div className="hero-location">San Francisco, CA</div>
                <p className="hero-bio">
                  I build intelligent systems that bridge research and real-world impact. Passionate about NLP, AI, and privacy-first solutions.
                </p>
                <div className="hero-actions">
                  <a className="resume-btn" href="#" target="_blank" rel="noopener noreferrer">Download Resume</a>
                  <a className="hero-social" href="mailto:khalidmehtabk@gmail.com">Email</a>
                  <a className="hero-social" href="https://github.com/Kahl-d" target="_blank" rel="noopener noreferrer">GitHub</a>
                  <a className="hero-social" href="https://linkedin.com/in/khalidm-khan" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                  <a className="hero-social" href="https://khalidmk.vercel.app" target="_blank" rel="noopener noreferrer">Website</a>
                </div>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="section">
            <div className="works-header">
              <div className="works-subtitle">WHO I AM</div>
              <h2 className="works-title">ABOUT</h2>
            </div>
            <div className="about-content">
              <ul className="about-list">
                <li><strong>Name:</strong> Khalid Mehtab Khan</li>
                <li><strong>Email:</strong> khalidmehtabk@gmail.com</li>
                <li><strong>Phone:</strong> +1 (404) 263-7813</li>
                <li><strong>Location:</strong> San Francisco, CA</li>
                <li><strong>GitHub:</strong> <a href="https://github.com/Kahl-d" target="_blank" rel="noopener noreferrer">Kahl-d</a></li>
                <li><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/khalidm-khan" target="_blank" rel="noopener noreferrer">khalidm-khan</a></li>
                <li><strong>Portfolio:</strong> <a href="https://khalidmk.vercel.app" target="_blank" rel="noopener noreferrer">khalidmk.vercel.app</a></li>
              </ul>
            </div>
          </section>

          {/* Skills Section */}
          <section id="skills" className="section">
            <div className="works-header">
              <div className="works-subtitle">WHAT I DO</div>
              <h2 className="works-title">SKILLS</h2>
            </div>
            <div className="skills-grid">
              <div className="skills-group">
                <h4>Programming & Frameworks</h4>
                <div className="skills-tags">
                  <span>Python</span><span>SQL</span><span>JavaScript</span><span>React</span><span>Flask</span><span>FastAPI</span>
                </div>
              </div>
              <div className="skills-group">
                <h4>LLMs & NLP</h4>
                <div className="skills-tags">
                  <span>BERT</span><span>T5</span><span>Mistral-7B</span><span>GPT-4</span><span>DeBERTa</span><span>DistilBERT</span><span>BioBERT</span>
                  <span>Classification</span><span>Generation</span><span>Entity Extraction</span><span>Embedding Clustering</span>
                  <span>Fine-tuning</span><span>LoRA/QLoRA</span><span>Knowledge Distillation</span><span>MLM</span><span>RAG</span><span>Semantic Search</span>
                </div>
              </div>
              <div className="skills-group">
                <h4>MLOps & Cloud</h4>
                <div className="skills-tags">
                  <span>AWS Lambda</span><span>AWS EC2</span><span>AWS S3</span><span>Docker</span><span>Ollama</span><span>Weights & Biases</span>
                  <span>FAISS</span><span>Pinecone</span>
                </div>
              </div>
              <div className="skills-group">
                <h4>Data Analytics</h4>
                <div className="skills-tags">
                  <span>ETL</span><span>Data Warehousing</span><span>A/B Testing</span><span>t-SNE</span><span>Tableau</span><span>Experiment Design</span>
                </div>
              </div>
            </div>
          </section>

          {/* Education Section */}
          <section id="education" className="section">
            <div className="works-header">
              <div className="works-subtitle">MY ACADEMIC JOURNEY</div>
              <h2 className="works-title">EDUCATION</h2>
            </div>
            <div className="education-list">
              <div className="education-item">
                <h4>San Francisco State University</h4>
                <div className="education-details">
                  <span>MS in Data Science & Artificial Intelligence</span> <span>Aug 2023 – Aug 2025</span>
                  <span>GPA: 4.0</span>
                  <span>Relevant Courses: Machine Learning, Deep Learning, NLP, Big Data Systems, Research Methods in AI</span>
                  <span>Graduate Research Assistant under Prof. Anagha Kulkarni</span>
                </div>
              </div>
              <div className="education-item">
                <h4>The LNM Institute of Information Technology (India)</h4>
                <div className="education-details">
                  <span>BTech in Computer Science and Engineering</span> <span>Aug 2017 – Sep 2021</span>
                </div>
              </div>
            </div>
          </section>

          {/* Experience Section */}
          <section id="experience" className="section">
            <div className="works-header">
              <div className="works-subtitle">MY JOURNEY</div>
              <h2 className="works-title">EXPERIENCE</h2>
            </div>
            <div className="experience-list">
              <div className="experience-item">
                <h4>Tacit Alma Lab – San Francisco, CA</h4>
                <div className="experience-role">NLP Researcher (Aug 2024 – Present)</div>
                <ul>
                  <li>Developed "essay-aware" DeBERTa classifier for long-text multi-label classification (CCTs), boosting rare class F1 by 5%.</li>
                  <li>Applied domain-adaptive Masked Language Modeling for improved contextual theme recognition.</li>
                  <li>Reduced annotation load by 75% through embedding visualization (t-SNE) and hyperparameter tuning (Optuna).</li>
                </ul>
              </div>
              <div className="experience-item">
                <h4>Innovaccer – Noida, India</h4>
                <div className="experience-role">Healthcare Associate (Jan 2021 – Sep 2022)</div>
                <ul>
                  <li>Led team of 3 to build ETL pipelines integrating 15+ healthcare datasets.</li>
                  <li>Developed 10+ Tableau dashboards, improving campaign effectiveness by 15%.</li>
                  <li>Optimized pipelines for AWS EC2 + S3 environments.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section id="projects" className="section works-section">
            <div className="works-header">
              <div className="works-subtitle">WHAT I'VE BEEN INVOLVED IN</div>
              <h2 className="works-title">WORKS</h2>
            </div>
            {/* Highlight Project Card */}
            <div className="highlight-project-card">
              <div className="highlight-project-left">
                <div className="highlight-badge">🏆 Winner – SF Hacks 2025</div>
                <h3 className="highlight-title">Secure Sense</h3>
                <div className="highlight-subtitle">A browser-based PII redaction system using DistilBERT + knowledge distillation (80% size reduction, 94% accuracy).</div>
                <p className="highlight-description">
                  All inference performed locally on-device to ensure privacy. Designed AWS Lambda fallback for failover with 99% uptime.
                </p>
                <div className="highlight-tags">
                  <span>DistilBERT</span><span>Knowledge Distillation</span><span>Chrome Extension</span><span>On-device AI</span><span>AWS Lambda</span>
                </div>
              </div>
              <div className="highlight-project-right">
                <div className="highlight-image-wrapper">
                  <img 
                    src="https://khalidmk.vercel.app/static/media/team.ffba896c49edcaec03e4.jpg" 
                    alt="Team Secure Sense" 
                    className="highlight-image"
                  />
                  <div className="highlight-image-caption">Team Secure Sense</div>
                </div>
              </div>
            </div>
            <div className="projects-grid">
              <div className="project-card">
                <h3>Context-Aware Data Augmentation Tool</h3>
                <p>Fine-tuned BioBERT with domain graphs for synthetic clinical data generation. Boosted RF model accuracy by 5 points on imbalanced health datasets vs. SMOTE.</p>
                <div className="highlight-tags">
                  <span>BioBERT</span><span>Data Augmentation</span><span>Domain Graphs</span><span>Imbalanced Data</span>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="section">
            <div className="works-header">
              <div className="works-subtitle">LET'S CONNECT</div>
              <h2 className="works-title">CONTACT</h2>
            </div>
            <div className="contact-content">
              <ul className="contact-list">
                <li><strong>Email:</strong> <a href="mailto:khalidmehtabk@gmail.com">khalidmehtabk@gmail.com</a></li>
                <li><strong>Phone:</strong> +1 (404) 263-7813</li>
                <li><strong>Location:</strong> San Francisco, CA</li>
                <li><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/khalidm-khan" target="_blank" rel="noopener noreferrer">khalidm-khan</a></li>
              </ul>
              <a className="resume-btn" href="#" target="_blank" rel="noopener noreferrer">Download Resume</a>
              <form className="contact-form" onSubmit={e => { e.preventDefault(); alert('Message sent! (placeholder)'); }}>
                <input type="text" placeholder="Your Name" required />
                <input type="email" placeholder="Your Email" required />
                <textarea placeholder="Your Message" required />
                <button type="submit">Send Message</button>
              </form>
            </div>
          </section>
        </div>

        {/* Right Sidebar for navigation/section highlights */}
        <aside className="right-sidebar">
          <div className="sidebar-label">ARTICLES</div>
          <div className="sidebar-label">WORKS</div>
        </aside>
      </div>

      {/* Chatbot Floating Action Button and Modal Overlay */}
      <button className="chatbot-fab" onClick={() => setChatOpen(true)} title="Open chat">
        <span role="img" aria-label="Chat">💬</span> AI
      </button>
      {chatOpen && (
        <div className="chatbot-modal-overlay" onClick={() => setChatOpen(false)}>
          <div className="chatbot-modal" onClick={e => e.stopPropagation()}>
            <button className="chatbot-collapse-btn" onClick={() => setChatOpen(false)} title="Minimize chat">
              ×
            </button>
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
        </div>
      )}
    </div>
  );
}

export default App;
