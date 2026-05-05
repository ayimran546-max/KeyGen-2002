/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect, ReactNode } from 'react';
import { 
  Monitor, 
  Terminal, 
  Copy, 
  RefreshCw, 
  Settings, 
  HelpCircle, 
  ExternalLink,
  ChevronDown,
  X,
  Minus,
  Square,
  HardDrive,
  Info,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Retro-style component
const DesktopWindow = ({ children, title, icon: Icon, onClose }: { children: ReactNode, title: string, icon: any, onClose?: () => void }) => (
  <div className="bg-[#c0c0c0] border-t-white border-l-white border-b-[#808080] border-r-[#808080] border-2 shadow-[2px_2px_0_0_rgba(0,0,0,1)] p-[2px] w-full max-w-2xl mx-auto overflow-hidden">
    {/* Title Bar */}
    <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] h-[18px] flex items-center justify-between px-1 mb-1 select-none">
      <div className="flex items-center gap-1">
        <Icon size={12} className="text-white" />
        <span className="text-white text-[11px] font-bold tracking-tight leading-none pt-[1px]">{title}</span>
      </div>
      <div className="flex gap-[2px]">
        <button className="bg-[#c0c0c0] border-t-white border-l-white border-b-[#808080] border-r-[#808080] border-[1px] w-3 h-3 flex items-center justify-center hover:bg-[#d0d0d0] active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white">
          <Minus size={8} strokeWidth={3} />
        </button>
        <button className="bg-[#c0c0c0] border-t-white border-l-white border-b-[#808080] border-r-[#808080] border-[1px] w-3 h-3 flex items-center justify-center hover:bg-[#d0d0d0] active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white">
          <Square size={8} strokeWidth={3} />
        </button>
        <button 
          onClick={onClose}
          className="bg-[#c0c0c0] border-t-white border-l-white border-b-[#808080] border-r-[#808080] border-[1px] w-3 h-3 flex items-center justify-center hover:bg-[#d0d0d0] active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white ml-1"
        >
          <X size={8} strokeWidth={3} />
        </button>
      </div>
    </div>
    {/* Content Area */}
    <div className="p-4 bg-[#f0f0f0] border-t-[#808080] border-l-[#808080] border-b-white border-r-white border-[1px]">
      {children}
    </div>
  </div>
);

