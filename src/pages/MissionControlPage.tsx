import React, { useState, useMemo } from 'react';
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
  Check
} from 'lucide-react';
import { Incident, Mission, Rescuer, UrgencyLevel, IncidentStatus } from '../types';
import { StatusBadge, UrgencyIndicator, MissionCard, IncidentCard, Modal, EmptyState } from '../components/UI';

interface MissionControlPageProps {
  incidents: Incident[];
  missions: Mission[];
  rescuers: Rescuer[];
  onViewIncident: (id: string) => void;
  onCreateMission: (newMission: Omit<Mission, 'id' | 'createdAt' | 'updates'>) => void;
  onUpdateMissionStatus: (id: string, status: 'completed' | 'cancelled') => void;
  onAddMissionUpdate: (missionId: string, message: string, author: string) => void;
  onAddRescuer: (rescuer: Omit<Rescuer, 'id'>) => void;
  onUpdateIncidentStatus: (id: string, status: IncidentStatus) => void;
}

export const MissionControlPage: React.FC<MissionControlPageProps> = ({
  incidents,
  missions,
  rescuers,
  onViewIncident,
  onCreateMission,
  onUpdateMissionStatus,
  onAddMissionUpdate,
  onAddRescuer,
  onUpdateIncidentStatus
}) => {
  // Current Tab selection
  const [activeTab, setActiveTab] = useState<'feed' | 'ops' | 'rescuers'>('ops');

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

  // MANAGE OPS STATE
  const [activeManageMission, setActiveManageMission] = useState<Mission | null>(null);
  const [transmissionMsg, setTransmissionMsg] = useState('');
  const [transmissionAuthor, setTransmissionAuthor] = useState('Coordinator Elena');

  // REGISTER RESCUER FORM STATE
  const [rescuerName, setRescuerName] = useState('');
  const [rescuerRole, setRescuerRole] = useState<'field_rescuer' | 'medical_volunteer' | 'coordinator' | 'foster_care'>('field_rescuer');
  const [rescuerContact, setRescuerContact] = useState('');
  const [rescuerLocation, setRescuerLocation] = useState('');

  // FILTER UNASSIGNED INCIDENTS (incidents needing missions)
  const unassignedIncidents = useMemo(() => {
    // Incidents without active missions (e.g. status != 'mission_created' or 'rescued' etc, or simply not referenced in missions)
    const missionIncidentIds = missions.filter(m => m.status === 'active').map(m => m.incidentId);
    return incidents.filter(inc => 
      !missionIncidentIds.includes(inc.id) && 
      inc.status !== 'rescued' && 
      inc.status !== 'recovered' && 
      inc.status !== 'reunited'
    );
  }, [incidents, missions]);

  // STATS CALCULATIONS
  const openIncidentsCount = useMemo(() => {
    return incidents.filter(i => i.status !== 'reunited' && i.status !== 'recovered').length;
  }, [incidents]);

  const activeMissionsCount = useMemo(() => {
    return missions.filter(m => m.status === 'active').length;
  }, [missions]);

  const availableRescuersCount = useMemo(() => {
    return rescuers.filter(r => r.status === 'available').length;
  }, [rescuers]);

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
      alert("Please fill in the mission title, select an incident, and assign at least one rescuer.");
      return;
    }

    onCreateMission({
      incidentId: selectedIncidentId,
      title: missionTitle,
      status: 'active',
      assignedRescuers,
      priority: missionPriority,
      equipmentNeeded: equipmentList.length > 0 ? equipmentList : ["Cat Carrier", "Soft Towels"]
    });

    // Auto update incident status
    onUpdateIncidentStatus(selectedIncidentId, 'mission_created');

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

  // Complete Mission Ops Flow
  const handleCompleteMission = (mId: string, incId: string) => {
    onUpdateMissionStatus(mId, 'completed');
    onUpdateIncidentStatus(incId, 'rescued');
    setIsManageModalOpen(false);
    setActiveManageMission(null);
  };

  const handleAddRescuerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescuerName || !rescuerContact) {
      alert("Please enter a name and contact number.");
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
    <div id="mission-control-root" className="min-h-[calc(100vh-64px)] bg-slate-950 text-slate-100 font-sans pb-16">
      
      {/* OPERATIONS HEADER OVERVIEW */}
      <div className="bg-slate-900 border-b border-slate-800/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-wider text-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-7 h-7 text-rose-500" />
                PurrSignal Mission Control
              </h1>
              <p className="text-xs text-slate-500 font-mono mt-1">
                SECURE NETWORK ACCESS | ACTIVE COORDINATION FEED
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                id="ops-btn-add-rescuer"
                onClick={() => setIsAddRescuerModalOpen(true)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-slate-300 transition-colors flex items-center gap-1.5"
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
            
            <div className="bg-slate-950/80 border border-slate-800/60 p-4 rounded-xl flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold tracking-wider">Triage Queue</span>
                <span className="text-lg font-bold font-mono text-slate-100">{openIncidentsCount} Open Incidents</span>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/60 p-4 rounded-xl flex items-center gap-4">
              <div className="p-3 bg-rose-500/10 rounded-lg text-rose-400 border border-rose-500/20">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold tracking-wider">Live Tactical Operations</span>
                <span className="text-lg font-bold font-mono text-rose-400">{activeMissionsCount} Active Missions</span>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/60 p-4 rounded-xl flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold tracking-wider">Rescuers On Call</span>
                <span className="text-lg font-bold font-mono text-emerald-400">{availableRescuersCount} Available</span>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/60 p-4 rounded-xl flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20">
                <Cat className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold tracking-wider">Feline Reunions</span>
                <span className="text-lg font-bold font-mono text-amber-400">342 Safe Recoveries</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* OPERATIONS WORKSPACE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* TABS SELECTOR */}
        <div className="flex border-b border-slate-800/60 gap-4 mb-6">
          <button
            id="tab-ops"
            onClick={() => setActiveTab('ops')}
            className={`pb-4 px-1 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'ops' 
                ? 'border-rose-500 text-rose-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            Active Missions ({missions.filter(m => m.status === 'active').length})
          </button>

          <button
            id="tab-feed"
            onClick={() => setActiveTab('feed')}
            className={`pb-4 px-1 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'feed' 
                ? 'border-indigo-500 text-indigo-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Incident Sighting Queue ({incidents.filter(i => i.status !== 'reunited' && i.status !== 'recovered').length})
          </button>

          <button
            id="tab-rescuers"
            onClick={() => setActiveTab('rescuers')}
            className={`pb-4 px-1 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'rescuers' 
                ? 'border-amber-500 text-amber-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Registered Rescuers ({rescuers.length})
          </button>
        </div>

        {/* TAB 1: ACTIVE MISSIONS OPERATIONS */}
        {activeTab === 'ops' && (
          <div>
            {missions.filter(m => m.status === 'active').length === 0 ? (
              <EmptyState
                title="No Active Rescue Missions"
                description="There are currently no tactical field operations ongoing. Check the Incident Queue to dispatch teams to pending sightings."
                actionLabel="Launch Operation"
                onAction={() => setIsLaunchModalOpen(true)}
              />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {missions.filter(m => m.status === 'active').map(m => (
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

        {/* TAB 2: INCIDENT SIGHTING QUEUE */}
        {activeTab === 'feed' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div>
                <h3 className="text-sm font-bold">Priority Triage Queue</h3>
                <p className="text-xs text-slate-500">Unresolved incidents matching community logs. Click to view detailed analysis and manage status.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {incidents.filter(i => i.status !== 'reunited' && i.status !== 'recovered').map(inc => (
                <IncidentCard
                  key={inc.id}
                  incident={inc}
                  onClick={onViewIncident}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: REGISTERED RESCUERS VOLUNTEER LIST */}
        {activeTab === 'rescuers' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rescuers.map(r => (
                <div key={r.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-start gap-3.5 relative overflow-hidden">
                  <div className={`absolute top-0 right-0 bottom-0 w-1 ${
                    r.status === 'available' ? 'bg-emerald-500' :
                    r.status === 'on_mission' ? 'bg-amber-500' : 'bg-slate-700'
                  }`} />

                  <div className="p-2.5 bg-slate-800 rounded-lg text-slate-400 border border-slate-700/60">
                    <Users className="w-5 h-5 text-amber-500" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-200">{r.name}</h4>
                      <span className={`w-2 h-2 rounded-full ${
                        r.status === 'available' ? 'bg-emerald-500' :
                        r.status === 'on_mission' ? 'bg-amber-500' : 'bg-slate-500'
                      }`} />
                    </div>
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 block">
                      {r.role.replace('_', ' ')}
                    </span>
                    <div className="text-xs text-slate-400 mt-2">
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
                <div className="p-3 bg-red-950/25 border border-red-900/50 rounded-lg text-xs text-red-300">
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
                      setMissionPriority(chosen.urgency);
                    }
                  }}
                  required
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-amber-500"
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
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-amber-500"
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
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 max-h-32 overflow-y-auto space-y-1.5">
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
                        <span className={r.status === 'on_mission' ? 'text-amber-500/80 font-medium text-[11px]' : 'text-slate-200'}>
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
                  placeholder="Type item and press Enter (e.g. Net, Thermal Blanket)"
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
          MODAL: MANAGE OPS TRANSMISSIONS & RESOLUTION
      ======================================================= */}
      <Modal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        title="Tactical Operations Command"
        maxWidth="xl"
      >
        {activeManageMission && (
          <div className="space-y-6 text-slate-300">
            
            <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded">
                  MSN-{activeManageMission.id.split('_')[1] || activeManageMission.id}
                </span>
                <UrgencyIndicator urgency={activeManageMission.priority} />
              </div>
              <h4 className="text-sm font-bold text-slate-100">{activeManageMission.title}</h4>
              <p className="text-xs text-slate-500">Operation Launched: {new Date(activeManageMission.createdAt).toLocaleTimeString()}</p>
            </div>

            {/* TRANSMISSIONS BLOCK */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mission Logs & Field Transmissions</h5>
              
              <div className="bg-slate-950 border border-slate-800/60 rounded-xl p-3 h-48 overflow-y-auto space-y-3 font-mono text-xs">
                {activeManageMission.updates.length === 0 ? (
                  <div className="text-slate-500 text-center py-12">No tactical transmissions received yet.</div>
                ) : (
                  activeManageMission.updates.map((up, idx) => (
                    <div key={up.id || idx} className="border-b border-slate-900 pb-2 last:border-0">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-amber-400 font-bold">[{up.author}]</span>
                        <span className="text-slate-500">{new Date(up.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-300 mt-1 leading-relaxed">{up.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* SEND TRANSMISSION FORM */}
            <form onSubmit={handleTransmissionSubmit} className="space-y-3">
              <div className="grid sm:grid-cols-4 gap-3 items-end">
                <div className="sm:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Sender Callsign</label>
                  <input
                    id="trans-author"
                    type="text"
                    required
                    value={transmissionAuthor}
                    onChange={(e) => setTransmissionAuthor(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 text-xs rounded-lg text-slate-200"
                  />
                </div>
                <div className="sm:col-span-3 flex gap-2">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Transmission Message</label>
                    <input
                      id="trans-message"
                      type="text"
                      required
                      value={transmissionMsg}
                      onChange={(e) => setTransmissionMsg(e.target.value)}
                      placeholder="Type tactical update and send..."
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 text-xs rounded-lg text-slate-200"
                    />
                  </div>
                  <button
                    id="btn-send-trans"
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 rounded-lg text-xs font-bold text-slate-900 self-end flex items-center justify-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send
                  </button>
                </div>
              </div>
            </form>

            {/* RESOLVE SECTOR */}
            <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">Mission Complete Triage</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">Has the cat been safely captured and secured? Doing so completes this operation.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-ops-cancel"
                  onClick={() => setIsManageModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400 font-semibold"
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
        )}
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
          <div className="space-y-4">
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
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-amber-500"
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
