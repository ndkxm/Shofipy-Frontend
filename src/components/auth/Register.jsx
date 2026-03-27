import { useForm } from "react-hook-form"
import { InputField } from "../shared/InputField"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { registerNewUser } from "../../store/actions"

export const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm()

    const registerHandler = (data) => {
        console.log(data);
        dispatch(registerNewUser(data, reset, navigate));
    }

    return (
        <div className="
        min-h-screen flex items-center justify-center
        bg-gradient-to-br from-blue-100 via-white to-cyan-100
        px-4 sm:px-6 lg:px-8
        relative overflow-hidden
        ">

            {/* glow background */}
            <div className="absolute w-56 h-56 sm:w-80 sm:h-80 bg-blue-300 blur-[100px] opacity-40 top-10 left-10"></div>
            <div className="absolute w-56 h-56 sm:w-80 sm:h-80 bg-cyan-300 blur-[100px] opacity-40 bottom-10 right-10"></div>

            {/* card */}
            <div className="
            relative w-full max-w-sm sm:max-w-md
            backdrop-blur-xl bg-white/70
            border border-white/40
            shadow-2xl rounded-2xl
            p-6 sm:p-8
            ">

                {/* title */}
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                        Create Account
                    </h1>

                    <p className="text-slate-500 text-xs sm:text-sm mt-2">
                        Sign up to get started
                    </p>
                </div>

                {/* form */}
                <form
                    onSubmit={handleSubmit(registerHandler)}
                    className="flex flex-col gap-4 sm:gap-5"
                >

                    <InputField
                        label="Username"
                        id="username"
                        type="text"
                        errors={errors}
                        register={register}
                        required={true}
                        message="Username is required"
                        placeholder="Enter your username"
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
                        message="Confirm password"
                        placeholder="Re-enter password"
                        min={6}
                    />

                    {/* button */}
                    <button
                        type="submit"
                        className="
                        w-full py-2.5
                        rounded-lg
                        bg-gradient-to-r from-blue-500 to-cyan-500
                        hover:from-blue-600 hover:to-cyan-600
                        text-white font-semibold
                        shadow-lg hover:shadow-xl
                        transition
                        "
                    >
                        Create Account
                    </button>

                </form>

                {/* login link */}
                <p className="text-center text-slate-500 text-xs sm:text-sm mt-6">
                    Already have an account?{" "}
                    <Link
                        to="/signin"
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Login
                    </Link>
                </p>

            </div>

        </div>
    )
}