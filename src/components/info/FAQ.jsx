import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../shared/Header';
import { Footer } from '../shared/Footer';
import { SplitReveal, accentAt } from '../shared/Motion';

const FAQItem = ({ question, answer, index }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-slate-300">
            <button
                className="w-full text-left py-6 flex gap-5 items-start group"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
            >
                <motion.span animate={{ rotate: isOpen ? 90 : 0, scale: isOpen ? 1.1 : 1 }} className="grid place-items-center w-9 h-9 rounded-md border border-slate-900 font-mono text-xs text-slate-900 shrink-0" style={{ background: accentAt(index).soft }}>{String(index + 1).padStart(2, "0")}</motion.span>
                <span className="flex-1 text-lg md:text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors pr-4">
                    {question}
                </span>
                <span className={`transform transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg aria-hidden="true" className="w-5 h-5 mt-1 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                        <p className="pb-6 pl-14 pr-8 text-slate-600 leading-relaxed max-w-prose">
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
        <div className="min-h-screen bg-slate-50">
            <Header />
            <main className="pt-28 pb-4">

            <div className="max-w-4xl mx-auto px-5 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-14 pb-10 border-b border-slate-900"
                >
                    <p className="label-mono text-slate-500 mb-5">FAQ</p>
                    <SplitReveal lines={["Questions,", "answered."]} className="display text-5xl md:text-7xl text-slate-900 mb-6" />
                    <p className="text-slate-600 text-lg max-w-2xl">Everything you need to know about purchasing game keys on Shofipy.</p>
                </motion.div>

                <div className="border-t border-slate-900">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} index={index} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>
            </main>
            <Footer />
        </div>
    );
};