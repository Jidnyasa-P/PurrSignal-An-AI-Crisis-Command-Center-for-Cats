import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  Terminal, 
  Trash2, 
  FileText, 
  ShieldAlert, 
  Compass, 
  Wrench, 
  Cat, 
  Activity,
  Heart,
  User,
  ArrowRight,
  Database,
  CheckCircle,
  AlertTriangle,
  X,
  Clock,
  UserCheck
} from 'lucide-react';
import { Incident, Mission, Rescuer, IncidentStatus, MissionStatus, Urgency } from '../types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  timestamp: string;
  text: string;
  toolInvocations?: string[];
  suggestedActions?: Array<{ label: string; actionCode: string }>;
}

interface RescueCopilotPageProps {
  incidents: Incident[];
  missions: Mission[];
  rescuers: Rescuer[];
  onUpdateIncidentStatus: (id: string, status: IncidentStatus) => void;
  onUpdateMissionStatus: (id: string, status: string) => void;
  onAssignRescuer: (missionId: string, rescuerName: string) => void;
}

export const RescueCopilotPage: React.FC<RescueCopilotPageProps> = ({
  incidents = [],
  missions = [],
  rescuers = [],
  onUpdateIncidentStatus,
  onUpdateMissionStatus,
  onAssignRescuer
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m_1",
      sender: "copilot",
      timestamp: new Date().toISOString(),
      text: "Welcome to the PurrSignal AI Copilot Station. I am your specialized rescue operations consultant.\n\nI can read live application database states, synthesize incident timelines, analyze match proximities, and prepare mission briefs. Use the Quick Action Panels on the left or enter standard operational queries.",
      suggestedActions: [
        { label: "Summarize Critical Incidents", actionCode: "summarize_critical" },
        { label: "Find Unassigned High-Priority Missions", actionCode: "unassigned_missions" }
      ]
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [toolLogs, setToolLogs] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sensitive Action Confirmation State
  const [pendingAction, setPendingAction] = useState<{
    type: 'assign' | 'status_mission' | 'status_incident';
    targetId: string;
    value: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ============================================================================
  // COPILOT READ-ONLY FUNCTION/TOOL ARCHITECTURE
  // ============================================================================
  
  const getIncident = (id: string): Incident | undefined => {
    addToolLog(`getIncident("${id}") called`);
    return incidents.find(i => i.id.toLowerCase() === id.toLowerCase() || (id.toLowerCase() === 'miso' && i.id === 'inc_miso'));
  };

  const listCriticalIncidents = (): Incident[] => {
    addToolLog(`listCriticalIncidents() called`);
    return incidents.filter(i => i.urgency.toLowerCase() === 'critical' || i.urgency.toLowerCase() === 'high');
  };

  const getMission = (id: string): Mission | undefined => {
    addToolLog(`getMission("${id}") called`);
    const normalizedId = id.toLowerCase();
    // Support searching by PS-M104 alias for Miso's rescue mission
    if (normalizedId === 'ps-m104' || normalizedId === 'msn_miso' || normalizedId === 'miso') {
      return missions.find(m => m.id === 'msn_miso' || m.incidentId === 'inc_miso');
    }
    return missions.find(m => m.id.toLowerCase() === normalizedId);
  };

  const listUnassignedMissions = (): Mission[] => {
    addToolLog(`listUnassignedMissions() called`);
    return missions.filter(m => !m.assignedRescuers || m.assignedRescuers.length === 0);
  };

  const getPossibleMatches = (): any[] => {
    addToolLog(`getPossibleMatches() called`);
    // Aggregate matches from incidents
    const allMatches: any[] = [];
    incidents.forEach(inc => {
      if (inc.possibleMatches && inc.possibleMatches.length > 0) {
        allMatches.push(...inc.possibleMatches);
      }
    });
    return allMatches;
  };

  const createMissionBriefing = (missionId: string): string => {
    addToolLog(`createMissionBriefing("${missionId}") called`);
    const msn = getMission(missionId);
    if (!msn) {
      return `Mission ${missionId} not found. Please verify the active operation log reference.`;
    }

    const linkedInc = incidents.find(i => i.id === msn.incidentId);
    const catName = linkedInc?.catProfile?.name || linkedInc?.catDescription?.color || "unknown cat";
    const urgencyLabel = msn.priority.toUpperCase();
    const rescuersLabel = msn.assignedRescuers && msn.assignedRescuers.length > 0 
      ? msn.assignedRescuers.join(', ') 
      : 'UNASSIGNED';

    // Compile timeline evidence points
    const timelinePoints = linkedInc?.timeline?.map(t => `* ${t.author} update: ${t.message}`) || [
      `* Escape report registered at ${msn.createdAt}`
    ];

    // Gather unique observations or uncertainties
    const uncertainties = linkedInc?.aiAnalysis?.recommendedGear 
      ? [`Collar details or secondary color markings require human verification on approach.`]
      : [`The second sighting image does not clearly show the collar.`];

    return `Mission ${msn.id.toUpperCase()} is a ${urgencyLabel} urgency rescue mission related to missing cat ${catName}.

Current evidence:
${timelinePoints.slice(0, 4).join('\n')}

Current state:
* volunteer assigned: ${rescuersLabel}
* status: ${msn.status.toUpperCase()}

Operational uncertainty:
${uncertainties.map(u => `* ${u}`).join('\n')}`;
  };

  const addToolLog = (log: string) => {
    setToolLogs(prev => [...prev, `[AI_TOOL] ${new Date().toLocaleTimeString()} - ${log}`]);
  };

  // ============================================================================
  // QUERY ROUTING & AI REASONING PIPELINE
  // ============================================================================

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toISOString(),
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    const query = textToSend.toLowerCase();

    // Trigger local reasoning
    setTimeout(() => {
      let aiResponse = "";
      let toolsCalled: string[] = [];
      let suggestions: ChatMessage['suggestedActions'] = [];

      // 1. TOOL: Summarize critical incidents
      if (query.includes('summarize critical') || query.includes('critical incidents') || query.includes('summarise critical')) {
        toolsCalled.push("listCriticalIncidents()");
        const criticals = listCriticalIncidents();
        
        if (criticals.length === 0) {
          aiResponse = "COORDINATOR BRIEFING: CRITICAL INCIDENTS\n\nNo critical or high-priority incidents currently require immediate emergency dispatch. All active cases are stable or undergoing standard observation.";
        } else {
          aiResponse = `COORDINATOR BRIEFING: CRITICAL INCIDENTS\n\nFound ${criticals.length} high-priority incident reports requiring attention:\n\n` + 
            criticals.map(i => {
              const profileText = i.catProfile ? `"${i.catProfile.name}" (${i.catProfile.breed})` : "Unidentified feline";
              return `🚨 [Ref: ${i.id.toUpperCase()}] - Urgency: ${i.urgency.toUpperCase()}\n` +
                     `* Title: ${i.title}\n` +
                     `* Cat: ${profileText}\n` +
                     `* Location: ${i.location.name}\n` +
                     `* Status: ${i.status.toUpperCase()}`;
            }).join('\n\n');
        }
        suggestions = [
          { label: "Find Unassigned Missions", actionCode: "unassigned_missions" },
          { label: "Identify Incidents to Verify", actionCode: "needs_verification" }
        ];
      }
      
      // 2. TOOL: Find unassigned high-priority missions
      else if (query.includes('unassigned') || query.includes('find unassigned')) {
        toolsCalled.push("listUnassignedMissions()");
        const unassigned = listUnassignedMissions();

        if (unassigned.length === 0) {
          aiResponse = "TACTICAL DIRECTIVE: UNASSIGNED OPERATIONS\n\nAll currently scheduled rescue missions have active responders assigned. No pending cases are awaiting volunteer routing.";
        } else {
          aiResponse = `TACTICAL DIRECTIVE: UNASSIGNED OPERATIONS\n\nFound ${unassigned.length} unassigned rescue missions. Quick dispatch is recommended:\n\n` +
            unassigned.map(m => {
              return `📌 [Mission: ${m.id.toUpperCase()}] - Priority: ${m.priority.toUpperCase()}\n` +
                     `* Title: ${m.title}\n` +
                     `* Equipment: ${m.equipmentNeeded.join(', ')}\n` +
                     `* Status: ${m.status.toUpperCase()}`;
            }).join('\n\n') + `\n\nTo assign a volunteer, type "Assign [Volunteer Name] to [Mission ID]".`;
        }
        suggestions = [
          { label: "Draft Handoff Summary", actionCode: "handoff_summary" }
        ];
      }

      // 3. TOOL: Explain possible cat match
      else if (query.includes('explain match') || query.includes('possible match') || query.includes('connections')) {
        toolsCalled.push("getPossibleMatches()");
        const matches = getPossibleMatches();

        if (matches.length === 0) {
          aiResponse = "INTELLIGENCE REPORT: MATCH CORRELATIONS\n\nNo active visual match candidates are currently registered. Scan sightings and verify incoming photo feeds to discover potential connections.";
        } else {
          aiResponse = `INTELLIGENCE REPORT: MATCH CORRELATIONS\n\nOur correlation engine is tracking ${matches.length} possible matching sight connections:\n\n` +
            matches.map((m, idx) => {
              return `🔍 Connection Candidate #${idx + 1} (Score: ${m.confidenceScore}%)\n` +
                     `* Incident A: ${m.incidentIdA.toUpperCase()}\n` +
                     `* Incident B: ${m.incidentIdB.toUpperCase()}\n` +
                     `* Core Reason: ${m.reason}\n` +
                     `* Verification: ${m.status.toUpperCase()}`;
            }).join('\n\n');
        }
      }

      // 4. TOOL: Generate a rescue mission briefing (e.g. Brief me on mission PS-M104)
      else if (query.includes('brief me on mission') || query.includes('mission brief') || query.includes('ps-m104') || query.includes('msn_miso')) {
        let msnId = "msn_miso";
        const matchResult = query.match(/mission\s+([a-zA-Z0-9_-]+)/);
        if (matchResult && matchResult[1]) {
          msnId = matchResult[1];
        } else if (query.includes('ps-m104')) {
          msnId = 'ps-m104';
        }
        
        toolsCalled.push(`getMission("${msnId}")`);
        toolsCalled.push(`createMissionBriefing("${msnId}")`);
        
        aiResponse = createMissionBriefing(msnId);
      }

      // 5. TOOL: Summarize what changed today
      else if (query.includes('changed today') || query.includes('summary of changes') || query.includes('what changed')) {
        toolsCalled.push("listCriticalIncidents()");
        const recentUpdates: string[] = [];
        incidents.forEach(inc => {
          inc.updates?.forEach(up => {
            recentUpdates.push(`* ${up.author} posted for ${inc.id.toUpperCase()}: "${up.message}" [Status: ${up.statusChanged || 'stable'}]`);
          });
        });

        if (recentUpdates.length === 0) {
          aiResponse = "DAILY SITUATION REPORT (SITREP):\n\nNo operational state modifications have been registered today. Feed is stable.";
        } else {
          aiResponse = `DAILY SITUATION REPORT (SITREP):\n\nHere are the critical state transitions logged today:\n\n` + 
            recentUpdates.slice(-6).reverse().join('\n');
        }
      }

      // 6. TOOL: Identify incidents waiting for verification
      else if (query.includes('waiting for verification') || query.includes('unverified') || query.includes('verify')) {
        const pending = incidents.filter(i => i.status === IncidentStatus.NEEDS_VERIFICATION || i.status === 'reported');
        
        if (pending.length === 0) {
          aiResponse = "VERIFICATION DISPATCH:\n\nPerfect state. All reported public incidents have been fully structured and verified by coordinators.";
        } else {
          aiResponse = `VERIFICATION DISPATCH:\n\nThere are currently ${pending.length} public reports awaiting manual human verification before dispatches can be scheduled:\n\n` +
            pending.map(i => {
              return `📥 [Incident: ${i.id.toUpperCase()}] - Urgency: ${i.urgency.toUpperCase()}\n` +
                     `* Title: ${i.title}\n` +
                     `* Location: ${i.location.name}\n` +
                     `* Reporter: ${i.reporter.name} (${i.reporter.type})`;
            }).join('\n\n');
        }
      }

      // 7. TOOL: Create handoff summary
      else if (query.includes('handoff') || query.includes('next coordinator')) {
        toolsCalled.push("listCriticalIncidents()");
        toolsCalled.push("listUnassignedMissions()");
        
        const openCriticals = listCriticalIncidents().filter(i => i.status !== IncidentStatus.REUNITED);
        const unassignedMissions = listUnassignedMissions();
        const activeMissionsCount = missions.filter(m => m.status === 'active').length;

        aiResponse = `PURRSIGNAL COORDINATOR HANDOFF BRIEFING\n` +
          `Date: ${new Date().toLocaleDateString()} | Shift Change Report\n` +
          `==================================================\n\n` +
          `1. CRITICAL INCIDENTS AWAITING VERIFICATION:\n` +
          (openCriticals.length === 0 
            ? `* None. All critical items are currently routed or closed.\n`
            : openCriticals.map(c => `* ${c.id.toUpperCase()} at ${c.location.name} (${c.status.toUpperCase()})`).join('\n') + `\n`) +
          `\n2. ACTIVE RESCUE OPERATIONS:\n` +
          `* ${activeMissionsCount} active rescue operations are currently running in the field.\n` +
          `* ${unassignedMissions.length} missions are currently UNASSIGNED and require urgent volunteer routing.\n\n` +
          `3. STAFF ON CALL:\n` +
          rescuers.map(r => `* ${r.name} (${r.role}) - Status: ${r.status.toUpperCase()}`).join('\n') + `\n\n` +
          `Operational continuity recommendation: Follow up on Miso's scent trap (msn_miso). Lily Potter is monitoring the Fulton rose garden coordinates.`;
      }

      // 8. DATA ALTERATION: "Assign Lily Potter to msn_miso" (Requires Confirmation!)
      else if (query.includes('assign') && (query.includes('to') || query.includes('mission'))) {
        // Attempt to parse names and IDs
        const potentialRescuer = rescuers.find(r => query.includes(r.name.toLowerCase()));
        const potentialMission = missions.find(m => query.includes(m.id.toLowerCase()) || m.id === 'msn_miso' && query.includes('miso'));

        if (potentialRescuer && potentialMission) {
          setPendingAction({
            type: 'assign',
            targetId: potentialMission.id,
            value: potentialRescuer.name,
            description: `Assign volunteer "${potentialRescuer.name}" to Rescue Operation: "${potentialMission.title}"`
          });
          aiResponse = `SENSITIVE OPERATION DETECTED: I have prepared the command to assign ${potentialRescuer.name} to mission ${potentialMission.id.toUpperCase()}.\n\nAs an AI Copilot, I cannot modify actual operations data without explicit coordinator approval. Please verify and confirm the action below.`;
        } else {
          aiResponse = "I couldn't locate that specific volunteer or mission in the PurrSignal directory. Please make sure to state the exact volunteer name and mission code.";
        }
      }

      // Default Help
      else {
        aiResponse = "COORDINATION INTEL ANALYZER:\n\nQuery received: \"" + textToSend + "\"\n\nI can assist you with these direct operational commands:\n" +
          `* "Brief me on mission PS-M104" (or any other mission code)\n` +
          `* "Summarize critical incidents" to view high-urgency cases\n` +
          `* "Find unassigned missions" to coordinate volunteer routing\n` +
          `* "Summarize what changed today" to view sitrep logs\n` +
          `* "Create handoff summary" for shift changes\n` +
          `* "Explain possible matches" to view AI correlations`;
      }

      const copilotMsg: ChatMessage = {
        id: `c_${Date.now()}`,
        sender: 'copilot',
        timestamp: new Date().toISOString(),
        text: aiResponse,
        toolInvocations: toolsCalled.length > 0 ? toolsCalled : undefined,
        suggestedActions: suggestions
      };

      setMessages(prev => [...prev, copilotMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const executePendingAction = () => {
    if (!pendingAction) return;

    if (pendingAction.type === 'assign') {
      onAssignRescuer(pendingAction.targetId, pendingAction.value);
    }

    // Post system response explaining execution
    const confirmMsg: ChatMessage = {
      id: `c_confirm_${Date.now()}`,
      sender: 'copilot',
      timestamp: new Date().toISOString(),
      text: `✅ ACTION VERIFIED & EXECUTED SUCCESSFULLY:\n\nExecuted tool: \`assignRescuer("${pendingAction.targetId}", "${pendingAction.value}")\`\n\nDatabase state updated. Toast dispatch emitted to the central coordinators board.`
    };

    setMessages(prev => [...prev, confirmMsg]);
    setPendingAction(null);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "m_init",
        sender: "copilot",
        timestamp: new Date().toISOString(),
        text: "Terminal reset complete. Secure operations line ready. Ask a question regarding feline rescue, weather impact, bait, or property clearance."
      }
    ]);
    setToolLogs([]);
  };

  return (
    <div id="copilot-terminal-container" className="h-[calc(100vh-64px)] flex flex-col md:flex-row overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono">
      
      {/* LEFT TEMPLATE WIDGET PANELS (4 cols) */}
      <div className="w-full md:w-80 lg:w-96 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between h-1/3 md:h-full overflow-y-auto">
        
        <div className="space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-extrabold tracking-wider text-amber-600 dark:text-amber-500 uppercase flex items-center gap-1.5">
              <Terminal className="w-4 h-4" />
              Tactical Actions
            </h3>
            <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-1">Direct query integrations linked with live PurrSignal data.</p>
          </div>

          <div className="space-y-2.5 text-left">
            {/* Quick Action 1 */}
            <button
              id="qa-summarize-critical"
              onClick={() => handleSendMessage("Summarize critical incidents")}
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/85 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl text-left transition-colors flex items-start gap-2.5 group"
            >
              <div className="p-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-rose-500 rounded group-hover:bg-slate-200 dark:group-hover:bg-slate-850">
                <ShieldAlert className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200 group-hover:text-rose-600 dark:group-hover:text-rose-400">Summarize Critical Incidents</div>
                <div className="text-[9px] text-slate-450 dark:text-slate-500 mt-0.5 truncate">Filters high urgency sighting logs</div>
              </div>
              <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-600 mt-1 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Quick Action 2 */}
            <button
              id="qa-unassigned-missions"
              onClick={() => handleSendMessage("Find unassigned missions")}
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/85 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl text-left transition-colors flex items-start gap-2.5 group"
            >
              <div className="p-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-amber-500 rounded group-hover:bg-slate-200 dark:group-hover:bg-slate-850">
                <Wrench className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400">Unassigned Missions</div>
                <div className="text-[9px] text-slate-450 dark:text-slate-500 mt-0.5 truncate">List operations waiting for rescuers</div>
              </div>
              <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-600 mt-1 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Quick Action 3 */}
            <button
              id="qa-explain-matches"
              onClick={() => handleSendMessage("Explain possible cat matches")}
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/85 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl text-left transition-colors flex items-start gap-2.5 group"
            >
              <div className="p-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-purple-600 dark:text-purple-400 rounded group-hover:bg-slate-200 dark:group-hover:bg-slate-850">
                <Compass className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400">Explain Sighting Matches</div>
                <div className="text-[9px] text-slate-450 dark:text-slate-500 mt-0.5 truncate">Compares characteristics and scores</div>
              </div>
              <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-600 mt-1 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Quick Action 4 */}
            <button
              id="qa-brief-miso"
              onClick={() => handleSendMessage("Brief me on mission PS-M104")}
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/85 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl text-left transition-colors flex items-start gap-2.5 group"
            >
              <div className="p-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-blue-500 dark:text-blue-400 rounded group-hover:bg-slate-200 dark:group-hover:bg-slate-850">
                <Cat className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">Briefing: Mission Miso</div>
                <div className="text-[9px] text-slate-450 dark:text-slate-500 mt-0.5 truncate">Dynamic briefing for case PS-M104</div>
              </div>
              <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-600 mt-1 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Quick Action 5 */}
            <button
              id="qa-changed-today"
              onClick={() => handleSendMessage("Summarize what changed today")}
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/85 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl text-left transition-colors flex items-start gap-2.5 group"
            >
              <div className="p-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-indigo-500 dark:text-indigo-400 rounded group-hover:bg-slate-200 dark:group-hover:bg-slate-850">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">What Changed Today</div>
                <div className="text-[9px] text-slate-450 dark:text-slate-500 mt-0.5 truncate">Transition metrics and logs</div>
              </div>
              <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-600 mt-1 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Quick Action 6 */}
            <button
              id="qa-verify-needed"
              onClick={() => handleSendMessage("Identify incidents waiting for verification")}
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/85 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl text-left transition-colors flex items-start gap-2.5 group"
            >
              <div className="p-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-teal-600 dark:text-teal-400 rounded group-hover:bg-slate-200 dark:group-hover:bg-slate-850">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400">Verify Pending Reports</div>
                <div className="text-[9px] text-slate-450 dark:text-slate-500 mt-0.5 truncate">Lists unconfirmed public entries</div>
              </div>
              <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-600 mt-1 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Quick Action 7 */}
            <button
              id="qa-handoff"
              onClick={() => handleSendMessage("Create a handoff summary for the next coordinator")}
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/85 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl text-left transition-colors flex items-start gap-2.5 group"
            >
              <div className="p-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 rounded group-hover:bg-slate-200 dark:group-hover:bg-slate-850">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">Coordinator Handoff Brief</div>
                <div className="text-[9px] text-slate-450 dark:text-slate-500 mt-0.5 truncate">Compiles shift handoff SITREPs</div>
              </div>
              <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-600 mt-1 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Tool logs console */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col min-h-[120px] max-h-48 overflow-hidden">
          <div className="flex items-center justify-between text-[10px] text-slate-450 dark:text-slate-500 mb-1.5 uppercase font-bold font-mono">
            <span>Agent Tool Call Logs:</span>
            <Database className="w-3 h-3" />
          </div>
          <div className="flex-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-lg p-2 font-mono text-[9px] text-slate-600 dark:text-slate-400 overflow-y-auto space-y-1 text-left">
            {toolLogs.length === 0 ? (
              <span className="text-slate-400 dark:text-slate-600 italic">No tools evaluated yet.</span>
            ) : (
              toolLogs.map((log, idx) => <div key={idx} className="leading-tight">{log}</div>)
            )}
          </div>
        </div>

        <div className="pt-2">
          <button
            id="copilot-btn-clear"
            onClick={clearChat}
            className="w-full py-2 bg-slate-100 hover:bg-red-50 dark:bg-slate-950 dark:hover:bg-red-950/30 text-slate-500 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-900/50 rounded-lg text-[10px] uppercase font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Terminal Logs
          </button>
        </div>

      </div>

      {/* CHAT CONSOLE STAGE (8 cols) */}
      <div className="flex-1 flex flex-col justify-between bg-slate-50 dark:bg-slate-950 h-2/3 md:h-full text-left">
        
        {/* Terminal Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950/80 backdrop-blur flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">PurrSignal AI Copilot Station v2.5</span>
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-500 font-mono">DATABASE SAT-LINK ROOTED</span>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            
            return (
              <div 
                id={`copilot-msg-${m.id}`}
                key={m.id}
                className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 ${
                  isUser 
                    ? 'bg-slate-250 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-amber-600 dark:text-amber-400' 
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 shadow-lg shadow-amber-500/5'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 animate-pulse" />}
                </div>

                {/* Message Body */}
                <div className="space-y-1.5 text-left">
                  <div className={`p-4 rounded-2xl border text-xs leading-relaxed whitespace-pre-wrap ${
                    isUser 
                      ? 'bg-white dark:bg-slate-900 border-slate-250 dark:border-slate-800/80 text-slate-800 dark:text-slate-100' 
                      : 'bg-slate-100/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/40 text-slate-700 dark:text-slate-300 shadow-sm shadow-slate-950/20'
                  }`}>
                    {/* Tool Call Tag */}
                    {!isUser && m.toolInvocations && m.toolInvocations.map((tool, tIdx) => (
                      <div key={tIdx} className="mb-2 inline-flex items-center gap-1 px-2 py-0.5 bg-slate-200 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-[8px] font-bold text-amber-600 dark:text-amber-400 rounded font-mono uppercase font-black">
                        <Terminal className="w-2.5 h-2.5" />
                        Tool Invoked: {tool}
                      </div>
                    ))}
                    {m.text}
                  </div>

                  {/* Suggestions triggers */}
                  {!isUser && m.suggestedActions && m.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1 pl-1">
                      {m.suggestedActions.map((s, idx) => (
                        <button
                          id={`suggested-action-${idx}`}
                          key={idx}
                          onClick={() => {
                            const prompts: Record<string, string> = {
                              summarize_critical: "Summarize critical incidents",
                              unassigned_missions: "Find unassigned missions",
                              needs_verification: "Identify incidents waiting for verification",
                              handoff_summary: "Create a handoff summary for the next coordinator"
                            };
                            handleSendMessage(prompts[s.actionCode] || s.label);
                          }}
                          className="px-3 py-1 bg-white dark:bg-slate-900 hover:bg-amber-500/10 border border-slate-200 dark:border-slate-800 hover:border-amber-500/30 text-[10px] rounded-lg text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer font-bold"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-md mr-auto">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-slate-100/60 dark:bg-slate-900/40 border border-slate-250 dark:border-slate-800/40 p-4 rounded-2xl text-xs text-slate-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span>AI Copilot is executing database queries...</span>
              </div>
            </div>
          )}

          {/* SENSITIVE DATA MODIFICATION CONFIRMATION POPUP */}
          {pendingAction && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-5 bg-white dark:bg-slate-900 border-2 border-amber-500 rounded-2xl max-w-lg mx-auto shadow-xl space-y-4 my-4 font-sans text-left"
            >
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
                <h4 className="text-sm font-extrabold uppercase font-mono tracking-wider">AI Modification Confirmation Needed</h4>
              </div>
              
              <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed">
                You have requested a state-changing tactical action. Under human-in-the-loop protocols, the AI Copilot must seek manual authorization from a Coordinator before modifying any live dispatch records.
              </p>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-[11px] text-slate-500 dark:text-slate-400 space-y-1 text-left">
                <div><span className="text-amber-600 dark:text-amber-500">Action:</span> {pendingAction.type.toUpperCase()}</div>
                <div><span className="text-amber-600 dark:text-amber-500">Target:</span> {pendingAction.targetId}</div>
                <div><span className="text-amber-600 dark:text-amber-500">Description:</span> {pendingAction.description}</div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  id="copilot-confirm-execute"
                  onClick={executePendingAction}
                  className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
                >
                  Approve & Execute Action
                </button>
                <button
                  id="copilot-cancel-execute"
                  onClick={() => setPendingAction(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-xl transition-colors"
                >
                  Decline
                </button>
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="p-4 border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950/80 backdrop-blur font-mono"
        >
          <div className="flex gap-2">
            <input
              id="copilot-text-input"
              type="text"
              required
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Query: 'brief me on mission PS-M104', 'summarize critical', 'handoff briefing'..."
              className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-450 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
            />
            
            <button
              id="btn-copilot-send"
              type="submit"
              className="px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors font-mono"
            >
              <Send className="w-4 h-4" />
              EXECUTE
            </button>
          </div>
        </form>

      </div>

    </div>
  );
};
