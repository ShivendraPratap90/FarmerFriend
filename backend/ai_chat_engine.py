"""
FarmerFriend AI Agronomic Chat Engine
Dual-Engine AI Architecture:
  1. Groq Cloud (Qwen 3.8 27B / Ultra-Fast LLM, ~0.4s response)
  2. Google Gemini 2.5 Flash
  3. Tailored Local Agronomic Knowledge & Diagnostic Fallback Engine

Strictly restricted to agricultural and farming topics.
Politely rejects off-topic queries and handles greetings warmly.
"""

import os
import re
import json
import urllib.request
import urllib.error
from typing import Dict, Any, Optional

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

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
GROQ_MODEL = "qwen/qwen3.8-27b"

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
GEMINI_MODEL = "gemini-2.5-flash"

SYSTEM_INSTRUCTION = """You are FarmerFriend Kisan AI (किसान मित्र एआई), an expert agricultural scientist and field agronomic advisor dedicated to Indian farmers.

CORE DIRECTIVES & STRICT DOMAIN BOUNDARIES:
1. STRICTLY AGRICULTURE ONLY:
   - You ONLY assist with farming, agriculture, crop cultivation, plant diseases & pests, chemical & organic fertilizers (Urea, DAP, NPK, Potash), soil health, irrigation schedules, agro-meteorology/weather, mandi prices, agricultural equipment, livestock/dairy, and government farmer schemes (like PM-KISAN, PMFBY, Kisan Credit Card).
   - If the user asks about ANY NON-AGRICULTURAL topic (e.g. movies, sports, cricket scores, entertainment, coding, politics, gaming, philosophy, non-farming trivia), you MUST politely refuse to answer and redirect them back to farming:
     * In English: "I am specialized strictly as an agricultural and farming advisor. I cannot assist with non-farming topics. Please feel free to ask any question regarding your crops, soil, pest management, or agricultural schemes!"
     * In Hindi: "मैं केवल कृषि, फसल सुरक्षा, खाद-उर्वरक, सिंचाई और किसान कल्याण योजनाओं से जुड़े विषयों में सहायता करता हूँ। कृपया अपनी खेती या फसल से संबंधित प्रश्न पूछें।"

2. GREETINGS & IDENTITY:
   - When the user greets you ("hi", "hello", "hey", "नमस्ते", "राम राम", "pranam") or asks who you are ("who are you", "आप कौन हैं"):
     Respond warmly and politely, introducing yourself as FarmerFriend Kisan AI (किसान मित्र), ready to help with their farming needs. Do NOT provide boilerplate agronomic advice for simple greetings.

3. BILINGUAL EXCELLENCE:
   - If the user asks in Hindi (Devanagari) or Hinglish (e.g., "gehu me pani kab dale", "tamatar me rog"), answer in natural, respectful, agricultural Hindi.
   - If the user asks in English, answer in clear, structured English with bullet points and dosages.

4. SCIENTIFIC & ACTIONABLE:
   - Always provide specific chemical/organic names, dosages (per 10-15L knapsack tank or per acre), application intervals, and safety precautions.
   - Format cleanly with Markdown headings, bold text, and bullet points.
"""

