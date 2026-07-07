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
  X
} from 'lucide-react';
import { Incident, UrgencyLevel, IncidentStatus } from '../types';
import { StatusBadge, UrgencyIndicator } from '../components/UI';

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

  // Filtered list
  const filteredIncidents = useMemo(() => {
    return incidents.filter(inc => {
      const matchesSearch = inc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            inc.location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            inc.catDescription.color.toLowerCase().includes(searchTerm.toLowerCase());
      
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

  // Map Bounds Projection:
  // Convert real lat/lng in San Francisco area (centered roughly at lat 37.77, lng -122.43)
  // to beautiful coordinates on our 800x500 SVG vector canvas.
  const projectCoords = (lat: number, lng: number) => {
    // SF Bounds range
    const minLat = 37.74;
    const maxLat = 37.80;
    const minLng = -122.46;
    const maxLng = -122.40;

    const latPct = (lat - minLat) / (maxLat - minLat);
    const lngPct = (lng - minLng) / (maxLng - minLng);

    // SVG coordinate space: width 800, height 500
    // Lat increases upwards, but SVG Y increases downwards.
    const x = 50 + lngPct * 700;
    const y = 450 - latPct * 400;

    return { x, y };
  };

  const handlePinClick = (id: string) => {
    setActivePinId(id === activePinId ? null : id);
  };

  const selectedIncidentObj = useMemo(() => {
    return incidents.find(inc => inc.id === activePinId);
  }, [incidents, activePinId]);

  return (
    <div id="crisis-map-container" className="h-[calc(100vh-64px)] flex flex-col md:flex-row overflow-hidden bg-slate-950 text-white font-sans">
      
      {/* LEFT SIDEBAR - INCIDENT FINDER */}
      <div className="w-full md:w-80 lg:w-96 bg-slate-900 border-r border-slate-800 flex flex-col h-1/2 md:h-full flex-shrink-0">
        
        {/* Search header */}
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold tracking-wider text-amber-500 uppercase flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              Tactical Sighting Feed
            </h3>
            <span className="text-xs font-mono text-slate-500">{filteredIncidents.length} pinned</span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              id="map-sidebar-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search collar, color, location..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Urgency</label>
              <select
                id="select-map-urgency"
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="w-full py-1.5 px-2 bg-slate-950 border border-slate-800 text-slate-300 rounded text-[10px] focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Urgency</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
              <select
                id="select-map-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-1.5 px-2 bg-slate-950 border border-slate-800 text-slate-300 rounded text-[10px] focus:outline-none focus:border-amber-500"
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
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
          {filteredIncidents.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Cat className="w-8 h-8 stroke-1 mx-auto mb-2 text-slate-600" />
              <p className="text-xs">No coordinates match these criteria.</p>
            </div>
          ) : (
            filteredIncidents.map(inc => {
              const projected = projectCoords(inc.location.lat, inc.location.lng);
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
                      ? 'bg-slate-800/80 border-l-2 border-amber-500' 
                      : 'hover:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">INC-{inc.id.split('_')[1]}</span>
                    <span className="text-[9px] font-mono text-slate-400">
                      {new Date(inc.reportedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-200 mt-1 line-clamp-1">{inc.title}</h4>
                  
                  <div className="flex items-center gap-1.5 mt-2">
                    <StatusBadge status={inc.status} size="sm" />
                    <UrgencyIndicator urgency={inc.urgency} showText={false} />
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                    {inc.notes}
                  </p>

                  <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-2">
                    <MapPin className="w-3 h-3 text-slate-600" />
                    <span className="truncate">{inc.location.name}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer Report CTA */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
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
      <div className="flex-1 relative overflow-hidden bg-slate-950 select-none flex flex-col justify-between">
        
        {/* Map Header Floating Overlay */}
        <div className="absolute top-4 left-4 right-4 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 flex items-center gap-3 shadow-lg pointer-events-auto">
            <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-100 uppercase tracking-wider">San Francisco Vector Node</div>
              <div className="text-[9px] font-mono text-slate-400">Map Scale: 1:15,000 | Core Feline Radar</div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto pointer-events-auto">
            {/* Legend Pop */}
            <div className="bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 flex items-center gap-3 text-[10px] text-slate-400 font-mono shadow-lg">
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
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148, 163, 184, 0.05)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Simulated streets, water, parks using sleek stylized vector lines */}
            <g id="map-aesthetic-features" opacity="0.15">
              {/* Coastline SF Bay */}
              <path d="M 0 150 C 150 140, 200 80, 250 50 C 350 10, 450 0, 800 0 L 800 500 L 0 500 Z" fill="#1e1b4b" opacity="0.3" />
              <path d="M 0 150 C 150 140, 200 80, 250 50 C 350 10, 450 0, 800 0" fill="none" stroke="#312e81" strokeWidth="3" />
              
              {/* Major Roads Grid */}
              <line x1="50" y1="0" x2="50" y2="500" stroke="#475569" strokeWidth="1.5" />
              <line x1="200" y1="0" x2="200" y2="500" stroke="#475569" strokeWidth="1.5" />
              <line x1="350" y1="0" x2="350" y2="500" stroke="#475569" strokeWidth="1.5" />
              <line x1="500" y1="0" x2="500" y2="500" stroke="#475569" strokeWidth="1.5" />
              <line x1="650" y1="0" x2="650" y2="500" stroke="#475569" strokeWidth="1.5" />
              
              <line x1="0" y1="100" x2="800" y2="100" stroke="#475569" strokeWidth="1.5" />
              <line x1="0" y1="220" x2="800" y2="220" stroke="#475569" strokeWidth="1.5" />
              <line x1="0" y1="340" x2="800" y2="340" stroke="#475569" strokeWidth="1.5" />
              <line x1="0" y1="460" x2="800" y2="460" stroke="#475569" strokeWidth="1.5" />

              {/* Angle diagonal bypass highways */}
              <line x1="0" y1="400" x2="600" y2="0" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="150" y1="500" x2="800" y2="150" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />

              {/* Designated Safe/Park Zones (Green areas) */}
              <rect x="80" y="240" width="100" height="80" rx="10" fill="#064e3b" opacity="0.3" />
              <text x="130" y="285" fill="#34d399" fontSize="10" fontFamily="monospace" textAnchor="middle" opacity="0.6">Presidio Zone</text>

              <rect x="420" y="120" width="140" height="60" rx="10" fill="#064e3b" opacity="0.3" />
              <text x="490" y="155" fill="#34d399" fontSize="10" fontFamily="monospace" textAnchor="middle" opacity="0.6">Central Park Node</text>
            </g>

            {/* DYNAMIC INCIDENT MARKERS */}
            <g id="map-feline-markers">
              {filteredIncidents.map(inc => {
                const projected = projectCoords(inc.location.lat, inc.location.lng);
                const isActive = inc.id === activePinId;
                const isCritical = inc.urgency === 'critical';
                const isHigh = inc.urgency === 'high';
                
                // Color mapping
                const markerColor = isCritical ? '#ef4444' : isHigh ? '#f97316' : '#0ea5e9';

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
                        r="18" 
                        fill="none" 
                        stroke={markerColor} 
                        strokeWidth="1.5"
                        className="animate-signal-wave"
                        style={{ transformOrigin: `${projected.x}px ${projected.y}px` }}
                      />
                    )}

                    {/* Standard marker background shadow ring */}
                    <circle 
                      cx={projected.x} 
                      cy={projected.y} 
                      r={isActive ? "10" : "7"} 
                      fill="rgba(15, 23, 42, 0.8)" 
                      stroke={isActive ? "#fbbf24" : "rgba(255,255,255,0.4)"} 
                      strokeWidth={isActive ? "2" : "1"}
                    />

                    {/* Colored inner dot */}
                    <circle 
                      cx={projected.x} 
                      cy={projected.y} 
                      r={isActive ? "5" : "3.5"} 
                      fill={markerColor} 
                    />

                    {/* Simple flag hover labels */}
                    <text 
                      x={projected.x} 
                      y={projected.y - 12} 
                      fill="#cbd5e1" 
                      fontSize="9" 
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-900"
                    >
                      {inc.catDescription.color}
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
                className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 z-20 max-w-sm bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-3 pointer-events-auto"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-widest block">Signal Node Verified</span>
                    <h3 className="text-sm font-bold text-slate-100 line-clamp-1">{selectedIncidentObj.title}</h3>
                  </div>
                  <button 
                    id="map-tooltip-close"
                    onClick={() => setActivePinId(null)}
                    className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <StatusBadge status={selectedIncidentObj.status} size="sm" />
                  <UrgencyIndicator urgency={selectedIncidentObj.urgency} />
                  <span className="text-[10px] font-mono text-slate-400 ml-auto">{selectedIncidentObj.location.lat}, {selectedIncidentObj.location.lng}</span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {selectedIncidentObj.notes}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <button
                    id="map-tooltip-btn-view"
                    onClick={() => onSelectIncident(selectedIncidentObj.id)}
                    className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 transition-all text-center flex items-center justify-center gap-1"
                  >
                    Incident Center
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <button
                    id="map-tooltip-btn-dismiss"
                    onClick={() => setActivePinId(null)}
                    className="py-1.5 px-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition-all text-center"
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
            className="p-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            id="map-zoom-out"
            onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.6))}
            className="p-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors shadow-md"
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
            className="p-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors shadow-md"
            title="Recenter Map"
          >
            <Compass className="w-4 h-4 text-amber-500" />
          </button>
        </div>

      </div>

    </div>
  );
};
