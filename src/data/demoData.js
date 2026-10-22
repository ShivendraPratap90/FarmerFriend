// ============================================================
// FARMER FRIEND - Demo Data
// All data is illustrative and clearly labeled as demo content
// ============================================================

export const DEMO_USER = {
  id: 'demo-farmer-001',
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@demo.com',
  phone: '+91 98765 43210',
  state: 'Uttar Pradesh',
  district: 'Lucknow',
  village: 'Mohanlalganj',
  landSize: '5.5',
  landUnit: 'acres',
  soilType: 'Alluvial',
  primaryCrop: 'Wheat',
  language: 'en',
  joinedDate: '2024-01-15',
  avatar: null,
  role: 'farmer',
};

export const WEATHER_DATA = {
  'Lucknow': {
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    temperature: 28,
    feelsLike: 32,
    humidity: 68,
    windSpeed: 12,
    rainfall: 45,
    condition: 'Partly Cloudy',
    uvIndex: 6,
    visibility: 8,
    pressure: 1013,
    forecast: [
      { day: 'Today', high: 30, low: 22, condition: 'Partly Cloudy', rain: 20 },
      { day: 'Tomorrow', high: 28, low: 20, condition: 'Rainy', rain: 75 },
      { day: 'Wed', high: 25, low: 19, condition: 'Heavy Rain', rain: 90 },
      { day: 'Thu', high: 27, low: 21, condition: 'Cloudy', rain: 40 },
      { day: 'Fri', high: 31, low: 23, condition: 'Sunny', rain: 10 },
      { day: 'Sat', high: 33, low: 25, condition: 'Sunny', rain: 5 },
      { day: 'Sun', high: 29, low: 22, condition: 'Partly Cloudy', rain: 25 },
    ],
    alerts: [
      { type: 'rainfall', severity: 'warning', message: 'Heavy rainfall expected on Wednesday. Delay irrigation.', icon: 'cloud-rain' },
      { type: 'heatwave', severity: 'info', message: 'Temperatures may rise above 32°C this weekend. Keep crops hydrated.', icon: 'thermometer' },
    ],
    farmingPrecautions: [
      'Postpone pesticide spraying before rain',
      'Ensure proper drainage in fields',
      'Protect tender crops from strong winds',
      'Harvest mature crops before heavy rain',
    ],
  },
  'Pune': {
    city: 'Pune',
    state: 'Maharashtra',
    temperature: 26,
    feelsLike: 29,
    humidity: 72,
    windSpeed: 18,
    rainfall: 62,
    condition: 'Rainy',
    uvIndex: 4,
    visibility: 6,
    pressure: 1008,
    forecast: [
      { day: 'Today', high: 28, low: 21, condition: 'Rainy', rain: 80 },
      { day: 'Tomorrow', high: 26, low: 20, condition: 'Heavy Rain', rain: 95 },
      { day: 'Wed', high: 24, low: 18, condition: 'Rainy', rain: 70 },
      { day: 'Thu', high: 27, low: 20, condition: 'Cloudy', rain: 35 },
      { day: 'Fri', high: 29, low: 22, condition: 'Partly Cloudy', rain: 20 },
      { day: 'Sat', high: 31, low: 23, condition: 'Sunny', rain: 8 },
      { day: 'Sun', high: 30, low: 22, condition: 'Sunny', rain: 5 },
    ],
    alerts: [
      { type: 'rainfall', severity: 'danger', message: 'Very heavy rainfall expected. Take precautions.', icon: 'cloud-rain' },
    ],
    farmingPrecautions: [
      'Avoid field work during heavy rain',
      'Check drainage channels',
      'Store harvested crops properly',
    ],
  },
  'Amritsar': {
    city: 'Amritsar',
    state: 'Punjab',
    temperature: 24,
    feelsLike: 26,
    humidity: 55,
    windSpeed: 8,
    rainfall: 15,
    condition: 'Sunny',
    uvIndex: 8,
    visibility: 12,
    pressure: 1018,
    forecast: [
      { day: 'Today', high: 26, low: 16, condition: 'Sunny', rain: 5 },
      { day: 'Tomorrow', high: 28, low: 17, condition: 'Sunny', rain: 5 },
      { day: 'Wed', high: 30, low: 18, condition: 'Partly Cloudy', rain: 15 },
      { day: 'Thu', high: 29, low: 18, condition: 'Partly Cloudy', rain: 20 },
      { day: 'Fri', high: 27, low: 17, condition: 'Cloudy', rain: 35 },
      { day: 'Sat', high: 24, low: 15, condition: 'Rainy', rain: 65 },
      { day: 'Sun', high: 22, low: 14, condition: 'Rainy', rain: 70 },
    ],
    alerts: [
      { type: 'dry', severity: 'warning', message: 'Dry spell likely. Ensure adequate irrigation.', icon: 'sun' },
    ],
    farmingPrecautions: [
      'Irrigate crops regularly due to dry conditions',
      'Apply mulching to retain soil moisture',
      'Monitor crops for drought stress signs',
    ],
  },
  'Hyderabad': {
    city: 'Hyderabad',
    state: 'Telangana',
    temperature: 32,
    feelsLike: 36,
    humidity: 48,
    windSpeed: 14,
    rainfall: 10,
    condition: 'Hot & Sunny',
    uvIndex: 9,
    visibility: 15,
    pressure: 1010,
    forecast: [
      { day: 'Today', high: 34, low: 24, condition: 'Sunny', rain: 5 },
      { day: 'Tomorrow', high: 35, low: 25, condition: 'Hot & Sunny', rain: 5 },
      { day: 'Wed', high: 36, low: 26, condition: 'Hot & Sunny', rain: 5 },
      { day: 'Thu', high: 33, low: 24, condition: 'Partly Cloudy', rain: 15 },
      { day: 'Fri', high: 30, low: 22, condition: 'Partly Cloudy', rain: 30 },
      { day: 'Sat', high: 28, low: 21, condition: 'Cloudy', rain: 45 },
      { day: 'Sun', high: 27, low: 20, condition: 'Rainy', rain: 60 },
    ],
    alerts: [
      { type: 'heatwave', severity: 'danger', message: 'Heatwave alert! Temperatures above 35°C. Protect crops.', icon: 'thermometer' },
    ],
    farmingPrecautions: [
      'Water crops in early morning or evening',
      'Provide shade for sensitive crops',
      'Monitor for heat stress symptoms',
      'Ensure adequate water supply',
    ],
  },
};

