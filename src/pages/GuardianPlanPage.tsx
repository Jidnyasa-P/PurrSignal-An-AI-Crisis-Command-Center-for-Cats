import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  User, 
  Cat, 
  Award, 
  CheckSquare, 
  Activity, 
  Camera, 
  ClipboardList, 
  Stethoscope 
} from 'lucide-react';

interface CatProfile {
  name: string;
  photoUrl: string;
  markings: string;
  microchipped: 'yes' | 'no' | 'unknown';
  microchipNumber: string;
  carrierInfo: string;
  behaviorNotes: string;
  medicationNotes: string;
  vetContact: string;
  caregiverContact: string;
}

interface ReadinessChecklist {
  carrierAccessible: boolean;
  photoStored: boolean;
  idCurrent: boolean;
  caregiverAssigned: boolean;
  evacPlanned: boolean;
  suppliesPrepared: boolean;
}

export const GuardianPlanPage: React.FC = () => {
  // Persistence state
  const [profile, setProfile] = useState<CatProfile>(() => {
    const saved = localStorage.getItem('purrsignal_guardian_profile');
    return saved ? JSON.parse(saved) : {
      name: '',
      photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80',
      markings: '',
      microchipped: 'no',
      microchipNumber: '',
      carrierInfo: '',
      behaviorNotes: '',
      medicationNotes: '',
      vetContact: '',
      caregiverContact: ''
    };
  });

  const [checklist, setChecklist] = useState<ReadinessChecklist>(() => {
    const saved = localStorage.getItem('purrsignal_guardian_checklist');
    return saved ? JSON.parse(saved) : {
      carrierAccessible: false,
      photoStored: false,
      idCurrent: false,
      caregiverAssigned: false,
      evacPlanned: false,
      suppliesPrepared: false
    };
  });

  const [activeTab, setActiveTab] = useState<'edit' | 'card'>('edit');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localstorage
  useEffect(() => {
    localStorage.setItem('purrsignal_guardian_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('purrsignal_guardian_checklist', JSON.stringify(checklist));
  }, [checklist]);

  // Calculate readiness score
  const getReadinessScore = () => {
    let score = 0;
    
    // Checklist items: 10% each (60% total)
    const checklistCount = Object.values(checklist).filter(Boolean).length;
    score += checklistCount * 10;

    // Profile details: 4% each (40% total)
    if (profile.name.trim()) score += 5;
    if (profile.markings.trim()) score += 5;
    if (profile.microchipped === 'yes' && profile.microchipNumber.trim()) score += 5;
    else if (profile.microchipped !== 'no') score += 5;
    if (profile.carrierInfo.trim()) score += 5;
    if (profile.behaviorNotes.trim()) score += 5;
    if (profile.medicationNotes.trim()) score += 5;
    if (profile.vetContact.trim()) score += 5;
    if (profile.caregiverContact.trim()) score += 5;

    return Math.min(score, 100);
  };

  const score = getReadinessScore();

  // Missing preparation items
  const getMissingItems = () => {
    const missing: Array<{ key: string; label: string; priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' }> = [];
    
    if (!checklist.carrierAccessible) {
      missing.push({ key: 'carrier', label: 'Locate & test cat carrier (must be easily accessible)', priority: 'CRITICAL' });
    }
    if (!checklist.photoStored) {
      missing.push({ key: 'photo', label: 'Store recent clear high-res photo of your cat', priority: 'CRITICAL' });
    }
    if (!profile.name.trim()) {
      missing.push({ key: 'name', label: 'Enter cat name in profile', priority: 'CRITICAL' });
    }
    if (!checklist.suppliesPrepared) {
      missing.push({ key: 'supplies', label: 'Pack emergency cat supplies (72h food, water, litter)', priority: 'HIGH' });
    }
    if (!profile.caregiverContact.trim() || !checklist.caregiverAssigned) {
      missing.push({ key: 'caregiver', label: 'Designate emergency caregiver contact', priority: 'HIGH' });
    }
    if (!checklist.evacPlanned) {
      missing.push({ key: 'evac', label: 'Plan feline-friendly evacuation destination', priority: 'MEDIUM' });
    }
    if (profile.microchipped === 'yes' && !profile.microchipNumber.trim()) {
      missing.push({ key: 'microchip', label: 'Provide microchip identification number', priority: 'MEDIUM' });
    }
    if (!checklist.idCurrent) {
      missing.push({ key: 'id', label: 'Ensure physical collar IDs are current & legible', priority: 'MEDIUM' });
    }

    return missing;
  };

  const missingItems = getMissingItems();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="guardian-plan-container" className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-full text-xs font-semibold uppercase tracking-wider font-mono">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              Guardian Emergency Readiness Plan
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Prepare Before the Crisis</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl font-mono uppercase">
              Feline emergency kits, safety checklists, and secure operations wallets
            </p>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              id="gp-tab-edit"
              onClick={() => setActiveTab('edit')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'edit' ? 'bg-white dark:bg-slate-800 shadow text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'}`}
            >
              Build Plan
            </button>
            <button
              id="gp-tab-card"
              onClick={() => setActiveTab('card')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'card' ? 'bg-white dark:bg-slate-800 shadow text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'}`}
            >
              <Printer className="w-3.5 h-3.5" />
              Printable Card
            </button>
          </div>
        </div>

        {/* Dynamic Readiness Score Visualization & Completion State */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col lg:flex-row items-center gap-8">
          {/* Circular progress or beautiful bar */}
          <div className="relative flex flex-col items-center justify-center flex-shrink-0 w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="10" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" className="text-amber-500 transition-all duration-500" strokeWidth="10" strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`} strokeLinecap="round" />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold font-mono text-amber-500">{score}%</span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400">Ready</span>
            </div>
          </div>

          <div className="flex-1 space-y-4 text-center lg:text-left">
            <h3 className="text-lg font-bold">Emergency Preparedness Diagnosis</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
              Felines are skittish in emergencies. Having a carrier ready, recent photos stored, and emergency contacts aligned increases successful recovery speeds by 400% during natural disasters or missing escapes.
            </p>

            {/* Completion Badge */}
            {score === 100 ? (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-2xl text-xs font-bold"
              >
                <Award className="w-4 h-4 text-emerald-500 animate-bounce" />
                <span>SAFE FELINE COOP DESIGNATION: fully prepared! 🏆</span>
              </motion.div>
            ) : (
              <div className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold uppercase flex items-center justify-center lg:justify-start gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{missingItems.length} critical actions remaining</span>
              </div>
            )}
          </div>
        </div>

        {activeTab === 'edit' ? (
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* LEFT PROFILE BUILDER FORM (7 cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
              
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Cat className="w-5 h-5 text-amber-500" />
                  1. Cat Profile Information
                </h2>
                <p className="text-xs text-slate-500 mt-1">This critical data will automatically format onto your printable emergency card.</p>
              </div>

              {/* Form elements */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-mono text-slate-500 dark:text-slate-400 uppercase">Cat Name *</label>
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Miso"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-mono text-slate-500 dark:text-slate-400 uppercase">Identifying Markings *</label>
                  <input
                    type="text"
                    required
                    value={profile.markings}
                    onChange={(e) => setProfile(prev => ({ ...prev, markings: e.target.value }))}
                    placeholder="e.g. swirly ginger stripes, tiny nose freckle"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-mono text-slate-500 dark:text-slate-400 uppercase">Microchipped? *</label>
                  <select
                    value={profile.microchipped}
                    onChange={(e) => setProfile(prev => ({ ...prev, microchipped: e.target.value as any }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  >
                    <option value="no">No / Not registered</option>
                    <option value="yes">Yes (Registered)</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>

                {profile.microchipped === 'yes' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold font-mono text-slate-500 dark:text-slate-400 uppercase">Microchip Number</label>
                    <input
                      type="text"
                      value={profile.microchipNumber}
                      onChange={(e) => setProfile(prev => ({ ...prev, microchipNumber: e.target.value }))}
                      placeholder="e.g. 985112000213002"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                  </div>
                )}

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold font-mono text-slate-500 dark:text-slate-400 uppercase">Carrier Information</label>
                  <input
                    type="text"
                    value={profile.carrierInfo}
                    onChange={(e) => setProfile(prev => ({ ...prev, carrierInfo: e.target.value }))}
                    placeholder="e.g. Red plastic hard-shell carrier on top shelf of coat closet"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold font-mono text-slate-500 dark:text-slate-400 uppercase">Cat Behavior Notes (When Panicked)</label>
                  <textarea
                    value={profile.behaviorNotes}
                    onChange={(e) => setProfile(prev => ({ ...prev, behaviorNotes: e.target.value }))}
                    placeholder="e.g. Will bolt and squeeze behind water heaters or inside car engines. Do not call loudly. Best lured with visual laser pointers or shaking treat bags."
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold font-mono text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                      <Stethoscope className="w-3.5 h-3.5 text-rose-500" />
                      Medications & Care Instructions
                    </label>
                    <span className="text-[10px] text-rose-500 font-bold uppercase font-mono">Owner-Entered Notes Only</span>
                  </div>
                  <textarea
                    value={profile.medicationNotes}
                    onChange={(e) => setProfile(prev => ({ ...prev, medicationNotes: e.target.value }))}
                    placeholder="e.g. Needs daily thyroid medication (5mg Methimazole) crushed in wet food. Allergy: Sensitive stomach to chicken."
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <div className="p-2.5 bg-rose-500/5 border border-rose-500/10 rounded-xl text-[10px] text-rose-500 leading-relaxed font-semibold">
                    ⚠️ MEDICAL DISCLAIMER: PurrSignal does not provide veterinarian diagnosis, professional triage, or pharmaceutical instruction. Consult your authorized licensed veterinarian for real medical needs.
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-mono text-slate-500 dark:text-slate-400 uppercase">Preferred Veterinarian Contact</label>
                  <input
                    type="text"
                    value={profile.vetContact}
                    onChange={(e) => setProfile(prev => ({ ...prev, vetContact: e.target.value }))}
                    placeholder="e.g. Mission Pet Hospital, Dr. Green: (555) 901-0024"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-mono text-slate-500 dark:text-slate-400 uppercase">Emergency Caregiver Contact</label>
                  <input
                    type="text"
                    value={profile.caregiverContact}
                    onChange={(e) => setProfile(prev => ({ ...prev, caregiverContact: e.target.value }))}
                    placeholder="e.g. John Jennings (Brother): (555) 124-9041"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>
              </div>

            </div>

            {/* RIGHT CHECKLIST PANEL (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Emergency Readiness Checklist Box */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-amber-500" />
                    2. Emergency Readiness
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Toggle readiness factors based on your actual prep actions.</p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl transition-colors">
                    <input
                      type="checkbox"
                      checked={checklist.carrierAccessible}
                      onChange={(e) => setChecklist(prev => ({ ...prev, carrierAccessible: e.target.checked }))}
                      className="mt-1 w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                    />
                    <div>
                      <div className="text-xs font-bold">Cat Carrier is Accessible</div>
                      <div className="text-[10px] text-slate-500">Must be immediately accessible, not locked in deep garage storage.</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl transition-colors">
                    <input
                      type="checkbox"
                      checked={checklist.photoStored}
                      onChange={(e) => setChecklist(prev => ({ ...prev, photoStored: e.target.checked }))}
                      className="mt-1 w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                    />
                    <div>
                      <div className="text-xs font-bold">Recent Photo Stored</div>
                      <div className="text-[10px] text-slate-500">Have a clear, profile picture showing markings & collar color on your phone.</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl transition-colors">
                    <input
                      type="checkbox"
                      checked={checklist.idCurrent}
                      onChange={(e) => setChecklist(prev => ({ ...prev, idCurrent: e.target.checked }))}
                      className="mt-1 w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                    />
                    <div>
                      <div className="text-xs font-bold">Physical ID tags Current</div>
                      <div className="text-[10px] text-slate-500">Phone number on collar or tag is correct and readable.</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl transition-colors">
                    <input
                      type="checkbox"
                      checked={checklist.caregiverAssigned}
                      onChange={(e) => setChecklist(prev => ({ ...prev, caregiverAssigned: e.target.checked }))}
                      className="mt-1 w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                    />
                    <div>
                      <div className="text-xs font-bold">Caregiver Assigned</div>
                      <div className="text-[10px] text-slate-500">Designated friend or relative knows they are the feline recovery standby.</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl transition-colors">
                    <input
                      type="checkbox"
                      checked={checklist.evacPlanned}
                      onChange={(e) => setChecklist(prev => ({ ...prev, evacPlanned: e.target.checked }))}
                      className="mt-1 w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                    />
                    <div>
                      <div className="text-xs font-bold">Evacuation Destination Planned</div>
                      <div className="text-[10px] text-slate-500">Identify pet-friendly hotels or shelters outside your immediate district.</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl transition-colors">
                    <input
                      type="checkbox"
                      checked={checklist.suppliesPrepared}
                      onChange={(e) => setChecklist(prev => ({ ...prev, suppliesPrepared: e.target.checked }))}
                      className="mt-1 w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                    />
                    <div>
                      <div className="text-xs font-bold">Supplies Packaged</div>
                      <div className="text-[10px] text-slate-500">Keep 72 hours of dry/wet food, manual opener, and bottle water in a bag.</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Prioritized Preparation Checklist Banner */}
              <div className="bg-slate-950 text-slate-100 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 font-mono">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest">
                  <ClipboardList className="w-4 h-4" />
                  Prioritized Prep Checklist
                </div>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {missingItems.length === 0 ? (
                    <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      All readiness parameters fully met! Perfect state.
                    </div>
                  ) : (
                    missingItems.map((item, idx) => (
                      <div key={item.key} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold flex-shrink-0 mt-0.5 ${
                          item.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          item.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {item.priority}
                        </span>
                        <span className="text-[10px] text-slate-300 font-sans leading-tight">{idx + 1}. {item.label}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* PRINTABLE EMERGENCY CARD VIEW */
          <div className="flex flex-col items-center justify-center space-y-8 py-4">
            
            <div className="text-center max-w-xl space-y-2">
              <h2 className="text-xl font-bold">Feline Emergency Guardian Card</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Print this optimized reference card. Fold it and place it in your wallet or tape it to your cat carrier so that emergency first responders or foster volunteers know exactly how to manage your cat.
              </p>
              <button
                id="gp-btn-print"
                onClick={handlePrint}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow border border-slate-700 mx-auto"
              >
                <Printer className="w-4 h-4" />
                Trigger Print Layout
              </button>
            </div>

            {/* THE CARD EMBEDDED BLOCK (Aesthetically printed) */}
            <div 
              id="printable-emergency-card"
              className="w-full max-w-md bg-white text-slate-950 p-6 border-4 border-double border-slate-900 rounded-2xl shadow-xl space-y-5 relative font-sans print:border-slate-950 print:shadow-none"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-rose-600 rounded-lg text-white">
                    <Cat className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wide">Emergency Cat ID</h3>
                    <p className="text-[9px] text-slate-500 font-mono">PURRSIGNAL GUARDIAN WALLET</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-300 text-[8px] font-bold rounded-full uppercase">
                    Safety Critical
                  </span>
                </div>
              </div>

              {/* Photo & Basic stats */}
              <div className="flex gap-4 items-start">
                <img 
                  src={profile.photoUrl}
                  alt={profile.name || 'Cat photo'}
                  className="w-20 h-20 rounded-lg object-cover border border-slate-200 bg-slate-100 flex-shrink-0"
                />
                <div className="space-y-1.5 flex-1 min-w-0 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Feline Name:</span>
                    <span className="font-extrabold text-sm">{profile.name || 'UNSPECIFIED'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Physical Markings:</span>
                    <span className="font-medium text-slate-700 leading-tight block">{profile.markings || 'None described'}</span>
                  </div>
                </div>
              </div>

              {/* Profile Details Grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-200 pt-3 text-[10px] text-slate-800">
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[8px] block">Microchip:</span>
                  <span className="font-semibold">{profile.microchipped === 'yes' ? profile.microchipNumber || 'Yes (No num)' : 'No / None'}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[8px] block">Carrier Location:</span>
                  <span className="font-semibold truncate block">{profile.carrierInfo || 'Not specified'}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[8px] block">Emergency Caregiver:</span>
                  <span className="font-semibold block">{profile.caregiverContact || 'Not assigned'}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[8px] block">Preferred Veterinarian:</span>
                  <span className="font-semibold block">{profile.vetContact || 'Not specified'}</span>
                </div>
              </div>

              {/* Medication and Behavior Section */}
              <div className="space-y-2 border-t border-slate-200 pt-3 text-[10px]">
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[8px] block">Behavior Notes (Panicked):</span>
                  <p className="text-slate-600 leading-relaxed italic">{profile.behaviorNotes || 'Standard feline response notes apply.'}</p>
                </div>
                
                {profile.medicationNotes.trim() && (
                  <div className="p-2 bg-rose-50 border border-rose-100 rounded-lg">
                    <span className="font-bold text-rose-700 uppercase text-[8px] block">Owner Medication Notes:</span>
                    <p className="text-rose-950 font-medium leading-tight">{profile.medicationNotes}</p>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="border-t border-slate-200 pt-2.5 text-center text-[7.5px] text-slate-400 leading-tight">
                This document is a citizen preparedness tool from the PurrSignal Net. <br/>
                Verify coordinates and rescue instructions under human verification protocols.
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
