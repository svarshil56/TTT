from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

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

@app.get("/")
async def root():
    return {"message": "Welcome to the Career Advisor API"}

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