export const DEMO_LOCATIONS = Object.keys(WEATHER_DATA);

export const WEATHER_TREND_DATA = [
  { month: 'Apr', temp: 34, rainfall: 12 },
  { month: 'May', temp: 38, rainfall: 18 },
  { month: 'Jun', temp: 35, rainfall: 95 },
  { month: 'Jul', temp: 31, rainfall: 180 },
  { month: 'Aug', temp: 30, rainfall: 165 },
  { month: 'Sep', temp: 29, rainfall: 90 },
  { month: 'Oct', temp: 28, rainfall: 40 },
  { month: 'Nov', temp: 24, rainfall: 10 },
];

export const CROP_DISEASES = {
  wheat: [
    {
      name: 'Wheat Rust',
      type: 'Fungal Disease',
      severity: 'High',
      confidence: 87,
      symptoms: ['Orange/brown pustules on leaves', 'Yellowing of leaves', 'Premature leaf death', 'Reduced grain filling'],
      treatments: ['Apply Propiconazole 25% EC fungicide', 'Use Tebuconazole-based sprays', 'Remove and destroy infected plant debris'],
      prevention: ['Use rust-resistant wheat varieties', 'Timely sowing to avoid peak rust season', 'Balanced fertilization (avoid excess nitrogen)', 'Regular field monitoring'],
      image: null,
    },
    {
      name: 'Powdery Mildew',
      type: 'Fungal Disease',
      severity: 'Medium',
      confidence: 82,
      symptoms: ['White powdery coating on leaves', 'Yellowing around affected areas', 'Reduced photosynthesis', 'Stunted growth'],
      treatments: ['Apply Sulphur-based fungicide', 'Use Hexaconazole spray', 'Improve air circulation in field'],
      prevention: ['Plant resistant varieties', 'Avoid over-crowding', 'Balanced nitrogen application', 'Early detection and treatment'],
      image: null,
    },
  ],
  rice: [
    {
      name: 'Rice Blast',
      type: 'Fungal Disease',
      severity: 'High',
      confidence: 91,
      symptoms: ['Diamond-shaped lesions on leaves', 'White or gray centers with brown borders', 'Neck rot causing empty panicles', 'Seedling blight'],
      treatments: ['Apply Tricyclazole 75% WP', 'Use Carbendazim sprays', 'Apply systemic fungicides at boot stage'],
      prevention: ['Use blast-resistant varieties', 'Balanced silicon and nitrogen fertilization', 'Avoid excess nitrogen', 'Field sanitation'],
      image: null,
    },
    {
      name: 'Bacterial Leaf Blight',
      type: 'Bacterial Disease',
      severity: 'Medium',
      confidence: 79,
      symptoms: ['Water-soaked margins on leaves', 'Yellow to white discoloration', 'Wilting of seedlings', 'Yellowing from leaf tip'],
      treatments: ['Apply Copper-based bactericides', 'Use Streptomycin sulfate spray', 'Remove infected plant material'],
      prevention: ['Use resistant varieties', 'Avoid flood irrigation', 'Balanced fertilization', 'Treat seeds before sowing'],
      image: null,
    },
  ],
  tomato: [
    {
      name: 'Early Blight',
      type: 'Fungal Disease',
      severity: 'Medium',
      confidence: 85,
      symptoms: ['Dark brown spots with concentric rings', 'Yellowing of older leaves', 'Lesions on stems and fruits', 'Defoliation in severe cases'],
      treatments: ['Apply Mancozeb 75% WP', 'Use Chlorothalonil fungicide', 'Apply Copper oxychloride spray'],
      prevention: ['Use certified disease-free seeds', 'Crop rotation (3-year cycle)', 'Avoid overhead irrigation', 'Proper plant spacing'],
      image: null,
    },
  ],
  potato: [
    {
      name: 'Late Blight',
      type: 'Fungal/Oomycete Disease',
      severity: 'High',
      confidence: 93,
      symptoms: ['Water-soaked lesions on leaves', 'White cottony growth under leaves', 'Brown rot in tubers', 'Rapid spread in wet conditions'],
      treatments: ['Apply Metalaxyl-M + Mancozeb', 'Use Cymoxanil-based fungicides', 'Apply Fosetyl-Al spray'],
      prevention: ['Use certified disease-free tubers', 'Hilling to protect tubers', 'Good drainage', 'Remove volunteer plants'],
      image: null,
    },
  ],
};

