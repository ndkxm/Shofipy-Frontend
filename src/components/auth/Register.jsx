import { useForm } from "react-hook-form";
import { InputField } from "../shared/InputField";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerNewUser } from "../../store/actions";
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

export const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const registerHandler = (data) => {
        dispatch(registerNewUser(data, reset, navigate));
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-10"
            style={{ background: "linear-gradient(150deg, #eff6ff 0%, #f8fafc 50%, #f0fdf4 100%)" }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Reddit+Sans:wght@400;500;600;700;800&display=swap');
                .auth-wrap * { font-family: 'Reddit Sans', sans-serif; }
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
                    {/* Header */}
                    <div className="flex flex-col items-center mb-8">
                        <Link to="/" className="flex items-center gap-2.5 mb-4">
                            <LogoIcon />
                            <span className="text-xl font-extrabold text-slate-900 tracking-tight">Shofipy</span>
                        </Link>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create account</h1>
                        <p className="text-sm text-slate-400 mt-1">Sign up and start shopping today</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(registerHandler)} className="space-y-4">
                        <InputField
                            label="Username"
                            id="username"
                            type="text"
                            errors={errors}
                            register={register}
                            required={true}
                            message="Username is required"
                            placeholder="Choose a username"
                            min={2}
                        />

                        <InputField
                            label="Email"
                            id="email"
                            type="email"
                            errors={errors}
                            register={register}
                            required={true}
                            message="Email is required"
                            placeholder="Enter your email"
                            min={5}
                        />

                        {/* Password row — 2 columns on sm+ */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <InputField
                                label="Password"
                                id="password"
                                type="password"
                                errors={errors}
                                register={register}
                                required={true}
                                message="Password is required"
                                placeholder="Create password"
                                min={6}
                            />

                            <InputField
                                label="Confirm Password"
                                id="confirmPassword"
                                type="password"
                                errors={errors}
                                register={register}
                                required={true}
                                message="Please confirm password"
                                placeholder="Re-enter password"
                                min={6}
                            />
                        </div>

                        {/* Submit */}
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors duration-150 mt-2"
                            style={{ boxShadow: "0 4px 14px rgba(59,130,246,0.35)" }}
                        >
                            Create Account
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-slate-100" />
                        <span className="text-xs text-slate-400 font-medium">or</span>
                        <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    {/* Login link */}
                    <p className="text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link to="/signin" className="font-bold text-blue-600 hover:text-blue-700 transition-colors duration-150">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Footer note */}
                <p className="text-center text-xs text-slate-400 mt-5">
                    By registering, you agree to our{" "}
                    <a href="#" className="underline hover:text-slate-600 transition-colors duration-150">Terms</a>
                    {" & "}
                    <a href="#" className="underline hover:text-slate-600 transition-colors duration-150">Privacy Policy</a>
                </p>
            </motion.div>
        </div>
    );
};