const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import the Resend library
const { Resend } = require('resend');

// Create an Express application
const app = express();
const port = 3000;

// Initialize Resend with your API key.
// You can get this from your Resend dashboard.
const resend = new Resend('re_WxzKkAY8_A82UnM6EwcPQziS6yMxpKY9z');

// Middleware to parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use(cors());

// Define the route for handling form submissions
app.post('/send-message', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Check if all fields are present
    if (!name || !email || !subject || !message) {
        return res.status(400).send('All form fields are required.');
    }

    try {
        // Send the email using the Resend API
        const { data, error } = await resend.emails.send({
            from: 'Contact Form <onboarding@resend.dev>', // Must be a verified domain/email
            to: ['katyperry7890@proton.me'], // Replace with the recipient's email address
            subject: `New message from Contact Form: ${subject}`,
            html: `
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `,
        });

        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending email.');
        }

        console.log('Message sent successfully!', data);
        res.status(200).send('Message sent successfully!');

    } catch (error) {
        console.error('Error in Resend API call:', error);
        res.status(500).send('Error sending email.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
