import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  XCircle, 
  Clock, 
  Activity, 
  Eye, 
  ShieldAlert, 
  MapPin, 
  User, 
  Award, 
  Heart,
  ChevronRight,
  ExternalLink,
  Cat
} from 'lucide-react';
import { Incident, Mission, IncidentStatus, UrgencyLevel, ToastMessage, Urgency } from '../types';

// ==========================================
// STATUS BADGE
// ==========================================
interface StatusBadgeProps {
  status: IncidentStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config: Record<string, { bg: string; text: string; label: string; icon: any }> = {
    reported: { 
      bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700/50', 
      text: 'text-slate-700 dark:text-slate-300',
      label: 'Reported', 
      icon: Clock 
    },
    [IncidentStatus.NEW]: { 
      bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700/50', 
      text: 'text-slate-700 dark:text-slate-300',
      label: 'Reported', 
      icon: Clock 
    },
    structured: { 
      bg: 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/50', 
      text: 'text-purple-700 dark:text-purple-300',
      label: 'AI Structured', 
      icon: Activity 
    },
    [IncidentStatus.AI_ANALYZED]: { 
      bg: 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/50', 
      text: 'text-purple-700 dark:text-purple-300',
      label: 'AI Structured', 
      icon: Activity 
    },
    verified: { 
      bg: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50', 
      text: 'text-blue-700 dark:text-blue-300',
      label: 'Verified Sighting', 
      icon: Eye 
    },
    [IncidentStatus.VERIFIED]: { 
      bg: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50', 
      text: 'text-blue-700 dark:text-blue-300',
      label: 'Verified Sighting', 
      icon: Eye 
    },
    prioritized: { 
      bg: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50', 
      text: 'text-amber-700 dark:text-amber-300',
      label: 'Needs Verification', 
      icon: AlertTriangle 
    },
    [IncidentStatus.NEEDS_VERIFICATION]: { 
      bg: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50', 
      text: 'text-amber-700 dark:text-amber-300',
      label: 'Needs Verification', 
      icon: AlertTriangle 
    },
    mission_created: { 
      bg: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/50', 
      text: 'text-rose-700 dark:text-rose-300',
      label: 'Active Mission', 
      icon: ShieldAlert 
    },
    [IncidentStatus.MISSION_CREATED]: { 
      bg: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/50', 
      text: 'text-rose-700 dark:text-rose-300',
      label: 'Active Mission', 
      icon: ShieldAlert 
    },
    [IncidentStatus.RESCUE_IN_PROGRESS]: { 
      bg: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50', 
      text: 'text-amber-700 dark:text-amber-300',
      label: 'Rescue In Progress', 
      icon: Activity 
    },
    rescued: { 
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50', 
      text: 'text-emerald-700 dark:text-emerald-300',
      label: 'Secured/Rescued', 
      icon: CheckCircle2 
    },
    [IncidentStatus.SAFE]: { 
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50', 
      text: 'text-emerald-700 dark:text-emerald-300',
      label: 'Secured/Safe', 
      icon: CheckCircle2 
    },
    recovered: { 
      bg: 'bg-cyan-50 text-cyan-700 border-cyan-100 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-900/50', 
      text: 'text-cyan-700 dark:text-cyan-300',
      label: 'In Stable Recovery', 
      icon: Heart 
    },
    reunited: { 
      bg: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-900/50', 
      text: 'text-yellow-700 dark:text-yellow-300',
      label: 'Reunited!', 
      icon: Award 
    },
    [IncidentStatus.REUNITED]: { 
      bg: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-900/50', 
      text: 'text-yellow-700 dark:text-yellow-300',
      label: 'Reunited!', 
      icon: Award 
    },
    [IncidentStatus.CLOSED]: { 
      bg: 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700', 
      text: 'text-slate-500 dark:text-slate-400',
      label: 'Closed / Inactive', 
      icon: XCircle 
    }
  };

  const current = config[status] || config.reported || config[IncidentStatus.NEW];
  const Icon = current.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs font-semibold' : 'px-3 py-1 text-sm font-semibold';

  return (
    <span id={`badge-${status}`} className={`inline-flex items-center gap-1.5 rounded-full border ${current.bg} ${sizeClasses}`}>
      <Icon className="w-3.5 h-3.5" />
      {current.label}
    </span>
  );
};

