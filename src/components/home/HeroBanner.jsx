import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import bannerLists from "../utils/BannerLists";
import { Link } from "react-router-dom";

export const HeroBanner = () => {
    return (
        <div className="mt-16 lg:mt-24 w-full">

            <Swiper
                grabCursor
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false
                }}
                navigation
                pagination={{ clickable: true }}
                modules={[Pagination, Navigation, Autoplay]}
                slidesPerView={1}
            >
                {
                    bannerLists.map((item, i) => (
                        <SwiperSlide key={i}>

                            <div
                                className="
                                relative
                                min-h-[420px]
                                lg:min-h-[550px]
                                bg-cover
                                bg-center
                                flex items-center
                                "
                                style={{ backgroundImage: `url(${item.background})` }}
                            >

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

                                {/* Content */}
                                <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center w-full">

                                    {/* Left text */}
                                    <div className="text-white">

                                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                                            {item.title}
                                        </h2>

                                        <h3 className="text-lg md:text-2xl font-semibold mb-4 text-blue-200">
                                            {item.subtitle}
                                        </h3>

                                        <p className="text-sm md:text-lg text-gray-200 max-w-lg mb-8">
                                            {item.description}
                                        </p>

                                        <Link
                                            to="/products"
                                            className="
                                            inline-block
                                            px-8 py-3
                                            bg-blue-600
                                            hover:bg-blue-700
                                            rounded-full
                                            font-semibold
                                            shadow-lg
                                            hover:shadow-xl
                                            transition-all
                                            duration-300
                                            "
                                        >
                                            Shop Now
                                        </Link>

                                    </div>

                                    {/* Right image */}
                                    <div className="flex justify-center">

                                        <img
                                            src={item.image}
                                            alt=""
                                            className="
                                            w-[280px]
                                            md:w-[350px]
                                            lg:w-[420px]
                                            drop-shadow-2xl
                                            transition-transform
                                            duration-500
                                            hover:scale-105
                                            "
                                        />

                                    </div>

                                </div>

                            </div>

                        </SwiperSlide>
                    ))
                }

            </Swiper>

        </div>
    );
};