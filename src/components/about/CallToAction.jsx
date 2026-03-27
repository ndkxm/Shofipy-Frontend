import { Link } from "react-router-dom"

export const CallToAction = () => {
    return (
        <section className="max-w-[1530px] mx-auto py-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">
                        Ready to start shopping?
                    </h2>
                    <p className="text-lg mb-8 opacity-90">
                        Discover thousands of products with great prices today.
                    </p>
                    <Link
                        to="/products"
                        className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                    >
                        Browse Products
                    </Link>
                </div>
            </section>
    )
}