import React from 'react';
import { Cpu, Zap, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
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
              <li><Link to="/about" className="hover:text-[#B8860B] transition-colors">Generator Science</Link></li>
              <li><Link to="/products" className="hover:text-[#B8860B] transition-colors">Showroom Models</Link></li>
              <li><Link to="/event" className="hover:text-[#B8860B] transition-colors">Launch Unveiling</Link></li>
              <li><Link to="/contact" className="hover:text-[#B8860B] transition-colors">Communications</Link></li>
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
            &copy; 2026 K V V Sai electricals Generator Industries. Perpetual licensing active.
          </p>
          <div className="flex space-x-4">
            <Link to="/terms" className="hover:text-black cursor-pointer">Terms & Conditions</Link>
            <span className="hover:text-black cursor-pointer">Data Clearance</span>
            <Link to="/about#magnetic-guidelines" className="hover:text-black cursor-pointer">Magnetic Guidelines</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

