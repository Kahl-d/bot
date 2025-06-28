from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.schema import HumanMessage, SystemMessage
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
import json

# Load environment variables
load_dotenv()

app = FastAPI(title="Smart Portfolio Chatbot", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Message(BaseModel):
    content: str
    name: Optional[str] = None
    email: Optional[str] = None

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    text: str

# Knowledge Base - Structured for efficient retrieval
KNOWLEDGE_CHUNKS = [
    {
        "category": "personal",
        "content": "Khalid Mehtab Khan is a 26-year-old NLP Researcher & Data Scientist based in San Francisco, CA. Contact: khalidmehtabk@gmail.com, 404-263-7813. GitHub: https://github.com/Kahl-d, LinkedIn: https://www.linkedin.com/in/khalidm-khan/, Website: https://khalidmk.vercel.app"
    },
    {
        "category": "education",
        "content": "Currently pursuing Master of Science in Data Science & Artificial Intelligence at San Francisco State University (Aug 2023 – Aug 2025) with 4.0 GPA. Bachelor of Technology in Computer Science and Engineering from The LNM Institute of Information Technology, India (Aug 2017 – Sep 2021)."
    },
    {
        "category": "current_role",
        "content": "NLP Researcher at Tacit Alma Lab (Aug 2024 – Present) in San Francisco, CA. Develop essay-aware DeBERTa-based classifier for multi-label theme detection, improving F1 on rare classes by 5%. Fine-tune with domain-adaptive masked language modeling, automate hyperparameter optimization using Optuna, and use t-SNE for embedding analysis."
    },
    {
        "category": "previous_role",
        "content": "Healthcare Associate at Innovaccer (Jan 2021 – Sep 2022) in Noida, India. Led team of 3 to architect ETL pipelines for 15+ healthcare data sources, reducing data latency by 30%. Designed 10+ Tableau dashboards improving client outreach by 15%. Worked with AWS EC2 and S3."
    },
    {
        "category": "skills_programming",
        "content": "Programming skills: Python, SQL, JavaScript, React, Flask, FastAPI. Use Python extensively for NLP research, fine-tuning models, and building ML systems."
    },
    {
        "category": "skills_ml_ai",
        "content": "Machine Learning & AI: PyTorch, LangChain, Transformers, BERT, T5, Mistral-7B, GPT-4. Work with transformers and fine-tune models for text classification and NLP tasks."
    },
    {
        "category": "skills_nlp",
        "content": "NLP expertise: Text Classification, Entity Extraction, Fine-Tuning, LoRA, QLoRA, RAG, Embeddings, Semantic Search. Specialize in advanced NLP techniques and model optimization."
    },
    {
        "category": "skills_mlops",
        "content": "MLOps & Cloud: AWS Lambda, AWS S3, AWS EC2, Docker, Weights & Biases, FAISS, Pinecone, Ollama. Deploy models using AWS services and manage ML infrastructure."
    },
    {
        "category": "skills_data",
        "content": "Data Analytics: ETL, Data Warehousing, Tableau, A/B Testing, t-SNE, Experiment Design. Build data pipelines and create analytics dashboards."
    },
    {
        "category": "project_secure_sense",
        "content": "Secure Sense project won SF Hacks 2025 Emerging AI Innovation award. Built privacy-preserving browser extension using fine-tuned DistilBERT for real-time PII redaction. Compressed model by 80% while maintaining 94% accuracy through knowledge distillation. Used AWS Lambda and S3 for serverless fallback system ensuring 99% uptime."
    },
    {
        "category": "project_data_augmentation",
        "content": "Context-Aware Data Augmentation Tool uses BioBERT with masked-language modeling guided by domain knowledge graph to generate clinically valid synthetic data. Increased Random-Forest classifier accuracy by 5 percentage points on imbalanced public-health datasets, outperforming SMOTE and back-translation baselines."
    }
]

# Initialize LLM and embeddings
llm = ChatOpenAI(
    model="gpt-3.5-turbo",
    temperature=0.7,
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

embeddings = OpenAIEmbeddings(
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

# Create vector store
def create_vector_store():
    """Create FAISS vector store from knowledge chunks"""
    texts = [chunk["content"] for chunk in KNOWLEDGE_CHUNKS]
    metadatas = [{"category": chunk["category"]} for chunk in KNOWLEDGE_CHUNKS]
    
    # Split texts for better retrieval
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    
    split_texts = []
    split_metadatas = []
    
    for text, metadata in zip(texts, metadatas):
        splits = text_splitter.split_text(text)
        split_texts.extend(splits)
        split_metadatas.extend([metadata] * len(splits))
    
    vectorstore = FAISS.from_texts(split_texts, embeddings, metadatas=split_metadatas)
    return vectorstore

# Initialize vector store
vectorstore = create_vector_store()

def get_relevant_context(query: str, k: int = 3) -> str:
    """Retrieve relevant context based on user query"""
    try:
        # Search for relevant documents
        docs = vectorstore.similarity_search(query, k=k)
        
        # Combine relevant context
        context_parts = []
        for doc in docs:
            context_parts.append(doc.page_content)
        
        return "\n\n".join(context_parts)
    except Exception as e:
        print(f"Vector search error: {e}")
        # Fallback to basic context
        return "Khalid Mehtab Khan is an NLP Researcher & Data Scientist based in San Francisco, CA."

def create_dynamic_prompt(query: str, context: str) -> str:
    """Create a focused prompt with only relevant context"""
    
    base_prompt = f"""You are Khalid Mehtab Khan's AI assistant. Respond as if you are Khalid speaking about yourself in a friendly, conversational way.

RELEVANT CONTEXT ABOUT KHALID:
{context}

USER QUESTION: {query}

INSTRUCTIONS:
1. Be conversational and friendly, as if Khalid is talking about himself
2. Keep responses concise but informative (2-4 sentences typically)
3. Use "I" and "my" when referring to Khalid's experiences and skills
4. Only use information from the provided context
5. If the context doesn't contain enough information, politely say you don't have that specific information
6. Focus on the most relevant aspects based on the user's question

Respond naturally as Khalid:"""

    return base_prompt

def get_llm_response(query: str) -> str:
    """Get efficient LLM response with minimal token usage"""
    try:
        # Get relevant context only
        context = get_relevant_context(query)
        
        # Create focused prompt
        prompt = create_dynamic_prompt(query, context)
        
        # Get response from LLM
        messages = [
            SystemMessage(content=prompt)
        ]
        
        response = llm.invoke(messages)
        return response.content.strip()
        
    except Exception as e:
        print(f"LLM Error: {e}")
        return "I'm having trouble connecting right now. Please try again later."

@app.get("/")
async def root():
    return {"message": "Smart Portfolio Chatbot API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/contact")
async def contact_form(message: Message):
    return {"message": "Thank you for your message! I'll get back to you soon."}

@app.post("/api/chat")
async def chat_endpoint(chat_message: ChatMessage):
    response_text = get_llm_response(chat_message.message)
    return ChatResponse(text=response_text)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 