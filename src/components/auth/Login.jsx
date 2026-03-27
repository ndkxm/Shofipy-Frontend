import { useForm } from "react-hook-form"
import { InputField } from "../shared/InputField"
import { FaShoppingBag } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { authenticatedSignInUser } from "../../store/actions"

export const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        mode: "onTouched"
    })

    const loginHandler = (data) => {
        dispatch(authenticatedSignInUser(data, reset, navigate))
    }

    return (
        <div className="
        min-h-screen flex items-center justify-center
        bg-gradient-to-br from-blue-100 via-white to-cyan-100
        px-4 sm:px-6 lg:px-8 relative overflow-hidden
        ">

            {/* Glow background */}
            <div className="absolute w-56 h-56 sm:w-80 sm:h-80 bg-blue-300 blur-[100px] opacity-40 top-10 left-10"></div>
            <div className="absolute w-56 h-56 sm:w-80 sm:h-80 bg-cyan-300 blur-[100px] opacity-40 bottom-10 right-10"></div>

            {/* Card */}
            <div className="
            relative w-full max-w-sm sm:max-w-md
            backdrop-blur-xl bg-white/70
            border border-white/40
            shadow-2xl rounded-2xl
            p-6 sm:p-8
            ">

                {/* Logo + title */}
                <div className="text-center mb-6 sm:mb-8">
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 
                        text-2xl sm:text-3xl font-bold 
                        text-slate-800 hover:text-blue-700 
                        transition"
                    >
                        <FaShoppingBag className="size-5 sm:size-6" />
                        <span>Shofipy</span>
                    </Link>

                    <p className="text-slate-500 text-xs sm:text-sm mt-2">
                        Login to continue
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(loginHandler)}
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
                        placeholder="Enter password"
                        min={6}
                    />

                    {/* Remember + forgot */}
                    <div className="
                    flex flex-col sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-2
                    text-xs sm:text-sm
                    text-slate-600
                    ">

                        <label className="flex items-center gap-2">
                            <input type="checkbox" />
                            Remember me
                        </label>

                        <a
                            href="#"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Forgot password
                        </a>
                    </div>

                    {/* Button */}
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
                        Login
                    </button>

                </form>

                {/* Register */}
                <p className="text-center text-slate-500 text-xs sm:text-sm mt-6">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Sign up
                    </Link>
                </p>

            </div>

        </div>
    )
}