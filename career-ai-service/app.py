"""
Career AI Service - Enhanced Version
FastAPI service for generating career plans using Phi-3 Mini model
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from typing import List, Optional
import json
import os
import re
import logging
from llama_cpp import Llama

# =========================================================
# LOGGING CONFIGURATION
# =========================================================

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# =========================================================
# MODEL CONFIGURATION
# =========================================================

MODEL_PATH = os.path.join(
    os.path.dirname(__file__), 
    "models", 
    "gguf", 
    "Phi-3-mini-4k-instruct-q4.gguf"
)

app = FastAPI(
    title="Career AI Service",
    description="AI-powered career planning and analysis",
    version="2.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
if not os.path.exists(MODEL_PATH):
    logger.error(f"Model not found at: {MODEL_PATH}")
    raise RuntimeError(f"Model file not found: {MODEL_PATH}")

logger.info(f"Loading model from: {MODEL_PATH}")
try:
    llm = Llama(
        model_path=MODEL_PATH, 
        n_ctx=2048,
        n_threads=4,
        verbose=False
    )
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load model: {e}")
    raise RuntimeError(f"Failed to load model: {e}")

# =========================================================
# HEURISTIC SCORING
# =========================================================

def calculate_heuristic_score(profile: str, objective: str) -> float:
    """
    Calculate compatibility score based on keyword matching
    Returns a score between 0.0 and 1.0
    """
    p_lower = profile.lower()
    o_lower = objective.lower()
    
    # Extended keyword list for better matching
    technical_keywords = [
        "java", "spring", "springboot", "react", "angular", "vue",
        "postgresql", "mysql", "mongodb", "sql", "nosql",
        "api", "rest", "graphql", "microservices",
        "backend", "frontend", "fullstack",
        "git", "github", "gitlab", "docker", "kubernetes",
        "aws", "azure", "gcp", "cloud",
        "python", "javascript", "typescript", "node",
        "ci/cd", "jenkins", "gitlab-ci",
        "agile", "scrum", "devops"
    ]
    
    soft_keywords = [
        "communication", "teamwork", "leadership", "problem-solving",
        "analytical", "creative", "organized"
    ]
    
    all_keywords = technical_keywords + soft_keywords
    
    # Count relevant keywords in objective
    relevant_keywords = [kw for kw in all_keywords if kw in o_lower]
    
    if not relevant_keywords:
        return 0.3  # Base score if no specific keywords
    
    # Count matching keywords between profile and objective
    matched_keywords = [kw for kw in relevant_keywords if kw in p_lower]
    
    # Calculate score
    match_ratio = len(matched_keywords) / len(relevant_keywords)
    
    # Add bonus for profile completeness
    profile_bonus = 0.1 if len(p_lower) > 200 else 0.0
    
    # Calculate final score (0.0 to 1.0)
    score = min(1.0, match_ratio + profile_bonus + 0.1)
    
    return round(score, 2)

# =========================================================
# PYDANTIC MODELS
# =========================================================

class CareerPlanRequest(BaseModel):
    profileText: str = Field(..., min_length=10, max_length=5000)
    objectiveText: str = Field(..., min_length=10, max_length=2000)
    
    @validator('profileText', 'objectiveText')
    def validate_not_empty(cls, v):
        if not v.strip():
            raise ValueError('Field cannot be empty or whitespace only')
        return v

class ActionItem(BaseModel):
    label: str = Field(..., min_length=5, max_length=500)
    category: str = Field(..., min_length=2, max_length=50)

class CareerPlanResponse(BaseModel):
    compatibilityScore: float = Field(..., ge=0.0, le=1.0)
    actions: List[ActionItem] = Field(..., min_items=1, max_items=10)

# =========================================================
# FALLBACK ACTIONS
# =========================================================

FALLBACK_ACTIONS = {
    "default": [
        {"label": "Développer un projet personnel complet avec les technologies cibles", "category": "PROJECT"},
        {"label": "Contribuer à des projets open source pour gagner en expérience", "category": "EXPERIENCE"},
        {"label": "Obtenir une certification reconnue dans le domaine visé", "category": "CERTIFICATION"},
        {"label": "Maîtriser les concepts avancés des technologies requises", "category": "SKILL"},
        {"label": "Construire un portfolio professionnel en ligne", "category": "PORTFOLIO"}
    ],
    "backend": [
        {"label": "Créer une API REST complète avec Spring Boot et PostgreSQL", "category": "PROJECT"},
        {"label": "Implémenter l'authentification JWT et la sécurité", "category": "SKILL"},
        {"label": "Maîtriser les tests unitaires et d'intégration", "category": "SKILL"},
        {"label": "Déployer l'application avec Docker et CI/CD", "category": "SKILL"},
        {"label": "Optimiser les performances et la scalabilité", "category": "SKILL"}
    ],
    "frontend": [
        {"label": "Développer une application React complète avec hooks", "category": "PROJECT"},
        {"label": "Maîtriser les state management (Redux, Context API)", "category": "SKILL"},
        {"label": "Implémenter des tests avec Jest et React Testing Library", "category": "SKILL"},
        {"label": "Créer un design system et des composants réutilisables", "category": "SKILL"},
        {"label": "Optimiser les performances (lazy loading, memoization)", "category": "SKILL"}
    ],
    "data": [
        {"label": "Créer un pipeline de traitement de données avec Python", "category": "PROJECT"},
        {"label": "Maîtriser SQL avancé et l'optimisation de requêtes", "category": "SKILL"},
        {"label": "Apprendre les bases du Machine Learning", "category": "SKILL"},
        {"label": "Créer des dashboards de visualisation avec Tableau/PowerBI", "category": "PROJECT"},
        {"label": "Obtenir une certification en Data Analysis", "category": "CERTIFICATION"}
    ],
    "cybersecurity": [
        {"label": "Configurer un home lab pour pratiquer la sécurité", "category": "PROJECT"},
        {"label": "Obtenir une certification de base (Fortinet NSE, CompTIA Security+)", "category": "CERTIFICATION"},
        {"label": "Apprendre les fondamentaux de la sécurité réseau", "category": "SKILL"},
        {"label": "Participer à des CTF (Capture The Flag)", "category": "EXPERIENCE"},
        {"label": "Comprendre les principes SIEM et SOC", "category": "SKILL"}
    ]
}

def get_fallback_actions(objective: str) -> List[dict]:
    """
    Return contextual fallback actions based on the objective
    """
    objective_lower = objective.lower()
    
    if any(kw in objective_lower for kw in ["backend", "api", "spring", "java"]):
        return FALLBACK_ACTIONS["backend"]
    elif any(kw in objective_lower for kw in ["frontend", "react", "angular", "vue"]):
        return FALLBACK_ACTIONS["frontend"]
    elif any(kw in objective_lower for kw in ["data", "analyst", "bi", "sql"]):
        return FALLBACK_ACTIONS["data"]
    elif any(kw in objective_lower for kw in ["cyber", "sécurité", "security", "soc"]):
        return FALLBACK_ACTIONS["cybersecurity"]
    else:
        return FALLBACK_ACTIONS["default"]

# =========================================================
# AI PROMPT ENGINEERING
# =========================================================

def create_career_prompt(profile: str, objective: str) -> str:
    """
    Create an optimized prompt for the Phi-3 model
    """
    return f"""<|system|>
