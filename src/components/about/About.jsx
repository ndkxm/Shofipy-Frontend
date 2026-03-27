import { FaShieldAlt, FaShippingFast, FaShoppingBag, FaTags } from "react-icons/fa"
import { Header } from "../shared/Header"
import { Link } from "react-router-dom"
import { Banner } from "./Banner"
import { OurMission } from "./OurMission"
import { WhyChooseUs } from "./WhyChooseUs"
import { CallToAction } from "./CallToAction"
import { Footer } from "../shared/Footer"

export const About = () => {
    return (
        <div>
            <Header />
            <Banner />
            <OurMission />
            <WhyChooseUs />
            <CallToAction />
            <Footer/>
        </div>
    )
}