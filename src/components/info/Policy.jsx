import React from 'react';
import { motion } from 'framer-motion';

export const Policy = () => {
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
                        Legal
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        Privacy Policy
                    </h1>
                    <p className="text-slate-400 text-base">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </motion.div>

                <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-lg leading-relaxed mb-10">
                        Welcome to <strong className="text-slate-700">Shofipy</strong> — your trusted destination for purchasing digital game keys. We are committed to protecting your personal information and your right to privacy. If you have any questions about this policy, please contact us.
                    </p>

                    <div className="space-y-10">
                        <section>
                            <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-3">
                                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">1</span>
                                Information We Collect
                            </h3>
                            <p className="text-slate-500 leading-relaxed pl-10">
                                When you register or make a purchase on Shofipy, we collect personal information such as your <strong className="text-slate-600">name, email address, and payment details</strong>. We also collect technical data such as your IP address, browser type, and browsing behavior on our site to improve your experience.
                            </p>
                        </section>

                        <div className="border-t border-slate-100" />

                        <section>
                            <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-3">
                                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">2</span>
                                How We Use Your Information
                            </h3>
                            <p className="text-slate-500 leading-relaxed pl-10">
                                We use your information to <strong className="text-slate-600">process orders, deliver game keys, and provide customer support</strong>. We may also use your email to send order confirmations, updates, or important notices related to your account. We do not use your data for unsolicited marketing without your consent.
                            </p>
                        </section>

                        <div className="border-t border-slate-100" />

                        <section>
                            <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-3">
                                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">3</span>
                                Sharing Your Information
                            </h3>
                            <p className="text-slate-500 leading-relaxed pl-10">
                                We <strong className="text-slate-600">do not sell or rent</strong> your personal information to third parties. We may share data only with trusted payment processors to complete your transactions, or when required by law. All third-party partners are bound by confidentiality agreements.
                            </p>
                        </section>

                        <div className="border-t border-slate-100" />

                        <section>
                            <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-3">
                                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">4</span>
                                Game Key Delivery & Security
                            </h3>
                            <p className="text-slate-500 leading-relaxed pl-10">
                                All game keys are delivered digitally to your account after a successful payment. Keys are stored securely and are <strong className="text-slate-600">only visible to you</strong> once revealed. We strongly recommend not sharing your key with anyone. Once revealed, keys are considered delivered and are non-refundable.
                            </p>
                        </section>

                        <div className="border-t border-slate-100" />

                        <section>
                            <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-3">
                                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">5</span>
                                Data Retention
                            </h3>
                            <p className="text-slate-500 leading-relaxed pl-10">
                                We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time by contacting our support team, subject to legal obligations.
                            </p>
                        </section>

                        <div className="border-t border-slate-100" />

                        <section>
                            <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-3">
                                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">6</span>
                                Your Rights
                            </h3>
                            <p className="text-slate-500 leading-relaxed pl-10">
                                You have the right to <strong className="text-slate-600">access, correct, or delete</strong> your personal data at any time. If you believe your data is being processed unlawfully, you have the right to lodge a complaint. Contact us and we will respond within a reasonable timeframe.
                            </p>
                        </section>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-100">
                        <p className="text-slate-400 text-sm text-center">
                            If you have any questions about this Privacy Policy, please contact us at{" "}
                            <a href="mailto:support@shofipy.com" className="text-blue-500 hover:underline font-medium">
                                support@shofipy.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};