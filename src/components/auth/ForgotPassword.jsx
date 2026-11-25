import { useForm } from "react-hook-form";
import { InputField } from "../shared/InputField";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import api from "../../api/api";
import { Logo } from "../shared/Logo";

const MailSentIcon = () => (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
        <polyline points="16 17 19 20 23 16" />
    </svg>
);

const ArrowLeftIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </svg>
);

/* ─────────────────────────────────────────────────────────────────────────── */
export const ForgotPassword = () => {
    const [sent, setSent] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState("");

    const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onTouched" });

    const onSubmit = async ({ email }) => {
        setSubmitting(true);
        try {
            await api.post("/auth/reset-password", { email });
        } catch (_) {
            // intentionally swallow — BE always returns 200 for security
        } finally {
            setSubmittedEmail(email);
            setSent(true);
            setSubmitting(false);
        }
    };

    return (
        <div
            className="min-h-dvh flex items-center justify-center px-4 py-12 bg-slate-50"
            
        >

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="fp-wrap w-full max-w-md"
            >
                <div
                    className="bg-white rounded-lg p-8 border border-slate-900"
                    style={{ boxShadow: "6px 6px 0 0 var(--color-slate-900)" }}
                >
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <Logo />
                    </div>

                    <AnimatePresence mode="wait">

                        {/* ── FORM ──────────────────────────────────────────── */}
                        {!sent && (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.25 }}
                            >
                                {/* Icon */}
                                <div className="flex justify-center mb-5">
                                    <div
                                        className="w-16 h-16 rounded-lg flex items-center justify-center text-blue-500"
                                        style={{ background: "#fdf1ec" }}
                                    >
                                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="text-center mb-6">
                                    <h1 className="text-3xl font-extrabold text-slate-900">Forgot Password?</h1>
                                    <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
                                        Enter your email and we'll send you<br />a link to reset your password.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <InputField
                                        label="Email Address"
                                        id="email"
                                        type="email"
                                        errors={errors}
                                        register={register}
                                        required={true}
                                        message="Email is required"
                                        placeholder="Enter your email address"
                                    />

                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full h-12 rounded-md border border-slate-900 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-bold transition-colors duration-150 mt-2 flex items-center justify-center gap-2"
                                        style={{ boxShadow: "var(--shadow-block-sm)" }}
                                    >
                                        {submitting ? (
                                            <>
                                                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                                </svg>
                                                Sending…
                                            </>
                                        ) : (
                                            "Send Reset Link"
                                        )}
                                    </motion.button>
                                </form>

                                <div className="mt-6 text-center">
                                    <Link
                                        to="/signin"
                                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors duration-150"
                                    >
                                        <ArrowLeftIcon />
                                        Back to Sign In
                                    </Link>
                                </div>
                            </motion.div>
                        )}

                        {/* ── SUCCESS ───────────────────────────────────────── */}
                        {sent && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.35 }}
                                className="flex flex-col items-center text-center gap-5"
                            >
                                <motion.div
                                    initial={{ scale: 0, rotate: -15 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 240, damping: 18, delay: 0.05 }}
                                    className="w-20 h-20 rounded-lg flex items-center justify-center text-blue-500"
                                    style={{ background: "#fdf1ec" }}
                                >
                                    <MailSentIcon />
                                </motion.div>

                                <div>
                                    <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Check Your Inbox</h1>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        We sent a password reset link to<br />
                                        <span className="font-bold text-slate-700">{submittedEmail}</span>
                                    </p>
                                    <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                                        The link will expire in <strong className="text-slate-500">10 minutes</strong>.<br />
                                        Check your spam folder if you don't see it.
                                    </p>
                                </div>

                                {/* Tip box */}
                                <div className="w-full rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-left">
                                    <p className="text-xs font-semibold text-blue-700 mb-1">Didn't receive the email?</p>
                                    <p className="text-xs text-blue-500 leading-relaxed">
                                        Wait a minute then{" "}
                                        <button
                                            onClick={() => setSent(false)}
                                            className="font-bold underline hover:text-blue-700 transition-colors"
                                        >
                                            try again
                                        </button>
                                        {" "}with the same or a different email address.
                                    </p>
                                </div>

                                <Link
                                    to="/signin"
                                    className="w-full h-12 rounded-md border border-slate-900 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold text-center transition-colors duration-150 block"
                                    style={{ boxShadow: "var(--shadow-block-sm)" }}
                                >
                                    Back to Sign In
                                </Link>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

                {/* Footer */}
                {!sent && (
                    <p className="text-center text-xs text-slate-400 mt-5">
                        Remember your password?{" "}
                        <Link to="/signin" className="font-semibold underline hover:text-slate-600 transition-colors">
                            Sign in
                        </Link>
                    </p>
                )}
            </motion.div>
        </div>
    );
};
