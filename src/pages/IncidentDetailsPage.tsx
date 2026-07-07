import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Clock, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ShieldAlert, 
  Compass, 
  Activity, 
  Eye, 
  Heart, 
  Award, 
  MessageSquare,
  ChevronRight,
  Cat
} from 'lucide-react';
import { Incident, IncidentStatus, IncidentUpdate } from '../types';
import { StatusBadge, UrgencyIndicator, ConfirmationDialog } from '../components/UI';

interface IncidentDetailsPageProps {
  incidentId: string;
  incidents: Incident[];
  onBack: () => void;
  onUpdateStatus: (id: string, status: IncidentStatus) => void;
  onAddUpdate: (id: string, update: Omit<IncidentUpdate, 'id' | 'timestamp'>) => void;
  onLaunchMissionForIncident?: (incident: Incident) => void;
}

export const IncidentDetailsPage: React.FC<IncidentDetailsPageProps> = ({
  incidentId,
  incidents,
  onBack,
  onUpdateStatus,
  onAddUpdate,
  onLaunchMissionForIncident
}) => {
  const incident = incidents.find(i => i.id === incidentId);

  // Status transition buttons config
  const [newLogMsg, setNewLogMsg] = useState('');
  const [logAuthor, setLogAuthor] = useState('Coordinator Elena');
  
  // Custom states for alerts
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<IncidentStatus | null>(null);

  if (!incident) {
    return (
      <div id="not-found-container" className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Cat className="w-16 h-16 text-slate-400 mx-auto mb-4 stroke-1" />
        <h3 className="text-xl font-bold">Incident Record Not Found</h3>
        <p className="text-slate-500 mt-2">The requested incident ID does not exist in the secure network database.</p>
        <button
          id="btn-back-home"
          onClick={onBack}
          className="mt-6 px-4 py-2 bg-slate-800 text-slate-100 rounded-lg hover:bg-slate-700 font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Linear Pipeline Steps representation
  const pipelineSteps: Array<{ status: IncidentStatus; label: string; icon: any; color: string }> = [
    { status: 'reported', label: 'Reported', icon: Clock, color: 'border-slate-500 bg-slate-500' },
    { status: 'structured', label: 'AI Structured', icon: Sparkles, color: 'border-purple-500 bg-purple-500' },
    { status: 'verified', label: 'Verified', icon: Eye, color: 'border-blue-500 bg-blue-500' },
    { status: 'prioritized', label: 'Triage Ready', icon: Activity, color: 'border-amber-500 bg-amber-500' },
    { status: 'mission_created', label: 'Active Ops', icon: ShieldAlert, color: 'border-rose-500 bg-rose-500' },
    { status: 'rescued', label: 'Secured/Rescued', icon: CheckCircle2, color: 'border-emerald-500 bg-emerald-500' },
    { status: 'recovered', label: 'Stable Foster', icon: Heart, color: 'border-cyan-500 bg-cyan-500' },
    { status: 'reunited', label: 'Reunited!', icon: Award, color: 'border-yellow-500 bg-yellow-500' }
  ];

  const currentStepIndex = pipelineSteps.findIndex(s => s.status === incident.status);

  // Status transitions state trigger
  const handleTransitionClick = (status: IncidentStatus) => {
    setTargetStatus(status);
    setIsConfirmOpen(true);
  };

  const handleConfirmTransition = () => {
    if (!targetStatus) return;

    onUpdateStatus(incident.id, targetStatus);
    
    // Auto-log the transition update
    const labels: Record<IncidentStatus, string> = {
      reported: "Logged report in database.",
      structured: "Triggered standard AI analytical restructuring.",
      verified: "Coordinator physically verified details.",
      prioritized: "Risk assessment completed. Triage parameters finalized.",
      mission_created: "Launched emergency dispatcher field mission.",
      rescued: "Cat secured in safety carrier. Threat neutralized.",
      recovered: "Admitted into veterinary foster station for stable rest.",
      reunited: "Completed microchip matches. Safely returned home to owner!"
    };

    onAddUpdate(incident.id, {
      author: 'System Auto-Log',
      message: `Status transitioned to ${targetStatus.replace('_', ' ').toUpperCase()}. Detail: ${labels[targetStatus]}`,
      statusChanged: targetStatus
    });

    setTargetStatus(null);
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogMsg.trim()) return;

    onAddUpdate(incident.id, {
      author: logAuthor || "Coordinator Elena",
      message: newLogMsg.trim()
    });

    setNewLogMsg('');
  };

  return (
    <div id="incident-details-container" className="max-w-6xl mx-auto px-4 py-8 text-slate-800 dark:text-slate-100 space-y-8">
      
      {/* Back Header navigation */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <button
          id="btn-incident-details-back"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to list
        </button>

        <span className="text-xs font-mono text-slate-400">
          INCIDENT ID: <strong className="font-bold text-slate-600 dark:text-slate-200 uppercase">{incident.id}</strong>
        </span>
      </div>

      {/* EMERGENCY CORE HEADLINE SUMMARY */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={incident.status} />
              <UrgencyIndicator urgency={incident.urgency} />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {incident.title}
            </h1>
          </div>

          <div className="text-right sm:text-right text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-1 sm:justify-end">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Reported: {new Date(incident.reportedAt).toLocaleString()}</span>
            </div>
            <div className="mt-1">Reporter: {incident.reporter.name} ({incident.reporter.type})</div>
          </div>
        </div>

        {/* LINEAR STATUS PIPELINE PROGRESS BAR */}
        <div className="pt-6 border-t border-slate-50 dark:border-slate-800/50">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-4">Operations Pipeline Progress</span>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 relative z-10">
            {pipelineSteps.map((step, idx) => {
              const StepIcon = step.icon;
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              
              return (
                <div 
                  id={`pipeline-step-${step.status}`}
                  key={step.status} 
                  className={`flex flex-col items-center justify-between p-3 rounded-xl border text-center transition-all ${
                    isCurrent 
                      ? 'bg-slate-900 text-white border-slate-800 scale-105 shadow-md' 
                      : isPast 
                        ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/50 text-slate-500 dark:text-slate-400'
                        : 'bg-slate-50/30 dark:bg-slate-950/20 border-slate-100 dark:border-slate-900/20 text-slate-300 dark:text-slate-700'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg mb-2 ${
                    isCurrent ? 'bg-amber-500/20 text-amber-400' : isPast ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
                  }`}>
                    <StepIcon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wide leading-tight">{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID: LEFT CHARACTERISTICS & LOGS, RIGHT IMAGE, LOCATION, ACTION CENTER */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (8 cols): CHARACTERISTICS, AI STRUCTURE, LOGS */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* PROFILE CHARACTERISTICS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-950 dark:text-white flex items-center gap-2 border-b border-slate-50 dark:border-slate-800 pb-3">
              <Cat className="w-5 h-5 text-amber-500" />
              Feline Profile & Condition
            </h3>

            <div className="grid sm:grid-cols-3 gap-6 text-sm">
              <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100/50 dark:border-slate-800/30">
                <span className="text-xs text-slate-400 block font-semibold mb-1">Color / Pattern</span>
                <p className="font-bold text-slate-800 dark:text-slate-100">{incident.catDescription.color}</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100/50 dark:border-slate-800/30">
                <span className="text-xs text-slate-400 block font-semibold mb-1">Assessed Condition</span>
                <p className="font-bold text-slate-800 dark:text-slate-100">{incident.catDescription.condition}</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100/50 dark:border-slate-800/30">
                <span className="text-xs text-slate-400 block font-semibold mb-1">Identified Name</span>
                <p className="font-bold text-slate-800 dark:text-slate-100">{incident.catDescription.name || 'Unknown (Stray)'}</p>
              </div>

              <div className="sm:col-span-3 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100/50 dark:border-slate-800/30">
                <span className="text-xs text-slate-400 block font-semibold mb-1">Distinctive Marks / Collar Details</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">{incident.catDescription.distinctiveFeatures}</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-slate-400 block font-semibold">Reporter Narrative Notes</span>
              <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 leading-relaxed italic">
                &ldquo;{incident.notes}&rdquo;
              </p>
            </div>
          </div>

          {/* AI STRUCTURING DETAILS (THE VALUE ADD) */}
          <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-2xl shadow-xl space-y-4 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Sparkles className="w-32 h-32 text-amber-400" />
            </div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                PurrSignal AI Telemetry Breakdown
              </h3>
              <span className="text-xs font-mono font-bold bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded border border-amber-400/20">
                Confidence: {incident.aiConfidence}% Accuracy
              </span>
            </div>

            <div className="space-y-4 text-xs font-mono text-slate-300 leading-relaxed">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">AI Re-Structured Synopsis:</span>
                <p className="text-slate-200 mt-1 font-semibold leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800/60">
                  {incident.aiSummary}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/50">
                  <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">Triage Threat Level</span>
                  <p className="text-slate-200 mt-1">Urgency elevated based on physical entrapment vectors & storm telemetry.</p>
                </div>
                <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/50">
                  <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">Logistics Recommendations</span>
                  <p className="text-slate-200 mt-1">Deploy drop-trap & heavy bolt cutter accessories. Thermal warming kit required.</p>
                </div>
              </div>
            </div>
          </div>

          {/* HISTORY LOG / TIMELINE & LOG SUBMISSION */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-950 dark:text-white flex items-center gap-2 border-b border-slate-50 dark:border-slate-800 pb-3">
              <MessageSquare className="w-5 h-5 text-indigo-500" />
              Incident Activity & Transmission Trail
            </h3>

            {/* Existing log items */}
            <div className="relative border-l border-slate-100 dark:border-slate-800 pl-4 space-y-6 ml-2">
              {incident.updates.map((up, idx) => (
                <div key={up.id || idx} className="relative">
                  {/* Bullet */}
                  <span className="absolute -left-[21px] top-1.5 w-3.5 h-3.5 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-500 flex items-center justify-center" />

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{up.author}</span>
                      <span className="text-slate-400 font-mono">{new Date(up.timestamp).toLocaleTimeString()}</span>
                      {up.statusChanged && (
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 px-1.5 py-0.5 rounded">
                          Changed to {up.statusChanged}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{up.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Post new update */}
            <form onSubmit={handleAddLog} className="border-t border-slate-50 dark:border-slate-800/60 pt-4 space-y-3">
              <div className="grid sm:grid-cols-4 gap-4 items-end">
                <div className="sm:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Author Name</label>
                  <input
                    id="log-author"
                    type="text"
                    required
                    value={logAuthor}
                    onChange={(e) => setLogAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs text-slate-700 dark:text-slate-200"
                  />
                </div>

                <div className="sm:col-span-3 flex gap-2">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Post Transmission Message</label>
                    <input
                      id="log-message"
                      type="text"
                      required
                      value={newLogMsg}
                      onChange={(e) => setNewLogMsg(e.target.value)}
                      placeholder="Type a manual status log update..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs text-slate-700 dark:text-slate-200"
                    />
                  </div>
                  
                  <button
                    id="btn-submit-log"
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-semibold self-end flex items-center justify-center gap-1 h-9 border border-slate-200 dark:border-slate-700"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send
                  </button>
                </div>
              </div>
            </form>

          </div>

        </div>

        {/* RIGHT COLUMN (4 cols): MEDIA IMAGE, MAP LOCATION PIN, TACTICAL ACTIONS */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* IMAGE CARD */}
          {incident.mediaUrl ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-2xl shadow-sm">
              <div className="h-56 w-full rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <img 
                  src={incident.mediaUrl} 
                  alt={incident.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400 text-center block mt-2">PHYSICAL PHOTOGRAPHIC ATTACHMENT</span>
            </div>
          ) : (
            <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl text-center">
              <Cat className="w-12 h-12 text-slate-400 mx-auto mb-2 stroke-1" />
              <span className="text-xs text-slate-500 block font-semibold">No visual photos uploaded.</span>
            </div>
          )}

          {/* LOCATION TELEMETRY CARD */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-950 dark:text-white flex items-center gap-2 border-b border-slate-50 dark:border-slate-800 pb-2">
              <MapPin className="w-5 h-5 text-sky-500" />
              Site Coordinates
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold mb-0.5">Address</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{incident.location.name}</p>
              </div>

              {incident.location.details && (
                <div>
                  <span className="text-slate-400 block font-semibold mb-0.5">Access Instructions</span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{incident.location.details}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg font-mono text-[10px]">
                <div>
                  <span className="text-slate-400">Lat:</span> {incident.location.lat}
                </div>
                <div>
                  <span className="text-slate-400">Lng:</span> {incident.location.lng}
                </div>
              </div>
            </div>
          </div>

          {/* COORDINATOR STATUS DISPATCH ACTION PANEL */}
          <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Activity className="w-5 h-5 text-rose-500" />
              Coordinator Action Center
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Transition the status below as the physical field rescue progresses to keep the public and volunteer responders in full operational sync.
            </p>

            <div className="flex flex-col gap-2 pt-2">
              {incident.status === 'reported' && (
                <button
                  id="action-btn-verify"
                  onClick={() => handleTransitionClick('verified')}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all"
                >
                  Verify Sighting Information
                </button>
              )}

              {incident.status === 'verified' && (
                <button
                  id="action-btn-prioritize"
                  onClick={() => handleTransitionClick('prioritized')}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition-all"
                >
                  Authorize Triage / Prioritize
                </button>
              )}

              {incident.status === 'prioritized' && onLaunchMissionForIncident && (
                <button
                  id="action-btn-dispatch"
                  onClick={() => onLaunchMissionForIncident(incident)}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all"
                >
                  Dispatch Emergency Rescue Mission
                </button>
              )}

              {incident.status === 'rescued' && (
                <button
                  id="action-btn-recovery"
                  onClick={() => handleTransitionClick('recovered')}
                  className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all"
                >
                  Admit into Safe Foster Haven
                </button>
              )}

              {incident.status === 'recovered' && (
                <button
                  id="action-btn-reunite"
                  onClick={() => handleTransitionClick('reunited')}
                  className="w-full py-2.5 bg-yellow-600 hover:bg-yellow-500 text-slate-900 font-bold text-xs rounded-xl transition-all"
                >
                  Confirm Owner Reunification (Close case)
                </button>
              )}

              {incident.status === 'reunited' && (
                <div className="bg-emerald-950/30 border border-emerald-900/40 p-4 rounded-xl text-center text-xs text-emerald-400 space-y-1">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-1" />
                  <p className="font-bold">Mission Successfully Accomplished</p>
                  <p className="text-[10px] text-slate-500">The cat is safe back home. Case closed.</p>
                </div>
              )}

              {/* General action button reset simulation */}
              <button
                id="action-btn-reset"
                onClick={() => handleTransitionClick('reported')}
                className="w-full py-2 text-[10px] text-slate-500 hover:text-slate-400 font-mono border border-slate-800 hover:border-slate-700 bg-slate-950 rounded-lg transition-all"
              >
                Reset to Reported status (Simulate)
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* TRANSITION CONFIRMATION DIALOG */}
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmTransition}
        title="Confirm Operational Transition"
        message={`Are you sure you want to transition this incident to "${targetStatus?.toUpperCase()}"? This will log a systematic update in the telemetry logs.`}
        confirmLabel="Transition Status"
        cancelLabel="Abort"
      />

    </div>
  );
};
