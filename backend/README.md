# Smart Portfolio Chatbot Backend

An efficient LLM-based chatbot using LangChain with vector search and context management to minimize token usage.

## Features

- **Efficient Token Usage**: Only sends relevant context to the LLM
- **Vector Search**: Uses FAISS for semantic similarity search
- **Context Management**: Retrieves only the most relevant information
- **Structured Knowledge**: Organized knowledge chunks for better retrieval

## Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Variables**:
   Create a `.env` file in the backend directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Run the Server**:
   ```bash
   python main.py
   ```

## How It Works

### Knowledge Structure
The knowledge base is organized into semantic chunks:
- Personal information
- Education
- Current role
- Previous role
- Skills (programming, ML/AI, NLP, MLOps, data)
- Projects

### Efficient Retrieval
1. **User Query**: "Do you know Python?"
2. **Vector Search**: Finds most relevant chunks (skills_programming, current_role)
3. **Context Extraction**: Only sends relevant context to LLM
4. **Focused Response**: LLM generates response using minimal context

### Token Optimization
- **Before**: Sending entire knowledge base (~2000+ tokens)
- **After**: Sending only relevant chunks (~200-500 tokens)
- **Savings**: 75-90% reduction in token usage

## API Endpoints

- `GET /` - Health check
- `POST /api/chat` - Chat endpoint
- `POST /api/contact` - Contact form

## Customization

To update the knowledge base, modify the `KNOWLEDGE_CHUNKS` list in `main.py`. Each chunk should have:
- `category`: Semantic category for organization
- `content`: Concise, relevant information

## Performance

- **Response Time**: ~1-3 seconds
- **Token Usage**: ~200-500 tokens per query
- **Accuracy**: High relevance through semantic search 