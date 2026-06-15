import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, 
  ArrowLeft, 
  Wifi, 
  ShieldCheck, 
  ShieldAlert, 
  Camera, 
  History, 
  Keyboard, 
  CheckCircle2, 
  AlertTriangle,
  Play
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { adminAPI } from '../services/api';

const AdminScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [validationLoading, setValidationLoading] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [validationResult, setValidationResult] = useState(null);
  
  const qrCodeInstanceRef = useRef(null);
  const audioContextRef = useRef(null);

  // Initialize Web Audio Context for synthesized sound buzzers
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  };

  // Synthesizer: Play futuristic success chime (high twin-tone beep)
  const playSuccessChime = () => {
    try {
      initAudio();
      const ctx = audioContextRef.current;
      if (!ctx) return;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      // Futuristic major chord beep
      osc1.frequency.setValueAtTime(880, ctx.currentTime); 
      osc2.frequency.setValueAtTime(1109.73, ctx.currentTime); // C#6

      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.3);
      osc2.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn('Audio synthesis failed:', e);
    }
  };

  // Synthesizer: Play hazard double entry warning alarm (low detuned frequency sweeps)
  const playAlertAlarm = () => {
    try {
      initAudio();
      const ctx = audioContextRef.current;
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.5);

      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.warn('Audio synthesis failed:', e);
    }
  };

  // Start QR Camera Scanner
  const startScanner = async () => {
    setCameraError('');
    setIsScanning(true);
    setScanResult(null);
    setValidationResult(null);

    // Short timeout to ensure the scanner container element '#qr-reader' is fully rendered in the DOM
    setTimeout(async () => {
      try {
        const qrScanner = new Html5Qrcode('qr-reader');
        qrCodeInstanceRef.current = qrScanner;

        const config = {
          fps: 15,
          qrbox: (width, height) => {
            const size = Math.min(width, height) * 0.7;
            return { width: size, height: size };
          }
        };

        await qrScanner.start(
          { facingMode: 'environment' }, // Default to rear camera
          config,
          (decodedText) => {
            // Success handler: Stop camera and validate pass code
            stopScanner();
            handlePassValidation(decodedText);
          },
          (errorMessage) => {
            // Verbose debug frame warnings can be ignored
          }
        );
      } catch (err) {
        console.error('QR Scanner initialization failure:', err);
        setCameraError('Hardware connection lost: Unable to acquire camera stream permissions.');
        setIsScanning(false);
      }
    }, 100);
  };

  // Stop QR Camera Scanner
  const stopScanner = async () => {
    if (qrCodeInstanceRef.current && qrCodeInstanceRef.current.isScanning) {
      try {
        await qrCodeInstanceRef.current.stop();
        qrCodeInstanceRef.current = null;
      } catch (err) {
        console.error('Failed to gracefully terminate scanner stream:', err);
      }
    }
    setIsScanning(false);
  };

  useEffect(() => {
    // Start camera feed instantly on mount
    startScanner();

    // Graceful unmount clean routine
    return () => {
      if (qrCodeInstanceRef.current && qrCodeInstanceRef.current.isScanning) {
        qrCodeInstanceRef.current.stop().catch((e) => console.error('Auto-stop error:', e));
      }
    };
  }, []);

  // Validate the code string against our Express endpoints
  const handlePassValidation = async (codeString) => {
    const trimmedCode = codeString.trim();
    if (!trimmedCode) return;

    setValidationLoading(true);
    setValidationResult(null);
    setScanResult(trimmedCode);

    try {
      const response = await adminAPI.validatePass(trimmedCode);
      
      // Successfully checked in!
      playSuccessChime();
      const payload = {
        success: true,
        message: response.data.message || 'Pass cleared.',
        attendee: response.data.attendee
      };
      setValidationResult(payload);

      // Add to log ledger
      setScanHistory((prev) => [
        {
          code: trimmedCode,
          name: response.data.attendee.name,
          model: response.data.attendee.model,
          timestamp: new Date().toLocaleTimeString(),
          status: 'success',
          msg: 'BOARDING CLEARED'
        },
        ...prev
      ]);
    } catch (err) {
      const errData = err.response?.data;
      console.warn('Pass validation rejection:', errData);

      if (errData?.duplicate) {
        // Double Entry Violation fraud!
        playAlertAlarm();
        const payload = {
          success: false,
          duplicate: true,
          message: errData.message || 'Double entry warning!',
          attendee: errData.attendee,
          scanTime: errData.scan_time
        };
        setValidationResult(payload);

        setScanHistory((prev) => [
          {
            code: trimmedCode,
            name: errData.attendee?.name || 'Voter Profile',
            model: errData.attendee?.model || 'Electric Model',
            timestamp: new Date().toLocaleTimeString(),
            status: 'duplicate',
            msg: 'DOUBLE ENTRY VIOLATION'
          },
          ...prev
        ]);
      } else {
        // General Invalid ticket failure
        playAlertAlarm();
        const payload = {
          success: false,
          duplicate: false,
          message: errData?.message || 'Access Denied: Ticket unregistered or validation error.'
        };
        setValidationResult(payload);

        setScanHistory((prev) => [
          {
            code: trimmedCode,
            name: 'UNKNOWN PASSCODE',
            model: 'N/A',
            timestamp: new Date().toLocaleTimeString(),
            status: 'invalid',
            msg: 'INVALID CREDENTIALS'
          },
          ...prev
        ]);
      }
    } finally {
      setValidationLoading(false);
      setManualCode('');
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handlePassValidation(manualCode);
    }
  };

  return (
    <div className="min-h-screen bg-white grid-bg text-black pt-24 pb-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <Link 
                to="/admin" 
                onClick={stopScanner}
                className="p-2 border border-slate-800 hover:border-slate-700 bg-slate-50/80 rounded transition"
              >
                <ArrowLeft className="w-4 h-4 text-gray-400 hover:text-black" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold font-mono tracking-widest text-black">
                  GATE CLEARANCE SCANNERS
                </h1>
                <p className="text-[10px] text-gray-500 font-mono tracking-wider">
                  SECURE TICKET CLEARANCE SCANNING NODES • PORT 5000 ACTIVE
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/35 text-emerald-400">
            <Wifi className="w-3.5 h-3.5 animate-pulse" />
            SECURE LINK ACTIVE
          </div>
        </div>

        {/* Central Core Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT CONTAINER: Visual Scanner Viewport */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="glass-panel p-6 rounded-lg border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-blue-400" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-blue-400" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-blue-400" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-blue-400" />
              
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-xs font-semibold tracking-widest text-black flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-blue-400" />
                  OPTICAL SCANNING VIEWPORT
                </span>
                
                {isScanning ? (
                  <button 
                    onClick={stopScanner}
                    className="font-mono text-[10px] text-red-400 hover:underline"
                  >
                    DISABLE STREAM
                  </button>
                ) : (
                  <button 
                    onClick={startScanner}
                    className="font-mono text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Play className="w-2.5 h-2.5" /> RE-ENABLE STREAM
                  </button>
                )}
              </div>

              {/* Viewport Frame */}
              <div className="relative w-full aspect-square md:aspect-[4/3] bg-black/80 rounded border border-slate-900 overflow-hidden flex items-center justify-center">
                {isScanning ? (
                  <div className="w-full h-full relative">
                    {/* Scanner laser overlay */}
                    <div className="absolute inset-0 z-10 pointer-events-none border border-blue-500/10">
                      <div className="scanner-line" />
                      <div className="absolute inset-[15%] border-2 border-dashed border-blue-400/20 rounded" />
                    </div>
                    {/* HTML5 Qrcode library injects standard video tag here */}
                    <div id="qr-reader" className="w-full h-full object-cover [&>div]:border-none [&>div]:bg-transparent" />
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-4">
                    <div className="w-16 h-16 mx-auto bg-slate-100 border border-slate-800 rounded-full flex items-center justify-center">
                      <QrCode className="w-8 h-8 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-mono text-sm text-black">Optical stream offline</p>
                      {cameraError ? (
                        <p className="text-red-400 text-xs mt-1 font-mono">{cameraError}</p>
                      ) : (
                        <p className="text-slate-500 text-xs mt-0.5 font-mono">Stream was suspended. Click Re-enable above.</p>
                      )}
                    </div>
                    <button 
                      onClick={startScanner}
                      className="px-4 py-2 bg-blue-900/20 border border-blue-500/40 text-blue-400 text-xs font-mono font-bold rounded hover:bg-blue-900/40 transition"
                    >
                      INITIALIZE HARDWARE LINK
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Override Manual Input Form */}
            <div className="glass-panel p-5 rounded-lg border border-slate-800">
              <h3 className="font-mono text-xs font-semibold text-black mb-3 flex items-center gap-1.5">
                <Keyboard className="w-3.5 h-3.5 text-blue-400" />
                MANUAL ATTENDEE BYPASS OVERRIDE
              </h3>
              
              <form onSubmit={handleManualSubmit} className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Enter alphanumeric pass ID code (e.g. QP-XXXXX)..."
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="flex-1 px-4 py-2.5 font-mono text-xs bg-slate-50 border border-slate-800 rounded focus:border-blue-500 focus:outline-none transition duration-300 text-black"
                />
                <button
                  type="submit"
                  disabled={!manualCode.trim() || validationLoading}
                  className="px-5 py-2.5 font-mono text-xs font-bold tracking-wider rounded bg-slate-100 hover:bg-slate-800 border border-slate-700 text-black transition disabled:opacity-40"
                >
                  VERIFY PASSPORT
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT CONTAINER: Verification Status & History Logs */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Scan Result Banner */}
            <div className="glass-panel p-6 rounded-lg min-h-[220px] flex flex-col justify-between relative overflow-hidden">
              <span className="font-mono text-[10px] text-slate-500 block mb-4 tracking-widest uppercase">
                CLEARANCE RADAR FEED
              </span>

              {validationLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-6">
                  <div className="w-10 h-10 border-2 border-t-blue-400 border-r-blue-400/20 border-b-blue-400/10 border-l-blue-400/50 rounded-full animate-spin"></div>
                  <span className="font-mono text-xs text-blue-400 animate-pulse uppercase tracking-wider">
                    Querying credentials blockchain...
                  </span>
                </div>
              ) : validationResult ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col justify-between space-y-4"
                  >
                    {/* Clear success feed */}
                    {validationResult.success ? (
                      <div className="space-y-4">
                        <div className="p-3 border border-emerald-500/20 bg-emerald-500/10 rounded-md flex items-center gap-3">
                          <ShieldCheck className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                          <div>
                            <h4 className="font-mono text-sm font-bold text-emerald-400">ENTRY PASS CONFIRMED</h4>
                            <p className="text-[10px] text-emerald-500/80 font-mono">Cleared for immediate boarding.</p>
                          </div>
                        </div>

                        <div className="space-y-2 font-mono text-xs bg-slate-50/40 p-4 rounded-md border border-slate-900">
                          <div className="flex justify-between border-b border-slate-900 pb-1">
                            <span className="text-gray-500">ATTENDEE GUEST:</span>
                            <span className="text-black font-bold">{validationResult.attendee.name}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-900 pb-1">
                            <span className="text-gray-500">EMAIL:</span>
                            <span className="text-black truncate max-w-[180px]">{validationResult.attendee.email}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-900 pb-1">
                            <span className="text-gray-500">BOOKING ID:</span>
                            <span className="text-blue-400 font-bold">{validationResult.attendee.booking_id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">PRODUCT ALLOC:</span>
                            <span className="text-black font-bold">{validationResult.attendee.model} ({validationResult.attendee.capacity} KW)</span>
                          </div>
                        </div>
                      </div>
                    ) : validationResult.duplicate ? (
                      /* Double Entry Alarm alert */
                      <div className="space-y-4">
                        <div className="p-3 border border-red-500/30 bg-red-500/10 rounded-md flex items-center gap-3 animate-pulse">
                          <ShieldAlert className="w-8 h-8 text-red-500 flex-shrink-0" />
                          <div>
                            <h4 className="font-mono text-sm font-bold text-red-500">DOUBLE ENTRY DETECTED</h4>
                            <p className="text-[10px] text-red-400 font-mono">Ticket already registered at entrance!</p>
                          </div>
                        </div>

                        <div className="space-y-2 font-mono text-xs bg-red-950/10 p-4 rounded-md border border-red-900/20">
                          <div className="flex justify-between border-b border-red-900/10 pb-1">
                            <span className="text-black">ATTENDEE FLAG:</span>
                            <span className="text-black font-bold">{validationResult.attendee?.name}</span>
                          </div>
                          <div className="flex justify-between border-b border-red-900/10 pb-1">
                            <span className="text-black">BOOKING ID:</span>
                            <span className="text-black font-bold">{validationResult.attendee?.booking_id}</span>
                          </div>
                          <div className="flex justify-between border-b border-red-900/10 pb-1">
                            <span className="text-black">PREVIOUS SCAN:</span>
                            <span className="text-red-400 font-bold">{validationResult.scanTime}</span>
                          </div>
                          <div className="text-[10px] text-red-400 text-center font-bold tracking-widest pt-2">
                            WARNING: DUPLICATE ENTRY CLEARANCE VIOLATION
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* General Invalid code */
                      <div className="space-y-4">
                        <div className="p-4 border border-rose-500/30 bg-rose-500/10 rounded-md flex items-center gap-3">
                          <ShieldAlert className="w-8 h-8 text-rose-500 flex-shrink-0" />
                          <div>
                            <h4 className="font-mono text-sm font-bold text-rose-400">INVALID ENTRANCE TICKET</h4>
                            <p className="text-[10px] text-rose-500/80 font-mono">Hash code matches no registered ticket passes.</p>
                          </div>
                        </div>

                        <p className="text-xs text-black font-mono text-center pt-2 leading-relaxed">
                          Please verify credentials structure. Scan code may be corrupted, counterfeit, or registration database connection is down.
                        </p>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-900 text-center">
                      <button 
                        onClick={() => {
                          setValidationResult(null);
                          setScanResult(null);
                          if (!isScanning) startScanner();
                        }}
                        className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-800 rounded font-mono text-xs font-semibold text-black hover:text-black transition"
                      >
                        RESET CLEARED BARRIER
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-3 py-6">
                  <QrCode className="w-12 h-12 text-black animate-pulse" />
                  <p className="font-mono text-xs text-center">
                    Awaiting gate scanned inputs...<br />
                    Place booking QR code within viewport range.
                  </p>
                </div>
              )}
            </div>

            {/* SCANNING SESSION HISTORY */}
            <div className="glass-panel p-5 rounded-lg border border-slate-800 flex flex-col max-h-[300px]">
              <h3 className="font-mono text-xs font-semibold text-black mb-4 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-blue-400" />
                SESSION VERIFICATION LOGS
              </h3>

              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {scanHistory.length > 0 ? (
                  scanHistory.map((log, idx) => (
                    <div 
                      key={idx}
                      className="p-3 border border-slate-900 bg-slate-50/20 rounded flex justify-between items-center font-mono text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-black">
                          {log.status === 'success' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                          )}
                          {log.name}
                        </div>
                        <div className="text-[10px] text-black">Code: {log.code}</div>
                        <div className="text-[10px] text-blue-400/80">Model: {log.model}</div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-1">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          log.status === 'success' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' 
                            : log.status === 'duplicate'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {log.msg}
                        </span>
                        <span className="text-[9px] text-slate-500">{log.timestamp}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-28 flex items-center justify-center text-black font-mono text-xs">
                    NO PASSES SCANNED YET
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminScanner;

