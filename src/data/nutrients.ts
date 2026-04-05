export interface NutrientRDI {
  name: string;
  unit: string;
  rdi_male: number;
  rdi_female: number;
  upperLimit: number | null;
  deficiencySymptoms: string[];
  topFoods: Array<{ food: string; amount: string; nutrientPer: string }>;
  avoidFoods: string[];
  supplementTip: string;
}

export const NUTRIENTS: Record<string, NutrientRDI> = {
  iron: {
    name: 'Iron',
    unit: 'mg',
    rdi_male: 8,
    rdi_female: 18,
    upperLimit: 45,
    deficiencySymptoms: ['fatigue', 'pale skin', 'shortness of breath', 'cold hands/feet', 'brittle nails'],
    topFoods: [
      { food: 'Beef liver', amount: '85g', nutrientPer: '~5mg iron' },
      { food: 'Lentils (cooked)', amount: '200g', nutrientPer: '~6.6mg iron' },
      { food: 'Spinach (cooked)', amount: '180g', nutrientPer: '~6.4mg iron' },
      { food: 'Tofu (firm)', amount: '126g', nutrientPer: '~3.4mg iron' },
      { food: 'Pumpkin seeds', amount: '28g', nutrientPer: '~2.5mg iron' },
      { food: 'Dark chocolate (70%)', amount: '28g', nutrientPer: '~3.4mg iron' },
    ],
    avoidFoods: ['coffee with meals', 'calcium-rich foods paired with iron-rich meals', 'excessive tea'],
    supplementTip: 'Iron bisglycinate is the most bioavailable and gentlest form. Pair with vitamin C (e.g. orange juice) to boost absorption by up to 3x.',
  },
  calcium: {
    name: 'Calcium',
    unit: 'mg',
    rdi_male: 1000,
    rdi_female: 1000,
    upperLimit: 2500,
    deficiencySymptoms: ['muscle cramps', 'numbness in fingers', 'fatigue', 'weak/brittle bones', 'dental problems'],
    topFoods: [
      { food: 'Greek yogurt', amount: '200g', nutrientPer: '~222mg calcium' },
      { food: 'Cheddar cheese', amount: '50g', nutrientPer: '~355mg calcium' },
      { food: 'Tofu (firm)', amount: '126g', nutrientPer: '~441mg calcium' },
      { food: 'Kale (cooked)', amount: '130g', nutrientPer: '~177mg calcium' },
      { food: 'Sardines (canned)', amount: '92g', nutrientPer: '~351mg calcium' },
      { food: 'Almonds', amount: '28g', nutrientPer: '~74mg calcium' },
    ],
    avoidFoods: ['excessive sodium', 'high caffeine intake', 'excessive alcohol'],
    supplementTip: 'Calcium citrate absorbs well without food. Calcium carbonate is cheaper but needs stomach acid — take with meals. Split doses (≤500mg each) for better absorption.',
  },
  vitamin_c: {
    name: 'Vitamin C',
    unit: 'mg',
    rdi_male: 90,
    rdi_female: 75,
    upperLimit: 2000,
    deficiencySymptoms: ['fatigue', 'easy bruising', 'slow wound healing', 'dry/rough skin', 'swollen joints'],
    topFoods: [
      { food: 'Red bell pepper', amount: '149g', nutrientPer: '~190mg vitamin C' },
      { food: 'Kiwi', amount: '180g', nutrientPer: '~167mg vitamin C' },
      { food: 'Strawberries', amount: '152g', nutrientPer: '~89mg vitamin C' },
      { food: 'Broccoli (cooked)', amount: '156g', nutrientPer: '~102mg vitamin C' },
      { food: 'Orange', amount: '180g', nutrientPer: '~83mg vitamin C' },
      { food: 'Papaya', amount: '140g', nutrientPer: '~95mg vitamin C' },
    ],
    avoidFoods: ['cooking destroys vitamin C — eat raw or lightly steamed where possible'],
    supplementTip: 'Vitamin C is water-soluble — excess is excreted. 500mg twice daily is optimal for absorption. Liposomal vitamin C has higher bioavailability.',
  },
  vitamin_d: {
    name: 'Vitamin D',
    unit: 'IU',
    rdi_male: 600,
    rdi_female: 600,
    upperLimit: 4000,
    deficiencySymptoms: ['fatigue', 'bone pain', 'muscle weakness', 'depression', 'frequent illness', 'hair loss'],
    topFoods: [
      { food: 'Salmon (cooked)', amount: '85g', nutrientPer: '~570 IU vitamin D' },
      { food: 'Tuna (canned)', amount: '85g', nutrientPer: '~154 IU vitamin D' },
      { food: 'Eggs (whole)', amount: '2 large', nutrientPer: '~80 IU vitamin D' },
      { food: 'Fortified milk', amount: '240ml', nutrientPer: '~100 IU vitamin D' },
      { food: 'Mushrooms (UV-exposed)', amount: '50g', nutrientPer: '~46 IU vitamin D' },
    ],
    avoidFoods: [],
    supplementTip: 'Vitamin D3 (cholecalciferol) is significantly more effective than D2. 2000–4000 IU/day is commonly recommended for deficiency. Take with a fat-containing meal for best absorption. Pair with vitamin K2 (MK-7) to direct calcium to bones.',
  },
  magnesium: {
    name: 'Magnesium',
    unit: 'mg',
    rdi_male: 420,
    rdi_female: 320,
    upperLimit: 350, // supplemental only
    deficiencySymptoms: ['muscle cramps/twitches', 'anxiety', 'poor sleep', 'fatigue', 'headaches', 'constipation'],
    topFoods: [
      { food: 'Pumpkin seeds', amount: '28g', nutrientPer: '~156mg magnesium' },
      { food: 'Almonds', amount: '28g', nutrientPer: '~76mg magnesium' },
      { food: 'Spinach (cooked)', amount: '180g', nutrientPer: '~157mg magnesium' },
      { food: 'Black beans (cooked)', amount: '172g', nutrientPer: '~120mg magnesium' },
      { food: 'Quinoa (cooked)', amount: '185g', nutrientPer: '~118mg magnesium' },
      { food: 'Dark chocolate (70%)', amount: '28g', nutrientPer: '~64mg magnesium' },
    ],
    avoidFoods: ['excessive alcohol', 'high sugar intake depletes magnesium'],
    supplementTip: 'Magnesium glycinate is best for sleep and anxiety. Magnesium malate for energy/fatigue. Magnesium citrate for digestion. Avoid magnesium oxide — lowest absorption (~4%).',
  },
  potassium: {
    name: 'Potassium',
    unit: 'mg',
    rdi_male: 3400,
    rdi_female: 2600,
    upperLimit: null,
    deficiencySymptoms: ['muscle weakness', 'cramps', 'fatigue', 'constipation', 'high blood pressure', 'irregular heartbeat'],
    topFoods: [
      { food: 'Avocado', amount: '136g', nutrientPer: '~660mg potassium' },
      { food: 'Sweet potato (baked)', amount: '130g', nutrientPer: '~541mg potassium' },
      { food: 'Banana', amount: '118g', nutrientPer: '~422mg potassium' },
      { food: 'Spinach (cooked)', amount: '180g', nutrientPer: '~839mg potassium' },
      { food: 'Lentils (cooked)', amount: '198g', nutrientPer: '~731mg potassium' },
      { food: 'Salmon (cooked)', amount: '85g', nutrientPer: '~534mg potassium' },
    ],
    avoidFoods: ['excessive sodium counteracts potassium benefits'],
    supplementTip: 'Most supplements cap at 99mg potassium per dose (regulatory limit). Food sources are far superior. If prescribed supplements, potassium citrate or gluconate are well-tolerated.',
  },
  zinc: {
    name: 'Zinc',
    unit: 'mg',
    rdi_male: 11,
    rdi_female: 8,
    upperLimit: 40,
    deficiencySymptoms: ['poor wound healing', 'hair loss', 'loss of taste/smell', 'weakened immune system', 'skin acne'],
    topFoods: [
      { food: 'Oysters', amount: '85g', nutrientPer: '~74mg zinc' },
      { food: 'Beef (lean ground)', amount: '85g', nutrientPer: '~5.3mg zinc' },
      { food: 'Pumpkin seeds', amount: '28g', nutrientPer: '~2.2mg zinc' },
      { food: 'Cashews', amount: '28g', nutrientPer: '~1.6mg zinc' },
      { food: 'Chickpeas (cooked)', amount: '164g', nutrientPer: '~2.5mg zinc' },
      { food: 'Greek yogurt', amount: '200g', nutrientPer: '~1.0mg zinc' },
    ],
    avoidFoods: ['phytates in raw grains/legumes reduce zinc absorption — soak/sprout them'],
    supplementTip: 'Zinc picolinate and zinc bisglycinate have the best absorption. 25–40mg/day short-term for deficiency. Long-term high doses deplete copper — balance with 1–2mg copper.',
  },
  sodium: {
    name: 'Sodium',
    unit: 'mg',
    rdi_male: 2300,
    rdi_female: 2300,
    upperLimit: 2300,
    deficiencySymptoms: ['hyponatremia is rare — more commonly overconsumed', 'muscle cramps if severely low', 'headache', 'fatigue'],
    topFoods: [
      { food: 'Salt (1 tsp)', amount: '6g', nutrientPer: '~2325mg sodium' },
      { food: 'Bread (2 slices)', amount: '60g', nutrientPer: '~240mg sodium' },
      { food: 'Deli meats', amount: '85g', nutrientPer: '~700–1200mg sodium' },
    ],
    avoidFoods: ['processed foods', 'canned soups', 'fast food', 'deli meats', 'condiments like soy sauce'],
    supplementTip: 'Focus on reducing processed food intake rather than supplementing. Athletes losing sweat may need electrolyte drinks with sodium during long exercise sessions.',
  },
  fiber: {
    name: 'Fiber',
    unit: 'g',
    rdi_male: 38,
    rdi_female: 25,
    upperLimit: null,
    deficiencySymptoms: ['constipation', 'blood sugar spikes', 'high cholesterol', 'increased hunger', 'gut microbiome imbalance'],
    topFoods: [
      { food: 'Oats (dry)', amount: '40g', nutrientPer: '~4.2g fiber' },
      { food: 'Lentils (cooked)', amount: '198g', nutrientPer: '~15.6g fiber' },
      { food: 'Chickpeas (cooked)', amount: '164g', nutrientPer: '~12.5g fiber' },
      { food: 'Avocado', amount: '150g', nutrientPer: '~10g fiber' },
      { food: 'Chia seeds', amount: '28g', nutrientPer: '~9.8g fiber' },
      { food: 'Quinoa (cooked)', amount: '185g', nutrientPer: '~5.2g fiber' },
    ],
    avoidFoods: ['refined white carbs', 'processed snacks', 'sugary cereals'],
    supplementTip: 'Psyllium husk is the most evidence-backed fiber supplement (1 tsp = ~5g soluble fiber). Increase fiber gradually to avoid bloating. Always drink plenty of water with fiber supplements.',
  },
  protein: {
    name: 'Protein',
    unit: 'g',
    rdi_male: 56,
    rdi_female: 46,
    upperLimit: null,
    deficiencySymptoms: ['muscle loss', 'slow recovery', 'hair/nail weakness', 'persistent hunger', 'weakened immunity', 'poor wound healing'],
    topFoods: [
      { food: 'Chicken breast (cooked)', amount: '100g', nutrientPer: '~31g protein' },
      { food: 'Whey protein shake', amount: '30g powder', nutrientPer: '~22g protein' },
      { food: 'Greek yogurt', amount: '200g', nutrientPer: '~20g protein' },
      { food: 'Tuna (canned)', amount: '85g', nutrientPer: '~22g protein' },
      { food: 'Eggs (2 large)', amount: '~100g', nutrientPer: '~13g protein' },
      { food: 'Cottage cheese', amount: '200g', nutrientPer: '~24g protein' },
    ],
    avoidFoods: [],
    supplementTip: 'Whey isolate is ideal post-workout (fast absorption). Casein protein before bed for overnight muscle repair. Plant-based: pea + rice protein blend provides a complete amino acid profile.',
  },
};

export type NutrientKey = keyof typeof NUTRIENTS;

export const NUTRIENT_ALIASES: Record<string, NutrientKey> = {
  'vitamin c': 'vitamin_c',
  'vitaminc': 'vitamin_c',
  'ascorbic acid': 'vitamin_c',
  'vitamin d': 'vitamin_d',
  'vitamind': 'vitamin_d',
  'cholecalciferol': 'vitamin_d',
  'vit c': 'vitamin_c',
  'vit d': 'vitamin_d',
};
