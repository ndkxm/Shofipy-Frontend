import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { InputField } from "../shared/InputField";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/api";
import { Logo } from "../shared/Logo";

const ShieldCheckIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
    </svg>
);

const AlertIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const SpinnerIcon = () => (
    <svg
        className="animate-spin"
        width="36" height="36" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
    >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

/* ─── Status States ───────────────────────────────────────────────────────── */
// "validating" | "valid" | "invalid" | "success" | "submitting"

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [status, setStatus] = useState("validating"); // page-level status
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({ mode: "onTouched" });

    /* ── Validate token on mount ── */
    useEffect(() => {
        if (!token) {
            setStatus("invalid");
            return;
        }

        api.get(`/auth/reset-password?token=${token}`)
            .then(() => setStatus("valid"))
            .catch(() => setStatus("invalid"));
    }, [token]);

    /* ── Submit new password ── */
    const onSubmit = async (data) => {
        setServerError("");
        setStatus("submitting");

        try {
            await api.post("/auth/reset-password/confirm", {
                token,
                newPassword: data.newPassword,
            });
            setStatus("success");
        } catch (err) {
            const msg =
                err.response?.data ||
                "Something went wrong. Please try again.";
            setServerError(msg);
            setStatus("valid"); // revert so user can retry
        }
    };

    /* ─────────────────────────────────────────────────────────────────── */
    return (
        <div
            className="min-h-dvh flex items-center justify-center px-4 py-12 bg-slate-50"
            
        >

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="rp-wrap w-full max-w-md"
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

                        {/* ── VALIDATING ─────────────────────────────────── */}
                        {status === "validating" && (
                            <motion.div
                                key="validating"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center py-8 gap-4"
                            >
                                <div className="text-blue-400">
                                    <SpinnerIcon />
                                </div>
                                <p className="text-sm text-slate-500 font-medium">Validating your reset link…</p>
                            </motion.div>
                        )}

                        {/* ── INVALID TOKEN ──────────────────────────────── */}
                        {status === "invalid" && (
                            <motion.div
                                key="invalid"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col items-center text-center py-4 gap-5"
                            >
                                <div
                                    className="w-20 h-20 rounded-lg flex items-center justify-center text-red-400"
                                    style={{ background: "#fef2f2" }}
                                >
                                    <AlertIcon />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Link Expired</h1>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        This password reset link is invalid or has expired.<br />
                                        Please request a new one.
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

                        {/* ── FORM (valid / submitting) ──────────────────── */}
                        {(status === "valid" || status === "submitting") && (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-center mb-7">
                                    <h1 className="text-3xl font-extrabold text-slate-900">New Password</h1>
                                    <p className="text-sm text-slate-400 mt-1">Choose a strong password for your account.</p>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <InputField
                                        label="New Password"
                                        id="newPassword"
                                        type="password"
                                        errors={errors}
                                        register={register}
                                        required={true}
                                        message="Password is required"
                                        placeholder="Enter new password"
                                        min={6}
                                    />

                                    <InputField
                                        label="Confirm Password"
                                        id="confirmPassword"
                                        type="password"
                                        errors={errors}
                                        register={register}
                                        required={true}
                                        message="Please confirm your password"
                                        placeholder="Re-enter new password"
                                        min={6}
                                    />

                                    {/* Custom validation: passwords must match */}
                                    {/* We handle this through react-hook-form validate */}
                                    {errors.confirmPassword?.type === "validate" && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-xs font-semibold text-red-500 flex items-center gap-1 -mt-2"
                                        >
                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                            </svg>
                                            Passwords do not match
                                        </motion.p>
                                    )}

                                    {/* Server-side error */}
                                    <AnimatePresence>
                                        {serverError && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-100 px-3.5 py-2.5"
                                            >
                                                <svg className="mt-0.5 flex-shrink-0 text-red-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                                </svg>
                                                <p className="text-xs font-semibold text-red-600">{serverError}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={status === "submitting"}
                                        className="w-full h-12 rounded-md border border-slate-900 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-bold transition-colors duration-150 mt-2 flex items-center justify-center gap-2"
                                        style={{ boxShadow: "var(--shadow-block-sm)" }}
                                    >
                                        {status === "submitting" ? (
                                            <>
                                                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                                </svg>
                                                Resetting…
                                            </>
                                        ) : (
                                            "Reset Password"
                                        )}
                                    </motion.button>
                                </form>

                                <p className="text-center text-sm text-slate-500 mt-6">
                                    Remember your password?{" "}
                                    <Link to="/signin" className="font-bold text-blue-600 hover:text-blue-700 transition-colors duration-150">
                                        Sign in
                                    </Link>
                                </p>
                            </motion.div>
                        )}

                        {/* ── SUCCESS ────────────────────────────────────── */}
                        {status === "success" && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.35 }}
                                className="flex flex-col items-center text-center py-4 gap-5"
                            >
                                {/* Animated check circle */}
                                <motion.div
                                    initial={{ scale: 0, rotate: -20 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
                                    className="w-20 h-20 rounded-lg flex items-center justify-center text-emerald-500"
                                    style={{ background: "#eff4ec" }}
                                >
                                    <ShieldCheckIcon />
                                </motion.div>

                                <div>
                                    <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Password Updated!</h1>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        Your password has been changed successfully.<br />
                                        You can now sign in with your new password.
                                    </p>
                                </div>

                                {/* Auto-redirect bar */}
                                <AutoRedirect to="/signin" seconds={5} navigate={navigate} />

                                <Link
                                    to="/signin"
                                    className="w-full h-12 rounded-md border border-slate-900 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold text-center transition-colors duration-150 block"
                                    style={{ boxShadow: "var(--shadow-block-sm)" }}
                                >
                                    Sign In Now
                                </Link>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

                {/* Footer */}
                {(status === "valid" || status === "submitting") && (
                    <p className="text-center text-xs text-slate-400 mt-5">
                        By resetting your password, you agree to our{" "}
                        <a href="#" className="underline hover:text-slate-600 transition-colors duration-150">Terms</a>
                        {" & "}
                        <a href="#" className="underline hover:text-slate-600 transition-colors duration-150">Privacy Policy</a>
                    </p>
                )}
            </motion.div>
        </div>
    );
};

/* ─── Auto-redirect countdown helper ─────────────────────────────────────── */
const AutoRedirect = ({ to, seconds, navigate }) => {
    const [count, setCount] = useState(seconds);

    useEffect(() => {
        if (count <= 0) {
            navigate(to);
            return;
        }
        const t = setTimeout(() => setCount((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [count, navigate, to]);

    const progress = ((seconds - count) / seconds) * 100;

    return (
        <div className="w-full">
            <p className="text-xs text-slate-400 text-center mb-2">
                Redirecting to sign in in <span className="font-bold text-slate-600">{count}s</span>…
            </p>
            <div className="w-full h-1 rounded-full bg-slate-100 overflow-hidden">
                <motion.div
                    className="h-full rounded-full bg-blue-400"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                />
            </div>
        </div>
    );
};

export default ResetPassword;