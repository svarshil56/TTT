from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Career Advisor API",
    description="API for the Intelligent Virtual Career Advisor platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

# Career guidance system prompt
SYSTEM_PROMPT = """You are a career guidance assistant. Your role is to help users with:
1. Career path suggestions based on their interests and skills
2. Information about different professions and industries
3. Guidance on skill development and education
4. Job search strategies and interview preparation
5. Career transition advice

Always be professional, supportive, and provide actionable advice. If you don't know something, be honest about it."""

@app.get("/")
async def root():
    return {"message": "Welcome to the Career Advisor API"}

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')

        if not user_message:
            return jsonify({'error': 'No message provided'}), 400

        # Create chat completion with OpenAI
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=500
        )

        bot_response = response.choices[0].message['content']
        return jsonify({'response': bot_response})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Import and include routers
# from app.routes import skill_assessment, job_market, career_path, resume_coach, network_insights

# app.include_router(skill_assessment.router, prefix="/api/skills", tags=["Skills"])
# app.include_router(job_market.router, prefix="/api/market", tags=["Job Market"])
# app.include_router(career_path.router, prefix="/api/career-path", tags=["Career Path"])
# app.include_router(resume_coach.router, prefix="/api/resume", tags=["Resume"])
# app.include_router(network_insights.router, prefix="/api/network", tags=["Network"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 