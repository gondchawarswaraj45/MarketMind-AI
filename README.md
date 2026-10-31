# MarketMind 🚀
> *"Understand Your Market. Discover Your Buyers. Win More Customers."*

**MarketMind** is a universal, AI-powered marketing intelligence and buyer discovery SaaS platform that transforms raw product information into actionable go-to-market execution across three integrated engines: **Design**, **Strategy**, and **Automation**.

---

## 🌟 The 3 Integrated Engines

### 1. DESIGN — See The Signal (Product Intelligence)
* **AI-Powered Product Analysis**: Extracts core value propositions, target verticals, and market boundaries.
* **Buyer Persona Generation**: Synthesizes granular personas including seniority, pain points, purchase triggers, and objections.
* **Competitor Discovery & Battlecards**: Maps incumbents, strengths, vulnerabilities, and precise differentiation win angles.
* **USP & Blue Ocean Opportunities**: Identifies untapped market white space and defensible moats.
* **Interactive Intelligence Dashboard**: Visual readiness scores, persona inspection cards, and competitor comparison matrices.

### 2. STRATEGY — Find The Signal (Buyer Discovery)
* **Tavily Web Intelligence Integration**: Researches authentic, public buying signals across the live web (job boards, news, forum queries, funding rounds, tech migrations).
* **Transparent Lead Relevance Scoring**: 0–100 scoring based on ICP fit, signal recency, intent strength, and evidence credibility.
* **Fact vs. Hypothesis Governance**: Explicit distinction between verified facts (backed by verbatim quotes, timestamps, and real source URLs) and AI-generated hypotheses.
* **Decision-Maker Targeting**: Pinpoints relevant organizational roles (e.g. VP Growth, Head of Demand Gen).

### 3. AUTOMATION — Signal To Inbox (Marketing Automation)
* **Multi-Stage Email Drip Campaigns**: Generates structured cold & nurture sequences (relevance hooks, proof, CTAs).
* **Viral LinkedIn Authority Content**: High-impact hooks, thought leadership frameworks, and engagement-optimized copy.
* **Targeted Ad Copy**: Ready-to-deploy Google Search, LinkedIn Sponsored Content, and Meta ad copy.
* **1:1 Signal-Grounded Outreach Drafts**: Hyper-personalized messages citing the exact verified public signal and source URL.
* **Campaign Management & Export**: Save campaigns, delete, preview assets, and export playbooks to Markdown (`.md`).

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React, Recharts |
| **Backend** | Java 17 / 21, Spring Boot 3.3.5, Spring Security, JWT, Spring Data JPA, Hibernate |
| **Database** | SQLite (`sqlite-jdbc` + Hibernate Community SQLite Dialect) — zero external server required |
| **AI & Web Research** | Groq API (`llama-3.3-70b-versatile`), Tavily Search API, Google Gemini (fallback) |
| **API Documentation**| Swagger / OpenAPI 3 (`/swagger-ui.html`) |

---

## ⚡ Quick Start

### 1. Prerequisites
* **Java 17+** (verified on Java 17 LTS)
* **Maven 3.8+**
* **Node.js 18+** & npm

### 2. Launch with One Click (Windows)
Double-click `start.bat` or run:
```cmd
start.bat
```

Or start manually:
#### Start Backend (Port 8080):
```bash
cd backend
mvn spring-boot:run
```
*Swagger UI is available at:* `http://localhost:8080/swagger-ui.html`

#### Start Frontend (Port 5173):
```bash
cd frontend
npm run dev
```
*App is available at:* `http://localhost:5173`

---

## 🔑 Environment Variables & API Keys (Optional)

MarketMind includes intelligent baseline models so that the platform is **100% testable and functional immediately** even before API keys are added.

To enable live LLM reasoning and real-time Tavily web searches, set the following environment variables or add them to your environment:
* `GROQ_API_KEY`: Your Groq Cloud API key (uses fast `llama-3.3-70b-versatile`).
* `TAVILY_API_KEY`: Your Tavily Search API key (for live web buying signal discovery).
* `GEMINI_API_KEY`: (Optional) Google Gemini API key.

---

## 🧪 Testing

Run backend unit and integration test suite:
```bash
cd backend
mvn test
```
*All 7 unit and integration tests covering Authentication, Product Intelligence, Buyer Discovery, and Campaign Generation pass with 0 errors.*

Build frontend production bundle:
```bash
cd frontend
npm run build
```

