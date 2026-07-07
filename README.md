<div align="center">

# 🐾 PurrSignal

### AI Crisis Command Center for Cat Rescue, Tracing & Reunification



<br/>

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-AI-8E75B2?logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#-license)

### **Report → Analyze → Verify → Dispatch → Rescue → Reunite**

*Turning fragmented sightings into coordinated rescue missions.*

<img width="100%" alt="ChatGPT Image Jul 7, 2026, 01_13_04 PM" src="https://github.com/user-attachments/assets/7a90e2e4-8ef3-4b2c-8db3-2dcb58a6472a" />

</div>

> ### PurrSignal is a highly sophisticated, full-stack, AI-assisted crisis coordination platform designed specifically for cat rescue, tracing, and reunification. It bridges the gap between fragmented public community sighting data and active on-the-ground professional volunteer response. By transforming unorganized, chaotic incident reports into structured, prioritizable operational dispatches, PurrSignal ensures that trapped, lost, or injured cats are rescued swiftly and safely.

---

## 🧭 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Key Features](#-key-features)
- [AI Capabilities](#-ai-capabilities)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Application Workflow](#-application-workflow)
- [Security & Privacy](#-security--privacy)
- [Screenshots](#-screenshots)
- [Future Enhancements](#-future-enhancements)
- [Performance Considerations](#-performance-considerations)
- [Challenges Faced](#-challenges-faced)
- [Learnings](#-learnings)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)

---

<div align="center">

| 🌍 Community Reports | 🧠 Gemini AI | 🎯 Rescue Coordination |
|:---:|:---:|:---:|
| Multimodal public sightings and incident reports | Structured analysis, urgency assessment, matching support | Verification, dispatch, volunteer assignment, and reunification |

</div>

---

## 📌 Problem Statement

In times of natural disasters, localized accidents, or simple neighborhood escapes, feline emergency reporting is heavily fragmented. Crowdsourced reports exist across multiple non-syndicated public streams—such as Facebook local groups, Nextdoor, email lists, and public SMS boards. This leads to critical challenges:

1. **Information Asymmetry**: Crucial visual markers (such as coat pattern, collar detail, or ear-notches) are often poorly captured or omitted by frantic reporters.
2. **Prioritization Paralysis**: Volunteers cannot easily distinguish between a low-risk stable stray and a high-risk life-threatening emergency (e.g., a cat trapped in a municipal storm drain hours before a heavy storm).
3. **Loss of Continuity**: Sightings of the same cat are reported independently across disparate coordinates, resulting in multiple disjointed search circles instead of an actionable chronological path.
4. **Cooperator Fatigue**: Operational dispatchers spend hours manually formatting, cross-matching, and organizing volunteer shift-handoff briefings instead of coordinating actual field efforts.

---

## 📌 Solution

> **One coordinated operational loop connecting the public, AI-assisted analysis, and on-the-ground rescue teams.**

PurrSignal solves this coordination problem through a resilient, real-time command portal structured around three main agents:
* **The Community (The Public)**: Seamlessly logs incidents or sightings through responsive, geolocated forms supporting multimodal (photo + text) inputs.
* **The AI Core (Gemini 3.5 Flash)**: Acts as an instant visual forensic examiner, structuring coat characteristics, evaluating threat levels, extracting distinctive hallmarks, and highlighting medical boundaries safely.
* **The Coordinators & Rescuers (Field Ops)**: Uses an interactive command dashboard featuring a custom spatial-temporal sighting sequence tracker, automated matching correlation scoring, and an interactive AI copilot.

---

## 📌 Key Features

<div align="center">

**A complete rescue operations experience — from first signal to safe reunion.**

</div>


### 1. Interactive Landing Page & Miso Story Simulator
* **Live Operational Ticker**: Displays up-to-the-minute platform-wide performance indices, including **Active Missions**, **Successful Reunions**, **Mobilized Rescuers**, and **Telemetry Signal Reliability**.
* **Interactive Storyline Simulator**: A visual interactive emulator that recreates "Miso’s" (an orange tabby) high-fidelity escape and rescue journey, demonstrating scent-baiting, wildlife camera mapping, humane trapping, and reunion handshakes to train new volunteers.

### 2. High-Fidelity Custom Crisis Map (`CrisisMapPage`)
* **Responsive Vector Stage**: Built entirely on top of high-performance interactive SVGs that feature drag-and-drop panning, smooth scroll-zooming, and live category toggle filters (e.g., Traps, Active Patrols, Sighting Hotspots, Missing Reports).
* **Sequential Sighting Trails**: Dynamic motion-guided lines that connect consecutive sightings of the same feline chronologically (Sighting #1 ➡️ Sighting #2 ➡️ Sighting #3), showing directional vector arrows to project the animal's migration path.
* **Interactive Heatmaps**: Aggregates local coordinate weights to display density clusters of feline sightings, enabling teams to deploy traps strategically.

### 3. Multimodal Incident Reporting (`ReportIncidentPage`)
* **Two-Way Channel Layout**: Supports standard community reports and professional responder logs with deep validation hooks.
* **Interactive Map Pin Placement**: Users can double-click or drag a responsive indicator to precise lat/lng coordinates to record accurate sighting telemetry.
* **Multimodal Upload Container**: Accepts image attachments alongside narrative text, dispatching them to server-side AI engines for visual structure evaluation.

### 4. Coordinator Command Center & Dispatcher Dashboard (`MissionControlPage`)
* **Intelligent Sighting Matcher**: Calculates and suggests high-compatibility matches by comparing physical coat patterns, distance boundaries, and temporal time-drifts (e.g., matching a newly reported "orange tabby sighting" with a "missing ginger cat report" registered 150m away).
* **Mission Dispatch Launcher**: Coordinators can schedule urgent operations, log required gear lists (e.g., humane traps, wild wet bait, micro-lens trail cameras, thermal heat pads), and assign registered rescuers.
* **Active Volunteers Directory**: Tracks real-time availability, role levels (Coordinator, Volunteer, Rescuer), and active mission assignments.

### 5. AI Copilot Terminal Station (`RescueCopilotPage`)
* **Read-Only Database Query Hooks**: Interacts with live application states to instantly fetch and summarize critical incidents, detect unassigned operations, and extract historic sighting correlations.
* **Shift Change Handoff Generator**: Synthesizes today's active tactical changes, recent volunteer updates, and pending alerts into an elegant SITREP (Situation Report) markdown block for incoming rescue captains.
* **Human-in-the-Loop Safeguard**: Prevents unauthorized database alterations. Sensitive commands (e.g., "Assign Lily Potter to Mission Miso") are drafted by the copilot, prompting coordinators for manual signature verification before execution.

---

## 📌 AI Capabilities

> [!IMPORTANT]
> PurrSignal uses AI as an operational accelerator—not an autonomous decision-maker. Human verification remains central to matching, dispatch, and rescue decisions.

PurrSignal leverages the state-of-the-art `@google/genai` TypeScript SDK on the server side to power its intelligent analysis.

```
       [Public Upload] 
   (Image + Narrative Notes)
              │
              ▼
    ┌──────────────────┐
    │  server.ts API   │ ◄─── System Instructions (Vet Boundaries & Visual Uncertainty)
    └────────┬─────────┘
             │ (Google GenAI SDK)
             ▼
    ┌──────────────────┐
    │ gemini-3.5-flash │
    └────────┬─────────┘
             │ (Structured Output via responseSchema)
             ▼
    ┌──────────────────┐
    │ JSON Output Payload ◄─── (Coat Details, Urgency Levels, Action Recommendations)
    └──────────────────┘
```

### 1. Multimodal Forensic Image Analysis
When a photo is attached to an incident report, the backend transfers the raw base64 buffer directly to the `gemini-3.5-flash` model. The AI inspects the feline’s physical characteristics, analyzing:
* **Primary and Secondary Coat Colors** (e.g., Orange, White, Gray, Tuxedo).
* **Patterns** (Tabby, Solid, Tortoiseshell, Calico).
* **Visual Hallmarks** (ear notches indicating a spayed/neutered feral, collars, visible wounds).

### 2. Structured Outputs via Strict Schema Mapping
To guarantee that the frontend receives reliable data, we employ `responseMimeType: "application/json"` combined with a strict `responseSchema` definition. The JSON structure guarantees typing for parameters like `incidentType`, `urgency` (MUST be 'CRITICAL', 'HIGH', 'MEDIUM', or 'LOW'), and specific arrays for `urgencyReasons` and `uncertainties`.

### 3. Safety Compliance & Clinical Guardrails
As a responsible AI assistant, PurrSignal enforces rigid veterinary and visual boundaries in its system instructions:
1. **No Vet Diagnostics**: The AI is forbidden from diagnosing diseases or severe injuries. If a cat is injured, it flags the urgency but demands human inspection.
2. **Visual Uncertainty Acknowledgment**: The system enforces language such as *"may indicate"*, *"possible duplicate"*, or *"visual identification is never certain"* to prevent false ownership hopes.
3. **Emergency Redirection**: For immediate critical situations, it prompts coordinators to contact municipal emergency services.

---

## 📌 Tech Stack

<div align="center">

**Modern full-stack TypeScript architecture with server-side Gemini integration**

</div>


| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript 5.8 | High-fidelity interactive UI with strict compile-time safety. |
| **Styling** | Tailwind CSS v4 | Utility-first, responsive, beautiful typography (Inter / JetBrains Mono). |
| **Animations**| `motion` (Framer Motion) | Micro-interactions, slide drawers, story simulator step transitions. |
| **Backend** | Node.js, Express 4.21 | Server-side routing, API endpoints, static file serving. |
| **AI Engine** | `@google/genai` (Gemini 3.5 Flash) | Multimodal visual forensics, structured analysis, copilot queries. |
| **Icons** | `lucide-react` | Unified visual indicator library. |
| **Build System**| Vite 6, `esbuild`, `tsx` | Ultra-fast HMR-free development bundling, self-contained server compilation. |

---

## 📌 Project Structure

```
├── .env.example              # Sample configuration of environmental variables
├── .gitignore                # Production ignored build artifacts
├── index.html                # Main SPA entry point
├── metadata.json             # Applet descriptor containing permissions and capabilities
├── package.json              # Dependency declarations and build command scripts
├── server.ts                 # Express full-stack entry point & Gemini API endpoints
├── tsconfig.json             # TypeScript rules configuration
├── vite.config.ts            # Vite server and bundler integration plugins
└── src                       # Application Frontend Code
    ├── main.tsx              # React mounting root
    ├── index.css             # Global Tailwind stylesheets and font definitions
    ├── App.tsx               # Master router, page state machine, and navigation
    ├── types.ts              # Central database schemas, roles, and status enums
    ├── data.ts               # Seed database values and chronological demonstration logs
    ├── components            # Reusable UI Blocks
    │   ├── Logo.tsx          # High-fidelity SVG PurrSignal Brand Logo
    │   ├── ThreeDCat.tsx     # Stylized, interactive vector feline placeholder
    │   ├── MisoStorySimulator.tsx # interactive storyline simulation engine
    │   └── UI.tsx            # Alert boxes, forms, and custom toast indicators
    └── pages                 # Screen Layout components
        ├── LandingPage.tsx   # Platform landing board & metrics tickers
        ├── CrisisMapPage.tsx # Customized spatial SVG interactive tracking map
        ├── ReportIncidentPage.tsx # Geolocated form featuring Gemini multimodal uploads
        ├── MissionControlPage.tsx # Matching correlations engine and dispatches launcher
        ├── RescueCopilotPage.tsx  # Natural language analytics terminal & SITREP generator
        ├── GuardianPlanPage.tsx   # Emergency preparedness builder & printable pet flyers
        └── TrustSafetyPage.tsx    # Safety compliance resources and search protocols
```

---

## ⚡ Quick Start

```bash
git clone https://github.com/Jidnyasa-P/PurrSignal-An-AI-Crisis-Command-Center-for-Cats.git
cd PurrSignal-An-AI-Crisis-Command-Center-for-Cats
npm install
npm run dev
```

> Add your `GEMINI_API_KEY` to a local `.env` file before using Gemini-powered analysis features.

---

## 📌 Installation

Follow these steps to set up the development environment on your local system:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/purrsignal.git
   cd purrsignal
   ```

2. **Install Project Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and define the required keys (see the [Environment Variables](#environment-variables) section below).

4. **Verify Type-Safety and Linter**:
   ```bash
   npm run lint
   ```

---

## 📌 Environment Variables

Create a `.env` file in the root directory. Never commit secrets to your public source control.

```env
# Required: Google Gemini API Access Key
# Acquire your personal key from Google AI Studio (https://aistudio.google.com)
GEMINI_API_KEY="AIzaSyYourGeminiAPIKeyHere"

# Optional: Public Application URL Host (For redirection/redistribution logs)
APP_URL="http://localhost:3000"
```

---

## 📌 Running the Project

### Development Mode
Runs the TypeScript server using `tsx` on port `3000` with the Vite asset-routing middleware:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Launch
1. **Compile Static Assets and Bundle Server**:
   ```bash
   npm run build
   ```
   This command compiles the React assets into `dist/` and packages `server.ts` into a single, optimized, self-contained CommonJS file (`dist/server.cjs`) using `esbuild`.

2. **Execute the Server**:
   ```bash
   npm run start
   ```

---

## 📌 Application Workflow

<div align="center">

### 📥 Report → 📸 AI Analysis → ⚖️ Verify → 📋 Mission → 🏥 Rescue → 🏁 Reunite

</div>

The complete operational lifecycle of a pet recovery follows this workflow:

<img width="1682" height="367" alt="Screenshot 2026-07-07 135103" src="https://github.com/user-attachments/assets/da4bbcd6-36ce-4e5d-90ae-4b138ea875cb" />


1. **Incident Registration (Report)**:
   A community member uploads a photo and writes notes (e.g. *"Saw an orange cat hiding in my shed"*), marking coordinates on the map.
2. **AI Forensics (Multimodal Analysis)**:
   The backend proxies the image to Gemini. The model structures characteristic variables, calculates confidence values, evaluates immediate environmental urgency, and appends necessary veterinary safety disclaimers.
3. **Human Inspection (Verification)**:
   A Coordinator reviews the structured output on the Dashboard, verifies contact details, and validates the match compatibility score.
4. **Operation Dispatch (Mission Creation)**:
   The Coordinator schedules a rescue mission, registers necessary gear (e.g., Feral scent traps, wet bait, protective sheets), and assigns active on-call responders.
5. **Field Logistics (Rescue Ops)**:
   Field volunteers travel to the coordinates, set secure traps, log status reports via their tactical interfaces, and transport the feline to shelter resources.
6. **Reunification (Closeout)**:
   Owner matches are confirmed, microchip numbers are indexed, and handshakes are logged. The status is set to **REUNITED** and displayed on the public ticker.

---

## 📌 Security & Privacy

> [!NOTE]
> PurrSignal is designed around privacy-aware location handling, server-side API key protection, role-aware operations, and human verification for sensitive AI-assisted actions.


* **Server-Side Key Protection**: The application uses a strict server-to-server proxy architecture. The `GEMINI_API_KEY` is maintained entirely within backend memories and is never sent to the client browser.
* **Personally Identifiable Information (PII) Isolation**: Public report contact details (names, phone numbers) are restricted to registered coordinators.
* **Role-Based Workspaces**: Users select a profile persona at startup. Only certified Coordinators have clearance to trigger match approvals, dispatch missions, or sign off on AI copilot executions.
* **Sensing Boundaries**: Sighting locations are geocoded to park boundaries or alley coordinates to shield specific resident properties from crowdsourced trespass.

---

## 📌 Screenshots

<div align="center">

**Operational interfaces for mission coordination and spatial-temporal sighting intelligence**

</div>

### **Dashboard Screen**

<img width="1754" height="889" alt="Screenshot 2026-07-07 134637" src="https://github.com/user-attachments/assets/127850ee-36c4-477e-b8d5-e0b297ad5847" />

<img width="1909" height="866" alt="Screenshot 2026-07-07 134251" src="https://github.com/user-attachments/assets/a62e8c63-e8dd-4f64-a217-90b851d3b1c5" />

### **Crisis Tracking Map**

<img width="1911" height="864" alt="Screenshot 2026-07-07 134223" src="https://github.com/user-attachments/assets/7a37d932-f102-4228-98ed-64ee99a65ed4" />
<img width="1854" height="760" alt="Screenshot 2026-07-07 134601" src="https://github.com/user-attachments/assets/a43ed157-f509-41de-b535-16409b2175d5" />

### **AI Chat Support**

<img width="1910" height="871" alt="Screenshot 2026-07-07 134609" src="https://github.com/user-attachments/assets/64ff8b56-5a9e-4a42-92b3-2046a7a20a26" />

### **Emergency panel**

<img width="1890" height="877" alt="Screenshot 2026-07-07 134616" src="https://github.com/user-attachments/assets/3265bf51-e3f3-45a3-9980-35e555e8dd9b" />


---

## 📌 Future Enhancements

* **Real-time Live Chat Sockets**: Transition coordination terminals to active WebSockets to instantly stream volunteer locations.
* **Microchip Scanner integrations**: Allow mobile volunteers to append Bluetooth-scanned RFID chip data directly to incident feeds.
* **Weather Forecasting Hooks**: Connect with meteorological APIs to automatically raise incident threat levels if a trapped cat's coordinates overlap with expected freeze or heavy rain boundaries.

---

## 📌 Performance Considerations

* **Map Render Optimization**: Custom SVGs are fully reactive. Sighting dots, sequentially generated trails, and heatmaps are drawn within standard CPU margins, completely avoiding heavy Canvas re-initializations.
* **Zero HMR Interference**: Development servers execute with hot module replacement disabled by the platform, guaranteeing reliable, flicker-free state changes.
* **Bundled Server Package**: Using `esbuild` to compile our entire server into a unified `dist/server.cjs` reduces file I/O operations and speeds up cold-start times on virtual containers.

---

## 📌 Challenges Faced

1. **Structured JSON Validation**: Early prototypes suffered from occasional missing parameters when Gemini returned unstructured summaries. We solved this by implementing strict JSON Schemas mapped directly within the model config payload.
2. **Visual Clutter on Density Overlaps**: When multiple sightings occurred at the exact same location, pins overlapped. We introduced spatial offset Jitters and sequential step trails to isolate individual sighting paths cleanly.
3. **Map Pin Hover Instability**: During testing, hovering over pins caused them to vibrate due to scale transformations changing hover boundaries recursively. This was fixed by disabling aggressive hover scaling, maintaining stationary pin vectors, and using high-contrast outline borders for cursor feedback instead.

---

## 📌 Learnings

* **Multimodal Forensics is Transformational**: Using Gemini to extract characteristic coat patterns from blurry community photos proved significantly more accurate than relying on frantic text descriptions alone.
* **Human-in-the-Loop is Mandatory**: AI should act as an accelerator, not an absolute commander. Requiring manual coordinator approvals for dispatches keeps community trust intact and guards against dispatching teams to false alarms.

---

## 📌 Contributing

PurrSignal is an open-source project created to safeguard our neighborhood companions. We welcome contributions from animal advocates and developers:

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingRescue`).
3. Commit your Changes (`git commit -m 'Add support for live scent trap telemetry'`).
4. Push to the Branch (`git push origin feature/AmazingRescue`).
5. Open a Pull Request.

---

## 📌 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 📌 Acknowledgements

* **Google AI Studio** for equipping volunteers with cutting-edge Gemini Developer credits.
* **Unsplash** for high-quality animal photography and visual assets.
* **The open-source community** for the elegant Lucide React icon configurations.

---
<div align="center">

---

### 🐾 Report. Connect. Rescue. Reunite.

*Developed with love for cats everywhere. Keep signalling, keep saving.* 🐾

</div>

