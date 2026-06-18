const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Dispatches an event reservation pass to the customer's email.
 * @param {string} toEmail - Recipient email
 * @param {string} toName - Recipient name
 * @param {Object} passDetails - Pass and booking details
 */
const sendPassEmail = async (toEmail, toName, passDetails) => {

  // Check if SMTP is configured
  const hasSMTP = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

  if (!hasSMTP) {
    console.log('\n--- [EMAIL SERVICE: DEMO LOG] ---');
    console.log(`To: ${toName} <${toEmail}>`);
    console.log(`Subject: [CONFIRMED] Launch Event Pass: ${passDetails.booking_id}`);
    console.log(`Body: Hello ${toName}, your VIP Pass for ${passDetails.event_title} has been generated!`);
    console.log(`Booking ID: ${passDetails.booking_id}`);
    console.log(`Pass Code: ${passDetails.pass_id}`);
    console.log(`Reserved Model: ${passDetails.product_name}`);
    console.log(`Venue: ${passDetails.event_venue}`);
    console.log('---------------------------------\n');
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'Quantum Power Launch'}" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `[CONFIRMED] VIP Entry Pass - Quantum Generator Launch Event (${passDetails.booking_id})`,
      html: `
        <div style="background-color: #020617; color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1e293b;">
          <h2 style="color: #00f2fe; text-align: center; border-bottom: 2px solid #1e293b; padding-bottom: 15px; letter-spacing: 2px;">QUANTUM GENERATOR LAUNCH</h2>
          
          <p style="font-size: 16px; line-height: 1.6;">Hello <strong>${toName}</strong>,</p>
          <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">Your booking fee has been processed, and your VIP entry clearance has been approved! We are excited to welcome you to the fuel-free magnetic energy revolution.</p>
          
          <div style="background-color: #0f172a; padding: 20px; border-radius: 8px; border: 1px solid #3b82f6; margin: 25px 0;">
            <h3 style="color: #60a5fa; margin-top: 0; font-size: 16px; letter-spacing: 1px;">BOARDING MEMORANDUM</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #e2e8f0;">
              <tr>
                <td style="padding: 6px 0; color: #94a3b8; width: 40%;">Booking ID:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #00f2fe;">${passDetails.booking_id}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8;">Pass Code:</td>
                <td style="padding: 6px 0; font-weight: bold;">${passDetails.pass_id}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8;">Reserved Generator:</td>
                <td style="padding: 6px 0;">${passDetails.product_name} Model</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8;">Event Name:</td>
                <td style="padding: 6px 0;">${passDetails.event_title}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8;">Date & Time:</td>
                <td style="padding: 6px 0;">${new Date(passDetails.event_date).toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8;">Venue Gate:</td>
                <td style="padding: 6px 0;">${passDetails.event_venue}</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 14px; color: #94a3b8; line-height: 1.5; text-align: center; margin: 25px 0;">
            <strong>Important:</strong> Your digital event pass with embedded QR verification code can be downloaded from your booking receipt portal. Please present it upon arrival at the gate check-in point.
          </p>

          <div style="border-top: 1px solid #1e293b; padding-top: 20px; text-align: center; color: #475569; font-size: 11px;">
            Quantum Generator Industries &copy; 3026. All rights reserved.<br>
            Zero-Fuel Zero-Emission Zero-Point Magnetic Power Technology.
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Nodemailer: VIP Entry Pass Email sent successfully to ${toEmail}. MessageID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Nodemailer: Email Transmission Failed:', error);
    // Don't crash the server if email fails, log and proceed
    return false;
  }
};

module.exports = {
  sendPassEmail
};
