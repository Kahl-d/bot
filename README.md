# AI-Powered Portfolio Chatbot

A sophisticated portfolio chatbot built with Python FastAPI backend and React TypeScript frontend. Features an AI-powered conversational interface using OpenAI's GPT-3.5-turbo with vector search for efficient, context-aware responses.

## Project Structure

```
bot/
├── backend/          # Python FastAPI backend with AI integration
│   ├── main.py       # Main application with LangChain and OpenAI
│   ├── requirements.txt
│   └── .env          # Environment variables (create this file)
└── frontend/         # React TypeScript frontend
    ├── src/
    │   ├── App.tsx   # Portfolio layout with integrated chatbot
    │   ├── App.css   # Modern, responsive styles
    │   └── ...
    └── package.json
```

## Features

- **AI-Powered Chatbot**: Uses OpenAI GPT-3.5-turbo for natural conversations
- **Vector Search**: FAISS-based retrieval for efficient context selection
- **Portfolio Layout**: Beautiful portfolio with chatbot sidebar (20% width)
- **Responsive Design**: Works perfectly on all device sizes
- **TypeScript**: Full type safety for better development experience
- **FastAPI Backend**: Fast, modern Python web framework
- **LangChain Integration**: Advanced AI orchestration and prompt management
- **Cost-Efficient**: Minimal token usage through smart context retrieval

## Setup Instructions

### Environment Setup

1. **Get OpenAI API Key**:
   - Go to [https://platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)
   - Create a new API key

2. **Create Environment File**:
   ```bash
   cd backend
   touch .env
   ```

3. **Add your API key to `.env`**:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the backend server:
   ```bash
   python main.py
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## Portfolio Layout

The new design features:

- **Left Sidebar (20% width)**: Always-visible AI chatbot
- **Right Content (80% width)**: Your portfolio with sections:
  - Hero section with artistic introduction
  - Experience timeline
  - Project showcase
  - Contact information
- **Fixed Navigation**: Smooth scrolling navigation
- **Minimalistic Design**: Clean, modern aesthetic

## Customizing Your Information

Edit the `KNOWLEDGE_CHUNKS` in `backend/main.py` to customize:

- Personal information (name, age, location, education)
- Skills and technologies
- Work experience
- Projects
- Contact information
- Any other relevant information

The AI will use this information to answer questions naturally and conversationally.

## API Endpoints

- `GET /` - Root endpoint
- `GET /api/health` - Health check
- `POST /api/contact` - Contact form submission
- `POST /api/chat` - AI-powered chat endpoint

## How It Works

The AI chatbot uses advanced techniques for efficient, natural conversations:

1. **Vector Search**: FAISS retrieves relevant context based on user questions
2. **Dynamic Prompting**: Creates focused prompts with only relevant information
3. **Token Optimization**: Minimizes API costs by sending only necessary context
4. **Natural Responses**: Generates conversational, human-like answers
5. **Context Awareness**: Understands conversation flow and provides relevant information

## Example Questions

- "Tell me about yourself"
- "What are your skills?"
- "Show me your projects"
- "How can I contact you?"
- "What's your experience with machine learning?"
- "Tell me about your education"
- "What technologies do you use?"

## Security Notes

- **API Key Protection**: The `.env` file is excluded from version control
- **No Secrets in Code**: All sensitive information is stored in environment variables
- **Git History Cleaned**: Previous commits with API keys have been removed

## Development

Both backend and frontend support hot reloading during development. Make changes to your code and see them reflected immediately!

## Troubleshooting

### Common Issues:

1. **API Key Error**: Make sure your OpenAI API key is valid and has sufficient credits
2. **Import Errors**: Ensure all dependencies are installed with `pip install -r requirements.txt`
3. **CORS Issues**: The backend is configured to allow requests from `http://localhost:3000`

### Performance Tips:

- The chatbot uses efficient vector search to minimize API costs
- Responses are cached and optimized for speed
- The frontend is optimized for fast loading and smooth interactions

## Next Steps

This AI-powered chatbot can be enhanced by:

1. Adding conversation memory
2. Implementing user authentication
3. Adding more sophisticated prompt engineering
4. Creating custom embeddings
5. Adding voice input/output
6. Implementing analytics and usage tracking 