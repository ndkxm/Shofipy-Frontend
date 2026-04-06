import { motion } from "framer-motion";

export const Loader = () => {
    return (
        <div className="flex flex-col justify-center items-center h-[550px] gap-5">
            <div className="relative w-14 h-14">
                {/* Outer ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-blue-300"
                />
                {/* Inner ring */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-2 rounded-full border-2 border-transparent border-t-slate-300"
                />
                {/* Center dot */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-[18px] rounded-full bg-blue-500"
                />
            </div>
            <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                style={{ fontFamily: "'Reddit Sans', sans-serif" }}
                className="text-sm font-semibold text-slate-400 tracking-wide"
            >
                Loading products...
            </motion.p>
        </div>
    );
};