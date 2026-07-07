export type IncidentStatus = 
  | 'reported' 
  | 'structured' 
  | 'verified' 
  | 'prioritized' 
  | 'mission_created' 
  | 'rescued' 
  | 'recovered' 
  | 'reunited';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export interface CatDescription {
  name?: string;
  color: string;
  distinctiveFeatures: string;
  condition: string;
}

export interface LocationData {
  name: string;
  lat: number;
  lng: number;
  details?: string;
}

export interface ReporterData {
  name: string;
  contact: string;
  type: 'witness' | 'owner' | 'volunteer';
}

export interface IncidentUpdate {
  id: string;
  timestamp: string;
  author: string;
  message: string;
  statusChanged?: IncidentStatus;
}

export interface Incident {
  id: string;
  title: string;
  status: IncidentStatus;
  urgency: UrgencyLevel;
  catDescription: CatDescription;
  location: LocationData;
  reportedAt: string;
  reporter: ReporterData;
  notes: string;
  aiConfidence: number; // 0-100 percentage
  aiSummary: string;     // Clean structured AI output
  updates: IncidentUpdate[];
  mediaUrl?: string;
}

export interface MissionUpdate {
  id: string;
  timestamp: string;
  author: string;
  message: string;
}

export interface Mission {
  id: string;
  incidentId: string;
  title: string;
  status: 'active' | 'completed' | 'cancelled';
  assignedRescuers: string[];
  priority: UrgencyLevel;
  createdAt: string;
  equipmentNeeded: string[];
  updates: MissionUpdate[];
}

export interface Rescuer {
  id: string;
  name: string;
  role: 'field_rescuer' | 'medical_volunteer' | 'coordinator' | 'foster_care';
  contact: string;
  status: 'available' | 'on_mission' | 'offline';
  location: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
