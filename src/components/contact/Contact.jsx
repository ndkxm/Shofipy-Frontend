import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { Header } from "../shared/Header";
import { Footer } from "../shared/Footer";

export const Contact = () => {
    return (
        <div>
            <Header />
            {/* Banner */}
            <section className="max-w-[1530px] mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-24 text-center mt-22">
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                    Contact Us
                </h1>
                <p className="text-lg opacity-90">
                    We'd love to hear from you. Get in touch with our team.
                </p>
            </section>
            {/* Contact section */}
            <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16">
                {/* Contact Info */}
                <div>
                    <h2 className="text-3xl font-bold mb-8">
                        Get in touch
                    </h2>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <FaMapMarkerAlt className="text-blue-600 text-xl" />
                            <p>Phu Yen, Vietnam</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <FaPhone className="text-blue-600 text-xl" />
                            <p>+84 123 456 789</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <FaEnvelope className="text-blue-600 text-xl" />
                            <p>support@shofipy.com</p>
                        </div>
                    </div>
                    {/* Map */}
                    <div className="mt-10 h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
                        Map placeholder
                    </div>
                </div>
                {/* Contact Form */}
                <div>
                    <h2 className="text-3xl font-bold mb-8">
                        Send a message
                    </h2>
                    <form className="space-y-6">
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                        />
                        <textarea
                            rows="5"
                            placeholder="Your Message"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                        />
                        <button
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </section>
            <Footer />
        </div>
    );
};