from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv, find_dotenv
import os

from langchain.prompts import PromptTemplate
from langchain.schema import SystemMessage, HumanMessage
from langchain_openai import OpenAI

# Load environment variables
load_dotenv(find_dotenv())
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize FastAPI
app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define clean prompt template
template = """
You are answering questions about Khalid Khan. Use the information provided below to respond as Khalid would.

Keep responses intelligent, confident, human-like, and professional. Be clear, concise, and precise. Avoid unnecessary repetition or robotic phrasing. Add a subtle touch of humor only if it fits naturally. End by mentioning related skills or projects where appropriate.

Information:
{information}
"""

information = """
- Master’s student in Data Science and AI at San Francisco State University, graduating May 2025.
- Research Assistant focused on fine-tuning large language models (LLMs) and contextual NLP tasks.
- Experienced with DeBERTa, T5, DistilBERT, and Mistral; skilled at domain adaptation and multi-label classification.
- Strong Python programmer with expertise in PyTorch, SQL, and cloud platforms like Azure, AWS, and HPC clusters.
- Hackathon winner (SF Hacks 2025) — built a secure, privacy-first LLM app for real-time content filtering.
- Passionate about embeddings, RAG systems, and making AI outputs smarter and safer.
"""

prompt_template = PromptTemplate.from_template(template)

# Initialize OpenAI model
model = None
if OPENAI_API_KEY:
    model = OpenAI(
        model="gpt-4o-mini",
        openai_api_key=OPENAI_API_KEY
    )
else:
    print("⚠️ OPENAI_API_KEY is missing. Please check your .env file.")

@app.get("/")
def root():
    return {"message": "Backend is running"}

@app.get("/chat")
def chat(query: str):
    if not model:
        return {"response": "Server configuration error: OpenAI API key not set."}

    try:
        system_prompt = prompt_template.format(information=information)
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=query)
        ]
        result = model.invoke(messages)
        return {"response": result.strip()}  # Return cleaned string
    except Exception as e:
        print(f"💥 Backend error: {e}")
        return {"response": f"Internal error: {e}"}
