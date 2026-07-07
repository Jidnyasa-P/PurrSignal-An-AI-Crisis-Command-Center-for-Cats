import React from 'react';
import { Shield, Eye, Lock, FileText, AlertTriangle, CheckSquare, HelpCircle } from 'lucide-react';

export const TrustSafetyPage: React.FC = () => {
  return (
    <div id="trust-safety-container" className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 bg-rose-500/10 text-rose-500 rounded-2xl border border-rose-500/20">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Trust, Safety & Privacy</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm font-mono">
            OPERATIONAL DATA HANDLING PROTOCOLS & PUBLIC DISCLOSURES
          </p>
        </div>

        {/* Policy Notice Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Lock className="w-5 h-5 text-rose-500" />
            Core Data Privacy Model
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            PurrSignal operates on a strict split-access information architecture. In feline search-and-rescue, disclosing precise GPS coordinates can expose vulnerable cats to animal hoarding, theft, interference, or predator threats, and reporter contact information must be kept private.
          </p>

          <div className="grid md:grid-cols-2 gap-6 pt-4">
            <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
              <h3 className="text-xs font-bold text-amber-500 font-mono uppercase tracking-wider mb-2">
                Approximate Public Location
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                General public sightings and missing maps show fuzzy, approximate locations. Coordinates are rounded to protect specific properties and keep the exact cat locations safe from external interference.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
              <h3 className="text-xs font-bold text-rose-500 font-mono uppercase tracking-wider mb-2">
                Exact Operations Location
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Only authenticated Coordinators and assigned Field Rescuers have access to precise GPS telemetry, specific backyard entry notes, and private gates/permission profiles.
              </p>
            </div>
          </div>
        </div>

        {/* Specific Disclosures Bento Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Collect */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="p-2 bg-sky-500/10 text-sky-500 rounded-lg w-max border border-sky-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold">What Data is Collected?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              We collect user-provided feline photos, descriptions, estimated condition notes, approximate street locations, and optional reporter contact names/phones to coordinate recovery with owners. No silent tracker scripts, ads, or telemetry cookies are stored.
            </p>
          </div>

          {/* Access */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg w-max border border-purple-500/20">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold">Who Can Access Contact Info?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Reporter phone numbers and ownership documents are heavily shielded. Only authorized Dispatch Coordinators can view or dial reporter contacts. Volunteers only receive relevant tactical access once active in the field.
            </p>
          </div>

          {/* AI Limits */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg w-max border border-amber-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold">AI Capabilities & Limitations</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Our Gemini API automatically structures text, recognizes coat patterns, and scores case urgency. However, AI cannot replace real-world checks. Visual matching has uncertainty (e.g. similar ginger coats) and the AI does not diagnose illnesses or veterinary states.
            </p>
          </div>

          {/* Human Pipeline */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg w-max border border-emerald-500/20">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold">Human-in-the-Loop Requirements</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              All high-urgency actions, potential match links, and field dispatches require manual review and confirmation by a human coordinator. No machine agents can trigger physical field traps or initiate citizen contact autonomously.
            </p>
          </div>

        </div>

        {/* Retention & Demo Info */}
        <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60 text-center space-y-2">
          <h3 className="text-sm font-bold flex items-center justify-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-rose-500" />
            Demonstration Mode & Local Retention Policy
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            This application is a proof-of-concept hackathon demonstration. All uploaded files, location markers, and custom incident updates are persisted purely inside your browser's local sandbox state (<code className="bg-slate-200 dark:bg-slate-950 px-1 py-0.5 rounded text-[10px]">localStorage</code>). No information is synchronized or stored on any persistent remote databases, and clearing your browser cache immediately cleans your session history.
          </p>
        </div>

      </div>
    </div>
  );
};