export const CROP_RECOMMENDATIONS = [
  {
    id: 1,
    name: 'Wheat (Gehun)',
    variety: 'HD-2967',
    suitability: 92,
    duration: '120-130 days',
    waterReq: 'Moderate (45-65 cm)',
    season: 'Rabi (Oct-Nov)',
    cost: '₹12,000-15,000/acre',
    risk: 'Low',
    explanation: 'Ideal for alluvial soil with good nitrogen content. HD-2967 is rust-resistant and high yielding.',
    expectedYield: '18-22 quintals/acre',
    image: null,
  },
  {
    id: 2,
    name: 'Mustard (Sarson)',
    variety: 'Pusa Bold',
    suitability: 88,
    duration: '110-120 days',
    waterReq: 'Low (25-35 cm)',
    season: 'Rabi (Oct)',
    cost: '₹8,000-10,000/acre',
    risk: 'Low',
    explanation: 'Excellent for well-drained alluvial soils. Drought-tolerant variety with good market demand.',
    expectedYield: '6-8 quintals/acre',
    image: null,
  },
  {
    id: 3,
    name: 'Gram (Chana)',
    variety: 'JG-11',
    suitability: 80,
    duration: '100-115 days',
    waterReq: 'Low (20-30 cm)',
    season: 'Rabi (Oct-Nov)',
    cost: '₹10,000-12,000/acre',
    risk: 'Medium',
    explanation: 'Good nitrogen-fixing crop for soil health. Requires well-drained soil to prevent root rot.',
    expectedYield: '8-10 quintals/acre',
    image: null,
  },
  {
    id: 4,
    name: 'Potato (Aloo)',
    variety: 'Kufri Jyoti',
    suitability: 76,
    duration: '90-110 days',
    waterReq: 'High (50-70 cm)',
    season: 'Rabi (Oct-Nov)',
    cost: '₹25,000-35,000/acre',
    risk: 'Medium-High',
    explanation: 'High-value crop with good market demand. Requires careful management and adequate moisture.',
    expectedYield: '80-100 quintals/acre',
    image: null,
  },
];

