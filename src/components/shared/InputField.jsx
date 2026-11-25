import { useState } from "react";
import { motion } from "framer-motion";

const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

export const InputField = ({
    label, id, type, errors, register,
    required, message, className, min, value, placeholder
}) => {
    const hasError = !!errors[id]?.message;
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = useState(false);
    const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label
                htmlFor={id}
                className="label-mono text-slate-600"
            >
                {label}
                {required && <span className="text-blue-600 ml-0.5" aria-hidden="true">*</span>}
            </label>

            <div className="relative">
                <input
                    type={resolvedType}
                    id={id}
                    placeholder={placeholder}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? `${id}-error` : undefined}
                    className={`
                        w-full h-12 rounded-md border text-[15px] text-slate-900
                        placeholder-slate-400 outline-none bg-white
                        transition-all duration-150
                        ${isPassword ? "pl-3.5 pr-10" : "px-3.5"}
                        ${hasError
                            ? "border-red-600 ring-2 ring-red-100"
                            : "border-slate-900 focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
                        }
                        ${className || ""}
                    `}
                    {...register(id, {
                        required: { value: required, message },
                        minLength: min ? { value: min, message: `Minimum ${min} characters required` } : null,
                        pattern:
                            type === "email" ? {
                                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                                message: "Invalid email address",
                            } : type === "url" ? {
                                value: /^(https?:\/\/)?(www\.)?[A-Za-z0-9-]+\.[A-Za-z]{2,}(:\d+)?(\/\S*)?$/,
                                message: "Invalid URL",
                            } : null,
                    })}
                />

                {isPassword && (
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 transition-colors duration-150"
                    >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                )}
            </div>

            {hasError && (
                <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    id={`${id}-error`} role="alert"
                    className="text-xs font-semibold text-red-600 flex items-center gap-1"
                >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errors[id]?.message}
                </motion.p>
            )}
        </div>
    );
};