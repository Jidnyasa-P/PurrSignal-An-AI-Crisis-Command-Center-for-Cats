export enum UserRole {
  PUBLIC_REPORTER = 'PUBLIC_REPORTER',
  VOLUNTEER = 'VOLUNTEER',
  RESCUER = 'RESCUER',
  COORDINATOR = 'COORDINATOR'
}

export enum IncidentType {
  MISSING = 'MISSING',
  SIGHTING = 'SIGHTING',
  FOUND = 'FOUND',
  INJURED = 'INJURED',
  TRAPPED = 'TRAPPED',
  COLONY_RISK = 'COLONY_RISK'
}

export enum Urgency {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export enum IncidentStatus {
  NEW = 'NEW',
  AI_ANALYZED = 'AI_ANALYZED',
  NEEDS_VERIFICATION = 'NEEDS_VERIFICATION',
  VERIFIED = 'VERIFIED',
  MISSION_CREATED = 'MISSION_CREATED',
  RESCUE_IN_PROGRESS = 'RESCUE_IN_PROGRESS',
  SAFE = 'SAFE',
  REUNITED = 'REUNITED',
  CLOSED = 'CLOSED'
}

export enum MissionStatus {
  UNASSIGNED = 'UNASSIGNED',
  ASSIGNED = 'ASSIGNED',
  EN_ROUTE = 'EN_ROUTE',
  ON_SCENE = 'ON_SCENE',
  CAT_SECURED = 'CAT_SECURED',
  TRANSPORTING = 'TRANSPORTING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

// Backward compatibility types
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical' | Urgency;

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
  type: 'witness' | 'owner' | 'volunteer' | string;
  role?: UserRole;
}

export interface IncidentUpdate {
  id: string;
  timestamp: string;
  author: string;
  message: string;
  statusChanged?: IncidentStatus | string;
}

export interface MissionUpdate {
  id: string;
  timestamp: string;
  author: string;
  message: string;
}

// Rich Entity Definitions
export interface CatProfile {
  id?: string;
  name?: string;
  breed?: string;
  color: string;
  distinctiveFeatures: string;
  condition: string;
  microchipId?: string;
  ownerName?: string;
  ownerContact?: string;
}

export interface LocationPrivacy {
  name: string;
  lat: number;
  lng: number;
  details?: string;
  isMockedBlur?: boolean;
}

export interface EvidenceAttachment {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  capturedAt: string;
}

export interface AIAnalysis {
  confidence: number;
  summary: string;
  threatLevel: Urgency;
  recommendedGear: string[];
  matchScores?: Record<string, number>;
}

export interface PossibleMatch {
  id: string;
  incidentIdA: string;
  incidentIdB: string;
  confidenceScore: number;
  status: 'PENDING' | 'CONFIRMED' | 'DISMISSED';
  reason: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  author: string;
  message: string;
  statusChanged?: IncidentStatus | string;
}

export interface RescueMission {
  id: string;
  incidentId: string;
  title: string;
  status: MissionStatus | 'active' | 'completed' | 'cancelled'; // compatible with old and new
  assignedRescuers: string[];
  priority: Urgency | UrgencyLevel;
  createdAt: string;
  equipmentNeeded: string[];
  updates: TimelineEvent[];
}

export interface Volunteer {
  id: string;
  name: string;
  role: UserRole;
  contact: string;
  status: 'AVAILABLE' | 'ON_MISSION' | 'OFFLINE';
  location: string;
  fosterCapacity?: number;
}

export interface FosterOffer {
  id: string;
  volunteerId: string;
  fosterName: string;
  capacity: number;
  currentCount: number;
  specialties: string[];
  status: 'ACTIVE' | 'FULL' | 'INACTIVE';
}

// Combined Main Incident Interface
export interface Incident {
  id: string;
  title: string;
  type: IncidentType;
  status: IncidentStatus | string; // support legacy lowercase strings and enums
  urgency: Urgency | UrgencyLevel;
  catProfile: CatProfile;
  location: LocationPrivacy;
  reportedAt: string;
  reporter: ReporterData;
  notes: string;
  aiAnalysis?: AIAnalysis;
  evidence: EvidenceAttachment[];
  timeline: TimelineEvent[];
  possibleMatches?: PossibleMatch[];

  // Backward compatibility fields
  catDescription: CatDescription;
  aiConfidence: number;
  aiSummary: string;
  updates: IncidentUpdate[];
  mediaUrl?: string;
}

export interface Mission {
  id: string;
  incidentId: string;
  title: string;
  status: 'active' | 'completed' | 'cancelled' | MissionStatus | string;
  assignedRescuers: string[];
  priority: UrgencyLevel | Urgency;
  createdAt: string;
  equipmentNeeded: string[];
  updates: MissionUpdate[] | TimelineEvent[];
}

export interface Rescuer {
  id: string;
  name: string;
  role: 'field_rescuer' | 'medical_volunteer' | 'coordinator' | 'foster_care' | UserRole | string;
  contact: string;
  status: 'available' | 'on_mission' | 'offline' | string;
  location: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
