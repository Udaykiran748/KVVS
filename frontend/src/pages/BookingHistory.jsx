import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Calendar, MapPin, Download, QrCode, AlertTriangle, ShieldCheck, DollarSign, Zap, Eye } from 'lucide-react';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    // Setting to empty initially.
    setBookings([]);
    setLoading(false);
  }, []);

  const handleDownloadReceipt = (e, book) => {
    e.preventDefault();
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('KVVS GENERATOR BOOKING RECEIPT', 105, 20, null, null, 'center');

    doc.setFontSize(12);
    doc.text(`Booking Reference: ${book.booking_id}`, 20, 40);
    doc.text(`Status: ${book.status.toUpperCase()}`, 20, 50);

    doc.setFontSize(14);
    doc.text('CUSTOMER & EVENT DETAILS', 20, 70);
    doc.setFontSize(12);
    doc.text(`Name/Event: ${book.Event.title}`, 20, 80);
    doc.text(`Date: ${new Date(book.Event.date).toLocaleString()}`, 20, 90);
    doc.text(`Venue: ${book.Event.venue}`, 20, 100);

    doc.setFontSize(14);
    doc.text('GENERATOR SPECIFICATIONS', 20, 120);
    doc.setFontSize(12);
    doc.text(`Generator: ${book.Product.name}`, 20, 130);
    doc.text(`Capacity: ${book.Product.kw_capacity} KW`, 20, 140);
    doc.text(`Base Rate: Rs. ${book.Product.price}/KW`, 20, 150);

    doc.setFontSize(14);
    doc.text('PAYMENT TRANSACTION', 20, 170);
    doc.setFontSize(12);
    doc.text(`Payment Method: ${book.Payment.payment_method}`, 20, 180);
    doc.text(`Total Amount Paid: Rs. ${book.Payment.amount}`, 20, 190);

    doc.setFontSize(14);
    doc.text('Thank you for choosing KVVS!', 105, 220, null, null, 'center');

    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KVVS_Booking_${book.booking_id}_Receipt.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-[#B8860B] border-r-transparent border-slate-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50 pt-28 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-orbitron font-extrabold text-3xl text-black mb-2 tracking-wider">
            BOOKING HISTORY
          </h1>
          <p className="text-sm text-slate-500 font-medium mb-6">
            View all your reservations, generator details, and download passes
          </p>

          <div className="inline-flex items-center gap-8 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="text-center px-4">
              <p className="text-xs text-slate-500 font-orbitron font-bold tracking-wider mb-1">CUSTOMERS BOOKED</p>
              <p className="text-2xl font-bold text-black">100</p>
            </div>
            <div className="w-px h-12 bg-slate-200"></div>
            <div className="text-center px-4">
              <p className="text-xs text-slate-500 font-orbitron font-bold tracking-wider mb-1">BOOKING GENERATOR CAPACITY</p>
              <p className="text-2xl font-bold text-[#B8860B]">350 Bookings</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto overflow-x-auto bg-white rounded-2xl shadow-xl border border-slate-200">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <th className="p-4">Ref ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Generator & KW</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.length > 0 ? (
                bookings.map((book) => (
                  <tr key={book.id} className="hover:bg-slate-50 transition-colors text-xs">
                    <td className="p-3 font-mono font-bold text-slate-800">{book.booking_id}</td>
                    <td className="p-3">
                      <p className="font-bold text-slate-800">{book.Event.title.replace('Rental for ', '')}</p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {book.Event.venue}
                      </p>
                    </td>
                    <td className="p-3">
                      <p className="font-bold text-slate-800">{book.Product.name}</p>
                      <p className="text-[10px] text-slate-500">{book.Product.kw_capacity} KW</p>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-800">
                      ₹{book.Payment.amount}
                    </td>
                    <td className="p-3 font-bold uppercase text-[#3395ff]">
                      {book.Payment.payment_method}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${book.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        book.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                        {book.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setSelectedBooking(book)}
                          className="p-2 bg-white border border-slate-200 rounded-md text-slate-600 hover:border-[#B8860B] hover:text-[#B8860B] transition-all"
                          title="View Booking Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDownloadReceipt(e, book)}
                          className="p-2 rounded-md text-white transition-all bg-slate-900 hover:bg-[#B8860B]"
                          title="Download Receipt"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center">
                    <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="font-orbitron font-bold text-lg text-slate-800 mb-1">No Bookings Found</h3>
                    <p className="text-sm text-slate-500">You haven't made any reservations yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Booking Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBooking(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-2xl z-10"
            >
              <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                <span className="font-orbitron font-extrabold text-base text-slate-800 flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-[#B8860B]" />
                  <span>BOOKING DETAILS</span>
                </span>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-1 rounded-md hover:bg-slate-100 text-slate-500 transition-colors text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Generator Information</h4>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                    <p className="font-bold text-slate-800">{selectedBooking.Product.name}</p>
                    <div className="flex justify-between mt-1.5 text-slate-600">
                      <span>Capacity: <strong className="text-slate-800">{selectedBooking.Product.kw_capacity} KW</strong></span>
                      <span>Rate: <strong className="text-slate-800">₹{selectedBooking.Product.price}/KW</strong></span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Event & Customer</h4>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <p className="font-bold text-slate-800">{selectedBooking.Event.title}</p>
                    <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#B8860B]" /> {new Date(selectedBooking.Event.date).toLocaleString()}</p>
                    <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#B8860B]" /> {selectedBooking.Event.venue}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Payment Transaction</h4>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={`font-bold uppercase ${selectedBooking.status === 'confirmed' ? 'text-green-600' : selectedBooking.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                        {selectedBooking.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Method:</span>
                      <strong className="text-[#3395ff] uppercase">{selectedBooking.Payment.payment_method}</strong>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                      <span className="font-bold">Total Amount Paid:</span>
                      <span className="font-mono font-bold text-base text-slate-800">₹{selectedBooking.Payment.amount}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-[#B8860B] transition-colors shadow-lg"
                >
                  CLOSE DETAILS
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingHistory;
