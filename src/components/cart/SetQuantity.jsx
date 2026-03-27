export const SetQuantity = ({ quantity, handleQtyIncrease, handleQtyDecrease }) => {
    return (
        <div>
            <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                    className="px-2 py-1 hover:bg-gray-100"
                    onClick={handleQtyDecrease}
                >-</button>
                <span className="px-4">{quantity}</span>
                <button 
                className="px-3 py-1 hover:bg-gray-100"
                    onClick={handleQtyIncrease}
                >+</button>
            </div>
        </div>
    )
}