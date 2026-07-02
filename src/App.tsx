import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Activity,
  Heart,
  FileText,
  FileUp,
  TrendingUp,
  Users,
  Clock,
  Stethoscope,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Info,
  Shield,
  Sliders,
  Download,
  Search,
  AlertTriangle,
  UserCheck,
  DollarSign,
  ClipboardCheck,
  Building,
  ChevronRight,
  BookOpen,
  X,
  FileSpreadsheet
} from 'lucide-react';

// SVG Chest X-Ray Generator React Components
// Renders clinical vector radiographs for our presets to ensure a high-fidelity experience without needing static assets.
const XRayVectorNormal: React.FC = () => (
  <svg viewBox="0 0 400 400" className="w-full h-full bg-slate-950" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="lungBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#0d1e2e" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#020617" />
      </radialGradient>
      <linearGradient id="spineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#475569" stopOpacity="0.1" />
        <stop offset="50%" stopColor="#e2e8f0" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#475569" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    
    {/* Lung Background fields (hyperlucent air-filled space) */}
    <ellipse cx="130" cy="200" rx="65" ry="140" fill="url(#lungBg)" />
    <ellipse cx="270" cy="200" rx="65" ry="140" fill="url(#lungBg)" />
    
    {/* Spine (Vertebral Column) */}
    <rect x="194" y="20" width="12" height="360" fill="url(#spineGrad)" rx="3" />
    {/* Transverse processes of vertebrae */}
    {Array.from({ length: 18 }).map((_, i) => (
      <line key={i} x1="190" y1={40 + i * 20} x2="210" y2={40 + i * 20} stroke="#94a3b8" strokeWidth="2" strokeOpacity="0.3" />
    ))}
    
    {/* Rib Cage */}
    {Array.from({ length: 9 }).map((_, i) => {
      const y = 80 + i * 30;
      return (
        <g key={i} stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.25" fill="none">
          {/* Left Ribs arching outwards and downwards */}
          <path d={`M 194 ${y} Q ${100 - i * 3} ${y + 15} 120 ${y + 40}`} />
          {/* Right Ribs */}
          <path d={`M 206 ${y} Q ${300 + i * 3} ${y + 15} 280 ${y + 40}`} />
        </g>
      );
    })}

    {/* Clavicles (Collar bones) */}
    <path d="M 194 50 Q 120 45 70 65" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.4" fill="none" />
    <path d="M 206 50 Q 280 45 330 65" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.4" fill="none" />

    {/* Mediastinum and Heart Silhouette (Normal Cardiothoracic ratio < 0.5) */}
    <path d="M 194 80 Q 170 120 180 180 Q 170 230 150 250 Q 194 270 210 250 Q 225 210 206 180 Z" 
          fill="#cbd5e1" fillOpacity="0.55" filter="blur(2px)" />

    {/* Hilar Vascular Lines (Root of lungs) */}
    <g stroke="#ffffff" strokeWidth="2" strokeOpacity="0.25" fill="none" filter="blur(1px)">
      <path d="M 180 160 Q 150 150 140 130" />
      <path d="M 180 170 Q 145 180 130 190" />
      <path d="M 220 160 Q 250 150 260 130" />
      <path d="M 220 170 Q 255 180 270 190" />
    </g>

    {/* Diaphragm (Dome-shaped bases) */}
    <path d="M 50 360 Q 130 310 194 325" fill="#cbd5e1" fillOpacity="0.5" stroke="#e2e8f0" strokeWidth="3" strokeOpacity="0.6" />
    <path d="M 206 325 Q 270 310 350 360" fill="#cbd5e1" fillOpacity="0.5" stroke="#e2e8f0" strokeWidth="3" strokeOpacity="0.6" />

    {/* Anatomical Labels */}
    <text x="30" y="40" fill="#94a3b8" fontSize="12" fontWeight="bold" opacity="0.6">R</text>
    <text x="370" y="40" fill="#94a3b8" fontSize="12" fontWeight="bold" opacity="0.6">L</text>
  </svg>
);

const XRayVectorPneumonia: React.FC = () => (
  <svg viewBox="0 0 400 400" className="w-full h-full bg-slate-950" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="lungBgP" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#0d1e2e" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#020617" />
      </radialGradient>
      <linearGradient id="spineGradP" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#475569" stopOpacity="0.1" />
        <stop offset="50%" stopColor="#e2e8f0" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#475569" stopOpacity="0.1" />
      </linearGradient>
      {/* Opacity map representing consolidation cloud */}
      <radialGradient id="consolidationGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
        <stop offset="50%" stopColor="#e2e8f0" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
    </defs>
    
    {/* Lung Background fields */}
    <ellipse cx="130" cy="200" rx="65" ry="140" fill="url(#lungBgP)" />
    <ellipse cx="270" cy="200" rx="65" ry="140" fill="url(#lungBgP)" />

    {/* Pathological Alveolar Consolidation cloud in Right Lower lung zone (visually left side of the film) */}
    <ellipse cx="140" cy="255" rx="42" ry="35" fill="url(#consolidationGrad)" filter="blur(4px)" />
    <ellipse cx="115" cy="270" rx="28" ry="25" fill="url(#consolidationGrad)" filter="blur(3px)" />
    
    {/* Spine */}
    <rect x="194" y="20" width="12" height="360" fill="url(#spineGradP)" rx="3" />
    {Array.from({ length: 18 }).map((_, i) => (
      <line key={i} x1="190" y1={40 + i * 20} x2="210" y2={40 + i * 20} stroke="#94a3b8" strokeWidth="2" strokeOpacity="0.3" />
    ))}
    
    {/* Rib Cage */}
    {Array.from({ length: 9 }).map((_, i) => {
      const y = 80 + i * 30;
      return (
        <g key={i} stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.25" fill="none">
          <path d={`M 194 ${y} Q ${100 - i * 3} ${y + 15} 120 ${y + 40}`} />
          <path d={`M 206 ${y} Q ${300 + i * 3} ${y + 15} 280 ${y + 40}`} />
        </g>
      );
    })}

    {/* Clavicles */}
    <path d="M 194 50 Q 120 45 70 65" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.4" fill="none" />
    <path d="M 206 50 Q 280 45 330 65" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.4" fill="none" />

    {/* Mediastinum and Heart Silhouette */}
    <path d="M 194 80 Q 170 120 180 180 Q 170 230 152 250 Q 194 270 210 250 Q 225 210 206 180 Z" 
          fill="#cbd5e1" fillOpacity="0.55" filter="blur(2px)" />

    {/* Reactive costophrenic blunting cloud right base */}
    <ellipse cx="85" cy="315" rx="20" ry="18" fill="url(#consolidationGrad)" filter="blur(2px)" />

    {/* Hilar Vascular Lines (augmented on right side due to infiltration) */}
    <g stroke="#ffffff" strokeWidth="2" strokeOpacity="0.3" fill="none" filter="blur(1px)">
      <path d="M 180 160 Q 150 150 135 130" strokeWidth="3" />
      <path d="M 180 170 Q 140 180 125 195" strokeWidth="3.5" />
      <path d="M 220 160 Q 250 150 260 130" />
      <path d="M 220 170 Q 255 180 270 190" />
    </g>

    {/* Diaphragm (Blunted right dome, normal left dome) */}
    <path d="M 50 360 Q 120 318 194 325" fill="#cbd5e1" fillOpacity="0.5" stroke="#e2e8f0" strokeWidth="3" strokeOpacity="0.4" />
    <path d="M 206 325 Q 270 310 350 360" fill="#cbd5e1" fillOpacity="0.5" stroke="#e2e8f0" strokeWidth="3" strokeOpacity="0.6" />

    {/* Anatomical Labels */}
    <text x="30" y="40" fill="#94a3b8" fontSize="12" fontWeight="bold" opacity="0.6">R</text>
    <text x="370" y="40" fill="#94a3b8" fontSize="12" fontWeight="bold" opacity="0.6">L</text>
  </svg>
);