// ==========================================
// URGENCY INDICATOR
// ==========================================
interface UrgencyIndicatorProps {
  urgency: UrgencyLevel | Urgency;
  showText?: boolean;
}

export const UrgencyIndicator: React.FC<UrgencyIndicatorProps> = ({ urgency, showText = true }) => {
  const config: Record<string, { bg: string; text: string; glow: string; label: string; icon: any }> = {
    low: { 
      bg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400', 
      text: 'text-slate-600 dark:text-slate-400', 
      glow: '', 
      label: 'Routine', 
      icon: Info 
    },
    [Urgency.LOW]: { 
      bg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400', 
      text: 'text-slate-600 dark:text-slate-400', 
      glow: '', 
      label: 'Routine', 
      icon: Info 
    },
    medium: { 
      bg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400', 
      text: 'text-sky-600 dark:text-sky-400', 
      glow: '', 
      label: 'Moderate', 
      icon: Clock 
    },
    [Urgency.MEDIUM]: { 
      bg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400', 
      text: 'text-sky-600 dark:text-sky-400', 
      glow: '', 
      label: 'Moderate', 
      icon: Clock 
    },
    high: { 
      bg: 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400', 
      text: 'text-orange-600 dark:text-orange-400', 
      glow: '', 
      label: 'High Urgency', 
      icon: AlertTriangle 
    },
    [Urgency.HIGH]: { 
      bg: 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400', 
      text: 'text-orange-600 dark:text-orange-400', 
      glow: '', 
      label: 'High Urgency', 
      icon: AlertTriangle 
    },
    critical: { 
      bg: 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/60 animate-pulse-glow', 
      text: 'text-red-600 dark:text-red-400 font-bold', 
      glow: 'shadow-lg shadow-red-500/20', 
      label: 'CRITICAL', 
      icon: ShieldAlert 
    },
    [Urgency.CRITICAL]: { 
      bg: 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/60 animate-pulse-glow', 
      text: 'text-red-600 dark:text-red-400 font-bold', 
      glow: 'shadow-lg shadow-red-500/20', 
      label: 'CRITICAL', 
      icon: ShieldAlert 
    }
  };

  const current = config[urgency] || config.low || config[Urgency.LOW];
  const Icon = current.icon;

  return (
    <div id={`urgency-${urgency}`} className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold ${current.bg} ${current.glow}`}>
      <Icon className="w-3.5 h-3.5" />
      {showText && <span>{current.label}</span>}
    </div>
  );
};

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />
  };

  return (
    <motion.div
      id={`toast-${toast.id}`}
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      className="flex items-start gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-w-sm pointer-events-auto"
    >
      <div className="flex-shrink-0 mt-0.5">
        {icons[toast.type]}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{toast.title}</h4>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{toast.description}</p>
      </div>
      <button 
        id={`close-toast-${toast.id}`}
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
      >
        <XCircle className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// Toast Container helper
interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div id="toast-container" className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <Toast key={t.id} toast={t} onClose={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// MODAL
// ==========================================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = 'md' }) => {
  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  }[maxWidth];

  return (
    <div id="modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        id="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
      />

      {/* Content Card */}
      <motion.div
        id="modal-card"
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className={`relative w-full ${widthClasses} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4 flex-shrink-0">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Cat className="w-5 h-5 text-amber-500" />
            {title}
          </h3>
          <button 
            id="modal-close-btn"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto pr-1">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

// ==========================================
// CONFIRMATION DIALOG
// ==========================================
interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div id="confirm-dialog-content" className="space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{message}</p>
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            id="confirm-cancel-btn"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-800"
          >
            {cancelLabel}
          </button>
          <button
            id="confirm-action-btn"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-all ${
              isDestructive 
                ? 'bg-red-600 hover:bg-red-700 shadow-sm shadow-red-500/20' 
                : 'bg-amber-600 hover:bg-amber-700 shadow-sm shadow-amber-500/20'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ==========================================
// EMPTY STATE
// ==========================================
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div id="empty-state" className="flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/80">
      <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm text-slate-400 dark:text-slate-500 mb-4 border border-slate-100 dark:border-slate-700">
        {icon || <Cat className="w-10 h-10 stroke-1" />}
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          id="empty-state-action"
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm shadow-amber-500/10 transition-all hover:-translate-y-0.5"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

// ==========================================
// LOADING SKELETON
// ==========================================
export const LoadingSkeleton: React.FC = () => {
  return (
    <div id="loading-skeleton" className="space-y-4 animate-pulse">
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3"></div>
      <div className="h-32 bg-slate-100 dark:bg-slate-800/50 rounded-xl"></div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-5/6"></div>
      </div>
    </div>
  );
};

// ==========================================
// INCIDENT CARD
// ==========================================
interface IncidentCardProps {
  incident: Incident;
  onClick: (id: string) => void;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onClick }) => {
  return (
    <div 
      id={`incident-card-${incident.id}`}
      onClick={() => onClick(incident.id)}
      className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden"
    >
      {/* Decorative vertical colored side bar */}
      <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
        incident.urgency === 'critical' ? 'bg-red-500' :
        incident.urgency === 'high' ? 'bg-orange-500' :
        incident.urgency === 'medium' ? 'bg-sky-500' : 'bg-slate-300 dark:bg-slate-600'
      }`} />

      <div className="flex items-start justify-between gap-4 pl-2">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={incident.status} size="sm" />
            <UrgencyIndicator urgency={incident.urgency} />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors pt-1">
            {incident.title}
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono flex-shrink-0 mt-1">
          {new Date(incident.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {incident.mediaUrl && (
        <div className="h-40 w-full overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-950 pl-2">
          <img 
            src={incident.mediaUrl} 
            alt={incident.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      <div className="space-y-2 pl-2 flex-1">
        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
          {incident.notes}
        </p>

        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 pt-2 text-xs font-medium text-slate-500 dark:text-slate-400 border-t border-slate-50 dark:border-slate-800/50">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate max-w-[200px]">{incident.location.name}</span>
          </span>
          <span className="flex items-center gap-1 ml-auto font-mono text-[10px] bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded">
            AI Structuring: {incident.aiConfidence}%
          </span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MISSION CARD
// ==========================================
interface MissionCardProps {
  mission: Mission;
  onViewIncident: (id: string) => void;
  onManageMission: (mission: Mission) => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({ mission, onViewIncident, onManageMission }) => {
  return (
    <div 
      id={`mission-card-${mission.id}`}
      className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-xl hover:shadow-2xl hover:border-slate-700 transition-all flex flex-col gap-4 relative overflow-hidden"
    >
      {/* Pulse beacon top right */}
      {mission.status === 'active' && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          Live Ops
        </div>
      )}

      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded">
            MSN-{mission.id.split('_')[1] || mission.id}
          </span>
          <UrgencyIndicator urgency={mission.priority} />
        </div>
        <h3 className="text-base font-bold text-slate-100 mt-2">
          {mission.title}
        </h3>
      </div>

      <div className="space-y-2 flex-1">
        <div>
          <span className="text-xs text-slate-500 block">Assigned Rescuers:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {mission.assignedRescuers.map((name, i) => (
              <span key={i} className="text-xs font-semibold text-slate-200 bg-slate-800 border border-slate-700/60 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <User className="w-3 h-3 text-amber-400" />
                {name}
              </span>
            ))}
          </div>
        </div>

        {mission.equipmentNeeded.length > 0 && (
          <div>
            <span className="text-xs text-slate-500 block">Required Equipment:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {mission.equipmentNeeded.slice(0, 3).map((eq, i) => (
                <span key={i} className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800/40">
                  {eq}
                </span>
              ))}
              {mission.equipmentNeeded.length > 3 && (
                <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800/40">
                  +{mission.equipmentNeeded.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {mission.updates.length > 0 && (
          <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/60 mt-3">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block tracking-wider">Latest Transmission:</span>
            <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
              &ldquo;{mission.updates[mission.updates.length - 1].message}&rdquo;
            </p>
            <span className="text-[9px] font-mono text-slate-500 block text-right mt-1.5">
              — {mission.updates[mission.updates.length - 1].author}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60">
        <button
          id={`view-inc-btn-${mission.id}`}
          onClick={() => onViewIncident(mission.incidentId)}
          className="py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-800 flex items-center justify-center gap-1"
        >
          View Incident
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button
          id={`manage-msn-btn-${mission.id}`}
          onClick={() => onManageMission(mission)}
          className="py-1.5 text-xs font-semibold text-slate-900 bg-amber-500 hover:bg-amber-400 rounded-lg transition-all shadow-sm shadow-amber-500/10 hover:shadow-amber-500/20 text-center flex items-center justify-center gap-1"
        >
          Manage Ops
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
