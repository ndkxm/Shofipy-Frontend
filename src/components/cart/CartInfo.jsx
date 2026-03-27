import { Link } from "react-router-dom"

export const CheckOut = ({ summary }) => {
    return (
        <div className="w-full max-h-96.5 max-w-3xl mx-auto lg:col-span-1 mt-10 lg:max-w-md bg-white border rounded-xl shadow-md p-6">

            {/* TITLE */}
            <h2 className="text-xl font-semibold mb-6">
                Order Summary
            </h2>

            {/* SUBTOTAL */}
            <div className="flex justify-between mb-3 text-gray-600">
                <span>Subtotal</span>
                <span>${summary.subtotal.toFixed(2)}</span>
            </div>

            {/* SHIPPING */}
            <div className="flex justify-between mb-3 text-gray-600">
                <span>Shipping</span>
                <span>${summary.shipping.toFixed(2)}</span>
            </div>

            {/* DISCOUNT */}
            <div className="flex justify-between mb-4 text-rose-500">
                <span>Discount</span>
                <span>- ${summary.discount.toFixed(2)}</span>
            </div>

            <hr className="mb-4" />

            {/* TOTAL */}
            <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span>${summary.total.toFixed(2)}</span>
            </div>

            {/* CHECKOUT BUTTON */}
            <Link to="/checkout">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
                    Proceed to Checkout
                </button>
            </Link>

            {/* CONTINUE SHOPPING */}
            <Link to="/products">
                <button className="w-full mt-3 border border-gray-300 hover:bg-gray-100 py-3 rounded-lg transition">
                    Continue Shopping
                </button>
            </Link>

        </div>
    )
}