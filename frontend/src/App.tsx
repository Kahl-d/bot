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
  const [isFloatingChat, setIsFloatingChat] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      // If the bottom of the hero is above the top of the viewport, show floating chat
      setIsFloatingChat(rect.bottom < 60);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
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
      <nav className="navbar main-navbar">
        <div className="nav-content">
          <div className="nav-brand">Khalid Mehtab Khan</div>
          <div className="nav-links">
            <a href="#hero">Home</a>
            <a href="#projects">Projects</a>
            <a href="#education">Education</a>
            <a href="#skills">Skills</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      <div className="main-content">
        {/* Left Sidebar for links */}
        <aside className="left-sidebar">
          <a className="sidebar-label sidebar-link" href="https://medium.com/" target="_blank" rel="noopener noreferrer">Articles</a>
          <a className="sidebar-label sidebar-link" href="https://your-research-page.com/" target="_blank" rel="noopener noreferrer">Research</a>
          <a className="sidebar-label sidebar-link" href="https://github.com/Kahl-d" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a className="sidebar-label sidebar-link" href="https://instagram.com/" target="_blank" rel="noopener noreferrer">Instagram</a>
        </aside>

        {/* Portfolio Content */}
        <div className="portfolio-content main-bg">
          {/* Hero/Landing Section */}
          <section id="hero" className="hero-section" ref={heroRef}>
            <div className="hero-main hero-minimal">
              <div className="hero-intro">
                <h1 className="hero-name">Khalid Mehtab Khan</h1>
                <h2 className="hero-role">NLP Researcher & Data Scientist</h2>
                <div className="hero-location">San Francisco, CA</div>
                <p className="hero-bio">
                  Building intelligent systems that bridge research and real-world impact. Passionate about NLP, AI, and privacy-first solutions.
                </p>
              </div>
              {/* Embedded Chat Input (centered or floating) */}
              <div className={isFloatingChat ? "embedded-chat floating-chat" : "embedded-chat"}>
                <div className="chat-header-hero">Ask Khalid</div>
                <div className="chat-messages-hero">
                  {messages.length > 0 && (
                    <div className="message bot hero-bot-message">
                      <div className="message-content hero-message-content">{messages[messages.length - 1].text}</div>
                    </div>
                  )}
                </div>
                <form onSubmit={handleSend} className="chat-input-form-hero">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder="Ask me anything about my work, research, or experience..."
                    className="chat-input-hero"
                    disabled={isSending}
                  />
                  <button type="submit" className="chat-send-btn-hero" disabled={isSending || !inputValue.trim()}>
                    →
                  </button>
                </form>
              </div>
            </div>
          </section>

          {/* Research Section */}
          <section id="research" className="section research-section">
            <div className="works-header">
              <div className="works-subtitle">MY RESEARCH STORY</div>
              <h2 className="works-title">RESEARCH</h2>
            </div>
            <div className="research-content">
              <div className="research-narrative">
                <p>
                  As a Graduate Research Assistant at SFSU's Tacit Alma Lab, I spearheaded multi-label classification of Cultural Capital Themes (CCTs) in student essays using transformer models. My work focused on designing essay-aware modeling pipelines, improving theme-specific F1 scores for underrepresented classes like "Resistance" and "Perseverance."
                </p>
                <p>
                  I performed domain-adaptive pretraining, conducted embedding analysis using t-SNE, and integrated results with Weights & Biases for scalable experiment tracking. My research bridges generative and classification-based approaches to thematic understanding, and I am currently exploring LLMs for qualitative theme generation and vector clustering.
                </p>
              </div>
              <div className="research-diagram">
                {/* Placeholder for a dynamic diagram/visual */}
                <div className="diagram-placeholder">[Research Diagram Placeholder]</div>
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section id="projects" className="section works-section">
            <div className="works-header">
              <div className="works-subtitle">SELECTED WORK</div>
              <h2 className="works-title">PROJECTS</h2>
            </div>
            <div className="project-story">
              <div className="project-visual">
                <img src="https://khalidmk.vercel.app/static/media/team.ffba896c49edcaec03e4.jpg" alt="Secure Sense Team" className="project-image" />
              </div>
              <div className="project-narrative">
                <h3>Secure Sense <span className="project-badge">Winner – SF Hacks 2025</span></h3>
                <p>
                  I led the development of Secure Sense, a browser-based PII redaction system using DistilBERT and knowledge distillation (80% size reduction, 94% accuracy). All inference is performed locally on-device to ensure privacy, with an AWS Lambda fallback for 99% uptime. This project won the Emerging AI Innovation award at SF Hacks 2025.
                </p>
              </div>
            </div>
            <div className="project-story">
              <div className="project-visual">
                <div className="project-image-placeholder">[BioBERT Augmentation Visual]</div>
              </div>
              <div className="project-narrative">
                <h3>Context-Aware Data Augmentation Tool</h3>
                <p>
                  I fine-tuned BioBERT with domain graphs for synthetic clinical data generation, boosting Random Forest model accuracy by 5 points on imbalanced health datasets compared to SMOTE. This tool enables more robust, fair clinical ML models.
                </p>
              </div>
            </div>
          </section>

          {/* Education Section */}
          <section id="education" className="section">
            <div className="works-header">
              <div className="works-subtitle">EDUCATION</div>
              <h2 className="works-title">EDUCATION</h2>
            </div>
            <div className="education-block no-bg">
              <div className="education-main no-bg">
                <h4>San Francisco State University</h4>
                <div className="education-details">
                  MS in Data Science & Artificial Intelligence, 2023–2025<br />
                  GPA: 4.0<br />
                  Graduate Research Assistant, Tacit Alma Lab
                </div>
              </div>
              <div className="education-main no-bg">
                <h4>The LNM Institute of Information Technology (India)</h4>
                <div className="education-details">
                  BTech in Computer Science and Engineering, 2017–2021
                </div>
              </div>
            </div>
          </section>

          {/* Skills Section (compact, filterable, grouped) */}
          <section id="skills" className="skills-mini-section">
            <div className="skills-mini-title">Skills</div>
            <input className="skills-search" type="text" placeholder="Search skills..." onChange={e => {
              const val = e.target.value.toLowerCase();
              document.querySelectorAll<HTMLSpanElement>('.skills-grouped span').forEach(el => {
                if (el.textContent && el.textContent.toLowerCase().includes(val)) {
                  el.style.display = '';
                } else {
                  el.style.display = 'none';
                }
              });
            }} />
            <div className="skills-grouped">
              <div className="skills-grouped-block">
                <div className="skills-grouped-label">Programming & Frameworks</div>
                <span>Python</span><span>SQL</span><span>JavaScript</span><span>React</span><span>Flask</span><span>FastAPI</span>
              </div>
              <div className="skills-grouped-block">
                <div className="skills-grouped-label">LLMs & NLP</div>
                <span>BERT</span><span>T5</span><span>Mistral-7B</span><span>GPT-4</span><span>DeBERTa</span><span>DistilBERT</span><span>BioBERT</span>
                <span>Classification</span><span>Generation</span><span>Entity Extraction</span><span>Embedding Clustering</span>
                <span>Fine-tuning</span><span>LoRA/QLoRA</span><span>Knowledge Distillation</span><span>MLM</span><span>RAG</span><span>Semantic Search</span>
              </div>
              <div className="skills-grouped-block">
                <div className="skills-grouped-label">MLOps & Cloud</div>
                <span>AWS Lambda</span><span>AWS EC2</span><span>AWS S3</span><span>Docker</span><span>Ollama</span><span>Weights & Biases</span>
                <span>FAISS</span><span>Pinecone</span>
              </div>
              <div className="skills-grouped-block">
                <div className="skills-grouped-label">Data Analytics</div>
                <span>ETL</span><span>Data Warehousing</span><span>A/B Testing</span><span>t-SNE</span><span>Tableau</span><span>Experiment Design</span>
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

          {/* Contact Section */}
          <section id="contact" className="section">
            <div className="works-header">
              <div className="works-subtitle">LET'S CONNECT</div>
              <h2 className="works-title">CONTACT</h2>
            </div>
            <div className="contact-content no-bg">
              <ul className="contact-list">
                <li><strong>Email:</strong> <a href="mailto:khalidmehtabk@gmail.com">khalidmehtabk@gmail.com</a></li>
                <li><strong>Phone:</strong> +1 (404) 263-7813</li>
                <li><strong>Location:</strong> San Francisco, CA</li>
                <li><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/khalidm-khan" target="_blank" rel="noopener noreferrer">khalidm-khan</a></li>
              </ul>
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
