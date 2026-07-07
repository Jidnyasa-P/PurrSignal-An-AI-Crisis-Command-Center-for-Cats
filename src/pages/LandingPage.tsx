import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  Activity, 
  Eye, 
  Compass, 
  Heart, 
  Users, 
  ArrowRight,
  Cat
} from 'lucide-react';
import { ThreeDCat } from '../components/ThreeDCat';
import { Logo } from '../components/Logo';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onNavigateToIncident?: (id: string) => void;
  activeMissionsCount: number;
  unresolvedIncidentsCount: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onNavigate, 
  activeMissionsCount, 
  unresolvedIncidentsCount 
}) => {
  return (
    <div id="landing-container" className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-slate-200/60 dark:border-slate-900/60 bg-white dark:bg-slate-900">
        {/* Subtle grid pattern or signal wave decoration */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02] bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:16px_1px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              {/* Emergency indicator pulse badge with custom beautiful logo */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/50 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 rounded-full text-xs font-semibold uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <span>Feline Crisis Dispatch Active</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                When cats are in danger, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-rose-600 dark:from-amber-400 dark:to-rose-500">
                  every signal matters.
                </span>
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                PurrSignal is an AI-assisted crisis coordination platform. We turn fragmented public sightings, missing reports, and emergency messages into structured, prioritized, and coordinated rescue missions.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  id="landing-btn-report"
                  onClick={() => onNavigate('report')}
                  className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-500/10 hover:shadow-rose-500/20 transition-all flex items-center justify-center gap-2 group hover:-translate-y-0.5"
                >
                  <ShieldAlert className="w-5 h-5" />
                  Report Feline Emergency
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  id="landing-btn-control"
                  onClick={() => onNavigate('dashboard')}
                  className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                >
                  <Activity className="w-5 h-5 text-amber-500" />
                  Mission Control Board
                </button>
              </div>

              {/* Trust Indicators / Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-100 dark:border-slate-800">
                <div id="stat-incidents">
                  <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{unresolvedIncidentsCount}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Open Incidents</div>
                </div>
                <div id="stat-missions">
                  <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">{activeMissionsCount}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Active Missions</div>
                </div>
                <div id="stat-reunited">
                  <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">342</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Cats Reunited</div>
                </div>
              </div>

            </div>

            {/* ILLUSTRATIVE SIDE - featuring 3D Cat and live telemetry */}
            <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
              {/* Giant floating 3D Cat Centerpiece */}
              <div className="relative z-20 -mb-10 hover:translate-y-[-8px] transition-transform duration-300">
                <ThreeDCat size="xl" interactive={true} />
                <div className="absolute -bottom-2 bg-gradient-to-r from-amber-500/20 to-rose-500/20 px-3 py-1 rounded-full border border-amber-500/20 text-[10px] font-mono text-amber-500 backdrop-blur-sm animate-pulse flex items-center gap-1.5 mx-auto left-0 right-0 w-max">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Hover to Interact in 3D 🐾
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                {/* Back decorative glowing blobs */}
                <div className="absolute -top-12 -left-12 w-64 h-64 bg-amber-500/10 dark:bg-amber-400/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-rose-500/10 dark:bg-rose-400/5 rounded-full blur-3xl" />
                
                {/* Visual Dashboard Card Mockup */}
                <div className="relative bg-slate-950 text-slate-100 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 pt-12">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
                      <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-400">Live Telemetry Terminal</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">SYS-9041</span>
                  </div>

                  {/* Mock telemetry lines */}
                  <div className="font-mono text-xs space-y-3">
                    <div className="flex items-start gap-2 text-slate-400">
                      <span className="text-amber-500">[02:14:15]</span>
                      <p>Sighting reported: Gray tabby limping in warehouse alley, 5th Ave.</p>
                    </div>
                    <div className="flex items-start gap-2 text-purple-400">
                      <span className="text-purple-500">[02:14:17]</span>
                      <p>AI Structuring complete: Severity HIGH. Access barriers identified.</p>
                    </div>
                    <div className="flex items-start gap-2 text-sky-400">
                      <span className="text-sky-500">[02:15:01]</span>
                      <p>Coordinator Elena verified address. Contacted manager.</p>
                    </div>
                    <div className="flex items-start gap-2 text-rose-400 font-bold">
                      <span className="text-rose-500">[02:15:20]</span>
                      <p>Mission created: DISPATCHING field rescue unit (Jack/Cooper).</p>
                    </div>
                  </div>

                  {/* Mini floating graphic displaying emergency radar */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400 border border-rose-500/20">
                        <Cat className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold">Rescue Radar Active</div>
                        <div className="text-[10px] text-slate-500">Scanning local neighborhood nodes</div>
                      </div>
                    </div>
                    <button
                      id="landing-btn-scan"
                      onClick={() => onNavigate('map')}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-amber-400 border border-slate-700 rounded font-semibold transition-colors"
                    >
                      Scan Map
                    </button>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* THREE FOCUS PANELS */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 dark:text-white mb-12">
          Coordinated Rescues, Powered by Collective Intelligence
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Card 1: Public Reporting */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center mb-5 border border-rose-100 dark:border-rose-900/50">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Public Sighting & Report</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Found a stray, injured, or trapped cat? Submit photos, location coordinates, or describe what you see. No account required—speed is everything when a life is on the line.
              </p>
            </div>
            <button
              id="panel-btn-report"
              onClick={() => onNavigate('report')}
              className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-rose-600 dark:text-rose-400 hover:underline hover:gap-1.5 transition-all"
            >
              Submit an Incident Report
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Mission Control */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center mb-5 border border-amber-100 dark:border-amber-900/50">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Coordinator Dashboard</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                View real-time crisis feeds, edit structural records, prioritize cases via computed risk, organize equipment lists, and assign active field responders to tactical missions.
              </p>
            </div>
            <button
              id="panel-btn-control"
              onClick={() => onNavigate('dashboard')}
              className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-amber-600 dark:text-amber-400 hover:underline hover:gap-1.5 transition-all"
            >
              Access Mission Control
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: AI Copilot */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-5 border border-purple-100 dark:border-purple-900/50">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Rescue AI Copilot</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Need tactical advice, structured summary drafting, or message templates for landowners? Consult our Feline Emergency Copilot for instant operational support.
              </p>
            </div>
            <button
              id="panel-btn-copilot"
              onClick={() => onNavigate('copilot')}
              className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-purple-600 dark:text-purple-400 hover:underline hover:gap-1.5 transition-all"
            >
              Consult Copilot Terminal
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* STEP-BY-STEP FLOW VISUALIZER */}
      <section className="py-16 bg-slate-100 dark:bg-slate-900/60 border-y border-slate-200/50 dark:border-slate-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
              The Rescue Pipeline
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              How fragmented incident data transforms into a completed feline recovery mission
            </p>
          </div>

          {/* Timeline steps */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-6 relative">
            
            {/* Step 1 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/30 shadow-sm relative">
              <div className="absolute -top-3 left-4 bg-slate-900 dark:bg-slate-800 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">01 REPORT</div>
              <h4 className="text-sm font-bold mt-2">Sighting filed</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">A citizen snaps a photo or types a messy message regarding a stray cat.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/30 shadow-sm relative">
              <div className="absolute -top-3 left-4 bg-purple-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">02 STRUCTURING</div>
              <h4 className="text-sm font-bold mt-2 font-semibold">AI cleans data</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Our system parses location, breed details, collar, and medical condition automatically.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/30 shadow-sm relative">
              <div className="absolute -top-3 left-4 bg-blue-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">03 VERIFY</div>
              <h4 className="text-sm font-bold mt-2">Staff Confirmation</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Coordinators verify physical addresses and secure permission if on private property.</p>
            </div>

            {/* Step 4 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/30 shadow-sm relative">
              <div className="absolute -top-3 left-4 bg-amber-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">04 PRIORITIZE</div>
              <h4 className="text-sm font-bold mt-2">Triage Risk Score</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">System evaluates local threats (weather alerts, predators, injury status).</p>
            </div>

            {/* Step 5 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/30 shadow-sm relative">
              <div className="absolute -top-3 left-4 bg-rose-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">05 DISPATCH</div>
              <h4 className="text-sm font-bold mt-2">Active Rescue</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Missions are created. Equipment and traps are prepared, and field squads arrive.</p>
            </div>

            {/* Step 6 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/30 shadow-sm relative">
              <div className="absolute -top-3 left-4 bg-emerald-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">06 REUNITE</div>
              <h4 className="text-sm font-bold mt-2">Fostered & Safe</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Felines receive medical care, shelter, microchip matches, or return to owners.</p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