You are an expert career coach. Your task is to generate exactly 5 actionable career development steps.

STRICT FORMAT REQUIREMENTS:
- Each step MUST start with: - [CATEGORY] 
- Categories: PROJECT, SKILL, CERTIFICATION, EXPERIENCE, PORTFOLIO, NETWORKING, EDUCATION, INTERVIEW
- Each step should be specific, actionable, and relevant

EXAMPLE OUTPUT:
- [PROJECT] Build a full-stack application using Spring Boot and React
- [SKILL] Master advanced SQL queries and database optimization
- [CERTIFICATION] Obtain AWS Certified Developer certification
- [PORTFOLIO] Create a professional GitHub portfolio with 3+ projects
- [NETWORKING] Connect with 10 professionals in the target industry on LinkedIn

DO NOT include explanations, numbering, or any other text.<|end|>
<|user|>
CANDIDATE PROFILE:
{profile}

TARGET CAREER GOAL:
{objective}

Generate 5 specific career development steps:<|end|>
<|assistant|>
"""

# =========================================================
# AI RESPONSE PARSING
# =========================================================

def parse_ai_response(text: str) -> List[ActionItem]:
    """
    Parse the AI response into structured ActionItem objects
    """
    actions = []
    
    # Enhanced regex pattern to catch various formats
    patterns = [
        r'-\s*\[(\w+)\]\s*(.+)',  # - [CATEGORY] Label
        r'\d+\.\s*\[(\w+)\]\s*(.+)',  # 1. [CATEGORY] Label
        r'•\s*\[(\w+)\]\s*(.+)',  # • [CATEGORY] Label
    ]
    
    lines = text.split('\n')
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        matched = False
        for pattern in patterns:
            matches = re.findall(pattern, line, re.IGNORECASE)
            if matches:
                for cat, label in matches:
                    if len(actions) < 5:
                        # Clean up the label
                        label = label.strip().rstrip('.,;')
                        if len(label) > 10:  # Minimum length check
                            actions.append(ActionItem(
                                label=label,
                                category=cat.upper()
                            ))
                            matched = True
                break
        
        if matched:
            continue
    
    return actions

# =========================================================
# MAIN ENDPOINT
# =========================================================

@app.post("/career-plan", response_model=CareerPlanResponse)
async def career_plan(request: CareerPlanRequest):
    """
    Generate a career plan with AI-powered recommendations
    """
    logger.info("Received career plan request")
    logger.debug(f"Profile length: {len(request.profileText)}")
    logger.debug(f"Objective length: {len(request.objectiveText)}")
    
    try:
        # Calculate compatibility score
        score = calculate_heuristic_score(request.profileText, request.objectiveText)
        logger.info(f"Calculated compatibility score: {score}")
        
        # Create optimized prompt
        prompt = create_career_prompt(request.profileText, request.objectiveText)
        
        # Call AI model
        logger.info("Calling AI model...")
        response = llm(
            prompt,
            max_tokens=600,
            temperature=0.7,
            top_p=0.9,
            stop=["<|end|>", "<|user|>"],
            repeat_penalty=1.1
        )
        
        text_output = response["choices"][0]["text"].strip()
        logger.info("AI response received")
        logger.debug(f"Raw AI output:\n{text_output}\n{'='*50}")
        
        # Parse AI response
        actions = parse_ai_response(text_output)
        
        # If parsing failed or not enough actions, use contextual fallback
        if len(actions) < 3:
            logger.warning(f"Insufficient actions parsed ({len(actions)}), using fallback")
            fallback_list = get_fallback_actions(request.objectiveText)
            actions = [ActionItem(**action) for action in fallback_list[:5]]
        
        # Ensure exactly 5 actions
        if len(actions) > 5:
            actions = actions[:5]
        elif len(actions) < 5:
            # Fill with fallback
            fallback_list = get_fallback_actions(request.objectiveText)
            needed = 5 - len(actions)
            for i in range(needed):
                if i < len(fallback_list):
                    actions.append(ActionItem(**fallback_list[i]))
        
        logger.info(f"Returning {len(actions)} actions with score {score}")
        
        return CareerPlanResponse(
            compatibilityScore=score,
            actions=actions
        )
    
    except Exception as e:
        logger.error(f"Error generating career plan: {str(e)}", exc_info=True)
        
        # Return fallback response
        logger.info("Returning fallback response due to error")
        score = calculate_heuristic_score(request.profileText, request.objectiveText)
        fallback_list = get_fallback_actions(request.objectiveText)
        actions = [ActionItem(**action) for action in fallback_list[:5]]
        
        return CareerPlanResponse(
            compatibilityScore=score,
            actions=actions
        )

# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "model": "Phi-3-mini-4k-instruct-q4",
        "version": "2.0.0"
    }

@app.get("/")
async def root():
    """
    Root endpoint with API information
    """
    return {
        "service": "Career AI Service",
        "version": "2.0.0",
        "endpoints": {
            "career_plan": "/career-plan (POST)",
            "health": "/health (GET)",
            "docs": "/docs"
        }
    }

# =========================================================
# STARTUP & SHUTDOWN
# =========================================================

@app.on_event("startup")
async def startup_event():
    logger.info("Career AI Service starting up...")
    logger.info(f"Model loaded: {MODEL_PATH}")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Career AI Service shutting down...")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000,
        log_level="info"
    )