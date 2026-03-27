    import React, { useState } from "react";
    import { motion, AnimatePresence } from "framer-motion";
    import { useDispatch } from "react-redux";
    import { deleteAddress, saveSelectedAddress } from "../../store/actions";
    import { UpdateAddressInfoModal } from "./UpdateAddressInfoModal";

    const PhoneIcon = () => (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.7 3.41 2 2 0 0 1 3.67 1.25h3a2 2 0 0 1 2 1.72c.122.636.3 1.26.53 1.86a2 2 0 0 1-.45 2.11L7.91 8.9a16 16 0 0 0 6.08 6.08l1.01-1.01a2 2 0 0 1 2.11-.45c.6.23 1.224.408 1.86.53A2 2 0 0 1 22 16.92z" />
        </svg>
    );

    const LocationIcon = () => (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );

    const CheckIcon = ({ size = 14 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );

    const PersonIcon = () => (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );

    const TrashIcon = () => (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
    );

    const EditIcon = () => (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );

    const labelMeta = {
        Home: { icon: "🏠" },
        Office: { icon: "🏢" },
        Warehouse: { icon: "📦" },
    };

    export const AddressList = ({ addresses = [], onSelect, selectedAddress }) => {
        const [selectedId, setSelectedId] = useState(selectedAddress?.addressId);
        const [confirmDeleteId, setConfirmDeleteId] = useState(null);
        const [openUpdateAddressModal, setOpenUpdateAddressModal] = useState(false);
        const [editingAddress, setEditingAddress] = useState(null);

        const dispatch = useDispatch();

        const handleSelect = (e, address) => {
            e.stopPropagation();
            setSelectedId(address.addressId);
            if (onSelect) onSelect(address);
            dispatch(saveSelectedAddress(address));
        };

        const handleDeleteClick = (e, id) => {
            e.stopPropagation();
            setConfirmDeleteId(id);
        };

        const handleConfirmDelete = (e, address) => {
            e.stopPropagation();
            if (selectedId === address.addressId) setSelectedId(null);
            setConfirmDeleteId(null);
            dispatch(deleteAddress(address));
        };

        const handleCancelDelete = (e) => {
            e.stopPropagation();
            setConfirmDeleteId(null);
        };

        const handleEditClick = (e, address) => {
            e.stopPropagation();
            setEditingAddress(address);
            setOpenUpdateAddressModal(true);
        };

        const selected = addresses.find((a) => a.addressId === selectedId);

        return (
            <>
                <style>{`@import url('https://fonts.googleapis.com/css2?family=Reddit+Sans:ital,wght@0,200..900;1,200..900&display=swap');
            .addr-wrap * { font-family: 'Reddit Sans', sans-serif; }
            .addr-card { transition: box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease; }
            .addr-card:hover { box-shadow: 0 4px 16px rgba(59,130,246,0.12); }
            .addr-card.selected { box-shadow: 0 0 0 2px #3b82f6, 0 4px 20px rgba(59,130,246,0.15); }
            .addr-card.confirming { box-shadow: 0 0 0 2px #ef4444, 0 4px 20px rgba(239,68,68,0.12); }
            .delete-btn { transition: background 0.15s ease, color 0.15s ease; }
            .delete-btn:hover { background: #fef2f2 !important; color: #ef4444 !important; border-color: #fca5a5 !important; }
            .edit-btn { transition: background 0.15s ease, color 0.15s ease; }
            .edit-btn:hover { background: #eff6ff !important; color: #3b82f6 !important; border-color: #93c5fd !important; }
        `}</style>

                <div className="addr-wrap w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-4">
                        {addresses.map((addr, i) => {
                            const isSelected = selectedId === addr.addressId;
                            const isConfirming = confirmDeleteId === addr.addressId;
                            const meta = labelMeta[addr.label] || { icon: "📍" };

                            return (
                                <motion.div
                                    key={addr.addressId}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                    transition={{ duration: 0.3, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                                    onClick={(e) => !isConfirming && handleSelect(e, addr)}
                                    className={`addr-card relative rounded-2xl cursor-pointer border bg-white flex flex-col
                                        ${isConfirming ? "confirming border-red-400 bg-red-50" : isSelected ? "selected border-blue-500 bg-blue-50" : "border-slate-200"}`}
                                >
                                    {/* Body */}
                                    <div className="p-4 flex-1">
                                        {/* Badges */}
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`text-xs font-semibold rounded-lg px-2.5 py-1 flex items-center gap-1
                                                ${isConfirming ? "bg-red-100 text-red-500" : isSelected ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}>
                                                {meta.icon} {addr.label || "Address"}
                                            </span>
                                            {addr.isDefault && (
                                                <span className="text-xs font-semibold rounded-lg px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200">
                                                    ✓ Default
                                                </span>
                                            )}
                                        </div>

                                        {/* Name */}
                                        <div className="flex items-center gap-2 mb-2.5">
                                            <span className={`flex items-center justify-center w-6 h-6 rounded-lg flex-shrink-0
                                                ${isConfirming ? "bg-red-100 text-red-400" : isSelected ? "bg-blue-100 text-blue-500" : "bg-slate-100 text-slate-400"}`}>
                                                <PersonIcon />
                                            </span>
                                            <span className="text-sm font-bold text-slate-800">
                                                {addr.fullName}
                                            </span>
                                        </div>

                                        {/* Phone */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`flex items-center justify-center w-6 h-6 rounded-lg flex-shrink-0
                                                ${isConfirming ? "bg-red-100 text-red-400" : isSelected ? "bg-blue-100 text-blue-500" : "bg-slate-100 text-slate-400"}`}>
                                                <PhoneIcon />
                                            </span>
                                            <span className="text-sm text-slate-500">{addr.phoneNumber}</span>
                                        </div>

                                        {/* Address */}
                                        <div className="flex items-start gap-2">
                                            <span className={`flex items-center justify-center w-6 h-6 rounded-lg flex-shrink-0 mt-0.5
                                                ${isConfirming ? "bg-red-100 text-red-400" : isSelected ? "bg-blue-100 text-blue-500" : "bg-slate-100 text-slate-400"}`}>
                                                <LocationIcon />
                                            </span>
                                            <span className="text-sm text-slate-500 leading-relaxed">
                                                {addr.street}, {addr.city}, {addr.state}, {addr.country}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="mx-4 border-t border-slate-100" />

                                    {/* Footer */}
                                    <div className="px-4 py-3 flex items-center justify-between">
                                        <AnimatePresence mode="wait">
                                            {isConfirming ? (
                                                <motion.div
                                                    key="confirm"
                                                    initial={{ opacity: 0, x: -6 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -6 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="flex items-center gap-2"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <span className="text-xs text-red-500 font-medium mr-1">Delete this address?</span>
                                                    <button
                                                        onClick={(e) => handleConfirmDelete(e, addr)}
                                                        className="text-xs font-semibold rounded-xl px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white transition-colors duration-150"
                                                    >
                                                        Yes, delete
                                                    </button>
                                                    <button
                                                        onClick={handleCancelDelete}
                                                        className="text-xs font-semibold rounded-xl px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors duration-150"
                                                    >
                                                        Cancel
                                                    </button>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="normal"
                                                    initial={{ opacity: 0, x: 6 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 6 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="flex items-center gap-2"
                                                >
                                                    <button
                                                        onClick={(e) => {  handleSelect(e, addr); }}
                                                        className={`flex items-center gap-1.5 text-sm font-semibold rounded-xl px-4 py-1.5 transition-all duration-200 ${isSelected
                                                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                                                            : "bg-white hover:bg-blue-50 text-blue-500 border border-blue-200 hover:border-blue-400"
                                                            }`}
                                                    >
                                                        {isSelected && <CheckIcon size={13} />}
                                                        {isSelected ? "Selected" : "Select"}
                                                    </button>

                                                    <button
                                                        onClick={(e) => handleEditClick(e, addr)}
                                                        className="edit-btn flex items-center gap-1.5 text-sm font-semibold rounded-xl px-3 py-1.5 bg-white border border-slate-200 text-slate-400"
                                                    >
                                                        <EditIcon />
                                                    </button>

                                                    <button
                                                        onClick={(e) => handleDeleteClick(e, addr.addressId)}
                                                        className="delete-btn flex items-center gap-1.5 text-sm font-semibold rounded-xl px-3 py-1.5 bg-white border border-slate-200 text-slate-400"
                                                    >
                                                        <TrashIcon />
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {!isConfirming && (
                                            <span className="text-xs text-slate-400">{addr.label || "Address"}</span>
                                        )}
                                    </div>

                                    {/* Floating check badge */}
                                    <AnimatePresence>
                                        {isSelected && !isConfirming && (
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                                                className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white"
                                            >
                                                <CheckIcon size={10} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Summary bar */}
                    <AnimatePresence>
                        {selected && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 8 }}
                                transition={{ duration: 0.25 }}
                                className="mt-4 rounded-2xl px-4 py-3 flex items-center gap-3 bg-blue-50 border border-blue-200"
                            >
                                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center flex-shrink-0">
                                    <LocationIcon />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium mb-0.5">Delivering to</p>
                                    <p className="text-sm font-semibold text-slate-700">
                                        {selected.fullName} — {selected.street}, {selected.city}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {editingAddress && (
                    <UpdateAddressInfoModal
                        open={openUpdateAddressModal}
                        onClose={() => {
                            setOpenUpdateAddressModal(false);
                            setEditingAddress(null);
                        }}
                        address={editingAddress}
                    />
                )}
            </>
        );
    };