const XRayVectorCardiomegaly: React.FC = () => (
  <svg viewBox="0 0 400 400" className="w-full h-full bg-slate-950" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="lungBgC" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#0d1e2e" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#020617" />
      </radialGradient>
      <linearGradient id="spineGradC" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#475569" stopOpacity="0.1" />
        <stop offset="50%" stopColor="#e2e8f0" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#475569" stopOpacity="0.1" />
      </linearGradient>
      {/* Venous congestion opacity in perihilar region */}
      <radialGradient id="congestionGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
        <stop offset="60%" stopColor="#e2e8f0" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
    </defs>
    
    {/* Lung Background fields (partially compressed by massive heart) */}
    <ellipse cx="125" cy="200" rx="60" ry="140" fill="url(#lungBgC)" />
    <ellipse cx="275" cy="200" rx="55" ry="140" fill="url(#lungBgC)" />

    {/* Bilateral Pulmonic Venous Congestion around hilum */}
    <circle cx="150" cy="180" r="45" fill="url(#congestionGrad)" filter="blur(5px)" />
    <circle cx="250" cy="180" r="45" fill="url(#congestionGrad)" filter="blur(5px)" />
    
    {/* Spine */}
    <rect x="194" y="20" width="12" height="360" fill="url(#spineGradC)" rx="3" />
    {Array.from({ length: 18 }).map((_, i) => (
      <line key={i} x1="190" y1={40 + i * 20} x2="210" y2={40 + i * 20} stroke="#94a3b8" strokeWidth="2" strokeOpacity="0.3" />
    ))}
    
    {/* Rib Cage */}
    {Array.from({ length: 9 }).map((_, i) => {
      const y = 80 + i * 30;
      return (
        <g key={i} stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.25" fill="none">
          <path d={`M 194 ${y} Q ${100 - i * 3} ${y + 15} 120 ${y + 40}`} />
          <path d={`M 206 ${y} Q ${300 + i * 3} ${y + 15} 280 ${y + 40}`} />
        </g>
      );
    })}

    {/* Clavicles */}
    <path d="M 194 50 Q 120 45 70 65" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.4" fill="none" />
    <path d="M 206 50 Q 280 45 330 65" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.4" fill="none" />

    {/* MASSIVE Mediastinum and Heart Silhouette (Cardiomegaly, ratio > 0.6) */}
    {/* Dilated left ventricle extending nearly to left chest wall */}
    <path d="M 194 80 Q 165 110 180 180 Q 155 230 112 255 Q 194 285 242 250 Q 252 210 206 180 Z" 
          fill="#e2e8f0" fillOpacity="0.65" filter="blur(3px)" />

    {/* Pleural effusion (bilateral basilar density / blunting) */}
    <path d="M 50 355 Q 115 325 194 330" fill="#cbd5e1" fillOpacity="0.45" filter="blur(2px)" />
    <path d="M 194 330 Q 260 322 350 355" fill="#cbd5e1" fillOpacity="0.45" filter="blur(2px)" />

    {/* Cephalization of vasculature vessels rising upwards */}
    <g stroke="#ffffff" strokeWidth="2.5" strokeOpacity="0.3" fill="none" filter="blur(1px)">
      <path d="M 165 145 Q 140 100 135 75" />
      <path d="M 235 145 Q 260 100 265 75" />
    </g>

    {/* Diaphragm (Slightly flattened and depressed due to effusions) */}
    <path d="M 50 360 Q 125 330 194 335" fill="#cbd5e1" fillOpacity="0.4" stroke="#e2e8f0" strokeWidth="3" strokeOpacity="0.5" />
    <path d="M 206 335 Q 275 330 350 360" fill="#cbd5e1" fillOpacity="0.4" stroke="#e2e8f0" strokeWidth="3" strokeOpacity="0.5" />

    {/* Anatomical Labels */}
    <text x="30" y="40" fill="#94a3b8" fontSize="12" fontWeight="bold" opacity="0.6">R</text>
    <text x="370" y="40" fill="#94a3b8" fontSize="12" fontWeight="bold" opacity="0.6">L</text>
  </svg>
);

