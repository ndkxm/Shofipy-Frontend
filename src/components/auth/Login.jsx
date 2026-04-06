import { useForm } from "react-hook-form";
import { InputField } from "../shared/InputField";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authenticatedSignInUser } from "../../store/actions";
import { motion } from "framer-motion";

const LogoIcon = () => (
    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
    </div>
);

export const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ mode: "onTouched" });

    const loginHandler = (data) => {
        dispatch(authenticatedSignInUser(data, reset, navigate));
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{ background: "linear-gradient(150deg, #eff6ff 0%, #f8fafc 50%, #f0fdf4 100%)" }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Reddit+Sans:wght@400;500;600;700;800&display=swap');
                .auth-wrap * { font-family: 'Reddit Sans', sans-serif; }
                .auth-input {
                    width: 100%; border: 1px solid #e2e8f0; border-radius: 12px;
                    padding: 10px 14px; font-size: 14px; color: #1e293b;
                    background: white; outline: none; transition: border-color 0.15s, box-shadow 0.15s;
                    font-family: 'Reddit Sans', sans-serif;
                }
                .auth-input::placeholder { color: #94a3b8; }
                .auth-input:focus { border-color: #60a5fa; box-shadow: 0 0 0 3px #bfdbfe; }
            `}</style>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="auth-wrap w-full max-w-md"
            >
                {/* Card */}
                <div
                    className="bg-white rounded-3xl p-8 border border-slate-200"
                    style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.08)" }}
                >
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <Link to="/" className="flex items-center gap-2.5 mb-4">
                            <LogoIcon />
                            <span className="text-xl font-extrabold text-slate-900 tracking-tight">Shofipy</span>
                        </Link>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome back</h1>
                        <p className="text-sm text-slate-400 mt-1">Sign in to your account to continue</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(loginHandler)} className="space-y-4">
                        <InputField
                            label="Username"
                            id="username"
                            type="text"
                            errors={errors}
                            register={register}
                            required={true}
                            message="Username is required"
                            placeholder="Enter your username"
                            min={1}
                        />

                        <InputField
                            label="Password"
                            id="password"
                            type="password"
                            errors={errors}
                            register={register}
                            required={true}
                            message="Password is required"
                            placeholder="Enter your password"
                            min={6}
                        />

                        {/* Remember + forgot */}
                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-slate-300 accent-blue-600"
                                />
                                Remember me
                            </label>
                            <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-150">
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit */}
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors duration-150 mt-2"
                            style={{ boxShadow: "0 4px 14px rgba(59,130,246,0.35)" }}
                        >
                            Sign In
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-slate-100" />
                        <span className="text-xs text-slate-400 font-medium">or</span>
                        <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    {/* Register link */}
                    <p className="text-center text-sm text-slate-500">
                        Don't have an account?{" "}
                        <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 transition-colors duration-150">
                            Create one
                        </Link>
                    </p>
                </div>

                {/* Footer note */}
                <p className="text-center text-xs text-slate-400 mt-5">
                    By signing in, you agree to our{" "}
                    <a href="#" className="underline hover:text-slate-600 transition-colors duration-150">Terms</a>
                    {" & "}
                    <a href="#" className="underline hover:text-slate-600 transition-colors duration-150">Privacy Policy</a>
                </p>
            </motion.div>
        </div>
    );
};