import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-slate-100 last:border-0">
            <button
                className="w-full text-left py-5 flex justify-between items-center focus:outline-none group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-base font-semibold text-slate-700 group-hover:text-blue-600 transition-colors pr-4">
                    {question}
                </span>
                <span className={`transform transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-5 text-slate-500 leading-relaxed">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const FAQ = () => {
    const faqs = [
        {
            question: "How do I get my game key after purchase?",
            answer: "Once your payment is confirmed, your game key will be available in your Order History under your profile. Navigate to the order and click 'Reveal Key' to see it. Please note that once revealed, the key is considered delivered and is non-refundable."
        },
        {
            question: "Are the game keys region-locked?",
            answer: "Some keys may be region-locked depending on the publisher. Any region restrictions are clearly indicated on the product page. Please make sure you purchase a key compatible with your region before completing your order."
        },
        {
            question: "What platforms are the keys for?",
            answer: "We sell keys for major platforms including Steam, Epic Games Store, and others. The supported platform is always listed on the product page. Simply activate the key on the corresponding platform to access your game."
        },
        {
            question: "Can I get a refund after revealing my key?",
            answer: "Unfortunately, refunds are not available once a game key has been revealed, as it is considered delivered at that point. If you have not yet revealed your key, you may request a refund through the Order History page."
        },
        {
            question: "What if my key doesn't work?",
            answer: "If you experience issues activating your key, please contact our support team immediately without revealing it to anyone else. We will investigate and provide a replacement or refund if the key is confirmed to be invalid."
        },
        {
            question: "Do you sell physical copies?",
            answer: "No, Shofipy specializes in digital distribution only. All products on our platform are digital game keys delivered instantly to your account after purchase."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-blue-100 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-3xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 font-semibold text-sm mb-4 border border-blue-200">
                        FAQ
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-slate-500 text-lg">Everything you need to know about purchasing game keys on Shofipy.</p>
                </motion.div>

                <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>
        </div>
    );
};