export const MANDI_PRICES = [
  { id: 1, crop: 'Wheat', variety: 'Sharbati', market: 'Lucknow', state: 'Uttar Pradesh', district: 'Lucknow', min: 1820, max: 1940, modal: 1880, unit: 'quintal', date: '2025-10-20' },
  { id: 2, crop: 'Rice', variety: 'Basmati 1509', market: 'Amritsar', state: 'Punjab', district: 'Amritsar', min: 3100, max: 3600, modal: 3350, unit: 'quintal', date: '2025-10-20' },
  { id: 3, crop: 'Tomato', variety: 'Desi', market: 'Nasik', state: 'Maharashtra', district: 'Nasik', min: 800, max: 1400, modal: 1100, unit: 'quintal', date: '2025-10-20' },
  { id: 4, crop: 'Potato', variety: 'Kufri Jyoti', market: 'Agra', state: 'Uttar Pradesh', district: 'Agra', min: 620, max: 820, modal: 720, unit: 'quintal', date: '2025-10-20' },
  { id: 5, crop: 'Onion', variety: 'Nasik Red', market: 'Lasalgaon', state: 'Maharashtra', district: 'Nasik', min: 950, max: 1350, modal: 1150, unit: 'quintal', date: '2025-10-20' },
  { id: 6, crop: 'Mustard', variety: 'Yellow', market: 'Jaipur', state: 'Rajasthan', district: 'Jaipur', min: 4600, max: 5200, modal: 4900, unit: 'quintal', date: '2025-10-20' },
  { id: 7, crop: 'Cotton', variety: 'BT Cotton', market: 'Akola', state: 'Maharashtra', district: 'Akola', min: 5800, max: 6800, modal: 6200, unit: 'quintal', date: '2025-10-20' },
  { id: 8, crop: 'Maize', variety: 'Yellow Dent', market: 'Davangere', state: 'Karnataka', district: 'Davangere', min: 1380, max: 1680, modal: 1520, unit: 'quintal', date: '2025-10-20' },
  { id: 9, crop: 'Soybean', variety: 'JS-335', market: 'Indore', state: 'Madhya Pradesh', district: 'Indore', min: 3850, max: 4450, modal: 4150, unit: 'quintal', date: '2025-10-20' },
  { id: 10, crop: 'Gram', variety: 'Desi', market: 'Bhopal', state: 'Madhya Pradesh', district: 'Bhopal', min: 4800, max: 5400, modal: 5100, unit: 'quintal', date: '2025-10-20' },
  { id: 11, crop: 'Wheat', variety: 'HD-2967', market: 'Kanpur', state: 'Uttar Pradesh', district: 'Kanpur', min: 1800, max: 1920, modal: 1860, unit: 'quintal', date: '2025-10-20' },
  { id: 12, crop: 'Rice', variety: 'Sona Masuri', market: 'Hyderabad', state: 'Telangana', district: 'Hyderabad', min: 2200, max: 2700, modal: 2450, unit: 'quintal', date: '2025-10-20' },
  { id: 13, crop: 'Tomato', variety: 'Hybrid F1', market: 'Bangalore', state: 'Karnataka', district: 'Bangalore', min: 1200, max: 1800, modal: 1500, unit: 'quintal', date: '2025-10-20' },
  { id: 14, crop: 'Potato', variety: 'Chipsona', market: 'Jalandhar', state: 'Punjab', district: 'Jalandhar', min: 680, max: 900, modal: 780, unit: 'quintal', date: '2025-10-20' },
  { id: 15, crop: 'Onion', variety: 'White Onion', market: 'Pune', state: 'Maharashtra', district: 'Pune', min: 880, max: 1200, modal: 1040, unit: 'quintal', date: '2025-10-20' },
];

export const MANDI_PRICE_TRENDS = [
  { month: 'May', Wheat: 1750, Rice: 2900, Tomato: 800 },
  { month: 'Jun', Wheat: 1800, Rice: 3000, Tomato: 1200 },
  { month: 'Jul', Wheat: 1820, Rice: 3100, Tomato: 900 },
  { month: 'Aug', Wheat: 1860, Rice: 3250, Tomato: 600 },
  { month: 'Sep', Wheat: 1900, Rice: 3400, Tomato: 1100 },
  { month: 'Oct', Wheat: 1880, Rice: 3350, Tomato: 1100 },
];

