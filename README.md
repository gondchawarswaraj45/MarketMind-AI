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

## 📸 Complete 4K Ultra-HD Interface Showcase (All Engines & Views)

### 1. Engine 1: Product Intelligence & 5-Axis Spider Moat
*Automated value proposition framing, 5-dimensional commercial strength radar, granular buyer personas, and unit economics.*

| Dark Mode: 5-Axis Spider Moat & Strategic Fit | Light Mode: Granular Buyer Personas (ICP DNA) |
| :---: | :---: |
| ![Spider Moat Radar](screenshots/01_product_intelligence_spider_moat_dark_4k.png) | ![Target Audience DNA](screenshots/02_product_intelligence_target_audience_light_4k.png) |

| Dark Mode: Unit Economics & CAC/LTV Battlecards | Light Mode: Competitor Counter-Positioning Matrix |
| :---: | :---: |
| ![Unit Economics & Battlecards](screenshots/03_product_intelligence_unit_economics_dark_4k.png) | ![Competitor Win Matrix](screenshots/04_product_intelligence_competitor_matrix_light_4k.png) |

---

### 2. Engine 2: Buyer Discovery — Polar Signal Radar & Target Lock HUD
*Real-time polar coordinate radar plotting prospective buyer accounts by intent distance (70%, 85%, 95% Hot Core), active target blip locks, and instant Quill executive outreach.*

| Dark Mode: Polar Coordinate Signal Radar | Light Mode: Polar Signal Radar Scope |
| :---: | :---: |
| ![Polar Signal Radar Dark](screenshots/05_buyer_discovery_signal_radar_dark_4k.png) | ![Polar Signal Radar Light](screenshots/06_buyer_discovery_signal_radar_light_4k.png) |

| Light Mode: Sales & Retail Distribution Intel | Dark Mode: Signal Matrix & Real-Time Catalyst Stream |
| :---: | :---: |
| ![Sales & Distribution Intelligence](screenshots/07_buyer_discovery_sales_distribution_light_4k.png) | ![Signal Matrix & Timeline](screenshots/08_buyer_discovery_matrix_timeline_dark_4k.png) |

| Light Mode: Urgency Matrix & Tiered Lead Scoring | Dark Mode: Decision-Maker Target Audience & ICP Deck |
| :---: | :---: |
| ![Urgency Matrix & Lead Tiers](screenshots/09_buyer_discovery_urgency_matrix_light_4k.png) | ![Target Audience ICP Deck](screenshots/10_buyer_discovery_target_audience_icp_dark_4k.png) |

| Light Mode: Real-Time Webhook Dispatcher & Automations |
| :---: |
| ![Automations & CRM Dispatcher](screenshots/11_buyer_discovery_automations_crm_light_4k.png) |

---

### 3. Engine 3: Marketing Automation — Funnel & Outbound Playbooks
*Full-cycle commercial conversion funnel mapping impressions to closed checkout orders with leak diagnoses, revenue forecasting, and multi-stage outbound campaigns.*

| Dark Mode: Full-Cycle Commercial Conversion Funnel | Light Mode: Commercial Conversion Funnel Stages |
| :---: | :---: |
| ![Conversion Funnel Dark](screenshots/12_marketing_automation_conversion_funnel_dark_4k.png) | ![Conversion Funnel Light](screenshots/13_marketing_automation_conversion_funnel_light_4k.png) |

| Light Mode: Sales & Revenue Forecaster Simulator | Dark Mode: 3-Stage Outbound Playbooks & Authority Copy |
| :---: | :---: |
| ![Sales & Revenue Forecaster](screenshots/14_marketing_automation_sales_forecaster_light_4k.png) | ![Outbound Playbooks](screenshots/15_marketing_automation_campaign_playbooks_dark_4k.png) |

---

### 4. Engine 4: Globe AI Marketing Copilot
*Dedicated Chief Marketing Officer copilot with real-time web news grounding, algorithm-shift playbooks, and verified social signal feeds.*

| Dark Mode: Globe AI Agent Chat & Strategic Matrix | Light Mode: Platform Virality Radar & News Grounding |
| :---: | :---: |
| ![Globe AI Marketing Agent Chat](screenshots/16_globe_ai_agent_chat_dark_4k.png) | ![Virality Radar & Signals](screenshots/17_globe_ai_agent_virality_radar_light_4k.png) |

---

### 5. Engine 5: Enterprise Admin Hub
*Central portfolio command center for company products, global webhook endpoints, and Groq Neural Engine telemetry.*

| Dark Mode: Enterprise Portfolio Command Center | Light Mode: System Telemetry & Portfolio Controls |
| :---: | :---: |
| ![Admin Hub Dark](screenshots/18_enterprise_admin_hub_dark_4k.png) | ![Admin Hub Light](screenshots/19_enterprise_admin_hub_light_4k.png) |

---

## ⚡ Architecture & Growth Pipeline

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

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript | High-performance componentized SPA architecture |
| **Styling & Theme** | Tailwind CSS 3.4 | Smooth walled backgrounds, Cobalt & Slate palette (zero AI gradient cliches) |
| **Motion & Visuals** | Framer Motion & Lucide React | High-performance tactile transitions and iconography |
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
