import React, { useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";
import { Header } from "../shared/Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserCart } from "../../store/actions";
import { Bounce, toast } from "react-toastify";
import { PaymentMethod } from "./PaymentMethod";
import { OrderSummary } from "./OrderSummary";
import { motion, AnimatePresence } from "framer-motion";
import PaymentForm from "./PaymentForm";

// ── Steps config ───────────────────────────────────────────────────────────────

const STEPS = [
    {
        label: "Payment",
        sublabel: "How to pay",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
            </svg>
        ),
    },
    {
        label: "Review",
        sublabel: "Check your order",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
            </svg>
        ),
    },
    {
        label: "Finalize",
        sublabel: "Complete purchase",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
            </svg>
        ),
    },
];

// ── Step indicator ─────────────────────────────────────────────────────────────

const StepIndicator = ({ steps, activeStep }) => {
    const isMobile = useMediaQuery("(max-width:600px)");

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 0, width: "100%", marginBottom: 40 }}>
            {steps.map((step, i) => {
                const isDone = i < activeStep;
                const isActive = i === activeStep;

                return (
                    <React.Fragment key={step.label + i}>
                        {/* Step node */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
                            <motion.div
                                animate={{
                                    background: isDone ? "#22c55e" : isActive ? "#3b82f6" : "#f1f5f9",
                                    borderColor: isDone ? "#22c55e" : isActive ? "#3b82f6" : "#e2e8f0",
                                    scale: isActive ? 1.1 : 1,
                                }}
                                transition={{ duration: 0.25 }}
                                style={{
                                    width: 40, height: 40, borderRadius: "50%",
                                    border: "2px solid",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: isDone || isActive ? "white" : "#94a3b8",
                                    fontFamily: "'Reddit Sans', sans-serif",
                                    fontSize: 13, fontWeight: 700,
                                    boxShadow: isActive ? "0 0 0 6px #3b82f620" : "none",
                                }}
                            >
                                {isDone ? (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                ) : step.icon}
                            </motion.div>

                            {!isMobile && (
                                <div style={{ textAlign: "center" }}>
                                    <div style={{
                                        fontSize: 12, fontWeight: 700,
                                        color: isActive ? "#1e40af" : isDone ? "#15803d" : "#94a3b8",
                                        fontFamily: "'Reddit Sans', sans-serif",
                                        letterSpacing: "0.02em",
                                    }}>
                                        {step.label}
                                    </div>
                                    <div style={{ fontSize: 10, color: "#cbd5e1", fontFamily: "'Reddit Sans', sans-serif" }}>
                                        {step.sublabel}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Connector */}
                        {i < steps.length - 1 && (
                            <div style={{ flex: 1, height: 2, background: "#f1f5f9", margin: isMobile ? "0 6px" : "0 8px", marginBottom: isMobile ? 0 : 28, position: "relative", overflow: "hidden" }}>
                                <motion.div
                                    animate={{ width: isDone ? "100%" : "0%" }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                    style={{ position: "absolute", top: 0, left: 0, height: "100%", background: "#22c55e" }}
                                />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

// ── Main ───────────────────────────────────────────────────────────────────────

export const CheckOut = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [direction, setDirection] = useState(1);

    const dispatch = useDispatch();
    const { paymentMethod } = useSelector((state) => state.payment);
    const isMobile = useMediaQuery("(max-width:600px)");

    const handleNext = () => {
        if (activeStep === 0 && !paymentMethod) {
            toast.error("Please select a payment method!", { position: "top-center", autoClose: 2000, theme: "light", transition: Bounce });
            return;
        }
        setDirection(1);
        setActiveStep((p) => p + 1);
    };

    const handleBack = () => {
        setDirection(-1);
        setActiveStep((p) => p - 1);
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0: return <PaymentMethod />;
            case 1: return <OrderSummary />;
            case 2: return <PaymentForm />;
        }
    };

    useEffect(() => {
        dispatch(fetchUserCart());
    }, [dispatch]);

    useEffect(() => {
        if (activeStep >= 1) {
            dispatch(fetchUserCart());
        }
    }, [activeStep, dispatch]);


    const isLastStep = activeStep === STEPS.length - 1;

    return (
        <div>
            <Header />

            {/* Page background */}
            <div style={{
                minHeight: "100vh",
                background: "linear-gradient(150deg, #eff6ff 0%, #f8fafc 50%, #f0fdf4 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: isMobile ? "80px 16px 32px" : "96px 24px 40px",
            }}>
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Reddit+Sans:wght@400;500;600;700&display=swap');
                `}</style>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        width: "100%", maxWidth: 960,
                        background: "white",
                        borderRadius: 24,
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 4px 32px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
                        padding: isMobile ? "24px 16px" : "40px 48px",
                    }}
                >
                    {/* Header */}
                    <div style={{ marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <h1 style={{
                                margin: 0, fontFamily: "'Reddit Sans', sans-serif",
                                fontSize: isMobile ? 20 : 24, fontWeight: 700, color: "#0f172a",
                                letterSpacing: "-0.02em",
                            }}>
                                Checkout
                            </h1>
                            <p style={{ margin: "4px 0 0", fontFamily: "'Reddit Sans', sans-serif", fontSize: 13, color: "#94a3b8" }}>
                                Step {activeStep + 1} of {STEPS.length}
                            </p>
                        </div>
                        <div style={{
                            background: "#eff6ff", borderRadius: 12,
                            padding: "6px 14px", border: "1px solid #bfdbfe",
                        }}>
                            <span style={{ fontFamily: "'Reddit Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#1d4ed8" }}>
                                {STEPS[activeStep].label}
                            </span>
                        </div>
                    </div>

                    {/* Step indicator */}
                    <StepIndicator steps={STEPS} activeStep={activeStep} />

                    {/* Step content */}
                    <div style={{ minHeight: 200, position: "relative" }}>
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={activeStep}
                                custom={direction}
                                initial={{ opacity: 0, x: direction * 32 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: direction * -32 }}
                                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {renderStepContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Divider */}
                    <div style={{ height: 1, background: "#f1f5f9", margin: "32px 0 24px" }} />

                    {/* Navigation */}
                    <div style={{
                        display: "flex",
                        flexDirection: isMobile ? "column-reverse" : "row",
                        justifyContent: "space-between",
                        gap: 12,
                    }}>
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={handleBack}
                            disabled={activeStep === 0}
                            style={{
                                padding: isMobile ? "12px" : "10px 28px",
                                borderRadius: 14, border: "1.5px solid #e2e8f0",
                                background: "white", cursor: activeStep === 0 ? "not-allowed" : "pointer",
                                fontFamily: "'Reddit Sans', sans-serif", fontSize: 14, fontWeight: 600,
                                color: activeStep === 0 ? "#cbd5e1" : "#475569",
                                transition: "all 0.15s",
                                width: isMobile ? "100%" : "auto",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                            Back
                        </motion.button>

                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={isLastStep ? undefined : handleNext}
                            disabled={isLastStep}
                            style={{
                                padding: isMobile ? "13px" : "11px 36px",
                                borderRadius: 14, border: "none",
                                background: isLastStep ? "#dcfce7" : "#3b82f6",
                                cursor: isLastStep ? "default" : "pointer",
                                fontFamily: "'Reddit Sans', sans-serif", fontSize: 14, fontWeight: 700,
                                color: isLastStep ? "#16a34a" : "white",
                                boxShadow: isLastStep ? "none" : "0 4px 14px rgba(59,130,246,0.35)",
                                transition: "all 0.15s",
                                width: isMobile ? "100%" : "auto",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                            }}
                        >
                            {isLastStep ? (
                                <>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Completed
                                </>
                            ) : (
                                <>
                                    {activeStep === STEPS.length - 2 ? "Place Order" : "Continue"}
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
