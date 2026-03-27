import { Avatar } from "@mui/material";
import Badge from "@mui/material/Badge";
import { useState } from "react";
import { FaShoppingBag, FaShoppingCart, FaBars } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { UserMenu } from "./UserMenu";

export const Header = () => {

    const [navBarOpen, setNavBarOpen] = useState(false);
    const { cart } = useSelector((state) => state.carts);
    const { user } = useSelector((state) => state.auth)

    return (
        <div className="fixed top-0 left-0 z-50 w-full bg-white font-sans shadow mx-auto">

            {/* Top bar */}
            <div className="max-w-7xl mx-auto lg:px-5 lg:py-6 px-2 py-3 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 hover:text-blue-700 transition-all duration-300">
                    <FaShoppingBag className="size-5 lg:size-8" />
                    <span className="font-bold text-2xl lg:text-4xl">Shofipy</span>
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden lg:flex gap-12 text-xl font-bold items-center">

                    <li className="hover:text-blue-500 transition-all duration-300"><Link to="/">Home</Link></li>
                    <li className="hover:text-blue-500 transition-all duration-300"><Link to="/products">Products</Link></li>
                    <li className="hover:text-blue-500 transition-all duration-300"><Link to="/contact">Contact</Link></li>
                    <li className="hover:text-blue-500 transition-all duration-300"><Link to="/about">About us</Link></li>

                    <li className="hover:text-blue-500 transition-all duration-300 cursor-pointer">
                        <Link to={{ pathname: "/cart" }}>
                            <Badge
                                showZero
                                badgeContent={cart?.length || 0}
                                color="primary"
                                overlap="circular"
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            >
                                <FaShoppingCart size={25} />
                            </Badge>
                        </Link>
                    </li>

                    {
                        (user && user.username) ? (
                            <UserMenu user={user} />
                        ) : (
                            <div className="flex items-center gap-10">
                                <li className="hover:text-blue-500 transition-all duration-300"><Link to="/signin">Login</Link></li>

                                <li className="px-4 py-2 bg-blue-600 rounded-2xl hover:bg-blue-800 transition-all duration-300">
                                    <Link to="/register" className="text-white">
                                        Register
                                    </Link>
                                </li>
                            </div>
                        )
                    }

                </ul>

                {/* Hamburger */}
                <button
                    className="lg:hidden text-2xl"
                    onClick={() => setNavBarOpen(!navBarOpen)}
                >
                    <FaBars />
                </button>

            </div>

            {/* Mobile Menu */}
            {navBarOpen && (
                <ul className="lg:hidden flex flex-col gap-4 text-lg font-semibold bg-white border-t border-slate-400">

                    <li className="px-5 pt-4 hover:text-blue-500 transition-all duration-300"><Link to="/">
                        Home
                    </Link></li>
                    <li className="px-5 hover:text-blue-500 transition-all duration-300"><Link to="/products">Products</Link></li>
                    <li className="px-5 hover:text-blue-500 transition-all duration-300"><Link to="/contact">Contact</Link></li>
                    <li className="px-5 hover:text-blue-500 transition-all duration-300"><Link to="/about">About us</Link></li>

                    <li>
                        <Link to="/cart" className="flex items-center gap-2 px-5 hover:text-blue-500 transition-all duration-300">
                            Cart
                        </Link>
                    </li>

                    {
                        (user && user.username) ? (
                            <div className="px-5 mb-5">
                                <UserMenu user={user} />
                            </div>
                        ) : (
                            <div>
                                <li><Link className="px-5 hover:text-blue-500 transition-all duration-300" to="/signin">Login</Link></li>
                                <li>
                                    <Link
                                        to="/register"
                                        className="block mt-5 bg-blue-600 text-white text-center py-2 rounded-xl mb-5 mx-5 hover:bg-blue-900 transition-all duration-300"
                                    >
                                        Register
                                    </Link>
                                </li>
                            </div>
                        )
                    }
                </ul>
            )}
        </div>
    );
}