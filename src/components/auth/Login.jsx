import { useForm } from "react-hook-form";
import { InputField } from "../shared/InputField";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authenticatedSignInUser } from "../../store/actions";
import { AuthShell } from "./AuthShell";

export const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ mode: "onTouched" });

    const loginHandler = (data) => {
        dispatch(authenticatedSignInUser(data, reset, navigate));
    };

    return (
        <AuthShell
            eyebrow="Log in"
            title="Welcome back."
            subtitle="Pick up where you left off — your cart and keys are waiting."
            footer={<>New here? <Link to="/register" className="font-bold text-slate-900 underline underline-offset-4 decoration-blue-600 decoration-2">Create an account</Link></>}
        >
            <form onSubmit={handleSubmit(loginHandler)} className="space-y-5" noValidate>
                <InputField
                    label="Username"
                    id="username"
                    type="text"
                    errors={errors}
                    register={register}
                    required={true}
                    message="Username is required"
                    placeholder="your_username"
                    min={1}
                />
                <div>
                    <InputField
                        label="Password"
                        id="password"
                        type="password"
                        errors={errors}
                        register={register}
                        required={true}
                        message="Password is required"
                        placeholder="••••••••"
                        min={6}
                    />
                    <Link to="/forgot-password" className="inline-block mt-2 text-sm font-semibold text-blue-700 hover:text-blue-900">
                        Forgot password?
                    </Link>
                </div>
                <button type="submit" className="btn-accent w-full !py-3.5 text-[15px]">Log in</button>
            </form>
        </AuthShell>
    );
};