# Agricultural Domain Keywords (English + Hinglish + Hindi)
AGRI_KEYWORDS = {
    # Crops
    "crop", "crops", "wheat", "gehu", "gehun", "गेहूं", "rice", "paddy", "dhan", "धान",
    "tomato", "tamatar", "टमाटर", "potato", "aalu", "aloo", "आलू", "corn", "maize", "makka", "मक्का",
    "cotton", "kapas", "कपास", "mustard", "sarson", "सरसों", "sugarcane", "ganna", "गन्ना",
    "onion", "pyaz", "प्याज़", "garlic", "lahsun", "chilli", "mirch", "मिर्च", "soybean", "सोयाबीन",
    "gram", "chana", "चना", "apple", "seb", "mango", "aam", "banana", "kela", "grape", "angoor",
    "vegetable", "vegetables", "sabzi", "sabji", "सब्जी", "fasal", "faslen", "फसल", "kheti", "खेती",
    
    # Disease & Pest
    "disease", "diseases", "pest", "pests", "insect", "keeda", "keet", "कीट", "rog", "रोग",
    "blight", "early blight", "late blight", "jhulsa", "झुलसा", "rust", "ratua", "रतुआ",
    "mildew", "powdery mildew", "downy mildew", "wilt", "rotting", "rot", "canker",
    "leaf spot", "chlorosis", "yellowing", "peelapan", "fungus", "fungal", "bacterial", "virus",
    "aphid", "whitefly", "borer", "caterpillar", "mite", "thrip", "spotted", "symptom", "infection",
    
    # Fertilizers & Nutrition
    "fertilizer", "fertilizers", "khad", "खाद", "urea", "यूरिया", "dap", "डीएपी", "potash", "mop",
    "npk", "zinc", "boron", "sulfur", "micronutrient", "vermicompost", "gobar", "compost", "manure",
    "dosage", "dose", "matra", "मात्रा", "soil", "mitti", "मिट्टी", "ph", "salinity",
    
    # Treatments & Chemicals
    "fungicide", "pesticide", "insecticide", "herbicide", "weedicide", "spray", "spraying", "chhidkaw", "छिड़काव",
    "mancozeb", "metalaxyl", "chlorothalonil", "copper", "blitox", "ridomil", "confidor",
    "imidacloprid", "azoxystrobin", "carbendazim", "hexaconazole", "neem oil", "bio-pesticide",
    
    # Agronomy & Irrigation
    "water", "watering", "irrigation", "irrigating", "sinchai", "सिंचाई", "paani", "पानी", "drip", "sprinkler",
    "drainage", "sowing", "sow", "buwai", "बुवाई", "harvest", "harvesting", "katai", "कटाई",
    "yield", "upaj", "पैदावार", "seed", "seeds", "beej", "बीज", "seed rate", "spacing",
    
    # Weather & Government
    "weather", "rain", "rainfall", "barish", "मौसम", "barish", "temperature", "humidity", "frost", "pala",
    "scheme", "yojana", "योजना", "pm-kisan", "pmkisan", "kisan", "किसान", "subsidy", "pmfby", "crop insurance",
    "mandi", "mandi price", "apmc", "msp", "rate", "bhav", "भाव", "kcc", "credit card"
}

GREETING_PATTERNS = [
    r"^hi\b", r"^hello\b", r"^hey\b", r"^namaste\b", r"^pranam\b", r"^ram ram\b",
    r"^good (morning|afternoon|evening)\b", r"^नमस्ते", r"^प्रणाम", r"^राम राम",
    r"^who are you", r"^what is your name", r"^who r u", r"^aap kaun h", r"^tum kaun ho",
    r"^आप कौन हैं", r"^तुम कौन हो", r"^kya karte ho", r"^what can you do"
]

def is_hindi_text(text: str) -> bool:
    """Checks if text contains Devanagari script characters or common Hinglish markers."""
    if re.search(r"[\u0900-\u097F]", text):
        return True
    hinglish_keywords = {
        "kya", "kaise", "kare", "karna", "dawae", "dawa", "rog", "khad", "paani", 
        "fasal", "gehu", "dhan", "tamatar", "aalu", "keet", "upay", "salah", "batao",
        "namaste", "pranam", "kisan", "chahiye", "lagana", "chhidkaw", "khet"
    }
    words = re.findall(r"\b\w+\b", text.lower())
    matched = sum(1 for w in words if w in hinglish_keywords)
    return matched >= 1

def is_greeting(query: str) -> bool:
    q = query.strip().lower()
    return any(re.search(pat, q) for pat in GREETING_PATTERNS)

def is_agricultural_query(query: str) -> bool:
    words = set(re.findall(r"\b\w+\b", query.lower()))
    if words.intersection(AGRI_KEYWORDS):
        return True
    q_low = query.lower()
    for kw in AGRI_KEYWORDS:
        if len(kw) > 3 and kw in q_low:
            return True
    return False

