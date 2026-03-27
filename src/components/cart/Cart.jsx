import { FaArrowLeft } from "react-icons/fa"
import { Header } from "../shared/Header"
import { Link } from "react-router-dom"
import { CartItem } from "./CartItem"
import { Footer } from "../shared/Footer"
import { useSelector } from "react-redux"
import { CheckOut } from "./CartInfo"

export const Cart = () => {
    const { cart } = useSelector((state) => state.carts);
    const newCart = { ...cart };
    newCart.totalPrice = cart?.reduce(
        (acc, cur) => acc + (Number(cur?.specialPrice) * Number(cur?.quantity)),
        0
    );

    const summary = {
        subtotal: newCart.totalPrice,
        total: newCart.totalPrice,
        shipping: 0,
        discount: 0
    }
    
    return (
        <div>
            <Header />
            <section className="lg:mt-35 mt-25 max-w-7xl mx-auto lg:px-5 px-2">
                <h1 className="text-2xl lg:text-4xl font-bold">
                    Your Basket
                </h1>
            </section>
            <section className="max-w-7xl grid lg:grid-cols-3  mx-auto lg:px-5 px-2">
                <div className="lg:col-span-2">
                    {
                        cart && cart.length > 0 ? (
                            cart.map((item) => <CartItem key={item.productId} product={item} />)
                        ) : (
                            <div className="font-bold text-center text-3xl text-gray-500 py-10">Your basket is empty.</div>
                        )
                    }
                </div>
                <CheckOut summary={summary}/>
            </section>
            <Footer />
        </div>
    )
}