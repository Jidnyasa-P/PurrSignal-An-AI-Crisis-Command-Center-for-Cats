import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Users, 
  Activity, 
  Briefcase, 
  Plus, 
  PlusCircle, 
  CheckCircle2, 
  AlertTriangle, 
  X,
  Send,
  Wrench,
  UserCheck,
  Cat,
  FileText,
  Clock,
  Check,
  Sparkles,
  MapPin,
  Flame,
  ArrowRight,
  Eye,
  Trash2,
  ListFilter
} from 'lucide-react';
import { Incident, Mission, Rescuer, UrgencyLevel, IncidentStatus, IncidentType, Urgency } from '../types';
import { StatusBadge, UrgencyIndicator, MissionCard, IncidentCard, Modal, EmptyState } from '../components/UI';

interface MissionControlPageProps {
  incidents: Incident[];
  missions: Mission[];
  rescuers: Rescuer[];
  onViewIncident: (id: string) => void;
  onCreateMission: (newMission: Omit<Mission, 'id' | 'createdAt' | 'updates'>) => void;
  onUpdateMissionStatus: (id: string, status: string) => void;
  onAddMissionUpdate: (missionId: string, message: string, author: string) => void;
  onAddRescuer: (rescuer: Omit<Rescuer, 'id'>) => void;
  onUpdateIncidentStatus: (id: string, status: IncidentStatus) => void;
  onAddIncidentUpdate?: (id: string, update: { author: string, message: string, statusChanged?: IncidentStatus }) => void;
  addToast?: (title: string, description: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

const normalizeStatus = (status: string | IncidentStatus): IncidentStatus => {
  if (status === 'reported') return IncidentStatus.NEW;
  if (status === 'structured') return IncidentStatus.AI_ANALYZED;
  if (status === 'prioritized') return IncidentStatus.NEEDS_VERIFICATION;
  if (status === 'verified') return IncidentStatus.VERIFIED;
  if (status === 'mission_created') return IncidentStatus.MISSION_CREATED;
  if (status === 'rescued' || status === 'recovered') return IncidentStatus.SAFE;
  if (status === 'reunited') return IncidentStatus.REUNITED;
  if (status === 'closed') return IncidentStatus.CLOSED;
  return status as IncidentStatus;
};

// Haversine Distance helper for geographical plausibility
const getDistanceKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const MissionControlPage: React.FC<MissionControlPageProps> = ({
  incidents,
  missions,
  rescuers,
  onViewIncident,
  onCreateMission,
  onUpdateMissionStatus,
  onAddMissionUpdate,
  onAddRescuer,
  onUpdateIncidentStatus,
  onAddIncidentUpdate,
  addToast
}) => {
  // Current Tab selection
  const [activeTab, setActiveTab] = useState<'feed' | 'ops' | 'rescuers' | 'matches'>('ops');

  // Ops sub-status filter (Prompt 6)
  const [opsFilter, setOpsFilter] = useState<'all' | 'critical' | 'verification' | 'search' | 'rescue' | 'transport' | 'safe'>('all');

  // MODAL STATES
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isAddRescuerModalOpen, setIsAddRescuerModalOpen] = useState(false);

  // LAUNCH MISSION STATE
  const [selectedIncidentId, setSelectedIncidentId] = useState('');
  const [missionTitle, setMissionTitle] = useState('');
  const [missionPriority, setMissionPriority] = useState<UrgencyLevel>('medium');
  const [assignedRescuers, setAssignedRescuers] = useState<string[]>([]);
  const [equipInput, setEquipInput] = useState('');
  const [equipmentList, setEquipmentList] = useState<string[]>([]);

  // MANAGE ACTIVE MISSION STATE (Upgraded to full Operational Board)
  const [activeManageMission, setActiveManageMission] = useState<Mission | null>(null);
  const [transmissionMsg, setTransmissionMsg] = useState('');
  const [transmissionAuthor, setTransmissionAuthor] = useState('Coordinator Elena');
  const [newGearInput, setNewGearInput] = useState('');

  // REGISTER RESCUER FORM STATE
  const [rescuerName, setRescuerName] = useState('');
  const [rescuerRole, setRescuerRole] = useState<'field_rescuer' | 'medical_volunteer' | 'coordinator' | 'foster_care'>('field_rescuer');
  const [rescuerContact, setRescuerContact] = useState('');
  const [rescuerLocation, setRescuerLocation] = useState('');

  // MATCH RESOLUTION PERSISTENCE (Prompt 5)
  const [dismissedMatchIds, setDismissedMatchIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('purrsignal_dismissed_matches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [confirmedMatchIds, setConfirmedMatchIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('purrsignal_confirmed_matches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('purrsignal_dismissed_matches', JSON.stringify(dismissedMatchIds));
  }, [dismissedMatchIds]);

  useEffect(() => {
    localStorage.setItem('purrsignal_confirmed_matches', JSON.stringify(confirmedMatchIds));
  }, [confirmedMatchIds]);

  // FILTER UNASSIGNED INCIDENTS
  const unassignedIncidents = useMemo(() => {
    const missionIncidentIds = missions.filter(m => m.status === 'active' || m.status === 'assigned' || m.status === 'en_route' || m.status === 'on_scene' || m.status === 'cat_secured' || m.status === 'transporting').map(m => m.incidentId);
    return incidents.filter(inc => {
      const norm = normalizeStatus(inc.status);
      return !missionIncidentIds.includes(inc.id) && 
        norm !== IncidentStatus.SAFE && 
        norm !== IncidentStatus.REUNITED && 
        norm !== IncidentStatus.CLOSED;
    });
  }, [incidents, missions]);

  // STATS CALCULATIONS
  const openIncidentsCount = useMemo(() => {
    return incidents.filter(i => {
      const norm = normalizeStatus(i.status);
      return norm !== IncidentStatus.REUNITED && norm !== IncidentStatus.CLOSED;
    }).length;
  }, [incidents]);

  const activeMissionsCount = useMemo(() => {
    return missions.filter(m => m.status !== 'completed' && m.status !== 'cancelled').length;
  }, [missions]);

  const availableRescuersCount = useMemo(() => {
    return rescuers.filter(r => r.status === 'available').length;
  }, [rescuers]);

  // DYNAMIC MATCH PAIRS GENERATION (Prompt 5 Matching Engine)
  const possibleMatches = useMemo(() => {
    const pairs: Array<{
      id: string;
      incA: Incident; // Always MISSING
      incB: Incident; // SIGHTING or FOUND
      score: number;
      reasons: string[];
      details: {
        visual: number;
        distinctive: number;
        geographic: number;
        chronological: number;
        ageSex: number;
        accessory: number;
        human: number;
      };
    }> = [];

    // Filter active/open incidents
    const openCases = incidents.filter(i => {
      const norm = normalizeStatus(i.status);
      return norm !== IncidentStatus.REUNITED && norm !== IncidentStatus.CLOSED;
    });

    const missingCases = openCases.filter(i => i.type === IncidentType.MISSING);
    const sightingOrFoundCases = openCases.filter(i => i.type === IncidentType.SIGHTING || i.type === IncidentType.FOUND || i.type === IncidentType.INJURED || i.type === IncidentType.TRAPPED);

    missingCases.forEach(miss => {
      sightingOrFoundCases.forEach(sight => {
        const pairId = [miss.id, sight.id].sort().join('_');

        // Skip if dismissed or already confirmed
        if (dismissedMatchIds.includes(pairId)) return;

        // 7-FACTOR MATCHING ENGINE
        let visual = 0;
        let distinctive = 0;
        let geographic = 0;
        let chronological = 0;
        let ageSex = 0;
        let accessory = 0;
        let human = 0;
        const reasons: string[] = [];

        // 1. Visual Coat Color (Max 20 pts)
        const colA = (miss.catProfile?.color || miss.catDescription?.color || "").toLowerCase();
        const colB = (sight.catProfile?.color || sight.catDescription?.color || "").toLowerCase();
        
        const basicColors = ['orange', 'ginger', 'black', 'white', 'grey', 'gray', 'tabby', 'tuxedo', 'calico', 'tortie'];
        const matchedColors = basicColors.filter(c => colA.includes(c) && colB.includes(c));
        
        if (matchedColors.length > 0) {
          visual = Math.min(20, matchedColors.length * 10);
          reasons.push(`Overlapping coat colors detected: [${matchedColors.join(', ')}]`);
        } else if (colA && colB) {
          visual = 5; // general potential overlap
        }

        // 2. Distinctive Hallmarks (Max 20 pts)
        const distA = (miss.catProfile?.distinctiveFeatures || miss.catDescription?.distinctiveFeatures || "").toLowerCase();
        const distB = (sight.catProfile?.distinctiveFeatures || sight.catDescription?.distinctiveFeatures || "").toLowerCase();
        const keywords = ['notch', 'socks', 'mittens', 'freckle', 'bell', 'collar', 'stripe', 'swirl', 'spot', 'bib', 'left ear', 'right ear'];
        const matchedMarks = keywords.filter(k => distA.includes(k) && distB.includes(k));

        if (matchedMarks.length > 0) {
          distinctive = Math.min(20, matchedMarks.length * 10);
          reasons.push(`Distinctive feature match: [${matchedMarks.join(', ')}]`);
        }

        // 3. Geographic Proximity (Max 20 pts)
        const distKm = getDistanceKm(miss.location.lat, miss.location.lng, sight.location.lat, sight.location.lng);
        if (distKm <= 0.6) {
          geographic = 20;
          reasons.push(`Extremely close range (${distKm.toFixed(2)} km)`);
        } else if (distKm <= 1.5) {
          geographic = 15;
          reasons.push(`Highly plausible walking range (${distKm.toFixed(2)} km)`);
        } else if (distKm <= 4.0) {
          geographic = 8;
          reasons.push(`Moderate geographic proximity (${distKm.toFixed(2)} km)`);
        } else if (distKm <= 10.0) {
          geographic = 3;
        }

        // 4. Report Chronology (Max 15 pts)
        const hrsDiff = Math.abs(new Date(miss.reportedAt).getTime() - new Date(sight.reportedAt).getTime()) / (1000 * 60 * 60);
        if (hrsDiff <= 24) {
          chronological = 15;
          reasons.push(`Chronological overlap within 24 hours`);
        } else if (hrsDiff <= 72) {
          chronological = 11;
          reasons.push(`Chronological overlap within 3 days`);
        } else if (hrsDiff <= 168) {
          chronological = 6;
          reasons.push(`Chronological overlap within 1 week`);
        } else {
          chronological = 2;
        }

        // 5. Sex / Age Consistency (Max 10 pts)
        const ageA = (miss.catProfile?.condition || "").toLowerCase();
        const ageB = (sight.catProfile?.condition || "").toLowerCase();
        if (ageA && ageB && ageA.includes('kitten') && ageB.includes('kitten')) {
          ageSex = 10;
          reasons.push(`Consistent age tier (Both kittens)`);
        } else if (ageA.includes('adult') && ageB.includes('adult')) {
          ageSex = 8;
        } else {
          ageSex = 5; // standard baseline
        }

        // 6. Collars & Accessories (Max 10 pts)
        const accA = distA.includes('collar') || colA.includes('collar');
        const accB = distB.includes('collar') || colB.includes('collar');
        if (accA && accB) {
          accessory = 10;
          reasons.push(`Both reports mention neck collars`);
        }

        // 7. Human notes similarity (Max 10 pts)
        const notesA = miss.notes.toLowerCase();
        const notesB = sight.notes.toLowerCase();
        const descKeywords = ['skittish', 'scared', 'hungry', 'gentle', 'crying', 'friendly', 'meow', 'limp'];
        const matchedNotes = descKeywords.filter(k => notesA.includes(k) && notesB.includes(k));
        if (matchedNotes.length > 0) {
          human = Math.min(10, matchedNotes.length * 5);
          reasons.push(`Aligning behavioral descriptions: [${matchedNotes.join(', ')}]`);
        }

        const rawScore = visual + distinctive + geographic + chronological + ageSex + accessory + human;
        const finalScore = Math.min(99, Math.max(12, rawScore));

        pairs.push({
          id: pairId,
          incA: miss,
          incB: sight,
          score: finalScore,
          reasons,
          details: { visual, distinctive, geographic, chronological, ageSex, accessory, human }
        });
      });
    });

    return pairs.sort((a, b) => b.score - a.score);
  }, [incidents, dismissedMatchIds]);

  // CONFIRM CONNECTION HANDLER
  const handleConfirmMatchAction = (pairId: string, idA: string, idB: string) => {
    // 1. Mark both incidents as VERIFIED
    onUpdateIncidentStatus(idA, IncidentStatus.VERIFIED);
    onUpdateIncidentStatus(idB, IncidentStatus.VERIFIED);

    const incA = incidents.find(i => i.id === idA);
    const incB = incidents.find(i => i.id === idB);

    const titleA = incA?.title || `INC-${idA.substring(0,4)}`;
    const titleB = incB?.title || `INC-${idB.substring(0,4)}`;

    // 2. Add dynamic linked timelines if handler available
    if (onAddIncidentUpdate) {
      onAddIncidentUpdate(idA, {
        author: "PurrSignal matching",
        message: `Matched successfully with sighting [${titleB}] by manual coordinator validation. Sighting data linked for rescue dispatch.`,
        statusChanged: IncidentStatus.VERIFIED
      });
      onAddIncidentUpdate(idB, {
        author: "PurrSignal matching",
        message: `Sighting verified to match missing report [${titleA}] by manual coordinator validation. Core records are bound.`,
        statusChanged: IncidentStatus.VERIFIED
      });
    }

    setConfirmedMatchIds(prev => [...prev, pairId]);
    if (addToast) {
      addToast("Connection Confirmed", `Successfully verified connection! Sighting of [${titleB}] has been bound to the missing report of [${titleA}]. Handshakes logged.`, "success");
    } else {
      alert(`Successfully verified connection! Sighting of [${titleB}] has been bound to the missing report of [${titleA}]. Handshakes logged.`);
    }
  };

  const handleDismissMatchAction = (pairId: string) => {
    setDismissedMatchIds(prev => [...prev, pairId]);
  };

  // ACTIVE OPERATIONS WORKSPACE FILTERING
  const filteredMissions = useMemo(() => {
    // Active / Ongoing missions
    const active = missions.filter(m => m.status !== 'completed' && m.status !== 'cancelled');

    return active.filter(m => {
      const linkedInc = incidents.find(i => i.id === m.incidentId);
      const incStatus = linkedInc ? normalizeStatus(linkedInc.status) : null;

      if (opsFilter === 'all') return true;
      if (opsFilter === 'critical') return m.priority === 'critical' || m.priority === Urgency.CRITICAL;
      if (opsFilter === 'verification') return incStatus === IncidentStatus.NEEDS_VERIFICATION;
      if (opsFilter === 'search') return m.status === 'assigned' || m.status === 'en_route' || m.status === 'active';
      if (opsFilter === 'rescue') return m.status === 'on_scene';
      if (opsFilter === 'transport') return m.status === 'transporting' || m.status === 'cat_secured';
      if (opsFilter === 'safe') return m.status === 'completed' || incStatus === IncidentStatus.SAFE;
      return true;
    });
  }, [missions, incidents, opsFilter]);

  // Launch Equipment Add
  const handleAddEquipment = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && equipInput.trim()) {
      e.preventDefault();
      if (!equipmentList.includes(equipInput.trim())) {
        setEquipmentList([...equipmentList, equipInput.trim()]);
      }
      setEquipInput('');
    }
  };

  const handleAddEquipmentBtn = () => {
    if (equipInput.trim() && !equipmentList.includes(equipInput.trim())) {
      setEquipmentList([...equipmentList, equipInput.trim()]);
    }
    setEquipInput('');
  };

  const removeEquipmentItem = (index: number) => {
    setEquipmentList(equipmentList.filter((_, i) => i !== index));
  };

  const handleToggleRescuerSelect = (name: string) => {
    if (assignedRescuers.includes(name)) {
      setAssignedRescuers(assignedRescuers.filter(r => r !== name));
    } else {
      setAssignedRescuers([...assignedRescuers, name]);
    }
  };

  // Launch form submit
  const handleLaunchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncidentId || !missionTitle || assignedRescuers.length === 0) {
      if (addToast) {
        addToast("Launch Failed", "Please fill in the mission title, select an incident, and assign at least one rescuer.", "warning");
      } else {
        alert("Please fill in the mission title, select an incident, and assign at least one rescuer.");
      }
      return;
    }

    onCreateMission({
      incidentId: selectedIncidentId,
      title: missionTitle,
      status: 'assigned', // Default standard stage
      assignedRescuers,
      priority: missionPriority,
      equipmentNeeded: equipmentList.length > 0 ? equipmentList : ["Cat Carrier", "Soft Towels", "Snappy Humane Trap"]
    });

    // Auto update incident status
    onUpdateIncidentStatus(selectedIncidentId, IncidentStatus.MISSION_CREATED);

    // Reset Form
    setSelectedIncidentId('');
    setMissionTitle('');
    setMissionPriority('medium');
    setAssignedRescuers([]);
    setEquipmentList([]);
    setEquipInput('');
    setIsLaunchModalOpen(false);
  };

  // Manage Ops Modal trigger
  const triggerManageOps = (mission: Mission) => {
    setActiveManageMission(mission);
    setIsManageModalOpen(true);
  };

  // Manage Transmission submit
  const handleTransmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeManageMission || !transmissionMsg.trim()) return;

    onAddMissionUpdate(activeManageMission.id, transmissionMsg, transmissionAuthor);
    
    // Refresh local managing reference with the updated list
    const updatedMission = missions.find(m => m.id === activeManageMission.id);
    if (updatedMission) {
      setActiveManageMission(updatedMission);
    }
    setTransmissionMsg('');
  };

  // COMPLETE / RESOLVE MISSION
  const handleCompleteMission = (mId: string, incId: string) => {
    onUpdateMissionStatus(mId, 'completed');
    onUpdateIncidentStatus(incId, IncidentStatus.SAFE);

    if (onAddIncidentUpdate) {
      onAddIncidentUpdate(incId, {
        author: "Tactical Coordinator",
        message: "Rescue mission successfully COMPLETED. Cat secured and safe in foster care.",
        statusChanged: IncidentStatus.SAFE
      });
    }

    setIsManageModalOpen(false);
    setActiveManageMission(null);
  };

  // MANAGE STEPPED LIFECYCLE TRANSITION (Prompt 6)
  const handleTransitionState = (nextStatus: string) => {
    if (!activeManageMission) return;

    // Save transition in mission
    onUpdateMissionStatus(activeManageMission.id, nextStatus);

    // Sync state back to linked incident immediately
    let mappedIncStatus = IncidentStatus.RESCUE_IN_PROGRESS;
    if (nextStatus === 'assigned') mappedIncStatus = IncidentStatus.MISSION_CREATED;
    if (nextStatus === 'completed') mappedIncStatus = IncidentStatus.SAFE;

    onUpdateIncidentStatus(activeManageMission.incidentId, mappedIncStatus);

    // Log update inside mission
    onAddMissionUpdate(
      activeManageMission.id, 
      `Mission status advanced to: [${nextStatus.toUpperCase()}]. Linked incident updated to ${mappedIncStatus.replace('_', ' ')}.`, 
      "Operational Command"
    );

    // Refresh active managed reference
    const updated = missions.find(m => m.id === activeManageMission.id);
    if (updated) {
      setActiveManageMission(updated);
    }
  };

  // MANAGE LOGISTICS EQUIPMENT ADD/REMOVE INSIDE OPERATIONAL COMMAND
  const handleAddLogisticsGear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeManageMission || !newGearInput.trim()) return;

    const gear = newGearInput.trim();
    if (!activeManageMission.equipmentNeeded.includes(gear)) {
      activeManageMission.equipmentNeeded.push(gear);
      onAddMissionUpdate(activeManageMission.id, `Logistics dispatch: Added equipment item "${gear}" to checklist.`, "Logistics Hub");
    }

    setNewGearInput('');
    const updated = missions.find(m => m.id === activeManageMission.id);
    if (updated) {
      setActiveManageMission(updated);
    }
  };

  const handleRemoveLogisticsGear = (itemToRemove: string) => {
    if (!activeManageMission) return;

    activeManageMission.equipmentNeeded = activeManageMission.equipmentNeeded.filter(i => i !== itemToRemove);
    onAddMissionUpdate(activeManageMission.id, `Logistics dispatch: Removed equipment item "${itemToRemove}" from checklist.`, "Logistics Hub");

    const updated = missions.find(m => m.id === activeManageMission.id);
    if (updated) {
      setActiveManageMission(updated);
    }
  };

  const handleAddRescuerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescuerName || !rescuerContact) {
      if (addToast) {
        addToast("Registration Failed", "Please enter a name and contact number.", "warning");
      } else {
        alert("Please enter a name and contact number.");
      }
      return;
    }

    onAddRescuer({
      name: rescuerName,
      role: rescuerRole,
      contact: rescuerContact,
      status: 'available',
      location: rescuerLocation || "Dispatch Center Area"
    });

    setRescuerName('');
    setRescuerContact('');
    setRescuerLocation('');
    setIsAddRescuerModalOpen(false);
  };

  return (
    <div id="mission-control-root" className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-16">
      
      {/* OPERATIONS HEADER OVERVIEW */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-wider text-slate-850 dark:text-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-7 h-7 text-rose-500" />
                PurrSignal Mission Control
              </h1>
              <p className="text-xs text-slate-450 dark:text-slate-500 font-mono mt-1">
                SECURE NETWORK ACCESS | ACTIVE COORDINATION FEED
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                id="ops-btn-add-rescuer"
                onClick={() => setIsAddRescuerModalOpen(true)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
              >
                <Users className="w-4 h-4 text-amber-500" />
                Register Volunteer
              </button>

              <button
                id="ops-btn-launch-mission"
                onClick={() => setIsLaunchModalOpen(true)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg shadow-lg shadow-rose-500/10 hover:shadow-rose-500/20 transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                Launch Rescue Operation
              </button>
            </div>
          </div>

          {/* TELEMETRY STATS GRID */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            
            <div className="bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/60 p-4 rounded-xl shadow-sm dark:shadow-none flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-500 dark:text-indigo-400 border border-indigo-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block uppercase font-bold tracking-wider">Triage Queue</span>
                <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-100">{openIncidentsCount} Open Incidents</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/60 p-4 rounded-xl shadow-sm dark:shadow-none flex items-center gap-4">
              <div className="p-3 bg-rose-500/10 rounded-lg text-rose-550 dark:text-rose-400 border border-rose-500/20">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block uppercase font-bold tracking-wider">Live Tactical Operations</span>
                <span className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400">{activeMissionsCount} Active Missions</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/60 p-4 rounded-xl shadow-sm dark:shadow-none flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block uppercase font-bold tracking-wider">Rescuers On Call</span>
                <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">{availableRescuersCount} Available</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/60 p-4 rounded-xl shadow-sm dark:shadow-none flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Cat className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block uppercase font-bold tracking-wider">Feline Reunions</span>
                <span className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">342 Safe Recoveries</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* OPERATIONS WORKSPACE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* TABS SELECTOR */}
        <div className="flex border-b border-slate-200 dark:border-slate-800/60 gap-4 mb-6 overflow-x-auto scrollbar-none">
          <button
            id="tab-ops"
            onClick={() => setActiveTab('ops')}
            className={`pb-4 px-1 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'ops' 
                ? 'border-rose-500 text-rose-500 dark:text-rose-400' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            Active Missions ({missions.filter(m => m.status !== 'completed' && m.status !== 'cancelled').length})
          </button>

          <button
            id="tab-matches"
            onClick={() => setActiveTab('matches')}
            className={`pb-4 px-1 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'matches' 
                ? 'border-purple-500 text-purple-600 dark:text-purple-400 font-extrabold' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-500 dark:text-purple-400 animate-pulse" />
            Possible Matches ({possibleMatches.length})
          </button>

          <button
            id="tab-feed"
            onClick={() => setActiveTab('feed')}
            className={`pb-4 px-1 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'feed' 
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Incident Sighting Queue ({incidents.filter(i => i.status !== 'reunited' && i.status !== 'recovered' && i.status !== 'safe').length})
          </button>

          <button
            id="tab-rescuers"
            onClick={() => setActiveTab('rescuers')}
            className={`pb-4 px-1 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'rescuers' 
                ? 'border-amber-500 text-amber-600 dark:text-amber-400' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Registered Rescuers ({rescuers.length})
          </button>
        </div>

        {/* TAB 1: ACTIVE MISSIONS OPERATIONS WITH COLUMNS FILTER (Prompt 6) */}
        {activeTab === 'ops' && (
          <div className="space-y-6">
            
            {/* SUB-STATUS KANBAN CATEGORY PILTERS */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block mb-2.5 flex items-center gap-1">
                <ListFilter className="w-3.5 h-3.5 text-rose-500" />
                Filter Workspace Columns
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'All Operations', count: missions.filter(m => m.status !== 'completed' && m.status !== 'cancelled').length },
                  { id: 'critical', label: '🔥 Critical Triage', count: missions.filter(m => (m.status !== 'completed' && m.status !== 'cancelled') && (m.priority === 'critical' || m.priority === Urgency.CRITICAL)).length },
                  { id: 'verification', label: '🔍 Needs Verification', count: missions.filter(m => {
                      const linked = incidents.find(i => i.id === m.incidentId);
                      return linked && normalizeStatus(linked.status) === IncidentStatus.NEEDS_VERIFICATION;
                    }).length 
                  },
                  { id: 'search', label: '🛰️ Active Search', count: missions.filter(m => m.status === 'assigned' || m.status === 'en_route' || m.status === 'active').length },
                  { id: 'rescue', label: '🎯 Tactical Rescue', count: missions.filter(m => m.status === 'on_scene').length },
                  { id: 'transport', label: '🚚 Transport in Progress', count: missions.filter(m => m.status === 'transporting' || m.status === 'cat_secured').length }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setOpsFilter(item.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all border ${
                      opsFilter === item.id 
                        ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/10' 
                        : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {item.label} ({item.count})
                  </button>
                ))}
              </div>
            </div>

            {filteredMissions.length === 0 ? (
              <EmptyState
                title="No Operational Units match filter"
                description="All clear in this sector! Select another tactical filter or register fresh sightings."
                actionLabel="Establish Mission"
                onAction={() => setIsLaunchModalOpen(true)}
              />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMissions.map(m => (
                  <MissionCard
                    key={m.id}
                    mission={m}
                    onViewIncident={onViewIncident}
                    onManageMission={triggerManageOps}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AI-ASSISTED MATCHING COMPARATOR (Prompt 5) */}
        {activeTab === 'matches' && (
          <div className="space-y-6">
            
            <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 p-4 rounded-xl flex items-start gap-3.5">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-purple-700 dark:text-purple-300">Intelligent Possible Matching Matrix</h3>
                <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed">
                  This panel computes highly explainable plausibility scores comparing missing cats with sightings and found cats. 
                  The system does not auto-merge records to avoid dispatch errors. Review comparison details below to manually link cases.
                </p>
              </div>
            </div>

            {possibleMatches.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center rounded-2xl shadow-sm dark:shadow-none">
                <Cat className="w-12 h-12 text-slate-400 dark:text-slate-700 mx-auto stroke-1 mb-3" />
                <h3 className="font-bold text-sm text-slate-750 dark:text-slate-300">All Candidate Pairs Triage Complete</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  No active open missing profiles match filed sightings or found cats currently. Check back as new reports arrive.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {possibleMatches.map(match => {
                  const pId = match.id;
                  const { incA, incB, score, reasons } = match;

                  const colorA = incA.catProfile?.color || incA.catDescription?.color || "Unknown";
                  const colorB = incB.catProfile?.color || incB.catDescription?.color || "Unknown";
                  const breedA = incA.catProfile?.breed || "DSH (Domestic Short Hair)";
                  const breedB = incB.catProfile?.breed || "DSH (Domestic Short Hair)";
                  const featuresA = incA.catProfile?.distinctiveFeatures || incA.catDescription?.distinctiveFeatures || "None noted";
                  const featuresB = incB.catProfile?.distinctiveFeatures || incB.catDescription?.distinctiveFeatures || "None noted";

                  return (
                    <div key={pId} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-lg dark:shadow-2xl flex flex-col">
                      
                      {/* HEADER PLOTS MATCH MATCH METRIC */}
                      <div className="bg-slate-50 dark:bg-slate-950 px-4 py-3 border-b border-slate-200 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded border border-purple-500/20 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            AI Match Score: {score}%
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            Ref: {pId.substring(0,8)}
                          </span>
                        </div>

                        {/* MATCH TRUST METRIC SLIDER BAR */}
                        <div className="flex items-center gap-2 w-full sm:w-48">
                          <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                score >= 80 ? 'bg-emerald-500' :
                                score >= 60 ? 'bg-purple-500' :
                                score >= 40 ? 'bg-amber-500' : 'bg-slate-600'
                              }`} 
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <span className={`text-[10px] font-mono font-black ${
                            score >= 80 ? 'text-emerald-400' :
                            score >= 60 ? 'text-purple-400' :
                            score >= 40 ? 'text-amber-400' : 'text-slate-400'
                          }`}>
                            {score >= 80 ? 'EXCELLENT' : score >= 60 ? 'PROBABLE' : score >= 40 ? 'POSSIBLE' : 'LOW'}
                          </span>
                        </div>
                      </div>

                      {/* SIDE-BY-SIDE MATCHING PANELS */}
                      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800/60">
                        
                        {/* CASE A: MISSING REPORT */}
                        <div className="p-5 space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[9px] font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest bg-purple-500/10 px-1.5 py-0.5 rounded">
                                Original Missing Report
                              </span>
                              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1 flex items-center gap-1.5">
                                <Cat className="w-4 h-4 text-purple-500" />
                                {incA.title}
                              </h4>
                              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block mt-0.5">ID: {incA.id}</span>
                            </div>
                            <span className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 px-2.5 py-1 rounded border border-slate-250 dark:border-slate-800">
                              {new Date(incA.reportedAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex gap-4">
                            {incA.evidence?.[0]?.url && (
                              <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex-shrink-0">
                                <img src={incA.evidence[0].url} alt="Missing profile photo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                            )}
                            <div className="space-y-1 text-xs text-slate-650 dark:text-slate-300">
                              <div><span className="text-slate-400 dark:text-slate-500">Coat Color:</span> <strong className="text-slate-800 dark:text-slate-200">{colorA}</strong></div>
                              <div><span className="text-slate-400 dark:text-slate-500">Breed/Pattern:</span> <span className="text-slate-500 dark:text-slate-400">{breedA}</span></div>
                              <div><span className="text-slate-400 dark:text-slate-500">Hallmarks:</span> <span className="text-slate-500 dark:text-slate-400">{featuresA}</span></div>
                              <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-0.5 mt-1.5">
                                <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-600" />
                                <span className="truncate">{incA.location.name}</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-xs text-slate-650 dark:text-slate-400 bg-slate-50/60 dark:bg-slate-950/40 p-2.5 rounded-lg border border-slate-150 dark:border-slate-800/40 italic">
                            "{incA.notes}"
                          </p>
                        </div>

                        {/* CASE B: SIGHTING / FOUND REPORT */}
                        <div className="p-5 space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[9px] font-mono font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest bg-amber-500/10 px-1.5 py-0.5 rounded">
                                Sighting / Found Sighting
                              </span>
                              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1 flex items-center gap-1.5">
                                <Eye className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                                {incB.title}
                              </h4>
                              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block mt-0.5">ID: {incB.id}</span>
                            </div>
                            <span className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 px-2.5 py-1 rounded border border-slate-250 dark:border-slate-800">
                              {new Date(incB.reportedAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex gap-4">
                            {incB.evidence?.[0]?.url && (
                              <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex-shrink-0">
                                <img src={incB.evidence[0].url} alt="Sighting photo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                            )}
                            <div className="space-y-1 text-xs text-slate-650 dark:text-slate-300">
                              <div><span className="text-slate-400 dark:text-slate-500">Sighted Color:</span> <strong className="text-slate-800 dark:text-slate-200">{colorB}</strong></div>
                              <div><span className="text-slate-400 dark:text-slate-500">Breed/Pattern:</span> <span className="text-slate-500 dark:text-slate-400">{breedB}</span></div>
                              <div><span className="text-slate-400 dark:text-slate-500">Sighted Hallmarks:</span> <span className="text-slate-500 dark:text-slate-400">{featuresB}</span></div>
                              <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-0.5 mt-1.5">
                                <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-600" />
                                <span className="truncate">{incB.location.name}</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-xs text-slate-650 dark:text-slate-400 bg-slate-50/60 dark:bg-slate-950/40 p-2.5 rounded-lg border border-slate-150 dark:border-slate-800/40 italic">
                            "{incB.notes}"
                          </p>
                        </div>

                      </div>

                      {/* FOOTER PLAUSIBILITY REASONS AND ACTIONS */}
                      <div className="bg-slate-50 dark:bg-slate-950/80 p-4 border-t border-slate-200 dark:border-slate-800/55 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-450 dark:text-slate-500 block">Explainable Match Factors</span>
                          <div className="flex flex-wrap gap-1.5">
                            {reasons.map((r, i) => (
                              <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400 rounded">
                                <Check className="w-3 h-3 text-emerald-500 dark:text-emerald-400" /> {r}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* ACTIONS CONTROLS */}
                        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                          <button
                            id={`match-btn-dismiss-${pId}`}
                            onClick={() => handleDismissMatchAction(pId)}
                            className="px-3.5 py-1.5 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs font-semibold rounded-lg text-rose-500 dark:text-rose-400 transition-all flex items-center gap-1"
                            title="Dismiss Match"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Not Same Cat
                          </button>

                          <button
                            id={`match-btn-confirm-${pId}`}
                            onClick={() => handleConfirmMatchAction(pId, incA.id, incB.id)}
                            className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg shadow-lg shadow-purple-600/20 transition-all flex items-center gap-1"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            Confirm Connection
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* TAB 3: INCIDENT SIGHTING QUEUE */}
        {activeTab === 'feed' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Priority Triage Queue</h3>
                <p className="text-xs text-slate-500">Unresolved incidents matching community logs. Click to view detailed analysis and manage status.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {incidents.filter(i => {
                const norm = normalizeStatus(i.status);
                return norm !== IncidentStatus.REUNITED && norm !== IncidentStatus.CLOSED && norm !== IncidentStatus.SAFE;
              }).map(inc => (
                <IncidentCard
                  key={inc.id}
                  incident={inc}
                  onClick={onViewIncident}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: REGISTERED RESCUERS VOLUNTEER LIST */}
        {activeTab === 'rescuers' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rescuers.map(r => (
                <div key={r.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-start gap-3.5 relative overflow-hidden shadow-sm dark:shadow-none">
                  <div className={`absolute top-0 right-0 bottom-0 w-1 ${
                    r.status === 'available' ? 'bg-emerald-500' :
                    r.status === 'on_mission' ? 'bg-amber-500' : 'bg-slate-700'
                  }`} />

                  <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60">
                    <Users className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                  </div>

                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{r.name}</h4>
                      <span className={`w-2 h-2 rounded-full ${
                        r.status === 'available' ? 'bg-emerald-500' :
                        r.status === 'on_mission' ? 'bg-amber-500' : 'bg-slate-500'
                      }`} />
                    </div>
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-450 dark:text-slate-500 block">
                      {r.role.replace('_', ' ')}
                    </span>
                    <div className="text-xs text-slate-650 dark:text-slate-400 mt-2">
                      <div>Contact: {r.contact}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Base: {r.location}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* =======================================================
          MODAL: LAUNCH NEW MISSION
      ======================================================= */}
      <Modal 
        isOpen={isLaunchModalOpen} 
        onClose={() => setIsLaunchModalOpen(false)} 
        title="Launch Tactical Operation"
        maxWidth="lg"
      >
        <form onSubmit={handleLaunchSubmit} className="space-y-5 text-slate-300">
          <div className="space-y-4">
            
            {/* INCIDENT LINK */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Link Open Incident Sighting <span className="text-red-500">*</span>
              </label>
              {unassignedIncidents.length === 0 ? (
                <div className="p-3 bg-red-950/25 border border-red-900/50 rounded-lg text-xs text-red-300 text-left">
                  No open unassigned incidents. Please file an incident report first before establishing a tactical operation.
                </div>
              ) : (
                <select
                  id="link-incident-select"
                  value={selectedIncidentId}
                  onChange={(e) => {
                    setSelectedIncidentId(e.target.value);
                    const chosen = incidents.find(i => i.id === e.target.value);
                    if (chosen) {
                      setMissionTitle(`Rescue Sighting: ${chosen.title}`);
                      setMissionPriority(chosen.urgency as any);
                    }
                  }}
                  required
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-amber-500 text-slate-300"
                >
                  <option value="">-- Choose Incident to Resolve --</option>
                  {unassignedIncidents.map(i => (
                    <option key={i.id} value={i.id}>
                      [{i.urgency.toUpperCase()}] {i.title} - {i.location.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* TITLE */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Mission Operation Title <span className="text-red-500">*</span>
              </label>
              <input
                id="mission-title-input"
                type="text"
                required
                value={missionTitle}
                onChange={(e) => setMissionTitle(e.target.value)}
                placeholder="e.g. Broadway Sewer Drain Calico Extrication"
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-amber-500 text-white"
              />
            </div>

            {/* PRIORITY & ASSIGNMENT */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Tactical Priority
                </label>
                <select
                  id="mission-priority-select"
                  value={missionPriority}
                  onChange={(e) => setMissionPriority(e.target.value as UrgencyLevel)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-amber-500 text-slate-300"
                >
                  <option value="low">Low (Routine)</option>
                  <option value="medium">Medium (Moderate)</option>
                  <option value="high">High (Threatening)</option>
                  <option value="critical">Critical (Immediate Life Risk)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Assign Responder Squad <span className="text-red-500">*</span>
                </label>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 max-h-32 overflow-y-auto space-y-1.5 text-left">
                  {rescuers.filter(r => r.role === 'field_rescuer' || r.role === 'coordinator').map(r => {
                    const isSelected = assignedRescuers.includes(r.name);
                    return (
                      <label key={r.id} className="flex items-center gap-2 text-xs cursor-pointer select-none">
                        <input
                          id={`checkbox-rescuer-${r.id}`}
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleRescuerSelect(r.name)}
                          className="rounded text-rose-600 focus:ring-rose-500 accent-rose-600"
                        />
                        <span className={r.status === 'on_mission' ? 'text-amber-500/85 font-medium text-[11px]' : 'text-slate-200'}>
                          {r.name} ({r.status})
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* EQUIPMENT LIST */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Required Equipment Logistics
              </label>
              <div className="flex gap-2">
                <input
                  id="equip-input"
                  type="text"
                  value={equipInput}
                  onChange={(e) => setEquipInput(e.target.value)}
                  onKeyDown={handleAddEquipment}
                  placeholder="Type item and press Enter (e.g. Net, Humane Trap, Carrier)"
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-amber-500 text-white"
                />
                <button
                  id="btn-add-equip"
                  type="button"
                  onClick={handleAddEquipmentBtn}
                  className="px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-slate-300"
                >
                  Add
                </button>
              </div>

              {/* Badges List */}
              {equipmentList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {equipmentList.map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700/60 text-[10px] font-mono text-slate-300">
                      {item}
                      <button 
                        id={`remove-equip-${i}`}
                        type="button" 
                        onClick={() => removeEquipmentItem(i)}
                        className="text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4 mt-4">
            <button
              id="btn-launch-cancel"
              type="button"
              onClick={() => setIsLaunchModalOpen(false)}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-slate-400"
            >
              Cancel
            </button>
            <button
              id="btn-launch-submit"
              type="submit"
              disabled={unassignedIncidents.length === 0}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow-lg shadow-rose-500/20"
            >
              Dispatch Operation
            </button>
          </div>
        </form>
      </Modal>

      {/* =======================================================
          MODAL: UPGRADED OPERATIONAL TACTICAL COMMAND DETAIL PANEL (Prompt 6)
      ======================================================= */}
      <Modal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        title="Tactical Operations Command Board"
        maxWidth="xl"
      >
        {activeManageMission && (() => {
          const linkedInc = incidents.find(i => i.id === activeManageMission.incidentId);
          const color = linkedInc?.catProfile?.color || linkedInc?.catDescription?.color || "Unknown";
          const traits = linkedInc?.catProfile?.distinctiveFeatures || linkedInc?.catDescription?.distinctiveFeatures || "None noted";
          const pic = linkedInc?.evidence?.[0]?.url;

          return (
            <div className="space-y-6 text-slate-300 text-left">
              
              {/* MISSION INFO BLOCK */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 relative overflow-hidden">
                <div className="absolute right-3 top-3 opacity-10 pointer-events-none">
                  <ShieldAlert className="w-24 h-24 text-rose-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-widest bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    MISSION: MSN-{activeManageMission.id.split('_')[1] || activeManageMission.id.substring(0,6)}
                  </span>
                  <UrgencyIndicator urgency={activeManageMission.priority} />
                </div>
                <h4 className="text-base font-black text-slate-100 uppercase tracking-wide">{activeManageMission.title}</h4>
                <div className="text-[11px] text-slate-500 font-mono flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span>LAUNCHED: {new Date(activeManageMission.createdAt).toLocaleString()}</span>
                  <span>RESPONDERS: {activeManageMission.assignedRescuers.join(', ')}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                
                {/* LEFT COLUMN: STEPS & STATE TRANSITIONS (Prompt 6) */}
                <div className="space-y-5">
                  
                  {/* LIFECYCLE TRACKER CHRONOLOGY */}
                  <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl space-y-4">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-4 h-4 text-purple-400" />
                      Rescue Lifecycle Transitions
                    </h5>

                    {/* Step Visualizer */}
                    <div className="relative pl-6 space-y-4 border-l border-slate-800">
                      {[
                        { id: 'assigned', label: 'Assigned / Initial dispatch' },
                        { id: 'en_route', label: 'En Route to target zone' },
                        { id: 'on_scene', label: 'On Scene establishing sweeps' },
                        { id: 'cat_secured', label: 'Cat Secured inside traps/nets' },
                        { id: 'transporting', label: 'Transporting to vet clinic/shelter' },
                        { id: 'completed', label: 'Completed & Safe' }
                      ].map((step, idx) => {
                        const isCurrent = activeManageMission.status === step.id;
                        // Basic index hierarchy
                        const stepsOrder = ['assigned', 'en_route', 'on_scene', 'cat_secured', 'transporting', 'completed'];
                        const curIdx = stepsOrder.indexOf(activeManageMission.status || 'assigned');
                        const isPassed = stepsOrder.indexOf(step.id) < curIdx;

                        return (
                          <div key={step.id} className="relative text-xs">
                            {/* Bullet Circle Indicator */}
                            <span className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center border font-bold text-[9px] ${
                              isCurrent ? 'bg-purple-600 border-purple-400 text-white shadow-md shadow-purple-500/20 scale-110' :
                              isPassed ? 'bg-emerald-600 border-emerald-400 text-white' :
                              'bg-slate-950 border-slate-800 text-slate-500'
                            }`}>
                              {isPassed ? '✓' : idx + 1}
                            </span>
                            
                            <div className="flex items-center justify-between">
                              <span className={`font-semibold tracking-wide ${isCurrent ? 'text-purple-400 font-bold' : isPassed ? 'text-slate-400' : 'text-slate-550'}`}>
                                {step.label}
                              </span>
                              {!isCurrent && !isPassed && stepsOrder.indexOf(step.id) === curIdx + 1 && (
                                <button
                                  id={`transition-to-${step.id}`}
                                  type="button"
                                  onClick={() => handleTransitionState(step.id)}
                                  className="px-2.5 py-1 bg-slate-900 border border-purple-500/25 hover:border-purple-500 rounded-lg text-[10px] text-purple-300 font-bold hover:bg-slate-850 flex items-center gap-0.5 transition-colors"
                                >
                                  Advance
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* LOGISTICS EQUIPMENT TRACKER WITH DYNAMIC ADD/REMOVE */}
                  <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl space-y-3">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Wrench className="w-4 h-4 text-amber-500" />
                      Assigned Rescue Gear Logistics
                    </h5>

                    {/* Checkbox badge checklist */}
                    {activeManageMission.equipmentNeeded.length === 0 ? (
                      <p className="text-xs text-slate-500">No equipment logged on this mission checklist.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {activeManageMission.equipmentNeeded.map((gear, i) => (
                          <span 
                            key={i} 
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-850 text-slate-300 text-xs rounded-lg font-mono"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            {gear}
                            <button
                              id={`remove-logistics-gear-${gear}`}
                              type="button"
                              onClick={() => handleRemoveLogisticsGear(gear)}
                              className="text-slate-500 hover:text-red-400 transition-colors ml-1"
                              title={`Remove ${gear}`}
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Add Logistics Item form */}
                    <form onSubmit={handleAddLogisticsGear} className="flex gap-1.5 pt-2">
                      <input
                        id="new-logistics-gear-input"
                        type="text"
                        value={newGearInput}
                        onChange={(e) => setNewGearInput(e.target.value)}
                        placeholder="Add logistical dispatch gear..."
                        className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        id="btn-add-logistics-gear"
                        type="submit"
                        className="px-3 bg-slate-900 border border-slate-800 hover:bg-slate-850 rounded-lg text-xs text-slate-300 font-bold"
                      >
                        Add
                      </button>
                    </form>
                  </div>

                </div>

                {/* RIGHT COLUMN: LINKED CASE DETAILS, INCIDENT PREVIEW & FIELD LOGS */}
                <div className="space-y-5">
                  
                  {/* LINKED INCIDENT PORTRAIT */}
                  <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl space-y-3">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Linked Sighting Report</h5>
                    
                    {linkedInc ? (
                      <div className="space-y-3 text-xs">
                        <div className="flex gap-3">
                          {pic && (
                            <div className="w-16 h-16 rounded-xl border border-slate-800 bg-slate-900 overflow-hidden flex-shrink-0">
                              <img src={pic} alt="Incident attachment" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                          )}
                          <div className="space-y-1">
                            <h6 className="font-bold text-slate-200">{linkedInc.title}</h6>
                            <p className="text-[10px] text-slate-500">Reported at: {linkedInc.location.name}</p>
                            <p className="text-slate-400 text-[10px]">Coat: {color} | Markings: {traits}</p>
                          </div>
                        </div>

                        {/* BRIEF REPORTERS NOTE */}
                        <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-850 italic text-slate-400">
                          "{linkedInc.notes}"
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">No linked incident profile found.</p>
                    )}
                  </div>

                  {/* FIELD LOGGING TRANSMISSIONS FEED */}
                  <div className="space-y-3 bg-slate-950 border border-slate-800/80 p-4 rounded-xl">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Field Transmissions Feed</h5>
                    
                    <div className="bg-slate-900 border border-slate-850 rounded-xl p-3 h-32 overflow-y-auto space-y-2.5 font-mono text-xs">
                      {activeManageMission.updates.length === 0 ? (
                        <div className="text-slate-500 text-center py-6">No transmissions recorded yet.</div>
                      ) : (
                        activeManageMission.updates.map((up, idx) => (
                          <div key={up.id || idx} className="border-b border-slate-900 pb-2 last:border-0">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-purple-400 font-bold">[{up.author}]</span>
                              <span className="text-slate-500">{new Date(up.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-slate-300 mt-0.5 leading-relaxed">{up.message}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* SEND QUICK UPDATE */}
                    <form onSubmit={handleTransmissionSubmit} className="flex gap-1.5 pt-1">
                      <input
                        id="trans-message"
                        type="text"
                        required
                        value={transmissionMsg}
                        onChange={(e) => setTransmissionMsg(e.target.value)}
                        placeholder="Send field update directive..."
                        className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-850 text-xs rounded-lg text-slate-200 focus:outline-none"
                      />
                      <button
                        id="btn-send-trans"
                        type="submit"
                        className="px-3 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-bold text-white flex items-center justify-center"
                      >
                        Send
                      </button>
                    </form>
                  </div>

                </div>

              </div>

              {/* ACTION FOOTER */}
              <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider">Mission Complete Triage</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">Has the cat been safely captured and secured? Doing so completes this operation.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="btn-ops-cancel"
                    onClick={() => setIsManageModalOpen(false)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-xs text-slate-400 font-semibold"
                  >
                    Close Manager
                  </button>

                  <button
                    id="btn-ops-resolve"
                    onClick={() => handleCompleteMission(activeManageMission.id, activeManageMission.incidentId)}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Cat Secured (Complete Mission)
                  </button>
                </div>
              </div>

            </div>
          );
        })()}
      </Modal>

      {/* =======================================================
          MODAL: REGISTER RESCUER VOLUNTEER
      ======================================================= */}
      <Modal
        isOpen={isAddRescuerModalOpen}
        onClose={() => setIsAddRescuerModalOpen(false)}
        title="Register PurrSignal Responder"
        maxWidth="md"
      >
        <form onSubmit={handleAddRescuerSubmit} className="space-y-4 text-slate-300">
          <div className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Volunteer Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="rescuer-name-input"
                type="text"
                required
                value={rescuerName}
                onChange={(e) => setRescuerName(e.target.value)}
                placeholder="e.g. Dr. Ray Shaw"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-amber-500 text-white"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Tactical Role
                </label>
                <select
                  id="rescuer-role-select"
                  value={rescuerRole}
                  onChange={(e) => setRescuerRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-amber-500 text-slate-300"
                >
                  <option value="field_rescuer">Field Rescuer (Tricks & Traps)</option>
                  <option value="medical_volunteer">Medical Volunteer (Veterinary)</option>
                  <option value="coordinator">Coordinator / Dispatcher</option>
                  <option value="foster_care">Foster Provider (Shelter)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Emergency Phone Contact <span className="text-red-500">*</span>
                </label>
                <input
                  id="rescuer-contact-input"
                  type="text"
                  required
                  value={rescuerContact}
                  onChange={(e) => setRescuerContact(e.target.value)}
                  placeholder="e.g. +1 (555) 901-0012"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-amber-500 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Standard Base Sector / District Location
              </label>
              <input
                id="rescuer-location-input"
                type="text"
                value={rescuerLocation}
                onChange={(e) => setRescuerLocation(e.target.value)}
                placeholder="e.g. Downtown SF District, Marina Bay Station"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-amber-500 text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4 mt-4">
            <button
              id="btn-rescuer-cancel"
              type="button"
              onClick={() => setIsAddRescuerModalOpen(false)}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-slate-400"
            >
              Cancel
            </button>
            <button
              id="btn-rescuer-submit"
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-lg shadow-lg shadow-amber-500/20"
            >
              Register Responder
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
