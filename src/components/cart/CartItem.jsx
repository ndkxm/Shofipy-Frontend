import { TruncateText } from "../utils/TruncateText"
import { FiTrash2 } from "react-icons/fi"
import { SetQuantity } from "./SetQuantity"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { decreaseProductInCart, fetchUserCart, increaseProductInCart, removeProductFromCart } from "../../store/actions";
import { ConfirmModal } from "../shared/ConfirmModal";

export const CartItem = ({ product }) => {
    const [currentQuantity, setCurrentQuantity] = useState(product.quantity);
    const [open, setOpen] = useState(false);
    const { cartId } = useSelector((state) => state.carts);
    
    const dispatch = useDispatch();

    const handleQtyIncrease = (product) => {
        dispatch(increaseProductInCart(product, currentQuantity, setCurrentQuantity))
    }

    const handleQtyDecrease = (product) => {
        dispatch(decreaseProductInCart(product, currentQuantity, setCurrentQuantity))
    }

    const handleRemove = (product) => {
        dispatch(removeProductFromCart(product, cartId))
        dispatch(fetchUserCart());
        setOpen(false);
    };

    return (
        <div className="w-full lg:max-w-[600px]  max-w-xl mx-auto mt-10 flex gap-4 p-4 border rounded-xl shadow-sm hover:shadow-md transition">

            {/* IMAGE */}
            <div className="lg:w-38 lg:h-35 w-25 h-22 flex-shrink-0 overflow-hidden rounded-lg">
                <img
                    src={product.image}
                    alt={product.productName}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
            </div>

            {/* INFO */}
            <div className="flex flex-col flex-1 justify-between">

                {/* NAME */}
                <div>
                    <h2 className="font-semibold text-lg cursor-pointer hover:text-blue-600">
                        {TruncateText(product.productName, 50)}
                    </h2>

                    <p className="text-gray-500 text-sm mt-1">
                        {TruncateText(product.description, 80)}
                    </p>
                </div>

                {/* PRICE + QUANTITY */}
                <div className="flex items-center justify-between mt-3 gap-2">

                    {/* PRICE */}
                    <div>
                        {product.specialPrice ? (
                            <div>
                                <span className="text-gray-400 line-through mr-2 text-sm">
                                    ${product.price.toFixed(2)}
                                </span>

                                <span className="text-rose-600 font-bold text-lg">
                                    ${product.specialPrice.toFixed(2)}
                                </span>
                            </div>
                        ) : (
                            <span className="font-bold text-lg">
                                ${product.price.toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* QUANTITY */}
                    <SetQuantity
                        quantity={currentQuantity}
                        handleQtyDecrease={() => handleQtyDecrease(product)}
                        handleQtyIncrease={() => handleQtyIncrease(product)}
                    />
                    {/* REMOVE */}
                    <button className="text-gray-400 hover:text-red-500" onClick={() => setOpen(true)}>
                        <FiTrash2 size={20} />
                    </button>

                </div>
            </div>

            <ConfirmModal
                isOpen={open}
                message={`Are you sure you want to remove "${product.productName}" from cart?`}
                onConfirm={() => handleRemove(product)}
                onCancel={() => setOpen(false)}
            />
        </div>
    )
}