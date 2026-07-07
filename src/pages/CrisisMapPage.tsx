import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Search, 
  Filter, 
  AlertTriangle, 
  ShieldAlert, 
  Compass, 
  Maximize2, 
  Layers, 
  Plus, 
  Minus,
  Cat,
  ExternalLink,
  CheckCircle2,
  ListFilter,
  X,
  Sparkles,
  Lock,
  Unlock,
  Eye,
  EyeOff
} from 'lucide-react';
import { Incident, UrgencyLevel, IncidentStatus, IncidentType } from '../types';
import { StatusBadge, UrgencyIndicator } from '../components/UI';
import { ThreeDCat } from '../components/ThreeDCat';

interface CrisisMapPageProps {
  incidents: Incident[];
  onSelectIncident: (id: string) => void;
  onNavigateToReport: () => void;
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

export const CrisisMapPage: React.FC<CrisisMapPageProps> = ({ 
  incidents, 
  onSelectIncident,
  onNavigateToReport
}) => {
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Selected incident on the map
  const [activePinId, setActivePinId] = useState<string | null>(null);
  
  // Custom Map view settings
  const [zoom, setZoom] = useState(1.2);
  const [viewCenter, setViewCenter] = useState({ x: 0, y: 0 });

  // Privacy control: Authorized rescue dispatch can toggle exact coordinates
  const [exactCoordsEnabled, setExactCoordsEnabled] = useState(false);

  // Filtered list
  const filteredIncidents = useMemo(() => {
    return incidents.filter(inc => {
      const colorText = (inc.catProfile?.color || inc.catDescription?.color || "").toLowerCase();
      const breedText = (inc.catProfile?.breed || "").toLowerCase();
      const markingsText = (inc.catProfile?.distinctiveFeatures || inc.catDescription?.distinctiveFeatures || "").toLowerCase();
      const matchesSearch = inc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            inc.location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            colorText.includes(searchTerm.toLowerCase()) ||
                            breedText.includes(searchTerm.toLowerCase()) ||
                            markingsText.includes(searchTerm.toLowerCase());
      
      const matchesUrgency = urgencyFilter === 'all' || 
                             inc.urgency === urgencyFilter || 
                             (urgencyFilter === 'critical' && inc.urgency === 'CRITICAL') ||
                             (urgencyFilter === 'high' && inc.urgency === 'HIGH') ||
                             (urgencyFilter === 'medium' && inc.urgency === 'MEDIUM') ||
                             (urgencyFilter === 'low' && inc.urgency === 'LOW');
                             
      const norm = normalizeStatus(inc.status);
      const matchesStatus = statusFilter === 'all' || 
                            norm === statusFilter || 
                            inc.status === statusFilter ||
                            (statusFilter === 'reported' && norm === IncidentStatus.NEW) ||
                            (statusFilter === 'structured' && norm === IncidentStatus.AI_ANALYZED) ||
                            (statusFilter === 'verified' && norm === IncidentStatus.VERIFIED) ||
                            (statusFilter === 'prioritized' && norm === IncidentStatus.NEEDS_VERIFICATION) ||
                            (statusFilter === 'mission_created' && norm === IncidentStatus.MISSION_CREATED) ||
                            (statusFilter === 'rescued' && norm === IncidentStatus.SAFE) ||
                            (statusFilter === 'recovered' && norm === IncidentStatus.SAFE) ||
                            (statusFilter === 'reunited' && norm === IncidentStatus.REUNITED);
      
      return matchesSearch && matchesUrgency && matchesStatus;
    });
  }, [incidents, searchTerm, urgencyFilter, statusFilter]);

  // Project map coordinates
  const projectCoords = (lat: number, lng: number) => {
    // SF Bounds range
    const minLat = 37.74;
    const maxLat = 37.80;
    const minLng = -122.46;
    const maxLng = -122.40;

    const latPct = (lat - minLat) / (maxLat - minLat);
    const lngPct = (lng - minLng) / (maxLng - minLng);

    const x = 50 + lngPct * 700;
    const y = 450 - latPct * 400;

    return { x, y };
  };

  // Safe Coordinate Blurring depending on Authorization status
  const getRenderCoords = (inc: Incident) => {
    let lat = inc.location.lat;
    let lng = inc.location.lng;
    
    if (!exactCoordsEnabled) {
      // Deterministic offset using ID character codes to blur/fuzz the marker stably
      const seed = inc.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const latOffset = ((seed % 100) / 100 - 0.5) * 0.007; // fuzz roughly ~400 meters
      const lngOffset = (((seed * 7) % 100) / 100 - 0.5) * 0.007;
      lat += latOffset;
      lng += lngOffset;
    }
    
    return projectCoords(lat, lng);
  };

  const handlePinClick = (id: string) => {
    setActivePinId(id === activePinId ? null : id);
  };

  const selectedIncidentObj = useMemo(() => {
    return incidents.find(inc => inc.id === activePinId);
  }, [incidents, activePinId]);

  // EVIDENCE TRAIL GENERATION:
  // If the active pin is a MISSING cat report, automatically look up all related sightings/found incidents (unresolved)
  // that match basic coat markers, and sort them chronologically to trace the cat's trail.
  const evidenceTrail = useMemo(() => {
    if (!selectedIncidentObj || selectedIncidentObj.type !== IncidentType.MISSING) return null;

    const missColor = (selectedIncidentObj.catProfile?.color || selectedIncidentObj.catDescription?.color || "").toLowerCase();
    
    // Find matching sightings/found reports
    const matches = incidents.filter(i => {
      if (i.id === selectedIncidentObj.id) return false;
      
      const norm = normalizeStatus(i.status);
      if (norm === IncidentStatus.REUNITED || norm === IncidentStatus.CLOSED) return false;

      // Ensure they are sightings or found cats
      const isSightingOrFound = i.type === IncidentType.SIGHTING || i.type === IncidentType.FOUND || i.type === IncidentType.INJURED;
      if (!isSightingOrFound) return false;

      const sightColor = (i.catProfile?.color || i.catDescription?.color || "").toLowerCase();
      
      // Look for orange, black, white, grey, tabby matching
      const keywords = ['orange', 'ginger', 'black', 'white', 'grey', 'gray', 'tabby', 'calico', 'tuxedo', 'tortie'];
      const sharedKeywords = keywords.filter(kw => missColor.includes(kw) && sightColor.includes(kw));
      
      return sharedKeywords.length > 0;
    });

    // Sort chronologically by reportedAt
    const sorted = [...matches].sort((a, b) => new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime());
    
    return {
      missingIncident: selectedIncidentObj,
      sightings: sorted
    };
  }, [selectedIncidentObj, incidents]);

  return (
    <div id="crisis-map-container" className="h-[calc(100vh-64px)] flex flex-col md:flex-row overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white font-sans">
      
      {/* LEFT SIDEBAR - INCIDENT FINDER */}
      <div className="w-full md:w-80 lg:w-96 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-1/2 md:h-full flex-shrink-0">
        
        {/* Search header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold tracking-wider text-amber-500 uppercase flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              Tactical Sighting Feed
            </h3>
            <span className="text-xs font-mono text-slate-500">{filteredIncidents.length} pinned</span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
            <input
              id="map-sidebar-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search collar, color, location..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Urgency</label>
              <select
                id="select-map-urgency"
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="w-full py-1.5 px-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded text-[10px] focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Urgency</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Status</label>
              <select
                id="select-map-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-1.5 px-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded text-[10px] focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Status</option>
                <option value="reported">Reported</option>
                <option value="structured">Structured</option>
                <option value="verified">Verified Sighting</option>
                <option value="prioritized">Triage Complete</option>
                <option value="mission_created">Active Mission</option>
                <option value="rescued">Rescued</option>
                <option value="recovered">Recovered</option>
                <option value="reunited">Reunited</option>
              </select>
            </div>
          </div>
        </div>

        {/* Incident List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/40">
          {filteredIncidents.length === 0 ? (
            <div className="p-8 text-center text-slate-400 dark:text-slate-500">
              <Cat className="w-8 h-8 stroke-1 mx-auto mb-2 text-slate-400 dark:text-slate-600" />
              <p className="text-xs">No coordinates match these criteria.</p>
            </div>
          ) : (
            filteredIncidents.map(inc => {
              const projected = getRenderCoords(inc);
              const isActive = inc.id === activePinId;
              
              return (
                <div 
                  id={`map-sidebar-item-${inc.id}`}
                  key={inc.id}
                  onClick={() => {
                    setActivePinId(inc.id);
                    // Adjust view center slightly to simulate centering
                    setViewCenter({
                      x: -(projected.x - 400) * 0.5,
                      y: -(projected.y - 250) * 0.5
                    });
                  }}
                  className={`p-4 text-left cursor-pointer transition-colors ${
                    isActive 
                      ? 'bg-slate-100 dark:bg-slate-800/85 border-l-2 border-amber-500' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase">INC-{inc.id.split('_')[1]}</span>
                    <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400">
                      {new Date(inc.reportedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-mono font-bold px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800/80">
                      {inc.type}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1 flex-1">{inc.title}</h4>
                  </div>
                  
                  <div className="flex items-center gap-1.5 mt-2">
                    <StatusBadge status={inc.status} size="sm" />
                    <UrgencyIndicator urgency={inc.urgency} showText={false} />
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                    {inc.notes}
                  </p>

                  <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
                    <span className="truncate">{inc.location.name}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer Report CTA */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <button
            id="map-btn-file-sighting"
            onClick={onNavigateToReport}
            className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow transition-colors flex items-center justify-center gap-1"
          >
            <Plus className="w-4 h-4" />
            File New Sighting Pin
          </button>
        </div>

      </div>

      {/* RIGHT SECTION - VECTOR MAP FRAME */}
      <div className="flex-1 relative overflow-hidden bg-slate-100 dark:bg-slate-950 select-none flex flex-col justify-between">
        
        {/* Map Header Floating Overlay */}
        <div className="absolute top-4 left-4 right-4 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pointer-events-none">
          <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-lg pointer-events-auto">
            <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-650 dark:text-amber-400 border border-amber-500/20">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-850 dark:text-slate-100 uppercase tracking-wider">San Francisco Vector Node</div>
              <div className="text-[9px] font-mono text-slate-500 dark:text-slate-400">Map Scale: 1:15,000 | Core Feline Radar</div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto pointer-events-auto">
            {/* PRIVACY COORDINATES SELECTOR */}
            <button
              id="map-toggle-precision"
              onClick={() => setExactCoordsEnabled(!exactCoordsEnabled)}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg border flex items-center gap-1.5 shadow-lg transition-all ${
                exactCoordsEnabled 
                  ? 'bg-rose-600 text-white border-rose-500' 
                  : 'bg-white/95 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {exactCoordsEnabled ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-500" />
                  Exact GPS (Authorized Ops)
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  Approximate (Public View)
                </>
              )}
            </button>

            {/* Legend Pop */}
            <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 text-[10px] text-slate-600 dark:text-slate-400 font-mono shadow-lg">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" /> Critical
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> High
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Active
              </span>
            </div>
          </div>
        </div>

        {/* VECTOR MAP STAGE (SVG RENDERING GRID) */}
        <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
          
          <svg 
            id="vector-grid-canvas"
            className="w-full h-full min-w-[800px] min-h-[500px]"
            viewBox="0 0 800 500"
            style={{
              transform: `scale(${zoom}) translate(${viewCenter.x}px, ${viewCenter.y}px)`,
              transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}
          >
            {/* Grid Coordinates (Aesthetic Mission Control) */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" className="stroke-slate-300/40 dark:stroke-slate-800/40" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Simulated streets, water, parks using sleek stylized vector lines */}
            <g id="map-aesthetic-features" className="opacity-40 dark:opacity-15">
              <path d="M 0 150 C 150 140, 200 80, 250 50 C 350 10, 450 0, 800 0 L 800 500 L 0 500 Z" className="fill-blue-100/50 dark:fill-[#1e1b4b]" opacity="0.3" />
              <path d="M 0 150 C 150 140, 200 80, 250 50 C 350 10, 450 0, 800 0" fill="none" className="stroke-blue-200 dark:stroke-[#312e81]" strokeWidth="3" />
              
              <line x1="50" y1="0" x2="50" y2="500" className="stroke-slate-300 dark:stroke-[#475569]" strokeWidth="1.5" />
              <line x1="200" y1="0" x2="200" y2="500" className="stroke-slate-300 dark:stroke-[#475569]" strokeWidth="1.5" />
              <line x1="350" y1="0" x2="350" y2="500" className="stroke-slate-300 dark:stroke-[#475569]" strokeWidth="1.5" />
              <line x1="500" y1="0" x2="500" y2="500" className="stroke-slate-300 dark:stroke-[#475569]" strokeWidth="1.5" />
              <line x1="650" y1="0" x2="650" y2="500" className="stroke-slate-300 dark:stroke-[#475569]" strokeWidth="1.5" />
              
              <line x1="0" y1="100" x2="800" y2="100" className="stroke-slate-300 dark:stroke-[#475569]" strokeWidth="1.5" />
              <line x1="0" y1="220" x2="800" y2="220" className="stroke-slate-300 dark:stroke-[#475569]" strokeWidth="1.5" />
              <line x1="0" y1="340" x2="800" y2="340" className="stroke-slate-300 dark:stroke-[#475569]" strokeWidth="1.5" />
              <line x1="0" y1="460" x2="800" y2="460" className="stroke-slate-300 dark:stroke-[#475569]" strokeWidth="1.5" />

              <line x1="0" y1="400" x2="600" y2="0" className="stroke-slate-300 dark:stroke-[#64748b]" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="150" y1="500" x2="800" y2="150" className="stroke-slate-300 dark:stroke-[#64748b]" strokeWidth="2" strokeDasharray="5,5" />

              <rect x="80" y="240" width="100" height="80" rx="10" className="fill-emerald-100/40 dark:fill-[#064e3b]" opacity="0.3" />
              <text x="130" y="285" className="fill-emerald-600 dark:fill-[#34d399]" fontSize="10" fontFamily="monospace" textAnchor="middle" opacity="0.6">Presidio Zone</text>

              <rect x="420" y="120" width="140" height="60" rx="10" className="fill-emerald-100/40 dark:fill-[#064e3b]" opacity="0.3" />
              <text x="490" y="155" className="fill-emerald-600 dark:fill-[#34d399]" fontSize="10" fontFamily="monospace" textAnchor="middle" opacity="0.6">Central Park Node</text>
            </g>

            {/* CHRONOLOGICAL EVIDENCE TRAIL PATHS */}
            {evidenceTrail && evidenceTrail.sightings.length > 0 && (
              <g id="map-evidence-trail" opacity="0.85">
                {(() => {
                  const pts: Array<{ x: number; y: number }> = [];
                  // Start point: missing cat coordinates
                  pts.push(getRenderCoords(evidenceTrail.missingIncident));
                  
                  // Subsequent sighting coordinates
                  evidenceTrail.sightings.forEach(sight => {
                    pts.push(getRenderCoords(sight));
                  });

                  // Render path
                  let dPath = `M ${pts[0].x} ${pts[0].y}`;
                  for (let index = 1; index < pts.length; index++) {
                    dPath += ` L ${pts[index].x} ${pts[index].y}`;
                  }

                  return (
                    <>
                      {/* Outer fuzzy path */}
                      <path 
                        d={dPath} 
                        fill="none" 
                        stroke="#c084fc" 
                        strokeWidth="4" 
                        strokeDasharray="6,4" 
                        className="animate-pulse"
                      />
                      {/* Core target line */}
                      <path 
                        d={dPath} 
                        fill="none" 
                        stroke="#a855f7" 
                        strokeWidth="2" 
                      />
                    </>
                  );
                })()}
              </g>
            )}

            {/* DYNAMIC INCIDENT MARKERS */}
            <g id="map-feline-markers">
              {filteredIncidents.map(inc => {
                const projected = getRenderCoords(inc);
                const isActive = inc.id === activePinId;
                const isCritical = inc.urgency === 'critical' || inc.urgency === 'CRITICAL';
                const isHigh = inc.urgency === 'high' || inc.urgency === 'HIGH';
                
                // Color mapping
                const markerColor = isCritical ? '#ef4444' : isHigh ? '#f97316' : '#0ea5e9';

                // Shape styling
                const isMissingType = inc.type === IncidentType.MISSING;

                // Sequential Sighting Trail Badge Indicator
                let trailIndex = -1;
                if (evidenceTrail) {
                  if (evidenceTrail.missingIncident.id === inc.id) {
                    trailIndex = 0; // Origin
                  } else {
                    const idx = evidenceTrail.sightings.findIndex(s => s.id === inc.id);
                    if (idx !== -1) {
                      trailIndex = idx + 1; // 1-based order
                    }
                  }
                }

                return (
                  <g 
                    key={inc.id}
                    onClick={() => handlePinClick(inc.id)}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing signal wave behind critical pins */}
                    {isCritical && (
                      <circle 
                        cx={projected.x} 
                        cy={projected.y} 
                        r="22" 
                        fill="none" 
                        stroke={markerColor} 
                        strokeWidth="2"
                        className="animate-signal-wave"
                        style={{ transformOrigin: `${projected.x}px ${projected.y}px` }}
                      />
                    )}

                    {/* High-Fidelity Professional Pin Marker */}
                    <g className="transition-all duration-200">
                      {/* Standard marker pin point pointer */}
                      <path
                        d={`M ${projected.x},${projected.y + 12} L ${projected.x - 6},${projected.y + 2} A 8 8 0 1 1 ${projected.x + 6},${projected.y + 2} Z`}
                        fill={isActive ? "#fbbf24" : markerColor}
                        stroke={isActive ? "#0f172a" : "#ffffff"}
                        strokeWidth={isActive ? "1.8" : "1"}
                        filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.15))"
                      />
                      {/* Inner clean core dot for contrast */}
                      <circle
                        cx={projected.x}
                        cy={projected.y - 3}
                        r="3.5"
                        fill={isActive ? "#ef4444" : "#ffffff"}
                      />
                    </g>

                    {/* Sequential Sighting Trail Badge Indicator */}
                    {trailIndex !== -1 && (
                      <g>
                        <circle
                          cx={projected.x + 9}
                          cy={projected.y - 9}
                          r="6.5"
                          fill="#a855f7"
                          stroke="#1e1b4b"
                          strokeWidth="1"
                        />
                        <text
                          x={projected.x + 9}
                          y={projected.y - 6.5}
                          fill="#ffffff"
                          fontSize="7"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {trailIndex === 0 ? "★" : trailIndex}
                        </text>
                      </g>
                    )}

                    {/* Simple flag hover labels */}
                    <text 
                      x={projected.x} 
                      y={projected.y - 14} 
                      fill="#e2e8f0" 
                      fontSize="9" 
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-900 px-1 rounded shadow"
                    >
                      {inc.catProfile?.color || inc.catDescription?.color || "Unknown"} ({inc.type})
                    </text>
                  </g>
                );
              })}
            </g>

          </svg>

          {/* DYNAMIC SELECTED INCIDENT TOOLTIP OVERLAY */}
          <AnimatePresence>
            {selectedIncidentObj && (
              <motion.div 
                id="map-floating-tooltip"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 z-20 max-w-sm bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xl space-y-3 pointer-events-auto text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase font-bold tracking-widest block flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400 animate-pulse" />
                      Feline Tactical Radar Active
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{selectedIncidentObj.title}</h3>
                  </div>
                  <button 
                    id="map-tooltip-close"
                    onClick={() => setActivePinId(null)}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors pointer-events-auto"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] uppercase font-mono font-bold bg-slate-100 dark:bg-slate-950 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded border border-purple-500/20">
                    {selectedIncidentObj.type}
                  </span>
                  <StatusBadge status={selectedIncidentObj.status} size="sm" />
                  <UrgencyIndicator urgency={selectedIncidentObj.urgency} />
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {selectedIncidentObj.notes}
                </p>

                {selectedIncidentObj.type === IncidentType.MISSING && evidenceTrail && evidenceTrail.sightings.length > 0 && (
                  <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 rounded-lg p-2 text-[11px] text-purple-700 dark:text-purple-300">
                    <span className="font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400 animate-pulse" />
                      Evidence Trail Active: {evidenceTrail.sightings.length} Sightings linked chronologically (purple path).
                    </span>
                  </div>
                )}

                <div className="text-[10px] font-mono bg-slate-50 dark:bg-slate-950/60 p-1.5 rounded border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-between">
                  <span>GPS Precision:</span>
                  <span>
                    {exactCoordsEnabled ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                        Exact GPS ({selectedIncidentObj.location.lat.toFixed(5)}, {selectedIncidentObj.location.lng.toFixed(5)})
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-500 font-bold">
                        Fuzzed GPS (Approx. Range)
                      </span>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    id="map-tooltip-btn-view"
                    onClick={() => onSelectIncident(selectedIncidentObj.id)}
                    className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all text-center flex items-center justify-center gap-1 pointer-events-auto"
                  >
                    Incident Center
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <button
                    id="map-tooltip-btn-dismiss"
                    onClick={() => setActivePinId(null)}
                    className="py-1.5 px-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all text-center pointer-events-auto"
                  >
                    Acknowledge
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Floating Zoom & Pan Controls bottom right */}
        <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2 pointer-events-auto">
          <button
            id="map-zoom-in"
            onClick={() => setZoom(prev => Math.min(prev + 0.2, 3))}
            className="p-2 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors shadow-md pointer-events-auto"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            id="map-zoom-out"
            onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.6))}
            className="p-2 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors shadow-md pointer-events-auto"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            id="map-recenter"
            onClick={() => {
              setZoom(1.2);
              setViewCenter({ x: 0, y: 0 });
              setActivePinId(null);
            }}
            className="p-2 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors shadow-md pointer-events-auto"
            title="Recenter Map"
          >
            <Compass className="w-4 h-4 text-amber-500" />
          </button>
        </div>

      </div>

    </div>
  );
};
