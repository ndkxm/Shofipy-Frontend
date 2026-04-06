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
                    background: rgba(255,255,255,0.15) !important;
                    backdrop-filter: blur(8px) !important;
                    border-radius: 12px !important;
                    border: 1px solid rgba(255,255,255,0.25) !important;
                    color: white !important;
                    transition: background 0.2s !important;
                }
                .swiper-button-next:hover,
                .swiper-button-prev:hover {
                    background: rgba(255,255,255,0.28) !important;
                }
                .swiper-button-next::after,
                .swiper-button-prev::after {
                    font-size: 13px !important;
                    font-weight: 700 !important;
                }
                .swiper-pagination-bullet {
                    background: rgba(255,255,255,0.5) !important;
                    width: 6px !important;
                    height: 6px !important;
                    transition: all 0.2s !important;
                }
                .swiper-pagination-bullet-active {
                    background: white !important;
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
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />

                                {/* Content */}
                                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-10 items-center w-full py-12">

                                    {/* Left */}
                                    <div className="text-white">
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                        >
                                            {/* Eyebrow */}
                                            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-3.5 py-1.5 mb-5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                                                <span className="text-xs font-semibold text-white/90 tracking-wide uppercase">
                                                    {item.subtitle}
                                                </span>
                                            </div>

                                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight tracking-tight">
                                                {item.title}
                                            </h2>

                                            <p className="text-sm md:text-base text-white/75 max-w-md mb-8 leading-relaxed">
                                                {item.description}
                                            </p>

                                            <Link
                                                to="/products"
                                                className="inline-flex items-center gap-2 px-7 py-3 bg-white text-slate-900 hover:bg-blue-50 rounded-2xl font-bold text-sm shadow-lg transition-all duration-200"
                                                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}
                                            >
                                                Shop Now
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="9 18 15 12 9 6" />
                                                </svg>
                                            </Link>
                                        </motion.div>
                                    </div>

                                    {/* Right */}
                                    <div className="hidden lg:flex justify-center">
                                        <motion.img
                                            initial={{ opacity: 0, scale: 0.92 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                                            src={item.image}
                                            alt={item.title}
                                            className="w-[320px] lg:w-[400px] object-contain drop-shadow-2xl"
                                        />
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};