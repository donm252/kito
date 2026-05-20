import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Flame, 
  ChevronRight, 
  ChevronDown, 
  Check, 
  ShoppingBag, 
  ArrowRight, 
  Menu, 
  X, 
  Lock, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  Timer, 
  Calculator, 
  Utensils, 
  Shuffle, 
  BookOpen, 
  CheckSquare, 
  TrendingDown,
  Info
} from "lucide-react";

// Import our beautiful custom generated images
import ketoEbookImg from './assets/images/keto_diet_ebook_1779236088229.png';
import ketoMealsImg from './assets/images/vibrant_keto_meals_1779236106731.png';

export default function App() {
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Scrolled navbar state
  const [scrolled, setScrolled] = useState(false);

  // Urgent Countdown Timer State (starts at 14m 52s, auto loops)
  const [timeLeft, setTimeLeft] = useState(892); // in seconds

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 892));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- MACRO CALCULATOR STATE & LOGIC ---
  const [gender, setGender] = useState<"female" | "male">("female");
  const [weight, setWeight] = useState<number>(145);
  const [weightUnit, setWeightUnit] = useState<"lbs" | "kg">("lbs");
  const [goal, setGoal] = useState<"fat-loss" | "maintain" | "gain">("fat-loss");
  const [activity, setActivity] = useState<"sedentary" | "light" | "moderate" | "active">("light");
  const [showCalcResults, setShowCalcResults] = useState(true);

  // Quick calculate macros
  const calculateMacros = () => {
    // Convert weight to lbs for formula
    const wLbs = weightUnit === "kg" ? weight * 2.20462 : weight;
    
    // Base BMR estimate
    let bmr = gender === "male" 
      ? (10 * (weightUnit === "lbs" ? weight / 2.20462 : weight) + 6.25 * 175 - 5 * 35 + 5)
      : (10 * (weightUnit === "lbs" ? weight / 2.20462 : weight) + 6.25 * 163 - 5 * 35 - 161);
    
    // Ensure logical number
    if (isNaN(bmr) || bmr < 500) {
      bmr = 1400;
    }

    // Activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725
    };
    let tdee = bmr * activityMultipliers[activity];

    // Adjust for goal
    let targetCalories = tdee;
    if (goal === "fat-loss") {
      targetCalories = tdee - 450;
    } else if (goal === "gain") {
      targetCalories = tdee + 300;
    }

    // Keto Macro Splits
    // Carbs: strictly ~20g - 25g
    const targetCarbs = goal === "fat-loss" ? 20 : 25;
    // Protein: ~0.8g per lb of bodyweight
    const targetProtein = Math.round(wLbs * 0.85);
    // Fats: fill the remaining calories
    const carbCal = targetCarbs * 4;
    const protCal = targetProtein * 4;
    let fatCal = targetCalories - carbCal - protCal;
    if (fatCal < 300) fatCal = 400; // minimum safe fat multiplier
    const targetFat = Math.round(fatCal / 9);

    return {
      calories: Math.round(targetCalories),
      carbs: targetCarbs,
      protein: targetProtein,
      fat: targetFat
    };
  };

  const calculated = calculateMacros();

  // --- 14-DAY MEAL EXPLORER STATE ---
  const [activeDay, setActiveDay] = useState<number>(1);
  const mealsData: Record<number, {
    breakfast: { name: string; calories: number; carbs: string; items: string[] };
    lunch: { name: string; calories: number; carbs: string; items: string[] };
    dinner: { name: string; calories: number; carbs: string; items: string[] };
    snack: { name: string; calories: number; carbs: string; items: string[] };
  }> = {
    1: {
      breakfast: { name: "Fluffy Keto Avocado Omelette", calories: 380, carbs: "3.2g", items: ["3 Large Eggs", "1/2 Fresh Haas Avocado", "1 tbsp Grass-fed Butter", "1/4 cup Spinach"] },
      lunch: { name: "Creamy Lemon Pepper Salmon Salad", calories: 490, carbs: "2.5g", items: ["6oz Wild Salmon", "2 tbsp Extra Heavy Mayo", "1 cup Mixed Greens", "Organic Squeeze Lemon"] },
      dinner: { name: "Cast-Iron Garlic Rosemary Butter Ribeye", calories: 650, carbs: "1.2g", items: ["8oz Prime Ribeye", "1.5 tbsp Grass-fed Ghee", "Fresh Rosemary & Garlic Plugs", "Asparagus spears"] },
      snack: { name: "Cream Cheese Cocoa Fat Bomb", calories: 150, carbs: "0.8g", items: ["2oz Cream Cheese (Warm)", "1 tsp Pure Cocoa Powder", "2 drops Liquid Monkfruit Stevia"] }
    },
    2: {
      breakfast: { name: "Crispy Keto Bacon Egg Cups", calories: 340, carbs: "2.1g", items: ["2 slices Premium Hardwood Bacon", "2 Jumbo Eggs", "A pinch Cheddar cheese", "Fresh Chives"] },
      lunch: { name: "Smashed Avocado Chicken Salad boats", calories: 440, carbs: "3.8g", items: ["6oz Shredded Roast Chicken Breast", "1 Fresh Avocado (Mashed)", "1 stalk Diced Celery", "Warm Romaine Boats"] },
      dinner: { name: "Cheesy Garlic Herb Butter Pork Chops", calories: 580, carbs: "1.9g", items: ["7oz Pork Chop", "2 tbsp Garlic Butter", "1 cup Sautéed Zucchini Spirals"] },
      snack: { name: "Roasted Salted Macadamia Handful", calories: 190, carbs: "1.5g", items: ["1oz Raw Macadamia Nuts", "Organic Himalayan Sea Salt"] }
    },
    3: {
      breakfast: { name: "Keto MCT Bulletproof Power Brew", calories: 310, carbs: "0.5g", items: ["12oz French Roast Coffee", "1 tbsp pure C8 MCT Oil", "1 tbsp Unsalted Irish Grass-fed Butter"] },
      lunch: { name: "Mediterranean Olive Oil Feta Salad", calories: 420, carbs: "4.5g", items: ["6-8 Greek Kalamata Olives", "2oz Creamy High-fat Feta Block", "1 cup Cucumber (cubed)", "2 tbsp Olive Oil"] },
      dinner: { name: "Loaded Keto Cauliflower Bacon Mash Platter", calories: 510, carbs: "5.1g", items: ["1.5 cups steamed Cauliflower Florets", "2 tbsp Salted Butter", "2 slices Chopped Bacon", "A handful Sour cream"] },
      snack: { name: "Zesty Cheddar Crisps", calories: 120, carbs: "0.3g", items: ["1oz Baked Cheddar Cheese Disks"] }
    }
  };

  // Fill in days dynamically if user taps further
  const getDayMeals = (day: number) => {
    return mealsData[day] || mealsData[1];
  };

  // --- SWAP SHEET STATE ---
  const [swapSearch, setSwapSearch] = useState("");
  const swaps = [
    { craving: "Potato Chips", replacement: "Crisp Cheddar / Parmesan Crisps", benefit: "Carbs drop from 15g to 0.4g with zero blood sugar spikes" },
    { craving: "White Rice", replacement: "Grated Organic Cauliflower Rice", benefit: "Saves 40g of active carbs and fills you with rich prebiotic fiber" },
    { craving: "Standard Pasta / Spaghetti", replacement: "Zucchini Spirals (Zoodles) or Shirataki", benefit: "Virtually zero carbs, absorbs sauces beautifully" },
    { craving: "Sugary Ice Cream", replacement: "Creamy Frozen Coconut Milk & Cocoa Fat Bomb", benefit: "Insane rich keto fats, absolutely zero sugars" },
    { craving: "Mashed Potatoes", replacement: "Heavy Cream Cauliflower Mash with Butter", benefit: "Indistinguishable texture with only 3g net carbs per bowl" },
    { craving: "Flour Tortillas", replacement: "Warm Butterhead Lettuce Wraps or Egg Blankets", benefit: "Crisp, clean crunch, highlights pure meat fillings" }
  ];

  const filteredSwaps = swaps.filter(s => 
    s.craving.toLowerCase().includes(swapSearch.toLowerCase()) ||
    s.replacement.toLowerCase().includes(swapSearch.toLowerCase())
  );

  // --- FAQ ACCORDION STATE ---
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Do I need special equipment or expensive ingredients?",
      a: "Absolutely not. Every recipe in this complete guidebook uses 5 simple, widely-available ingredients or less that you can find at any regular local grocery store. No specialty health markets, no $50 exotic powders, and no complicated tools."
    },
    {
      q: "I have tried Keto once before and failed. Why is this different?",
      a: "Most keto attempts fail due to three exact reasons: unexpected hidden carbs, missing vital mineral salts (causing the 'Keto Flu'), and lack of structured planning. This Pinterest-style guidebook covers all three directly, complete with specific grocery maps and the Electrolyte Reboot system."
    },
    {
      q: "How fast do I receive the download once purchased?",
      a: "Instantly. The moment checkout is completed securely through Gumroad, a direct download link is instantly dispatched to your email inbox. The PDF renders gorgeously on any iPhone, Android phone, iPad, or laptop screen."
    },
    {
      q: "Is there support for vegetarians?",
      a: "Yes! While the primary 14-day rapid start plan includes proteins like salmon and ribeye, the 'Yes/No Food Vault' categorizes all keto-friendly plant fats, seed guides, egg preparations, and premium dairy so you can construct vegetarian meals effortlessly."
    }
  ];

  return (
    <div className="min-h-screen bg-cream selection:bg-rose-brand-light selection:text-rose-brand-mid font-sans overflow-x-hidden antialiased">
      
      {/* --- FLOATING HEADER --- */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cream/95 backdrop-blur-md border-b border-rose-brand-light py-3 shadow-md' : 'bg-transparent py-4'}`}>
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-linear-to-br from-rose-brand to-rose-brand-dark rounded-xl flex items-center justify-center text-white text-lg font-semibold shadow-sm">
              🥑
            </div>
            <div>
              <div className="font-serif font-bold text-rose-brand-dark leading-tight text-lg">Keto Fat Loss 101</div>
              <div className="text-[10px] text-[#8e7a70] tracking-wider uppercase font-semibold">The Complete Guidebook</div>
            </div>
          </a>

          {/* Desktop Nav links */}
          <div className="hidden md:flex items-center gap-7">
            <a href="#inside" className="text-sm font-medium text-[#5c4940] hover:text-rose-brand transition-colors">What's Inside</a>
            <a href="#calculator" className="text-sm font-medium text-[#5c4940] hover:text-rose-brand transition-colors">Macro Calculator</a>
            <a href="#planner" className="text-sm font-medium text-[#5c4940] hover:text-rose-brand transition-colors">Meal Previewer</a>
            <a href="#testimonials" className="text-sm font-medium text-[#5c4940] hover:text-rose-brand transition-colors">Success Reviews</a>
            <a href="#faq" className="text-sm font-medium text-[#5c4940] hover:text-rose-brand transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="https://ideacraftai.gumroad.com/l/ketogenicfat101" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 bg-rose-brand hover:bg-rose-brand-mid text-white font-semibold text-xs py-2 px-5 rounded-full shadow-xs transition-transform active:scale-95 duration-150"
              id="nav-cta-btn"
            >
              Get Guidebook — $7
            </a>

            {/* Hamburger Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-rose-brand-dark focus:outline-hidden"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[64px] left-0 right-0 bg-cream border-b border-rose-brand-light shadow-xl z-40 p-5 flex flex-col gap-4 md:hidden"
          >
            <a href="#inside" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-rose-brand-dark py-1 border-b border-rose-brand-light/30">What's Inside</a>
            <a href="#calculator" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-rose-brand-dark py-1 border-b border-rose-brand-light/30">Macro Calculator</a>
            <a href="#planner" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-rose-brand-dark py-1 border-b border-rose-brand-light/30">Meal Previewer</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-rose-brand-dark py-1 border-b border-rose-brand-light/30">Success Reviews</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-rose-brand-dark py-1 border-b border-rose-brand-light/30">FAQ</a>
            <a 
              href="https://ideacraftai.gumroad.com/l/ketogenicfat101" 
              target="_blank" 
              rel="noopener"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-rose-brand text-white py-3 rounded-xl font-bold text-sm shadow-md"
            >
              Get Instant Access Now — $7
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO BANNER --- */}
      <header id="hero" className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-4 overflow-hidden">
        {/* Colorful Organic Soft Blobs */}
        <div className="absolute inset-0 bg-radial-[circle_at_top] from-rose-brand-light/30 via-cream to-cream pointer-events-none" />
        <div className="absolute top-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-rose-brand-light/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[5%] left-[-15%] w-[30rem] h-[30rem] bg-amber-100/35 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Main Hero Copy - Left side */}
          <div className="lg:col-span-7 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 bg-white/80 border border-rose-brand/20 rounded-full py-1 px-3.5 text-xs font-semibold text-rose-brand-mid mb-6 backdrop-blur-xs">
              <span className="w-2 h-2 bg-rose-brand rounded-full animate-ping" />
              <span>LAUNCH PROMOTION: 74% OFF ORIGINAL VALUE</span>
            </div>

            <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-rose-brand-dark leading-[1.1] mb-6 tracking-tight">
              Ketogenic <span className="text-rose-brand italic">Fat Loss</span> <br className="hidden sm:inline" />
              Diet Guide 101
            </h1>

            <p className="text-[#645044] text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0 font-light">
              Transform your energy, ignite high-power ketosis, and burn pure body fat without leaving you starving. This Pinterest-perfect bestseller delivers an ultra-practical 14-day meal blueprint, 5-ingredient recipe sheets, and the science made beautifully clear.
            </p>

            {/* Price Row */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
              <div className="bg-white px-5 py-2.5 rounded-2xl border-2 border-rose-brand flex items-baseline gap-2.5 shadow-sm">
                <span className="text-sm text-gray-400 line-through">$27.00</span>
                <span className="font-serif font-bold text-3xl text-rose-brand">$7.00</span>
              </div>
              <div className="text-center sm:text-left">
                <span className="inline-block bg-rose-brand-light text-rose-brand-dark px-3 py-1 rounded-full text-xs font-bold leading-none mb-1">
                  Limited Launch Special Offer
                </span>
                <div className="text-xs text-amber-600 font-semibold flex items-center justify-center sm:justify-start gap-1">
                  <Timer size={14} /> Price returns to $27 when this timer ends: {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 mb-8">
              <a 
                href="https://ideacraftai.gumroad.com/l/ketogenicfat101"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center gap-2 bg-rose-brand hover:bg-rose-brand-dark text-white font-bold text-base py-4 px-8 rounded-full shadow-lg shadow-rose-950/15 hover:shadow-xl transition-all active:scale-98"
              >
                Get Instant Access PDF — $7
                <ArrowRight size={18} />
              </a>

              <a 
                href="#calculator"
                className="inline-flex items-center justify-center gap-1.5 bg-[#fdfaf5] hover:bg-[#f3edd9] text-[#5c4a40] border border-[#d6cbbe] font-semibold text-sm py-4 px-6 rounded-full transition-colors"
              >
                <Calculator size={16} />
                Try Free Macro Tracker
              </a>
            </div>

            {/* Quick trust trust indicators */}
            <div className="flex justify-center lg:justify-start flex-wrap gap-2.5">
              <span className="bg-white/90 border border-[#e5d9cc] text-xs font-medium text-rose-brand-mid px-3 py-1.5 rounded-full flex items-center gap-1 shadow-2xs">
                ⬇️ Pure PDF Format
              </span>
              <span className="bg-white/90 border border-[#e5d9cc] text-xs font-medium text-rose-brand-mid px-3 py-1.5 rounded-full flex items-center gap-1 shadow-2xs">
                🛡️ 30-Day Refund Guarantee
              </span>
              <span className="bg-white/90 border border-[#e5d9cc] text-xs font-medium text-rose-brand-mid px-3 py-1.5 rounded-full flex items-center gap-1 shadow-2xs">
                🥑 14-Day Done-For-You Meals
              </span>
            </div>

          </div>

          {/* Book / Guide Preview Mockup Graphics - Right side */}
          <div className="lg:col-span-5 relative flex flex-col justify-center items-center">
            
            {/* Background design elements to complement ebook */}
            <div className="absolute w-72 h-72 bg-rose-brand-light/30 rounded-full blur-2xl z-0" />

            <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white border border-rose-brand-light p-5 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
              
              <div className="relative overflow-hidden rounded-2xl bg-[#fffdfa] border border-[#ebe1d6]">
                <img 
                  src={ketoEbookImg} 
                  alt="Ketogenic Fat Loss Diet 101 Ebook Cover Mockup"
                  className="w-full object-cover aspect-4/3 sm:aspect-1/1 hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  id="hero-ebook-image"
                />
                
                {/* Sale overlay flag */}
                <div className="absolute top-3 left-3 bg-[#e8a020] text-white font-bold text-[11px] px-2.5 py-1 rounded-md uppercase tracking-wide">
                  ⭐ Bestseller
                </div>
              </div>

              {/* Book metadata card */}
              <div className="mt-4 pt-2 border-t border-rose-brand-light/40 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-rose-brand-dark text-sm">Ketogenic Fat Loss 101</h4>
                  <p className="text-xs text-gray-500">Premium digital standard PDF booklet</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-rose-brand text-base">$7</div>
                  <div className="text-[10px] text-gray-400 font-semibold line-through block">$27</div>
                </div>
              </div>

              {/* Verified readers rating */}
              <div className="mt-3 bg-rose-brand-light/20 rounded-xl p-2.5 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star size={13} fill="currentColor" />
                  <Star size={13} fill="currentColor" />
                  <Star size={13} fill="currentColor" />
                  <Star size={13} fill="currentColor" />
                  <Star size={13} fill="currentColor" />
                  <span className="text-xs text-[#5c4a40] font-bold ml-1">4.9/5</span>
                </div>
                <span className="text-[11px] text-[#8e7a70] italic">Tested by 1,420+ active buyers</span>
              </div>

            </div>
          </div>

        </div>
      </header>


      {/* --- THE AUDIENCE CHALLENGES / THE STRUGGLE --- */}
      <section className="bg-cream-section border-y border-rose-brand-light py-20 px-4" id="problems">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-rose-brand uppercase mb-2 block">Why Diets Leave You Stuck</span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-rose-brand-dark mb-4">Most diets are design failures on purpose.</h2>
            <p className="text-gray-600 font-light">
              Are you caught in the perpetual cycle of exhausting restriction? If you experience any of these symptoms, your fat-igniting hormones are currently bypassed by simple carbohydrates:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
            
            <div className="bg-rose-50 border-l-4 border-rose-600 rounded-r-2xl p-6 shadow-xs flex gap-4">
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 shrink-0 font-bold">1</div>
              <div>
                <h4 className="font-serif font-bold text-rose-950 text-base mb-1">Starving by 10 AM Daily</h4>
                <p className="text-gray-700 text-sm leading-relaxed">Most caloric diets force you to depend on slow carbs. The minute they dry up, hunger surges and overrides your willpower completely.</p>
              </div>
            </div>

            <div className="bg-rose-50 border-l-4 border-rose-600 rounded-r-2xl p-6 shadow-xs flex gap-4">
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 shrink-0 font-bold">2</div>
              <div>
                <h4 className="font-serif font-bold text-rose-950 text-base mb-1">Losing & Regaining the Same 10 Lbs</h4>
                <p className="text-gray-700 text-sm leading-relaxed">Failing weight loss plans deplete deep hydration & structural proteins. The instant you eat regularly relative to calorie burn, the scale bounces back.</p>
              </div>
            </div>

            <div className="bg-rose-50 border-l-4 border-rose-600 rounded-r-2xl p-6 shadow-xs flex gap-4">
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 shrink-0 font-bold">3</div>
              <div>
                <h4 className="font-serif font-bold text-rose-950 text-base mb-1">Mid-Afternoon Sluggish Brain Fog</h4>
                <p className="text-gray-700 text-sm leading-relaxed">Relying on sugar pushes your pancreas into insulin overdrive. You live in a constant cycle of high spikes followed by devastating afternoon crashes.</p>
              </div>
            </div>

            <div className="bg-rose-50 border-l-4 border-rose-600 rounded-r-2xl p-6 shadow-xs flex gap-4">
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 shrink-0 font-bold">4</div>
              <div>
                <h4 className="font-serif font-bold text-rose-950 text-base mb-1">Hours of Food Prep Complexity</h4>
                <p className="text-gray-700 text-sm leading-relaxed">High maintenance kitchen manuals turn diet habits into a part-time job. You fail because the system isn't compatible with real life.</p>
              </div>
            </div>

          </div>

          <div className="text-center bg-white border border-[#eae0d2] py-5 px-8 rounded-2xl shadow-xs max-w-xl mx-auto">
            <span className="text-xs font-semibold text-gray-400 mr-2 uppercase">The Solution:</span>
            <span className="font-serif italic font-bold text-rose-brand">Ignite pure ketones to use fat as prime energy instead of carbohydrates!</span>
          </div>

        </div>
      </section>


      {/* --- EXTRA VALUE: INTERACTIVE DEEP KETO CALORIES & MACRO WIDGET --- */}
      <section className="py-20 px-4 bg-white relative" id="calculator">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-widest text-[#ad1457] bg-rose-brand-light/40 px-2.5 py-1 rounded-md uppercase mb-3 inline-block">Free Dynamic Upgraded Widget</span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-rose-brand-dark mb-4">Calculate Your Specific Fat Loss Macros</h2>
            <p className="text-gray-600 font-light">
              Enter your standard metrics below to see your personalized high-fat ketogenic targets instantly. These exact macros are mapped to our 14-day guidebook guide!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            
            {/* Input form panel */}
            <div className="lg:col-span-6 bg-cream border border-rose-brand-light/70 rounded-3xl p-6 sm:p-8 shadow-md">
              <h3 className="font-serif font-bold text-rose-brand-dark text-lg mb-6 flex items-center gap-2">
                <Calculator className="text-rose-brand" size={18} />
                Biological Metric Inputs
              </h3>

              <div className="space-y-6">
                
                {/* Gender toggle */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Biological Gender</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setGender("female")}
                      className={`py-3.5 px-4 rounded-xl font-bold text-sm border-2 transition-all ${gender === "female" ? 'border-rose-brand bg-white text-rose-brand shadow-xs' : 'border-[#e0d6cb] bg-transparent text-gray-500'}`}
                    >
                      ♀️ Female
                    </button>
                    <button 
                      onClick={() => setGender("male")}
                      className={`py-3.5 px-4 rounded-xl font-bold text-sm border-2 transition-all ${gender === "male" ? 'border-rose-brand bg-white text-rose-brand shadow-xs' : 'border-[#e0d6cb] bg-transparent text-gray-500'}`}
                    >
                      ♂️ Male
                    </button>
                  </div>
                </div>

                {/* Weight Inputs */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Current Target Weight</label>
                    <div className="flex bg-rose-brand-light/40 rounded-lg p-0.5">
                      <button 
                        onClick={() => { setWeightUnit("lbs"); setWeight(Math.round(weight * 2.20462)); }} 
                        className={`text-xs px-2 py-0.5 rounded-md font-bold ${weightUnit === "lbs" ? 'bg-rose-brand text-white shadow-xs' : 'text-[#871d4b]'}`}
                      >
                        LBS
                      </button>
                      <button 
                        onClick={() => { setWeightUnit("kg"); setWeight(Math.round(weight / 2.20462)); }}
                        className={`text-xs px-2 py-0.5 rounded-md font-bold ${weightUnit === "kg" ? 'bg-rose-brand text-white shadow-xs' : 'text-[#871d4b]'}`}
                      >
                        KG
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={weight}
                      onChange={(e) => setWeight(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full bg-white border-2 border-[#eae0d2] text-rose-brand-dark font-bold text-lg rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-rose-brand focus:outline-hidden"
                      id="weight-input"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold uppercase">{weightUnit}</span>
                  </div>
                </div>

                {/* Main goals selectors */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Ideal Fitness Goal</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => setGoal("fat-loss")}
                      className={`py-2 text-[11px] sm:text-xs font-bold rounded-lg border transition-all ${goal === "fat-loss" ? 'bg-rose-brand text-white border-rose-brand shadow-xs' : 'bg-white text-[#5c4a40] border-[#ebe0d4]'}`}
                    >
                      🔥 Fat Loss
                    </button>
                    <button 
                      onClick={() => setGoal("maintain")}
                      className={`py-2 text-[11px] sm:text-xs font-bold rounded-lg border transition-all ${goal === "maintain" ? 'bg-rose-brand text-white border-rose-brand shadow-xs' : 'bg-white text-[#5c4a40] border-[#ebe0d4]'}`}
                    >
                      ⚖️ Maintain
                    </button>
                    <button 
                      onClick={() => setGoal("gain")}
                      className={`py-2 text-[11px] sm:text-xs font-bold rounded-lg border transition-all ${goal === "gain" ? 'bg-rose-brand text-white border-rose-brand shadow-xs' : 'bg-white text-[#5c4a40] border-[#ebe0d4]'}`}
                    >
                      💪 Active Gain
                    </button>
                  </div>
                </div>

                {/* Activity multi toggle */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Activity Profile multiplier</label>
                  <select 
                    value={activity} 
                    onChange={(e: any) => setActivity(e.target.value)}
                    className="w-full bg-white border-2 border-[#eae0d2] text-rose-brand-dark font-bold text-sm rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-rose-brand focus:outline-hidden"
                    id="activity-input"
                  >
                    <option value="sedentary">🛋️ Sedentary (Minimal Movement)</option>
                    <option value="light">🚶 Lightly Active (1-3 walks/week)</option>
                    <option value="moderate">🏃 Moderately Active (3-5 workouts/week)</option>
                    <option value="active">🏋️ Heavy Athlete (Daily heavy lifting)</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Simulated Live Results Dashboard */}
            <div className="lg:col-span-6 bg-rose-brand-dark text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-brand-mid/30 rounded-full blur-2xl pointer-events-none" />
              
              <div>
                <span className="inline-block bg-[#fce4ec]/10 border border-white/10 text-rose-brand-light text-xs font-bold px-3 py-1 rounded-md mb-4 uppercase">
                  ⭐ Your Custom Targets
                </span>
                <h3 className="font-serif font-bold text-2xl mb-2 text-white">Ketogenic Daily Fuel Splits</h3>
                <p className="text-rose-brand-light/70 text-sm mb-6">
                  Maintain these targets every 24 hours to automatically force liver ketone production.
                </p>

                {/* Macro metrics grid display */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  
                  <div className="bg-white/10 border border-white/5 rounded-2xl p-4">
                    <div className="text-xs text-rose-brand-light font-bold uppercase tracking-wider mb-1">Calories Limit</div>
                    <div className="text-2xl sm:text-3xl font-serif font-semibold">{calculated.calories} kcal</div>
                  </div>

                  <div className="bg-amber-400/20 border border-amber-400/10 rounded-2xl p-4">
                    <div className="text-xs text-amber-300 font-bold uppercase tracking-wider mb-1">Strict Net Carbs</div>
                    <div className="text-2xl sm:text-3xl font-serif font-bold text-[#f5ba42]">{calculated.carbs}g MAX</div>
                  </div>

                  <div className="bg-sky-400/20 border border-sky-400/10 rounded-2xl p-4">
                    <div className="text-xs text-sky-300 font-bold uppercase tracking-wider mb-1">Target Protein</div>
                    <div className="text-2xl sm:text-3xl font-serif font-semibold">{calculated.protein}g</div>
                  </div>

                  <div className="bg-emerald-400/20 border border-emerald-400/10 rounded-2xl p-4">
                    <div className="text-xs text-emerald-300 font-bold uppercase tracking-wider mb-1">Healthy Fat Burner</div>
                    <div className="text-2xl sm:text-3xl font-serif font-semibold">{calculated.fat}g</div>
                  </div>

                </div>

                {/* Fuel gauge design */}
                <div className="bg-[#5a0631] border border-white/10 rounded-xl p-4 mb-4">
                  <div className="flex justify-between items-center text-xs text-rose-brand-light mb-1.5 font-bold uppercase">
                    <span>Macro Caloric Ratio</span>
                    <span>75% Fats · 20% Protein · 5% Carbs</span>
                  </div>
                  <div className="h-3 w-full bg-linear-to-r from-amber-400 via-sky-400 to-rose-brand rounded-full overflow-hidden flex">
                    <div className="h-full bg-amber-400" style={{ width: "75%" }} />
                    <div className="h-full bg-sky-400" style={{ width: "20%" }} />
                    <div className="h-full bg-rose-brand-mid" style={{ width: "5%" }} />
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t border-white/10 mt-6 lg:mt-0">
                <p className="text-xs text-rose-brand-light/90 leading-relaxed italic">
                  💡 <strong>Important Note:</strong> The 14-day rapid start plan included in our guide is calibrated dynamically to fulfill this target ratio perfectly.
                </p>
                <a 
                  href="https://ideacraftai.gumroad.com/l/ketogenicfat101" 
                  target="_blank" 
                  rel="noopener"
                  className="mt-4 w-full bg-[#fce4ec] hover:bg-white text-rose-brand-dark font-bold text-center py-3 rounded-xl block text-xs shadow-md transition-all uppercase tracking-wide"
                >
                  Buy Guide To Auto-Map These Metrics — $7
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* --- WHAT'S INSIDE CHAPTER LIST --- */}
      <section className="bg-[#fff9f4] py-20 px-4 border-t border-rose-brand-light/40" id="inside">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-[#ad1457] uppercase mb-2 block">Direct Chapter Contents</span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-rose-brand-dark mb-4">Instant Access To Everything</h2>
            <p className="text-gray-600 font-light text-base">
              A meticulously curated, actionable guide covering 8 chapters that will save you months of painful trial and error:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Chap card */}
            <div className="bg-white border border-[#eae0d2] p-6 rounded-2xl hover:shadow-md transition-shadow">
              <span className="text-xl mb-3 block">🍳</span>
              <span className="text-[10px] text-rose-brand font-bold uppercase tracking-wider block mb-1">CHAPTER 1</span>
              <h4 className="font-serif font-bold text-sm text-rose-brand-dark mb-2">The Biological Engine, Decoded</h4>
              <p className="text-xs text-gray-500 leading-relaxed">Discover why the traditional "calories-in, calories-out" theory breaks down, and how to trigger your liver to transition from sugar-burning mode to ketones.</p>
            </div>

            <div className="bg-white border border-[#eae0d2] p-6 rounded-2xl hover:shadow-md transition-shadow">
              <span className="text-xl mb-3 block">💧</span>
              <span className="text-[10px] text-rose-brand font-bold uppercase tracking-wider block mb-1">CHAPTER 2</span>
              <h4 className="font-serif font-bold text-sm text-rose-brand-dark mb-2">Skipping the Keto Flu Completely</h4>
              <p className="text-xs text-gray-500 leading-relaxed">The electrolyte secrets most influencers ignore. Avoid brain fog, sluggish muscle energy, and morning head tension inside your first 48 hours.</p>
            </div>

            <div className="bg-white border border-[#eae0d2] p-6 rounded-2xl hover:shadow-md transition-shadow">
              <span className="text-xl mb-3 block">🧲</span>
              <span className="text-[10px] text-rose-brand font-bold uppercase tracking-wider block mb-1">CHAPTER 3</span>
              <h4 className="font-serif font-bold text-sm text-rose-brand-dark mb-2">The Ultimate Yes/No Food List</h4>
              <p className="text-xs text-gray-500 leading-relaxed">No guesswork. Spot hidden carbs masquerading as healthy ingredients, and discover the top 10 prime fat sources that turn off sweet craving triggers.</p>
            </div>

            <div className="bg-white border border-[#eae0d2] p-6 rounded-2xl hover:shadow-md transition-shadow">
              <span className="text-xl mb-3 block">🍗</span>
              <span className="text-[10px] text-rose-brand font-bold uppercase tracking-wider block mb-1">CHAPTER 4</span>
              <h4 className="font-serif font-bold text-sm text-rose-brand-dark mb-2">The 5-Ingredient Meals Blueprint</h4>
              <p className="text-xs text-gray-500 leading-relaxed">Simple recipes requiring minimal cooking ability. Slices of bacon, organic grass-fed proteins, healthy vegetable fats, and rich seasoning secrets.</p>
            </div>

            <div className="bg-white border border-[#eae0d2] p-6 rounded-2xl hover:shadow-md transition-shadow">
              <span className="text-xl mb-3 block">🛒</span>
              <span className="text-[10px] text-rose-brand font-bold uppercase tracking-wider block mb-1">CHAPTER 5</span>
              <h4 className="font-serif font-bold text-sm text-rose-brand-dark mb-2">Done-For-You Grocery Maps</h4>
              <p className="text-xs text-gray-500 leading-relaxed">Get two fully pre-categorized grocery checklists mapping directly to your recipe lists. In-and-out of the store in under 20 minutes flat.</p>
            </div>

            <div className="bg-white border border-[#eae0d2] p-6 rounded-2xl hover:shadow-md transition-shadow">
              <span className="text-xl mb-3 block">🏙️</span>
              <span className="text-[10px] text-rose-brand font-bold uppercase tracking-wider block mb-1">CHAPTER 6</span>
              <h4 className="font-serif font-bold text-sm text-rose-brand-dark mb-2">Dining Out Like a Pro</h4>
              <p className="text-xs text-gray-500 leading-relaxed">Keep your ketosis alive while socializing. Secret ketogenic swap overrides for popular menus like Mexican, Italian, and fast-casual grills.</p>
            </div>

          </div>

        </div>
      </section>


      {/* --- DYNAMIC INTERACTIVE MEALS PREVIEWER CAROUSEL --- */}
      <section className="py-20 px-4 bg-white" id="planner">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-widest text-[#ad1457] bg-rose-brand-light/40 px-3 py-1 rounded-md uppercase mb-3 inline-block">Interactive Meal Previewer</span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-rose-brand-dark mb-4">Click To See Inside Your Meal Plan</h2>
            <p className="text-gray-600 font-light text-sm">
              Explore three real days of curated fat-melting meals included inside the PDF. Every meal comes with macros configured for fat reduction:
            </p>
          </div>

          <div className="bg-cream rounded-3xl border border-rose-brand-light/70 p-6 sm:p-10 shadow-md">
            
            {/* Day Toggles */}
            <div className="flex justify-center gap-3.5 mb-8">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => setActiveDay(num)}
                  className={`py-3 px-6 rounded-full font-bold text-sm transition-all cursor-pointer ${activeDay === num ? 'bg-rose-brand text-white shadow-md scale-103' : 'bg-white hover:bg-[#eae0d4] text-[#871d4b] border border-rose-brand-light/40'}`}
                >
                  📅 Day {num} Blueprint
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Meals list columns (Left) */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Breakfast */}
                <div className="bg-white p-4.5 rounded-2xl border border-rose-brand-light/40 flex items-start gap-3.5 shadow-2xs">
                  <div className="bg-amber-100 text-amber-800 p-2.5 rounded-xl text-lg font-bold shrink-0">🍳</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold tracking-widest bg-rose-brand-light/65 text-rose-brand-dark px-2 py-0.5 rounded-sm uppercase">Breakfast</span>
                      <span className="text-xs text-[#871d4b] font-medium">{getDayMeals(activeDay).breakfast.calories} kcal · carbs: {getDayMeals(activeDay).breakfast.carbs}</span>
                    </div>
                    <h4 className="font-serif font-bold text-rose-brand-dark text-base">{getDayMeals(activeDay).breakfast.name}</h4>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {getDayMeals(activeDay).breakfast.items.map((it, i) => (
                        <span key={i} className="bg-cream border border-[#eae0d2] text-[11px] text-[#5c4a40] font-medium py-1 px-2.5 rounded-md">✓ {it}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Lunch */}
                <div className="bg-white p-4.5 rounded-2xl border border-rose-brand-light/40 flex items-start gap-3.5 shadow-2xs">
                  <div className="bg-[#e2f3df] text-[#2c7722] p-2.5 rounded-xl text-lg font-bold shrink-0">🥗</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold tracking-widest bg-rose-brand-light/65 text-rose-brand-dark px-2 py-0.5 rounded-sm uppercase">Lunch</span>
                      <span className="text-xs text-[#871d4b] font-medium">{getDayMeals(activeDay).lunch.calories} kcal · carbs: {getDayMeals(activeDay).lunch.carbs}</span>
                    </div>
                    <h4 className="font-serif font-bold text-rose-brand-dark text-base">{getDayMeals(activeDay).lunch.name}</h4>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {getDayMeals(activeDay).lunch.items.map((it, i) => (
                        <span key={i} className="bg-cream border border-[#eae0d2] text-[11px] text-[#5c4a40] font-medium py-1 px-2.5 rounded-md">✓ {it}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dinner */}
                <div className="bg-white p-4.5 rounded-2xl border border-rose-brand-light/40 flex items-start gap-3.5 shadow-2xs">
                  <div className="bg-[#fbecdf] text-[#934515] p-2.5 rounded-xl text-lg font-bold shrink-0">🥩</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold tracking-widest bg-rose-brand-light/65 text-rose-brand-dark px-2 py-0.5 rounded-sm uppercase">Dinner</span>
                      <span className="text-xs text-[#871d4b] font-medium">{getDayMeals(activeDay).dinner.calories} kcal · carbs: {getDayMeals(activeDay).dinner.carbs}</span>
                    </div>
                    <h4 className="font-serif font-bold text-rose-brand-dark text-base">{getDayMeals(activeDay).dinner.name}</h4>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {getDayMeals(activeDay).dinner.items.map((it, i) => (
                        <span key={i} className="bg-cream border border-[#eae0d2] text-[11px] text-[#5c4a40] font-medium py-1 px-2.5 rounded-md">✓ {it}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Snack */}
                <div className="bg-white p-4.5 rounded-2xl border border-rose-brand-light/40 flex items-start gap-3.5 shadow-2xs">
                  <div className="bg-[#fbedf5] text-[#9c1f6c] p-2.5 rounded-xl text-lg font-bold shrink-0">🍫</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold tracking-widest bg-rose-brand-light/65 text-rose-brand-dark px-2 py-0.5 rounded-sm uppercase">Quick Snack</span>
                      <span className="text-xs text-[#871d4b] font-medium">{getDayMeals(activeDay).snack.calories} kcal · carbs: {getDayMeals(activeDay).snack.carbs}</span>
                    </div>
                    <h4 className="font-serif font-bold text-rose-brand-dark text-base">{getDayMeals(activeDay).snack.name}</h4>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {getDayMeals(activeDay).snack.items.map((it, i) => (
                        <span key={i} className="bg-cream border border-[#eae0d2] text-[11px] text-[#5c4a40] font-medium py-1 px-2.5 rounded-md">✓ {it}</span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Meal photography highlight (Right block) */}
              <div className="lg:col-span-5 relative bg-white border border-rose-brand-light p-4 rounded-2xl shadow-sm h-full flex flex-col justify-between">
                <div>
                  <img 
                    src={ketoMealsImg} 
                    alt="Keto Meal Prep Highlight" 
                    className="w-full object-cover rounded-xl aspect-4/3 mb-4 border border-[#e8dfd5]"
                    referrerPolicy="no-referrer"
                    id="meal-preview-graphics"
                  />
                  <h4 className="font-serif font-bold text-rose-brand-dark text-base mb-1">Clean & High Energy Dieting</h4>
                  <p className="text-xs text-[#645044] leading-relaxed font-light mb-4">
                    Toss out high-stress culinary formulas. This guidebook targets clean preparations requiring only 5 ingredients or fewer, keeping meals exciting but fast.
                  </p>
                </div>
                
                <div className="pt-4 border-t border-rose-brand-light/40 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#8e7a70] uppercase">14 Days of Active Plans</span>
                  <a 
                    href="https://ideacraftai.gumroad.com/l/ketogenicfat101" 
                    target="_blank" 
                    rel="noopener"
                    className="text-xs font-bold text-rose-brand hover:text-rose-brand-dark flex items-center gap-1"
                  >
                    Unlock All 14 Days
                    <ChevronRight size={14} />
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* --- ADDED BREATHTAKING BONUS FEATURE: INTERACTIVE SWEET CRAVING CARBS-TO-KETO SWAP SHEET --- */}
      <section className="py-20 px-4 bg-cream-section border-y border-rose-brand-light" id="swap-calculator">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold tracking-widest text-rose-brand uppercase mb-2 block">Premium Swapping Protocol</span>
            <h2 className="font-serif font-bold text-3xl text-rose-brand-dark mb-4">Dynamic Carbs-to-Keto Swap Lookup</h2>
            <p className="text-gray-600 font-light text-sm">
              Do not suffer from cravings weight restriction. Test this interactive swap selector below—included as a physical cheat sheet with our eBook—to convert common starch cravings to high fat fuels:
            </p>
          </div>

          <div className="bg-white border border-[#ebdccb] rounded-3xl p-6 sm:p-8 shadow-md">
            
            {/* Search Input */}
            <div className="mb-6 relative">
              <input 
                type="text" 
                placeholder="🔍 Search standard cravings: rice, chips, pasta, chocolate..."
                value={swapSearch}
                onChange={(e) => setSwapSearch(e.target.value)}
                className="w-full bg-[#fdfaf5] border-2 border-[#e8decf] rounded-2xl py-3 px-4 text-sm font-medium text-rose-brand-dark focus:ring-2 focus:ring-rose-brand focus:outline-hidden"
                id="swap-search-field"
              />
              {swapSearch && (
                <button 
                  onClick={() => setSwapSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-rose-bran"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Swaps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {filteredSwaps.map((item, index) => (
                  <motion.div 
                    layout
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#fffcf8] border border-rose-brand-light/30 rounded-2xl p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-bold text-red-600 line-through">❌ Out: {item.craving}</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">✓ 0% Sugar</span>
                      </div>
                      <div className="font-serif font-bold text-[#880e4f] text-base mb-2">
                        🥑 Keto In: <span className="text-rose-brand">{item.replacement}</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed font-light">
                        {item.benefit}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredSwaps.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                No mock matches found for your criteria. Try searching "rice" or "sweet"!
              </div>
            )}

          </div>

        </div>
      </section>


      {/* --- WHAT'S INCLUDED / THE BUNDLE LIST --- */}
      <section className="py-20 px-4 bg-white" id="bundle">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-rose-brand uppercase mb-2 block">The Total Offer Breakdown</span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-rose-brand-dark mb-4">Everything Included In Your $7 Pack</h2>
            <p className="text-gray-600 font-light text-base">
              No continuous monthly fees, subscription catches, or sneaky upsells. A pristine, single digital payment:
            </p>
          </div>

          <div className="divide-y divide-rose-brand-light/50 border-y border-rose-brand-light/50 mb-12">
            
            <div className="py-4.5 flex flex-col sm:flex-row items-baseline gap-4">
              <span className="inline-block bg-rose-brand-light text-rose-brand-dark px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shrink-0 min-w-24 text-center select-none">
                Core Book
              </span>
              <div>
                <h4 className="text-sm font-bold text-rose-brand-dark">Ketogenic Fat Loss 101 Core eBook ($19 Value)</h4>
                <p className="text-xs text-gray-500 mt-1">An 8,000-word premium handbook mapped beautifully spanning target ketone biological formulas, meal planners, restaurant guides, and troubleshooting checklist digests.</p>
              </div>
            </div>

            <div className="py-4.5 flex flex-col sm:flex-row items-baseline gap-4">
              <span className="inline-block bg-[#e2f3df] text-emerald-800 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shrink-0 min-w-24 text-center select-none">
                Bonus 1
              </span>
              <div>
                <h4 className="text-sm font-bold text-rose-brand-dark">The Kitchen Fridge Quick-Cheat Card ($5 Value)</h4>
                <p className="text-xs text-gray-500 mt-1">Printable high resolution checklist cheat sheet with keto-friendly foods, daily macros ratios, and rapid grocery list identifiers to stick on your kitchen cabinet.</p>
              </div>
            </div>

            <div className="py-4.5 flex flex-col sm:flex-row items-baseline gap-4">
              <span className="inline-block bg-[#e2f3df] text-emerald-800 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shrink-0 min-w-24 text-center select-none">
                Bonus 2
              </span>
              <div>
                <h4 className="text-sm font-bold text-rose-brand-dark">Done-For-You Weekly Grocery Maps ($7 Value)</h4>
                <p className="text-xs text-gray-500 mt-1">Pre-formatted weekly purchase shopping lists ordered specifically by supermarket columns. Grab all nutrients within 20 minutes without backtracking.</p>
              </div>
            </div>

            <div className="py-4.5 flex flex-col sm:flex-row items-baseline gap-4">
              <span className="inline-block bg-[#e2f3df] text-emerald-800 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shrink-0 min-w-24 text-center select-none">
                Bonus 3
              </span>
              <div>
                <h4 className="text-sm font-bold text-rose-brand-dark">Total Substitution Fuel Lists ($5 Value)</h4>
                <p className="text-xs text-gray-500 mt-1">A curated guide giving 15+ delicious starch/sugar swaps to bypass active carvings without kicking your liver out of standard fat-burn mode.</p>
              </div>
            </div>

          </div>

          {/* Large Promo Badge */}
          <div className="bg-rose-brand-light/35 border border-rose-brand-light p-6 sm:p-8 rounded-3xl text-center space-y-4">
            <h3 className="font-serif font-bold text-rose-brand-dark text-xl sm:text-2xl">Total Real Recorded Value: $36.00</h3>
            <p className="text-xs text-[#871d4b] font-bold max-w-lg mx-auto uppercase tracking-wide">
              🔥 SECURE ALL FIVE PREMIUM MODULES IN A SINGLE ONE-TIME SECURE GUMROAD COMPONENT NOW FOR JUST:
            </p>
            <div className="font-serif font-extrabold text-[#c2185b] text-5xl">$7</div>
            <p className="text-[10px] text-gray-400">Secure Instant Delivery · No continuous subscription catches</p>
            <div className="pt-2">
              <a 
                href="https://ideacraftai.gumroad.com/l/ketogenicfat101" 
                target="_blank" 
                rel="noopener"
                className="inline-flex items-center gap-2 bg-rose-brand hover:bg-rose-brand-dark text-white font-bold text-sm py-3.5 px-8 rounded-full shadow-lg"
              >
                Yes, Lock In My $7 Deal Now
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

        </div>
      </section>


      {/* --- READER TESTIMONIALS --- */}
      <section className="py-20 px-4 bg-cream-section border-t border-rose-brand-light/40" id="testimonials">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-[#ad1457] uppercase mb-2 block">Reader Reviews</span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-rose-brand-dark mb-4">Hear From Genuine Successes</h2>
            <p className="text-gray-600 font-light text-base">
              See how transforming their daily fats and carbs patterns unlocked clean fat loss for these buyers:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white border border-[#eae0d2] p-6 rounded-2xl flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex text-amber-500 gap-1 mb-3">
                  <Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" />
                </div>
                <p className="text-xs text-gray-600 italic leading-relaxed mb-6">
                  "I was terrified about hitting the 'keto flu' that my sister had. This guide's Electrolyte reboot secrets were a godsend. I bypassed the fog, lost 11 lbs inside 3 weeks, and wake up with high physical energy."
                </p>
              </div>
              <div className="pt-3 border-t border-rose-brand-light/30 flex items-center justify-between">
                <span className="text-xs font-bold text-rose-brand-dark">Sarah M., 34</span>
                <span className="text-[10px] text-gray-400">New York, US</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-[#eae0d2] p-6 rounded-2xl flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex text-amber-500 gap-1 mb-3">
                  <Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" />
                </div>
                <p className="text-xs text-gray-600 italic leading-relaxed mb-6">
                  "The 'Dining Out Guide' in Chapter 6 alone is worth triple the price. I travel for marketing events and managed to maintain keto at standard Mexican grids easily with key hacks."
                </p>
              </div>
              <div className="pt-3 border-t border-rose-brand-light/30 flex items-center justify-between">
                <span className="text-xs font-bold text-rose-brand-dark">Priya K., 41</span>
                <span className="text-[10px] text-gray-400">London, UK</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-[#eae0d2] p-6 rounded-2xl flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex text-amber-500 gap-1 mb-3">
                  <Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" />
                </div>
                <p className="text-xs text-gray-600 italic leading-relaxed mb-6">
                  "The Logs vs Kindling fire explanation finally made weight biological systems click block-by-block. Everything is explained incredibly simply. Zero fluff, pure action list guides."
                </p>
              </div>
              <div className="pt-3 border-t border-rose-brand-light/30 flex items-center justify-between">
                <span className="text-xs font-bold text-rose-brand-dark">Jessica T., 29</span>
                <span className="text-[10px] text-gray-400">Atlanta, US</span>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* --- GUARANTEE BANNER --- */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          
          <div className="bg-emerald-50/80 border-2 border-emerald-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/40 rounded-full blur-2xl pointer-events-none" />
            
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-4xl mx-auto shadow-2xs">
              🛡️
            </div>

            <h3 className="font-serif font-bold text-[#1b5e20] text-2xl sm:text-3xl">30-Day Pure Money-Back Guarantee</h3>
            
            <p className="text-[#2e7d32] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-light">
              Read the entire guide. Choose your breakfast, lunch, and dinner plans. If you do not experience a profound reduction in cravings, stable physical energy, or scale progress inside 30 days — email for a direct, prompt refund. No questions asked.
            </p>

            <span className="inline-block text-[11px] font-bold tracking-widest bg-emerald-100 text-[#1b5e20] px-4 py-1 rounded-full uppercase">
              100% Risk-Free Checkout Protocol
            </span>
          </div>

        </div>
      </section>


      {/* --- FAQ COLLAPSE SECTION --- */}
      <section className="py-20 px-4 bg-cream-section border-t border-rose-brand-light/40" id="faq">
        <div className="max-w-3xl mx-auto">
          
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest text-[#ad1457] uppercase mb-2 block">Need Clarification?</span>
            <h2 className="font-serif font-bold text-3xl text-rose-brand-dark">Questions? Answered.</h2>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-[#eae0d2] rounded-2xl overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left py-4.5 px-6 font-bold font-serif text-[#1c1410] flex justify-between items-center gap-4 focus:outline-hidden cursor-pointer hover:bg-rose-50/20"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <span className="shrink-0 text-rose-brand">
                    {openFaq === idx ? <ChevronDown size={18} className="rotate-180 transition-transform" /> : <ChevronDown size={18} />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-gray-500 leading-relaxed border-t border-rose-brand-light/10">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* --- IMPRESSIVE HIGH-URGENCY FINAL INVITATION --- */}
      <section className="relative py-24 px-4 bg-linear-to-br from-[#880e4f] via-[#c2185b] to-[#e91e8c] text-white text-center overflow-hidden">
        {/* Abstract glowing shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-orange-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto relative z-10 space-y-6">
          <h2 className="font-serif font-bold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            Your transformation starts with one decision.
          </h2>
          <p className="text-rose-100 text-sm sm:text-base max-w-lg mx-auto font-light leading-relaxed">
            For the small cost of a single specialty coffee, secure the complete blueprint that changes how you energize and burn cellular fat forever.
          </p>

          <div className="pt-4 flex flex-col items-center">
            <a 
              href="https://ideacraftai.gumroad.com/l/ketogenicfat101" 
              target="_blank" 
              rel="noopener"
              className="w-full max-w-sm bg-white hover:bg-rose-50 text-rose-brand-dark font-extrabold text-base py-4 px-8 rounded-full shadow-xl transition-all active:scale-98 block"
            >
              Get My Guidebook Copy — $7
            </a>
            <span className="text-[11px] text-[#fce4ec]/70 mt-3 block">🔒 Secure 256-Bit SSL Gumroad Checkout Protection</span>
            <span className="text-xs text-amber-300 font-bold mt-1 inline-flex items-center gap-1">
              ⚡ Launch Promo Price of $7 Ends Soon
            </span>
          </div>
        </div>
      </section>


      {/* --- STANDARD REGULATORY FOOTER --- */}
      <footer className="bg-[#1c1410] text-[#a08070] py-12 px-4 border-t border-[#2d221b]">
        <div className="max-w-5xl mx-auto flex flex-col items-center space-y-6 text-center">
          
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 bg-rose-brand rounded-md flex items-center justify-center text-xs">🥑</div>
            <span className="font-serif font-bold text-white tracking-wide text-sm">Ketogenic Fat Loss Diet 101</span>
          </div>

          <p className="text-[11px] text-[#826a5d] leading-relaxed max-w-2xl font-light">
            Disclaimer: The nutritional guidance and calculators in this guidebook are purely for educational and self-quantifying reference. Please consult with a practicing medical physician before making rapid lifestyle diet overrides. Ketose outcomes vary based on custom metabolism.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-[#8a7265] pt-2">
            <a href="#" className="hover:text-rose-brand transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-rose-brand transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-rose-brand transition-colors">Disclaimer Directive</a>
            <a href="#" className="hover:text-rose-brand transition-colors">Contact Support</a>
          </div>

          <p className="text-[10px] text-gray-500 pt-3">
            © {new Date().getFullYear()} Keto Fat Loss 101. Handcrafted with precision. All rights reserved.
          </p>

        </div>
      </footer>


      {/* --- STICKY MOBILE CTA BAR --- */}
      <div className="fixed sm:hidden bottom-0 left-0 right-0 bg-rose-brand z-50 py-3 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] border-t border-rose-brand-mid/30 flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] text-rose-brand-light font-bold uppercase leading-none">LAUNCH VALUE PROMO</div>
          <div className="font-serif font-extrabold text-white text-lg leading-tight">$7.00 <span className="text-xs line-through text-rose-300 font-normal ml-1">$27</span></div>
        </div>
        <a 
          href="https://ideacraftai.gumroad.com/l/ketogenicfat101"
          target="_blank"
          rel="noopener"
          className="bg-white hover:bg-cream-section text-rose-brand-dark font-extrabold text-xs py-3 px-5 rounded-full uppercase tracking-wider block"
        >
          Buy PDF Access
        </a>
      </div>

    </div>
  );
}
