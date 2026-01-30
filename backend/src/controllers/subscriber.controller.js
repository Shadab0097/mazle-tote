const Subscriber = require('../models/Subscriber');
const nodemailer = require('nodemailer');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Subscribe a new user
exports.subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check if already subscribed
        const existingSubscriber = await Subscriber.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({ message: 'This email is already subscribed' });
        }

        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();

        // Send email to Admin
        const adminMailOptions = {
            from: process.env.SMTP_USER,
            to: process.env.ADMIN_EMAIL || process.env.SMTP_USER, // Sending to admin
            subject: 'New Newsletter Subscriber! 🎉',
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2C2C2C;">New Subscriber Alert!</h2>
          <p>A new user has subscribed to the Mazel Tote newsletter.</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <br/>
          <p style="color: #8ABEE8; font-weight: bold;">Mazel Tote Notification System</p>
        </div>
      `
        };

        // Send welcome email to User (Optional but good practice)
        const userMailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Welcome to Mazel Tote! 💙',
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; text-align: center;">
          <h1 style="color: #2C2C2C;">Welcome to the Family!</h1>
          <p>Thank you for subscribing to our newsletter. We're honored to have you with us.</p>
          <p>You'll be the first to know about our latest product launches, news, and charity events.</p>
          <br/>
          <p style="font-style: italic;">"Carrying Hope"</p>
        </div>
      `
        };

        // Send emails
        await transporter.sendMail(adminMailOptions);
        try {
            await transporter.sendMail(userMailOptions);
        } catch (err) {
            console.error("Failed to send welcome email to user:", err);
            // Don't fail the request if user email fails, as admin notification is priority per user request
        }

        res.status(201).json({ message: 'Successfully subscribed!' });

    } catch (error) {
        console.error('Subscription Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all subscribers (Admin only)
exports.getAllSubscribers = async (req, res) => {
    try {
        const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
        res.status(200).json(subscribers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Send bulk email to all subscribers (Admin only)
exports.sendBulkEmail = async (req, res) => {
    try {
        const { subject, message } = req.body;

        if (!subject || !message) {
            return res.status(400).json({ message: 'Subject and message are required' });
        }

        const subscribers = await Subscriber.find({ isActive: true });

        if (subscribers.length === 0) {
            return res.status(404).json({ message: 'No active subscribers found.' });
        }

        const emailList = subscribers.map(sub => sub.email);

        // Send in chunks or loop (BCC is strictly better for privacy but limits apply)
        // For simplicity in this implementation we will use BCC to all.
        // Note: Most SMTP services have limits on BCC. For production efficiently use a service like SendGrid/CES.

        const mailOptions = {
            from: process.env.SMTP_USER,
            bcc: emailList, // Blind Carbon Copy to hide emails from each other
            subject: subject,
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          ${message}
          <br/><br/>
          <hr/>
          <p style="font-size: 12px; color: #999;">You received this email because you subscribed to Mazel Tote.</p>
        </div>
      `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: `Email sent to ${subscribers.length} subscribers!` });

    } catch (error) {
        console.error('Bulk Email Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
