import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Globe, Sparkles } from 'lucide-react';

const Contact = () => {


  return (
    <div className="relative min-h-screen bg-white pt-28 pb-20 overflow-hidden">

      {/* Decorative background grid and matrix lighting */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* --- Header Section --- */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/5 text-blue-600 text-xs font-orbitron tracking-widest uppercase mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>CONTACT US</span>
          </motion.div>
        </div>

        <div className="flex justify-center items-start">

          {/* Communication Channels */}
          <div className="w-full max-w-2xl space-y-6">

            <div className="glass-panel border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              {/* Glowing top line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

              <h3 className="font-orbitron font-bold text-base text-black mb-6">CONTACT DETAILS</h3>

              <div className="space-y-6 text-xs sm:text-sm">

                <div className="flex items-start space-x-3.5">
                  <div className="p-2 bg-slate-100 border border-slate-800 rounded-lg text-blue-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-orbitron text-black text-[10px] tracking-wider uppercase">LABORATORY SECTOR</h4>
                    <p className="text-black font-semibold mt-1">Plot No. Q8, Building No. 44/1 & 64, E J Hosalli, Hosalli Sindhanur Hobli, Raichur–Koppal Road, Near Industrial Estate, Sindhanur, Raichur, Karnataka – 584128, india.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-2 bg-slate-100 border border-slate-800 rounded-lg text-blue-600">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-orbitron text-black text-[10px] tracking-wider uppercase">COMMUNICATIONS LINE</h4>
                    <p className="text-black font-semibold mt-1">+91 9035121902</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-2 bg-slate-100 border border-slate-800 rounded-lg text-blue-600">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-orbitron text-black text-[10px] tracking-wider uppercase">ENCRYPTED EMAIL</h4>
                    <a href="mailto:Kvvsaielectricals@gmail.com" className="text-black font-semibold mt-1 hover:underline">Kvvsaielectricals@gmail.com</a>
                  </div>
                </div>



              </div>
            </div>

          </div>



        </div>

      </div>
    </div>
  );
};

export default Contact;