export const DEMO_MARKETPLACE_LISTINGS = [
  {
    id: 'ml-001',
    cropName: 'Basmati Rice',
    variety: '1509 Basmati',
    quantity: 50,
    quantityUnit: 'quintal',
    price: 3200,
    priceUnit: 'quintal',
    farmerName: 'Gurpreet Singh',
    location: 'Amritsar, Punjab',
    harvestDate: '2025-10-15',
    quality: 'Grade A',
    isOrganic: false,
    description: 'Freshly harvested 1509 Basmati rice. Long grain, aromatic. Available for immediate sale.',
    contactPhone: '+91 98100 XXXXX',
    isOwner: false,
    isFavorite: false,
    postedDate: '2025-10-18',
  },
  {
    id: 'ml-002',
    cropName: 'Tomatoes',
    variety: 'Hybrid F1',
    quantity: 20,
    quantityUnit: 'quintal',
    price: 1400,
    priceUnit: 'quintal',
    farmerName: 'Suresh Patel',
    location: 'Nashik, Maharashtra',
    harvestDate: '2025-10-20',
    quality: 'Premium',
    isOrganic: true,
    description: 'Organic tomatoes grown without chemicals. Fresh, firm, and naturally ripened.',
    contactPhone: '+91 97200 XXXXX',
    isOwner: false,
    isFavorite: false,
    postedDate: '2025-10-19',
  },
  {
    id: 'ml-003',
    cropName: 'Wheat',
    variety: 'HD-2967',
    quantity: 100,
    quantityUnit: 'quintal',
    price: 1850,
    priceUnit: 'quintal',
    farmerName: 'Rajesh Kumar',
    location: 'Lucknow, Uttar Pradesh',
    harvestDate: '2025-03-25',
    quality: 'Grade A',
    isOrganic: false,
    description: 'High quality wheat from rabi season 2025. Well cleaned and dried. Ready for milling.',
    contactPhone: '+91 98765 43210',
    isOwner: true,
    isFavorite: false,
    postedDate: '2025-10-10',
  },
  {
    id: 'ml-004',
    cropName: 'Mustard Seeds',
    variety: 'Pusa Bold',
    quantity: 30,
    quantityUnit: 'quintal',
    price: 4800,
    priceUnit: 'quintal',
    farmerName: 'Mohan Lal Sharma',
    location: 'Jaipur, Rajasthan',
    harvestDate: '2025-04-10',
    quality: 'Grade A',
    isOrganic: false,
    description: 'Bold mustard seeds with high oil content. Machine cleaned, moisture < 7%.',
    contactPhone: '+91 94100 XXXXX',
    isOwner: false,
    isFavorite: false,
    postedDate: '2025-10-15',
  },
  {
    id: 'ml-005',
    cropName: 'Potatoes',
    variety: 'Kufri Jyoti',
    quantity: 200,
    quantityUnit: 'quintal',
    price: 700,
    priceUnit: 'quintal',
    farmerName: 'Balvinder Singh',
    location: 'Jalandhar, Punjab',
    harvestDate: '2025-04-05',
    quality: 'Grade B',
    isOrganic: false,
    description: 'Fresh potatoes suitable for chips and table purpose. Available from cold storage.',
    contactPhone: '+91 98760 XXXXX',
    isOwner: false,
    isFavorite: false,
    postedDate: '2025-10-17',
  },
];

