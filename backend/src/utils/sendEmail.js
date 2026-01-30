/**
 * Email Utility - using Resend
 * 
 * Resend is a modern email API that works well with cloud deployments.
 * Sign up at https://resend.com and get your API key.
 * 
 * Required Environment Variable:
 *   RESEND_API_KEY - Your Resend API key
 *   FROM_EMAIL - Your verified sender email (default: onboarding@resend.dev for testing)
 */

const { Resend } = require('resend');

// Initialize Resend only if API key is present
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const sendEmail = async (options) => {
    // Skip email sending if Resend is not configured
    if (!resend) {
        console.warn('RESEND_API_KEY not set - skipping email:', options.subject);
        return { skipped: true };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: process.env.FROM_EMAIL || 'Mazel Tote <onboarding@resend.dev>',
            to: options.email,
            subject: options.subject,
            html: options.html,
            text: options.message || undefined,
        });

        if (error) {
            console.error('Resend error:', error);
            throw new Error(error.message);
        }

        console.log('Email sent successfully:', data?.id);
        return data;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
};

module.exports = sendEmail;

/* =============================================================================
 * NODEMAILER IMPLEMENTATION (Commented out for reference)
 * Use this if you want to switch back to SMTP (e.g., for local development)
 * =============================================================================
 
const nodemailer = require('nodemailer');

const sendEmailNodemailer = async (options) => {
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

    // Send email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmailNodemailer;

============================================================================= */
