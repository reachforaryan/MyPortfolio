import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the server directory, regardless of where node is run from
dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
    console.error("CRITICAL ERROR: RESEND_API_KEY is missing from .env file!");
    console.error("Looking for .env at:", join(__dirname, '.env'));
    process.exit(1);
}

const resend = new Resend(apiKey);

app.post('/api/contact', async (req, res) => {
    const { email, message } = req.body;

    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'reachforaryan@gmail.com',
            subject: 'Portfolio Contact',
            html: `<p><strong>From:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message}</p>`
        });

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
