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

// ---- Auth Service ----
export const authService = {
  login: async (email, password) => {
    await delay(1000);
    if (!email || !password) {
      throw new Error('Please enter email and password');
    }

    return {
      success: true,
      token: 'demo-jwt-token-' + Date.now(),
      user: {
        id: 'demo-farmer-001',
        email,
        name: 'Rajesh Kumar',
        role: 'farmer',
      },
    };
  },

  register: async (data) => {
    await delay(1200);
    return {
      success: true,
      message: 'Account created successfully! (Demo Mode)',
    };
  },

  logout: async () => {
    await delay(300);
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
      hourly: 'visibility,uv_index',
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

// ---- Disease Detection Service ----
export const diseaseService = {
  analyzeImage: async (crop, imageFile) => {
    const API_URL = 'http://localhost:8000/api/detect-disease';

    try {
      const formData = new FormData();
      formData.append('crop', crop || '');
      formData.append('file', imageFile);

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

      console.warn(
        'FastAPI backend returned non-OK status; using local fallback.'
      );
    } catch (err) {
      console.warn(
        'FastAPI backend not reachable; using local fallback:',
        err.message
      );
    }

    await delay(1500);

    const diseases =
      CROP_DISEASES[crop?.toLowerCase()] || CROP_DISEASES['wheat'];

    const randomDisease =
      diseases[Math.floor(Math.random() * diseases.length)];

    return {
      success: true,
      data: {
        ...randomDisease,
        analyzedAt: new Date().toISOString(),
        cropAnalyzed: crop,
        disclaimer:
          'This is a simulated demo prediction, not real AI analysis. Consult an agriculture expert for actual diagnosis.',
      },
    };
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

// ---- AI Chat Service ----
export const chatService = {
  getResponse: async (message, language = 'en') => {
    await delay(1200);

    const msg = message.toLowerCase();
    const responses =
      language === 'hi' ? CHAT_RESPONSES_HI : CHAT_RESPONSES_EN;

    let responseKey = 'default';

    if (
      msg.includes('irrigat') ||
      msg.includes('water') ||
      msg.includes('पानी') ||
      msg.includes('सिंचाई')
    ) {
      responseKey = 'irrigation';
    } else if (
      msg.includes('disease') ||
      msg.includes('pest') ||
      msg.includes('रोग') ||
      msg.includes('कीट')
    ) {
      responseKey = 'disease';
    } else if (
      msg.includes('weather') ||
      msg.includes('rain') ||
      msg.includes('मौसम') ||
      msg.includes('बारिश')
    ) {
      responseKey = 'weather';
    } else if (
      msg.includes('fertilizer') ||
      msg.includes('urea') ||
      msg.includes('npk') ||
      msg.includes('खाद')
    ) {
      responseKey = 'fertilizer';
    } else if (
      msg.includes('crop') ||
      msg.includes('plant') ||
      msg.includes('फसल') ||
      msg.includes('किस')
    ) {
      responseKey = 'crop_selection';
    } else if (
      msg.includes('sow') ||
      msg.includes('plant') ||
      msg.includes('बुवाई') ||
      msg.includes('कब लगाएं')
    ) {
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