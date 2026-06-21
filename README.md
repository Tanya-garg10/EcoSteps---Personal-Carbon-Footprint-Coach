# 🌿 EcoSteps - Personal Carbon Footprint Coach

An elegant, AI-powered carbon tracker, dynamic insights dashboard, and gamified challenge arena. Built on React 19, TypeScript, Express, and Tailwind CSS, **EcoSteps** guides you on a personalized journey toward carbon neutrality.

## 📈 Tabdeeli aur Features (Key Modules)

### 1. 📊 Carbon Footprint Dashboard
Log your daily activities in four critical human carbon-impact sectors. Every parameter uses highly researched static emission loads:
* **Transit (Transportation):** Car commutes (by type), bus rides, subway usage, cycling, and walking.
* **Home & Energy:** Electricity load, natural gas heaters, and heating thermostats adjustments.
* **Food & Diet:** Meals based on ingredients (e.g., carbon-heavy Beef/Lamb vs. low-impact Vegan/Vegetarian plates).
* **Waste Disposal:** Organic waste compost, recyclable plastic, and unseparated trash bins.
* **Integrated Math:** Our calculators calculate carbon equivalents ($CO_2e$) in real-time, displaying live visual preview indicators before you even click submit!

### 2. 🎖️ Personal Sustainable Ceiling Tracker
* **UN Metric Calibration:** Aligned with the globally accepted sustainable carbon limit of **5.0 kg of $CO_2e$ per day**.
* **Limit Customization:** Adjust and configure your targeted ceiling limits directly.
* **Streak Counter:** Monitor continuous days logged below your carbon limit, complete with motivational streak trackers.
* **Status Engines:** Real-time feedback messages guiding you depending on whether you are within target limits, approaching boundaries, or exceeding your carbon profile.

### 3. 📉 Interactive Analytics (Recharts & D3)
* **Emissions Sector Share:** A live, dynamic concentric Donut chart displaying percentage allocations across Transit, Diet, Energy, and Waste.
* **7-Day Carbon Trend Line:** Historical trajectory logs mapped on a smooth line graph, tracking peak emission dates to visualize pattern changes over time.
* **Saved Footprint Ledgers:** An interactive database table with category filter pills, customizable notes, and instant entry deletion.

### 4. 🏆 Personal Eco Challenge Arena (Green Quests)
* **Gamified Action Catalog:** A live bank of daily sustainable quests divided by difficulty tiers (**Easy**, **Medium**, **Hard**) and carbon savings rewards.
* **Quest Lifecycle:** Discover challenges, click **Join Challenge** to add them to your active quest roster, and complete physical actions to secure a **positive negative-carbon credit offset (-CO2)** applied directly to your daily ledger metrics.
* **Accumulate XP:** Track completed challenge metrics to upgrade your level in the global Eco League.

### 5. 🤖 Gemini 3.5 AI Eco Coach (Enhanced Hybrid Design)
* **Advanced Context Extraction:** The AI coach reads your active dashboard, category-wise emission totals, and daily limit boundaries. It understands exactly where your footprint leaks exist (e.g., too many car trips or meat-heavy dinners).
* **🔒 Fail-Soft Local Fallback Mechanism:**
  * If the Gemini API key is exhausted or unconfigured, our backing backend Express app seamlessly routes query details into an alternate rule-based **Local Expert Advisor**.
  * The fallback mode uses advanced string parsing to answer common user queries (about transit index differences, diet comparisons, actions to save 5kg, and personalized custom advice).
  * You *never* receive a broken prompt experience or raw server exception.

## 🏗️ Technical Architecture & Stack

The application uses an elegant full-stack framework configured for instant deployment containers:

```
  [ React 19 Client SPA ]  <--- Fetch / POST --->  [ Express Server (Node CJS Bundle) ]
            │                                                      │
     Recharts & Lucide                                    Gemini 3.5 SDK / Fallback
```

* **Frontend Framework:** React 19, TypeScript, and Vite.
* **Styling & Theme:** Tailwind CSS. Implements a high-contrast warm-organic natural slate theme utilizing soft off-whites, Earthy sage greens (`#5A5A40`), terracotta (`#D67D5E`), and dusty slate-blue (`#6A7E8F`).
* **Icons & Visuals:** Strictly populated from `lucide-react` for neat design coherence.
* **Charts Engine:** `recharts` (utilizing SVG canvas scaling).
* **Backend Framework:** Express v4 serving static assets in production mode.
* **Bundling & Run System:** Bundled via `esbuild` and run natively through `tsx` on Port `3000`.

## 🚀 How to Run and Build (Developer Guidelines)

### 1. Installation
Install all base packages and build tools:
```bash
npm install
```

### 2. Environment Variables Configuration
Duplicate the example environment file and insert your API credentials.
```bash
cp .env.example .env
```
Inside your secrets, declare:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*Note: If the key is left empty, the application falls back safely to the integrated **Local Expert Mode**.*

### 3. Local Development Run
To boot up the live development server on Port `3000`:
```bash
npm run dev
```

### 4. Production Build & Start
Compile client assets and bundle the backing Express TypeScript file into a single optimized server module inside `dist/server.cjs`:
```bash
# Build production bundle
npm run build

# Start production server
npm run start
```

### 5. Code Quality Check
Validate type definitions and static structure:
```bash
npm run lint
```

## 📐 Carbon Calculation Index reference

Below are the base emissions constants integrated into the application engines:

| Category | Parameter Subtype | CO2 Coefficient Factor ($CO_2/unit$) | Unit |
| :--- | :--- | :---: | :---: |
| **Transit** | Gasoline/Petrol SUV Commute | **0.22** | km |
| **Transit** | Compact Hybrid / EV Run | **0.11** | km |
| **Transit** | Urban Shared Bus Commute | **0.06** | km |
| **Transit** | Subway / Electric Metro | **0.03** | km |
| **Transit** | Walking / Bicycle Commute | **0.00** | km |
| **Home** | Standard Grid Power Usage | **0.45** | kWh |
| **Home** | Natural Gas Heater | **0.18** | kWh |
| **Home** | Energy-Saving Offset (Electronics Standby) | **-0.50** | hours |
| **Food** | High-Impact Beef/Lamb Serving | **6.50** | meals |
| **Food** | Poultry / Pork Dinner | **2.10** | meals |
| **Food** | Dairy & Eggs Portion | **1.10** | meals |
| **Food** | Balanced Vegetarian Meal | **0.80** | meals |
| **Food** | Plant-Based Vegan Serve | **0.40** | meals |
| **Waste** | Regular Mixed Trash Bag | **1.20** | bags |
| **Waste** | Plastic Recycling Offset | **-0.40** | bags |
| **Waste** | Food Scraps Compost Offset | **-0.60** | bags |

🏆 *EcoSteps encourages mindful choices, micro-commitments, and immediate carbon action. Let's make every single step count!*
