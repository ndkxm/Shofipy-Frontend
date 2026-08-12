import React from 'react';
import { motion } from 'framer-motion';

export const Returns = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-blue-100 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 font-semibold text-sm mb-4 border border-blue-200">
                        Customer Support
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                        Refund & Return Policy
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        We want you to be completely satisfied with your purchase. Refunds are available as long as your game key has not been revealed.
                    </p>
                </motion.div>

                <div className="mb-12">
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 hover:border-blue-200 shadow-sm hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">Unrevealed Game Key</h3>
                        <p className="text-slate-500 leading-relaxed">
                            Refunds are only eligible if the game key has <strong className="text-slate-700">not been revealed</strong>. Once a key is revealed, it is considered used and cannot be refunded.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm mb-8">
                    <h3 className="text-2xl font-bold text-slate-800 mb-6">How to Request a Refund</h3>
                    <div className="space-y-6 text-slate-500">
                        <p className="flex gap-4">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">1</span>
                            <span>Navigate to your <strong className="text-slate-700">Orders</strong> in your account profile.</span>
                        </p>
                        <p className="flex gap-4">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">2</span>
                            <span>Select the item you wish to refund and click the <strong className="text-slate-700">"Request Refund"</strong> button.</span>
                        </p>
                        <p className="flex gap-4">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">3</span>
                            <span>Our support team will review your request and process it back to your original payment method if it meets the criteria.</span>
                        </p>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-100">
                        <h4 className="text-lg font-bold text-slate-800 mb-3">Exceptions</h4>
                        <p className="text-slate-500">
                            Refunds will <strong className="text-slate-700">not</strong> be issued if the game key has already been revealed, regardless of whether it has been used or not. Please double-check before revealing your key.
                        </p>
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 flex items-start gap-3">
                    <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    <p className="text-amber-700 text-sm font-medium">
                        Once you reveal your game key, it is <strong>non-refundable</strong>. Please make sure you want the product before revealing the key.
                    </p>
                </div>
            </div>
        </div>
    );
};