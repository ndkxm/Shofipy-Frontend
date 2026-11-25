import { useForm } from "react-hook-form";
import { InputField } from "../shared/InputField";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerNewUser } from "../../store/actions";
import { AuthShell } from "./AuthShell";

export const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const registerHandler = (data) => {
        dispatch(registerNewUser(data, reset, navigate));
    };

    return (
        <AuthShell
            eyebrow="Create account"
            title="Start your library."
            subtitle="Takes under a minute. You’ll need it to receive your keys."
            footer={<>Already have an account? <Link to="/signin" className="font-bold text-slate-900 underline underline-offset-4 decoration-blue-600 decoration-2">Log in</Link></>}
        >
                    <form onSubmit={handleSubmit(registerHandler)} className="space-y-5" noValidate>
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
                        <button type="submit" className="btn-accent w-full !py-3.5 text-[15px]">
                            Create account
                        </button>
                    </form>
        </AuthShell>
    );
};
