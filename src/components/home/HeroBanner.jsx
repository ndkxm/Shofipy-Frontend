import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import bannerLists from "../utils/BannerLists";
import { Link } from "react-router-dom";

export const HeroBanner = () => {
    return (
        <div className="mt-16 lg:mt-[60px] w-full">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Reddit+Sans:wght@400;500;600;700;800&display=swap');
                .hero-wrap { font-family: 'Reddit Sans', sans-serif; }

                .swiper-button-next,
                .swiper-button-prev {
                    width: 40px !important;
                    height: 40px !important;
                    background: rgba(255,255,255,0.9) !important;
                    backdrop-filter: blur(8px) !important;
                    border-radius: 12px !important;
                    border: 1px solid rgba(0,0,0,0.08) !important;
                    color: #1e293b !important;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.1) !important;
                    transition: all 0.2s !important;
                }
                .swiper-button-next:hover,
                .swiper-button-prev:hover {
                    background: white !important;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
                }
                .swiper-button-next::after,
                .swiper-button-prev::after {
                    font-size: 13px !important;
                    font-weight: 700 !important;
                }
                .swiper-pagination-bullet {
                    background: rgba(0,0,0,0.2) !important;
                    width: 6px !important;
                    height: 6px !important;
                    transition: all 0.2s !important;
                }
                .swiper-pagination-bullet-active {
                    background: #3b82f6 !important;
                    width: 22px !important;
                    border-radius: 3px !important;
                }
            `}</style>

            <div className="hero-wrap">
                <Swiper
                    grabCursor
                    autoplay={{ delay: 4500, disableOnInteraction: false }}
                    navigation
                    pagination={{ clickable: true }}
                    modules={[Pagination, Navigation, Autoplay]}
                    slidesPerView={1}
                >
                    {bannerLists.map((item, i) => (
                        <SwiperSlide key={i}>
                            <div
                                className="relative min-h-[420px] lg:min-h-[540px] bg-cover bg-center flex items-center"
                                style={{ backgroundImage: `url(${item.background})` }}
                            >
                                {/* Light overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/60 to-white/10" />

                                {/* Decorative blobs */}
                                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                    <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[80%] bg-blue-100/60 rounded-full blur-[100px]" />
                                    <div className="absolute bottom-[-20%] left-[10%] w-[30%] h-[60%] bg-indigo-100/50 rounded-full blur-[80px]" />
                                </div>

                                {/* Content */}
                                <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 flex flex-col items-start w-full py-16">
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        {/* Eyebrow */}
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: 0.1 }}
                                            className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3.5 py-1.5 mb-5"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                            <span className="text-xs font-semibold text-blue-600 tracking-wide uppercase">
                                                {item.subtitle}
                                            </span>
                                        </motion.div>

                                        <motion.h2
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.15 }}
                                            className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight tracking-tight text-slate-900"
                                        >
                                            {item.title}
                                        </motion.h2>

                                        <motion.p
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.22 }}
                                            className="text-sm md:text-base text-slate-500 max-w-md mb-8 leading-relaxed"
                                        >
                                            {item.description}
                                        </motion.p>

                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: 0.3 }}
                                        >
                                            <Link
                                                to="/products"
                                                className="inline-flex items-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm transition-all duration-200"
                                                style={{ boxShadow: "0 4px 20px rgba(59,130,246,0.35)" }}
                                            >
                                                Shop Now
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="9 18 15 12 9 6" />
                                                </svg>
                                            </Link>
                                        </motion.div>
                                    </motion.div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};