# MarketMind AI 🚀
> **Enterprise Growth Intelligence & Autonomous Buyer Discovery Operating System**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Zero--Config-003B57.svg)](https://www.sqlite.org/)

**MarketMind AI** is an internal enterprise growth platform designed for single-company portfolio marketing. It bridges deep product analysis, live web buyer intent telemetry, and automated multi-channel campaign execution into a unified, walled operating system powered by **Globe AI**.

---

## 📸 Interface Showcase (All Pages Across Dark & Light Modes)

### 1. Engine 1: Product Intelligence & 5-Axis Spider Moat
*Automated value proposition framing, 5-axis competitive defensibility analysis, customer persona synthesis, and commercial unit economics.*

| Dark Mode: Spider Moat & Fit Pentagon | Light Mode: Buyer Personas & Unit Economics |
| :---: | :---: |
| ![Spider Moat Pentagon](screenshots/01_product_intelligence_moat_dark.png) | ![Personas and Economics](screenshots/02_product_intelligence_personas_light.png) |

---

### 2. Engine 2: Buyer Discovery — Polar Signal Radar & Target Lock HUD
*Real-time polar coordinate radar plotting prospective buyer accounts by intent distance (70%, 80%, 90% Hot Core), active target blip locks, and instant Quill executive outreach.*

| Dark Mode: Polar Coordinate Signal Radar | Light Mode: Sales & Retail Distribution Intel |
| :---: | :---: |
| ![Polar Signal Radar](screenshots/03_buyer_discovery_radar_dark.png) | ![Sales Distribution](screenshots/04_buyer_discovery_sales_light.png) |

---

### 3. Engine 2: Buyer Discovery — Signal Matrix, Timeline & Urgency Tiers
*Chronological radar telemetry tracking hiring triggers, inventory warehouse expansions, and RFP catalysts with verbatim public evidence.*

| Dark Mode: Signal Matrix & Catalyst Timeline | Light Mode: Urgency Matrix & Tiered Leads |
| :---: | :---: |
| ![Signal Matrix and Timeline](screenshots/05_buyer_discovery_matrix_dark.png) | ![Urgency Matrix](screenshots/06_buyer_discovery_urgency_light.png) |

---

### 4. Engine 3: Marketing Automation — Conversion Funnel & Campaign Assets
*Dynamic conversion funnel simulator adjusting traffic, CTR, conversion rates, and ACV alongside 3-stage email sequences and viral LinkedIn playbooks.*

| Light Mode: Conversion Funnel & Simulator | Dark Mode: Multi-Stage Campaign Playbooks |
| :---: | :---: |
| ![Conversion Funnel](screenshots/07_marketing_automation_funnel_light.png) | ![Campaign Playbooks](screenshots/08_marketing_automation_campaigns_dark.png) |

---

### 5. Engine 4 & 5: Globe AI Growth Copilot & Enterprise Admin Hub
*Dedicated growth strategist with real-time social algorithm shift intelligence, alongside the central company portfolio command center with global webhook dispatching.*

| Dark Mode: Globe AI Marketing Copilot | Light Mode: Enterprise Admin Hub & Webhooks |
| :---: | :---: |
| ![Globe AI Agent Chat](screenshots/09_globe_ai_agent_chat_dark.png) | ![Enterprise Admin Hub](screenshots/10_enterprise_admin_hub_light.png) |

---

## ⚡ Key Architectural Capabilities

```mermaid
flowchart TD
    subgraph Core ["Globe AI Enterprise Growth Core"]
        P[Product Catalog & Value Framing]
        DB[(Embedded SQLite DB)]
    end

    subgraph E1 ["Engine 1: Product Intelligence"]
        P --> PI[Value Proposition Extraction]
        PI --> SM[5-Axis Spider Moat Analysis]
        PI --> CP[Granular Buyer Personas]
        PI --> BC[Competitor Battlecards]
    end

    subgraph E2 ["Engine 2: Buyer Discovery Radar"]
        P --> BD[Web Telemetry & Signal Aggregator]
        BD --> PR[Polar Coordinate Signal Radar]
        BD --> TL[Target Lock HUD & Buyer Scoring]
        BD --> QO[1:1 Grounded Quill Outreach]
    end

    subgraph E3 ["Engine 3: Marketing Automation"]
        P --> MA[Interactive Conversion Funnel]
        MA --> RS[Sales Revenue Simulator]
        MA --> CPB[Multi-Stage Outbound Playbooks]
    end

    subgraph Gov ["Governance & Orchestration"]
        GAI[Globe AI Agent Copilot]
        ADM[Admin Hub & Global Webhooks]
    end

    E1 & E2 & E3 --> GAI
    E1 & E2 & E3 --> ADM
    ADM --> WH[CRM / Slack / Zapier / n8n]
```

### 🎯 Five Integrated Engines
1. **Product Intelligence Engine (`DESIGN`)**:
   - 5-Axis Spider Moat visualization (Value Clarity, Pricing Power, Channel Fit, Velocity, Defensibility).
   - Dynamic ICP and Customer Persona synthesis (seniority, operational friction, key conversion levers).
   - Competitor positioning matrices with counter-positioning angles.
2. **Buyer Discovery Engine (`STRATEGY`)**:
   - Polar coordinate radar scope visualizing hot-core ($\ge 90\%$), warm-pipeline ($80\%-89\%$), and broad-market ($70\%-79\%$) buyer accounts.
   - Live web signal scraping across hiring notices, vendor expansions, procurement RFPs, and executive migrations.
   - Fact vs. Hypothesis governance: every signal cites verbatim text, source publication, and timestamp.
3. **Marketing Automation Engine (`AUTOMATION`)**:
   - Interactive conversion funnel adjusting traffic volume, CTR, conversion rates, and ACV.
   - Automated 3-stage email sequences (Pain Hook, Proof Engine, Executive Ask).
   - High-dwell-time LinkedIn authority posts, Twitter/X threads, and targeted ad copy.
4. **Globe AI Growth Director (`COPILOT`)**:
   - Real-time market news integration and social algorithm shift updates.
   - Copywriting assistant, tactical guerrilla growth plays, and file attachment support.
5. **Enterprise Admin Hub (`GOVERNANCE`)**:
   - Central product portfolio management (add, edit, toggle, inspect company products).
   - Global outbound webhook dispatching (Slack channels, Make, Zapier, n8n).
   - System telemetry, Groq high-speed LLM monitoring, and CSV/JSON pipeline export.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript | Componentized modern SPA architecture |
| **Styling & Theme** | Tailwind CSS 3.4 | Smooth walled backgrounds, Cobalt & Slate palette (zero AI gradient cliches) |
| **Motion & Icons** | Framer Motion & Lucide React | High-performance tactile transitions and iconography |
| **Backend Framework** | Java 17+ / Spring Boot 3.3.5 | Robust enterprise RESTful micro-architecture |
| **Security & Auth** | Spring Security 6 + JWT | Stateless token-based authentication with role verification |
| **Database** | SQLite + Hibernate Community Dialect | Embedded zero-configuration transactional database |
| **AI Orchestration** | High-Speed Groq LLM API (`gpt-oss-120b`) | Sub-second generative marketing intelligence and copy synthesis |
| **Web Signal Telemetry**| Tavily Search API | Authentic, verified real-world market intelligence gathering |
| **Documentation** | OpenAPI 3 / Swagger UI | Interactive API exploration at `/swagger-ui.html` |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Java 17 LTS or higher** (`java -version`)
- **Maven 3.8+** (`mvn -v`)
- **Node.js 18+ & npm** (`node -v`)

### 1. Clone the Repository
```bash
git clone https://github.com/gondchawarswaraj45/MarketMind-AI.git
cd MarketMind-AI
```

### 2. Configure Environment Variables
Copy the template configuration file:
```bash
cp .env.example .env
```
Update `.env` with your desired configuration (API keys are kept strictly local and ignored by Git):
```properties
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b
SERVER_PORT=8080
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### 3. Launch Services (Windows One-Click)
Double-click `start.bat` or run:
```cmd
start.bat
```

### 4. Manual Startup
#### Backend (Port 8080):
```bash
cd backend
mvn spring-boot:run
```
*API Swagger Documentation: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)*

#### Frontend (Port 5173):
```bash
cd frontend
npm install
npm run dev
```
*Web Application: [http://localhost:5173](http://localhost:5173)*

---

## 🔒 Security & Privacy Notice
- **No Sensitive Data Committed**: All API keys, production tokens, credentials, and local database files are excluded via `.gitignore`.
- **Private Portfolio Isolation**: Designed specifically for internal corporate usage to safely market company products without leaking sensitive competitive IP.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
