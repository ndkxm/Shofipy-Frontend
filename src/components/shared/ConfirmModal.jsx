export const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-51">

            <div className="bg-white rounded-xl shadow-lg w-[400px] p-6">

                <h2 className="text-lg font-semibold mb-4">
                    Confirmation
                </h2>

                <p className="text-gray-600 mb-6">
                    {message}
                </p>

                <div className="flex justify-end gap-3">

                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer transition-all duration-500"
                    >
                        No
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-700 cursor-pointer transition-all duration-500"
                    >
                        Yes
                    </button>

                </div>

            </div>

        </div>
    );
};