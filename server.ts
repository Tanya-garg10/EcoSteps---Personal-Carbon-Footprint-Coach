import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY || "";
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Helper function for local Eco Advice fallback if Gemini API is exhausted or missing
function getFallbackAdvice(query: string, userContext: any): string {
  const qClean = (query || "").toLowerCase();
  const { totalCo2, logsByCategory, recentLogs, limit } = userContext || {};
  
  const transCo2 = logsByCategory?.transportation || 0;
  const energyCo2 = logsByCategory?.energy || 0;
  const foodCo2 = logsByCategory?.food || 0;
  const wasteCo2 = logsByCategory?.waste || 0;
  const total = totalCo2 || (transCo2 + energyCo2 + foodCo2 + wasteCo2);

  // Intro badge
  const badge = `> 📉 **Notice:** The server is currently operating in **Local Expert Fallback Mode** (Daily Free-tier Gemini Quota reached/unconfigured). I am using pre-calculated energy and transit data to analyze your context!\n\n`;

  let response = `${badge}Hello there, **Eco Climber!** 🌿\n\n`;

  if (qClean.includes("analyze") || qClean.includes("footprint") || qClean.includes("suggest") || qClean.includes("report")) {
    response += `I have conducted a thorough review of your carbon footprint parameters. Here is your custom Sector Performance Report:\n\n`;
    
    // Markdown table
    response += `### 📊 Footprint Breakdown Ledger\n\n`;
    response += `| Sector / Parameter | Action Load (kg CO₂e) | Current Status | Recommendation |\n`;
    response += `| :--- | :---: | :---: | :--- |\n`;
    
    response += `| **Transit** | \`${transCo2.toFixed(1)} kg\` | ${transCo2 > 10 ? "⚠️ High Emission" : "✅ Good Bounds"} | Shift shorter commutes to brisk walking or cycling. |\n`;
    response += `| **Home Energy** | \`${energyCo2.toFixed(1)} kg\` | ${energyCo2 > 15 ? "⚠️ High Load" : "✅ Eco-Efficient"} | Practice heater micro-detox (dim electronics, dial down heating). |\n`;
    response += `| **Diet/Food** | \`${foodCo2.toFixed(1)} kg\` | ${foodCo2 > 8 ? "🌿 High Meat Impact" : "✅ Sustainable"} | Opt for delicious vegan or vegetarian choices 2-3 days a week. |\n`;
    response += `| **Waste Management** | \`${wasteCo2.toFixed(1)} kg\` | ${wasteCo2 > 3 ? "♻️ Up-load" : "✅ Zero-waste efforts"} | Maximize compost and recycling separation to prevent landfill. |\n`;
    response += `| **Total Active Load** | **${total.toFixed(1)} kg** | ${total > (limit || 10) ? "🚨 Exceeds Daily Target" : "🎖️ Within Target Ceiling"} | Target limit is strictly set to **${limit || 5} kg/day**. |\n\n`;

    response += `### 🚀 Core Personalized Action Recommendations\n`;
    if (transCo2 > 0) {
      response += `1. **Transit Offset (Save ~2.5 - 5kg):** Since your active Transit footprint is \`${transCo2.toFixed(1)} kg\`, sharing rides, teleworking, or taking commuter bus lines will significantly diminish this sector.\n`;
    }
    if (foodCo2 > 0) {
      response += `2. **Diet Offset (Save ~3.0kg):** Your food emissions stand at \`${foodCo2.toFixed(1)} kg\`. Choosing a single vegan alternative (saves 3.2kg compared to beef) will instantly reset your day.\n`;
    }
    response += `3. **Electrolyte/Energy Audit:** Shift appliances off peak hours and keep electronics in deep sleep modes.\n\n`;
    
    response += `🏆 *Try acceptance challenge: **"Meat-Free Culinary Day"** or **"Active Commute Challenge"** to instantly secure custom rewards and daily offsets!*`;
    return response;
  }

  if (qClean.includes("5kg") || qClean.includes("save") || qClean.includes("easiest") || qClean.includes("fast")) {
    response += `Saving **5.0 kg of CO₂e** today is highly achievable through 3 direct micro-activities! Here is the tactical breakdown:\n\n`;
    
    response += `| Fast Savings Strategy | Metric Adjusted | Est. CO₂e Saved | Implementation Cost |\n | :--- | :---: | :---: | :--- |\n`;
    response += `| **1. Vegetarian/Vegan Feast** | Replace 1 Beef/Pork meal | **-3.5 kg** | None - Try delicious alternative recipes! |\n`;
    response += `| **2. Short Ride Substitution** | Walk/Cycle a 10km run | **-2.0 kg** | Pure health & exercise benefits |\n`;
    response += `| **3. Dial Heating Down 2°C** | Reduce Home boiler power | **-1.0 kg** | Save money on your utility utilities! |\n\n`;
    
    response += `### 💡 How to automate this today:\n`;
    response += `- **Active Commutes:** If you have to go somewhere under 4km, set up a walk playlist and go on foot. You save **0.2kg CO₂** for every single single kilometer you don't drive.\n`;
    response += `- **Diet Focus:** Challenge your peer group to a green food photo sharing thread!\n\n`;
    response += `Let's join the **"Meat-Free Culinary Day"** challenge under the Green Quests menu!`;
    return response;
  }

  if (qClean.includes("food") || qClean.includes("diet") || qClean.includes("meat") || qClean.includes("vegan") || qClean.includes("vegetarian") || qClean.includes("apple")) {
    response += `Food and agricultural practices represent over 25% of global human emissions! Standard items carry significantly diverse loads:\n\n`;
    
    response += `### 🥦 Standard Food Footprint Matrix\n\n`;
    response += `| Dietary Item | Carbon Factor per Portion | Relative Comparison | Primary Cause |\n`;
    response += `| :--- | :---: | :---: | :--- |\n`;
    response += `| 🥩 **Beef/Lamb Meal** | **5.0 - 8.0 kg CO₂e** | 🔴 15x higher than vegan | Methane emissions and land-clearing for pasture |\n`;
    response += `| 🐷 **Pork/Poultry Meal** | **1.8 - 2.5 kg CO₂e** | 🟡 4x higher than vegan | Feed production & thermal operations |\n`;
    response += `| 🥛 **Dairy Cheese (100g)** | **1.2 kg CO₂e** | 🟡 Medium Impact | Intensive dairy livestock maintenance |\n`;
    response += `| 🍳 **Eggs / Aquaculture** | **0.9 kg CO₂e** | 🟢 Low-Medium | Feed-to-animal conversion efficiencies |\n`;
    response += `| 🥗 **Vegetarian Meal** | **0.8 - 1.2 kg CO₂e**| 🟢 Low Load | Minimal processing, natural cropping |\n`;
    response += `| 🍎 **Vegan Plate (Plant-based)**| **0.4 - 0.6 kg CO₂e**| 🌱 Ultra Minimal | Lowest trophic level, direct human consumption |\n\n`;
    
    response += `### 🎯 Quick Culinary Action Guideline:\n`;
    response += `- Shifting just **three lunches** a week to complete plant-based ingredients reduces your annual footprint by almost **1,000 kg (1 Ton) of CO₂e**!\n\n`;
    response += `*Go ahead and accept the **"Meat-Free Culinary Day"** challenge to earn points.*`;
    return response;
  }

  if (qClean.includes("travel") || qClean.includes("commute") || qClean.includes("car") || qClean.includes("transit") || qClean.includes("bus") || qClean.includes("flight")) {
    response += `Transportation is typically a person's highest single day carbon load! Standard travel mode carbon emissions compare as follows:\n\n`;
    
    response += `### 🚲 Transit Emission Index\n\n`;
    response += `| Commuting Vehicle Mode | Carbon Factor rate per km | 15km Daily Commute Total | Recommendation |\n`;
    response += `| :--- | :---: | :---: | :--- |\n`;
    response += `| 🚗 **Single Driver SUV/Petrol Car** | **0.22 kg CO₂** | \`3.3 kg CO₂e\` | Carpool or substitute trips |\n`;
    response += `| 🚙 **Compact Hybrid Car** | **0.11 kg CO₂** | \`1.65 kg CO₂e\` | Keep speed modes in Eco bounds |\n`;
    response += `| 🚌 **Urban Bus Commute** | **0.06 kg CO₂** | \`0.9 kg CO₂e\` | Excellent shared option |\n`;
    response += `| 🚇 **Electric Subway / Metro** | **0.03 kg CO₂** | \`0.45 kg CO₂e\` | Highly sustainable urban standard |\n`;
    response += `| 🚲 **Bicycle / Walk commute** | **0.00 kg CO₂** | \`0.0 kg CO₂e\` | Zero impact + cardiopulmonary benefits! |\n\n`;
    
    response += `### 🚦 High Impact Tips for Transit:\n`;
    response += `1. **The 3km Rule:** For any chore or errand under 3 kilometers, commit to going on foot or using a bicycle. It is often faster in traffic and leaves zero carbon residue!\n`;
    response += `2. **Tire Pressure and Carpools:** Keeping car tires at correct pressure limits saves up to 3% gasoline use. Carpooling splits the footprint instantly by passenger quantity!\n\n`;
    response += `*Accept the **"Active Commute Challenge"** today to offset your latest logs!*`;
    return response;
  }

  // Generic encouraging conversational builder
  response += `I am here to guide your journey toward carbon neutrality! Since the API is temporarily working in **Local Expert Fallback Mode**, I have evaluated your dashboard context:
  
- You have logged **${recentLogs?.length || 0} recent activities** on our footprint ledger.
- Your daily emissions stand at **${total.toFixed(1)} kg CO₂e** today relative to your custom sustainable ceiling of **${limit || 5} kg**.

**Let's perform a fast daily checklist:**
1. Can you swap your next beverage or lunch plate for a plant-based alternative today?
2. Are you able to walk, run, or take a cycle for short neighborhood chores?
3. Turn off unused heaters, chargers, and switch to standby cooling profiles.

Feel free to ask me specifics on:
* *"Explain food footprint differences"*
* *"Analyze my footprint logs"*
* *"Easiest ways to save 5kg CO2 daily"*
* *"Suggest a low-carbon travel plan for short commutes"*

You are doing amazing! Every single saved step helps us reduce cumulative emissions. Let's make an impact together! 🌍`;

  return response;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes - must come FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", time: new Date().toISOString() });
  });

  app.post("/api/coach", async (req, res) => {
    const { messages, userContext } = req.body;
    const lastUserQuery = messages && messages.length > 0 
      ? messages[messages.length - 1].content 
      : "";

    try {
      // Lazy validation of API Key
      let ai;
      try {
        ai = getGeminiClient();
      } catch (err: any) {
        console.warn("Gemini API Key missing, triggering Fallback Mode directly.");
        const fallbackText = getFallbackAdvice(lastUserQuery, userContext);
        return res.json({ text: fallbackText });
      }

      // Context building
      const { totalCo2, logsByCategory, recentLogs, limit } = userContext || {};
      
      const systemInstruction = `You are "EcoSteps AI Coach", an encouraging, action-oriented environmental scientist and personal sustainability coach.
Your goal is to help students (called "Eco Climbers") track, measure, and lower their daily CO2 carbon emissions.

Current User Stats:
- Personal Daily limit: ${limit || 10} kg CO2 per day.
- Overall logged footprint of activities: ${totalCo2 ? totalCo2.toFixed(2) : 0} kg CO2e.
- Footprint breakdown:
  * Transportation: ${logsByCategory?.transportation ? logsByCategory.transportation.toFixed(2) : 0} kg CO2e
  * Energy (home): ${logsByCategory?.energy ? logsByCategory.energy.toFixed(2) : 0} kg CO2e
  * Food/Diet: ${logsByCategory?.food ? logsByCategory.food.toFixed(2) : 0} kg CO2e
  * Waste: ${logsByCategory?.waste ? logsByCategory.waste.toFixed(2) : 0} kg CO2e
- Recent activities logged: ${JSON.stringify(recentLogs || [], null, 2)}

Communication Rules:
1. Always maintain a warm, welcoming, and high-energy coach personality. Do not sound clinical or preachy. Use supportive and optimistic language!
2. Structure your answers with clear headers, bullets, or tables when explaining carbon calculations. This keeps the UX pristine and readable on our dashboards.
3. Be realistic. If transport has high carbon footprint because they live far away, introduce steps they can actually control first: carpooling, keeping tires properly inflated, shifting to vegetarian lunches twice a week, composting, or turning the thermostat down 1-2 degrees.
4. If asked about carbon metrics, use reliable standards:
   - Gasoline Car: ~0.2 kg CO2 per km.
   - Public Transit (Bus/Train): ~0.04 - 0.08 kg CO2 per km.
   - Short Flights: ~0.15 - 0.25 kg CO2 per km per passenger.
   - Long Flights: ~0.12 kg CO2 per km per passenger.
   - Regular Grid Electricity: ~0.4 kg CO2 per kWh.
   - Meat Meal (Beef/Pork): ~3.5 - 7 kg CO2 per portion.
   - Vegetarian Meal: ~0.8 - 1.2 kg CO2 per portion.
   - Vegan Meal: ~0.4 - 0.6 kg CO2 per portion.
   - Landfill Waste: ~0.3 - 0.5 kg CO2 per bag.
   - Recycled Waste avoids approx 0.15 kg CO2 compared to landfill.
5. In every few exchanges, suggest a "Micro-Challenge" they can join (e.g. "Try replacing one drive under 3km with a brisk walk this week!", "A vegetarian lunch day").
6. Address them warmly as "Eco Climber"!`;

      // Convert messages to matching schema: roles must be 'user' or 'model' (for assistant)
      const contentParts = messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contentParts,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Coach API Error encountered:", error);
      
      // If quota is exhausted or model throws transient error, fallback to local rule-based assistant
      const fallbackText = getFallbackAdvice(lastUserQuery, userContext);
      res.json({ text: fallbackText });
    }
  });

  // Vite development vs production serving logic
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EcoSteps App server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();