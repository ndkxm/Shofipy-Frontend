import { useState } from "react"
import { FaShoppingCart } from "react-icons/fa";
import ProductViewModal from "./ProductViewModal";
import { TruncateText } from "../utils/TruncateText";
import { useDispatch } from "react-redux";
import { addProductToCart } from "../../store/actions";

const ProductCard = ({
    productId,
    productName,
    image,
    description,
    quantity,
    price,
    discount,
    specialPrice
}) => {
    const [openProductViewModal, setOpenProductViewModal] = useState(false);
    const btnLoader = false;
    const [selectedViewProduct, setSelectedViewProduct] = useState("");
    const isAvailable = quantity && Number(quantity) > 0;
    const dispatch = useDispatch();

    const handleProductView = (product) => {
        setSelectedViewProduct(product);
        setOpenProductViewModal(true);
    };

    const handleAddProductToCart = (cartItems) => {
        dispatch(addProductToCart(cartItems, 1));
    }

    return (
        <div className="group rounded-2xl border border-gray-200 
bg-white/80 backdrop-blur-md
shadow-sm hover:shadow-2xl 
transition-all duration-300 hover:-translate-y-1
overflow-hidden cursor-pointer">

            {/* Image */}
            <div
                onClick={() => {
                    handleProductView({
                        productId,
                        productName,
                        image,
                        description,
                        quantity,
                        price,
                        discount,
                        specialPrice
                    })
                }}
                className="relative overflow-hidden aspect-[4/3]"
            >

                {/* Discount badge */}
                {specialPrice && (
                    <span className="absolute top-3 left-3 z-10 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow">
                        -{Number(discount * 100).toFixed(2)}%
                    </span>
                )}

                <img
                    src={image}
                    alt={productName}
                    className="w-full h-full object-cover 
            transition-transform duration-500 
            group-hover:scale-110"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition" />

            </div>

            {/* Content */}
            <div className="p-5">

                {/* Title */}
                <h2
                    className="text-lg font-semibold text-gray-900 
            group-hover:text-blue-600 transition"
                    onClick={() => {
                        handleProductView({
                            productId,
                            productName,
                            image,
                            description,
                            quantity,
                            price,
                            discount,
                            specialPrice
                        })
                    }}
                >
                    {TruncateText(productName, 35)}
                </h2>

                {/* Description */}
                <p className="text-sm text-gray-500 mt-2 min-h-[48px]">
                    {TruncateText(description, 60)}
                </p>

                {/* Price + button */}
                <div className="flex items-center justify-between mt-4">

                    {specialPrice ? (
                        <div className="flex flex-col">

                            <div className="flex items-center gap-2">
                                <span className="text-gray-400 line-through text-sm">
                                    ${Number(price).toFixed(2)}
                                </span>

                                <span className="text-rose-500 text-sm font-semibold">
                                    -{Number(discount * 100).toFixed(2)}%
                                </span>
                            </div>

                            <span className="text-xl font-bold text-rose-600">
                                ${Number(specialPrice).toFixed(2)}
                            </span>

                        </div>
                    ) : (
                        <span className="text-xl font-bold text-gray-900">
                            ${Number(price).toFixed(2)}
                        </span>
                    )}

                    {/* Button */}
                    <button
                        className={`flex items-center gap-2 
                px-4 py-2 rounded-full text-sm font-medium
                transition-all duration-200
                ${isAvailable
                                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        disabled={!isAvailable || btnLoader}
                        onClick={() => {
                            handleAddProductToCart({
                                productId,
                                productName,
                                image,
                                description,
                                quantity,
                                price,
                                discount,
                                specialPrice
                            })
                        }}
                    >
                        <FaShoppingCart />
                        {isAvailable ? "Add" : "Sold"}
                    </button>

                </div>

            </div>

        </div>
    )
}
export default ProductCard