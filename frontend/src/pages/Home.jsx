import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { eventAPI } from '../services/api';
import Countdown from '../components/Countdown';
import { Zap, ShieldCheck, FlameKindling, Landmark, ArrowRight, Activity, Cpu, Award, MessageSquare, ChevronDown, RefreshCw } from 'lucide-react';

const Home = () => {
  const [event, setEvent] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventAPI.getActive();
        setEvent(response.data);
      } catch (error) {
        console.error('Failed to fetch active event details:', error);
      }
    };
    fetchEvent();
  }, []);

  const stats = [
    { icon: <FlameKindling className="w-8 h-8 text-blue-400" />, value: '0 Liters', label: 'Fuel/Gasoline Required' },
    { icon: <Activity className="w-8 h-8 text-green-400" />, value: '100%', label: 'Clean Carbon-Free Output' },
    { icon: <Award className="w-8 h-8 text-purple-400" />, value: '25+ Yrs', label: 'Continuous Operation Lifespan' },
    { icon: <Landmark className="w-8 h-8 text-yellow-400" />, value: '10x ROI', label: 'Lifetime Energy Cost Savings' }
  ];

  const faqs = [
    {
      q: 'How does a magnetic-power generator generate electricity without fuel?',
      a: 'The K V V Sai electronic Generator operates using zero-point permanent neodymium magnet arrays arranged in an asynchronous stator structure. This configuration establishes a perpetual magnetic torque cycle that spins the internal rotor, converting kinetic magnetic flux into alternating current (AC) electricity through copper coils—completely free of diesel, solar rays, or combustion.'
    },
    {
      q: 'Does it make noise during operation?',
      a: 'No. The K V V Sai electronic Generator employs superconducting liquid convection bearings and a vaccum-sealed core, dampening mechanical vibrations. The entire device operates silently below 15 decibels, making it quieter than standard ambient refrigerator cycles.'
    },
    {
      q: 'What KW models are available, and how do I select one?',
      a: 'We offer three base models designed for various loads: the K V V Sai electronic-2 (2KW) for cabins, apartments, and essential appliances; the K V V Sai electronic-5 (5KW) which completely powers standard residential houses; and the K V V Sai electronic-10 (10KW) tailored for commercial estates, charging cells, or light factories.'
    },
    {
      q: 'Why is there a launch event booking fee?',
      a: 'The entry fee represents a direct pre-reservation ticket slot. Paying this deposit grants you official VIP clearance to attend the physical unveiling, a digital QR boarding pass, hands-on testing center clearance, and early-access rights to claim production-run priority deliveries.'
    }
  ];

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">

      {/* Decorative background grid and matrix lighting */}
      <div className="absolute inset-0 grid-bg opacity-45 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[150px] pointer-events-none"></div>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-16 pb-16 md:pt-24 md:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/5 text-blue-600 text-[10px] sm:text-xs font-orbitron tracking-widest uppercase mb-4"
        >
          <Zap className="w-3.5 h-3.5 animate-bounce" />
          <span>The Zero-Fuel Energy Revolution</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-orbitron font-extrabold text-2xl sm:text-4xl md:text-5xl tracking-tight leading-tight max-w-5xl mb-6 text-black"
        >
          RESOURCES FREE GENERATOR <br />
          <span>&</span> <br />
          <span className="text-black">
            ENERGY BOOSTER SYSTEM
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-rajdhani tracking-wide text-black text-sm sm:text-base leading-relaxed max-w-5xl mx-auto mb-10"
        >
          An advanced, fuel-less system harnessing environmental and zero-point energy to deliver clean, boosted power for diverse applications. Our technology provides energy security with continuous output, eliminating fuel dependency and minimizing environmental impact.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-5 mb-8 z-20 relative"
        >
          <Link to="/booking" className="btn-cyber px-8 py-3 rounded-sm text-xs tracking-wider font-bold w-full sm:w-auto flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(0,242,254,0.3)]">
            <span>BOOKING GENERATOR</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/about" className="px-8 py-3 rounded-sm font-orbitron border border-slate-700 bg-transparent text-black hover:text-black hover:border-slate-500 hover:bg-slate-100/50 transition-all text-xs tracking-wider font-bold w-full sm:w-auto">
            EXPLORE THE SCIENCE
          </Link>
        </motion.div>

        {/* Hero Machine Diagram UI */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 mt-12 mb-24 z-10 bg-[#191e24] rounded-3xl p-8 lg:p-12 shadow-2xl border border-slate-800 overflow-hidden"
        >
          {/* Left Column: Key Features */}
          <div className="flex flex-col space-y-6 lg:w-1/3 text-left z-10 order-2 lg:order-1 px-4 lg:px-0">
            <h3 className="font-orbitron font-bold text-white text-lg tracking-wider mb-2">KEY FEATURES:</h3>
            <ul className="space-y-6">
              <li className="flex items-center space-x-5 text-gray-200">
                <div className="p-3 border border-slate-700 rounded-xl bg-slate-800/80 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-base font-medium tracking-wide">Continuous Power</span>
              </li>
              <li className="flex items-center space-x-5 text-gray-200">
                <div className="p-3 border border-slate-700 rounded-xl bg-slate-800/80 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-base font-medium tracking-wide">Zero Inputs</span>
              </li>
              <li className="flex items-center space-x-5 text-gray-200">
                <div className="p-3 border border-slate-700 rounded-xl bg-slate-800/80 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                  <Cpu className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-base font-medium tracking-wide">Modular Scalability</span>
              </li>
            </ul>
          </div>

          {/* Center Image */}
          <div className="relative w-full lg:w-2/3 flex justify-center items-center z-0 order-1 lg:order-2">
            <img src="/images/Generator1.jpg" alt="Zero-Point Generator Engine" className="w-full max-w-[100%] lg:max-w-xl object-contain z-10" />
          </div>
        </motion.div>

        {/* Live Launch Countdown Timer Box */}
        {event && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full max-w-3xl glass-panel border border-blue-500 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
          >
            {/* Glowing top line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

            <p className="font-orbitron text-xs sm:text-sm text-blue-600 tracking-widest uppercase mb-6">
              GLOBAL REVELATION SHOWCASE COUNTDOWN
            </p>

            <Countdown targetDate={event.date} />

            <div className="mt-8 pt-6 border-t border-slate-800/80 text-xs sm:text-sm text-black flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>VENUE: <span className="text-blue-600 font-semibold">Plot No. Q8, Building No. 44/1 & 64, E J Hosalli, Hosalli Sindhanur Hobli, Raichur–Koppal Road, Near Industrial Estate, Sindhanur, Raichur, Karnataka – 584128, india.</span></p>
              <p>RESERVATION VALUE: <span className="text-green-600 font-bold">Rs. {parseFloat(event.ticket_price).toLocaleString()}</span></p>
            </div>
          </motion.div>
        )}
      </section>

      {/* --- STATISTICS SHOWCASE SECTION --- */}
      <section className="relative border-t border-slate-900 bg-slate-50/40 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-orbitron font-bold text-2xl sm:text-4xl text-black mb-4">
            DISRUPTIVE METRICS
          </h2>
          <p className="text-black text-sm max-w-xl mx-auto">
            Our permanent magnetic-flux core changes the thermodynamic equation of clean energy forever.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-panel glass-panel-hover rounded-xl p-8 text-center flex flex-col items-center"
            >
              <div className="p-4 bg-slate-100 border border-slate-800 rounded-full mb-6 glow-shadow-blue">
                {stat.icon}
              </div>
              <h3 className="font-orbitron font-extrabold text-3xl text-black mb-2">{stat.value}</h3>
              <p className="text-xs text-black font-medium leading-relaxed">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- SCIENCE INTRO SECTION --- */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="font-orbitron font-bold text-2xl sm:text-4xl text-black mb-6 leading-tight">
            ZERO-FUEL <br />
            MAGNETIC STATORS
          </h2>
          <p className="text-black text-sm sm:text-base leading-relaxed mb-6">
            Unlike wind or solar modules which depend on external weather currents, the K V V Sai electronic series relies entirely on the spin forces of high-coercivity Neodymium arrays.
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="mt-1 p-1 bg-blue-500/10 rounded border border-blue-500/30 text-blue-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-orbitron text-sm text-black font-semibold mb-1">Perpetual Magnetic Flux Loop</h4>
                <p className="text-xs text-black">Maintains continuous mechanical spin using permanent asymmetrical polar alignments.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="mt-1 p-1 bg-purple-500/10 rounded border border-purple-500/30 text-purple-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-orbitron text-sm text-black font-semibold mb-1">Vacuum Sealed Core Shielding</h4>
                <p className="text-xs text-black">Eliminates air resistance and micro-particles, preserving generator bearings and structural longevity.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center">
          {/* Animated Futuristic Ring */}
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-blue-500/20 border-dashed animate-slow-spin"></div>
            <div className="absolute w-[80%] h-[80%] rounded-full border-2 border-purple-500/25 animate-reverse animate-spin"></div>
            <div className="absolute w-[60%] h-[60%] rounded-full bg-slate-100 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.2)] flex flex-col items-center justify-center text-center p-6 animate-float">
              <Zap className="w-12 h-12 text-blue-500 animate-pulse mb-3" />
              <h4 className="font-orbitron text-xs tracking-wider text-black">CORE DYNAMICS</h4>
              <p className="text-[10px] text-slate-500 mt-1">SUPERCONDUCTIVE MATRIX</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="relative border-t border-slate-900 bg-slate-50/20 py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="font-orbitron font-bold text-2xl sm:text-4xl text-black mb-4">
            ACQUIRE ANSWERS
          </h2>
          <p className="text-black text-sm max-w-xl mx-auto">
            Resolve common queries about zero-point magnetics and preorder boarding credentials.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-xl overflow-hidden border border-slate-800/80 transition-colors"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left font-orbitron text-black hover:text-black font-semibold text-sm sm:text-base focus:outline-none"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-black transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 text-[#3b82f6]' : ''}`} />
              </button>

              <div
                className={`transition-all duration-300 overflow-hidden ${activeFaq === idx ? 'max-h-56 border-t border-slate-800/40 p-6' : 'max-h-0'}`}
              >
                <p className="text-xs sm:text-sm text-black leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;

