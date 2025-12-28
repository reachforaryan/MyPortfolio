import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, message } = req.body;

    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'reachforaryan@gmail.com',
            subject: 'Portfolio Contact',
            html: `<p><strong>From:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message}</p>`
        });

        return res.status(200).json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
