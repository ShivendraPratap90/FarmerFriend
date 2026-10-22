"""
FarmerFriend AI - Gemini Integration Service
Microservice wrapper for Google GenAI SDK (gemini-3.8-flash)
Provides specialized agricultural intelligence for crop advice, disease management,
irrigation, fertilizers, and farmer assistance.
"""

import os
import time
import logging
from typing import Optional, List, Dict, Any

def _load_env_file():
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if os.path.exists(env_path):
        try:
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        if k.strip() not in os.environ:
                            os.environ[k.strip()] = v.strip().strip('"').strip("'")
        except Exception:
            pass

_load_env_file()

logger = logging.getLogger("farmerfriend.gemini")

AGRONOMY_SYSTEM_INSTRUCTION = """You are Kisan Mitra (Farmer's Friend AI), a specialized agronomy and agricultural expert assistant in the FarmerFriend application.
Your mission is to empower farmers with practical, science-backed, and actionable farming guidance.

Expertise Domains:
1. Crop Planning & Sowing: Seasonal advice for Kharif, Rabi, and Zaid crops across Indian states and agro-climatic zones.
2. Plant Disease & Pest Diagnosis: Identification of symptoms, integrated pest management (IPM), biological controls, and recommended treatments.
3. Irrigation & Water Management: Drip, sprinkler, flood schedules based on crop growth stages and weather.
4. Soil & Fertilizers: Balanced NPK, micronutrients, compost/FYM, soil health card interpretations, and application schedules.
5. Weather Adaptation: Extreme heat, unseasonal rains, drought mitigation, and frost protection.
6. Government Agricultural Schemes: Guidance on PM-KISAN, PM Fasal Bima Yojana (PMFBY), Kisan Credit Card (KCC), and subsidies.

Tone and Language Guidelines:
- If the user's prompt or preferred language is Hindi ('hi') or written in Hindi/Hinglish, reply in clear, respectful, and easy-to-understand Hindi (Devanagari script) with standard agricultural terminology (e.g., यूरिया, डीएपी, सिंचाई, कीट, रोग, मंडी).
- If the user asks in English ('en'), respond in simple, crisp English.
- Be structured: use concise bullet points, clear dosage recommendations (e.g., per acre or per litre of water), and safety cautions.
- Always recommend consulting local Krishi Vigyan Kendra (KVK) or district agricultural officers for region-specific verification on chemical pesticide treatments.
"""

FALLBACK_MODELS = ["gemini-3.8-flash", "gemini-3.5-flash-lite"]

class GeminiService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "").strip()
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-3.8-flash").strip()
        self.client = None
        self._init_client()

    def _init_client(self):
        """Initializes Google GenAI Client if API key is present."""
        if not self.api_key or self.api_key == "your_gemini_api_key_here":
            logger.warning("[!] GEMINI_API_KEY is not configured in backend/.env")
            self.client = None
            return

        try:
            from google import genai
            self.client = genai.Client(api_key=self.api_key)
            logger.info(f"[OK] Gemini Client initialized with model: {self.model_name}")
        except Exception as e:
            logger.error(f"[!] Failed to initialize Gemini Client: {type(e).__name__}: {e}")
            self.client = None

    @property
    def is_configured(self) -> bool:
        return self.client is not None and bool(self.api_key)

    def get_status(self) -> Dict[str, Any]:
        """Returns non-sensitive integration status."""
        return {
            "configured": self.is_configured,
            "model": self.model_name if self.is_configured else None,
            "provider": "Google GenAI (Official SDK)"
        }

    def generate_chat_response(
        self,
        message: str,
        language: str = "en",
        context: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Sends user message to Gemini model and returns formatted agricultural response.
        Includes automatic retry and fallback across supported models.
        """
        clean_msg = (message or "").strip()
        if not clean_msg:
            raise ValueError("Message cannot be empty.")

        if len(clean_msg) > 3000:
            clean_msg = clean_msg[:3000]

        if not self.is_configured:
            raise RuntimeError(
                "Gemini AI service is not configured. Please ensure GEMINI_API_KEY is set in backend/.env."
            )

        # Build prompt context
        lang_note = "User preferred language: Hindi (कृपया उत्तर देवनागरी हिंदी में दें)." if language == "hi" else "User preferred language: English."
        parts = [
            f"[{lang_note}]",
        ]
        if context:
            parts.append(f"[Agronomic Context / Disease Info: {context}]")
        parts.append(f"Farmer Query: {clean_msg}")
        full_prompt = "\n\n".join(parts)

        from google.genai import types

        config = types.GenerateContentConfig(
            system_instruction=AGRONOMY_SYSTEM_INSTRUCTION,
            temperature=0.7,
            max_output_tokens=1500,
        )

        candidate_models = [self.model_name] + [m for m in FALLBACK_MODELS if m != self.model_name]
        last_error = None

        for model in candidate_models:
            for attempt in range(2):
                try:
                    response = self.client.models.generate_content(
                        model=model,
                        contents=full_prompt,
                        config=config,
                    )
                    reply_text = (response.text or "").strip()
                    if reply_text:
                        return {
                            "message": reply_text,
                            "model": model,
                            "language": language
                        }
                except Exception as e:
                    last_error = e
                    time.sleep(1.2 * (attempt + 1))
                    continue

        err_type = type(last_error).__name__ if last_error else "UnknownError"
        err_str = str(last_error) if last_error else "Model unavailable"
        safe_err = err_str.replace(self.api_key, "[REDACTED]") if self.api_key else err_str
        raise RuntimeError(f"Gemini API request failed ({err_type}): {safe_err}")


# Global singleton service
gemini_service = GeminiService()
