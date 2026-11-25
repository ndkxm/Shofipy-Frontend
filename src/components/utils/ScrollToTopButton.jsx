import { useEffect, useState } from "react"
import { FaArrowUp } from "react-icons/fa"

export const ScrollToTopButton = () => {

    const [visible, setVisible] = useState(false)

    useEffect(() => {

        const handleScroll = () => {
            setVisible(window.scrollY > 300)
        }

        window.addEventListener("scroll", handleScroll)

        return () => window.removeEventListener("scroll", handleScroll)

    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    return (
        <button aria-label="Back to top"
            onClick={scrollToTop}
            className={`
                fixed bottom-6 right-6
                bg-slate-900 hover:bg-blue-600 border border-slate-50
                text-white w-11 h-11 grid place-items-center rounded-md
                transition-all duration-300
                ${visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10 pointer-events-none"}
            `}
        >
            <FaArrowUp size={18}/>
        </button>
    )
}