export default function App() {
  // App Navigation States
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'administration' | 'analytics'>('diagnostics');

  // Diagnostics Presets & Custom Upload States
  const [selectedPreset, setSelectedPreset] = useState<string>('pneumonia');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStepMessage, setScanStepMessage] = useState<string>('');
  
  // Model Config
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.5-flash');

  // Diagnosis Result State
  const [diagnosticData, setDiagnosticData] = useState<any>(null);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [hoveredDisease, setHoveredDisease] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Administrative Patient Form States
  const [adminPatient, setAdminPatient] = useState({
    name: 'Sarah Jenkins',
    age: '45',
    gender: 'Female',
    complaints: 'Moderate shortness of breath, mild non-productive dry cough for 3 days, slight chest tightness on minimal exertion.',
    pulse: '84',
    temp: '99.1',
    rr: '19',
    spo2: '95',
  });
  const [triageResult, setTriageResult] = useState<any>(null);
  const [isTriaging, setIsTriaging] = useState<boolean>(false);
  
  // Simulated Active Clinical Queue State
  const [queueList, setQueueList] = useState([
    { id: '1', name: 'James Carter', age: 62, priority: 'STAT / Level 2 (Emergent)', timeArrived: '08:14', complaint: 'Acute pleuritic chest pain, dyspnea', status: 'In Radiography' },
    { id: '2', name: 'Sarah Jenkins', age: 45, priority: 'Urgent / Level 3', timeArrived: '08:35', complaint: 'Shortness of breath, non-productive cough', status: 'Awaiting AI Triage' },
    { id: '3', name: 'Emily Thorne', age: 29, priority: 'Routine / Level 4', timeArrived: '08:42', complaint: 'Musculoskeletal chest wall discomfort', status: 'Awaiting Consultation' },
    { id: '4', name: 'Michael Vance', age: 71, priority: 'STAT / Level 2 (Emergent)', timeArrived: '08:02', complaint: 'Severe congestion, high fever, cyanotic lips', status: 'In ICU Transition' },
  ]);

  // Grad-CAM Heatmap overlay ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Handle uploading custom X-Ray
  const handleXRayUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setSelectedPreset('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  // Run AI Clinical Diagnostics
  const triggerDiagnostics = async (presetOverride?: string) => {
    setIsScanning(true);
    setDiagnosticData(null);
    const presetToRun = presetOverride || selectedPreset;

    const steps = [
      'Establishing connection to clinical deep-learning model...',
      'Normalizing digital radiograph to 1024x1024 voxel resolution...',
      'Running convolutional neural network (CNN) feature-extraction passes...',
      'Identifying high-frequency diagnostic biomarkers...',
      'Mapping spatial saliency via Grad-CAM backpropagation coordinates...',
      'Formatting diagnostic record & electronic health documentation...'
    ];

    // Simulate stepping through CNN phases visually
    for (let i = 0; i < steps.length; i++) {
      setScanStepMessage(steps[i]);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    try {
      const response = await fetch('/api/analyze-xray', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          presetType: presetToRun,
          image: presetToRun === 'upload' ? uploadedImage : null,
          modelName: selectedModel,
        }),
      });

      const resData = await response.json();
      if (resData.success) {
        setDiagnosticData(resData);
      } else {
        throw new Error(resData.error);
      }
    } catch (err: any) {
      console.error('Diagnostic error:', err);
      // Fail-safes and fallbacks are handled server-side, but if server breaks completely, show a localized message
      alert('Clinical Diagnostic Endpoint could not complete the operation. Please verify server state.');
    } finally {
      setIsScanning(false);
    }
  };

  // Run Smart Administrative Triaging
  const triggerTriage = async () => {
    setIsTriaging(true);
    setTriageResult(null);

    await new Promise((resolve) => setTimeout(resolve, 1200)); // standard spinner visual

    try {
      const response = await fetch('/api/admin/triage-patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: adminPatient.name,
          age: parseInt(adminPatient.age),
          gender: adminPatient.gender,
          complaints: adminPatient.complaints,
          vitals: {
            pulse: parseInt(adminPatient.pulse),
            temp: parseFloat(adminPatient.temp),
            rr: parseInt(adminPatient.rr),
            spo2: parseInt(adminPatient.spo2),
          }
        }),
      });

      const resData = await response.json();
      if (resData.success) {
        setTriageResult(resData.data);
        // Update local queue list dynamically
        setQueueList(prev => prev.map(p => {
          if (p.name === adminPatient.name) {
            return {
              ...p,
              priority: resData.data.priority,
              status: 'Triage Completed'
            };
          }
          return p;
        }));
      }
    } catch (err) {
      console.error('Triage error:', err);
    } finally {
      setIsTriaging(false);
    }
  };

  // Auto-run pneumonia preset on load
  useEffect(() => {
    triggerDiagnostics('pneumonia');
  }, []);

  // Redraw Grad-CAM Heatmap dynamically on image over canvas
  useEffect(() => {
    if (!diagnosticData || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear previous
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const points = diagnosticData.data.heatmapPoints || [];
    points.forEach((pt: any) => {
      // If a specific disease is hovered, ONLY render that disease's heatmap highlight
      if (hoveredDisease && pt.diseaseName.toLowerCase() !== hoveredDisease.toLowerCase()) {
        return;
      }

      // Translate 0-100 relative coordinates to actual canvas resolution
      const cx = (pt.x / 100) * canvas.width;
      const cy = (pt.y / 100) * canvas.height;
      const radius = (pt.radius / 100) * Math.min(canvas.width, canvas.height);

      // Draw beautiful radial glowing gradient representing neural attention map (Grad-CAM)
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      
      // Select visual clinical warning colors based on disease intensity
      const opacity = pt.intensity || 0.8;
      grad.addColorStop(0, `rgba(239, 68, 68, ${opacity})`);       // Bright red center
      grad.addColorStop(0.35, `rgba(245, 158, 11, ${opacity * 0.7})`); // Orange middle ring
      grad.addColorStop(0.7, `rgba(251, 191, 36, ${opacity * 0.35})`); // Yellow outer glow
      grad.addColorStop(1, 'rgba(251, 191, 36, 0)');                // Disperse

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
      ctx.fill();
    });
  }, [diagnosticData, showHeatmap, hoveredDisease]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Memoized lists of diseases for UI ranking
  const rankedDiseases = useMemo(() => {
    if (!diagnosticData) return [];
    return [...diagnosticData.data.diseases].sort((a: any, b: any) => b.confidence - a.confidence);
  }, [diagnosticData]);

  // Analytical stats for visual charts (Custom React SVGs)
  const statsOverview = {
    dailyTotal: 148,
    scansAI: 94,
    avgWaitTime: 14.8,
    triageLevelCount: { STAT: 18, Urgent: 44, Routine: 86 }
  };

  return (
    <div id="app-root" className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-slate-900">
      
      {/* Clinically Designed Header */}
      <header id="clinical-header" className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl shadow-lg shadow-teal-500/20 flex items-center justify-center animate-pulse">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              ClinixAI™ Hub
            </h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide">INTEGRATED HEALTH TECH & X-RAY DIAGNOSTICS</p>
          </div>
        </div>

        {/* Global Navigation Tabs */}
        <nav id="global-tabs" className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            id="tab-btn-diagnostics"
            onClick={() => setActiveTab('diagnostics')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all ${
              activeTab === 'diagnostics'
                ? 'bg-slate-800 text-teal-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Stethoscope className="h-4 w-4" />
            <span>X-Ray CAD Engine</span>
          </button>
          <button
            id="tab-btn-administration"
            onClick={() => setActiveTab('administration')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all ${
              activeTab === 'administration'
                ? 'bg-slate-800 text-teal-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ClipboardCheck className="h-4 w-4" />
            <span>Operational Triage</span>
          </button>
          <button
            id="tab-btn-analytics"
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all ${
              activeTab === 'analytics'
                ? 'bg-slate-800 text-teal-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Metrics & Analytics</span>
          </button>
        </nav>

        {/* Integration Credentials Status Info */}
        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-400">System Pipeline</span>
            <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1 justify-end">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping inline-block mr-1"></span>
              CNN v4.12 Live
            </span>
          </div>
          <div className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-medium text-slate-300 border border-slate-700">
            {diagnosticData?.isSimulated ? (
              <span className="text-amber-400 flex items-center space-x-1">
                <Info className="h-3 w-3 inline" /> <span>Simulation Active</span>
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center space-x-1">
                <Sparkles className="h-3 w-3 inline" /> <span>Gemini AI Connected</span>
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main id="workspace-frame" className="flex-1 p-6 max-w-[1600px] w-full mx-auto grid grid-cols-1 gap-6">

        {/* TAB 1: DIAGNOSTICS & MULTI-DISEASE RAD CAD */}
        {activeTab === 'diagnostics' && (
          <div id="diagnostics-view" className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* Left Control & Case Selector Column (4 Cols) */}
            <div id="diagnostics-controls" className="xl:col-span-4 flex flex-col space-y-6">
              
              {/* Presets & Custom Upload Controller */}
              <div id="case-selector-card" className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Sliders className="h-4 w-4 text-teal-400" />
                    <h2 className="text-md font-bold text-slate-200 tracking-wide">Patient Case Selector</h2>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 bg-slate-900 px-2 py-1 rounded">CAD INPUT</span>
                </div>
                
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Select a clinical chest radiograph preset trained on massive datasets, or upload an anonymous medical image for real-time biomarker analysis.
                </p>

                {/* Patient Presets Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <button
                    id="preset-btn-pneumonia"
                    onClick={() => {
                      setSelectedPreset('pneumonia');
                      setUploadedImage(null);
                      triggerDiagnostics('pneumonia');
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      selectedPreset === 'pneumonia'
                        ? 'bg-teal-950/40 border-teal-500/80 text-teal-400'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <AlertTriangle className="h-5 w-5 mb-1.5" />
                    <span className="text-xs font-bold block">Pneumonia</span>
                    <span className="text-[9px] opacity-70 block mt-0.5">54M • Lobar</span>
                  </button>

                  <button
                    id="preset-btn-cardiomegaly"
                    onClick={() => {
                      setSelectedPreset('cardiomegaly');
                      setUploadedImage(null);
                      triggerDiagnostics('cardiomegaly');
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      selectedPreset === 'cardiomegaly'
                        ? 'bg-teal-950/40 border-teal-500/80 text-teal-400'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <Heart className="h-5 w-5 mb-1.5" />
                    <span className="text-xs font-bold block">Cardiomegaly</span>
                    <span className="text-[9px] opacity-70 block mt-0.5">67F • HF Volume</span>
                  </button>

                  <button
                    id="preset-btn-normal"
                    onClick={() => {
                      setSelectedPreset('normal');
                      setUploadedImage(null);
                      triggerDiagnostics('normal');
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      selectedPreset === 'normal'
                        ? 'bg-teal-950/40 border-teal-500/80 text-teal-400'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <UserCheck className="h-5 w-5 mb-1.5" />
                    <span className="text-xs font-bold block">Healthy</span>
                    <span className="text-[9px] opacity-70 block mt-0.5">32M • Clear</span>
                  </button>
                </div>

                {/* Drag-and-Drop / Browse File Upload */}
                <div className="border border-dashed border-slate-800 hover:border-teal-500/50 rounded-xl p-4 bg-slate-900/30 transition-all flex flex-col items-center justify-center relative cursor-pointer group mb-4">
                  <input
                    id="xray-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleXRayUpload}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                  <div className="text-center">
                    <FileUp className="h-7 w-7 text-slate-500 group-hover:text-teal-400 transition-colors mx-auto mb-2" />
                    <span className="text-xs font-bold text-slate-300 block">
                      {selectedPreset === 'upload' && uploadedImage ? '✓ Custom X-Ray Loaded' : 'Upload External Radiograph'}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1">PNG, JPG, DICOM supported</span>
                  </div>
                </div>

                {selectedPreset === 'upload' && (
                  <button
                    id="btn-run-custom-ai"
                    onClick={() => triggerDiagnostics('upload')}
                    disabled={isScanning || !uploadedImage}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-teal-500/10 flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>RUN AI RADIOGRAPH CAD</span>
                  </button>
                )}

                {/* Model Selector Parameters */}
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Convolutional Kernel Backend</label>
                  <select
                    id="select-model-backend"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-teal-500/50"
                  >
                    <option value="gemini-3.5-flash">Gemini 3.5 Flash (Default Medical LLM)</option>
                    <option value="clinix-dense-121">Clinix-DenseNet-121 (Dense Interconnected Kernel)</option>
                    <option value="resnet-50">ResNet-50 (Deep Residual Identity Backbone)</option>
                  </select>
                </div>
              </div>

              {/* CNN Disease Biomarker Legend / Multi-label classification scale */}
              {diagnosticData && (
                <div id="disease-classification-card" className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Sliders className="h-4 w-4 text-teal-400" />
                      <h2 className="text-md font-bold text-slate-200 tracking-wide">Multi-Disease CAD Output</h2>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">PROBABILITY</span>
                  </div>

                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Confidence estimations generated through supervised deep network classification on multi-label clinical datasets. Hover over a classification to isolate its localized pathology.
                  </p>

                  <div className="space-y-3">
                    {rankedDiseases.map((d: any, i: number) => {
                      const percentage = d.confidence;
                      const isNormal = d.name.toLowerCase().includes('normal');
                      const colorClass = isNormal 
                        ? 'from-emerald-500 to-teal-500' 
                        : percentage > 70 
                        ? 'from-red-600 to-amber-500' 
                        : percentage > 40 
                        ? 'from-amber-500 to-yellow-400' 
                        : 'from-slate-600 to-slate-400';

                      return (
                        <div
                          key={i}
                          onMouseEnter={() => setHoveredDisease(d.name)}
                          onMouseLeave={() => setHoveredDisease(null)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                            hoveredDisease === d.name 
                              ? 'bg-slate-800/80 border-teal-500' 
                              : 'bg-slate-900/40 border-slate-800/50 hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-extrabold text-slate-200">{d.name}</span>
                            <span className={`text-xs font-mono font-bold ${percentage > 70 ? 'text-red-400' : 'text-slate-400'}`}>
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                          {/* Linear progress bar */}
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${colorClass}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Middle X-Ray Viewer Panel (5 Cols) */}
            <div id="xray-viewer-panel" className="xl:col-span-5 flex flex-col space-y-6">
              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col h-full relative">
                
                {/* Header controls for viewer */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-teal-400" />
                    <h3 className="text-md font-bold text-slate-200 tracking-wide">Interactive Film Radiograph Viewer</h3>
                  </div>
                  
                  {/* Heatmap Toggle controls */}
                  <button
                    id="btn-toggle-heatmap"
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center space-x-1.5 ${
                      showHeatmap
                        ? 'bg-amber-950/30 border-amber-500/50 text-amber-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>{showHeatmap ? 'Grad-CAM ON' : 'Grad-CAM OFF'}</span>
                  </button>
                </div>

                {/* Immersive Film Stage */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center group shadow-inner">
                  
                  {/* Dynamic Visual Scanning overlay when model works */}
                  {isScanning && (
                    <div className="absolute inset-0 bg-slate-950/90 z-20 flex flex-col items-center justify-center p-6 text-center">
                      <div className="relative mb-6">
                        <div className="h-16 w-16 rounded-full border-4 border-slate-800 border-t-teal-400 animate-spin"></div>
                        <Activity className="h-6 w-6 text-teal-400 absolute inset-0 m-auto animate-pulse" />
                      </div>
                      <span className="text-sm font-bold text-slate-200 uppercase tracking-widest animate-pulse">Analyzing Radiograph</span>
                      <p className="text-xs text-slate-400 mt-2 max-w-sm font-medium transition-all">{scanStepMessage}</p>
                      
                      <div className="w-48 bg-slate-800 h-1 rounded-full overflow-hidden mt-4">
                        <div className="bg-teal-500 h-full animate-infinite-loading"></div>
                      </div>
                    </div>
                  )}

                  {/* Radiograph Visual Renders (Custom vector elements to prevent broken links) */}
                  {selectedPreset === 'upload' && uploadedImage ? (
                    <img
                      src={uploadedImage}
                      alt="Uploaded Chest Radiograph"
                      className="w-full h-full object-contain"
                    />
                  ) : selectedPreset === 'pneumonia' ? (
                    <XRayVectorPneumonia />
                  ) : selectedPreset === 'cardiomegaly' ? (
                    <XRayVectorCardiomegaly />
                  ) : (
                    <XRayVectorNormal />
                  )}

                  {/* Grad-CAM Heatmap overlay canvas */}
                  {showHeatmap && !isScanning && (
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={400}
                      className="absolute inset-0 w-full h-full pointer-events-none mix-blend-color-dodge z-10"
                    />
                  )}

                  {/* Hover Isolation tooltip indicator */}
                  {hoveredDisease && (
                    <div className="absolute top-4 left-4 bg-slate-900/90 border border-amber-500/40 text-amber-400 px-3 py-1 rounded-md text-xs font-bold z-10 flex items-center space-x-1.5 shadow-lg">
                      <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping inline-block"></span>
                      <span>Isolating Visual Biomarkers: {hoveredDisease}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 bg-slate-900/50 border border-slate-800/60 p-3 rounded-xl flex items-start space-x-3">
                  <Info className="h-5 w-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    <strong className="text-slate-300">Operational Notice:</strong> CNN diagnostic estimations must be validated by a board-certified radiologist. Coordinates plotted above simulate Grad-CAM backpropagation targeting spatial densities representing inflammatory or cardiac lesions.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Diagnostic Reports Column (3 Cols) */}
            <div id="diagnostics-reports" className="xl:col-span-3 flex flex-col space-y-6">
              
              {/* Identified Biomarkers list */}
              {diagnosticData && (
                <div id="biomarkers-card" className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center space-x-2 mb-4">
                    <BookOpen className="h-4 w-4 text-teal-400" />
                    <h3 className="text-md font-bold text-slate-200 tracking-wide">AI-Identified Biomarkers</h3>
                  </div>

                  {diagnosticData.data.biomarkers && diagnosticData.data.biomarkers.length > 0 ? (
                    <div className="space-y-3">
                      {diagnosticData.data.biomarkers.map((b: any, i: number) => (
                        <div key={i} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-extrabold text-teal-400">{b.name}</span>
                            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded">
                              {b.location}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">{b.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 border border-dashed border-slate-800 rounded-xl text-center">
                      <p className="text-xs text-slate-500">No abnormal radiological biomarkers flagged by AI.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Administrative Billing & Coding checklist */}
              {diagnosticData && (
                <div id="billing-coding-card" className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center space-x-2 mb-4">
                    <DollarSign className="h-4 w-4 text-teal-400" />
                    <h3 className="text-md font-bold text-slate-200 tracking-wide">Operational Coder Suggestions</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2.5 bg-slate-900/50 rounded-xl border border-slate-800">
                      <span className="text-[11px] font-semibold text-slate-400">Primary ICD-10 Code</span>
                      <span className="text-xs font-mono font-bold text-slate-200 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                        {diagnosticData.data.billingAndCoding?.icd10Code || 'Z00.00'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-2.5 bg-slate-900/50 rounded-xl border border-slate-800">
                      <span className="text-[11px] font-semibold text-slate-400">Radiological CPT Code</span>
                      <span className="text-xs font-mono font-bold text-slate-200 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                        {diagnosticData.data.billingAndCoding?.cptCode || '71045'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-2.5 bg-slate-900/50 rounded-xl border border-slate-800">
                      <span className="text-[11px] font-semibold text-slate-400">Diagnostic Category</span>
                      <span className="text-xs font-bold text-slate-200 text-right">
                        {diagnosticData.data.billingAndCoding?.diagnosticCategory || 'Routine Pulmonary'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom S.O.A.P note & referral section (Full width, spans 12 Cols) */}
            {diagnosticData && (
              <div id="soap-report-section" className="col-span-12 bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-teal-400" />
                    <div>
                      <h3 className="text-lg font-bold text-slate-200">Autonomous Clinical Report Draft</h3>
                      <p className="text-xs text-slate-400 font-medium">Auto-generated EHR S.O.A.P documentation based on radiograph CAD findings.</p>
                    </div>
                  </div>
                  
                  {/* Diagnostic details */}
                  <span className="text-xs font-mono text-slate-500">
                    Engine: {diagnosticData.modelUsed || 'ClinixAI v4'}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* SOAP Note Panel */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-extrabold text-slate-300 uppercase tracking-widest flex items-center space-x-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-400 inline-block"></span>
                        <span>Structured S.O.A.P Report</span>
                      </h4>
                      <button
                        id="btn-copy-soap"
                        onClick={() => copyToClipboard(
                          `SUBJECTIVE:\n${diagnosticData.data.clinicalReport?.soapNotes?.subjective}\n\nOBJECTIVE:\n${diagnosticData.data.clinicalReport?.soapNotes?.objective}\n\nASSESSMENT:\n${diagnosticData.data.clinicalReport?.soapNotes?.assessment}\n\nPLAN:\n${diagnosticData.data.clinicalReport?.soapNotes?.plan}`,
                          'soap'
                        )}
                        className="text-xs text-slate-400 hover:text-teal-400 flex items-center space-x-1.5 transition-colors bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg"
                      >
                        {copiedSection === 'soap' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedSection === 'soap' ? 'Copied' : 'Copy SOAP Draft'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-xl">
                        <span className="text-[10px] font-extrabold text-teal-400 tracking-wider uppercase block mb-1">Subjective (S)</span>
                        <p className="text-[11px] text-slate-300 leading-relaxed min-h-[90px]">
                          {diagnosticData.data.clinicalReport?.soapNotes?.subjective}
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-xl">
                        <span className="text-[10px] font-extrabold text-teal-400 tracking-wider uppercase block mb-1">Objective (O)</span>
                        <p className="text-[11px] text-slate-300 leading-relaxed min-h-[90px]">
                          {diagnosticData.data.clinicalReport?.soapNotes?.objective}
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-xl">
                        <span className="text-[10px] font-extrabold text-teal-400 tracking-wider uppercase block mb-1">Assessment (A)</span>
                        <p className="text-[11px] text-slate-300 leading-relaxed min-h-[90px]">
                          {diagnosticData.data.clinicalReport?.soapNotes?.assessment}
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-xl">
                        <span className="text-[10px] font-extrabold text-teal-400 tracking-wider uppercase block mb-1">Plan (P)</span>
                        <p className="text-[11px] text-slate-300 leading-relaxed min-h-[90px]">
                          {diagnosticData.data.clinicalReport?.soapNotes?.plan}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Referral Specialist Draft Panel */}
                  <div className="flex flex-col h-full justify-between">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-extrabold text-slate-300 uppercase tracking-widest flex items-center space-x-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-400 inline-block"></span>
                        <span>Pulmonary/Cardiac Specialist Referral Draft</span>
                      </h4>
                      <button
                        id="btn-copy-referral"
                        onClick={() => copyToClipboard(
                          diagnosticData.data.clinicalReport?.referralDraft || '',
                          'referral'
                        )}
                        className="text-xs text-slate-400 hover:text-teal-400 flex items-center space-x-1.5 transition-colors bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg"
                      >
                        {copiedSection === 'referral' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedSection === 'referral' ? 'Copied' : 'Copy Referral Letter'}</span>
                      </button>
                    </div>

                    <div className="p-4 bg-slate-900/40 border border-slate-800/60 rounded-xl flex-1 flex flex-col justify-between font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre-line">
                      <div>
                        {diagnosticData.data.clinicalReport?.referralDraft || 'Generating referral letter draft...'}
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-800 text-[10px] text-slate-500 italic">
                        Notice: This is a generated template based on radiographical CAD observations. Validate before routing.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}


        {/* TAB 2: OPERATIONAL ADMINISTRATION / TRIAGE CENTER */}
        {activeTab === 'administration' && (
          <div id="administration-view" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Intake & Triage Input (5 Cols) */}
            <div id="admin-intake-form" className="lg:col-span-5 flex flex-col space-y-6">
              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-5 w-5 text-teal-400" />
                    <h2 className="text-md font-bold text-slate-200 tracking-wide">Patient Intake & Vitals Panel</h2>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 bg-slate-900 px-2 py-1 rounded">ADMIN TRIAGE</span>
                </div>

                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Enter Patient chief complaints and physiological vitals. ClinixAI™ will triage operational priority, recommended clinical routes, and queue bypassing rules.
                </p>

                {/* Form fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Full Name</label>
                      <input
                        id="patient-input-name"
                        type="text"
                        value={adminPatient.name}
                        onChange={(e) => setAdminPatient({ ...adminPatient, name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Gender</label>
                      <select
                        id="patient-input-gender"
                        value={adminPatient.gender}
                        onChange={(e) => setAdminPatient({ ...adminPatient, gender: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500/50"
                      >
                        <option>Female</option>
                        <option>Male</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Age</label>
                      <input
                        id="patient-input-age"
                        type="number"
                        value={adminPatient.age}
                        onChange={(e) => setAdminPatient({ ...adminPatient, age: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Pulse Rate (bpm)</label>
                      <input
                        id="patient-input-pulse"
                        type="number"
                        value={adminPatient.pulse}
                        onChange={(e) => setAdminPatient({ ...adminPatient, pulse: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Temperature (°F)</label>
                      <input
                        id="patient-input-temp"
                        type="number"
                        step="0.1"
                        value={adminPatient.temp}
                        onChange={(e) => setAdminPatient({ ...adminPatient, temp: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Respiration (bpm)</label>
                      <input
                        id="patient-input-rr"
                        type="number"
                        value={adminPatient.rr}
                        onChange={(e) => setAdminPatient({ ...adminPatient, rr: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">SpO2 Oxygen (%)</label>
                      <input
                        id="patient-input-spo2"
                        type="number"
                        value={adminPatient.spo2}
                        onChange={(e) => setAdminPatient({ ...adminPatient, spo2: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Chief Complaints / Symptom Narrative</label>
                    <textarea
                      id="patient-input-complaints"
                      value={adminPatient.complaints}
                      onChange={(e) => setAdminPatient({ ...adminPatient, complaints: e.target.value })}
                      rows={3}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500/50 resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    id="btn-trigger-triage"
                    onClick={triggerTriage}
                    disabled={isTriaging}
                    className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 disabled:from-slate-800 disabled:to-slate-800 text-white font-extrabold rounded-xl text-xs tracking-wider transition-all shadow-md shadow-teal-500/15 flex items-center justify-center space-x-2"
                  >
                    {isTriaging ? (
                      <>
                        <div className="h-4 w-4 border-2 border-slate-400 border-t-white rounded-full animate-spin"></div>
                        <span>GENERATING TRIAGE PATH...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>RUN CLINICAL ADMIN TRIAGE</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Triage Results & Real-time Queue Status (7 Cols) */}
            <div id="admin-triage-results" className="lg:col-span-7 flex flex-col space-y-6">
              
              {/* Output Priority Assessment */}
              {triageResult ? (
                <div id="triage-assessment-output" className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                  
                  {/* Neon side border indicator based on triage priority */}
                  <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                    triageResult.priority.toLowerCase().includes('stat') 
                      ? 'bg-red-500' 
                      : triageResult.priority.toLowerCase().includes('urgent') 
                      ? 'bg-amber-500' 
                      : 'bg-emerald-500'
                  }`} />

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <ClipboardCheck className="h-5 w-5 text-teal-400" />
                      <h3 className="text-md font-bold text-slate-200">AI Operational Assessment Output</h3>
                    </div>
                    <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                      triageResult.priority.toLowerCase().includes('stat') 
                        ? 'bg-red-950/40 text-red-400 border border-red-500/40' 
                        : triageResult.priority.toLowerCase().includes('urgent') 
                        ? 'bg-amber-950/40 text-amber-400 border border-amber-500/40' 
                        : 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/40'
                    }`}>
                      {triageResult.priority}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Triage Protocol Justification</span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {triageResult.priorityReason}
                      </p>
                    </div>

                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Target Action Wait-Time</span>
                        <div className="flex items-baseline space-x-1 mt-1">
                          <span className="text-2xl font-extrabold text-slate-100 font-mono">{triageResult.targetWaitTimeMinutes}</span>
                          <span className="text-xs text-slate-400">minutes</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-slate-800/80">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Assigned Target Department</span>
                        <span className="text-xs text-teal-400 font-extrabold">{triageResult.suggestedDepartment}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Operational Scheduling & Bypass Advice</span>
                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                        {triageResult.schedulingRecommendation}
                      </p>
                    </div>

                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Administrative & Regulatory Note</span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {triageResult.administrativeNote}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div id="triage-placeholder" className="bg-slate-950 border border-slate-800/80 border-dashed rounded-2xl p-8 shadow-xl text-center flex flex-col items-center justify-center min-h-[250px]">
                  <ClipboardCheck className="h-10 w-10 text-slate-600 mb-3" />
                  <h3 className="text-md font-bold text-slate-300 mb-1">Awaiting Administration Intake</h3>
                  <p className="text-xs text-slate-500 max-w-sm">Enter the patient vitals and chief complaint narrative on the left panel, and launch ClinixAI triage assessment parameters.</p>
                </div>
              )}

              {/* Patient Queue Management Table */}
              <div id="patient-queue-table" className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-teal-400" />
                    <h3 className="text-md font-bold text-slate-200">Active Hospital Diagnostic Queue</h3>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">{queueList.length} Patient(s) In Queue</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3">Patient</th>
                        <th className="p-3">Time Arrived</th>
                        <th className="p-3">Symptoms</th>
                        <th className="p-3">Priority Level</th>
                        <th className="p-3 text-right">Operational Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {queueList.map((p, i) => {
                        const isStat = p.priority.includes('STAT');
                        const isUrgent = p.priority.includes('Urgent');
                        const priorityColor = isStat 
                          ? 'text-red-400 bg-red-950/20 border-red-500/20' 
                          : isUrgent 
                          ? 'text-amber-400 bg-amber-950/20 border-amber-500/20' 
                          : 'text-emerald-400 bg-emerald-950/20 border-emerald-500/20';

                        return (
                          <tr key={i} className="hover:bg-slate-900/30 transition-colors">
                            <td className="p-3 font-semibold text-slate-200">
                              <div>{p.name}</div>
                              <span className="text-[10px] text-slate-500 font-normal">{p.age}y</span>
                            </td>
                            <td className="p-3 font-mono font-medium text-slate-400">{p.timeArrived}</td>
                            <td className="p-3 max-w-[150px] truncate text-slate-400" title={p.complaint}>
                              {p.complaint}
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${priorityColor}`}>
                                {p.priority.split('/')[0]}
                              </span>
                            </td>
                            <td className="p-3 text-right font-medium">
                              <span className={`text-[11px] ${p.status.includes('Completed') ? 'text-emerald-400' : 'text-teal-400'}`}>
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ANALYTICS & TRENDS VISUALIZATIONS */}
        {activeTab === 'analytics' && (
          <div id="analytics-view" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* KPI Cards top section */}
            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex items-center space-x-4">
                <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Daily Admissions</span>
                  <span className="text-xl font-black text-slate-200 font-mono">{statsOverview.dailyTotal}</span>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex items-center space-x-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AI Assisted Diagnostics</span>
                  <span className="text-xl font-black text-slate-200 font-mono">{statsOverview.scansAI} scans</span>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex items-center space-x-4">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Triage Delta</span>
                  <span className="text-xl font-black text-slate-200 font-mono">{statsOverview.avgWaitTime} mins</span>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex items-center space-x-4">
                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Resource Efficiency</span>
                  <span className="text-xl font-black text-slate-200 font-mono">+28.4%</span>
                </div>
              </div>
            </div>

            {/* Custom SVG Wait Time Trend Chart (8 Cols) */}
            <div className="lg:col-span-8 bg-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-teal-400" />
                  <h3 className="text-md font-bold text-slate-200">Average Patient Wait-Time Trend (Minutes)</h3>
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-900 px-2 py-1 rounded">PAST 7 DAYS</span>
              </div>

              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Comparative daily metric tracking the average minutes from intake registration to diagnostic film acquisition. The introduction of the neural triage pipeline represents a significant compression in operational wait times.
              </p>

              {/* Customized SVG Line & Bar Chart */}
              <div className="w-full h-64 bg-slate-900/20 border border-slate-800/50 rounded-xl relative p-4 flex flex-col justify-between">
                {/* Visual Grid Lines */}
                <div className="absolute inset-x-0 top-1/4 border-t border-slate-800/40" />
                <div className="absolute inset-x-0 top-2/4 border-t border-slate-800/40" />
                <div className="absolute inset-x-0 top-3/4 border-t border-slate-800/40" />

                <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
                  {/* Left Axis */}
                  <text x="5" y="15" fill="#64748b" fontSize="8" className="font-mono">40m</text>
                  <text x="5" y="65" fill="#64748b" fontSize="8" className="font-mono">30m</text>
                  <text x="5" y="115" fill="#64748b" fontSize="8" className="font-mono">20m</text>
                  <text x="5" y="165" fill="#64748b" fontSize="8" className="font-mono">10m</text>

                  {/* Standard non-AI Wait time bars (Historical) */}
                  <g fill="#475569" fillOpacity="0.3">
                    <rect x="50" y="30" width="16" height="150" rx="2" />
                    <rect x="130" y="45" width="16" height="135" rx="2" />
                    <rect x="210" y="55" width="16" height="125" rx="2" />
                    <rect x="290" y="70" width="16" height="110" rx="2" />
                    <rect x="370" y="85" width="16" height="95" rx="2" />
                    <rect x="450" y="100" width="16" height="80" rx="2" />
                    <rect x="530" y="115" width="16" height="65" rx="2" />
                  </g>

                  {/* AI-Integrated wait time curve line (Path) */}
                  <path
                    d="M 58 120 L 138 105 L 218 95 L 298 75 L 378 55 L 458 40 L 538 35"
                    fill="none"
                    stroke="#14b8a6"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="drop-shadow(0px 4px 6px rgba(20, 184, 166, 0.25))"
                  />

                  {/* Data Point Nodes */}
                  <g fill="#14b8a6" stroke="#ffffff" strokeWidth="2">
                    <circle cx="58" cy="120" r="4.5" />
                    <circle cx="138" cy="105" r="4.5" />
                    <circle cx="218" cy="95" r="4.5" />
                    <circle cx="298" cy="75" r="4.5" />
                    <circle cx="378" cy="55" r="4.5" />
                    <circle cx="458" cy="40" r="4.5" />
                    <circle cx="538" cy="35" r="4.5" />
                  </g>

                  {/* Label texts */}
                  <text x="58" y="192" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">Mon</text>
                  <text x="138" y="192" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">Tue</text>
                  <text x="218" y="192" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">Wed</text>
                  <text x="298" y="192" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">Thu</text>
                  <text x="378" y="192" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">Fri</text>
                  <text x="458" y="192" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">Sat</text>
                  <text x="538" y="192" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">Sun</text>
                </svg>

                <div className="flex items-center space-x-6 text-[10px] mt-2 border-t border-slate-800 pt-3">
                  <div className="flex items-center space-x-1.5">
                    <span className="inline-block h-3 w-3 bg-slate-600/50 rounded-sm" />
                    <span className="text-slate-400 font-semibold">Standard Care Protocol (42 min baseline)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="inline-block h-3 w-1.5 bg-teal-500 rounded-full" />
                    <span className="text-slate-400 font-semibold">AI-Triage Assisted (Current Run)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Triage priority distribution (4 Cols) */}
            <div className="lg:col-span-4 bg-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Sliders className="h-5 w-5 text-teal-400" />
                  <h3 className="text-md font-bold text-slate-200">Priority Load Distribution</h3>
                </div>

                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Relative percentage distribution of patient clinical priority categorizations allocated daily.
                </p>

                {/* Simulated donut chart breakdown elements */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-red-400 flex items-center space-x-1.5">
                        <span className="h-2.5 w-2.5 rounded bg-red-500 inline-block" />
                        <span>Level 2 / STAT (Emergent)</span>
                      </span>
                      <span className="text-slate-300 font-mono font-bold">12.1%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: '12.1%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-amber-400 flex items-center space-x-1.5">
                        <span className="h-2.5 w-2.5 rounded bg-amber-500 inline-block" />
                        <span>Level 3 / Urgent</span>
                      </span>
                      <span className="text-slate-300 font-mono font-bold">29.7%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '29.7%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-emerald-400 flex items-center space-x-1.5">
                        <span className="h-2.5 w-2.5 rounded bg-emerald-500 inline-block" />
                        <span>Level 4 / Routine Clinical</span>
                      </span>
                      <span className="text-slate-300 font-mono font-bold">58.2%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '58.2%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 bg-slate-900/30 p-3 rounded-xl flex items-start space-x-2.5">
                <Shield className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-[10px] text-slate-400 leading-normal">
                  All processed logs are double-encrypted. Patient health information (PHI) handles strictly comply with HIPAA regulation criteria.
                </span>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer credits and information */}
      <footer id="app-footer" className="mt-auto border-t border-slate-800 bg-slate-950/40 py-6 text-center text-xs text-slate-500 px-6">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Building className="h-4 w-4 text-slate-600" />
            <span className="font-semibold">ClinixAI Clinical Research & Operations Portal</span>
          </div>
          <div className="flex space-x-6">
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Regulatory Guidelines</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">EHR Integration APIs</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Security Protocol</span>
          </div>
          <div>
            <span>© 2026 ClinixAI Systems. Confidential Medical Use Only.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