export const GOVT_SCHEMES = [
  {
    id: 'gs-001',
    name: 'PM-KISAN Samman Nidhi',
    category: 'Income Support',
    shortDesc: 'Direct income support of ₹6,000 per year to eligible farmer families.',
    eligibility: ['Land holding family with cultivable land', 'Family income below ₹10,000/month', 'Not employed in government service', 'Not a taxpayer'],
    benefits: ['₹6,000/year in 3 equal installments of ₹2,000', 'Direct bank transfer', 'No intermediaries'],
    documents: ['Aadhaar Card', 'Land Records (Khasra/Khatauni)', 'Bank Account Details', 'Mobile Number linked to Aadhaar'],
    applicationSteps: ['Visit PM-KISAN portal or nearest Common Service Centre', 'Fill registration form with land details', 'Submit Aadhaar and bank details', 'Verification by local patwari', 'Approval and benefit transfer'],
    states: ['All India'],
    officialUrl: 'https://pmkisan.gov.in',
    isBookmarked: false,
  },
  {
    id: 'gs-002',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    category: 'Crop Insurance',
    shortDesc: 'Comprehensive crop insurance scheme with low premium and high coverage for all farmers.',
    eligibility: ['All farmers growing notified crops', 'Sharecroppers/tenant farmers also eligible', 'Both loanee and non-loanee farmers'],
    benefits: ['Coverage against natural disasters, pests, diseases', 'Low premium: 1.5%-2% for Kharif, 2%-5% for Rabi', 'Full sum insured compensation on crop failure', 'Quick claim settlement via remote sensing'],
    documents: ['Aadhaar Card', 'Bank Account Details', 'Land Records', 'Sowing Certificate from Gram Panchayat', 'Loan account number (if loanee)'],
    applicationSteps: ['Contact nearest bank/insurance company before cut-off date', 'Fill application form with crop details', 'Pay premium amount', 'Get policy document', 'Claim within 72 hours of crop damage'],
    states: ['All India'],
    officialUrl: 'https://pmfby.gov.in',
    isBookmarked: false,
  },
  {
    id: 'gs-003',
    name: 'Kisan Credit Card (KCC)',
    category: 'Credit & Finance',
    shortDesc: 'Provides farmers with affordable credit for agricultural needs through a single flexible credit facility.',
    eligibility: ['Individual/Joint borrowers who are owner cultivators', 'Tenant farmers, oral lessees', 'Self Help Groups (SHGs) of farmers', 'Age: 18-75 years'],
    benefits: ['Credit limit up to ₹3 lakh at 4% interest (after subsidy)', 'Revolving credit for multiple crop seasons', 'Covers post-harvest expenses too', 'Personal accident insurance included'],
    documents: ['Identity Proof (Aadhaar/Voter ID)', 'Address Proof', 'Land Records', 'Passport size photos', 'Bank account details'],
    applicationSteps: ['Visit nearest commercial/cooperative bank', 'Submit KCC application form', 'Provide land documents', 'Bank verifies and sanctions limit', 'Receive Kisan Credit Card'],
    states: ['All India'],
    officialUrl: 'https://www.nabard.org',
    isBookmarked: false,
  },
  {
    id: 'gs-004',
    name: 'National Mission for Sustainable Agriculture (NMSA)',
    category: 'Sustainable Farming',
    shortDesc: 'Promotes sustainable agriculture through soil health improvement, water management, and organic farming.',
    eligibility: ['All farmers', 'Farmers practicing or willing to practice sustainable agriculture', 'Preference to small and marginal farmers'],
    benefits: ['Subsidy on soil health management inputs', 'Support for organic farming certification', 'Drip/sprinkler irrigation subsidy', 'Training and capacity building'],
    documents: ['Aadhaar Card', 'Land records', 'Bank account details', 'Application form from Agriculture Department'],
    applicationSteps: ['Contact district agriculture office', 'Submit application with crop and land details', 'Field verification by agriculture officer', 'Approval and subsidy disbursement'],
    states: ['All India'],
    officialUrl: null,
    isBookmarked: false,
  },
  {
    id: 'gs-005',
    name: 'UP Agriculture Subsidy Scheme',
    category: 'State Scheme',
    shortDesc: 'Uttar Pradesh government provides subsidies on seeds, fertilizers, and farm equipment to registered farmers.',
    eligibility: ['Registered farmers in Uttar Pradesh', 'Land records updated in state portal', 'Aadhaar linked bank account'],
    benefits: ['50% subsidy on quality seeds', 'Fertilizer at subsidized rates', 'Agricultural equipment loans at low interest', 'Free soil testing'],
    documents: ['UP Farmer Registration Number', 'Aadhaar Card', 'Land records (Khatauni)', 'Bank passbook'],
    applicationSteps: ['Register on UP Agriculture Portal', 'Select scheme and fill application', 'Upload required documents', 'Verification by block agriculture officer', 'Subsidy credited to bank account'],
    states: ['Uttar Pradesh'],
    officialUrl: 'https://upagriculture.com',
    isBookmarked: false,
  },
  {
    id: 'gs-006',
    name: 'Maharashtra Shetkari Sahayata Yojana',
    category: 'State Scheme',
    shortDesc: 'Maharashtra farmer assistance scheme providing comprehensive support for distressed farmers.',
    eligibility: ['Farmers registered in Maharashtra', 'Affected by drought/flood/pest attack', 'Land holding below 10 acres'],
    benefits: ['Emergency financial assistance', 'Subsidized seeds and fertilizers', 'Free crop loss assessment', 'Priority access to crop insurance'],
    documents: ['Maharashtra Farmer ID', 'Aadhaar Card', 'Land records (7/12 extract)', 'Bank account details', 'Crop damage proof'],
    applicationSteps: ['Visit nearest Talathi office', 'Submit damage report with photographs', 'Assessment by revenue officer', 'Approval and compensation transfer'],
    states: ['Maharashtra'],
    officialUrl: null,
    isBookmarked: false,
  },
];

export const CROP_INSURANCE_INFO = [
  {
    scheme: 'PMFBY',
    crop: 'Wheat',
    premium: '1.5% of sum insured',
    coverage: 'Up to ₹50,000/hectare',
    season: 'Rabi',
    cutoffDate: 'December 31',
    claimProcess: 'Report crop damage within 72 hours to insurance company/bank/local agriculture officer',
  },
  {
    scheme: 'PMFBY',
    crop: 'Rice',
    premium: '2% of sum insured',
    coverage: 'Up to ₹55,000/hectare',
    season: 'Kharif',
    cutoffDate: 'July 31',
    claimProcess: 'Report crop damage within 72 hours to insurance company/bank/local agriculture officer',
  },
  {
    scheme: 'PMFBY',
    crop: 'Cotton',
    premium: '5% of sum insured',
    coverage: 'Up to ₹60,000/hectare',
    season: 'Kharif',
    cutoffDate: 'July 31',
    claimProcess: 'Report crop damage within 72 hours to insurance company/bank/local agriculture officer',
  },
];

