import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, ShieldAlert } from 'lucide-react';
import { eventAPI } from '../services/api';

const Terms = () => {
  const [termsParagraphs, setTermsParagraphs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await eventAPI.getActive();
        if (response.data && response.data.terms_and_conditions) {
          const paragraphs = response.data.terms_and_conditions.split('\n').filter(p => p.trim() !== '');
          if (paragraphs.length > 0) {
            setTermsParagraphs(paragraphs);
          }
        }
      } catch (error) {
        console.error('Failed to fetch terms:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
  }, []);
  return (
    <div className="relative min-h-screen bg-slate-50 pt-28 pb-20 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-bold text-2xl text-black mb-6">Terms and Conditions</h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl shadow-md border border-slate-200 p-8 sm:p-12 prose max-w-none"
        >

          {loading ? (
            <div className="text-center py-10">
              <div className="w-10 h-10 border-4 border-t-blue-500 border-r-blue-500/30 border-b-blue-500/10 border-l-blue-500/50 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-slate-500 font-mono tracking-widest uppercase">Loading terms...</p>
            </div>
          ) : termsParagraphs.length > 0 ? (
            termsParagraphs.map((paragraph, index) => (
              <div key={index} className="mb-6">
                <p className="text-slate-600 text-sm leading-relaxed">
                  {paragraph}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center text-slate-500 py-10">
              No specific terms have been configured yet.
            </div>
          )}


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
