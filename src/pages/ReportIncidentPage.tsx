import React, { useState, useRef } from 'react';
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
  Trash2
} from 'lucide-react';
import { Incident, CatDescription, LocationData, ReporterData, UrgencyLevel } from '../types';

interface ReportIncidentPageProps {
  onSubmitReport: (newIncident: Omit<Incident, 'id' | 'reportedAt' | 'aiConfidence' | 'aiSummary' | 'updates'> & { mediaFile?: File }) => void;
  onNavigate: (page: string) => void;
}

export const ReportIncidentPage: React.FC<ReportIncidentPageProps> = ({ onSubmitReport, onNavigate }) => {
  // Form State
  const [title, setTitle] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [reporterType, setReporterType] = useState<'witness' | 'owner' | 'volunteer'>('witness');
  const [notes, setNotes] = useState('');
  
  // Cat Description
  const [color, setColor] = useState('');
  const [distinctiveFeatures, setDistinctiveFeatures] = useState('');
  const [condition, setCondition] = useState('');
  
  // Location
  const [locationName, setLocationName] = useState('');
  const [locationDetails, setLocationDetails] = useState('');
  const [lat, setLat] = useState<number>(37.7749);
  const [lng, setLng] = useState<number>(-122.4194);
  
  // Flag
  const [isImmediateDanger, setIsImmediateDanger] = useState(false);
  
  // Media Upload Simulator State
  const [dragOver, setDragOver] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulation Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiProgressStep, setAiProgressStep] = useState(0);

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

  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(parseFloat(position.coords.latitude.toFixed(4)));
          setLng(parseFloat(position.coords.longitude.toFixed(4)));
          setLocationName(prev => prev || "My Detected Location");
        },
        (error) => {
          // Standard mock fallback if frame permissions prevent real location
          const mockLats = [37.7699, 37.7833, 37.7554, 37.7620];
          const mockLngs = [-122.4468, -122.4167, -122.4350, -122.4220];
          const randomIdx = Math.floor(Math.random() * mockLats.length);
          setLat(mockLats[randomIdx]);
          setLng(mockLngs[randomIdx]);
          setLocationName(prev => prev || "Downtown District coordinates loaded");
        }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !notes || !locationName || !color) {
      alert("Please fill in the required fields highlighted with red asterisks (*)");
      return;
    }

    setIsSubmitting(true);
    setAiProgressStep(1); // "Structuring text..."

    // Simulating the high-quality AI structuring process
    setTimeout(() => {
      setAiProgressStep(2); // "Correlating with neighborhood registers..."
      setTimeout(() => {
        setAiProgressStep(3); // "Completed! Submitting to coordinators..."
        setTimeout(() => {
          const urgency: UrgencyLevel = isImmediateDanger ? 'critical' : 'medium';
          
          onSubmitReport({
            title,
            status: 'reported',
            urgency,
            catDescription: {
              color,
              distinctiveFeatures: distinctiveFeatures || "None specified",
              condition: condition || "Apparently stable"
            },
            location: {
              name: locationName,
              lat,
              lng,
              details: locationDetails
            },
            reporter: {
              name: reporterName || "Anonymous Reporter",
              contact: reporterContact || "Not provided",
              type: reporterType
            },
            notes,
            mediaUrl: selectedImage || undefined
          });

          // Reset Form
          setTitle('');
          setReporterName('');
          setReporterContact('');
          setNotes('');
          setColor('');
          setDistinctiveFeatures('');
          setCondition('');
          setLocationName('');
          setLocationDetails('');
          setIsImmediateDanger(false);
          setSelectedImage(null);
          setIsSubmitting(false);
          setAiProgressStep(0);
          
          // Redirect to Map or Dashboard
          onNavigate('dashboard');
        }, 1200);
      }, 1200);
    }, 1200);
  };

  return (
    <div id="report-page-container" className="max-w-4xl mx-auto px-4 py-8 text-slate-800 dark:text-slate-100">
      
      {/* Page Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-6 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-8 h-8 text-rose-500" />
          Public Incident & Sighting Reporter
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          File a report for a lost, trapped, injured, or stray cat. Our proprietary Feline AI immediately restructures and analyzes reports so local rescue networks can prioritize response.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {isSubmitting ? (
          /* AI STRUCTURING LOADER SYSTEM */
          <motion.div 
            key="ai-loader"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-2xl flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-amber-400 animate-pulse" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-t-amber-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                <Cat className="w-5 h-5 text-amber-400" />
                Structuring with PurrSignal AI
              </h3>
              <p className="text-sm text-slate-400 max-w-sm">
                Parsing unstructured description into emergency categorical models.
              </p>
            </div>

            {/* Steps feedback */}
            <div className="w-full max-w-xs space-y-3 font-mono text-xs text-left border-t border-slate-800 pt-6 mt-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${aiProgressStep >= 1 ? 'bg-amber-400 animate-ping' : 'bg-slate-700'}`} />
                <span className={aiProgressStep >= 1 ? 'text-amber-400 font-semibold' : 'text-slate-500'}>
                  1. Restructuring narrative data...
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${aiProgressStep >= 2 ? 'bg-amber-400 animate-ping' : 'bg-slate-700'}`} />
                <span className={aiProgressStep >= 2 ? 'text-amber-400 font-semibold' : 'text-slate-500'}>
                  2. Scanning local weather & flood indexes...
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${aiProgressStep >= 3 ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                <span className={aiProgressStep >= 3 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                  3. Cataloging incident profile...
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          /* THE FORM */
          <motion.form 
            key="report-form"
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* GENERAL INCIDENT DESCRIPTION */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2 border-b border-slate-50 dark:border-slate-800 pb-3">
                <FileText className="w-5 h-5 text-rose-500" />
                1. Incident Narrative
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Report Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Skinny grey cat trapped behind convenience store dumpster"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Raw Description / What happened? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="input-notes"
                    required
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Explain what you saw in your own words. Don't worry about structuring the details—our AI will handle that. (e.g. 'There is a cat crying behind the locked gate, looks like it's dragging its front leg. There is rain forecast tonight, please hurry.')"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* CAT DETAILS SPECIFICATION */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2 border-b border-slate-50 dark:border-slate-800 pb-3">
                <Cat className="w-5 h-5 text-amber-500" />
                2. Feline Characteristics
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Cat Color / Coat Pattern <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-color"
                    type="text"
                    required
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="e.g. Calico (black/white/ginger), Orange Tabby"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Observed Condition
                  </label>
                  <input
                    id="input-condition"
                    type="text"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    placeholder="e.g. Limping, wet/cold, skinny, healthy"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Distinctive Marks / Collar / Breed features
                  </label>
                  <input
                    id="input-features"
                    type="text"
                    value={distinctiveFeatures}
                    onChange={(e) => setDistinctiveFeatures(e.target.value)}
                    placeholder="e.g. White tip on tail, wearing red breakaway collar with small bell"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* LOCATION DETAILS */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2 border-b border-slate-50 dark:border-slate-800 pb-3">
                <MapPin className="w-5 h-5 text-sky-500" />
                3. Incident Location
              </h2>

              <div className="space-y-4">
                <div className="grid sm:grid-cols-4 gap-4 items-end">
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      General Address or Landmark Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="input-address"
                      type="text"
                      required
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      placeholder="e.g. 5th Ave and Maple St, Alley behind Auto Repair"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <button
                      id="btn-geolocate"
                      type="button"
                      onClick={useCurrentLocation}
                      className="w-full py-3 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <Compass className="w-4 h-4 text-amber-500" />
                      Pin Coordinates
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Latitude
                    </label>
                    <input
                      id="input-lat"
                      type="number"
                      step="any"
                      value={lat}
                      onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Longitude
                    </label>
                    <input
                      id="input-lng"
                      type="number"
                      step="any"
                      value={lng}
                      onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Micro-directions / Site Access Instructions
                  </label>
                  <input
                    id="input-directions"
                    type="text"
                    value={locationDetails}
                    onChange={(e) => setLocationDetails(e.target.value)}
                    placeholder="e.g. Under the wooden loading docks, locked behind the heavy black gate"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* REPORTER INFORMATION */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2 border-b border-slate-50 dark:border-slate-800 pb-3">
                <User className="w-5 h-5 text-indigo-500" />
                4. Reporter Details
              </h2>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Who are you?
                  </label>
                  <select
                    id="select-reporter-type"
                    value={reporterType}
                    onChange={(e) => setReporterType(e.target.value as any)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  >
                    <option value="witness">Concerned Citizen / Witness</option>
                    <option value="owner">Frantic Cat Owner</option>
                    <option value="volunteer">Registered PurrSignal Volunteer</option>
                  </select>
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Reporter Name
                  </label>
                  <input
                    id="input-reporter-name"
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="e.g. Sarah Connor"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Contact Phone / Chat Handle
                  </label>
                  <input
                    id="input-reporter-contact"
                    type="text"
                    value={reporterContact}
                    onChange={(e) => setReporterContact(e.target.value)}
                    placeholder="e.g. +1 (555) 123-4567"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* PHOTO UPLOAD */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2 border-b border-slate-50 dark:border-slate-800 pb-3">
                <Upload className="w-5 h-5 text-teal-500" />
                5. Visual Evidence
              </h2>

              <div 
                id="drag-drop-zone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  dragOver 
                    ? 'border-amber-500 bg-amber-50/25 dark:bg-amber-950/10 scale-[0.99]' 
                    : selectedImage 
                      ? 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-950/10'
                }`}
                onClick={triggerFileSelect}
              >
                <input
                  id="hidden-file-input"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <AnimatePresence mode="wait">
                  {selectedImage ? (
                    <motion.div 
                      key="preview"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="space-y-4"
                      onClick={(e) => e.stopPropagation()} // Prevent trigger select
                    >
                      <div className="relative w-48 h-48 mx-auto rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
                        <img 
                          src={selectedImage} 
                          alt="Uploaded Sighting" 
                          className="w-full h-full object-cover"
                        />
                        <button
                          id="btn-remove-photo"
                          type="button"
                          onClick={removeSelectedImage}
                          className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:scale-105 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs text-slate-500">Image attached. Drag another file to replace.</div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="prompt"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3"
                    >
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700 w-12 h-12 flex items-center justify-center mx-auto">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold">Drag and drop cat photo here, or click to browse</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">Supports PNG, JPG, JPEG up to 10MB</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* URGENCY ESCALATION CHECK */}
            <div className="bg-rose-50/40 dark:bg-red-950/10 border border-rose-200/40 dark:border-red-900/40 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <input
                  id="checkbox-immediate-danger"
                  type="checkbox"
                  checked={isImmediateDanger}
                  onChange={(e) => setIsImmediateDanger(e.target.checked)}
                  className="mt-1 w-5 h-5 accent-red-600 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
                />
                <div>
                  <label htmlFor="checkbox-immediate-danger" className="text-sm font-bold text-red-800 dark:text-red-400 cursor-pointer select-none flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    ESCALATE: Is this cat in immediate, life-threatening danger?
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Check this box ONLY if the cat is trapped in a flooding sewer/drain, caught in heavy industrial machinery, suffering from extreme physical crushing trauma, or facing immediate predator attack. Doing so bypasses regular verification delays.
                  </p>
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                id="btn-report-cancel"
                type="button"
                onClick={() => onNavigate('landing')}
                className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors"
              >
                Cancel
              </button>
              
              <button
                id="btn-report-submit"
                type="submit"
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transition-all flex items-center gap-2 group hover:-translate-y-0.5"
              >
                <Sparkles className="w-5 h-5" />
                Submit & Structure with AI
              </button>
            </div>

          </motion.form>
        )}
      </AnimatePresence>

    </div>
  );
};
