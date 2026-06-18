import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, ShieldAlert } from 'lucide-react';

const Terms = () => {
  return (
    <div className="relative min-h-screen bg-slate-50 pt-28 pb-20 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-green-500/10 text-green-700 border border-green-500/20 mb-6"
          >
            <Leaf className="w-5 h-5" />
            <span className="font-bold text-sm tracking-widest uppercase">Agricultural Purpose Only</span>
          </motion.div>
          
          <h1 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-black mb-4">
            TERMS & CONDITIONS
          </h1>
          <p className="text-slate-600 text-sm">
            Please read these terms carefully before using the K V V Sai electricals Generator for your farming operations.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-12 prose max-w-none"
        >
          <div className="flex items-center gap-3 mb-6 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
            <ShieldAlert className="w-6 h-6 shrink-0" />
            <p className="m-0 text-sm font-semibold">
              CRITICAL NOTICE: The generator models provided under this agreement are strictly licensed and distributed for agricultural use only.
            </p>
          </div>

          <h3 className="font-orbitron font-bold text-lg text-black mt-8 mb-4 border-b border-slate-100 pb-2">1. USE OF EQUIPMENT</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            The K V V Sai electricals Generator ("Equipment") is leased, sold, or distributed exclusively for agricultural and farming applications. This includes powering irrigation systems, greenhouse climate control, farm machinery, and rural agricultural facilities. Any commercial, industrial (non-agricultural), or residential use outside of a farming context is strictly prohibited unless explicitly authorized in writing.
          </p>

          <h3 className="font-orbitron font-bold text-lg text-black mt-8 mb-4 border-b border-slate-100 pb-2">2. PROHIBITION OF RESALE & TRANSFER</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            The Equipment is provided to the registered farmer or agricultural entity and may not be resold, sub-leased, or transferred to any third party without prior authorization from K V V Sai electricals. The agricultural subsidies and pricing applied are non-transferable.
          </p>

          <h3 className="font-orbitron font-bold text-lg text-black mt-8 mb-4 border-b border-slate-100 pb-2">3. COMPLIANCE WITH AGRICULTURAL STANDARDS</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            The user agrees to operate the Equipment in compliance with all local and national agricultural and environmental regulations. The zero-emission nature of the Equipment supports sustainable farming practices.
          </p>

          <h3 className="font-orbitron font-bold text-lg text-black mt-8 mb-4 border-b border-slate-100 pb-2">4. MAINTENANCE & MODIFICATIONS</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            No unauthorized modifications may be made to the permanent magnetic core or the superconducting matrices. Maintenance must be performed by certified K V V Sai electricals technicians or authorized agricultural service partners.
          </p>

          <h3 className="font-orbitron font-bold text-lg text-black mt-8 mb-4 border-b border-slate-100 pb-2">5. LIABILITY LIMITATION</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            While the Equipment provides continuous, zero-fuel power, K V V Sai electricals is not liable for crop loss or damages resulting from improper installation, misuse, or extreme force majeure events that disrupt operation.
          </p>
          
          <div className="mt-12 pt-6 border-t border-slate-200 text-xs text-slate-500 text-center">
            <p>Last Updated: June 2026</p>
            <p>© 2026 K V V Sai electricals Generator Industries.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
