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
        text: "Hi there! I'm Khalid's chatbot. I can tell you all about him - his skills, experience, projects, and more. What would you like to know?",
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
    <div className="app-container">
      <div className="chat-area">
        <div className="messages-list">
          {messages.map((msg) => (
            <div key={msg.id} className="message-container">
              <div className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          
          {isSending && (
            <div className="message-container">
              <div className="chat-bubble bot-bubble">
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
        
        <form onSubmit={handleSend} className="input-area">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything about Khalid..."
            className="message-input"
            disabled={isSending}
          />
          <button type="submit" className="send-button" disabled={isSending || !inputValue.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
