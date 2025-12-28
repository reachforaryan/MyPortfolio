export const sendEmail = async (email: string, message: string) => {
    try {
        // Relative path works for both:
        // - Local: via Vite proxy -> localhost:3001
        // - Prod: via Vercel -> api/contact.js
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, message }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to send message');
        }

        return data;
    } catch (error) {
        throw error;
    }
};
