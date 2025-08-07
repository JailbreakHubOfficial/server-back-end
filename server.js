const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors({
  origin: 'https://server-back-end.vercel.app/' // This should match your frontend URL
}));

// This middleware is what makes the server compatible with your frontend code.
// It parses application/x-www-form-urlencoded data from the request body.
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// IMPORTANT: Do NOT hardcode your API key here.
// The Vercel deployment will use the RESEND_API_KEY environment variable.
const resend = new Resend(process.env.RESEND_API_KEY);

app.post('/send-message', async (req, res) => {
    // The data sent from the form is now available in req.body
    const { name, email, subject, message } = req.body;

    // Check that all required fields are present
    if (!name || !email || !subject || !message) {
        return res.status(400).send('All fields are required.');
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Your Name <onboarding@resend.dev>', // Replace with your Resend-configured domain
            to: ['your-email@example.com'], // Replace with the email address you want to receive messages
            subject: `New message from Contact Form: ${subject}`,
            html: `<p><strong>Name:</strong> ${name}</p>
                   <p><strong>Email:</strong> ${email}</p>
                   <p><strong>Subject:</strong> ${subject}</p>
                   <p><strong>Message:</strong> ${message}</p>`,
        });

        if (error) {
            console.error(error);
            return res.status(500).send(error.message);
        }

        res.status(200).send('Message sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('An unexpected error occurred.');
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
