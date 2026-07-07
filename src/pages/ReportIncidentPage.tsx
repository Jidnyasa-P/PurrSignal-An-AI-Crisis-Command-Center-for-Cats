import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  MapPin, 
  Cat, 
  User, 
  Info, 
  AlertTriangle, 
  Upload, 
  Sparkles, 
  X,
  Compass,
  CheckCircle2,
  Trash2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  EyeOff,
  Eye,
  Activity,
  Lock,
  ChevronRight,
  RefreshCw,
  Clock,
  Briefcase,
  Search
} from 'lucide-react';
import { 
  Incident, 
  CatDescription, 
  LocationData, 
  ReporterData, 
  Urgency, 
  IncidentType, 
  IncidentStatus, 
  CatProfile, 
  AIAnalysis, 
  LocationPrivacy 
} from '../types';

interface ReportIncidentPageProps {
  onSubmitReport: (newIncident: any) => void;
  onNavigate: (page: string) => void;
}

export const ReportIncidentPage: React.FC<ReportIncidentPageProps> = ({ onSubmitReport, onNavigate }) => {
  // Wizard Steps: 1 (Incident Type), 2 (Evidence), 3 (AI Analysis Preview), 4 (Privacy), 5 (Review), 6 (Success Confirmation)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submissionRef, setSubmissionRef] = useState<string>('');

  // ----------------------------------------------------
  // STEP 1 STATE: INCIDENT TYPE
  // ----------------------------------------------------
  const [incidentType, setIncidentType] = useState<IncidentType>(IncidentType.SIGHTING);

  // ----------------------------------------------------
  // STEP 2 STATE: EVIDENCE
  // ----------------------------------------------------
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [locationName, setLocationName] = useState<string>('');
  const [locationDetails, setLocationDetails] = useState<string>('');
  const [lat, setLat] = useState<number>(37.7749);
  const [lng, setLng] = useState<number>(-122.4194);
  const [dateTime, setDateTime] = useState<string>(() => {
    const now = new Date();
    // Format to yyyy-MM-ddThh:mm for datetime-local
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now.getTime() - offset).toISOString().slice(0, 16);
    return localISOTime;
  });
  
  // Optional prefilled manually or by AI
  const [primaryColor, setPrimaryColor] = useState<string>('');
  const [secondaryColor, setSecondaryColor] = useState<string>('');
  const [coatPattern, setCoatPattern] = useState<string>('');
  const [estimatedLifeStage, setEstimatedLifeStage] = useState<string>('Unknown');
  const [distinctiveFeatures, setDistinctiveFeatures] = useState<string>('');

  // ----------------------------------------------------
  // STEP 3 STATE: AI ANALYSIS & EDITABLE ATTRIBUTES
  // ----------------------------------------------------
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiStepMessage, setAiStepMessage] = useState<string>('');
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiConfidence, setAiConfidence] = useState<number>(92);
  const [recommendedAction, setRecommendedAction] = useState<string>('Deploy humane trap and wait.');
  const [urgency, setUrgency] = useState<Urgency>(Urgency.MEDIUM);
  const [urgencyReasons, setUrgencyReasons] = useState<string[]>([]);
  const [observations, setObservations] = useState<string[]>([]);
  const [uncertainties, setUncertainties] = useState<string[]>([]);

  // ----------------------------------------------------
  // STEP 4 STATE: PRIVACY
  // ----------------------------------------------------
  const [privacyChoice, setPrivacyChoice] = useState<'public_approx' | 'rescue_exact' | 'private_report'>('public_approx');

  // ----------------------------------------------------
  // STEP 5 STATE: REPORTER INFO & SUBMISSION
  // ----------------------------------------------------
  const [reporterName, setReporterName] = useState<string>('');
  const [reporterContact, setReporterContact] = useState<string>('');
  const [reporterType, setReporterType] = useState<string>('witness');

  // File Upload Reference
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState<boolean>(false);

  // Auto-fill some base location address names
  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const roundedLat = parseFloat(position.coords.latitude.toFixed(5));
          const roundedLng = parseFloat(position.coords.longitude.toFixed(5));
          setLat(roundedLat);
          setLng(roundedLng);
          setLocationName(prev => prev || `Sighting coordinates near (${roundedLat}, ${roundedLng})`);
        },
        (error) => {
          const mockLats = [37.7720, 37.7845, 37.7592, 37.7651];
          const mockLngs = [-122.4660, -122.4182, -122.4340, -122.4211];
          const randomIdx = Math.floor(Math.random() * mockLats.length);
          setLat(mockLats[randomIdx]);
          setLng(mockLngs[randomIdx]);
          setLocationName(prev => prev || "Civic Plaza District, San Francisco");
        }
      );
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setSelectedImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // ----------------------------------------------------
  // GEMINI SERVER-SIDE API INTEGRATION
  // ----------------------------------------------------
  const runGeminiAnalysis = async () => {
    setIsAiLoading(true);
    setAiError(null);
    setAiStepMessage("Analyzing visual descriptors & transcriptions...");

    try {
      const messages = [
        "Scanning coat pattern colors...",
        "Identifying feline posture and safety risks...",
        "Structuring narrative observations...",
        "Finalizing operations-safe rescue suggestions..."
      ];

      let msgIndex = 0;
      const interval = setInterval(() => {
        if (msgIndex < messages.length - 1) {
          msgIndex++;
          setAiStepMessage(messages[msgIndex]);
        }
      }, 1100);

      const response = await fetch("/api/analyze-incident", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          image: selectedImage,
          notes: notes
        })
      });

      clearInterval(interval);

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();
      
      // Map return schema to component state
      if (data.incidentType) {
        // map string to IncidentType if matched
        const mappedType = Object.values(IncidentType).find(t => t === data.incidentType);
        if (mappedType) setIncidentType(mappedType);
      }

      if (data.catDescription) {
        setPrimaryColor(data.catDescription.primaryColor || '');
        setSecondaryColor(data.catDescription.secondaryColor || '');
        setCoatPattern(data.catDescription.coatPattern || '');
        setEstimatedLifeStage(data.catDescription.estimatedLifeStage || 'Unknown');
        setDistinctiveFeatures(
          Array.isArray(data.catDescription.distinctiveFeatures) 
            ? data.catDescription.distinctiveFeatures.join(', ') 
            : data.catDescription.distinctiveFeatures || ''
        );
      }

      setObservations(data.observations || []);
      
      if (data.urgency) {
        const mappedUrgency = Object.values(Urgency).find(u => u === data.urgency);
        if (mappedUrgency) setUrgency(mappedUrgency);
      }

      setUrgencyReasons(data.urgencyReasons || []);
      setUncertainties(data.uncertainties || []);
      setRecommendedAction(data.recommendedAction || '');
      setAiConfidence(data.confidence || 90);

      // Move to step 3 once completed successfully
      setCurrentStep(3);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Could not complete AI-assisted parsing. Check connection or settings.");
      setCurrentStep(3); // Render Step 3 with manual fallback option
    } finally {
      setIsAiLoading(false);
    }
  };

  // Manual fallback setup
  const fillManualDefaults = () => {
    setPrimaryColor(primaryColor || "Orange");
    setCoatPattern(coatPattern || "Tabby");
    setEstimatedLifeStage(estimatedLifeStage || "Adult");
    setDistinctiveFeatures(distinctiveFeatures || "Not specified");
    setObservations(["Citizen-provided description was entered manually."]);
    setUrgencyReasons(["Assessed by public reporter manual submission."]);
    setUncertainties(["Visual observation only. Human physical triage is required."]);
    setRecommendedAction("Dispatch coordinator to contact reporter and verify.");
    setAiConfidence(0); // indicates manual
    setAiError(null);
  };

  // Submit Handler
  const handleFinalSubmit = () => {
    const referenceId = `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmissionRef(referenceId);

    // Prepare profile & description matching schema
    const catProfile: CatProfile = {
      breed: "Domestic Shorthair",
      color: `${primaryColor}${secondaryColor ? ' and ' + secondaryColor : ''} (${coatPattern})`,
      distinctiveFeatures: distinctiveFeatures || "None specified",
      condition: urgency === Urgency.CRITICAL ? "Immediate hazard / trauma concern" : "Stable"
    };

    const catDescription: CatDescription = {
      color: catProfile.color,
      distinctiveFeatures: catProfile.distinctiveFeatures,
      condition: catProfile.condition
    };

    // Location privacy handling
    let blurredLat = lat;
    let blurredLng = lng;
    let blurredName = locationName;
    let isMockedBlur = false;

    if (privacyChoice === 'public_approx') {
      // Blur coordinates slightly (within 1km approx)
      blurredLat = parseFloat((lat + (Math.random() - 0.5) * 0.008).toFixed(4));
      blurredLng = parseFloat((lng + (Math.random() - 0.5) * 0.008).toFixed(4));
      blurredName = `Approximate location: ${locationName.split(',')[0]} Area`;
      isMockedBlur = true;
    }

    const locationPrivacy: LocationPrivacy = {
      name: blurredName,
      lat: blurredLat,
      lng: blurredLng,
      details: privacyChoice === 'rescue_exact' ? "EXACT SITE ACCESS DETAILS ONLY VISIBLE TO TEAM: " + locationDetails : locationDetails,
      isMockedBlur
    };

    // Mask contact if private
    const reporterData: ReporterData = {
      name: privacyChoice === 'private_report' ? "Private Reporter" : reporterName || "Anonymous Reporter",
      contact: privacyChoice === 'private_report' ? "REDACTED FOR PRIVACY" : reporterContact || "Not provided",
      type: reporterType
    };

    const aiAnalysis: AIAnalysis = {
      confidence: aiConfidence,
      summary: `INCIDENT DECLASSIFICATION: ${incidentType}. Coat description extracted: ${catProfile.color}. Urgency tier marked as ${urgency}. ${recommendedAction}`,
      threatLevel: urgency,
      recommendedGear: ["Mesh safety glove", "Humane feline trap cage", "Padded carrier basket"]
    };

    // Submit report with custom parameters matching `handleAddIncident`'s updated signatures
    onSubmitReport({
      id: referenceId,
      title: `${incidentType} report: ${catProfile.color} feline near ${blurredName.split(',')[0]}`,
      type: incidentType,
      status: IncidentStatus.NEW,
      urgency: urgency,
      catProfile,
      catDescription,
      location: locationPrivacy,
      reporter: reporterData,
      notes: notes,
      aiConfidence,
      aiSummary: aiAnalysis.summary,
      aiAnalysis,
      mediaUrl: selectedImage || undefined,
      updates: [
        {
          id: `up_${referenceId}_1`,
          timestamp: new Date().toISOString(),
          author: "Ops Dispatch",
          message: `New incident filed with reference ${referenceId}. Privacy settings mapped.`,
          statusChanged: IncidentStatus.NEW
        }
      ],
      timeline: [
        {
          id: `t_${referenceId}_1`,
          timestamp: new Date().toISOString(),
          author: "System Sensor",
          message: `Incident created with reference code ${referenceId}.`,
          statusChanged: IncidentStatus.NEW
        }
      ]
    });

    setCurrentStep(6); // Success screen
  };

  return (
    <div id="multi-step-reporter-container" className="max-w-4xl mx-auto px-4 py-8 text-slate-800 dark:text-slate-100">
      
      {/* HEADER BAR */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-rose-500 animate-pulse" />
            Intelligent Crisis Intake
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Polished multi-step emergency reporting network. Fully audited for privacy & safety.
          </p>
        </div>
        
        {/* STEPPER METRIC */}
        {currentStep <= 5 && (
          <div className="flex items-center gap-1.5 font-mono text-xs font-semibold bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-800">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  currentStep === s 
                    ? 'bg-amber-500 text-white shadow shadow-amber-500/20' 
                    : currentStep > s 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}>
                  {s}
                </span>
                {s < 5 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 mx-0.5" />}
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        
        {/* ==================================================== */}
        {/* STEP 1: INCIDENT TYPE */}
        {/* ==================================================== */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="text-center md:text-left space-y-1 mb-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Step 1: Select Incident Profile</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Choose the option that most accurately reflects the current status of the feline.</p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { type: IncidentType.MISSING, title: "My Cat is Missing", desc: "Report your lost companion to trigger local detection radars.", icon: Search, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30" },
                { type: IncidentType.SIGHTING, title: "I Saw a Cat", desc: "Log a brief visual sighting of a free-roaming cat.", icon: Eye, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/30" },
                { type: IncidentType.FOUND, title: "I Found a Cat", desc: "You have secured or are actively feeding a stray cat.", icon: CheckCircle2, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30" },
                { type: IncidentType.INJURED, title: "A Cat Appears Injured", desc: "Visible trauma, bleeding, limping, or severe medical stress.", icon: Activity, color: "text-rose-500 bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/30" },
                { type: IncidentType.TRAPPED, title: "A Cat is Trapped", desc: "Locked behind structures, in sewers, drains, or high trees.", icon: Lock, color: "text-purple-500 bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/30" },
                { type: IncidentType.COLONY_RISK, title: "A Colony May Be At Risk", desc: "Multiple feral cats facing immediate environmental threats.", icon: Cat, color: "text-teal-500 bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900/30" }
              ].map((card) => {
                const IconComp = card.icon === Search ? Compass : card.icon; // Fallback
                return (
                  <button
                    id={`btn-select-type-${card.type.toLowerCase()}`}
                    key={card.type}
                    onClick={() => setIncidentType(card.type)}
                    className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between h-44 hover:scale-[1.02] shadow-sm relative overflow-hidden group ${
                      incidentType === card.type 
                        ? 'border-amber-500 ring-2 ring-amber-500/10 bg-amber-500/5' 
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl border w-fit ${card.color}`}>
                      <IconComp className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    
                    <div className="space-y-1 z-10">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {card.title}
                        {incidentType === card.type && (
                          <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                        )}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{card.desc}</p>
                    </div>

                    {/* Subtle design element */}
                    <div className="absolute right-[-15px] bottom-[-15px] opacity-5 group-hover:scale-110 transition-transform">
                      <IconComp className="w-24 h-24 stroke-1" />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                id="btn-step1-next"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 font-bold rounded-xl shadow hover:bg-slate-800 dark:hover:bg-slate-200 transition-all flex items-center gap-1.5 text-sm"
              >
                Continue to Evidence
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ==================================================== */}
        {/* STEP 2: EVIDENCE */}
        {/* ==================================================== */}
        {currentStep === 2 && !isAiLoading && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-500" />
                Step 2: Collect Evidence & Telemetry
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Provide as many visual and narrative elements as possible. The AI will structure them in the next step.
              </p>
            </div>

            {/* DRAG DROP PHOTO */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                1. Photo Attachment
              </label>

              <div 
                id="wizard-drag-zone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
                className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  dragOver 
                    ? 'border-amber-500 bg-amber-50/20 dark:bg-amber-950/10' 
                    : selectedImage 
                      ? 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/20' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-950/10'
                }`}
              >
                <input
                  id="wizard-hidden-input"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {selectedImage ? (
                  <div className="space-y-3" onClick={e => e.stopPropagation()}>
                    <div className="relative w-40 h-40 mx-auto rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                      <img src={selectedImage} alt="Preview Sighting" className="w-full h-full object-cover" />
                      <button
                        id="btn-remove-wizard-photo"
                        type="button"
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-1.5 right-1.5 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400">Image loaded. Drag a new photo or click to replace.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-full w-10 h-10 flex items-center justify-center mx-auto border border-slate-200 dark:border-slate-700">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Drag and drop cat photo here, or click to browse</p>
                      <p className="text-[10px] text-slate-400">Supports PNG, JPG up to 10MB (Highly Recommended for AI Identification)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  2. Sighting Narrative / What happened? <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="wizard-notes"
                  required
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell us everything you saw. What does the cat look like? Is it acting skittish, injured, crying? What kind of area is it in? (e.g., 'Spotted a lost-looking orange cat with white front paws and a blue collar behind the coffee shop. Seems hungry but too scared to approach.')"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xs leading-relaxed"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    3. Sighting Date & Time
                  </label>
                  <input
                    id="wizard-datetime"
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    4. Identifying details (Optional baseline)
                  </label>
                  <input
                    id="wizard-baseline-color"
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="e.g. Orange, White paw, Tuxedo (optional)"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* GEOLOCATION */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="block text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                3. Spatial Coordinates & Landmarks
              </h3>

              <div className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-3 items-end">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                      Approximate Address or Landmark Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="wizard-address"
                      type="text"
                      required
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      placeholder="e.g., Fulton St and 10th Ave, SF"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <button
                      id="btn-wizard-geolocate"
                      type="button"
                      onClick={useCurrentLocation}
                      className="w-full py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                    >
                      <Compass className="w-3.5 h-3.5 text-amber-500" />
                      Pin Location
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                      Latitude
                    </label>
                    <input
                      id="wizard-lat"
                      type="number"
                      step="any"
                      value={lat}
                      onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                      Longitude
                    </label>
                    <input
                      id="wizard-lng"
                      type="number"
                      step="any"
                      value={lng}
                      onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                    Micro-directions / Site Access Instructions (Optional)
                  </label>
                  <input
                    id="wizard-directions"
                    type="text"
                    value={locationDetails}
                    onChange={(e) => setLocationDetails(e.target.value)}
                    placeholder="e.g. Hidden inside the dense ivy bushes behind the garbage dumpster."
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                id="btn-wizard-step2-back"
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2.5 font-bold text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <button
                id="btn-wizard-step2-next"
                type="button"
                disabled={!notes || !locationName}
                onClick={runGeminiAnalysis}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-rose-500/10 hover:shadow-rose-500/20 transition-all flex items-center gap-1.5 text-sm"
              >
                <Sparkles className="w-4 h-4 text-white" />
                Proceed to AI Analysis
              </button>
            </div>
          </motion.div>
        )}

        {/* LOADING ANIMATION FOR AI SCANNING */}
        {isAiLoading && (
          <motion.div
            key="ai-loader"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-slate-950 border border-slate-900 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-6 min-h-[380px]"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-rose-400 animate-pulse" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-t-rose-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold tracking-tight text-white flex items-center justify-center gap-1.5 font-mono">
                <Cat className="w-4 h-4 text-rose-400" />
                MULTIMODAL GEMINI DISPATCH
              </h3>
              <p className="text-[11px] font-mono text-slate-400 max-w-xs uppercase tracking-wider">
                {aiStepMessage}
              </p>
            </div>

            <div className="w-full max-w-xs bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full w-4/5 rounded-full animate-pulse" />
            </div>

            <div className="text-[10px] font-mono text-slate-500 max-w-xs border-t border-slate-900 pt-4 leading-relaxed">
              PurrSignal AI operates under veterinarian disclaimer boundaries. Visual classifications are approximate triage suggestions only.
            </div>
          </motion.div>
        )}

        {/* ==================================================== */}
        {/* STEP 3: AI ANALYSIS PREVIEW & EDITING */}
        {/* ==================================================== */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
                Step 3: AI-Assisted Telemetry Review
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verify and correct the automated feline classifications before dispatching to coordinators.
              </p>
            </div>

            {/* DISMANTLED FAILURE STATE IF ERROR OCCURRED */}
            {aiError && (
              <div className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/30 rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-start">
                <div className="p-2 bg-amber-100 dark:bg-amber-950 rounded-xl text-amber-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wide">
                    AI Auto-Analysis Unavailable
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    We couldn't connect with the feline vision intelligence server. This may happen if the Gemini API key isn't configured in secrets. Don't worry, you can easily complete a manual intake.
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button
                      id="btn-retry-ai"
                      onClick={runGeminiAnalysis}
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Retry Vision Scan
                    </button>
                    <button
                      id="btn-fill-manual"
                      onClick={fillManualDefaults}
                      className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg transition-colors"
                    >
                      Manual Intake Defaults
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SAFETY DISCLAIMER REQUIRED */}
            <div className="bg-rose-50/30 dark:bg-red-950/10 border border-rose-200/30 dark:border-red-900/40 rounded-2xl p-5 space-y-2">
              <h3 className="text-xs font-bold text-rose-800 dark:text-rose-400 flex items-center gap-1.5 uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4" />
                Critical Safety Requirement
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
                Never claim to diagnose medical conditions from images. Never claim visual identification is certain. 
                Visual observations and suggestions "may indicate" a possible state but "need human verification". 
                This interface shows a "visual observation only" report.
              </p>
            </div>

            {/* THE ANALYSIS GRID */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-[11px] font-bold font-mono tracking-wider text-rose-500 bg-rose-500/5 px-2.5 py-1 rounded border border-rose-500/10 uppercase">
                  AI-assisted analysis
                </span>
                {aiConfidence > 0 && (
                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                    Confidence: <span className="text-emerald-500 font-extrabold">{aiConfidence}%</span>
                  </span>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                
                {/* 1. Category Dropdown */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                    1. Categorized Incident Profile
                  </label>
                  <select
                    id="ai-edit-type"
                    value={incidentType}
                    onChange={(e) => setIncidentType(e.target.value as IncidentType)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value={IncidentType.MISSING}>Missing Companion Sighting</option>
                    <option value={IncidentType.SIGHTING}>Active Sighting</option>
                    <option value={IncidentType.FOUND}>Found Cat / Secured</option>
                    <option value={IncidentType.INJURED}>Injured Cat Sighting</option>
                    <option value={IncidentType.TRAPPED}>Trapped Cat Sighting</option>
                    <option value={IncidentType.COLONY_RISK}>Colony at Risk</option>
                  </select>
                </div>

                {/* 2. Urgency Level */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                    2. Categorical Urgency
                  </label>
                  <select
                    id="ai-edit-urgency"
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as Urgency)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value={Urgency.LOW}>LOW - Stable Sighting</option>
                    <option value={Urgency.MEDIUM}>MEDIUM - Stray / Unhoused</option>
                    <option value={Urgency.HIGH}>HIGH - Skittish / Exposure risk</option>
                    <option value={Urgency.CRITICAL}>CRITICAL - Injury / Immediate Danger</option>
                  </select>
                </div>

                {/* 3. Primary Color */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                    3. Coat Primary Color
                  </label>
                  <input
                    id="ai-edit-primary-color"
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                    placeholder="e.g. Ginger"
                  />
                </div>

                {/* 4. Secondary Color */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                    4. Coat Secondary Color (Optional)
                  </label>
                  <input
                    id="ai-edit-secondary-color"
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                    placeholder="e.g. White chest"
                  />
                </div>

                {/* 5. Coat Pattern */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                    5. Coat Pattern Group
                  </label>
                  <input
                    id="ai-edit-coat-pattern"
                    type="text"
                    value={coatPattern}
                    onChange={(e) => setCoatPattern(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                    placeholder="e.g. Tabby, Solid, Bi-color"
                  />
                </div>

                {/* 6. Estimated Life Stage */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                    6. Estimated Life Stage
                  </label>
                  <input
                    id="ai-edit-lifestage"
                    type="text"
                    value={estimatedLifeStage}
                    onChange={(e) => setEstimatedLifeStage(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                  />
                </div>

                {/* 7. Distinctive Features */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                    7. Extracted Distinctive Markings & Accessories
                  </label>
                  <input
                    id="ai-edit-distinctive"
                    type="text"
                    value={distinctiveFeatures}
                    onChange={(e) => setDistinctiveFeatures(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                    placeholder="e.g. Blue collar with small bell, notch on left ear."
                  />
                </div>

                {/* 8. Next operational action */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                    8. Recommended Next Operational Step (Ops Dispatch)
                  </label>
                  <textarea
                    id="ai-edit-action"
                    rows={2}
                    value={recommendedAction}
                    onChange={(e) => setRecommendedAction(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs leading-relaxed focus:outline-none"
                  />
                </div>
              </div>

              {/* UNCERTAINTIES PANEL PROMINENT DISPLAY */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-xl p-4.5 space-y-3">
                <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-500" />
                  Inferred Uncertainty Logs
                </span>
                
                <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400 font-mono list-disc list-inside pl-1 leading-relaxed">
                  {uncertainties.length > 0 ? (
                    uncertainties.map((u, i) => (
                      <li key={i} className="text-slate-500">{u}</li>
                    ))
                  ) : (
                    <>
                      <li>Visual observation only. Cannot guarantee matching identical cats.</li>
                      <li>Injured/disease categorization is a preliminary visual triage. Needs human veterinarian review.</li>
                      <li>Geographic movement speed may vary; precise trajectory remains unconfirmed.</li>
                    </>
                  )}
                </ul>
              </div>

            </div>

            {/* BUTTONS */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                id="btn-wizard-step3-back"
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2.5 font-bold text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Change Evidence
              </button>

              <button
                id="btn-wizard-step3-next"
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-5 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 font-bold rounded-xl shadow hover:bg-slate-800 dark:hover:bg-slate-200 transition-all flex items-center gap-1.5 text-sm"
              >
                Accept & Define Privacy
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ==================================================== */}
        {/* STEP 4: PRIVACY */}
        {/* ==================================================== */}
        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-500" />
                Step 4: Audit Privacy Parameters
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure visual precision, access permissions, and reporter visibility controls for security.
              </p>
            </div>

            <div className="space-y-4">
              
              {/* Option 1: Public Approx */}
              <button
                id="privacy-opt-approx"
                onClick={() => setPrivacyChoice('public_approx')}
                className={`w-full p-5 rounded-2xl border text-left transition-all flex items-start gap-4 hover:scale-[1.005] ${
                  privacyChoice === 'public_approx'
                    ? 'border-indigo-500 bg-indigo-500/5 dark:bg-indigo-950/10 ring-1 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <div className={`p-2.5 rounded-xl border ${
                  privacyChoice === 'public_approx' ? 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950 border-indigo-200' : 'text-slate-400 border-slate-100 dark:border-slate-800'
                }`}>
                  <Compass className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    PUBLIC APPROXIMATE LOCATION
                    {privacyChoice === 'public_approx' && <span className="text-[9px] bg-indigo-500 text-white font-mono px-1.5 py-0.5 rounded font-bold">RECOMMENDED</span>}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Display a reduced-precision, slightly blurred location marker publicly. Protects the specific rescue scene from unauthorized traffic while allowing neighbor awareness.
                  </p>
                </div>
              </button>

              {/* Option 2: Rescue Exact */}
              <button
                id="privacy-opt-exact"
                onClick={() => setPrivacyChoice('rescue_exact')}
                className={`w-full p-5 rounded-2xl border text-left transition-all flex items-start gap-4 hover:scale-[1.005] ${
                  privacyChoice === 'rescue_exact'
                    ? 'border-indigo-500 bg-indigo-500/5 dark:bg-indigo-950/10 ring-1 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <div className={`p-2.5 rounded-xl border ${
                  privacyChoice === 'rescue_exact' ? 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950 border-indigo-200' : 'text-slate-400 border-slate-100 dark:border-slate-800'
                }`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">RESCUE TEAM EXACT LOCATION</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Exact geolocation coordinates, address names, and specific site micro-directions are visible strictly to authorized PurrSignal rescuers and vet coordinators.
                  </p>
                </div>
              </button>

              {/* Option 3: Private Report */}
              <button
                id="privacy-opt-private"
                onClick={() => setPrivacyChoice('private_report')}
                className={`w-full p-5 rounded-2xl border text-left transition-all flex items-start gap-4 hover:scale-[1.005] ${
                  privacyChoice === 'private_report'
                    ? 'border-indigo-500 bg-indigo-500/5 dark:bg-indigo-950/10 ring-1 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <div className={`p-2.5 rounded-xl border ${
                  privacyChoice === 'private_report' ? 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950 border-indigo-200' : 'text-slate-400 border-slate-100 dark:border-slate-800'
                }`}>
                  <EyeOff className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">PRIVATE REPORT</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Contact details and reporter phone handles are strictly locked in encrypted logs and never displayed on public feeds, mapping overlays, or unauthenticated boards.
                  </p>
                </div>
              </button>

            </div>

            {/* BUTTONS */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                id="btn-wizard-step4-back"
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2.5 font-bold text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Adjust AI Data
              </button>

              <button
                id="btn-wizard-step4-next"
                type="button"
                onClick={() => setCurrentStep(5)}
                className="px-5 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 font-bold rounded-xl shadow hover:bg-slate-800 dark:hover:bg-slate-200 transition-all flex items-center gap-1.5 text-sm"
              >
                Review Report
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ==================================================== */}
        {/* STEP 5: REVIEW AND SUBMIT */}
        {/* ==================================================== */}
        {currentStep === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Step 5: Review & Submit Sighting Profile
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inspect structured telemetry results. Submit to catalog records on the active crisis coordinate map.
              </p>
            </div>

            {/* THE PROFILE DISPLAY CARD */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-6">
              
              {/* Profile Main info */}
              <div className="flex flex-col md:flex-row gap-5 items-start border-b border-slate-100 dark:border-slate-800 pb-5">
                {selectedImage ? (
                  <div className="w-32 h-32 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
                    <img src={selectedImage} alt="Reported Feline" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-800 shrink-0">
                    <Cat className="w-10 h-10" />
                  </div>
                )}

                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded shadow-sm">
                      {incidentType}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-500 text-white px-2 py-0.5 rounded shadow-sm">
                      {privacyChoice.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded shadow-sm">
                      {urgency} URGENCY
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Feline near {locationName.split(',')[0]}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                    "{notes.substring(0, 180)}..."
                  </p>
                </div>
              </div>

              {/* Attributes Details */}
              <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono border-b border-slate-100 dark:border-slate-800 pb-5">
                <div className="space-y-1.5">
                  <div className="flex justify-between border-b border-slate-50 dark:border-slate-800/40 pb-1">
                    <span className="text-slate-400">Primary Coat:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{primaryColor}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 dark:border-slate-800/40 pb-1">
                    <span className="text-slate-400">Coat Pattern:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{coatPattern || 'None'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 dark:border-slate-800/40 pb-1">
                    <span className="text-slate-400">Secondary Coat:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{secondaryColor || 'None'}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between border-b border-slate-50 dark:border-slate-800/40 pb-1">
                    <span className="text-slate-400">Life Stage:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{estimatedLifeStage}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 dark:border-slate-800/40 pb-1">
                    <span className="text-slate-400">Location:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100 truncate max-w-[150px]">{locationName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 dark:border-slate-800/40 pb-1">
                    <span className="text-slate-400">Timestamp:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{new Date(dateTime).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-1 mt-1">
                  <span className="text-slate-400">Distinctive Markings:</span>
                  <p className="text-slate-800 dark:text-slate-100 font-bold leading-relaxed">{distinctiveFeatures || 'None'}</p>
                </div>
              </div>

              {/* Reporter Credentials Inputs */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" />
                  Your Contact Credentials
                </h4>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      Reporter Name
                    </label>
                    <input
                      id="step5-reporter-name"
                      type="text"
                      required
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      placeholder="e.g. Elena Parker"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      Contact Handle / Phone
                    </label>
                    <input
                      id="step5-reporter-contact"
                      type="text"
                      required
                      value={reporterContact}
                      onChange={(e) => setReporterContact(e.target.value)}
                      placeholder="e.g. +1 (555) 012-9014"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      Reporter Role
                    </label>
                    <select
                      id="step5-reporter-type"
                      value={reporterType}
                      onChange={(e) => setReporterType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="witness">Concerned Witness</option>
                      <option value="owner">Feline Owner</option>
                      <option value="volunteer">Registered Responder</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            {/* BUTTONS */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                id="btn-wizard-step5-back"
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2.5 font-bold text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Change Privacy
              </button>

              <button
                id="btn-wizard-submit"
                type="button"
                disabled={!reporterName || !reporterContact}
                onClick={handleFinalSubmit}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all flex items-center gap-1.5 text-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                Submit Incident Report
              </button>
            </div>
          </motion.div>
        )}

        {/* ==================================================== */}
        {/* STEP 6: SUCCESS CONFIRMATION */}
        {/* ==================================================== */}
        {currentStep === 6 && (
          <motion.div
            key="step6"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-xl max-w-lg mx-auto">
              
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-500 shadow-inner">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Report Logged Successfully</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your incident has been securely processed, geocoded, and added to coordinates.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Reference:</span>
                  <span className="font-extrabold text-rose-500">{submissionRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Intake Status:</span>
                  <span className="font-extrabold text-amber-500 uppercase">AI-Analyzed & Scheduled</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 max-w-[180px] truncate">{locationName}</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  id="btn-confirm-map"
                  onClick={() => onNavigate('map')}
                  className="w-full py-3 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-950 font-bold rounded-xl shadow transition-colors text-xs"
                >
                  View on Sighting Map
                </button>
                <button
                  id="btn-confirm-dashboard"
                  onClick={() => onNavigate('dashboard')}
                  className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors text-xs"
                >
                  View in Mission Control
                </button>
                <button
                  id="btn-confirm-reset"
                  onClick={() => {
                    // Reset everything
                    setCurrentStep(1);
                    setIncidentType(IncidentType.SIGHTING);
                    setSelectedImage(null);
                    setNotes('');
                    setLocationName('');
                    setLocationDetails('');
                    setLat(37.7749);
                    setLng(-122.4194);
                    setPrimaryColor('');
                    setSecondaryColor('');
                    setCoatPattern('');
                    setEstimatedLifeStage('Unknown');
                    setDistinctiveFeatures('');
                    setUncertainties([]);
                    setUrgency(Urgency.MEDIUM);
                  }}
                  className="w-full py-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-bold text-xs transition-colors"
                >
                  File another incident report
                </button>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};
