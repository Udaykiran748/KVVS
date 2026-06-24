import React, { useState } from 'react';
import { Cpu, Zap, Mail, Phone, MapPin, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { eventAPI } from '../services/api';

const Footer = () => {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsParagraphs, setTermsParagraphs] = useState([]);
  const [loadingTerms, setLoadingTerms] = useState(false);

  const handleOpenTerms = async () => {
    setShowTermsModal(true);
    if (termsParagraphs.length === 0) {
      setLoadingTerms(true);
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
        setLoadingTerms(false);
      }
    }
  };

  return (
    <footer className="relative bg-white border-t border-slate-800/80 pt-16 pb-8 overflow-hidden">
      {/* Dynamic background lighting */}
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl"></div>
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-[#3b82f6]/5 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/images/Logo Kvvsai.jpg" alt="KVVSai Logo" className="w-16 h-16 object-contain" />
              <span className="font-orbitron font-extrabold text-lg tracking-widest text-black">
                K V V SAI ELECTRICALS
              </span>
            </div>
            <p className="text-black text-sm leading-relaxed">
              Engineering the zero-fuel magnetic electricity generators of the 31st century. Fully autonomous, zero-emission, perpetual energy models built to power grid systems indefinitely.
            </p>
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-orbitron">
              <Zap className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
              <span>SUPERCONDUCTING ACTIVE CORE</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:justify-self-center">
            <h4 className="font-orbitron font-semibold text-sm tracking-wider text-blue-600 mb-4">EXPLORE CLEARANCES</h4>
            <ul className="space-y-2.5 text-sm text-black">
              <li><Link to="/about" onClick={() => window.scrollTo(0, 0)} className="hover:text-[#B8860B] transition-colors">Generator Science</Link></li>
              <li><Link to="/products" onClick={() => window.scrollTo(0, 0)} className="hover:text-[#B8860B] transition-colors">Showroom Models</Link></li>
              <li><Link to="/event" onClick={() => window.scrollTo(0, 0)} className="hover:text-[#B8860B] transition-colors">Launch Unveiling</Link></li>
              <li><Link to="/contact" onClick={() => window.scrollTo(0, 0)} className="hover:text-[#B8860B] transition-colors">Communications</Link></li>
            </ul>
          </div>


          {/* Contact Details */}
          <div className="md:justify-self-end max-w-sm">
            <h4 className="font-orbitron font-semibold text-sm tracking-wider text-blue-600 mb-4">COMMUNICATIONS HUB</h4>
            <ul className="space-y-3 text-sm text-black">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <span>Plot No. Q8, Building No. 44/1 & 64, E J Hosalli, Hosalli Sindhanur Hobli, Raichur–Koppal Road, Near Industrial Estate, Sindhanur, Raichur, Karnataka – 584128, india.</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400 shrink-0" />
                <span>+91 9035121902</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400 shrink-0" />
                <span><a href="mailto:Kvvsaielectricals@gmail.com" className="hover:underline hover:text-orange-500 transition-colors">Kvvsaielectricals@gmail.com</a></span>
              </li>
            </ul>
          </div>

        </div>

        {/* Horizontal Divider */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500">
          <p className="mb-4 sm:mb-0">
            &copy; 2026 K V V Sai electricals Generator Industries.
          </p>
          <div className="flex space-x-4">
            <button onClick={handleOpenTerms} className="hover:text-black cursor-pointer bg-transparent border-none p-0 m-0">Terms & Conditions</button>
            <Link to="/about#magnetic-guidelines" className="hover:text-black cursor-pointer">Magnetic Guidelines</Link>
          </div>
        </div>

      </div>

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h2 className="font-bold text-2xl text-black">Terms and Conditions</h2>
              <button onClick={() => setShowTermsModal(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="prose max-w-none text-slate-600">
                {loadingTerms ? (
                  <div className="text-center py-10">
                    <div className="w-10 h-10 border-4 border-t-blue-500 border-r-blue-500/30 border-b-blue-500/10 border-l-blue-500/50 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-slate-500 font-mono tracking-widest uppercase">Loading terms...</p>
                  </div>
                ) : termsParagraphs.length > 0 ? (
                  termsParagraphs.map((paragraph, index) => (
                    <div key={index} className="mb-4">
                      <p className="text-sm leading-relaxed">
                        {paragraph}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-500 py-10">
                    No specific terms have been configured yet.
                  </div>
                )}
              </div>
            </div>

            {/* Modal Bottom Footer */}
            <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex justify-end">
              <button 
                onClick={() => setShowTermsModal(false)}
                className="px-6 py-2.5 bg-[#3b82f6] hover:bg-blue-600 text-white font-orbitron font-bold text-xs tracking-wider rounded transition-colors"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;

