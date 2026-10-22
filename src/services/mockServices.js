// ============================================================
 // FARMER FRIEND - Services
 // Real weather via Open-Meteo; other services remain demo-based
 // ============================================================

import {
  CROP_DISEASES,
  CROP_RECOMMENDATIONS,
  MANDI_PRICES,
  DEMO_MARKETPLACE_LISTINGS,
  GOVT_SCHEMES,
  YIELD_ESTIMATE_BASE,
  CHAT_RESPONSES_EN,
  CHAT_RESPONSES_HI,
} from '../data/demoData';

const delay = (ms = 1200) =>
  new Promise(resolve => setTimeout(resolve, ms));

// ---- Local User Account & Authentication Service ----
export const authService = {
  getUsers: () => {
    try {
      const stored = localStorage.getItem('ff_users_store');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  register: async (data) => {
    await delay(500);
    const users = authService.getUsers();
    
    // Check if user already exists
    const existing = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email already exists. Please log in.');
    }

    const newUser = {
      id: 'farmer-' + Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      password: data.password,
      role: 'farmer',
      state: data.state || 'Uttar Pradesh',
      district: data.district || 'Ghaziabad',
      village: data.village || '',
      farmName: data.name ? `${data.name}'s Farm` : 'My Green Farm',
      landSize: data.landSize || '5.0',
      landUnit: data.landUnit || 'acres',
      soilType: data.soilType || 'Alluvial',
      primaryCrop: data.primaryCrop || 'Wheat',
      secondaryCrops: 'Mustard, Gram, Vegetables',
      crops: [data.primaryCrop || 'Wheat'],
      joinedDate: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`,
      kccHolder: true,
      pmKisanBeneficiary: true,
    };

    users.push(newUser);
    localStorage.setItem('ff_users_store', JSON.stringify(users));
    localStorage.setItem('ff_profile', JSON.stringify(newUser));

    return {
      success: true,
      user: newUser,
      message: 'Account created successfully!',
    };
  },

  login: async (email, password) => {
    await delay(500);
    if (!email || !password) {
      throw new Error('Please enter your email and password');
    }

    const users = authService.getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (found) {
      if (found.password && found.password !== password) {
        throw new Error('Incorrect password. Please try again.');
      }
      localStorage.setItem('ff_profile', JSON.stringify(found));
      return {
        success: true,
        token: 'auth-token-' + Date.now(),
        user: found,
      };
    }

    // If logging in for the first time without registration, create a realistic profile
    const derivedName = email.split('@')[0]
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());

    const newUser = {
      id: 'farmer-' + Date.now(),
      name: derivedName || 'Farmer',
      email,
      password,
      role: 'farmer',
      state: 'Uttar Pradesh',
      district: 'Ghaziabad',
      village: 'Govindpur',
      farmName: `${derivedName || 'Farmer'}'s Farm`,
      landSize: '5.0',
      landUnit: 'acres',
      soilType: 'Alluvial',
      primaryCrop: 'Wheat',
      secondaryCrops: 'Mustard, Gram',
      crops: ['Wheat'],
      joinedDate: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(derivedName)}`,
      kccHolder: true,
      pmKisanBeneficiary: true,
    };

    users.push(newUser);
    localStorage.setItem('ff_users_store', JSON.stringify(users));
    localStorage.setItem('ff_profile', JSON.stringify(newUser));

    return {
      success: true,
      token: 'auth-token-' + Date.now(),
      user: newUser,
    };
  },

  logout: async () => {
    await delay(150);
    return { success: true };
  },
};

// ---- Real Weather Service: Open-Meteo ----

const describeWeatherCode = (code) => {
  if (code === 0) return 'Sunny';
  if ([1, 2].includes(code)) return 'Partly Cloudy';
  if (code === 3) return 'Cloudy';
  if ([45, 48].includes(code)) return 'Foggy';
  if ([51, 53, 55, 56, 57, 61, 63, 66, 67, 80, 81].includes(code)) {
    return 'Rainy';
  }
  if ([65, 82, 95, 96, 99].includes(code)) return 'Heavy Rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Cloudy';
  return 'Partly Cloudy';
};

const getWeatherLocation = async (location) => {
  const query = String(location || '').trim();

  if (!query) {
    throw new Error('Please enter a city or location name.');
  }

  const url =
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Could not search for this location. Please try again.');
  }

  const result = await response.json();
  const places = result.results || [];

  if (!places.length) {
    throw new Error(
      `No location found for "${query}". Check the spelling and try again.`
    );
  }

  // Prefer Indian locations if multiple matches are returned.
  return places.find(place => place.country_code === 'IN') || places[0];
};

const makeWeatherAlerts = ({ temperature, windSpeed, forecast }) => {
  const alerts = [];
  const maxRainProbability = Math.max(
    0,
    ...forecast.map(day => Number(day.rain) || 0)
  );

  if (maxRainProbability >= 70) {
    alerts.push({
      severity: 'warning',
      message:
        `High chance of rain (${maxRainProbability}%) during the next 7 days. Check field drainage and avoid pesticide spraying just before rainfall.`,
    });
  }

  if (temperature >= 38) {
    alerts.push({
      severity: 'danger',
      message:
        `High temperature (${temperature}°C). Avoid outdoor field work during peak afternoon heat and check crop soil moisture.`,
    });
  }

  if (windSpeed >= 40) {
    alerts.push({
      severity: 'warning',
      message:
        `Strong wind (${windSpeed} km/h). Avoid pesticide spraying in strong winds and secure lightweight farm materials.`,
    });
  }

  return alerts;
};

const makeFarmingPrecautions = ({
  temperature,
  windSpeed,
  humidity,
  forecast,
}) => {
  const tips = [];
  const maxRainProbability = Math.max(
    0,
    ...forecast.map(day => Number(day.rain) || 0)
  );

  if (maxRainProbability >= 60) {
    tips.push(
      'Rain is possible in the coming days. Check drainage, protect harvested produce, and avoid spraying just before rainfall.'
    );
  }

  if (temperature >= 35) {
    tips.push(
      'Hot conditions: check soil moisture regularly and irrigate during cooler morning or evening hours when needed.'
    );
  }

  if (humidity >= 80) {
    tips.push(
      'High humidity may favour some crop diseases. Inspect leaves regularly and follow local crop-specific agricultural guidance.'
    );
  }

  if (windSpeed >= 30) {
    tips.push(
      'Wind may affect spraying. Avoid pesticide application during strong winds and follow the product label.'
    );
  }

  if (!tips.length) {
    tips.push(
      'No major rule-based weather precaution was triggered. Continue routine crop monitoring and follow local agricultural advisories.'
    );
  }

  tips.push(
    'These are general automatically generated tips, not official government weather warnings or crop-specific diagnosis.'
  );

  return tips;
};

export const weatherService = {
  getWeather: async (location) => {
    const place = await getWeatherLocation(location);

    const params = new URLSearchParams({
      latitude: String(place.latitude),
      longitude: String(place.longitude),
      current:
        'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
      hourly: 'temperature_2m,relative_humidity_2m,precipitation_probability,visibility,uv_index',
      daily:
        'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      forecast_days: '7',
      timezone: 'auto',
    });

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(
        'Weather service is temporarily unavailable. Please refresh and try again.'
      );
    }

    const result = await response.json();

    if (!result.current || !result.daily) {
      throw new Error('Weather data was incomplete. Please try again.');
    }

    const current = result.current;
    const hourly = result.hourly || {};
    const hourlyTimes = hourly.time || [];

    let closestHourIndex = 0;

    if (current.time && hourlyTimes.length) {
      const currentTime = new Date(current.time).getTime();
      let smallestDifference = Infinity;

      hourlyTimes.forEach((time, index) => {
        const difference = Math.abs(
          new Date(time).getTime() - currentTime
        );

        if (difference < smallestDifference) {
          smallestDifference = difference;
          closestHourIndex = index;
        }
      });
    }

    const daily = result.daily;

    const forecast = (daily.time || []).map((date, index) => ({
      day:
        index === 0
          ? 'Today'
          : new Date(`${date}T12:00:00`).toLocaleDateString(
              'en-US',
              { weekday: 'short' }
            ),
      high: Math.round(
        daily.temperature_2m_max?.[index] ?? current.temperature_2m
      ),
      low: Math.round(
        daily.temperature_2m_min?.[index] ?? current.temperature_2m
      ),
      condition: describeWeatherCode(daily.weather_code?.[index]),
      rain: Math.round(
        daily.precipitation_probability_max?.[index] ?? 0
      ),
    }));

    const temperature = Math.round(current.temperature_2m);
    const feelsLike = Math.round(
      current.apparent_temperature ?? current.temperature_2m
    );
    const humidity = Math.round(current.relative_humidity_2m ?? 0);
    const windSpeed = Math.round(current.wind_speed_10m ?? 0);

    const visibilityMeters = hourly.visibility?.[closestHourIndex];
    const visibility =
      visibilityMeters == null
        ? 0
        : Math.round((visibilityMeters / 1000) * 10) / 10;

    const uvIndex = Math.round(
      (hourly.uv_index?.[closestHourIndex] ?? 0) * 10
    ) / 10;

    // 24-hour live hourly trends for authentic real-time forecast graphs
    const hourlyTemps = hourly.temperature_2m || [];
    const hourlyRains = hourly.precipitation_probability || [];
    const hourlyHumids = hourly.relative_humidity_2m || [];
    const hourlyTrends = [];
    const nowMs = Date.now();
    for (let i = 0; i < hourlyTimes.length && hourlyTrends.length < 12; i += 2) {
      const t = new Date(hourlyTimes[i]);
      if (t.getTime() >= nowMs - 3600000 || hourlyTrends.length > 0) {
        hourlyTrends.push({
          time: t.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
          temp: Math.round(hourlyTemps[i] ?? current.temperature_2m),
          rain: Math.round(hourlyRains[i] ?? 0),
          humidity: Math.round(hourlyHumids[i] ?? current.relative_humidity_2m),
        });
      }
    }

    const weather = {
      city: place.name,
      state: place.admin1 || place.country || '',
      temperature,
      feelsLike,
      humidity,
      windSpeed,
      visibility,
      uvIndex,
      condition: describeWeatherCode(current.weather_code),
      forecast,
      alerts: [],
      farmingPrecautions: [],
      source: 'Open-Meteo',
      updatedAt: current.time || new Date().toISOString(),
      hourlyTrends,
    };

    weather.alerts = makeWeatherAlerts(weather);
    weather.farmingPrecautions = makeFarmingPrecautions(weather);

    return { success: true, data: weather };
  },

  getLocations: async (search = 'Lucknow') => {
    const place = await getWeatherLocation(search);
    return { success: true, data: [place.name] };
  },
};

// ---- Authentic AI Disease Detection Service (PyTorch + Grad-CAM) ----
export const diseaseService = {
  identifyCrop: async (imageFile) => {
    const API_URL = 'http://localhost:8000/api/identify-crop';
    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const json = await response.json();
        return json.data;
      }
    } catch (err) {
      console.warn('OpenPlants crop identification offline:', err);
    }
    return null;
  },
  analyzeImage: async (crop, imageFile) => {
    const API_URL = 'http://localhost:8000/api/detect-disease';

    const formData = new FormData();
    formData.append('crop', crop || '');
    formData.append('file', imageFile);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const json = await response.json();
        return {
          success: true,
          data: {
            ...json.data,
            analyzedAt: new Date().toISOString(),
          },
        };
      }

      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || 'Server encountered an error during neural inference.');
    } catch (err) {
      if (err.message && !err.message.includes('Failed to fetch')) {
        throw err;
      }
      throw new Error(
        'FastAPI AI Backend is currently offline at http://localhost:8000. Please start the backend service to run actual PyTorch neural network diagnosis with Grad-CAM visualization.'
      );
    }
  },
};

// ---- Crop Planning Service ----
export const cropPlanningService = {
  getRecommendations: async (formData) => {
    await delay(1500);

    const scored = CROP_RECOMMENDATIONS.map(crop => {
      let score = crop.suitability;

      if (
        formData.soilType === 'Alluvial' &&
        crop.name.includes('Wheat')
      ) score += 5;

      if (
        formData.budget === 'low' &&
        crop.cost.includes('8,000')
      ) score += 5;

      if (
        formData.waterAvailability === 'limited' &&
        crop.waterReq.includes('Low')
      ) score += 8;

      return {
        ...crop,
        suitability: Math.min(99, score),
      };
    });

    scored.sort((a, b) => b.suitability - a.suitability);

    return { success: true, data: scored };
  },
};

// ---- Yield Prediction Service ----
export const yieldService = {
  predictYield: async (formData) => {
    await delay(1800);

    const {
      crop,
      landArea,
      soilType,
      irrigationMethod,
      farmingMethod,
    } = formData;

    const cropKey = crop?.toLowerCase();
    const base =
      YIELD_ESTIMATE_BASE[cropKey] || YIELD_ESTIMATE_BASE['wheat'];

    const soilFactor = base.factors[soilType?.toLowerCase()] || 1.0;

    const irrigFactor =
      irrigationMethod === 'drip'
        ? 1.15
        : irrigationMethod === 'sprinkler'
          ? 1.10
          : 1.0;

    const farmFactor =
      farmingMethod === 'organic'
        ? 0.9
        : farmingMethod === 'precision'
          ? 1.15
          : 1.0;

    const estimatedPerAcre = (
      base.baseYield * soilFactor * irrigFactor * farmFactor
    ).toFixed(1);

    const totalEstimate = (
      estimatedPerAcre * parseFloat(landArea || 1)
    ).toFixed(1);

    return {
      success: true,
      data: {
        crop,
        estimatedPerAcre: parseFloat(estimatedPerAcre),
        totalEstimate: parseFloat(totalEstimate),
        unit: base.unit,
        lowScenario: (totalEstimate * 0.80).toFixed(1),
        normalScenario: totalEstimate,
        favorableScenario: (totalEstimate * 1.20).toFixed(1),
        factors: [
          {
            name: 'Soil Condition',
            impact:
              soilFactor >= 1.1
                ? 'Positive'
                : soilFactor >= 1.0
                  ? 'Neutral'
                  : 'Negative',
            value: `${((soilFactor - 1) * 100).toFixed(0)}%`,
          },
          {
            name: 'Irrigation Method',
            impact: irrigFactor >= 1.1 ? 'Positive' : 'Neutral',
            value: `${((irrigFactor - 1) * 100).toFixed(0)}%`,
          },
          {
            name: 'Farming Method',
            impact:
              farmFactor > 1
                ? 'Positive'
                : farmFactor < 1
                  ? 'Negative'
                  : 'Neutral',
            value: `${((farmFactor - 1) * 100).toFixed(0)}%`,
          },
        ],
        disclaimer:
          'This is a demo estimator. Actual yields vary based on weather, pest pressure, and management practices.',
      },
    };
  },
};

// ---- Mandi Price Service ----
export const mandiService = {
  getPrices: async (filters = {}) => {
    await delay(600);

    let data = [...MANDI_PRICES];

    if (filters.crop && filters.crop !== 'all') {
      data = data.filter(
        p => p.crop.toLowerCase() === filters.crop.toLowerCase()
      );
    }

    if (filters.state && filters.state !== 'all') {
      data = data.filter(p => p.state === filters.state);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter(
        p =>
          p.market.toLowerCase().includes(q) ||
          p.crop.toLowerCase().includes(q)
      );
    }

    return { success: true, data };
  },
};

// ---- Marketplace Service ----
export const marketplaceService = {
  getListings: async (filters = {}) => {
    await delay(600);

    const stored = localStorage.getItem('ff_marketplace_listings');
    let data = stored
      ? JSON.parse(stored)
      : [...DEMO_MARKETPLACE_LISTINGS];

    if (filters.crop && filters.crop !== 'all') {
      data = data.filter(l =>
        l.cropName.toLowerCase().includes(filters.crop.toLowerCase())
      );
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();

      data = data.filter(
        l =>
          l.cropName.toLowerCase().includes(q) ||
          l.farmerName.toLowerCase().includes(q) ||
          l.location.toLowerCase().includes(q)
      );
    }

    if (
      filters.isOrganic !== undefined &&
      filters.isOrganic !== null
    ) {
      data = data.filter(l => l.isOrganic === filters.isOrganic);
    }

    return { success: true, data };
  },

  addListing: async (listing) => {
    await delay(800);

    const stored = localStorage.getItem('ff_marketplace_listings');
    const existing = stored
      ? JSON.parse(stored)
      : [...DEMO_MARKETPLACE_LISTINGS];

    const newListing = {
      ...listing,
      id: 'ml-' + Date.now(),
      isOwner: true,
      isFavorite: false,
      postedDate: new Date().toISOString().split('T')[0],
    };

    const updated = [newListing, ...existing];

    localStorage.setItem(
      'ff_marketplace_listings',
      JSON.stringify(updated)
    );

    return { success: true, data: newListing };
  },

  updateListing: async (id, updates) => {
    await delay(600);

    const stored = localStorage.getItem('ff_marketplace_listings');
    const existing = stored
      ? JSON.parse(stored)
      : [...DEMO_MARKETPLACE_LISTINGS];

    const updated = existing.map(l =>
      l.id === id ? { ...l, ...updates } : l
    );

    localStorage.setItem(
      'ff_marketplace_listings',
      JSON.stringify(updated)
    );

    return { success: true };
  },

  deleteListing: async (id) => {
    await delay(600);

    const stored = localStorage.getItem('ff_marketplace_listings');
    const existing = stored
      ? JSON.parse(stored)
      : [...DEMO_MARKETPLACE_LISTINGS];

    const updated = existing.filter(l => l.id !== id);

    localStorage.setItem(
      'ff_marketplace_listings',
      JSON.stringify(updated)
    );

    return { success: true };
  },

  submitInquiry: async (listingId, buyerData) => {
    await delay(1000);

    return {
      success: true,
      message:
        'Inquiry submitted (Demo). Seller would be notified in a real system.',
      inquiryId: 'INQ-' + Date.now(),
    };
  },
};

// ---- Government Schemes Service ----
export const schemesService = {
  getSchemes: async (filters = {}) => {
    await delay(500);

    let data = [...GOVT_SCHEMES];

    if (filters.category && filters.category !== 'all') {
      data = data.filter(s => s.category === filters.category);
    }

    if (filters.state && filters.state !== 'all') {
      data = data.filter(
        s =>
          s.states.includes(filters.state) ||
          s.states.includes('All India')
      );
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();

      data = data.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          s.shortDesc.toLowerCase().includes(q)
      );
    }

    return { success: true, data };
  },
};

// ---- AI Chat Service (Bilingual English + Hindi) ----
export const chatService = {
  getResponse: async (message, language = 'en') => {
    const API_URL = 'http://localhost:8000/api/chat';

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, language }),
      });

      if (response.ok) {
        const json = await response.json();
        return {
          success: true,
          data: {
            ...json.data,
            timestamp: new Date().toISOString(),
          },
        };
      }
    } catch (err) {
      console.warn('FastAPI chat backend offline, using client-side agronomic knowledge fallback:', err.message);
    }

    // Client-side agronomic intelligence fallback
    await delay(700);
    const msg = message.toLowerCase();
    const responses = language === 'hi' ? CHAT_RESPONSES_HI : CHAT_RESPONSES_EN;

    let responseKey = 'default';
    if (msg.includes('irrigat') || msg.includes('water') || msg.includes('पानी') || msg.includes('सिंचाई')) {
      responseKey = 'irrigation';
    } else if (msg.includes('disease') || msg.includes('pest') || msg.includes('रोग') || msg.includes('कीट') || msg.includes('रतुआ') || msg.includes('ब्लास्ट')) {
      responseKey = 'disease';
    } else if (msg.includes('weather') || msg.includes('rain') || msg.includes('मौसम') || msg.includes('बारिश') || msg.includes('पाला')) {
      responseKey = 'weather';
    } else if (msg.includes('fertilizer') || msg.includes('urea') || msg.includes('npk') || msg.includes('खाद') || msg.includes('यूरिया') || msg.includes('डीएपी')) {
      responseKey = 'fertilizer';
    } else if (msg.includes('kisan') || msg.includes('pm kisan') || msg.includes('योजना') || msg.includes('सब्सिडी') || msg.includes('scheme')) {
      return {
        success: true,
        data: {
          message: language === 'hi'
            ? '🏛️ **पीएम-किसान योजना सहायता:** पात्र किसानों को ₹6,000 प्रति वर्ष (₹2,000 की 3 किस्तें) मिलती हैं। किस्त पाने के लिए `pmkisan.gov.in` पर आधार eKYC व बैंक खाता NPCI से लिंक होना अनिवार्य है। हेल्पलाइन: 155261.'
            : '🏛️ **PM-KISAN Scheme Support:** Eligible farmers receive ₹6,000/year in 3 installments of ₹2,000. Ensure your Aadhaar eKYC is completed and bank account is NPCI-linked at `pmkisan.gov.in`. Helpline: 155261.',
          type: 'assistant',
          timestamp: new Date().toISOString(),
        }
      };
    } else if (msg.includes('crop') || msg.includes('plant') || msg.includes('फसल') || msg.includes('गेहूं') || msg.includes('धान')) {
      responseKey = 'crop_selection';
    } else if (msg.includes('sow') || msg.includes('बुवाई')) {
      responseKey = 'sowing';
    }

    return {
      success: true,
      data: {
        message: responses[responseKey] || responses['default'],
        type: 'assistant',
        timestamp: new Date().toISOString(),
      },
    };
  },
};

// ---- Task Service ----
export const taskService = {
  getTasks: () => {
    const stored = localStorage.getItem('ff_tasks');
    return stored ? JSON.parse(stored) : [];
  },

  saveTasks: (tasks) => {
    localStorage.setItem('ff_tasks', JSON.stringify(tasks));
  },
};

// ---- Profile Service ----
export const profileService = {
  getProfile: () => {
    const stored = localStorage.getItem('ff_profile');
    return stored ? JSON.parse(stored) : null;
  },

  saveProfile: (profile) => {
    localStorage.setItem('ff_profile', JSON.stringify(profile));
  },
};

// ---- Settings Service ----
export const settingsService = {
  getSettings: () => {
    const stored = localStorage.getItem('ff_settings');

    return stored ? JSON.parse(stored) : {
      language: 'en',
      theme: 'light',
      notifications: {
        weather: true,
        mandi: true,
        tasks: true,
        schemes: false,
      },
      dashboard: {
        showWeather: true,
        showMandi: true,
        showTasks: true,
        showYield: true,
      },
    };
  },

  saveSettings: (settings) => {
    localStorage.setItem('ff_settings', JSON.stringify(settings));
  },

  clearAllData: () => {
    const keys = [
      'ff_tasks',
      'ff_profile',
      'ff_settings',
      'ff_marketplace_listings',
      'ff_disease_history',
      'ff_chat_history',
      'ff_bookmarks',
      'ff_favorites',
    ];

    keys.forEach(key => localStorage.removeItem(key));
  },
};