const RetroButton = ({ children, onClick, active = false, className = "", disabled = false }: { children: ReactNode, onClick: () => void, active?: boolean, className?: string, disabled?: boolean }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-1 flex items-center justify-center gap-2 text-[12px] font-medium 
      ${active 
        ? "bg-[#d0d0d0] border-t-[#808080] border-l-[#808080] border-b-white border-r-white" 
        : "bg-[#c0c0c0] border-t-white border-l-white border-b-[#808080] border-r-[#808080]"} 
      border-2 active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white 
      disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

const RetroInput = ({ value, readOnly = true, className = "" }: { value: string, readOnly?: boolean, className?: string }) => (
  <input 
    type="text" 
    value={value} 
    readOnly={readOnly}
    className={`bg-white border-t-[#808080] border-l-[#808080] border-b-white border-r-white border-2 px-2 py-1 font-mono text-[14px] leading-tight focus:outline-none w-full ${className}`}
  />
);

const SOFTWARE_OPTIONS = [
  { id: 'win2k2', name: 'Windows 2002 (XP Professional)', format: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX' },
  { id: 'win2k2-hm', name: 'Windows 2002 (XP Home Edition)', format: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX' },
  { id: 'office2k2', name: 'Office 2002 XP', format: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX' },
  { id: 'winserver2k3', name: 'Windows Server 2003', format: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX' },
];

export default function App() {
  const [stage, setStage] = useState<'setup' | 'loading' | 'ready'>('setup');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [selectedSoftware, setSelectedSoftware] = useState(SOFTWARE_OPTIONS[0]);
  const [productKey, setProductKey] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Stage 1: Setup Screen (4 seconds)
  useEffect(() => {
    if (stage === 'setup') {
      const timer = setTimeout(() => setStage('loading'), 4000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Stage 2: Loading Progress (The fake "2 minute" wait, accelerated for UX)
  useEffect(() => {
    if (stage === 'loading') {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStage('ready'), 1000);
            return 100;
          }
          // Increments slower at the end for "realism"
          const inc = prev < 80 ? 1.2 : 0.4;
          return Math.min(prev + inc, 100);
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [stage]);

  const generateKey = useCallback(() => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const chars = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"; 
      let key = "";
      for (let i = 0; i < 5; i++) {
        let block = "";
        for (let j = 0; j < 5; j++) {
          block += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        key += block + (i === 4 ? "" : "-");
      }
      
      setProductKey(key);
      setHistory(prev => [key, ...prev].slice(0, 5));
      setIsGenerating(false);
      setCopied(false);
    }, 400);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(productKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (stage === 'ready') {
      generateKey();
    }
  }, [stage, generateKey]);

  return (
    <div className="min-h-screen bg-black font-sans antialiased overflow-hidden select-none" id="retro-root">
      <AnimatePresence mode="wait">
        {/* STAGE 1: WINDOWS 2002 SETUP (Blue Screen) */}
        {stage === 'setup' && (
          <motion.div 
            key="setup-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0000aa] text-white p-12 font-mono flex flex-col"
          >
            <div className="bg-[#c0c0c0] text-[#0000aa] px-4 py-1 self-start font-bold mb-8 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              Windows Setup
            </div>
            
            <div className="space-y-6 max-w-4xl">
              <h1 className="text-2xl font-bold border-b border-white pb-2 mb-8">Welcome to Setup.</h1>
              <p>This part of the setup program prepares Windows to run on your computer.</p>
              
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <span className="bg-[#c0c0c0] text-[#0000aa] px-2 font-bold h-fit min-w-[40px] text-center italic border-b-2 border-r-2 border-black">ENTER</span>
                  <span>To set up Windows Server 2002 now, press ENTER.</span>
                </li>
                <li className="flex gap-4">
                  <span className="bg-[#c0c0c0] text-[#0000aa] px-2 font-bold h-fit min-w-[40px] text-center italic border-b-2 border-r-2 border-black">R</span>
                  <span>To repair an installation using Recovery Console, press R.</span>
                </li>
                <li className="flex gap-4 opacity-70">
                  <span className="bg-[#c0c0c0] text-[#0000aa] px-2 font-bold h-fit min-w-[40px] text-center italic border-b-2 border-r-2 border-black">F3</span>
                  <span>To quit Setup without installing Windows, press F3.</span>
                </li>
              </ul>

              <div className="pt-20 opacity-90">
                <p className="text-[#ffff55] animate-pulse">Detecting hardware configuration...</p>
                <div className="mt-4 text-[12px] space-y-1">
                  <p>Loading files (CD-ROM: ISO_9660)...</p>
                  <p>Checking filesystem integrity on C: ...</p>
                  <p>Initializing Registry Hive...</p>
                </div>
              </div>
            </div>

            <div className="mt-auto bg-[#c0c0c0] text-[#0000aa] flex justify-between px-4 py-1 text-sm font-bold border-t-2 border-white">
              <span>ENTER=Continue</span>
              <span>R=Repair</span>
              <span>F3=Quit</span>
            </div>
          </motion.div>
        )}

        {/* STAGE 2: LOADING (Opening message) */}
        {stage === 'loading' && (
          <motion.div 
            key="loading-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1, scale: 1.05 }}
            className="fixed inset-0 bg-[#008080] flex flex-col items-center justify-center p-8 gap-8"
          >
            <div className="text-center space-y-6">
              {/* Stylized CSS Logo mimicking the uploaded image */}
              <div className="relative w-32 h-32 mx-auto mb-8 scale-125">
                 <motion.div 
                   animate={{ 
                     y: [0, -5, 0],
                     rotate: [-1, 1, -1]
                   }}
                   transition={{ 
                     repeat: Infinity,
                     duration: 4,
                     ease: "easeInOut"
                   }}
                   className="grid grid-cols-2 gap-1 p-2"
                 >
                    {/* Top Left: Red */}
                    <div className="w-12 h-10 bg-[#ee4328] shadow-[2px_2px_10px_rgba(238,67,40,0.4)] rounded-[4px_12px_4px_12px] opacity-90 blur-[0.3px]"></div>
                    {/* Top Right: Green */}
                    <div className="w-12 h-10 bg-[#7db42d] shadow-[2px_2px_10px_rgba(125,180,45,0.4)] rounded-[12px_4px_12px_4px] opacity-90 blur-[0.3px] translate-y-1"></div>
                    {/* Bottom Left: Blue */}
                    <div className="w-12 h-10 bg-[#00a8e1] shadow-[2px_2px_10px_rgba(0,168,225,0.4)] rounded-[12px_4px_12px_4px] opacity-90 blur-[0.3px] -translate-y-1"></div>
                    {/* Bottom Right: Yellow/Orange */}
                    <div className="w-12 h-10 bg-[#f9a61a] shadow-[2px_2px_10px_rgba(249,166,26,0.4)] rounded-[4px_12px_4px_12px] opacity-90 blur-[0.3px]"></div>
                 </motion.div>
                 
                 {/* Glossy overlay effect */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 pointer-events-none rounded-full blur-xl scale-150"></div>
              </div>

              <h2 className="text-white text-4xl font-black italic tracking-tighter drop-shadow-lg scale-y-110">
                Windows <span className="text-[0.8em] font-normal not-italic relative -top-2">xp</span>
              </h2>
              <div className="space-y-2">
                <p className="text-white text-xl font-medium tracking-tight">Opening product key generator...</p>
                <p className="text-white/60 text-xs font-mono">ESTIMATED WAIT TIME: 2 MINUTES</p>
              </div>
            </div>

            <div className="w-full max-w-md bg-[#c0c0c0] border-t-white border-l-white border-b-[#808080] border-r-[#808080] border-2 p-1 shadow-2xl">
              <div className="bg-[#f0f0f0] border-t-[#808080] border-l-[#808080] border-b-white border-r-white border-[1px] p-5">
                <div className="mb-3 flex justify-between text-[11px] font-bold text-[#000080] uppercase tracking-wider">
                  <span>Decrypting Application Data...</span>
                  <span>{Math.round(loadingProgress)}%</span>
                </div>
                {/* Classic Progress Bar Blocks */}
                <div className="h-7 bg-white border-t-[#808080] border-l-[#808080] border-b-white border-r-white border-2 flex p-[2px] gap-[2px]">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 transition-all duration-300 ${
                        (loadingProgress / (100/18)) > i 
                        ? 'bg-gradient-to-b from-[#3a78f2] to-[#0044cc] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]' 
                        : 'bg-transparent'
                      }`}
                    ></div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <Loader2 className="animate-spin text-[#000080]" size={16} />
                  <p className="text-[10px] text-gray-500 font-mono italic">
                    Allocating memory chunks: {0x1000 + Math.floor(loadingProgress * 256)}...
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 opacity-40">
               <div className="flex gap-2">
                 <Monitor size={16} className="text-white" />
                 <HardDrive size={16} className="text-white" />
               </div>
               <span className="text-white font-mono text-[9px] uppercase tracking-[0.2em]">Secure Boot Active</span>
            </div>
          </motion.div>
        )}

        {/* STAGE 3: THE MAIN APP */}
        {stage === 'ready' && (
          <motion.div 
            key="app-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#008080] p-4 flex flex-col items-center justify-center overflow-auto"
          >
            {/* Desktop Icons */}
            <div className="absolute top-4 left-4 flex flex-col gap-6 pointer-events-none opacity-80">
              <div className="flex flex-col items-center gap-1 w-16">
                <div className="bg-transparent p-1 border border-white/20">
                  <Monitor className="text-white" size={32} />
                </div>
                <span className="text-[10px] text-white text-center font-medium drop-shadow-sm">My Computer</span>
              </div>
              <div className="flex flex-col items-center gap-1 w-16">
                <div className="bg-transparent p-1 border border-white/20">
                  <HardDrive className="text-white" size={32} />
                </div>
                <span className="text-[10px] text-white text-center font-medium drop-shadow-sm">Recycle Bin</span>
              </div>
              <div className="flex flex-col items-center gap-1 w-16">
                <div className="bg-transparent p-1 border border-white/20">
                  <Terminal className="text-white" size={32} />
                </div>
                <span className="text-[10px] text-white text-center font-medium drop-shadow-sm">Network</span>
              </div>
            </div>

            <DesktopWindow title="Product Key Generator 2002 Edition" icon={Settings} onClose={() => window.location.reload()}>
              <div className="space-y-6">
                {/* Header info */}
                <div className="flex items-start gap-4 p-3 bg-white border-t-[#808080] border-l-[#808080] border-b-white border-r-white border-[1px]">
                  <div className="bg-[#000080] p-2 shrink-0">
                    <Monitor className="text-white" size={28} />
                  </div>
                  <div>
                    <h2 className="text-[14px] font-bold text-[#000080]">Software Activator v2.4.1</h2>
                    <p className="text-[11px] text-gray-600">"Universal historical key solution for retro hobbyists."</p>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-green-700 font-bold bg-green-50 px-1 border border-green-200 w-fit">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                      GEN_ENGINE_READY
                    </div>
                  </div>
                </div>

                {/* Selection */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold flex items-center gap-1 text-[#333]">
                    <ChevronDown size={12} /> Target Operating System:
                  </label>
                  <div className="relative">
                    <select 
                      className="w-full bg-white border-t-[#808080] border-l-[#808080] border-b-white border-r-white border-2 px-2 py-1.5 text-[12px] appearance-none focus:outline-none font-medium"
                      value={selectedSoftware.id}
                      onChange={(e) => setSelectedSoftware(SOFTWARE_OPTIONS.find(opt => opt.id === e.target.value)!)}
                    >
                      {SOFTWARE_OPTIONS.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-[2px] top-[2px] bottom-[2px] w-5 bg-[#c0c0c0] border-l border-[#808080] flex items-center justify-center pointer-events-none">
                       <ChevronDown size={14} className="text-[#333]" />
                    </div>
                  </div>
                </div>

                {/* Key Result */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold flex items-center gap-1 text-[#333]">
                    <Terminal size={12} /> Generated Serial Number:
                  </label>
                  <div className="flex gap-2">
                    <RetroInput 
                      value={isGenerating ? "RANDOMIZING ENTROPY..." : productKey} 
                      className="flex-1 text-center font-bold tracking-widest text-[#000080] bg-blue-50/20" 
                    />
                    <RetroButton onClick={copyToClipboard} disabled={!productKey || isGenerating}>
                      <Copy size={14} /> {copied ? "OK" : "Copy"}
                    </RetroButton>
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <RetroButton onClick={generateKey} disabled={isGenerating} className="w-full h-10 text-[14px] font-bold group">
                    <RefreshCw size={18} className={isGenerating ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
                    GENERATE NEW AUTH KEY
                  </RetroButton>
                </div>

                {/* History Log */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-300 pb-1">
                    <HelpCircle size={10} /> Session Vault
                  </div>
                  <div className="bg-white border-t-[#808080] border-l-[#808080] border-b-white border-r-white border-[1px] max-h-[100px] overflow-y-auto scrollbar-retro">
                    <table className="w-full text-[10px] text-left border-collapse">
                      <thead className="bg-[#d0d0d0] sticky top-0 z-10">
                        <tr>
                          <th className="px-2 py-1 font-bold border-r border-[#808080] border-b border-[#808080] w-12">No.</th>
                          <th className="px-2 py-1 font-bold border-b border-[#808080]">Product Key String</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.length === 0 ? (
                          <tr>
                            <td colSpan={2} className="px-2 py-4 text-center text-gray-400 italic">Vault is empty. Generate a key.</td>
                          </tr>
                        ) : (
                          history.map((h, i) => (
                            <tr key={h + i} className={i % 2 === 0 ? "bg-white" : "bg-blue-50/10"}>
                              <td className="px-2 py-1 border-r border-gray-100 text-gray-400">{history.length - i}</td>
                              <td className="px-2 py-1 font-mono text-[#000080] font-medium">{h}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="bg-[#c0c0c0] border-t-[#808080] border-l-[#808080] border-b-white border-r-white border-[1px] h-6 flex items-center justify-between px-2 text-[10px]">
                  <div className="flex items-center gap-2 border-r border-[#808080] pr-4 h-full">
                    <span className="flex h-2 w-2 rounded-full bg-green-500 border border-green-700 shadow-[0_0_2px_rgba(34,197,94,1)]"></span>
                    STATUS: ACTIVE
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="opacity-60 hidden sm:inline">ALGORITHM: V2-BLOWFISH</span>
                    <span className="font-bold">PROC: P4-HT</span>
                  </div>
                </div>
              </div>
            </DesktopWindow>

            {/* About Box */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 w-full max-w-sm mb-12"
            >
              <div className="bg-white/95 backdrop-blur-sm border-2 border-white p-3 shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-1 opacity-10">
                   <AlertTriangle size={32} />
                 </div>
                 <h3 className="text-[11px] font-bold text-gray-800 flex items-center gap-2 uppercase tracking-tighter">
                   <Info size={14} className="text-[#000080]" /> Technical Disclaimer
                 </h3>
                 <p className="text-[10px] leading-relaxed text-gray-600 mt-1">
                   Historical software emulation research tool. This application is for demonstration of 2002-era digital license formatting.
                 </p>
                 <div className="flex gap-3 mt-2 border-t border-gray-100 pt-2">
                    <button className="text-[9px] font-bold text-[#000080] hover:underline">Read Me</button>
                    <button className="text-[9px] font-bold text-[#000080] hover:underline">License.txt</button>
                 </div>
              </div>
            </motion.div>

            <footer className="mt-auto py-4 text-center">
              <p className="text-[10px] text-white/30 font-mono tracking-[0.3em] uppercase">
                &copy; REDESIGN CORP. MCMXCVIII - MMII
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
