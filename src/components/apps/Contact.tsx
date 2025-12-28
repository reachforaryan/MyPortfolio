import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { sendEmail } from '@/services/email';

export const Contact: React.FC = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [feedback, setFeedback] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !message) return;

        setStatus('loading');
        setFeedback("");

        try {
            await sendEmail(email, message);
            setStatus('success');
            setFeedback("Transmission successful. Connection established.");
            setEmail("");
            setMessage("");
        } catch (error) {
            setStatus('error');
            setFeedback("Transmission failed. Signal lost.");
        }
    };

    return (
        <div className="h-full p-6 flex flex-col items-center justify-center text-vapor-blue overflow-y-auto custom-scrollbar">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-sm"
            >
                <div className="text-center mb-6">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-vapor-pink to-vapor-purple shadow-[0_0_20px_rgba(244,184,228,0.3)] mb-4"
                    >
                        <Mail className="text-black" size={24} />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-vapor-blue">Get in Touch</h2>
                    <p className="text-xs text-gray-400 mt-2">Send a holographic transmission</p>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-vapor-pink uppercase tracking-wider ml-1">Email Signal</label>
                        <div className="relative group">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="neo@matrix.com"
                                required
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-vapor-blue focus:shadow-[0_0_10px_rgba(137,220,235,0.2)] transition-all placeholder:text-gray-600 text-sm"
                            />
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-vapor-blue/20 to-vapor-pink/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-vapor-mint uppercase tracking-wider ml-1">Message Data</label>
                        <div className="relative group">
                            <textarea
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Transmission content..."
                                required
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-vapor-mint focus:shadow-[0_0_10px_rgba(129,236,157,0.2)] transition-all placeholder:text-gray-600 text-sm resize-none"
                            />
                        </div>
                    </div>

                    <motion.button
                        disabled={status === 'loading'}
                        whileHover={status === 'loading' ? {} : { scale: 1.02, boxShadow: "0 0 20px rgba(137,220,235,0.4)" }}
                        whileTap={status === 'loading' ? {} : { scale: 0.95 }}
                        className={`mt-2 w-full font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 group relative overflow-hidden transition-all ${status === 'loading' ? 'bg-gray-700 cursor-wait text-gray-400' : 'bg-gradient-to-r from-vapor-blue to-vapor-purple text-black'
                            }`}
                    >
                        {status === 'loading' ? (
                            <>Sending <Loader2 size={16} className="animate-spin" /></>
                        ) : (
                            <>
                                <span className="relative z-10 flex items-center gap-2">
                                    Send Transmission <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </>
                        )}
                    </motion.button>

                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-center justify-center gap-2 text-xs font-bold p-2 rounded border ${status === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                                }`}
                        >
                            {status === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                            {feedback}
                        </motion.div>
                    )}
                </form>
            </motion.div>
        </div>
    );
};
