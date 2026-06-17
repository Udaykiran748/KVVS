const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generates a downloadable PDF booking confirmation receipt.
 * @param {Object} data
 * @returns {Promise<string>} The relative public filepath of the generated PDF
 */
const generatePassPDF = (data) => {
   return new Promise((resolve, reject) => {
      try {
         const { user, product, bookingGenerator, payment, booking_id, pass_id, qr_code_url } = data;

         // Ensure directory exists
         const passesDir = path.join(__dirname, '../../public/passes');
         if (!fs.existsSync(passesDir)) {
            fs.mkdirSync(passesDir, { recursive: true });
         }

         const fileName = `receipt_${pass_id}.pdf`;
         const filePath = path.join(passesDir, fileName);
         const doc = new PDFDocument({ size: 'A4', margin: 40 });
         const writeStream = fs.createWriteStream(filePath);

         doc.pipe(writeStream);

         // --- Background & Borders ---
         // Background White
         doc.rect(0, 0, 595.28, 841.89).fill('#ffffff');

         // Outer Frame
         doc.rect(30, 30, 535.28, 781.89)
            .lineWidth(2)
            .stroke('#0000ff'); // Blue

         // Double structural inner lines
         doc.rect(35, 35, 525.28, 771.89)
            .lineWidth(0.5)
            .stroke('#3b82f6'); // Electric Blue

         // Top corner brackets (Visual accents)
         doc.moveTo(30, 70).lineTo(30, 30).lineTo(70, 30).lineWidth(4).stroke('#0000ff');
         doc.moveTo(565.28, 70).lineTo(565.28, 30).lineTo(525.28, 30).lineWidth(4).stroke('#0000ff');
         doc.moveTo(30, 771.89).lineTo(30, 811.89).lineTo(70, 811.89).lineWidth(4).stroke('#0000ff');
         doc.moveTo(565.28, 771.89).lineTo(565.28, 811.89).lineTo(525.28, 811.89).lineWidth(4).stroke('#0000ff');

         // --- Header Branding ---
         doc.fillColor('#0000ff') // Blue
            .fontSize(22)
            .text('KVVSAI ELECTRONIC', 50, 42, { align: 'center', characterSpacing: 2 });

         doc.fillColor('#555555')
            .fontSize(8)
            .text('Company Address: 123 Electronic City, Phase 1, Bangalore - 560100', 50, 62, { align: 'center' });
         doc.text('Contact: +91 9876543210 | Email: support@kvvsaielectronic.com', 50, 74, { align: 'center' });
         doc.text('GST No: 29ABCDE1234F1Z5', 50, 86, { align: 'center' });

         doc.fillColor('#333333')
            .fontSize(10)
            .text('BOOKING GENERATOR CONFIRMED RECEIPT', 50, 105, { align: 'center', characterSpacing: 1 });

         // Horizontal separator line
         doc.moveTo(50, 120).lineTo(545.28, 120).lineWidth(1).stroke('#cccccc');

         // --- Receipt Banner ---
         doc.rect(50, 130, 495.28, 35).fill('#e0e7ff'); // Light blue banner
         doc.fillColor('#000000') // Black
            .fontSize(14)
            .text('OFFICIAL BOOKING RECEIPT', 50, 142, { align: 'center', characterSpacing: 1.5 });

         // --- User Details ---
         doc.fillColor('#0000ff').fontSize(12).text('USER DETAILS', 60, 195);
         doc.moveTo(60, 210).lineTo(280, 210).lineWidth(1).stroke('#cccccc');

         doc.fillColor('#000000').fontSize(11).text(`Name: ${bookingGenerator?.customer_name || user?.name || 'N/A'}`, 60, 225);
         doc.text(`Email: ${bookingGenerator?.email_address || user?.email || 'N/A'}`, 60, 245);
         doc.text(`Mobile: ${bookingGenerator?.mobile_number || user?.mobile || 'N/A'}`, 60, 265);
         doc.text(`Address: ${bookingGenerator?.city ? `${bookingGenerator.city}, ${bookingGenerator.state} - ${bookingGenerator.pincode}` : (user?.address || 'N/A')}`, 60, 285);
         if (bookingGenerator?.company_name) {
            doc.text(`Company: ${bookingGenerator.company_name}`, 60, 305);
         }

         // --- Booking Generator Details ---
         doc.fillColor('#0000ff').fontSize(12).text('BOOKING DETAILS', 315, 195);
         doc.moveTo(315, 210).lineTo(535, 210).lineWidth(1).stroke('#cccccc');

         doc.fillColor('#000000').fontSize(11).text(`Model: ${product?.name || 'N/A'}`, 315, 225, { width: 220 });
         doc.text(`KW Capacity: ${bookingGenerator?.kw_capacity || product?.kw_capacity || 'N/A'} KW`, 315, doc.y + 5);
         doc.text(`Booking ID: ${booking_id}`, 315, doc.y + 5);
         doc.text(`Status: Confirmed`, 315, doc.y + 5);

         // --- Payment Details ---
         doc.fillColor('#0000ff').fontSize(12).text('PAYMENT & BILLING DETAILS', 60, 345);
         doc.moveTo(60, 360).lineTo(535, 360).lineWidth(1).stroke('#cccccc');

         const rawAmount = payment ? parseFloat(payment.amount) : (product ? parseFloat(product.price) : 0);
         const baseAmount = (rawAmount / 1.18);
         const cgstAmount = (baseAmount * 0.09);
         const sgstAmount = (baseAmount * 0.09);

         const formatCurrency = (val) => parseFloat(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

         const currentDateForBilling = new Date();
         const billingPeriod = `${currentDateForBilling.getMonth() + 1}/${currentDateForBilling.getFullYear()}`;

         const productName = product?.name || 'Generator';
         const displayDesc = productName.length > 32 ? productName.substring(0, 32) + '...' : productName;

         doc.fillColor('#000000').fontSize(10)
            .text(`Description: ${displayDesc}`, 60, 375)
            .text(`Billing Period: ${billingPeriod}`, 60, 390);

         // Amounts - labels aligned left, Rs. values vertically aligned at x=200
         doc.text(`Amount:`, 60, 405)
            .text(`Rs. ${formatCurrency(baseAmount)}`, 200, 405)
            .text(`CGST (9%):`, 60, 420)
            .text(`Rs. ${formatCurrency(cgstAmount)}`, 200, 420)
            .text(`SGST (9%):`, 60, 435)
            .text(`Rs. ${formatCurrency(sgstAmount)}`, 200, 435);

         // Total Amount Paid with Blue lines
         doc.moveTo(60, 450).lineTo(300, 450).lineWidth(1).stroke('#3b82f6');
         doc.fillColor('#000000')
            .text(`Total Amount Paid:`, 60, 458)
            .text(`Rs. ${formatCurrency(rawAmount)}`, 200, 458);
         doc.moveTo(60, 475).lineTo(300, 475).lineWidth(1).stroke('#3b82f6');

         // Right Side Details - moved further right to x=330 to avoid cutoff
         doc.text(`Transaction ID: ${payment?.transaction_id || 'N/A'}`, 330, 375);
         doc.text(`Payment Method: ${bookingGenerator?.payment_method || 'Online'}`, 330, 390);

         // --- Generator Working Details ---
         doc.fillColor('#0000ff').fontSize(12).text('GENERATOR WORKING DETAILS', 60, 495);
         doc.moveTo(60, 510).lineTo(535, 510).lineWidth(1).stroke('#cccccc');

         doc.fillColor('#000000').fontSize(10)
            .text('• Technology: 100% fuel-free magnetic power generation principle.', 60, 520)
            .text('• Operation: Utilizes advanced neodymium magnetic arrays for continuous output.', 60, 540)
            .text('• Benefits: Zero emissions, silent operation, and no recurring fuel costs.', 60, 560)
            .text('• Maintenance: Minimal upkeep required. Follow setup instructions upon delivery.', 60, 580);

         // --- No QR Code for receipt ---

         // --- Digital Signature ---
         const currentDate = new Date();
         const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`;

         // Draw border
         doc.rect(345, 595, 190, 55).lineWidth(1).stroke('#3b82f6');

         doc.fillColor('#0000ff')
            .fontSize(10)
            .text('DIGITALLY SIGNED', 350, 605, { align: 'center', width: 180 });
         doc.fillColor('#000000')
            .fontSize(10)
            .text('KVVSAI ELECTRONIC', 350, 620, { align: 'center', width: 180 });
         doc.fillColor('#555555')
            .fontSize(9)
            .text(formattedDate, 350, 635, { align: 'center', width: 180 });

         doc.fillColor('#333333')
            .font('Helvetica-Bold')
            .fontSize(10)
            .text('Authorized Signatory', 350, 658, { align: 'center', width: 180 })
            .font('Helvetica'); // Reset font back to default for the rest of the document

         // --- Footer ---
         doc.moveTo(50, 680).lineTo(545.28, 680).lineWidth(1).stroke('#cccccc');

         doc.fillColor('#000000') // Black
            .fontSize(9)
            .text('This is a computer-generated receipt and does not require a physical signature.', 50, 695, {
               align: 'center',
               width: 495
            });

         doc.fillColor('#000000') // Black
            .fontSize(10)
            .text('Thank you for your business!', 50, 715, {
               align: 'center',
               width: 495
            });

         doc.fillColor('#555555')
            .fontSize(8)
            .text(`KVVSAI ELECTRONIC © ${new Date().getFullYear()}. All Rights Reserved.`, 50, 755, { align: 'center' });

         // End document
         doc.end();

         writeStream.on('finish', () => {
            resolve(`/passes/${fileName}`);
         });

         writeStream.on('error', (err) => {
            reject(err);
         });
      } catch (error) {
         reject(error);
      }
   });
};

module.exports = {
   generatePassPDF
};
