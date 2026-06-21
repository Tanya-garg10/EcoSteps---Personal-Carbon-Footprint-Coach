# 🌿 EcoSteps - Personal Carbon Footprint Coach

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge\&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge\&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge\&logo=tailwind-css)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge\&logo=express)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-FF9800?style=for-the-badge)

> 🌍 **Track • Analyze • Reduce**
>
> An AI-powered carbon footprint tracker designed to help individuals understand their environmental impact and take meaningful actions toward a sustainable future.

EcoSteps combines **real-time carbon tracking**, **interactive analytics**, **AI-driven sustainability coaching**, and **gamified eco challenges** into a single elegant platform.

Built with **React 19**, **TypeScript**, **Express**, and **Tailwind CSS**, EcoSteps empowers users to make smarter, greener choices every day.

# ✨ Features

## 📊 Carbon Footprint Dashboard

Track daily carbon emissions across four major sectors:

### 🚗 Transportation

* Petrol/Gasoline SUV
* Hybrid & Electric Vehicles
* Bus Commute
* Metro/Subway
* Walking & Cycling

### ⚡ Home & Energy

* Electricity Consumption
* Natural Gas Usage
* Heating Controls
* Energy Saving Offsets

### 🍽️ Food & Diet

* Beef & Lamb Meals
* Poultry & Pork
* Dairy & Eggs
* Vegetarian Meals
* Vegan Meals

### 🗑️ Waste Management

* Mixed Trash
* Plastic Recycling
* Composting

### ⚡ Real-Time Carbon Calculation

Every activity is instantly converted into:

```text
kg CO₂e
```

using scientifically researched emission coefficients.

Users receive live carbon previews before saving entries.

# 🎯 Sustainable Daily Limit Tracker

Stay aligned with sustainable living goals.

### Features

✅ Daily Carbon Budget

✅ Custom Target Limits

✅ Consecutive Green Streaks

✅ Smart Status Indicators

### 🌍 Sustainable Limit

EcoSteps follows the globally recommended sustainable carbon budget:

```text
5.0 kg CO₂e / day
```

Status indicators:

🟢 Within Target

🟡 Near Limit

🔴 Exceeded Limit

# 📈 Interactive Analytics

Understand your footprint through beautiful visualizations.

### 🍩 Emission Breakdown

Interactive Donut Chart showing:

* Transportation
* Energy
* Food
* Waste

### 📉 7-Day Carbon Trends

Track:

* Historical emissions
* Daily carbon trends
* Peak emission days
* Improvement over time

### 📋 Saved Activity Ledger

Manage all entries with:

* Category Filters
* Notes
* Instant Delete
* Historical Records

# 🏆 Eco Challenge Arena

Turn sustainability into a fun experience.

### 🌱 Challenge Categories

#### Easy

* Walk instead of driving
* Use reusable bottles

#### Medium

* Vegetarian Day
* Save electricity

#### Hard

* Car-Free Week
* Zero Waste Challenge

### 🎮 Challenge Lifecycle

```text
Discover Challenge
       ↓

Join Challenge
       ↓

Complete Activity
       ↓

Earn Carbon Credits
       ↓

Gain XP
       ↓

Level Up 🚀
```

Users earn:

* Negative Carbon Credits (-CO₂)
* Experience Points (XP)
* Eco League Progress

# 🤖 Gemini 3.5 AI Eco Coach

EcoSteps includes a smart sustainability assistant powered by **Gemini 3.5 Flash**.

The AI analyzes:

* Total Carbon Footprint
* Transportation Emissions
* Energy Consumption
* Food Habits
* Waste Generation
* Daily Targets

and provides:

✨ Personalized Recommendations

✨ Carbon Reduction Tips

✨ Diet Comparisons

✨ Sustainable Alternatives

✨ Lifestyle Guidance

# 🔒 Intelligent Fallback System

EcoSteps never leaves users with a broken AI experience.

If:

* Gemini API Key is unavailable
* API quota is exhausted
* Rate limits occur

The application automatically switches to:

## 🧠 Local Expert Advisor

The fallback system provides:

* Rule-based recommendations
* Carbon-saving tips
* Food comparisons
* Transport alternatives
* Personalized sustainability guidance

✅ No broken prompts

✅ No server crashes

✅ Seamless user experience

# 🏗️ Technical Architecture

```text
┌──────────────────────────┐
│ React 19 Client (SPA)    │
└───────────┬──────────────┘
            │ Fetch / POST
            ▼
┌──────────────────────────┐
│ Express Server           │
│ Node + TypeScript        │
└───────────┬──────────────┘
            │

      ┌─────┴─────┐

      ▼           ▼

 Gemini 3.5     Local Expert
 Flash AI       Fallback
```

# 🛠️ Tech Stack

| Category   | Technology       |
| ---------- | ---------------- |
| Frontend   | React 19         |
| Language   | TypeScript       |
| Build Tool | Vite             |
| Styling    | Tailwind CSS     |
| Backend    | Express.js       |
| Charts     | Recharts         |
| Icons      | Lucide React     |
| AI         | Gemini 3.5 Flash |
| Bundler    | esbuild          |
| Runtime    | tsx              |

# 🚀 Installation

Clone the repository:

```bash
git clone https://github.com/Tanya-garg10/EcoSteps-Personal-Carbon-Footprint-Coach.git
```

Move into project:

```bash
cd EcoSteps-Personal-Carbon-Footprint-Coach
```

Install dependencies:

```bash
npm install
```

# ⚙️ Environment Variables

Create:

```bash
cp .env.example .env
```

Add:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> If the API key is unavailable, EcoSteps automatically switches to Local Expert Mode.

# 💻 Development

Run locally:

```bash
npm run dev
```

Application runs on:

```text
http://localhost:3000
```

# 📦 Production Build

Build the project:

```bash
npm run build
```

Start production server:

```bash
npm run start
```

# 🧹 Code Quality

Run linting:

```bash
npm run lint
```

# 📐 Carbon Emission Factors

| Category | Activity             | CO₂ Factor | Unit |
| -------- | -------------------- | :--------: | :--: |
| Transit  | SUV                  |    0.22    |  km  |
| Transit  | Hybrid/EV            |    0.11    |  km  |
| Transit  | Bus                  |    0.06    |  km  |
| Transit  | Metro                |    0.03    |  km  |
| Transit  | Walking/Cycling      |    0.00    |  km  |
| Home     | Electricity          |    0.45    |  kWh |
| Home     | Natural Gas          |    0.18    |  kWh |
| Home     | Energy Saving Offset |    -0.50   | hour |
| Food     | Beef/Lamb            |    6.50    | meal |
| Food     | Poultry/Pork         |    2.10    | meal |
| Food     | Dairy & Eggs         |    1.10    | meal |
| Food     | Vegetarian           |    0.80    | meal |
| Food     | Vegan                |    0.40    | meal |
| Waste    | Mixed Trash          |    1.20    |  bag |
| Waste    | Plastic Recycling    |    -0.40   |  bag |
| Waste    | Compost              |    -0.60   |  bag |

# 🌍 Mission

EcoSteps is more than a carbon calculator.

It is an ecosystem that combines **Artificial Intelligence**, **Data Visualization**, **Behavioral Gamification**, and **Sustainability** to inspire people to make eco-conscious choices and contribute to a greener future.

> 🌱 *Every sustainable choice matters. Track smarter, live greener, and make every step count with EcoSteps.*
