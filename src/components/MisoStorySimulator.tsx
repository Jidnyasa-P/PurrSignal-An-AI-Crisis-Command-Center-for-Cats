import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  Award 
} from 'lucide-react';
import { 
  Incident, 
  Mission, 
  Rescuer, 
  IncidentStatus, 
  MissionStatus, 
  UserRole, 
  Urgency,
  IncidentType 
} from '../types';

interface MisoStorySimulatorProps {
  incidents: Incident[];
  setIncidents: React.Dispatch<React.SetStateAction<Incident[]>>;
  missions: Mission[];
  setMissions: React.Dispatch<React.SetStateAction<Mission[]>>;
  rescuers: Rescuer[];
  setRescuers: React.Dispatch<React.SetStateAction<Rescuer[]>>;
  addToast: (title: string, description: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  onNavigateToIncident?: (id: string) => void;
  onNavigate?: (page: string) => void;
}

export const MisoStorySimulator: React.FC<MisoStorySimulatorProps> = ({
  incidents,
  setIncidents,
  missions,
  setMissions,
  rescuers,
  setRescuers,
  addToast,
  onNavigateToIncident,
  onNavigate
}) => {
  // Determine current stage based on data state
  const misoInc = incidents.find(i => i.id === 'inc_miso');
  const misoMsn = missions.find(m => m.incidentId === 'inc_miso');

  let currentStage = 1;
  if (misoInc) {
    if (misoInc.status === IncidentStatus.REUNITED) {
      currentStage = 5;
    } else if (misoInc.status === IncidentStatus.SAFE || (misoMsn && misoMsn.status === MissionStatus.CAT_SECURED)) {
      currentStage = 4;
    } else if (misoMsn && (misoMsn.status === 'active' || misoMsn.status === MissionStatus.ASSIGNED)) {
      currentStage = 3;
    } else if (misoInc.status === IncidentStatus.VERIFIED || misoInc.possibleMatches?.some(m => m.status === 'CONFIRMED')) {
      currentStage = 2; // Match verified
    } else {
      currentStage = 1; // Reported & AI Detected
    }
  }

  // Handle stage transition
  const handleSetStage = (stage: number) => {
    if (stage === 1) {
      // RESET TO INITIAL STATE
      setIncidents(prev => prev.map(inc => {
        if (inc.id === 'inc_miso') {
          return {
            ...inc,
            status: IncidentStatus.NEEDS_VERIFICATION,
            possibleMatches: inc.possibleMatches?.map(m => ({ ...m, status: 'PENDING' })) || [],
            timeline: inc.timeline.slice(0, 2)
          };
        }
        if (inc.id === 'inc_sighting_1' || inc.id === 'inc_sighting_2') {
          return { ...inc, status: IncidentStatus.NEW };
        }
        return inc;
      }));

      // Remove miso mission
      setMissions(prev => prev.filter(m => m.incidentId !== 'inc_miso'));

      // Restore volunteer
      setRescuers(prev => prev.map(r => {
        if (r.id === 'res_6') { // Lily Potter
          return { ...r, status: 'available' };
        }
        return r;
      }));

      addToast(
        "Walkthrough Reset",
        "Miso's case reset. Owner Sarah has filed the missing report, and two sightings exist on the map.",
        "info"
      );
    } 
    else if (stage === 2) {
      // COORDINATOR VERIFIES MATCH
      setIncidents(prev => prev.map(inc => {
        if (inc.id === 'inc_miso') {
          const matchEvent = {
            id: `tl_miso_match_${Date.now()}`,
            timestamp: new Date().toISOString(),
            author: "Coordinator Elena",
            message: "Confirmed match with Fulton Backyard Rose Garden Sighting. Geographic proximity 150m, blue flea collar verified.",
            statusChanged: IncidentStatus.VERIFIED
          };
          return {
            ...inc,
            status: IncidentStatus.VERIFIED,
            possibleMatches: inc.possibleMatches?.map(m => ({ ...m, status: 'CONFIRMED' })) || [],
            timeline: [...inc.timeline, matchEvent]
          };
        }
        if (inc.id === 'inc_sighting_1' || inc.id === 'inc_sighting_2') {
          return { ...inc, status: IncidentStatus.CLOSED };
        }
        return inc;
      }));

      addToast(
        "AI Match Confirmed!",
        "Elena verified physical match. Sightings are linked and Miso's status is now VERIFIED.",
        "success"
      );
    } 
    else if (stage === 3) {
      // DISPATCH RESCUE MISSION
      // 1. Ensure Step 2 is completed first
      setIncidents(prev => prev.map(inc => {
        if (inc.id === 'inc_miso') {
          const msnEvent = {
            id: `tl_miso_msn_${Date.now()}`,
            timestamp: new Date().toISOString(),
            author: "System Dispatcher",
            message: "Tactical rescue mission MSN_MISO activated. Volunteer Lily Potter dispatched with drop trap and tuna scent lures.",
            statusChanged: IncidentStatus.MISSION_CREATED
          };
          return {
            ...inc,
            status: IncidentStatus.MISSION_CREATED,
            possibleMatches: inc.possibleMatches?.map(m => ({ ...m, status: 'CONFIRMED' })) || [],
            timeline: inc.status === IncidentStatus.VERIFIED ? [...inc.timeline, msnEvent] : [...inc.timeline, msnEvent]
          };
        }
        if (inc.id === 'inc_sighting_1' || inc.id === 'inc_sighting_2') {
          return { ...inc, status: IncidentStatus.CLOSED };
        }
        return inc;
      }));

      // 2. Create mission if not exists
      setMissions(prev => {
        if (prev.some(m => m.incidentId === 'inc_miso')) return prev;
        const newMisoMsn: Mission = {
          id: "msn_miso",
          incidentId: "inc_miso",
          title: "Miso Scent-Lure & Capture Ops",
          status: 'active',
          assignedRescuers: ["Lily Potter"],
          priority: Urgency.HIGH,
          createdAt: new Date().toISOString(),
          equipmentNeeded: ["Humane Box Trap", "Flea collar reader", "Owner scent blanket", "Gourmet Wet Tuna"],
          updates: [
            {
              id: `mu_miso_1`,
              timestamp: new Date().toISOString(),
              author: "Lily Potter",
              message: "En route to Fulton rose backyard. Sarah Jennings (owner) is on-site to assist with voice reassurance."
            }
          ]
        };
        return [newMisoMsn, ...prev];
      });

      // 3. Mark Lily as on mission
      setRescuers(prev => prev.map(r => {
        if (r.id === 'res_6') {
          return { ...r, status: 'on_mission' };
        }
        return r;
      }));

      addToast(
        "Rescue Mission Active!",
        "Mission MSN_MISO dispatched. Lily is en route with specialized drop trap gear.",
        "success"
      );
    } 
    else if (stage === 4) {
      // SECURE CAT
      setIncidents(prev => prev.map(inc => {
        if (inc.id === 'inc_miso') {
          const secureEvent = {
            id: `tl_miso_sec_${Date.now()}`,
            timestamp: new Date().toISOString(),
            author: "Volunteer Lily",
            message: "Miso successfully secured in drop trap! Scanned blue collar, microchip matches Sarah's registration. Cat is safe and unhurt.",
            statusChanged: IncidentStatus.SAFE
          };
          return {
            ...inc,
            status: IncidentStatus.SAFE,
            timeline: [...inc.timeline, secureEvent]
          };
        }
        return inc;
      }));

      setMissions(prev => prev.map(m => {
        if (m.incidentId === 'inc_miso') {
          return {
            ...m,
            status: MissionStatus.CAT_SECURED,
            updates: [
              ...m.updates,
              {
                id: `mu_miso_2`,
                timestamp: new Date().toISOString(),
                author: "Lily Potter",
                message: "Miso has been lured using the scent blanket and wet food. Secured safely! No injuries detected."
              }
            ]
          };
        }
        return m;
      }));

      addToast(
        "Miso Secured Safely!",
        "Volunteer Lily reports Miso is secured, safe, and warm. Microchip matches confirmed.",
        "success"
      );
    } 
    else if (stage === 5) {
      // REUNITED WITH OWNER
      setIncidents(prev => prev.map(inc => {
        if (inc.id === 'inc_miso') {
          const reuniteEvent = {
            id: `tl_miso_reun_${Date.now()}`,
            timestamp: new Date().toISOString(),
            author: "Coordinator Elena",
            message: "Miso reunited with Sarah Jennings! Handover complete at PurrSignal HQ. Family reunited. Case finalized.",
            statusChanged: IncidentStatus.REUNITED
          };
          return {
            ...inc,
            status: IncidentStatus.REUNITED,
            timeline: [...inc.timeline, reuniteEvent]
          };
        }
        return inc;
      }));

      setMissions(prev => prev.map(m => {
        if (m.incidentId === 'inc_miso') {
          return {
            ...m,
            status: 'completed',
            updates: [
              ...m.updates,
              {
                id: `mu_miso_3`,
                timestamp: new Date().toISOString(),
                author: "Elena Rostova",
                message: "Sarah arrived at HQ. Miso recognized her instantly. PurrSignal case closed successfully."
              }
            ]
          };
        }
        return m;
      }));

      setRescuers(prev => prev.map(r => {
        if (r.id === 'res_6') {
          return { ...r, status: 'available' };
        }
        return r;
      }));

      addToast(
        "Miso Reunited! ❤️",
        "Miso has been handed over to Sarah Jennings. Operation complete!",
        "success"
      );
    }
  };

  const stages = [
    { nr: 1, name: "Reported & AI Detected", icon: ShieldAlert },
    { nr: 2, name: "Verify Match", icon: Sparkles },
    { nr: 3, name: "Dispatch Rescue", icon: MapPin },
    { nr: 4, name: "Secure Miso", icon: CheckCircle2 },
    { nr: 5, name: "Reunited", icon: Award }
  ];

  return (
    <div id="miso-simulator" className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Title */}
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-amber-500 rounded-lg text-slate-950 font-bold shadow-md shadow-amber-500/10 flex items-center justify-center animate-pulse">
            🧡
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              PurrSignal Simulation Walkthrough:
              <span className="text-amber-600 dark:text-amber-400 font-mono text-xs bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">The Story of Miso</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Interact with Miso's rescue lifecycle: Watch how reports, sightings, AI matching, missions, and reunions connect.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="flex items-center flex-wrap gap-2.5">
          {stages.map((st, i) => {
            const IconComp = st.icon;
            const isCompleted = currentStage >= st.nr;
            const isActive = currentStage === st.nr;
            
            return (
              <React.Fragment key={st.nr}>
                <button
                  id={`sim-step-${st.nr}`}
                  onClick={() => handleSetStage(st.nr)}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border ${
                    isActive 
                      ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold scale-105 shadow-md shadow-amber-500/10' 
                      : isCompleted
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                  <span>{st.nr}. {st.name}</span>
                </button>
                {i < stages.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-700 hidden sm:block" />
                )}
              </React.Fragment>
            );
          })}

          <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

          {/* Special view case quick link */}
          <button
            id="sim-view-miso-incident"
            onClick={() => {
              if (onNavigateToIncident) {
                onNavigateToIncident('inc_miso');
              } else if (onNavigate) {
                onNavigate('dashboard');
              }
            }}
            className="px-3 py-1.5 text-xs font-bold text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 border border-dashed border-amber-500/30 rounded-lg hover:bg-amber-500/5 transition-all flex items-center gap-1"
          >
            Go to Miso's Feed 🐾
          </button>

          <button
            id="sim-reset-all"
            onClick={() => handleSetStage(1)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
            title="Reset Storyboard"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
