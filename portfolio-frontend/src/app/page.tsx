"use client";
import React, { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ query: string; response: string }[]>([]);
  const [chatMode, setChatMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/chat?query=${encodeURIComponent(input)}`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setChatHistory([...chatHistory, { query: input, response: data.response }]);
      setInput('');
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const enterChatMode = () => {
    setChatMode(true);
  };

  const exitChatMode = () => {
    setChatMode(false);
    setChatHistory([]);
    setInput('');
  };

  return (
    <div className="bg-black text-white min-h-screen relative">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black bg-opacity-30 backdrop-blur-md p-4 flex justify-end">
        <ul className="flex space-x-4">
          <li><a href="#about" className="hover:text-blue-400">About</a></li>
          <li><a href="#projects" className="hover:text-blue-400">Projects</a></li>
          <li><a href="#contact" className="hover:text-blue-400">Contact</a></li>
        </ul>
      </nav>

      {/* Content */}
      <section className="h-screen pt-20 flex justify-center items-center">
        <h1 className="text-4xl">Welcome to My Portfolio</h1>
      </section>
      <section className="h-screen pt-20" id="about">
        <h2 className="text-3xl p-8">About Section</h2>
      </section>
      <section className="h-screen pt-20" id="projects">
        <h2 className="text-3xl p-8">Projects Section</h2>
      </section>
      <section className="h-screen pt-20" id="contact">
        <h2 className="text-3xl p-8">Contact Section</h2>
      </section>

      {/* Input bar */}
      {!chatMode && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-2/3 max-w-xl">
          <input
            type="text"
            placeholder="Ask me something..."
            onFocus={enterChatMode}
            className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none"
          />
        </div>
      )}

      {/* Chat overlay */}
      {chatMode && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-70 backdrop-blur-sm flex flex-col justify-between">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.map((chat, idx) => (
              <div key={idx} className="flex flex-col space-y-1">
                <div className="flex justify-end">
                  <p className="bg-blue-600 p-2 rounded-lg max-w-sm">{chat.query}</p>
                </div>
                <div className="flex justify-start">
                  <p className="bg-green-600 p-2 rounded-lg max-w-sm">{chat.response}</p>
                </div>
              </div>
            ))}
          </div>
          <form 
            onSubmit={handleSubmit}
            className="w-full p-4 bg-black bg-opacity-50 flex space-x-2"
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 rounded bg-gray-700 text-white focus:outline-none"
              autoFocus
            />
            <button 
              type="submit"
              className="p-2 bg-blue-500 rounded text-sm hover:bg-blue-600"
            >
              Send
            </button>
            <button 
              type="button" 
              onClick={exitChatMode}
              className="p-2 text-sm text-gray-300 hover:text-white"
            >
              Exit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
