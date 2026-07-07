/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Cat, 
  ShieldAlert, 
  Compass, 
  FileText, 
  Sparkles, 
  Activity, 
  Menu, 
  X, 
  Sun, 
  Moon,
  Github,
  Heart,
  Shield
} from 'lucide-react';
import { Incident, Mission, Rescuer, ToastMessage, IncidentStatus, IncidentUpdate } from './types';
import { INITIAL_INCIDENTS, INITIAL_MISSIONS, REGISTERED_RESCUERS } from './data';
import { ToastContainer } from './components/UI';
import { MisoStorySimulator } from './components/MisoStorySimulator';
import { Logo } from './components/Logo';

// Pages
import { LandingPage } from './pages/LandingPage';
import { ReportIncidentPage } from './pages/ReportIncidentPage';
import { CrisisMapPage } from './pages/CrisisMapPage';
import { MissionControlPage } from './pages/MissionControlPage';
import { IncidentDetailsPage } from './pages/IncidentDetailsPage';
import { RescueCopilotPage } from './pages/RescueCopilotPage';
import { GuardianPlanPage } from './pages/GuardianPlanPage';
import { TrustSafetyPage } from './pages/TrustSafetyPage';


export default function App() {
  // Navigation State
  const [activePage, setActivePage] = useState<string>('landing');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Persistence State
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem('purrsignal_incidents');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem('purrsignal_missions');
    return saved ? JSON.parse(saved) : INITIAL_MISSIONS;
  });

  const [rescuers, setRescuers] = useState<Rescuer[]>(() => {
    const saved = localStorage.getItem('purrsignal_rescuers');
    return saved ? JSON.parse(saved) : REGISTERED_RESCUERS;
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Dark mode (Defaults to dark for operations feel, toggleable)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('purrsignal_dark_mode');
    return saved ? JSON.parse(saved) : true;
  });

  // Sync back to localstorage
  useEffect(() => {
    localStorage.setItem('purrsignal_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('purrsignal_missions', JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem('purrsignal_rescuers', JSON.stringify(rescuers));
  }, [rescuers]);

  useEffect(() => {
    localStorage.setItem('purrsignal_dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // TOAST ACTIONS
  const addToast = (title: string, description: string, type: ToastMessage['type'] = 'info') => {
    const newToast: ToastMessage = {
      id: `toast_${Date.now()}`,
      title,
      description,
      type
    };
    setToasts(prev => [...prev, newToast]);

    // Auto dismiss after 5s
    setTimeout(() => {
      removeToast(newToast.id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // CORE ACTIONS
  const handleAddIncident = (newIncData: Omit<Incident, 'id' | 'reportedAt' | 'updates'> & { id?: string; timeline?: any[]; updates?: any[]; aiConfidence?: number; aiSummary?: string }) => {
    const newId = newIncData.id || `inc_${Date.now()}`;
    const reportedAt = new Date().toISOString();
    const aiConfidence = newIncData.aiConfidence || Math.floor(Math.random() * 10) + 88; // 88% to 97% confidence
    
    // Auto-structuring AI simulation summary
    const dangerNotes = newIncData.urgency === 'critical' || newIncData.urgency === 'CRITICAL'
      ? "CRITICAL LIFE THREAT DETECTED. Flood, machinery, or trauma multipliers active." 
      : "Standard diagnostic baseline.";

    const colorVal = newIncData.catDescription?.color || newIncData.catProfile?.color || "unknown color";
    const conditionVal = newIncData.catDescription?.condition || newIncData.catProfile?.condition || "stable";
    const aiSummary = newIncData.aiSummary || `SIGHTING CLASSIFICATION: ${colorVal.toUpperCase()} feline. Location geocoded successfully to ${newIncData.location.name}. Condition reported as ${conditionVal}. AI Triage: ${dangerNotes} Deploying bait (Fragrant oil mackerel/tuna) and standard mesh carrier box recommended immediately.`;

    const customUpdates = newIncData.updates || [
      {
        id: `up_${newId}_1`,
        timestamp: reportedAt,
        author: "PurrSignal AI Parser",
        message: "Raw narrative parsed cleanly. High confidence coat markers extracted.",
        statusChanged: newIncData.status || "reported"
      },
      {
        id: `up_${newId}_2`,
        timestamp: new Date(Date.now() + 2000).toISOString(),
        author: "System Dispatcher",
        message: "Sighting geolocated and mapped. Added coordinates to public radar.",
        statusChanged: newIncData.status || "structured"
      }
    ];

    const newIncident: Incident = {
      ...newIncData,
      id: newId,
      reportedAt,
      aiConfidence,
      aiSummary,
      updates: customUpdates,
      timeline: newIncData.timeline || [
        {
          id: `t_${Date.now()}_1`,
          timestamp: reportedAt,
          author: "Reporter",
          message: `Incident created with reference ${newId}.`,
          statusChanged: newIncData.status || "NEW"
        }
      ],
      evidence: newIncData.evidence || (newIncData.mediaUrl ? [{
        id: `ev_${Date.now()}`,
        type: 'image',
        url: newIncData.mediaUrl,
        capturedAt: reportedAt
      }] : [])
    } as Incident;

    setIncidents(prev => [newIncident, ...prev]);
    addToast(
      "Incident Structured & Logged!", 
      `Successfully logged "${newIncData.title}" [Ref: ${newId}]. Ready for verification.`,
      "success"
    );
  };

  const handleUpdateIncidentStatus = (id: string, status: IncidentStatus) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        return { ...inc, status };
      }
      return inc;
    }));
  };

  const handleAddIncidentUpdate = (id: string, update: Omit<IncidentUpdate, 'id' | 'timestamp'>) => {
    const newUpdate: IncidentUpdate = {
      ...update,
      id: `up_${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        const updatedList = [...inc.updates, newUpdate];
        return { 
          ...inc, 
          updates: updatedList,
          status: update.statusChanged || inc.status
        };
      }
      return inc;
    }));

    addToast(
      "Transmission posted", 
      `New activity update logged by ${update.author}`,
      "info"
    );
  };

  const handleCreateMission = (newMsnData: Omit<Mission, 'id' | 'createdAt' | 'updates'>) => {
    const newId = `msn_${Date.now()}`;
    const createdAt = new Date().toISOString();

    const newMission: Mission = {
      ...newMsnData,
      id: newId,
      createdAt,
      updates: [
        {
          id: `mu_${newId}_1`,
          timestamp: createdAt,
          author: "System Log",
          message: `Mission operation launched. Rescuers assigned: ${newMsnData.assignedRescuers.join(', ')}.`
        }
      ]
    };

    setMissions(prev => [newMission, ...prev]);
    addToast(
      "Rescue Mission Dispatched!", 
      `Tactical operation established for incident. Rescuers are now en route.`,
      "success"
    );

    // Sync rescuer status
    setRescuers(prev => prev.map(r => {
      if (newMsnData.assignedRescuers.includes(r.name)) {
        return { ...r, status: 'on_mission' };
      }
      return r;
    }));
  };

  const handleUpdateMissionStatus = (id: string, status: string) => {
    setMissions(prev => prev.map(msn => {
      if (msn.id === id) {
        // Free up assigned rescuers if completed or cancelled
        if (status === 'completed' || status === 'cancelled') {
          setRescuers(rPrev => rPrev.map(r => {
            if (msn.assignedRescuers.includes(r.name)) {
              return { ...r, status: 'available' };
            }
            return r;
          }));
        }

        return { ...msn, status };
      }
      return msn;
    }));

    const type = status === 'completed' ? 'success' : 'info';
    addToast(
      `Mission Status Logged`, 
      `Operational status updated cleanly to "${status.toUpperCase()}".`,
      type
    );
  };

  const handleAddMissionUpdate = (missionId: string, message: string, author: string) => {
    const newUpdate = {
      id: `mu_${Date.now()}`,
      timestamp: new Date().toISOString(),
      author,
      message
    };

    setMissions(prev => prev.map(msn => {
      if (msn.id === missionId) {
        return {
          ...msn,
          updates: [...msn.updates, newUpdate]
        };
      }
      return msn;
    }));

    addToast(
      "Tactical Transmission Received", 
      `${author}: "${message}"`,
      "info"
    );
  };

  const handleAddRescuer = (newRescuer: Omit<Rescuer, 'id'>) => {
    const newId = `res_${Date.now()}`;
    const rescuer: Rescuer = {
      ...newRescuer,
      id: newId
    };

    setRescuers(prev => [...prev, rescuer]);
    addToast(
      "Volunteer registered!", 
      `Successfully registered responder "${newRescuer.name}" on-call network.`,
      "success"
    );
  };

  const handleViewIncidentDetails = (id: string) => {
    setSelectedIncidentId(id);
    setActivePage('incident_details');
  };

  const handleLaunchMissionFromIncident = (incident: Incident) => {
    setSelectedIncidentId(incident.id);
    setActivePage('dashboard');
    addToast(
      "Incident linked!", 
      "Use the 'Launch Rescue Operation' panel. Sighting profile was automatically prefilled.",
      "info"
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between transition-colors duration-300">
      
      {/* NAVIGATION BAR HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur border-b border-slate-200/60 dark:border-slate-900/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            
            {/* LOGO */}
            <div 
              onClick={() => setActivePage('landing')}
              className="cursor-pointer"
            >
              <Logo />
            </div>

            {/* DESKTOP NAV LINKS */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <button
                id="nav-link-landing"
                onClick={() => setActivePage('landing')}
                className={`px-3 py-2 rounded-lg hover:text-slate-950 dark:hover:text-white transition-colors ${activePage === 'landing' ? 'bg-slate-100 dark:bg-slate-900 text-slate-950 dark:text-white' : ''}`}
              >
                Home
              </button>
              
              <button
                id="nav-link-map"
                onClick={() => setActivePage('map')}
                className={`px-3 py-2 rounded-lg hover:text-slate-950 dark:hover:text-white transition-colors flex items-center gap-1 ${activePage === 'map' ? 'bg-slate-100 dark:bg-slate-900 text-slate-950 dark:text-white' : ''}`}
              >
                <Compass className="w-4 h-4 text-sky-500" />
                Sighting Map
              </button>

              <button
                id="nav-link-dashboard"
                onClick={() => setActivePage('dashboard')}
                className={`px-3 py-2 rounded-lg hover:text-slate-950 dark:hover:text-white transition-colors flex items-center gap-1 ${activePage === 'dashboard' ? 'bg-slate-100 dark:bg-slate-900 text-slate-950 dark:text-white' : ''}`}
              >
                <Activity className="w-4 h-4 text-amber-500" />
                Mission Control
              </button>

              <button
                id="nav-link-copilot"
                onClick={() => setActivePage('copilot')}
                className={`px-3 py-2 rounded-lg hover:text-slate-950 dark:hover:text-white transition-colors flex items-center gap-1 ${activePage === 'copilot' ? 'bg-slate-100 dark:bg-slate-900 text-slate-950 dark:text-white' : ''}`}
              >
                <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
                AI Copilot
              </button>

              <button
                id="nav-link-guardian"
                onClick={() => setActivePage('guardian')}
                className={`px-3 py-2 rounded-lg hover:text-slate-950 dark:hover:text-white transition-colors flex items-center gap-1 ${activePage === 'guardian' ? 'bg-slate-100 dark:bg-slate-900 text-slate-950 dark:text-white' : ''}`}
              >
                <Heart className="w-4 h-4 text-rose-500" />
                Guardian Plan
              </button>

              <button
                id="nav-link-safety"
                onClick={() => setActivePage('safety')}
                className={`px-3 py-2 rounded-lg hover:text-slate-950 dark:hover:text-white transition-colors flex items-center gap-1 ${activePage === 'safety' ? 'bg-slate-100 dark:bg-slate-900 text-slate-950 dark:text-white' : ''}`}
              >
                <Shield className="w-4 h-4 text-emerald-500" />
                Trust & Safety
              </button>

              <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800 mx-2" />

              {/* Red report cta */}
              <button
                id="nav-link-report"
                onClick={() => setActivePage('report')}
                className={`px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1 ${activePage === 'report' ? 'ring-2 ring-rose-500 ring-offset-2 dark:ring-offset-slate-950' : ''}`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Report Incident
              </button>

              <button
                id="nav-btn-theme-toggle"
                onClick={() => setDarkMode(!darkMode)}
                className="ml-3 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
                title="Toggle visual operations mode"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            </nav>

            {/* MOBILE HAMBURGER MENU BUTTON */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                id="nav-mobile-theme-toggle"
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-slate-400 hover:text-slate-200 rounded-lg"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              <button
                id="nav-mobile-hamburger"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* MOBILE DROPDOWN DRAWER */}
        {mobileMenuOpen && (
          <div id="nav-mobile-drawer" className="md:hidden border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950 p-4 space-y-2 font-semibold">
            <button
              id="mob-link-landing"
              onClick={() => { setActivePage('landing'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 block"
            >
              Home
            </button>
            <button
              id="mob-link-map"
              onClick={() => { setActivePage('map'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-sky-500" />
              Sighting Map
            </button>
            <button
              id="mob-link-dashboard"
              onClick={() => { setActivePage('dashboard'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-amber-500" />
              Mission Control
            </button>
            <button
              id="mob-link-copilot"
              onClick={() => { setActivePage('copilot'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-purple-500" />
              AI Copilot
            </button>
            <button
              id="mob-link-guardian"
              onClick={() => { setActivePage('guardian'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2"
            >
              <Heart className="w-4 h-4 text-rose-500" />
              Guardian Plan
            </button>
            <button
              id="mob-link-safety"
              onClick={() => { setActivePage('safety'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-emerald-500" />
              Trust & Safety
            </button>
            <button
              id="mob-link-report"
              onClick={() => { setActivePage('report'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 bg-rose-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 mt-4"
            >
              <ShieldAlert className="w-4 h-4" />
              Report Incident
            </button>
          </div>
        )}
      </header>

      {/* GLOBAL WALKTHROUGH SIMULATOR BANNER */}
      <MisoStorySimulator
        incidents={incidents}
        setIncidents={setIncidents}
        missions={missions}
        setMissions={setMissions}
        rescuers={rescuers}
        setRescuers={setRescuers}
        addToast={addToast}
        onNavigateToIncident={handleViewIncidentDetails}
        onNavigate={setActivePage}
      />

      {/* RENDER CURRENT PAGE STAGE */}
      <main className="flex-1">
        {activePage === 'landing' && (
          <LandingPage
            onNavigate={setActivePage}
            activeMissionsCount={missions.filter(m => m.status === 'active').length}
            unresolvedIncidentsCount={incidents.filter(i => i.status !== 'reunited' && i.status !== 'recovered').length}
          />
        )}

        {activePage === 'report' && (
          <ReportIncidentPage
            onSubmitReport={handleAddIncident}
            onNavigate={setActivePage}
          />
        )}

        {activePage === 'map' && (
          <CrisisMapPage
            incidents={incidents}
            onSelectIncident={handleViewIncidentDetails}
            onNavigateToReport={() => setActivePage('report')}
          />
        )}

        {activePage === 'dashboard' && (
          <MissionControlPage
            incidents={incidents}
            missions={missions}
            rescuers={rescuers}
            onViewIncident={handleViewIncidentDetails}
            onCreateMission={handleCreateMission}
            onUpdateMissionStatus={handleUpdateMissionStatus}
            onAddMissionUpdate={handleAddMissionUpdate}
            onAddRescuer={handleAddRescuer}
            onUpdateIncidentStatus={handleUpdateIncidentStatus}
            onAddIncidentUpdate={handleAddIncidentUpdate}
          />
        )}

        {activePage === 'incident_details' && (
          <IncidentDetailsPage
            incidentId={selectedIncidentId}
            incidents={incidents}
            onBack={() => setActivePage('dashboard')}
            onUpdateStatus={handleUpdateIncidentStatus}
            onAddUpdate={handleAddIncidentUpdate}
            onLaunchMissionForIncident={handleLaunchMissionFromIncident}
          />
        )}

        {activePage === 'copilot' && (
          <RescueCopilotPage 
            incidents={incidents}
            missions={missions}
            rescuers={rescuers}
            onUpdateIncidentStatus={handleUpdateIncidentStatus}
            onUpdateMissionStatus={handleUpdateMissionStatus}
            onAssignRescuer={(missionId, rescuerName) => {
              setMissions(prev => prev.map(m => {
                if (m.id === missionId) {
                  const assigned = m.assignedRescuers || [];
                  if (assigned.includes(rescuerName)) return m;
                  return { ...m, assignedRescuers: [...assigned, rescuerName] };
                }
                return m;
              }));
              addToast("Operations Modified", `Assigned ${rescuerName} to mission ${missionId}`, "success");
            }}
          />
        )}

        {activePage === 'guardian' && (
          <GuardianPlanPage />
        )}

        {activePage === 'safety' && (
          <TrustSafetyPage />
        )}
      </main>

      {/* GLOBAL TOAST DISPLAY */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* FOOTER SECTION */}
      <footer className="py-6 bg-white dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-900/60 text-center text-xs text-slate-400 dark:text-slate-500 font-mono transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            &copy; 2026 PurrSignal Ops Net. All rights reserved. Feline Crisis Dispatch.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Node Active: SF-CENTRAL-01
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
