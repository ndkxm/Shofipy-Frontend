import { FaShoppingBag } from "react-icons/fa"
import { Link } from "react-router-dom"

export const Banner = () => {
    return (
        <section className="max-w-[1530px] mx-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-24 mt-14">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 items-center gap-12">
                {/* Text */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <FaShoppingBag size={30} />
                        <span className="text-2xl font-semibold">Shofipy</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                        Your Ultimate Gaming Destination.
                    </h1>
                    <p className="text-lg opacity-90 mb-8">
                        Discover the latest hits, timeless classics, and exclusive deals. Join our community and build your dream game library today.
                    </p>
                    <Link to={{ pathname: "/products" }} className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 backdrop-blur-md">
                        Explore Games
                    </Link>
                </div>
                {/* Image */}
                <div className="flex justify-center">
                    <img
                        src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
                        alt="gaming"
                        className="rounded-2xl shadow-2xl w-full max-w-md hover:scale-105 transition duration-500"
                    />
                </div>
            </div>
        </section>
    )
}