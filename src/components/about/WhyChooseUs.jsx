import { FaShieldAlt, FaShippingFast, FaTags } from "react-icons/fa"

export const WhyChooseUs = () => {
    return (
        <section className="max-w-[1530px] mx-auto py-20">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold mb-12">
                    Why Choose Us
                </h2>
                <div className="grid md:grid-cols-3 gap-10">
                    <div className="p-6 rounded-xl hover: transition-all">
                        <FaShippingFast className="text-4xl text-blue-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                        <p className="text-gray-600">
                            Get your orders delivered quickly and reliably.
                        </p>
                    </div>
                    <div className="p-6 rounded-xl hover: transition-all">
                        <FaShieldAlt className="text-4xl text-blue-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
                        <p className="text-gray-600">
                            Your transactions and data are always protected.
                        </p>
                    </div>

                    <div className="p-6 rounded-xl hover: transition-all">
                        <FaTags className="text-4xl text-blue-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
                        <p className="text-gray-600">
                            We offer competitive prices on all products.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}