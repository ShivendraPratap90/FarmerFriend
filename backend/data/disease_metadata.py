# ==============================================================================
# PlantVillage 38 Classes - Agronomic Metadata & Advisory Database
# Mapped directly to the output of EfficientNet-B0
# ==============================================================================

PLANT_VILLAGE_CLASSES = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cherry_(including_sour)___Powdery_mildew",
    "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Raspberry___healthy",
    "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch",
    "Strawberry___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy"
]

DISEASE_METADATA = {
    "Apple___Apple_scab": {
        "crop": "Apple",
        "name": "Apple Scab",
        "type": "Fungal Disease (Venturia inaequalis)",
        "severity": "Medium",
        "symptoms": [
            "Olive-green to black velvety spots on leaves",
            "Cracked or deformed developing fruit",
            "Premature leaf drop in severe infections",
            "Rough, scabby lesions on fruit surface"
        ],
        "treatments": [
            "Apply Captan 50 WP or Mancozeb fungicide during early leaf emergence",
            "Use myclobutanil or kresoxim-methyl for post-infection control",
            "Rake and destroy fallen leaves in autumn to eliminate overwintering spores"
        ],
        "prevention": [
            "Plant scab-resistant apple cultivars (e.g., Enterprise, Liberty)",
            "Prune canopy regularly to increase sunlight penetration and air circulation",
            "Avoid overhead irrigation during early morning or evening hours"
        ]
    },
    "Apple___Black_rot": {
        "crop": "Apple",
        "name": "Black Rot",
        "type": "Fungal Disease (Diplodia seriata)",
        "severity": "High",
        "symptoms": [
            "Frogeye leaf spots with purple margins and tan centers",
            "Firm, concentric brown or black rotting rings on fruit",
            "Cankers forming on twigs and major branches",
            "Mummified shriveled fruit remaining on the tree"
        ],
        "treatments": [
            "Prune out dead wood, fire blight strikes, and cankers at least 15 cm below infection",
            "Spray copper-based fungicides or thiophanate-methyl at petal fall",
            "Remove all mummified apples from the orchard"
        ],
        "prevention": [
            "Maintain overall tree vigor with balanced soil nutrition",
            "Avoid mechanical damage to bark and stems during harvesting and pruning",
            "Control insect pests that create entry wounds on fruit"
        ]
    },
    "Apple___Cedar_apple_rust": {
        "crop": "Apple",
        "name": "Cedar Apple Rust",
        "type": "Fungal Disease (Gymnosporangium juniperi-virginianae)",
        "severity": "Medium",
        "symptoms": [
            "Bright orange-yellow spots on upper leaf surfaces",
            "Small cup-shaped fruiting bodies (aecia) under leaves",
            "Premature defoliation affecting fruit size and tree vigor",
            "Orange lesions on fruit calyx end"
        ],
        "treatments": [
            "Apply Myclobutanil, Mancozeb, or Propiconazole starting from pink bud stage",
            "Apply preventive sprays every 7-10 days until petal fall",
            "Eradicate nearby Eastern Red Cedar junipers if feasible within 1 km radius"
        ],
        "prevention": [
            "Select resistant cultivars such as Prima, Priscilla, or Freedom",
            "Inspect nearby juniper hosts for galls in late winter and remove them",
            "Maintain dry foliage through proper canopy management"
        ]
    },
    "Apple___healthy": {
        "crop": "Apple",
        "name": "Healthy Apple Leaf",
        "type": "Healthy Plant",
        "severity": "None",
        "symptoms": [
            "Vibrant green, uniform leaf coloration",
            "No necrotic lesions, wilting, or fungal sporulation",
            "Clean leaf margins and healthy vascular structure"
        ],
        "treatments": [
            "No chemical or corrective treatments required",
            "Continue standard seasonal irrigation and balanced fertilization schedule"
        ],
        "prevention": [
            "Conduct routine bi-weekly orchard scouting for early pest detection",
            "Maintain mulch around tree drip line to preserve soil moisture",
            "Follow standard dormant spray schedules with horticultural oil"
        ]
    },
    "Blueberry___healthy": {
        "crop": "Blueberry",
        "name": "Healthy Blueberry Leaf",
        "type": "Healthy Plant",
        "severity": "None",
        "symptoms": [
            "Deep green, glossy foliage without chlorosis or spots",
            "Strong terminal shoot elongation",
            "Uniform leaf size and healthy root collar"
        ],
        "treatments": [
            "No treatment needed - crop is in excellent condition",
            "Maintain acidic soil conditions (pH 4.5 - 5.5)"
        ],
        "prevention": [
            "Apply organic pine bark or sawdust mulch to protect shallow root system",
            "Monitor soil moisture with tensiometers or drip regulators",
            "Avoid high nitrate fertilizers; prefer ammonium forms"
        ]
    },
    "Cherry_(including_sour)___Powdery_mildew": {
        "crop": "Cherry",
        "name": "Cherry Powdery Mildew",
        "type": "Fungal Disease (Podosphaera clandestina)",
        "severity": "Medium",
        "symptoms": [
            "White circular powdery patches on young expanding leaves",
            "Upward curling and distortion of new foliage",
            "Stunted terminal shoot growth",
            "Surface webbing and blemishes on fruit in severe outbreaks"
        ],
        "treatments": [
            "Apply Wettable Sulfur or Potassium Bicarbonate sprays at early onset",
            "Use Quinoxyfen or Tebuconazole fungicide at shuck split stage",
            "Prune infected canopy shoots during the dormant season"
        ],
        "prevention": [
            "Ensure wide tree spacing and open pruning for maximum airflow",
            "Avoid excess nitrogen fertilization that promotes lush vulnerable flushes",
            "Monitor orchards closely during warm days with high humidity"
        ]
    },
    "Cherry_(including_sour)___healthy": {
        "crop": "Cherry",
        "name": "Healthy Cherry Leaf",
        "type": "Healthy Plant",
        "severity": "None",
        "symptoms": [
            "Smooth, lustrous green leaves without curling or spots",
            "Normal internode development and vigorous foliage",
            "No sign of fungal mycelium or bacterial ooze"
        ],
        "treatments": [
            "No treatment necessary",
            "Maintain adequate seasonal watering during fruit development"
        ],
        "prevention": [
            "Scout weekly for cherry fruit flies and aphids",
            "Apply protective dormant copper wash before bud swell"
        ]
    },
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {
        "crop": "Corn (Maize)",
        "name": "Gray Leaf Spot",
        "type": "Fungal Disease (Cercospora zeae-maydis)",
        "severity": "High",
        "symptoms": [
            "Rectangular, pale brown to gray lesions bound by leaf veins",
            "Lesions measuring 1 to 6 cm running parallel along veins",
            "Premature blight of entire leaf canopy from lower leaves upward",
            "Significant lodging risk due to stalk weakening"
        ],
        "treatments": [
            "Apply strobilurin or triazole fungicides (e.g., Azoxystrobin + Difenoconazole)",
            "Time spray applications between VT (tasseling) and R2 (blister) stages",
            "Harvest early if severe lodging risk threatens the crop"
        ],
        "prevention": [
            "Plant resistant corn hybrids with high GLS tolerance scores",
            "Rotate crops with non-grasses such as soybeans for at least 1-2 seasons",
            "Perform conservation tillage to incorporate crop residue into the soil"
        ]
    },
    "Corn_(maize)___Common_rust_": {
        "crop": "Corn (Maize)",
        "name": "Common Rust",
        "type": "Fungal Disease (Puccinia sorghi)",
        "severity": "Medium",
        "symptoms": [
            "Small cinnamon-brown to golden pustules on both leaf surfaces",
            "Pustules rupture epidermal tissue releasing powdery spores",
            "Chlorotic halos surrounding older pustules",
            "Leaf yellowing and drying during severe cool, moist periods"
        ],
        "treatments": [
            "Apply Pyraclostrobin or Propiconazole at first sign of pustules on upper leaves",
            "Fungicide intervention is justified if pustules cover >5% of ear leaves before tasseling"
        ],
        "prevention": [
            "Plant corn hybrids with Rp gene-mediated resistance",
            "Early planting to mature the crop before peak summer rust spore migrations",
            "Maintain balanced potassium levels to strengthen plant cuticle"
        ]
    },
    "Corn_(maize)___Northern_Leaf_Blight": {
        "crop": "Corn (Maize)",
        "name": "Northern Corn Leaf Blight",
        "type": "Fungal Disease (Exserohilum turcicum)",
        "severity": "High",
        "symptoms": [
            "Large elliptical cigar-shaped lesions (2.5 to 15 cm long)",
            "Tan, grayish-green necrotic areas with dirty-dark spore layers",
            "Lesions coalescing to kill entire leaves rapidly",
            "Extensive leaf desiccation during humid, moderate temperature periods"
        ],
        "treatments": [
            "Spray Azoxystrobin, Propiconazole, or Pyraclostrobin during early vegetative/silking",
            "Prioritize treatment if lesions reach 3rd leaf below ear before tasseling"
        ],
        "prevention": [
            "Select hybrids with Ht-gene resistance",
            "Implement 2-year crop rotation with non-hosts like legumes or cotton",
            "Deep plow crop debris after harvest to bury fungal conidia"
        ]
    },
    "Corn_(maize)___healthy": {
        "crop": "Corn (Maize)",
        "name": "Healthy Corn Leaf",
        "type": "Healthy Plant",
        "severity": "None",
        "symptoms": [
            "Dark green, sturdy leaves with straight parallel venation",
            "No rust pustules, blights, or insect bore holes",
            "Uniform vegetative growth and strong nodal roots"
        ],
        "treatments": [
            "No disease treatment required",
            "Apply scheduled top-dressing with nitrogen/urea at knee-high stage"
        ],
        "prevention": [
            "Maintain proper weed management to avoid moisture competition",
            "Ensure optimal plant spacing (60 cm x 20 cm) for light penetration"
        ]
    },
    "Grape___Black_rot": {
        "crop": "Grape",
        "name": "Grape Black Rot",
        "type": "Fungal Disease (Guignardia bidwellii)",
        "severity": "High",
        "symptoms": [
            "Circular reddish-brown leaf spots with dark borders",
            "Tiny black pimples (pycnidia) arranged inside spots",
            "Berries turn brown, rot rapidly, and shrivel into hard black mummies",
            "Black elliptical cankers on young green canes"
        ],
        "treatments": [
            "Apply Mancozeb, Captan, or Myclobutanil starting at 1-inch shoot growth",
            "Continue protective fungicide coverage at 10-14 day intervals until veraison",
            "Hand-pick and burn all shriveled mummified berries"
        ],
        "prevention": [
            "Prune vines to open canopy structure (Scott Henry or VSP trellis systems)",
            "Eliminate wild grapevines within 100 meters of the vineyard",
            "Destroy overwintered mummies during winter pruning"
        ]
    },
    "Grape___Esca_(Black_Measles)": {
        "crop": "Grape",
        "name": "Esca (Black Measles)",
        "type": "Fungal Complex (Phaeomoniella, Phaeoacremonium)",
        "severity": "High",
        "symptoms": [
            "'Tiger-stripe' chlorotic and necrotic patterns between leaf veins",
            "Small dark brown or purple spots ('measles') on berry skin",
            "Sudden vine collapse (apoplexy) during hot summer days",
            "Wood cross-section shows dark streaking and internal spongy rot"
        ],
        "treatments": [
            "No cure exists for established trunk wood rot; manage infected vines carefully",
            "Paint all large winter pruning wounds immediately with sealants or Trichoderma biocontrols",
            "Retrain a new sucker shoot from the base if crown is still viable"
        ],
        "prevention": [
            "Delay annual pruning until late winter when wounds heal quicker",
            "Disinfect pruning shears regularly with 70% alcohol or bleach solution",
            "Purchase certified clean, disease-tested grapevine nursery stock"
        ]
    },
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
        "crop": "Grape",
        "name": "Grape Leaf Blight",
        "type": "Fungal Disease (Pseudocercospora vitis)",
        "severity": "Medium",
        "symptoms": [
            "Irregular reddish-brown lesions with yellowish margins on leaves",
            "Dark olive-colored fuzzy fungal growth on the underside of spots",
            "Premature defoliation starting from the lower vine canopy",
            "Reduced sugar accumulation and delayed fruit ripening"
        ],
        "treatments": [
            "Apply Copper Oxychloride 50 WP or Mancozeb 75 WP at first symptom detection",
            "Use systemic Azoxystrobin or Kresoxim-methyl for stubborn canopy infections",
            "Collect and burn infected fallen foliage after harvest"
        ],
        "prevention": [
            "Maintain open canopy architecture through prompt shoot positioning and leaf pulling",
            "Avoid excessive irrigation during late berry maturation stage",
            "Apply post-harvest prophylactic copper wash"
        ]
    },
    "Grape___healthy": {
        "crop": "Grape",
        "name": "Healthy Grape Leaf",
        "type": "Healthy Plant",
        "severity": "None",
        "symptoms": [
            "Uniformly green, lobed leaves with healthy serrated margins",
            "No downy mildew oil spots, powdery coating, or black rot lesions",
            "Vigorous shoot growth and clean tendrils"
        ],
        "treatments": [
            "No curative chemicals required",
            "Continue standard canopy suckering and shoot positioning"
        ],
        "prevention": [
            "Perform regular preventative sulphur dusting before humid weather peaks",
            "Scout for early signs of leafhoppers and thrips"
        ]
    },
    "Orange___Haunglongbing_(Citrus_greening)": {
        "crop": "Orange / Citrus",
        "name": "Citrus Greening (Huanglongbing)",
        "type": "Bacterial Disease (Candidatus Liberibacter asiaticus)",
        "severity": "High",
        "symptoms": [
            "Asymmetric blotchy mottle pattern on leaves across the vein",
            "Thickened, corky veins that stand out noticeably",
            "Small, lopsided fruit that stays green at the bottom and tastes bitter",
            "Severe root dieback, twig dieback, and eventual tree decline"
        ],
        "treatments": [
            "Currently no chemical cure exists for infected citrus trees",
            "Aggressively control the vector: Asian Citrus Psyllid (Diaphorina citri) with systemic insecticides",
            "Remove and destroy severely infected trees to protect surrounding groves",
            "Provide foliar micronutrient sprays (Zinc, Iron, Manganese) to prolong tree productivity"
        ],
        "prevention": [
            "Only plant certified disease-free nursery stock from screenhouses",
            "Monitor psyllid populations with yellow sticky traps throughout the year",
            "Introduce natural predators like Tamarixia radiata parasitoid wasps"
        ]
    },
    "Peach___Bacterial_spot": {
        "crop": "Peach",
        "name": "Peach Bacterial Spot",
        "type": "Bacterial Disease (Xanthomonas arboricola pv. pruni)",
        "severity": "Medium",
        "symptoms": [
            "Small, angular water-soaked leaf spots turning dark brown or purple",
            "Centers of leaf spots drop out giving a 'shot-hole' appearance",
            "Deep cracked lesions and gumming on fruit surfaces",
            "Twig cankers that girdle small shoots"
        ],
        "treatments": [
            "Apply preventive fixed copper bactericide sprays at leaf fall and bud break",
            "Spray Oxytetracycline during the bloom-to-shuck split window if disease pressure is high",
            "Avoid high copper rates on sensitive green peach foliage"
        ],
        "prevention": [
            "Plant resistant peach varieties (e.g., Clayton, Sentinel, Belle of Georgia)",
            "Avoid planting orchards in loose, excessively sandy windblown soils",
            "Maintain moderate tree vigor and avoid excess nitrogen"
        ]
    },
    "Peach___healthy": {
        "crop": "Peach",
        "name": "Healthy Peach Leaf",
        "type": "Healthy Plant",
        "severity": "None",
        "symptoms": [
            "Vibrant spear-shaped green leaves without shot-holes or curling",
            "No peach leaf curl distortion or bacterial lesions",
            "Healthy terminal shoot development"
        ],
        "treatments": [
            "No chemical intervention needed",
            "Continue standard drip irrigation and orchard floor management"
        ],
        "prevention": [
            "Apply dormant lime-sulfur spray before bud swell to prevent peach leaf curl",
            "Scout for oriental fruit moth and borers"
        ]
    },
    "Pepper,_bell___Bacterial_spot": {
        "crop": "Bell Pepper",
        "name": "Bell Pepper Bacterial Spot",
        "type": "Bacterial Disease (Xanthomonas campestris pv. vesicatoria)",
        "severity": "Medium",
        "symptoms": [
            "Small, circular or irregular water-soaked spots on leaves",
            "Lesions turn dark brown with yellowish halos",
            "Severely spotted leaves drop prematurely, exposing fruit to sunscald",
            "Raised, blister-like rough scabs on green pepper fruit"
        ],
        "treatments": [
            "Spray copper hydroxide combined with Mancozeb at 7-10 day intervals",
            "Apply systemic acquired resistance (SAR) inducers like Acibenzolar-S-methyl",
            "Immediately remove and rogue out early infected greenhouse seedlings"
        ],
        "prevention": [
            "Use certified pathogen-free seeds treated with hot water (50°C for 25 min)",
            "Practice 2-3 year crop rotation away from solanaceous crops (tomato, pepper, potato)",
            "Avoid working in pepper fields when foliage is wet from rain or dew"
        ]
    },
    "Pepper,_bell___healthy": {
        "crop": "Bell Pepper",
        "name": "Healthy Bell Pepper Leaf",
        "type": "Healthy Plant",
        "severity": "None",
        "symptoms": [
            "Broad, dark green glossy foliage without necrotic speckling",
            "Strong central stems with active branching and flower set",
            "No viral mosaic patterns or aphid curling"
        ],
        "treatments": [
            "No remedial sprays required",
            "Maintain steady calcium and potassium nutrition"
        ],
        "prevention": [
            "Use silver reflective mulches to deter thrips and aphids",
            "Keep soil moisture uniform to prevent blossom end rot in developing fruit"
        ]
    },
    "Potato___Early_blight": {
        "crop": "Potato",
        "name": "Potato Early Blight",
        "type": "Fungal Disease (Alternaria solani)",
        "severity": "Medium",
        "symptoms": [
            "Dark brown to black spots with characteristic concentric rings ('target-board')",
            "Symptoms initiate on older, lower foliage and move upward",
            "Yellow chlorotic halos surrounding expanding lesions",
            "Dry, brown corky rot underneath tuber skins"
        ],
        "treatments": [
            "Apply Mancozeb 75 WP or Chlorothalonil early when lower leaves show spots",
            "Rotate with systemic fungicides like Azoxystrobin or Difenoconazole",
            "Maintain optimal plant nutrition; plants stressed for nitrogen are far more susceptible"
        ],
        "prevention": [
            "Plant certified disease-free seed tubers",
            "Adopt 3-year crop rotation with non-solanaceous crops (maize, cereals)",
            "Avoid sprinkler irrigation in late afternoon; allow foliage to dry before nightfall"
        ]
    },
    "Potato___Late_blight": {
        "crop": "Potato",
        "name": "Potato Late Blight",
        "type": "Oomycete / Water Mold (Phytophthora infestans)",
        "severity": "High",
        "symptoms": [
            "Irregular, water-soaked dark greenish-brown lesions rapidly expanding",
            "Delicate white cottony mildew under leaf margins in high humidity",
            "Entire foliage wilts, blackens, and collapses within days producing rotting smell",
            "Copper-brown granular rot extending into potato tubers"
        ],
        "treatments": [
            "Immediately spray Metalaxyl + Mancozeb (e.g., Ridomil Gold) or Cymoxanil",
            "Follow up with translaminar Dimethomorph or Fluopicolide every 5-7 days in wet weather",
            "Desiccate or burn haulms (vines) 2 weeks before harvest to prevent tuber infection"
        ],
        "prevention": [
            "Plant late blight-resistant potato cultivars (e.g., Kufri Girdhari, Kufri Khyati)",
            "Eliminate all cull piles and volunteer potato plants nearby",
            "Hill plants well with soil to create a physical barrier preventing spores reaching tubers"
        ]
    },
    "Potato___healthy": {
        "crop": "Potato",
        "name": "Healthy Potato Leaf",
        "type": "Healthy Plant",
        "severity": "None",
        "symptoms": [
            "Compound leaves display uniform bright green color",
            "No concentric target spots or water-soaked lesions",
            "Strong vine growth and robust stem architecture"
        ],
        "treatments": [
            "No chemical intervention needed",
            "Ensure proper hilling and nitrogen management"
        ],
        "prevention": [
            "Monitor local late-blight weather forecast alerts (Smith Periods)",
            "Scout weekly around low-lying field corners with persistent moisture"
        ]
    },
    "Raspberry___healthy": {
        "crop": "Raspberry",
        "name": "Healthy Raspberry Leaf",
        "type": "Healthy Plant",
        "severity": "None",
        "symptoms": [
            "Deep green serrated leaflets with pale silver-green underside",
            "No anthracnose spotting, spur blight, or yellow mosaic",
            "Vigorous primocane growth"
        ],
        "treatments": [
            "No treatment needed - plant is vigorous and healthy",
            "Maintain adequate trellis support"
        ],
        "prevention": [
            "Prune out floricanes immediately after fruiting to promote good airflow",
            "Maintain pine straw mulch for weed suppression and soil moisture conservation"
        ]
    },
    "Soybean___healthy": {
        "crop": "Soybean",
        "name": "Healthy Soybean Leaf",
        "type": "Healthy Plant",
        "severity": "None",
        "symptoms": [
            "Trifoliate leaves show uniform lush green coloration",
            "No bacterial pustules, frogeye spots, or rust lesions",
            "Strong nodules present on root system"
        ],
        "treatments": [
            "No treatment required",
            "Maintain weed-free canopy until rows close"
        ],
        "prevention": [
            "Inoculate seeds with Bradyrhizobium japonicum before planting",
            "Scout for pod borers and stink bugs during pod-fill stages"
        ]
    },
    "Squash___Powdery_mildew": {
        "crop": "Squash / Cucurbits",
        "name": "Squash Powdery Mildew",
        "type": "Fungal Disease (Podosphaera xanthii)",
        "severity": "Medium",
        "symptoms": [
            "White, talcum powder-like patches on upper and lower leaf surfaces",
            "Leaves turn chlorotic, senesce early, and turn brittle brown",
            "Sunscald and reduced sweetness in squash fruit due to leaf loss",
            "Stems and petioles also become covered with white fungal mats"
        ],
        "treatments": [
            "Apply Wettable Sulfur, Neem Oil, or Potassium Bicarbonate at first white spot",
            "Use Azoxystrobin, Triflumizole, or Myclobutanil for advanced infections",
            "Ensure thorough spray coverage of the undersides of lower leaves"
        ],
        "prevention": [
            "Plant powdery mildew-resistant squash varieties",
            "Space plants widely to allow adequate air movement through dense vines",
            "Avoid excess nitrogen application which produces tender susceptible foliage"
        ]
    },
    "Strawberry___Leaf_scorch": {
        "crop": "Strawberry",
        "name": "Strawberry Leaf Scorch",
        "type": "Fungal Disease (Diplocarpon earlianum)",
        "severity": "Medium",
        "symptoms": [
            "Irregular purple to dark brown blotches across leaf surfaces",
            "Spots enlarge and coalesce causing leaf edges to curl upward and look 'scorched'",
            "Entire leaf turns reddish-brown, dries up, and dies",
            "Petioles and calyxes develop sunken purple streaks"
        ],
        "treatments": [
            "Apply Captan 50 WP, Thiophanate-methyl, or Copper-based fungicides",
            "Mow and renovate strawberry beds promptly after harvest to remove infected leaves",
            "Burn or bury dead foliage residues"
        ],
        "prevention": [
            "Select resistant cultivars such as Chandler or Allstar",
            "Plant in well-drained raised beds with plastic mulch",
            "Use drip irrigation rather than overhead sprinklers to keep foliage dry"
        ]
    },
    "Strawberry___healthy": {
        "crop": "Strawberry",
        "name": "Healthy Strawberry Leaf",
        "type": "Healthy Plant",
        "severity": "None",
        "symptoms": [
            "Lustrous trifoliate leaves with vibrant emerald green coloring",
            "Clean margins without purplish lesions or angular water-soaked spots",
            "Robust runnering and crown development"
        ],
        "treatments": [
            "No chemical sprays needed",
            "Continue balanced fertigation with soluble calcium and potassium"
        ],
        "prevention": [
            "Maintain straw or polyethylene mulch to prevent fruit touching soil",
            "Scout for two-spotted spider mites and gray mold (Botrytis)"
        ]
    },
    "Tomato___Bacterial_spot": {
        "crop": "Tomato",
        "name": "Tomato Bacterial Spot",
        "type": "Bacterial Disease (Xanthomonas perforans / euvesicatoria)",
        "severity": "Medium",
        "symptoms": [
            "Small, dark, greasy water-soaked spots (<3 mm) on leaves",
            "Spots turn brown with yellowish halos; severely infected leaves turn yellow and drop",
            "Raised, scab-like, black circular spots on green fruits",
            "Blossom drop leading to significant yield reduction"
        ],
        "treatments": [
            "Apply Copper Hydroxide combined with Mancozeb spray every 7-10 days",
            "Incorporate bacteriophage biological treatments (e.g., AgriPhage) if available",
            "Immediately remove and safely destroy heavily infected seedlings"
        ],
        "prevention": [
            "Use certified pathogen-free, hot-water treated seeds",
            "Implement a minimum 2-year crop rotation away from peppers and tomatoes",
            "Disinfect greenhouse benches, stakes, and pruning tools regularly"
        ]
    },
    "Tomato___Early_blight": {
        "crop": "Tomato",
        "name": "Tomato Early Blight",
        "type": "Fungal Disease (Alternaria solani)",
        "severity": "Medium",
        "symptoms": [
            "Dark brown to black spots with distinct concentric rings ('target' pattern)",
            "Yellow chlorotic halos surrounding expanding leaf spots",
            "Infection starts on the oldest lower leaves and progresses upward",
            "Dark, leathery, sunken lesions at the stem-end of tomato fruit"
        ],
        "treatments": [
            "Apply Mancozeb 75 WP, Chlorothalonil, or Copper Oxychloride",
            "For active infections, alternate with systemic fungicides like Azoxystrobin or Difenoconazole",
            "Prune off the bottom 12 inches of foliage to prevent ground-splash transmission"
        ],
        "prevention": [
            "Mulch heavily around the base of plants with straw or plastic to suppress soil splash",
            "Stake and cage tomato plants to improve air circulation and rapid drying",
            "Rotate tomato plots on a 3-year cycle with non-solanaceous crops"
        ]
    },
    "Tomato___Late_blight": {
        "crop": "Tomato",
        "name": "Tomato Late Blight",
        "type": "Oomycete / Water Mold (Phytophthora infestans)",
        "severity": "High",
        "symptoms": [
            "Large, irregular, water-soaked pale-green to brown lesions on leaves",
            "Delicate white fungal-like sporulation on the underside of leaves during high humidity",
            "Rapid collapse, browning, and rotting of entire foliage and stems",
            "Firm, greasy, golden-brown sunken blotches on fruit"
        ],
        "treatments": [
            "Immediately apply systemic fungicides: Metalaxyl-M + Mancozeb or Dimethomorph",
            "Spray copper-based bactericides/fungicides in tank mix for broad protection",
            "Destroy and bag heavily diseased plants; do NOT compost infected vines"
        ],
        "prevention": [
            "Select resistant cultivars such as Mountain Magic, Defiant, or Plum Regal",
            "Avoid wetting leaves during irrigation; always use drip lines or soaker hoses",
            "Keep wide row spacing (at least 90 cm) to ensure maximum airflow"
        ]
    },
    "Tomato___Leaf_Mold": {
        "crop": "Tomato",
        "name": "Tomato Leaf Mold",
        "type": "Fungal Disease (Passalora fulva)",
        "severity": "Medium",
        "symptoms": [
            "Pale green to yellowish indistinct patches on upper leaf surfaces",
            "Dense, velvety olive-green to grayish-brown fungal growth directly underneath",
            "Infected leaves wither, turn brown, and drop prematurely",
            "Commonly develops in high humidity greenhouses and polyhouses"
        ],
        "treatments": [
            "Apply Chlorothalonil, Copper Hydroxide, or Difenoconazole at first appearance",
            "Increase greenhouse ventilation with exhaust fans to lower relative humidity below 85%",
            "Remove lower infected leaves to reduce spore reservoir"
        ],
        "prevention": [
            "Choose greenhouse varieties bred with resistance (Cf genes)",
            "Space plants generously and prune suckers to promote rapid air exchange",
            "Water early in the day so greenhouse air remains dry overnight"
        ]
    },
    "Tomato___Septoria_leaf_spot": {
        "crop": "Tomato",
        "name": "Tomato Septoria Leaf Spot",
        "type": "Fungal Disease (Septoria lycopersici)",
        "severity": "Medium",
        "symptoms": [
            "Numerous small circular spots (1.5 - 3 mm) with dark brown margins and gray centers",
            "Tiny black specks (pycnidia) clearly visible inside the gray centers",
            "Severe yellowing and rapid defoliation of lower leaves",
            "Fruit is rarely infected directly, but suffers sunscald from lost canopy"
        ],
        "treatments": [
            "Spray Chlorothalonil or Mancozeb on a strict 7-10 day schedule in wet weather",
            "Alternate with Azoxystrobin or Pyraclostrobin for enhanced systemic protection",
            "Strip off and discard the lowest yellowing leaves as soon as spots appear"
        ],
        "prevention": [
            "Apply mulch beneath tomato plants to prevent soil-borne spores splashing upward",
            "Never work among tomato vines when leaves are wet",
            "Clean up all tomato crop residue thoroughly at the end of the season"
        ]
    },
    "Tomato___Spider_mites Two-spotted_spider_mite": {
        "crop": "Tomato",
        "name": "Two-spotted Spider Mite Infestation",
        "type": "Arachnid Pest (Tetranychus urticae)",
        "severity": "High",
        "symptoms": [
            "Fine yellow or white stippling (tiny dots) on upper leaf surface",
            "Leaves turn bronzed, pale, and dry as colonies expand",
            "Fine, dense silky webbing on the undersides of leaves and growing tips",
            "Premature defoliation and severe plant stunting in hot, dry weather"
        ],
        "treatments": [
            "Apply miticides such as Abamectin, Spiromesifen, or Bifenazate",
            "Spray Insecticidal Soap, Horticultural Mineral Oil, or Neem Oil thoroughly under leaves",
            "Release biological predatory mites (e.g., Phytoseiulus persimilis)"
        ],
        "prevention": [
            "Keep field perimeter and roadways damp to suppress dust (dust favors spider mite outbreaks)",
            "Avoid broad-spectrum synthetic pyrethroid insecticides that destroy natural mite predators",
            "Regularly mist greenhouse canopies to elevate humidity which disrupts mite breeding"
        ]
    },
    "Tomato___Target_Spot": {
        "crop": "Tomato",
        "name": "Tomato Target Spot",
        "type": "Fungal Disease (Corynespora cassiicola)",
        "severity": "Medium",
        "symptoms": [
            "Small, pinpoint brown spots on leaves with pale yellow halos",
            "Spots enlarge into circular tan lesions with defined concentric rings and dark margins",
            "Extensive leaf shedding starting from the inner canopy",
            "Dark, sunken, circular lesions on ripe and green tomato fruit"
        ],
        "treatments": [
            "Apply Chlorothalonil, Famoxadone + Cymoxanil, or Pyraclostrobin",
            "Ensure spray penetration deep into the interior canopy foliage",
            "Prune inner suckers and lower leaves to improve spray reach"
        ],
        "prevention": [
            "Maintain wide plant spacing to prevent excessive foliage tangling",
            "Avoid continuous tomato, pepper, and cucumber crop cycles",
            "Sanitize all wooden stakes and wire cages after every season"
        ]
    },
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
        "crop": "Tomato",
        "name": "Tomato Yellow Leaf Curl Virus (TYLCV)",
        "type": "Viral Disease (Begomovirus transmitted by Whiteflies)",
        "severity": "High",
        "symptoms": [
            "Marked upward curling and cupping of leaflet margins",
            "Pronounced interveinal yellowing (chlorosis) on new growth",
            "Drastic stunting of plant internodes creating a bushy 'bonsai' appearance",
            "Complete flower abortion with virtually zero fruit set"
        ],
        "treatments": [
            "No chemical viricide can cure a virus-infected tomato plant",
            "Immediately rogue out and bury/bag infected plants to stop the virus reservoir",
            "Aggressively control the vector: Silverleaf Whitefly (Bemisia tabaci) using Imidacloprid, Acetamiprid, or Spirotetramat",
            "Install yellow sticky traps across the field to catch whiteflies"
        ],
        "prevention": [
            "Plant TYLCV-resistant hybrids with Ty-1 or Ty-3 resistance genes",
            "Cover seedlings in nurseries with 50-mesh insect-proof netting",
            "Maintain a 60-day crop-free or whitefly-free host break between seasons"
        ]
    },
    "Tomato___Tomato_mosaic_virus": {
        "crop": "Tomato",
        "name": "Tomato Mosaic Virus (ToMV)",
        "type": "Viral Disease (Tobamovirus)",
        "severity": "High",
        "symptoms": [
            "Mottling of light and dark green mosaic patterns on leaves",
            "Leaf distortion, blistering, and stringy 'shoestring' or 'fern-leaf' foliage",
            "Internal brown necrosis in fruit walls",
            "Overall plant stunting and uneven fruit ripening"
        ],
        "treatments": [
            "There is no cure once a plant is infected with ToMV",
            "Remove and incinerate infected plants immediately",
            "ToMV is mechanically transmitted through hands and tools: wash hands with 20% non-fat dry milk or trisodium phosphate (TSP) before touching healthy plants"
        ],
        "prevention": [
            "Plant ToMV-resistant cultivars (designated with 'T' or 'ToMV' on seed packets)",
            "Do NOT smoke or use tobacco products near tomato plants (tobacco carries virus)",
            "Disinfect pruning shears and greenhouse trellises thoroughly"
        ]
    },
    "Tomato___healthy": {
        "crop": "Tomato",
        "name": "Healthy Tomato Leaf",
        "type": "Healthy Plant",
        "severity": "None",
        "symptoms": [
            "Uniform dark green foliage without spots, curling, or mosaic mottling",
            "Healthy vigor with active flowering trusses and uniform fruit set",
            "No signs of wilting, fungal spores, or insect feeding"
        ],
        "treatments": [
            "No corrective treatments required",
            "Continue standard drip fertigation with balanced N-P-K (e.g. 19-19-19 or 13-0-45)"
        ],
        "prevention": [
            "Keep soil consistently moist to prevent blossom-end rot",
            "Perform weekly scouting for early blight spots and whiteflies"
        ]
    },
    "Wheat___Rust": {
        "crop": "Wheat",
        "name": "Wheat Rust (Yellow/Stripe & Brown Rust)",
        "type": "Fungal Disease (Puccinia spp.)",
        "severity": "High",
        "symptoms": [
            "Linear rows of yellow-orange powdery pustules on leaf blades and sheaths",
            "Chlorosis and premature yellowing of leaves",
            "Shriveled grain formation and significant yield reduction"
        ],
        "treatments": [
            "Foliar spray of Propiconazole 25% EC (Tilt) @ 1 ml/L or Tebuconazole 250 EC @ 1 ml/L",
            "Repeat spray after 15 days if rust pressure persists",
            "Avoid high nitrogen fertilizer application during peak infection"
        ],
        "prevention": [
            "Sow rust-resistant varieties recommended for your zone (e.g. HD-2967, HD-3086, DBW-187)",
            "Adopt timely sowing (first fortnight of November in North India)",
            "Practice balanced N-P-K fertilization with adequate potassium"
        ]
    },
    "Wheat___Powdery_mildew": {
        "crop": "Wheat",
        "name": "Wheat Powdery Mildew",
        "type": "Fungal Disease (Blumeria graminis f. sp. tritici)",
        "severity": "Medium",
        "symptoms": [
            "White to greyish cottony fungal patches on lower leaves and stems",
            "Powdery coating turning dull grey with dark specks (cleistothecia)",
            "Premature drying and yellowing of lower foliage"
        ],
        "treatments": [
            "Spray Hexaconazole 5% SC @ 2 ml/L or Wettable Sulphur 80% WP @ 2.5 g/L",
            "Ensure thorough coverage of lower canopy during spray"
        ],
        "prevention": [
            "Avoid excessive seed rate to ensure adequate air circulation and sunlight",
            "Avoid excessive nitrogenous fertilizers"
        ]
    },
    "Wheat___healthy": {
        "crop": "Wheat",
        "name": "Healthy Wheat Plant",
        "type": "Healthy Crop",
        "severity": "None",
        "symptoms": [
            "Vibrant green, upright leaves with uniform parallel venation",
            "Robust tillering and sturdy culms without lesions or pustules",
            "Uniform ear-head development and grain filling"
        ],
        "treatments": [
            "No disease intervention needed",
            "Apply crown root initiation (CRI) and booting stage irrigations on schedule"
        ],
        "prevention": [
            "Maintain timely weeding and balanced micro-nutrient spray (Zinc & Boron)"
        ]
    },
    "Rice___Blast": {
        "crop": "Rice",
        "name": "Rice Blast (Leaf & Neck Blast)",
        "type": "Fungal Disease (Magnaporthe oryzae)",
        "severity": "High",
        "symptoms": [
            "Spindle or diamond-shaped lesions with greyish center and brown margins",
            "Blackish rot at neck node causing chaffy or drooping panicles",
            "Rapid coalescing of spots leading to scorched appearance"
        ],
        "treatments": [
            "Spray Tricyclazole 75% WP @ 0.6 g/L or Isoprothiolane 40% EC @ 1.5 ml/L",
            "Apply second spray at 50% flowering if neck blast symptoms appear",
            "Temporarily suspend urea top-dressing during disease spread"
        ],
        "prevention": [
            "Treat seeds with Carbendazim 50% WP @ 2 g/kg seed before nursery sowing",
            "Plant blast-tolerant paddy varieties (e.g. Swarna Sub-1, IR-64)",
            "Maintain optimal standing water depth without stagnation"
        ]
    },
    "Rice___Bacterial_leaf_blight": {
        "crop": "Rice",
        "name": "Bacterial Leaf Blight (BLB)",
        "type": "Bacterial Disease (Xanthomonas oryzae pv. oryzae)",
        "severity": "High",
        "symptoms": [
            "Water-soaked yellowish stripes starting from leaf tips and margins",
            "Wavy margins turning white to pale brown with bacterial ooze beads",
            "Kresek phase causing complete seedling wilting and death"
        ],
        "treatments": [
            "Spray Copper Hydroxide 77% WP @ 2 g/L mixed with Streptocycline @ 6 g/100 L water",
            "Drain excess water from the field for 2-3 days to curb bacterial spread",
            "Apply potash (MOP) @ 10-15 kg/acre to enhance plant resistance"
        ],
        "prevention": [
            "Use certified disease-free seeds and avoid root clipping during transplanting",
            "Cultivate BLB-resistant hybrids with xa13 / Xa21 genes",
            "Avoid deep transplanting and maintain clean irrigation bunds"
        ]
    },
    "Rice___healthy": {
        "crop": "Rice",
        "name": "Healthy Rice Paddy",
        "type": "Healthy Crop",
        "severity": "None",
        "symptoms": [
            "Lush emerald green canopy with erect, vigorous tillers",
            "Clear leaf sheaths free from lesions or discoloration",
            "Healthy white root system with active panicle initiation"
        ],
        "treatments": [
            "No chemical treatments required",
            "Follow standard alternate wetting and drying (AWD) water management"
        ],
        "prevention": [
            "Top-dress with scheduled nitrogen split with neem-coated urea"
        ]
    },
    "Cotton___Leaf_curl": {
        "crop": "Cotton",
        "name": "Cotton Leaf Curl Virus (CLCuV)",
        "type": "Viral Disease (Begomovirus / Whitefly vector)",
        "severity": "High",
        "symptoms": [
            "Upward or downward curling and thickening of leaf margins",
            "Vein swelling and enation (leaf-like outgrowths) on the underside of leaves",
            "Stunted plant growth and severely reduced boll setting"
        ],
        "treatments": [
            "Control whitefly vector by spraying Diafenthiuron 50% WP @ 1.2 g/L or Pyriproxyfen 10% EC @ 2 ml/L",
            "Uproot and destroy severely stunted virus-infected plants",
            "Install yellow sticky traps @ 15-20 traps per acre"
        ],
        "prevention": [
            "Sow CLCuV-resistant Bt-cotton hybrids recommended for your state",
            "Eradicate weed hosts like Kanghi (Abutilon indicum) and Peeli Buti around borders",
            "Avoid early or unseasonal cotton sowing"
        ]
    },
    "Cotton___healthy": {
        "crop": "Cotton",
        "name": "Healthy Cotton Crop",
        "type": "Healthy Crop",
        "severity": "None",
        "symptoms": [
            "Broad, flat palmate green leaves with no curling or discoloration",
            "Strong sympodial branching with active squaring and healthy boll formation",
            "No sucking pest infestation or fungal spots"
        ],
        "treatments": [
            "No corrective action needed",
            "Foliar spray of 1% 13-0-45 (Potassium Nitrate) during peak boll development"
        ],
        "prevention": [
            "Regular monitoring with pheromone traps for bollworms"
        ]
    },
    "Mustard___White_rust": {
        "crop": "Mustard",
        "name": "Mustard White Rust & Blight",
        "type": "Fungal/Oomycete Disease (Albugo candida)",
        "severity": "High",
        "symptoms": [
            "Prominent white or creamy pustules on lower leaf surface",
            "Floral hypertrophy ('staghead' deformation of inflorescence)",
            "Systemic infection causing twisted, sterile seed pods"
        ],
        "treatments": [
            "Spray Metalaxyl 8% + Mancozeb 64% WP (Ridomil MZ) @ 2 g/L at first appearance",
            "Follow with Mancozeb 75% WP @ 2.5 g/L after 15 days",
            "Clip and destroy staghead malformations"
        ],
        "prevention": [
            "Sow certified tolerant varieties like NRCHB-101, DRMRIJ-31 (Giriraj)",
            "Timely sowing in October before temperature drops",
            "Maintain 3-year crop rotation without cruciferous weeds"
        ]
    },
    "Mustard___healthy": {
        "crop": "Mustard",
        "name": "Healthy Mustard Crop",
        "type": "Healthy Crop",
        "severity": "None",
        "symptoms": [
            "Vigorous green foliage with well-developed rosettes",
            "Normal yellow flowering trusses without staghead malformation",
            "Plump, disease-free siliqua (seed pods)"
        ],
        "treatments": [
            "No chemical intervention needed",
            "Ensure timely irrigation at flowering and pod development stages"
        ],
        "prevention": [
            "Monitor aphid populations during cloudy winter weather"
        ]
    },
    "Gram___Fusarium_wilt": {
        "crop": "Gram",
        "name": "Chickpea / Gram Fusarium Wilt",
        "type": "Fungal Disease (Fusarium oxysporum f. sp. ciceris)",
        "severity": "High",
        "symptoms": [
            "Drooping and yellowing of upper leaves followed by complete wilting",
            "Internal vascular browning visible when stem or root is split longitudinally",
            "Patchy drying of plants in the field despite moist soil"
        ],
        "treatments": [
            "Soil drenching around affected patches with Carbendazim 50% WP @ 2 g/L",
            "Bio-control drench with Trichoderma viride @ 5 g/L around root zone"
        ],
        "prevention": [
            "Seed treatment with Trichoderma viride @ 10 g/kg seed or Carbendazim @ 2 g/kg",
            "Cultivate wilt-resistant varieties like JG-11, JAKI-9218, Digvijay",
            "Practice deep summer plowing and 3-year crop rotation with sorghum or wheat"
        ]
    },
    "Gram___healthy": {
        "crop": "Gram",
        "name": "Healthy Gram / Chickpea Crop",
        "type": "Healthy Crop",
        "severity": "None",
        "symptoms": [
            "Dense branching with fine pinnate green leaflets",
            "Active pink nodulation on tap roots indicating healthy nitrogen fixation",
            "Plump pods developing normally without borer damage or wilting"
        ],
        "treatments": [
            "No disease control required",
            "Spray 2% DAP or 19-19-19 during pod filling stage to boost grain weight"
        ],
        "prevention": [
            "Monitor for Helicoverpa pod borer larvae and install bird perches"
        ]
    }
}

