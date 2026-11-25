import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bounce, toast } from "react-toastify";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import api from "../../api/api";
import { fetchUserCart } from "../../store/actions";

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
    : null;

const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

const StripeCheckoutForm = ({ isFinalizingOrder, onPaymentSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsSubmitting(true);

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                redirect: "if_required"
            });

            if (error) {
                toast.error(error.message || "Stripe payment failed.", {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "light",
                    transition: Bounce,
                });
                return;
            }

            if (paymentIntent?.status !== "succeeded") {
                toast.error(`Payment was not completed. Current status: ${paymentIntent?.status || "unknown"}`, {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "light",
                    transition: Bounce,
                });
                return;
            }

            await onPaymentSuccess(paymentIntent);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-lg border border-slate-900 bg-white p-4">
                <PaymentElement />
            </div>

            <button
                type="submit"
                disabled={!stripe || !elements || isSubmitting || isFinalizingOrder}
                className="w-full rounded-lg bg-[#635BFF] px-4 py-3 text-sm font-bold text-white transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSubmitting ? "Processing payment..." : isFinalizingOrder ? "Finalizing order..." : "Pay with Stripe"}
            </button>
        </form>
    );
};

const PaymentForm = () => {
    const { paymentMethod } = useSelector((state) => state.payment);
    const { totalPrice } = useSelector((state) => state.carts);
    const dispatch = useDispatch();
    const [clientSecret, setClientSecret] = useState("");
    const [pendingOrderId, setPendingOrderId] = useState(null);
    const [intentKey, setIntentKey] = useState("");
    const [isPaymentComplete, setIsPaymentComplete] = useState(false);
    const [isFinalizingOrder, setIsFinalizingOrder] = useState(false);
    const [isLoadingIntent, setIsLoadingIntent] = useState(false);
    const total = Number(totalPrice || 0);

    useEffect(() => {
        if (paymentMethod !== "stripe") {
            setClientSecret("");
            setPendingOrderId(null);
            setIntentKey("");
            setIsPaymentComplete(false);
            return;
        }

        if (!stripePromise) {
            return;
        }

        if (isFinalizingOrder || isPaymentComplete) {
            return;
        }

        if (total <= 0) {
            if (!clientSecret) {
                setPendingOrderId(null);
                setIntentKey("");
            }
            return;
        }

        const nextIntentKey = `${paymentMethod}:${total.toFixed(2)}`;
        if (clientSecret && intentKey === nextIntentKey) {
            return;
        }

        let ignore = false;

        const createPaymentIntent = async () => {
            setIsLoadingIntent(true);

            try {
                const { data } = await api.post("/order/stripe-client-secret", {
                    currency: "usd",
                    paymentMethod,
                });

                const secret =
                    typeof data === "string"
                        ? data.trim()
                        : typeof data?.clientSecret === "string"
                            ? data.clientSecret.trim()
                            : "";
                const orderId = Number(data?.orderId || 0);

                if (!secret.startsWith("pi_") || !secret.includes("_secret_")) {
                    throw new Error("Backend did not return a valid Stripe Payment Intent client secret.");
                }
                if (!orderId) {
                    throw new Error("Backend did not return a valid pending order.");
                }

                if (!ignore) {
                    setClientSecret(secret);
                    setPendingOrderId(orderId);
                    setIntentKey(nextIntentKey);
                    setIsPaymentComplete(false);
                }
            } catch (error) {
                if (!ignore) {
                    setClientSecret("");
                    setPendingOrderId(null);
                    setIntentKey("");
                    toast.error(
                        error?.response?.data?.message || error?.message || "Failed to initialize Stripe payment.",
                        {
                            position: "top-center",
                            autoClose: 2500,
                            theme: "light",
                            transition: Bounce,
                        }
                    );
                }
            } finally {
                if (!ignore) {
                    setIsLoadingIntent(false);
                }
            }
        };

        createPaymentIntent();

        return () => {
            ignore = true;
        };
    }, [clientSecret, intentKey, isFinalizingOrder, isPaymentComplete, paymentMethod, total]);

    const waitForOrderConfirmation = async (orderId) => {
        for (let attempt = 0; attempt < 8; attempt += 1) {
            const { data } = await api.get(`/order/users/${orderId}`);
            if (data?.orderStatus === "PAID") {
                return data;
            }
            if (["PAYMENT_FAILED", "EXPIRED", "CANCELLED"].includes(data?.orderStatus)) {
                throw new Error(`Order moved to ${data.orderStatus}.`);
            }
            await sleep(1500);
        }
        return null;
    };

    const handleStripePaymentSuccess = async () => {
        if (!pendingOrderId) {
            throw new Error("Pending order was not initialized correctly.");
        }

        setIsFinalizingOrder(true);

        try {
            const order = await waitForOrderConfirmation(pendingOrderId);
            dispatch(fetchUserCart());

            if (order?.orderStatus === "PAID") {
                setIsPaymentComplete(true);
                toast.success("Stripe payment completed and order was confirmed.", {
                    position: "top-center",
                    autoClose: 2500,
                    theme: "light",
                    transition: Bounce,
                });
                return;
            }

            setIsPaymentComplete(true);
            toast.info("Payment succeeded. The order is still being finalized by the backend.", {
                position: "top-center",
                autoClose: 3500,
                theme: "light",
                transition: Bounce,
            });
        } catch (error) {
            toast.error(
                error?.response?.data?.message || error?.message || "Payment succeeded, but the order confirmation check failed.",
                {
                    position: "top-center",
                    autoClose: 3500,
                    theme: "light",
                    transition: Bounce,
                }
            );
        } finally {
            setIsFinalizingOrder(false);
        }
    };

    return (
        <div className="space-y-4">
            {paymentMethod === "stripe" ? (
                <>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <h2 className="text-lg font-bold text-slate-900">Stripe payment</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Complete your payment securely with Stripe.
                        </p>
                        <p className="mt-3 text-sm font-semibold text-slate-700">
                            Total charge: ${total.toFixed(2)}
                        </p>
                    </div>

                    {!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                            Missing <code>VITE_STRIPE_PUBLISHABLE_KEY</code> in the frontend environment.
                        </div>
                    ) : isLoadingIntent ? (
                        <div className="rounded-lg border border-slate-900 bg-white p-4 text-sm text-slate-500">
                            Initializing Stripe payment...
                        </div>
                    ) : isPaymentComplete ? (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                            Stripe payment was submitted. Your order is being finalized.
                        </div>
                    ) : clientSecret ? (
                        <Elements
                            stripe={stripePromise}
                            options={{
                                clientSecret,
                                appearance: {
                                    theme: "stripe",
                                },
                            }}
                        >
                            <StripeCheckoutForm
                                isFinalizingOrder={isFinalizingOrder}
                                onPaymentSuccess={handleStripePaymentSuccess}
                            />
                        </Elements>
                    ) : (
                        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
                            Stripe client secret is unavailable. Refresh the checkout step and try again.
                        </div>
                    )}
                </>
            ) : (
                <div className="rounded-lg border border-slate-900 bg-white p-4">
                    <h2 className="text-lg font-bold text-slate-900">MoMo payment</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        MoMo payment UI is not wired here yet. The Stripe form only renders when Stripe is selected.
                    </p>
                </div>
            )}
        </div>
    );
};

export default PaymentForm;