export const DEMO_TASKS = [
  {
    id: 'task-001',
    title: 'Apply Fertilizer to Wheat Field',
    description: 'Apply 50 kg/acre urea for top dressing in the wheat field near the south boundary.',
    crop: 'Wheat',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    priority: 'high',
    category: 'fertilization',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-002',
    title: 'Irrigation - Mustard Field',
    description: 'Second irrigation for mustard crop. Critical flowering stage - do not miss.',
    crop: 'Mustard',
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    priority: 'high',
    category: 'irrigation',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-003',
    title: 'Pest Monitoring - Weekly Check',
    description: 'Check wheat fields for aphid infestation. Look under leaves for colonies.',
    crop: 'Wheat',
    date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
    priority: 'medium',
    category: 'pest-control',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-004',
    title: 'Soil Sample Collection',
    description: 'Collect soil samples for testing before next rabi season planting.',
    crop: 'General',
    date: new Date(Date.now() + 432000000).toISOString().split('T')[0],
    priority: 'low',
    category: 'soil-testing',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-005',
    title: 'Herbicide Application',
    description: 'Apply isoproturon to control narrow-leaf weeds in wheat.',
    crop: 'Wheat',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    priority: 'medium',
    category: 'weeding',
    completed: true,
    createdAt: new Date().toISOString(),
  },
];

export const YIELD_ESTIMATE_BASE = {
  wheat: { baseYield: 18, unit: 'quintal/acre', factors: { alluvial: 1.15, clay: 1.0, loam: 1.1, sandy: 0.8 } },
  rice: { baseYield: 22, unit: 'quintal/acre', factors: { alluvial: 1.2, clay: 1.15, loam: 1.05, sandy: 0.75 } },
  maize: { baseYield: 20, unit: 'quintal/acre', factors: { alluvial: 1.1, clay: 0.9, loam: 1.15, sandy: 0.85 } },
  mustard: { baseYield: 7, unit: 'quintal/acre', factors: { alluvial: 1.1, clay: 0.95, loam: 1.05, sandy: 0.9 } },
  potato: { baseYield: 80, unit: 'quintal/acre', factors: { alluvial: 1.2, clay: 0.85, loam: 1.15, sandy: 1.0 } },
  soybean: { baseYield: 10, unit: 'quintal/acre', factors: { alluvial: 1.05, clay: 1.0, loam: 1.1, sandy: 0.9 } },
  cotton: { baseYield: 12, unit: 'quintal/acre', factors: { alluvial: 1.0, clay: 1.1, loam: 1.05, sandy: 0.85 } },
  tomato: { baseYield: 120, unit: 'quintal/acre', factors: { alluvial: 1.15, clay: 0.95, loam: 1.2, sandy: 0.9 } },
};

export const ADMIN_STATS = {
  totalUsers: 12840,
  activeUsers: 4320,
  totalListings: 892,
  activeListings: 347,
  diseaseAnalyses: 23456,
  schemeViews: 45678,
  avgSessionTime: '8.5 min',
  dailyActiveUsers: [
    { day: 'Mon', users: 380 },
    { day: 'Tue', users: 420 },
    { day: 'Wed', users: 395 },
    { day: 'Thu', users: 450 },
    { day: 'Fri', users: 480 },
    { day: 'Sat', users: 310 },
    { day: 'Sun', users: 290 },
  ],
  topCrops: [
    { name: 'Wheat', count: 3420 },
    { name: 'Rice', count: 2890 },
    { name: 'Potato', count: 1920 },
    { name: 'Tomato', count: 1640 },
    { name: 'Mustard', count: 1180 },
  ],
};

