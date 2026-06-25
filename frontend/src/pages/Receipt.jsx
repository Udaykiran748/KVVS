import React from 'react';
import { useLocation, Link, Navigate, useParams } from 'react-router-dom';
import { ShieldCheck, Download, ArrowLeft } from 'lucide-react';
import jsPDF from 'jspdf';

export default function Receipt() {
  const { bookingId } = useParams();
  const location = useLocation();
  const state = location.state;

  if (!state || !state.successBooking) {
    return <Navigate to="/" replace />;
  }

  const { successBooking, selectedProduct, selectedKw, emailAddress } = state;

  const handleDownloadReceipt = (e) => {
    e.preventDefault();
    const doc = new jsPDF();

    doc.setDrawColor(0, 0, 255);
    doc.setLineWidth(1);
    doc.rect(10, 10, 190, 277);
    doc.setLineWidth(1.5);
    // Top-left bracket
    doc.line(10, 20, 10, 10); doc.line(10, 10, 20, 10);
    // Top-right bracket
    doc.line(200, 20, 200, 10); doc.line(200, 10, 190, 10);
    // Bottom-left bracket
    doc.line(10, 277, 10, 287); doc.line(10, 287, 20, 287);
    // Bottom-right bracket
    doc.line(200, 277, 200, 287); doc.line(200, 287, 190, 287);

    // Header Branding
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

    // Banner
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
    doc.text(`Name: ${successBooking.customer_name || 'Guest User'}`, 20, 95);
    doc.text(`Email: ${successBooking.email_address || emailAddress || 'N/A'}`, 20, 102);
    doc.text(`Mobile: ${successBooking.mobile_number || 'N/A'}`, 20, 109);
    const fullAddress = successBooking.delivery_address || (successBooking.city ? `${successBooking.city}, ${successBooking.state} - ${successBooking.pincode}` : '');
    doc.text(`Address: ${fullAddress}`, 20, 116);
    if (successBooking.company_name) {
      doc.text(`Company: ${successBooking.company_name}`, 20, 123);
    }

    // Booking Details
    doc.setTextColor(0, 0, 255);
    doc.setFontSize(11);
    doc.text('BOOKING DETAILS', 110, 85);
    doc.line(110, 88, 190, 88);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Model: ${selectedProduct?.name || 'Generator'}`, 110, 95);
    doc.text(`KW Capacity: ${selectedKw || successBooking.kw_capacity || ''} KW`, 110, 102);
    doc.text(`Booking ID: ${successBooking.booking_id || bookingId}`, 110, 109);
    const bookingStatus = successBooking.status ? successBooking.status.charAt(0).toUpperCase() + successBooking.status.slice(1) : 'Confirmed';
    doc.text(`Status: ${bookingStatus}`, 110, 116);

    // Payment Details
    doc.setTextColor(0, 0, 255);
    doc.setFontSize(11);
    doc.text('PAYMENT & BILLING DETAILS', 20, 140);
    doc.line(20, 143, 190, 143);

    const rawAmount = successBooking.amount || (selectedKw * (selectedProduct?.base_price_per_kw || 6000) * 1.18) || 0;
    const baseAmount = rawAmount / 1.18;
    const cgst = baseAmount * 0.09;
    const sgst = baseAmount * 0.09;

    const formatCurrency = (val) => parseFloat(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const currentDate = new Date();
    const billingPeriod = `${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text(`Description: ${selectedProduct?.name || 'Generator'}`, 20, 150);
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

    doc.text(`Transaction ID: ${successBooking.transaction_id || 'pay_mock_' + Math.random().toString(36).substring(2, 9)}`, 110, 150);
    doc.text(`Payment Method: ${successBooking.payment_method || 'RAZORPAY'}`, 110, 156);
    let paymentStatus = successBooking.payment_status ? successBooking.payment_status.toUpperCase() : 'SUCCESS';
    if (paymentStatus === 'CAPTURED' || paymentStatus === 'CONFIRMED' || paymentStatus === 'COMPLETED') {
      paymentStatus = 'SUCCESS';
    }
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
    link.download = `KVVS_Booking_${successBooking.booking_id || bookingId}_Receipt.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
          <p className="border-b border-slate-900 pb-2 flex justify-between">
            <span className="text-slate-600">Status:</span>
            <span className={`font-bold uppercase tracking-wider ${successBooking.status === 'failed' ? 'text-red-500' : successBooking.status === 'pending' ? 'text-yellow-500' : 'text-green-500'}`}>
              {successBooking.status || 'Confirmed'}
            </span>
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
          <button
            onClick={handleDownloadReceipt}
            className="w-full btn-cyber py-3 rounded text-xs flex items-center justify-center gap-2 font-bold bg-green-500/20 text-green-600 border border-green-500 hover:bg-green-500/30 transition-all"
          >
            <Download className="w-4 h-4" />
            DOWNLOAD RECEIPT
          </button>
          <Link to="/" className="w-full btn-cyber py-3 rounded text-xs flex items-center justify-center gap-2 font-bold hover:bg-slate-100 transition-all">
            <ArrowLeft className="w-4 h-4" />
            RETURN TO HOME
          </Link>
        </div>
      </div>
    </div>
  );
}
