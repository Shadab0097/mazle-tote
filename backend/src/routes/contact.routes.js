const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// @desc    Send contact form message
// @route   POST /api/contact
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Email content for admin
        const adminMailOptions = {
            from: `"Mazel Tote Contact" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
            subject: `New Contact Form: ${subject}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #7EB4C9 0%, #A8D4E6 100%); padding: 20px; text-align: center;">
            <h1 style="color: #3D4A5C; margin: 0;">New Contact Message</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h3 style="color: #3D4A5C;">Contact Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
            <h3 style="color: #3D4A5C;">Message:</h3>
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          <div style="background: #3D4A5C; padding: 15px; text-align: center;">
            <p style="color: #7EB4C9; margin: 0; font-size: 14px;">Mazel Tote - Carrying Hope</p>
          </div>
        </div>
      `,
        };

        // Auto-reply to user
        const userMailOptions = {
            from: `"Mazel Tote" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Thank you for contacting Mazel Tote',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #7EB4C9 0%, #A8D4E6 100%); padding: 20px; text-align: center;">
            <h1 style="color: #3D4A5C; margin: 0;">Thank You, ${name}!</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <p>We have received your message and will get back to you as soon as possible.</p>
            <p><strong>Your Message:</strong></p>
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            <p style="margin-top: 20px;">Best regards,<br><strong>The Mazel Tote Team</strong></p>
          </div>
          <div style="background: #3D4A5C; padding: 15px; text-align: center;">
            <p style="color: #7EB4C9; margin: 0; font-size: 14px;">Carrying hope, one bag at a time</p>
          </div>
        </div>
      `,
        };

        // Send emails
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(userMailOptions);

        res.status(200).json({ message: 'Message sent successfully! We will get back to you soon.' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ message: 'Failed to send message. Please try again later.' });
    }
});

module.exports = router;
