# 🐾 PurrSignal ──────────────────────────────────────────

```text
    _._     _,-'""`-._
   (,-.`._,'(       |\`-/|     ⚡ PURRSIGNAL TELEMETRY SYSTEM v2.5
       `-.-' \ )-`( , o o)     ⚡ EMERGENCY LOCATOR & RESCUE CO-PILOT
             `-    \`_`"'-     ⚡ CAT REUNIFICATION COMMAND NETWORK
```

> **Direct, structured, intelligence-driven emergency dispatch networks for feline rescue. Bridging community sightings with professional rescue operations using Gemini-powered forensics.**

---

### 🌐 Live Platform Access
* **Development Command Bridge**: [Launch Platform](https://ais-dev-e6cfv5rpsbtpgz4nrru4qk-461622340415.asia-southeast1.run.app)
* **Production Sandbox**: [View Shared Portal](https://ais-pre-e6cfv5rpsbtpgz4nrru4qk-461622340415.asia-southeast1.run.app)

---

## 📌 Problem Statement

Feline emergency and rescue reporting is plagued by chaotic, fragmented data streams. When natural disasters strike or household pets escape, sighting data accumulates across fractured channels—unorganized Facebook threads, neighborhood Nextdoor posts, localized SMS boards, and messy emails.

* **Forensic Decay**: Crucial details like coat patterns, visual ear-notches (indicating TNR status), collars, and medical conditions are omitted by anxious reporters.
* **Operational Blindness**: Rescue coordinators cannot easily distinguish between a comfortable stray and a cat in critical danger (e.g., an injured cat trapped in a rising storm drain).
* **Disconnected Chronology**: Sightings of the same animal are logged as isolated events, hiding migratory movement vectors.
* **Volunteer Fatigue**: Shift transitions and coordinator handoffs consume hours of manual collation rather than tactical field deployment.

---

## 📌 The PurrSignal Protocol

PurrSignal organizes chaotic emergency indicators into structured, prioritized, and actionable operational dispatches. It standardizes the workflow from first sighting to final safety handshake.

```
       [Community Report] ──► (BLURRY PHOTO + TEXT)
                                     │
                                     ▼
                      ┌─────────────────────────────┐
                      │    Gemini Visual Core       │
                      │  * Extracts Coat Analytics  │
                      │  * Evaluates Urgency Levels │
                      │  * Appends Vet Safeguards   │
                      └──────────────┬──────────────┘
                                     │
                                     ▼
                     ┌──────────────────────────────┐
                     │  Mission Control Center      │
                     │  * Calculates Compatibility  │
                     │  * Draws Sequential Trails   │
                     │  * Generates SITREPs         │
                     └──────────────┬──────────────┘
                                     │
                                     ▼
                             [CAT REUNIFIED] 🐾
```

---

## 📌 Features in Detail

### 1. 🗺️ Custom Spatial Crisis Map
An interactive vector-driven tracking grid crafted directly with reactive SVG stages:
* **Sequential Sighting Trails**: Motion-mapped vectors connect multiple sightings chronologically ($S_1 \rightarrow S_2 \rightarrow S_3$), plotting vector heading lines to anticipate movement.
* **Interactive Map Toggles**: Instantly filter map layers to show Traps set, Active Patrols, Sighting Hotspots, or Missing Reports.
* **Dynamic Geocoding Jitter**: Seamless double-click-to-pin mapping with built-in location privacy boundaries.

### 2. 📝 Forensic Incident Form
A dual-channel intake portal for the public and rescue professionals:
* **Multimodal Uploads**: Accepts community-submitted photos directly alongside narrative field notes.
* **Real-time Geo-locators**: Pins coordinates to municipal safety corridors, protecting residential addresses while preserving spatial accuracy.

### 3. 🖥️ Mission Control & Matching Engine
A unified operations command terminal for rescue captains:
* **Correlation Scorer**: Evaluates proximity, time delta, and phenotypic features (e.g., "Tabby", "Tuxedo", "Calico") to auto-suggest matches.
* **Tactical Dispatcher**: Prepares active mission folders containing required toolsets (e.g., wildlife cameras, scent baits, safe traps) and assigns certified on-call field rescuers.

### 4. 💬 AI Copilot Terminal
An interactive workspace supporting instant natural-language interrogation:
* **System SITREP Generator**: Formulates professional, comprehensive markdown briefings of today's status metrics, pending updates, and active alerts for shift-change logs.
* **Human-in-the-Loop Actions**: Safety safeguards prevent the copilot from executing data-mutating operations without explicit manual coordinator confirmation.

### 5. 🏡 Guardian Plan & Resource Center
Empowers the community with actionable preparedness tools:
* **Interactive Flyer Builder**: Instantly generates beautiful missing cat posters with a dynamic printable preview.
* **Trapping Guides**: Structured, step-by-step instructions for baiting, safety handling, and veterinary protocols.

---

## 📌 AI System Architecture

PurrSignal leverages the official `@google/genai` TypeScript SDK on the server side to handle forensic inputs securely.

```text
   +-----------------------+              +------------------------+
   |   Narrative Notes     |              |     Blurry Photo       |
   +-----------+-----------+              +-----------+------------+
               |                                      |
               +------------------+-------------------+
                                  |
                                  ▼
                     +──────────────────────────+
                     |    server.ts POST Route  |
                     +────────────+─────────────+
                                  | (Google GenAI SDK)
                                  ▼
                     +──────────────────────────+
                     |    gemini-3.5-flash      |
                     +────────────+─────────────+
                                  | (System Instructions & Structured Schema)
                                  ▼
                     +──────────────────────────+
                     |  Structured Output JSON  |
                     +──────────────────────────+
```

### 🛡️ Guardrails & Safety Parameters
Our system instructions enforce high-fidelity safety standards:
1. **Clinical Non-Diagnosis**: The AI is forbidden from making diagnostic assessments. Visible physical issues trigger high-urgency flags but require human professional examination.
2. **Visual Uncertainty**: The model always qualifies matches using soft phrases (*"visual analysis indicates possible duplicate"*, *"subject to visual degradation"*) to keep expectations grounded.
3. **Emergency Redirection**: Critical non-animal risks are flagged for immediate redirection to city fire/medical services.

---

## 📌 Tech Stack

```text
  FRONTEND           BACKEND / RUNTIME      AI SERVICE         MAPS & GEODATA
  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
  │  React 19      │ │  Node.js       │ │  Gemini 3.5    │ │  Interactive   │
  │  TypeScript 5  │ │  Express 4.21  │ │  GenAI SDK     │ │  Reactive SVG  │
  │  Tailwind CSS  │ │  esbuild       │ │  Structured    │ │  Sequential    │
  │  motion        │ │  tsx           │ │  JSON Schemas  │ │  Path Trails   │
  └────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘
```

---

## 📌 Project Directory Structure

```text
├── .env.example              # Environment variables template
├── .gitignore                # Production ignore listing
├── index.html                # Single-page application mounting page
├── metadata.json             # AI Studio platform capabilities configuration
├── package.json              # Build scripts and dependency configurations
├── server.ts                 # Express full-stack backend & Google GenAI router
├── tsconfig.json             # TypeScript compiler constraints
├── vite.config.ts            # Vite asset pipeline configuration
└── src                       # Source Code
    ├── main.tsx              # React mounting file
    ├── index.css             # Unified tailwind rules and elegant font importing
    ├── App.tsx               # Master router and active page state controller
    ├── types.ts              # Core TypeScript interfaces & incident metrics
    ├── data.ts               # Chronological seed data, historic match cases, logs
    ├── components            # Reusable UI Blocks
    │   ├── Logo.tsx          # High-fidelity SVG logo with interactive heart accents
    │   ├── ThreeDCat.tsx     # Custom vector feline loader
    │   ├── MisoStorySimulator.tsx  # Dynamic rescue storyline emulator
    │   └── UI.tsx            # Floating toast messages and notification bars
    └── pages                 # Primary Page Layouts
        ├── LandingPage.tsx   # Portal overview & dynamic metrics ticking metrics
        ├── CrisisMapPage.tsx # Location tracking map, heatmap grids, sequential trails
        ├── ReportIncidentPage.tsx # Geolocated form & Gemini visual forensic handler
        ├── MissionControlPage.tsx # Match correlation engine & tactical dispatches
        ├── RescueCopilotPage.tsx  # Natural language terminal and SITREP generator
        ├── GuardianPlanPage.tsx   # Flyer designer and community resources
        └── TrustSafetyPage.tsx    # Incident protocols, TNR guides, safety bounds
```

---

## 📌 Installation & Execution

### 1. Clone the Codebase
```bash
git clone https://github.com/your-username/purrsignal.git
cd purrsignal
```

### 2. Install Package Dependencies
```bash
npm install
```

### 3. Establish Local Environment Variables
Create a `.env` file in the root directory:
```env
# Acquire your API key from Google AI Studio (https://aistudio.google.com)
GEMINI_API_KEY="AIzaSyYourGeminiAPIKeyHere"
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your local browser.

### 5. Build for Production Container Deployment
```bash
# Compiles React assets and bundles the Express server with esbuild
npm run build

# Runs the compiled bundle (dist/server.cjs)
npm run start
```

---

## 📌 The Recovery Lifecycle

```text
[1. REPORT] ──────────────────► [2. FORENSICS] ───────────────► [3. VERIFY]
A resident submits photo        Gemini inspects pattern,        Coordinator approves
and registers coordinates       urgency, and tags hallmarks     compatibility match
                                                                       │
                                                                       ▼
[6. REUNITED] 🐾 ◄────────────── [5. FIELD OPS] ◄────────────── [4. DISPATCH]
Lost cat scan checks out,       Rescuers set scent traps,       Captain schedules
handshakes logged to terminal   track sequential path trails    gear lists & volunteers
```

---

## 📌 Challenges & Technical Triumphs

1. **Structured Object Formatting**:
   * *Challenge*: Initial responses from raw prompts yielded loose, unstructured text blocks that caused JSON parsing crashes on the frontend.
   * *Resolution*: We implemented strict JSON schemas using `responseMimeType: "application/json"` mapped to the `responseSchema` configuration options within the Gemini API configuration structure.
2. **Stable Pin Interactivity**:
   * *Challenge*: On-hover scale transformations triggered boundary shifts that caused target map pins to vibrate during mouseover events.
   * *Resolution*: We decoupled spatial interaction layers from physics hover containers, replacing scaling with steady high-contrast outlining to allow precise clicking.
3. **Privacy Compliance on Crowdsourcing**:
   * *Challenge*: Logging precise home addresses endangered pet owners and risked public trespassing on private property during active searches.
   * *Resolution*: Created precise geocoding offsets that align pin clusters with municipal greenbelts and public access alleys, keeping coordinate search grids secure.

---
*Developed with love for cats everywhere. Keep signalling, keep saving.* 🐾
