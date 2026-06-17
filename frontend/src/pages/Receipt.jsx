import React from 'react';
import { useLocation, Link, Navigate, useParams } from 'react-router-dom';
import { ShieldCheck, Download, ArrowLeft } from 'lucide-react';

export default function Receipt() {
  const { bookingId } = useParams();
  const location = useLocation();
  const state = location.state;

  if (!state || !state.successBooking) {
    return <Navigate to="/" replace />;
  }

  const { successBooking, selectedProduct, selectedKw, emailAddress } = state;

  return (
    <div className="relative min-h-screen bg-white flex items-center justify-center pt-24 px-4 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>

      <div className="w-full max-w-xl glass-panel border border-green-500/30 bg-green-500/5 rounded-2xl p-6 sm:p-10 text-center shadow-2xl relative z-10">
        <div className="w-16 h-16 rounded-full bg-slate-100 border border-green-400 shrink-0 flex items-center justify-center mx-auto mb-6 glow-shadow-blue">
          <ShieldCheck className="w-8 h-8 text-green-400" />
        </div>

        <h2 className="font-orbitron font-extrabold text-2xl text-green-400 uppercase tracking-widest mb-2">
          BOOKING CONFIRMED
        </h2>
        <p className="text-[10px] text-slate-500 font-orbitron tracking-widest uppercase mb-6">Generator Reserved Successfully</p>

        <div className="bg-slate-50/80 border border-slate-850 p-6 rounded-xl text-xs sm:text-sm text-left space-y-4 mb-8">
          <p className="border-b border-slate-900 pb-2 flex justify-between">
            <span className="text-slate-600">Booking ID:</span>
            <span className="text-[#3b82f6] font-bold font-orbitron">{successBooking.booking_id || bookingId}</span>
          </p>
          {selectedProduct && (
            <p className="border-b border-slate-900 pb-2 flex justify-between">
              <span className="text-slate-600">Reserved Generator:</span>
              <span className="text-black">{selectedProduct.name} ({selectedKw} KW)</span>
            </p>
          )}
          {emailAddress && (
            <p className="flex justify-between">
              <span className="text-slate-600">Email Dispatch:</span>
              <span className="text-black">{emailAddress}</span>
            </p>
          )}
        </div>

        <p className="text-xs text-black leading-relaxed mb-8">
          Your generator booking has been confirmed and the invoice has been emailed to you. Our team will contact you shortly regarding delivery and setup.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          {successBooking.pass?.pdf_url ? (
            <a
              href={successBooking.pass.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="w-full btn-cyber py-3 rounded text-xs flex items-center justify-center gap-2 font-bold bg-green-500/20 text-green-600 border border-green-500 hover:bg-green-500/30 transition-all"
            >
              <Download className="w-4 h-4" />
              DOWNLOAD RECEIPT
            </a>
          ) : null}
          <Link to="/" className="w-full btn-cyber py-3 rounded text-xs flex items-center justify-center gap-2 font-bold hover:bg-slate-100 transition-all">
            <ArrowLeft className="w-4 h-4" />
            RETURN TO HOME
          </Link>
        </div>
      </div>
    </div>
  );
}