class AgronomicChatEngine:
    def __init__(self):
        self.groq_key = GROQ_API_KEY
        self.groq_model = GROQ_MODEL
        self.gemini_key = GEMINI_API_KEY
        self.gemini_model = GEMINI_MODEL

    def _call_groq(self, query: str, requested_lang: str) -> Optional[str]:
        """Calls Groq Cloud API with Qwen 3.8 27B model for ultra-fast response."""
        if not self.groq_key:
            return None

        url = "https://api.groq.com/openai/v1/chat/completions"
        lang_prompt = "Reply in Hindi (हिंदी)." if (requested_lang == "hi" or is_hindi_text(query)) else "Reply in English."

        payload = {
            "model": self.groq_model,
            "messages": [
                {"role": "system", "content": SYSTEM_INSTRUCTION},
                {"role": "user", "content": f"[{lang_prompt}] User question: {query}"}
            ],
            "max_tokens": 850,
            "temperature": 0.3
        }

        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={
                    "Authorization": f"Bearer {self.groq_key}",
                    "Content-Type": "application/json",
                    "User-Agent": "FarmerFriend/1.0"
                }
            )
            with urllib.request.urlopen(req, timeout=12) as response:
                result = json.loads(response.read().decode("utf-8"))
                choices = result.get("choices", [])
                if choices:
                    return choices[0]["message"]["content"].strip()
        except Exception as e:
            print(f"[!] Groq chat call failed: {e}")
            return None

    def _call_gemini(self, query: str, requested_lang: str) -> Optional[str]:
        """Calls Google Gemini API with system instructions for agricultural guidance."""
        if not self.gemini_key:
            return None

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.gemini_model}:generateContent?key={self.gemini_key}"
        lang_prompt = "Reply in Hindi (हिंदी)." if (requested_lang == "hi" or is_hindi_text(query)) else "Reply in English."

        payload = {
            "system_instruction": {
                "parts": [{"text": SYSTEM_INSTRUCTION}]
            },
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": f"[{lang_prompt}] User question: {query}"}]
                }
            ],
            "generationConfig": {
                "temperature": 0.3,
                "maxOutputTokens": 800,
            }
        }

        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=10) as response:
                result = json.loads(response.read().decode("utf-8"))
                candidates = result.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts and "text" in parts[0]:
                        return parts[0]["text"].strip()
        except Exception as e:
            return None

    def _generate_agronomic_advisory(self, query: str, is_hindi: bool) -> str:
        """Deep, tailored agronomic recommendations when offline or quota-limited."""
        q = query.lower()
        
        # 1. Fertilizer recommendations
        if any(w in q for w in ["urea", "dap", "potash", "fertilizer", "khad", "npk", "यूरिया", "डीएपी"]):
            if is_hindi:
                return (
                    "### 🌾 संतुलित उर्वरक प्रबंधन गाइड (Fertilizer Advisory)\n\n"
                    "1. **बेसल ड्रेसिंग (बुवाई के समय):**\n"
                    "   - प्रति एकड़ **DAP:** 50 किग्रा (1 बोरी) + **MOP (पोटाश):** 20-25 किग्रा बुवाई के समय कतारों में डालें।\n"
                    "2. **टॉप ड्रेसिंग (यूरिया):**\n"
                    "   - पहली सिंचाई (21 दिन) पर **45 किग्रा यूरिया** प्रति एकड़ डालें।\n"
                    "   - बालियां या फूल आने से पहले दूसरी खुराक (30-40 किग्रा यूरिया) दें।\n"
                    "3. **जिंक एवं सूक्ष्म पोषक तत्व:**\n"
                    "   - 5 किग्रा जिंक सल्फेट (21%) प्रति एकड़ मिट्टी में मिलाएँ या 0.5% जिंक सल्फेट का पर्णीय छिड़काव करें।\n\n"
                    "⚠️ *सावधानी: अधिक यूरिया से फसल गिरती है और कीटों का प्रकोप बढ़ता है। हमेशा मिट्टी परीक्षण कार्ड के अनुसार ही प्रयोग करें।*"
                )
            else:
                return (
                    "### 🌾 Balanced Fertilizer Management Advisory\n\n"
                    "1. **Basal Application (At Sowing):**\n"
                    "   - Apply **DAP (Diammonium Phosphate):** 50 kg/acre (1 bag) + **MOP (Potash):** 20–25 kg/acre during field preparation.\n"
                    "2. **Top Dressing (Urea Split):**\n"
                    "   - **1st Dose:** Apply 45 kg Urea/acre during the first irrigation (21–25 days after sowing).\n"
                    "   - **2nd Dose:** Apply 35–40 kg Urea/acre prior to flowering or boot stage.\n"
                    "3. **Micronutrient Supplementation:**\n"
                    "   - Apply Zinc Sulphate (21%) @ 5 kg/acre or spray Chelated Zinc (12%) @ 1g/liter of water.\n\n"
                    "⚠️ *Caution: Excessive Nitrogen softens foliage and attracts fungal blast/aphids. Never apply Urea in dry soil.*"
                )

        # 2. Disease / Blight / Fungicide advice
        if any(w in q for w in ["disease", "blight", "fungus", "spot", "mancozeb", "metalaxyl", "copper", "jhulsa", "rog", "dawa"]):
            if is_hindi:
                return (
                    "### 🛡️ फसल रोग निदान एवं त्वरित रासायनिक उपचार\n\n"
                    "1. **झुलसा व धब्बा रोग (Blight & Leaf Spots):**\n"
                    "   - **रिडोमिल गोल्ड (Metalaxyl + Mancozeb):** 2 ग्राम प्रति लीटर पानी (10 लीटर में 20 ग्राम) में घोलकर छिड़कें।\n"
                    "   - सुरक्षात्मक छिड़काव: **ब्लिटॉक्स / कॉपर ऑक्सीक्लोराइड:** 30 ग्राम प्रति 10 लीटर पानी में मिलाकर छिड़कें।\n"
                    "2. **जैविक उपचार:**\n"
                    "   - शुरुआती अवस्था में 10,000 ppm नीम तेल @ 3-5 मिली/लीटर पानी में 1 बूंद सर्फ/साबुन घोलकर सुबह छिड़कें।\n"
                    "3. **खेत की स्वच्छता:**\n"
                    "   - अधिक संक्रमित पत्तियों को तोड़कर खेत से दूर जमीन में गाड़ दें, कंपोस्ट में न डालें।\n\n"
                    "⏰ *छिड़काव का सही समय: सुबह 8 से 11 बजे या शाम 4 बजे के बाद (तेज धूप या हवा में न छिड़कें)।*"
                )
            else:
                return (
                    "### 🛡️ Plant Disease & Curative Treatment Protocol\n\n"
                    "1. **Systemic Curative Control (Blight & Downy Mildew):**\n"
                    "   - Spray **Metalaxyl-M + Mancozeb (Ridomil Gold)** @ 2.5 g/liter (25 g in a 10L bucket).\n"
                    "   - Alternative: **Dimethomorph (Acrobat)** @ 1 g/liter for resistant late blight.\n"
                    "2. **Broad-Spectrum Shield:**\n"
                    "   - Spray **Copper Oxychloride (Blitox 50 WP)** @ 3 g/liter (30 g in 10L) to seal plant wounds and arrest bacterial spread.\n"
                    "3. **Foliar Sanitation:**\n"
                    "   - Immediately prune and bag heavily sporulating leaves; never toss diseased vines into compost pits.\n\n"
                    "⏰ *Application Timing: Spray during calm morning (8–11 AM) or late afternoon. Re-spray after 8–10 days if rainy.*"
                )

        # 3. Irrigation & Water
        if any(w in q for w in ["irrigation", "water", "sinchai", "paani", "पानी", "सिंचाई"]):
            if is_hindi:
                return (
                    "### 💧 वैज्ञानिक सिंचाई प्रबंधन (Irrigation Advisory)\n\n"
                    "1. **क्रांतिक अवस्थाएं (Critical Stages):**\n"
                    "   - **गेहूं:** पहली सिंचाई बुवाई के 20-22 दिन बाद (CRI स्टेज - ताज जड़ अवस्था) अति आवश्यक है। इसके बाद कल्ले फूटते समय व दाना भरते समय पानी दें।\n"
                    "   - **सब्जियां/टमाटर:** 5-7 दिन के अंतराल पर हल्की सिंचाई करें; भारी जलभराव से जड़ गलन होती है।\n"
                    "2. **जल संरक्षण:**\n"
                    "   - ड्रिप (टपक) या स्प्रिंकलर सिंचाई से 40-50% पानी की बचत होती है और फसल पैदावार 25% बढ़ती है।\n"
                    "3. **मौसम पूर्व सावधानी:**\n"
                    "   - आगामी 48 घंटों में बारिश की संभावना होने पर खेत में सिंचाई तुरंत रोक दें।"
                )
            else:
                return (
                    "### 💧 Scientific Irrigation Advisory\n\n"
                    "1. **Critical Moisture Windows:**\n"
                    "   - **Wheat:** 1st irrigation at Crown Root Initiation (CRI stage, 21–25 days after sowing) is mandatory. Follow up at tillering and flowering stages.\n"
                    "   - **Vegetables (Tomato/Chilli):** Apply light, frequent irrigations every 5–7 days. Avoid standing water to prevent Pythium root rot.\n"
                    "2. **Water Efficiency:**\n"
                    "   - Drip fertigation saves up to 45% irrigation water and delivers targeted nutrition directly to active root hair zones.\n"
                    "3. **Weather Precautions:**\n"
                    "   - Always cross-check the live 24h rainfall forecast before turning on tube wells to prevent foliar lodging."
                )

        # 4. PM-KISAN / Schemes
        if any(w in q for w in ["kisan", "pm-kisan", "pmkisan", "yojana", "scheme", "subsidy", "योजना"]):
            if is_hindi:
                return (
                    "### 🏛️ किसान कल्याण योजनाएं एवं सहायता (PM-KISAN)\n\n"
                    "1. **प्रधानमंत्री किसान सम्मान निधि (PM-KISAN):**\n"
                    "   - पात्र किसान परिवारों को प्रति वर्ष **₹6,000** की वित्तीय सहायता (₹2,000 की 3 समान किस्तों में) सीधे बैंक खाते में दी जाती है।\n"
                    "2. **अनिवार्य शर्तें:**\n"
                    "   - आधार eKYC पूर्ण होना आवश्यक है (`pmkisan.gov.in` या नजदीकी CSC केंद्र से)।\n"
                    "   - बैंक खाता आधार से NPCI/DBT लिंक्ड होना चाहिए और जमीन का भूलेख (Land Seeding) सत्यापित होना चाहिए।\n"
                    "3. **हेल्पलाइन नंबर:** टोल फ्री `155261` अथवा `1800-115-526`।"
                )
            else:
                return (
                    "### 🏛️ Government Farmer Welfare Schemes (PM-KISAN)\n\n"
                    "1. **PM-KISAN Samman Nidhi:**\n"
                    "   - Provides eligible farmer families with **₹6,000 per year** in 3 direct benefit installments of ₹2,000 directly into Aadhaar-linked accounts.\n"
                    "2. **Mandatory Eligibility Requirements:**\n"
                    "   - Aadhaar-based biometric eKYC via OTP at `pmkisan.gov.in` or local CSC centers.\n"
                    "   - Bank account mapped with NPCI DBT gateway.\n"
                    "   - Verified land ownership records (Land Seeding).\n"
                    "3. **Official Helpline:** Toll-free `155261` or `1800-115-526`."
                )

        # Default smart agronomic advisory
        if is_hindi:
            return (
                f"### 🌾 कृषि मित्र वैज्ञानिक परामर्श: '{query}'\n\n"
                "1. **पौध सुरक्षा एवं निरीक्षण:**\n"
                "   - फसल के निचले पत्तों और तनों की नियमित जांच करें। किसी भी बीमारी के शुरुआती धब्बों पर तुरंत ध्यान दें।\n"
                "2. **सटीक छिड़काव मार्गदर्शन:**\n"
                "   - फफूंदनाशक या कीटनाशक का प्रयोग करते समय सही मात्रा (प्रति 10-15 लीटर टंकी) का कड़ाई से पालन करें।\n"
                "3. **पोषक तत्व व सिंचाई:**\n"
                "   - मिट्टी की नमी देखकर ही खाद डालें। तेज धूप या तेज हवा (>15 किमी/घंटा) में रासायनिक छिड़काव न करें।\n\n"
                "💬 *आप विशिष्ट फसलों (गेहूं, धान, टमाटर, आलू), खाद (यूरिया/डीएपी), या पीएम-किसान योजना के बारे में विस्तार से पूछ सकते हैं!*"
            )
        else:
            return (
                f"### 🌾 FarmerFriend Agronomic Advisory: '{query}'\n\n"
                "1. **Field Diagnostics & Inspection:**\n"
                "   - Regularly scout lower canopy leaves and stems for early lesions, chlorotic margins, or sucking pests.\n"
                "2. **Standardized Spray Practices:**\n"
                "   - Use calibrated knapsack sprayers. Follow precise doses (grams/milliliters per 10L bucket) and always spray during calm morning hours.\n"
                "3. **Soil & Moisture Protocol:**\n"
                "   - Avoid heavy chemical application on water-stressed crops. Test soil pH every two seasons.\n\n"
                "💬 *Tip: You can ask specific questions about Wheat, Rice, Tomato, Potato, Fertilizer dosages (Urea/DAP), or PM-KISAN schemes!*"
            )

    def answer_query(self, query: str, requested_lang: str = "en") -> str:
        """Processes and answers chat query with strict agricultural boundaries."""
        clean_q = query.strip()
        if not clean_q:
            return "Please ask a question related to your crops, soil, fertilizer, or farming!"

        is_hindi = requested_lang == "hi" or is_hindi_text(clean_q)

        # 1. Warm Greeting & Bot Identity Handler
        if is_greeting(clean_q):
            if is_hindi:
                return (
                    "नमस्ते! 🙏 मैं आपका **FarmerFriend Kisan AI (किसान एआई)** हूँ।\n\n"
                    "मैं आपकी फसलों में रोग नियंत्रण, खाद-उर्वरक (यूरिया, डीएपी) की सही मात्रा, सिंचाई समय, मौसम पूर्वानुमान और सरकारी योजनाओं (जैसे PM-KISAN) में सहायता के लिए हमेशा तैयार हूँ।\n\n"
                    "🌾 अपनी किसी भी फसल, खेत या रोग के बारे में निसंकोच प्रश्न पूछें!"
                )
            else:
                return (
                    "Hello! 👋 I am your **FarmerFriend AI Agricultural Advisor**.\n\n"
                    "I can assist you with crop management, plant disease treatments, balanced fertilizer regimens (Urea/DAP/Potash), irrigation scheduling, weather precautions, and government schemes (PM-KISAN).\n\n"
                    "🌾 Ask me any agricultural question or select a prompt below!"
                )

        # 2. Strict Agricultural Domain Enforcement
        if not is_agricultural_query(clean_q):
            if is_hindi:
                return (
                    "🌾 **कृषि परामर्श केंद्र:**\n\n"
                    "मैं केवल कृषि, फसल सुरक्षा, खाद-उर्वरक, सिंचाई, मौसम और किसान कल्याण योजनाओं (जैसे PM-KISAN) से जुड़े प्रश्नों का उत्तर देने के लिए समर्पित हूँ।\n\n"
                    "कृपया अपनी फसल (जैसे गेहूं, धान, टमाटर, आलू), खाद या खेती से संबंधित प्रश्न पूछें!"
                )
            else:
                return (
                    "🌾 **Agricultural Advisory Notice:**\n\n"
                    "I am specialized strictly as a dedicated agricultural and farming advisor. I cannot assist with non-farming topics.\n\n"
                    "Please feel free to ask any question regarding your crops (e.g. Wheat, Rice, Tomato), plant diseases, fertilizer dosages (Urea/DAP), irrigation, or government farmer schemes!"
                )

        # 3. Call Groq Cloud LLM (Ultra-Fast, ~0.4s)
        groq_reply = self._call_groq(clean_q, "hi" if is_hindi else "en")
        if groq_reply:
            return groq_reply

        # 4. Fallback to Gemini 2.5 Flash if available
        gemini_reply = self._call_gemini(clean_q, "hi" if is_hindi else "en")
        if gemini_reply:
            return gemini_reply

        # 5. Tailored Local Agronomic Expert Engine (When offline or quota exhausted)
        return self._generate_agronomic_advisory(clean_q, is_hindi)

# Global singleton
chat_engine = AgronomicChatEngine()
