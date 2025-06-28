# Simple Portfolio Chatbot

A simple portfolio chatbot built with Python FastAPI backend and React TypeScript frontend. Uses basic pattern matching for direct answers from a knowledge base.

## Project Structure

```
bot/
├── backend/          # Python FastAPI backend
│   ├── main.py       # Main application file with simple pattern matching
│   └── requirements.txt
└── frontend/         # React TypeScript frontend
    ├── src/
    │   ├── App.tsx   # Main React component
    │   ├── App.css   # Styles
    │   └── ...
    └── package.json
```

## Features

- **Simple Pattern Matching**: Direct answers based on keyword matching
- **Knowledge Base**: Easy to customize with your own information
- **Modern UI**: Beautiful gradient design with smooth animations
- **Responsive Design**: Works perfectly on all device sizes
- **TypeScript**: Full type safety for better development experience
- **FastAPI Backend**: Fast, modern Python web framework
- **No External APIs**: No OpenAI or other external dependencies needed

## Setup Instructions

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

## Customizing Your Information

Edit the `KNOWLEDGE_BASE` in `backend/main.py` to customize:

- Personal information (name, age, location, education)
- Skills and technologies
- Work experience
- Projects
- Contact information
- Languages spoken
- Hobbies and interests

## API Endpoints

- `GET /` - Root endpoint
- `GET /api/health` - Health check
- `POST /api/contact` - Contact form submission
- `POST /api/chat` - Chat endpoint with pattern matching

## How It Works

The chatbot uses simple keyword matching to provide direct answers:

1. **Pattern Matching**: Looks for specific keywords in user messages
2. **Direct Responses**: Returns predefined answers from the knowledge base
3. **Rich Components**: Displays information in formatted components (skills grid, experience timeline, etc.)
4. **Interactive Buttons**: Provides quick action buttons for common questions

## Example Questions

- "Tell me about yourself"
- "What are your skills?"
- "Show me your projects"
- "How can I contact you?"
- "Where do you live?"
- "What languages do you speak?"

## Next Steps

This is a simple, lightweight chatbot. You can enhance it by:

1. Adding more sophisticated pattern matching
2. Implementing fuzzy string matching
3. Adding database integration
4. Creating more interactive components
5. Adding voice input/output
6. Implementing user authentication

## Development

Both backend and frontend support hot reloading during development. Make changes to your code and see them reflected immediately! 