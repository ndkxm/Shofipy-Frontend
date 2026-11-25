import { motion } from "framer-motion";

export const SetQuantity = ({ quantity, handleQtyIncrease, handleQtyDecrease }) => {
    return (
        <div
            className="flex items-center rounded-xl border border-slate-200 bg-slate-50 overflow-hidden"
        >
            <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={handleQtyDecrease}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors duration-150 text-base font-bold flex-shrink-0"
            >
                −
            </motion.button>

            <span className="w-9 text-center text-sm font-bold text-slate-800 select-none">
                {quantity}
            </span>

            <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={handleQtyIncrease}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors duration-150 text-base font-bold flex-shrink-0"
            >
                +
            </motion.button>
        </div>
    );
};