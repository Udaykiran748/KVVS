import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, ShieldAlert } from 'lucide-react';
import { eventAPI } from '../services/api';

const Terms = () => {
  const [termsParagraphs] = useState([
    "By accessing and using this website, you agree to comply with and be bound by these Terms and Conditions. The website is intended to provide information about our products, services, events, and booking facilities. Users must ensure that all information provided during registration, booking, or payment is accurate, complete, and up to date. Any misuse of the website may result in the suspension or termination of access.",
    "All bookings made through the website are subject to availability and confirmation. Users are responsible for reviewing the details of their booking before completing the payment process. Once a booking is confirmed, changes or cancellations may be subject to company policies. The company reserves the right to refuse or cancel any booking if inaccurate information, fraudulent activity, or policy violations are detected.",
    "Payments made through the website must be completed using approved payment methods. All transactions are processed through secure payment gateways to protect customer information. The company is not responsible for delays, technical failures, or interruptions caused by third-party payment service providers. Users are advised to retain payment receipts and booking confirmations for future reference.",
    "All content available on this website, including text, images, logos, designs, videos, and software, is the property of the company and is protected by applicable intellectual property laws. Users may not copy, reproduce, distribute, modify, or use any content from the website without prior written permission from the company. Unauthorized use of website content may result in legal action.",
    "The company reserves the right to modify, update, or discontinue any part of the website, products, services, or these Terms and Conditions at any time without prior notice. While reasonable efforts are made to ensure the accuracy of information provided on the website, the company does not guarantee that all content will always be error-free or uninterrupted. Continued use of the website after any changes indicates acceptance of the revised Terms and Conditions."
  ]);
  const [loading, setLoading] = useState(false);
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
