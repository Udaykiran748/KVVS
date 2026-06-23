import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Calendar, MapPin, Download, QrCode, AlertTriangle, ShieldCheck, DollarSign, Zap, Eye, EyeOff, Search } from 'lucide-react';
import { bookingsAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BookingHistory = () => {
  const { user, login } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchUserBookings = async () => {
        setLoading(true);
        try {
          const response = await bookingsAPI.getHistory();
          setBookings(response.data || []);
        } catch (error) {
          console.error('Failed to fetch user bookings', error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserBookings();
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');

    if (isForgotPassword) {
      if (!email) {
        setLoginError('Email is required.');
        return;
      }
      setLoading(true);
      try {
        const res = await authAPI.forgotPassword({ email });
        setLoginSuccess(res.data.message || 'Reset link sent. Check your email.');
        setIsForgotPassword(false);
      } catch (err) {
        setLoginError(err.response?.data?.message || 'Failed to send reset link.');
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    if (!result.success) {
      setLoginError(result.message);
      setLoading(false);
    }
  };

  const handleDownloadReceipt = (e, book) => {
    e.preventDefault();
    const doc = new jsPDF();

    doc.setDrawColor(0, 0, 255);
    doc.setLineWidth(1);
    doc.rect(10, 10, 190, 277);
    doc.setLineWidth(1.5);
    doc.line(10, 20, 10, 10); doc.line(10, 10, 20, 10);
    doc.line(200, 20, 200, 10); doc.line(200, 10, 190, 10);
    doc.line(10, 277, 10, 287); doc.line(10, 287, 20, 287);
    doc.line(200, 277, 200, 287); doc.line(200, 287, 190, 287);

    doc.setTextColor(0, 0, 255);
    doc.setFontSize(22);
    doc.text('KVVSAI ELECTRICALS', 105, 25, null, null, 'center');

    doc.setTextColor(85, 85, 85);
    doc.setFontSize(8);
    doc.text('Company Address: 123 Electronic City, Phase 1, Bangalore - 560100', 105, 32, null, null, 'center');
    doc.text('Contact: +91 9876543210 | Email: support@kvvsaielectricals.com', 105, 36, null, null, 'center');
    doc.text('GST No: 29ABCDE1234F1Z5', 105, 40, null, null, 'center');

    doc.setTextColor(51, 51, 51);
    doc.setFontSize(10);
    doc.text('BOOKING GENERATOR CONFIRMED RECEIPT', 105, 48, null, null, 'center');

    doc.setDrawColor(204, 204, 204);
    doc.setLineWidth(0.5);
    doc.line(15, 52, 195, 52);

    doc.setFillColor(224, 231, 255);
    doc.rect(15, 57, 180, 12, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('OFFICIAL BOOKING RECEIPT', 105, 65, null, null, 'center');

    // User Details
    doc.setTextColor(0, 0, 255);
    doc.setFontSize(11);
    doc.text('USER DETAILS', 20, 85);
    doc.line(20, 88, 100, 88);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Name: ${book.customer_name || 'Guest User'}`, 20, 95);
    doc.text(`Email: ${book.email_address || 'N/A'}`, 20, 102);
    doc.text(`Mobile: ${book.mobile_number || 'N/A'}`, 20, 109);
    const fullAddress = book.delivery_address || (book.city ? `${book.city}, ${book.state} - ${book.pincode}` : '');
    doc.text(`Address: ${fullAddress}`, 20, 116);
    if (book.company_name) {
      doc.text(`Company: ${book.company_name}`, 20, 123);
    }

    // Booking Details
    doc.setTextColor(0, 0, 255);
    doc.setFontSize(11);
    doc.text('BOOKING DETAILS', 110, 85);
    doc.line(110, 88, 190, 88);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Model: ${book.Product?.name || 'Generator'}`, 110, 95);
    doc.text(`KW Capacity: ${book.kw_capacity || book.Product?.kw_capacity || ''} KW`, 110, 102);
    doc.text(`Booking ID: ${book.booking_id}`, 110, 109);
    const bookingStatus = book.status ? book.status.charAt(0).toUpperCase() + book.status.slice(1) : 'Confirmed';
    doc.text(`Status: ${bookingStatus}`, 110, 116);

    // Payment Details
    doc.setTextColor(0, 0, 255);
    doc.setFontSize(11);
    doc.text('PAYMENT & BILLING DETAILS', 20, 140);
    doc.line(20, 143, 190, 143);

    const rawAmount = book.Payment?.amount || 0;
    const baseAmount = rawAmount / 1.18;
    const cgst = baseAmount * 0.09;
    const sgst = baseAmount * 0.09;

    const formatCurrency = (val) => parseFloat(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const currentDate = new Date();
    const billingPeriod = `${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text(`Description: ${book.Product?.name || 'Generator'}`, 20, 150);
    doc.text(`Billing Period: ${billingPeriod}`, 20, 156);

    doc.text('Amount:', 20, 164);
    doc.text(`Rs. ${formatCurrency(baseAmount)}`, 70, 164);
    doc.text('CGST (9%):', 20, 170);
    doc.text(`Rs. ${formatCurrency(cgst)}`, 70, 170);
    doc.text('SGST (9%):', 20, 176);
    doc.text(`Rs. ${formatCurrency(sgst)}`, 70, 176);

    doc.setDrawColor(59, 130, 246);
    doc.line(20, 180, 100, 180);
    doc.text('Total Amount Paid:', 20, 186);
    doc.text(`Rs. ${formatCurrency(rawAmount)}`, 70, 186);
    doc.line(20, 190, 100, 190);

    doc.text(`Transaction ID: ${book.Payment?.transaction_id || 'pay_mock_' + Math.random().toString(36).substring(2, 9)}`, 110, 150);
    doc.text(`Payment Method: ${book.Payment?.payment_method || 'RAZORPAY'}`, 110, 156);
    const paymentStatus = book.Payment?.status ? book.Payment.status.toUpperCase() : 'COMPLETED';
    doc.text(`Payment Status: ${paymentStatus}`, 110, 162);

    // Generator Details
    doc.setTextColor(0, 0, 255);
    doc.setFontSize(11);
    doc.text('GENERATOR WORKING DETAILS', 20, 205);
    doc.setDrawColor(204, 204, 204);
    doc.line(20, 208, 190, 208);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text('• Technology: 100% fuel-free magnetic power generation principle.', 20, 215);
    doc.text('• Operation: Utilizes advanced neodymium magnetic arrays for continuous output.', 20, 221);
    doc.text('• Benefits: Zero emissions, silent operation, and no recurring fuel costs.', 20, 227);
    doc.text('• Maintenance: Minimal upkeep required. Follow setup instructions upon delivery.', 20, 233);

    // Signature
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`;
    doc.setDrawColor(59, 130, 246);
    doc.rect(125, 238, 65, 20, 'S');

    doc.setTextColor(0, 0, 255);
    doc.setFontSize(8);
    doc.text('DIGITALLY SIGNED', 157.5, 243, null, null, 'center');
    doc.setTextColor(0, 0, 0);
    doc.text('KVVSAI ELECTRICALS', 157.5, 248, null, null, 'center');
    doc.setTextColor(85, 85, 85);
    doc.text(formattedDate, 157.5, 253, null, null, 'center');

    doc.setTextColor(51, 51, 51);
    doc.setFontSize(9);
    doc.text('Authorized Signatory', 157.5, 263, null, null, 'center');

    // Footer
    doc.setDrawColor(204, 204, 204);
    doc.line(20, 270, 190, 270);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text('This is a computer-generated receipt and does not require a physical signature.', 105, 275, null, null, 'center');
    doc.text('Thank you for your business!', 105, 280, null, null, 'center');

    doc.setTextColor(85, 85, 85);
    doc.setFontSize(7);
    doc.text(`KVVSAI ELECTRICALS © ${currentDate.getFullYear()}. All Rights Reserved.`, 105, 290, null, null, 'center');

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
            View all your reservations, generator details, and download it
          </p>



          {!user && (
            <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded-2xl shadow-xl border border-slate-200 text-left">
              <h2 className="text-xl font-bold text-center mb-4 text-slate-800">
                {isForgotPassword ? 'Reset Password' : 'Login to View Your Bookings'}
              </h2>
              {loginError && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">{loginError}</div>}
              {loginSuccess && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm text-center">{loginSuccess}</div>}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-[#B8860B] focus:border-[#B8860B] text-sm"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                {!isForgotPassword && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-[#B8860B] focus:border-[#B8860B] text-sm"
                        placeholder="Enter your password"
                        required={!isForgotPassword}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                )}
                {/* Removed inline confirm password fields */}

                {!isForgotPassword && (
                  <div className="flex justify-end mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setLoginError('');
                        setLoginSuccess('');
                      }}
                      className="text-xs text-[#B8860B] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-[#B8860B] transition-colors shadow-md disabled:opacity-70"
                >
                  {loading ? (isForgotPassword ? 'Sending...' : 'Verifying...') : (isForgotPassword ? 'Send Reset Link' : 'View History')}
                </button>

                {isForgotPassword && (
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(false)}
                    className="w-full py-3 mt-3 rounded text-sm flex items-center justify-center font-bold text-slate-500 hover:text-black border border-slate-300 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>
          )}
        </div>

        {user && (
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
                        <p className="font-bold text-slate-800">{book.customer_name || 'Guest User'}</p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                          {book.email_address}
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
                        RAZORPAY
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
        )}
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
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">User Details</h4>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <p className="font-bold text-slate-800">{selectedBooking.customer_name || 'Guest User'}</p>
                    <p>Email: <span className="font-medium text-slate-800">{selectedBooking.email_address}</span></p>
                    <p>Mobile: <span className="font-medium text-slate-800">{selectedBooking.mobile_number}</span></p>
                    {(selectedBooking.delivery_address || selectedBooking.city) && (
                      <p className="flex items-start gap-1.5 mt-1 pt-1 border-t border-slate-200">
                        <MapPin className="w-3.5 h-3.5 text-[#B8860B] mt-0.5 shrink-0" />
                        <span>{selectedBooking.delivery_address} {selectedBooking.city ? `, ${selectedBooking.city}` : ''} {selectedBooking.state ? `, ${selectedBooking.state}` : ''} {selectedBooking.pincode}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Generator Details</h4>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                    <p className="font-bold text-slate-800">{selectedBooking.Product.name}</p>
                    <div className="flex justify-between mt-1.5 text-slate-600">
                      <span>Capacity: <strong className="text-slate-800">{selectedBooking.Product.kw_capacity} KW</strong></span>
                      <span>Rate: <strong className="text-slate-800">₹{selectedBooking.Product.price}/KW</strong></span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Payment Details</h4>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={`font-bold uppercase ${selectedBooking.status === 'confirmed' ? 'text-green-600' : selectedBooking.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                        {selectedBooking.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Method:</span>
                      <strong className="text-[#3395ff] uppercase">RAZORPAY</strong>
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
