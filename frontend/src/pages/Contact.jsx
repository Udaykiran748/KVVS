import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Phone, Mail, Globe, Sparkles } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'VIP Clearance Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate transmission loop
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: 'VIP Clearance Inquiry', message: '' });
    }, 1500);
  };

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
            <span>COMMUNICATIONS GATES OPEN</span>
          </motion.div>

          <h1 className="font-orbitron font-extrabold text-3xl sm:text-5xl text-black mb-4 tracking-wider leading-tight">
            COMMUNICATION HUB
          </h1>

          <p className="text-black text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Transmit structural inquiries, press clearances, or VIP pre-booking assistance directly to the engineers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* Left Column: Direct Communication Channels */}
          <div className="lg:col-span-2 space-y-6">

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

          {/* Right Column: Sleek Message Transmission Form */}
          <div className="lg:col-span-3">

            <div className="glass-panel border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
              <h3 className="font-orbitron font-extrabold text-lg text-black tracking-wide mb-6">TRANSMIT PACKET MESSAGE</h3>

              {submitted ? (
                <div className="border border-green-500/40 rounded-xl p-6 bg-green-500/5 text-center text-xs sm:text-sm shadow-xl">
                  <h4 className="font-orbitron font-extrabold text-green-400 text-lg mb-2">TRANSMISSION COMPLETED</h4>
                  <p className="text-black leading-relaxed">
                    Your communications packet has been encrypted and routed to our central gate servers. System engineers will respond on your coordinates shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 font-orbitron font-bold text-xs text-blue-600 border-b border-blue-600 hover:text-black hover:border-white transition-all focus:outline-none"
                  >
                    TRANSMIT NEW PACKET
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-orbitron text-xs text-black block mb-2">ATTENDEE NAME</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-100 border border-slate-800 rounded-lg text-black placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="font-orbitron text-xs text-black block mb-2">COORDINATE EMAIL</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-100 border border-slate-800 rounded-lg text-black placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-orbitron text-xs text-black block mb-2">PACKET SUBJECT</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-800 rounded-lg text-black focus:outline-none focus:border-blue-500/60 transition-colors cursor-pointer"
                    >
                      <option value="VIP Clearance Inquiry">VIP Entry Clearance Booking</option>
                      <option value="Generator Technical Blueprint">Generator Structural Specs</option>
                      <option value="Press / Media Access">Press / Media Accreditation</option>
                      <option value="General Network Communications">General System Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-orbitron text-xs text-black block mb-2">MESSAGE PACKET</label>
                    <textarea
                      required
                      rows="5"
                      placeholder="Type details of your communication packet..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-800 rounded-lg text-black placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-colors resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-cyber py-3.5 rounded text-xs flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-t-slate-900 border-r-transparent border-slate-700 rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>TRANSMIT PACKET</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;