export const STATES_DISTRICTS = {
  'Uttar Pradesh': ['Lucknow', 'Agra', 'Kanpur', 'Varanasi', 'Prayagraj', 'Mathura', 'Bareilly'],
  'Punjab': ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Bathinda', 'Firozpur'],
  'Maharashtra': ['Pune', 'Nashik', 'Nagpur', 'Aurangabad', 'Solapur', 'Akola'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Davangere', 'Belgaum', 'Mangalore'],
  'Telangana': ['Hyderabad', 'Warangal', 'Karimnagar', 'Khammam', 'Nalgonda'],
  'Bihar': ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Anand'],
  'Haryana': ['Gurugram', 'Faridabad', 'Hisar', 'Rohtak', 'Karnal', 'Panipat'],
};

export const CHAT_RESPONSES_EN = {
  irrigation: `For optimal irrigation in Indian conditions:

• **Drip irrigation** saves 40-60% water compared to flood irrigation
• Water crops in **early morning (5-8 AM)** or **evening (5-7 PM)** to reduce evaporation
• **Check soil moisture** before irrigating - stick a finger 2 inches deep; if dry, it's time to irrigate
• Most crops need irrigation every **7-10 days** in normal conditions

⚠️ *This is demo advice. Consult your local agriculture officer for field-specific guidance.*`,

  disease: `Common crop disease management tips:

• **Early detection** is key - inspect crops at least twice weekly
• **Remove infected plants** immediately to prevent spread
• Use **neem oil spray** (5ml/liter) as a preventive organic solution
• Apply **copper-based fungicides** for fungal diseases
• Ensure **proper drainage** to prevent waterlogging diseases
• Rotate crops every season to break disease cycles

⚠️ *This is demo information. Use AI Disease Detection feature for photo-based analysis.*`,

  weather: `Weather-based farming guidelines:

• Before **rainfall**: Avoid pesticide/herbicide spraying, harvest mature crops
• During **heatwave**: Irrigate crops, apply mulch, work in early morning/evening
• During **dry spell**: Increase irrigation frequency, apply mulch to retain moisture
• Before **frost**: Cover tender crops with polythene, irrigate to protect roots

Check our **Weather Forecast** page for location-specific 7-day forecast and alerts.`,

  fertilizer: `Smart fertilization for Indian crops:

• **Soil test first** - apply fertilizers based on soil nutrient status
• Use **recommended NPK ratio** for your crop (check crop-specific guides)
• Split nitrogen application - apply in 2-3 doses for better uptake
• **Organic manure** (FYM) improves soil health long-term
• **Zinc deficiency** is common in UP/Punjab - apply Zinc Sulphate if leaves show yellowing

⚠️ *Demo information only. Get soil test done at your district agriculture office.*`,

  crop_selection: `Crop selection factors to consider:

• **Soil type** - different crops need different soils
• **Water availability** - some crops need more irrigation
• **Market demand** - check Mandi prices before deciding
• **Season** - follow seasonal recommendations for your region
• **Budget** - high-value crops need more investment

Use our **Smart Crop Planning** tool for personalized recommendations based on your land and conditions.`,

  sowing: `Optimal sowing times for major crops:

| Crop | Season | Sowing Time |
|------|--------|-------------|
| Wheat | Rabi | Oct-Nov |
| Rice | Kharif | Jun-Jul |
| Maize | Kharif | Jun-Jul |
| Mustard | Rabi | Oct |
| Potato | Rabi | Oct-Nov |
| Soybean | Kharif | Jun |

Check our **Farming Calendar** for detailed seasonal planning.`,

  default: `Hello! I'm **FarmerFriend AI Assistant** (Demo Mode). I can help you with:

• 🌱 Crop selection and planning
• 💧 Irrigation guidance  
• 🌿 Disease prevention
• 🌦️ Weather-based farming tips
• 💊 Fertilizer recommendations
• 📅 Sowing calendar

Try asking me about: *"When should I irrigate wheat?"* or *"How to prevent rice blast?"*

⚠️ *This is a demo chatbot with pre-programmed responses, not a real AI.*`,
};

export const CHAT_RESPONSES_HI = {
  irrigation: `सिंचाई के लिए बेहतरीन टिप्स:

• **ड्रिप सिंचाई** से 40-60% पानी की बचत होती है
• फसलों को **सुबह 5-8 बजे** या **शाम 5-7 बजे** पानी दें
• सिंचाई से पहले मिट्टी की नमी जांचें
• अधिकांश फसलों को **7-10 दिन** में एक बार पानी चाहिए

⚠️ *यह डेमो जानकारी है। अपने कृषि अधिकारी से सलाह लें।*`,

  default: `नमस्ते! मैं **FarmerFriend AI सहायक** (डेमो मोड) हूं। मैं इन विषयों में मदद कर सकता हूं:

• 🌱 फसल चयन और योजना
• 💧 सिंचाई मार्गदर्शन
• 🌿 रोग निवारण
• 🌦️ मौसम आधारित खेती के टिप्स
• 💊 उर्वरक सिफारिशें

⚠️ *यह एक डेमो चैटबॉट है, असली AI नहीं।*`,
};

export const EXPENSE_CHART_DATA = [
  { month: 'May', seeds: 4200, fertilizer: 3800, labor: 8500, irrigation: 2100, pesticide: 1800 },
  { month: 'Jun', seeds: 1200, fertilizer: 5200, labor: 9200, irrigation: 3500, pesticide: 2400 },
  { month: 'Jul', seeds: 800, fertilizer: 3100, labor: 7800, irrigation: 4200, pesticide: 3100 },
  { month: 'Aug', seeds: 500, fertilizer: 2800, labor: 8100, irrigation: 3800, pesticide: 2800 },
  { month: 'Sep', seeds: 3500, fertilizer: 4200, labor: 9500, irrigation: 2900, pesticide: 1900 },
  { month: 'Oct', seeds: 5200, fertilizer: 6100, labor: 10200, irrigation: 2400, pesticide: 1600 },
];

export const YIELD_CHART_DATA = [
  { crop: 'Wheat', expected: 22, actual: 19, lastYear: 17 },
  { crop: 'Mustard', expected: 8, actual: 7, lastYear: 6.5 },
  { crop: 'Gram', expected: 10, actual: 0, lastYear: 8 },
];
