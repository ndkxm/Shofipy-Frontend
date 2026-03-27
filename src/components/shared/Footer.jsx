import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaShoppingBag } from "react-icons/fa";

export const Footer = () => {
    return (
        <footer className="max-w-[1530px] mx-auto bg-slate-900 text-white mt-20">
            <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
                {/* Logo + Description */}
                <div>
                    <div className="flex items-center gap-2 text-2xl font-bold mb-4">
                        <FaShoppingBag />
                        Shofipy
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Where quality meets convenience. Discover amazing products with
                        great deals and fast delivery.
                    </p>
                </div>
                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Shop</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li><Link to="/" className="hover:text-white">Home</Link></li>
                        <li><Link to="/products" className="hover:text-white">Products</Link></li>
                        <li><Link to="/about" className="hover:text-white">About us</Link></li>
                        <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                    </ul>
                </div>
                {/* Customer */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Customer</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li className="hover:text-white cursor-pointer">FAQ</li>
                        <li className="hover:text-white cursor-pointer">Shipping</li>
                        <li className="hover:text-white cursor-pointer">Returns</li>
                        <li className="hover:text-white cursor-pointer">Privacy Policy</li>
                    </ul>
                </div>
                {/* Social */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Follow us</h3>
                    <div className="flex gap-4 text-xl">
                        <FaFacebook className="cursor-pointer hover:text-blue-500 transition" />
                        <FaInstagram className="cursor-pointer hover:text-pink-500 transition" />
                        <FaTwitter className="cursor-pointer hover:text-sky-400 transition" />
                    </div>
                    <p className="text-gray-400 text-sm mt-4">
                        Stay connected for updates and deals.
                    </p>
                </div>
            </div>
            {/* Bottom */}
            <div className="border-t border-slate-700 text-center py-4 text-gray-400 text-sm">
                © {new Date().getFullYear()} Shofipy. All rights reserved.
            </div>
        </footer>
    );
};