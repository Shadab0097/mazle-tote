/**
 * Email Utility - using Nodemailer
 * 
 * Uses SMTP configuration from environment variables.
 */

const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    // Define email options
    const mailOptions = {
        from: `"${process.env.FROM_NAME || 'Mazel Tote'}" <${process.env.SMTP_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html, // HTML body
        text: options.message, // Fallback plain text
    };

    try {
        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
};

module.exports = sendEmail;
