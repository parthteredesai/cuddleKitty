import os
import re
import json
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai

from prompts import SYSTEM_PROMPT

# --------------------------------------------------
# Load Environment Variables
# --------------------------------------------------

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env")

genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-2.5-flash")

# --------------------------------------------------
# FastAPI App
# --------------------------------------------------

app = FastAPI(
    title="PawBot AI",
    description="AI Assistant for Cuddle Kitty",
    version="2.0"
)

# --------------------------------------------------
# Utility Function
# --------------------------------------------------

def clean_response(text: str):

    text = re.sub(r"\*\*(.*?)\*\*", r"\1", text)
    text = re.sub(r"\*(.*?)\*", r"\1", text)
    text = re.sub(r"^\s*[-*]\s+", "• ", text, flags=re.MULTILINE)
    text = re.sub(r"^#+\s*", "", text, flags=re.MULTILINE)

    text = text.replace("```json", "")
    text = text.replace("```", "")

    text = re.sub(r"\n{3,}", "\n\n", text)

    return text.strip()

# --------------------------------------------------
# Request Models
# --------------------------------------------------

class ChatRequest(BaseModel):
    message: str


class KittyDescriptionRequest(BaseModel):
    name: Optional[str] = ""
    breed: Optional[str] = ""
    age: Optional[float] = 0
    description: Optional[str] = ""


class Questionnaire(BaseModel):

    home: str
    kids: str
    pets: str
    time: str
    budget: str
    personality: str
    energy: str
    age: str
    experience: str
    lifestyle: str
    extraPreference: Optional[str] = ""


class Cat(BaseModel):
    id: Optional[str] = ""
    name: str
    breed: str
    age: float
    description: str


class MatchRequest(BaseModel):

    questionnaire: Questionnaire
    cats: list[Cat]

# --------------------------------------------------
# Health Check
# --------------------------------------------------

@app.get("/")
def home():

    return {
        "status": "running",
        "service": "PawBot AI",
        "model": "Gemini 2.5 Flash"
    }

# --------------------------------------------------
# PawBot Chat
# --------------------------------------------------

@app.post("/chat")
def chat(data: ChatRequest):

    try:

        print("\nReceived Chat:", data.message)

        prompt = f"""
{SYSTEM_PROMPT}

User Question:

{data.message}
"""

        response = model.generate_content(prompt)

        return {
            "reply": clean_response(response.text)
        }

    except Exception as e:

        print("Gemini Error:", e)

        raise HTTPException(
            status_code=500,
            detail="PawBot is currently unavailable."
        )

# --------------------------------------------------
# AI Cat Description
# --------------------------------------------------

@app.post("/generate-description")
def generate_description(data: KittyDescriptionRequest):

    try:

        print("\n========== REQUEST ==========")
        print(data)
        print("=============================\n")

        prompt = f"""
You are PawBot, an expert cat adoption assistant.

Create a warm and engaging adoption profile.

Name: {data.name}
Breed: {data.breed}
Age: {data.age}

Owner Description:
{data.description}

Instructions:
- Around 50 words
- Friendly
- Encourage adoption
- Plain text only
"""

        print("Calling Gemini...")

        response = model.generate_content(prompt)

        print("Gemini Success!")

        return {
            "description": clean_response(response.text)
        }

    except Exception as e:

        import traceback

        print("\n========== FULL ERROR ==========")
        traceback.print_exc()
        print("================================\n")

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
        

# --------------------------------------------------
# AI Matchmaking
# --------------------------------------------------

@app.post("/match-cats")
def match_cats(data: MatchRequest):

    try:

        prompt = f"""
You are an expert cat adoption counselor.

A user has completed a questionnaire.

USER PROFILE

{json.dumps(data.questionnaire.model_dump(), indent=2)}

AVAILABLE CATS

{json.dumps([cat.model_dump() for cat in data.cats], indent=2)}

Your task:

Compare the user's lifestyle with every cat.

Consider:

- Personality
- Age
- Breed
- Description
- Energy level
- First-time owner suitability
- Home type
- Children
- Other pets

Return ONLY valid JSON.

Rank every cat from best match to worst match.

Return ONLY the TOP 5 best matching cats.

Do NOT return more than 5 cats.

Format:

{
    "matches":[
        {
            "name":"",
            "score":97,
            "reason":""
        }
    ]
}

Example:

{{
    "matches":[
        {{
            "id": "...",
            "name":"Milo",
            "score":96,
            "reason":"Playful and affectionate. Perfect for apartment living."
        }},
        {{
             "id": "...",
            "name":"Luna",
            "score":91,
            "reason":"Calm personality suitable for families."
        }},
        {{
             "id": "...",
            "name":"Oreo",
            "score":88,
            "reason":"Independent and good for experienced owners."
        }}
    ]
}}

Return ONLY JSON.
"""

        response = model.generate_content(prompt)

        text = response.text

        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

        print("\nGemini Match Response:\n")
        print(text)

        return json.loads(text)

    except Exception as e:

        print("Matchmaking Error:", e)

        raise HTTPException(
            status_code=500,
            detail="Unable to generate AI matchmaking."
        )