import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bounce, toast } from "react-toastify";
import { Country, State, City } from "country-state-city";
import { useDispatch } from "react-redux";
import { addNewAddress, fetchAddresses, updateAddress } from "../../store/actions";
import { useNavigate } from "react-router-dom";

const XIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const ChevronIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const fieldBase = `
    w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800
    placeholder-slate-400 outline-none transition-all duration-150
    focus:border-blue-400 focus:ring-2 focus:ring-blue-100
    disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
`;

const selectBase = `
    w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800
    outline-none transition-all duration-150 appearance-none cursor-pointer
    focus:border-blue-400 focus:ring-2 focus:ring-blue-100
    disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
`;

const Label = ({ children, required }) => (
    <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide uppercase">
        {children}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
);

const SelectWrapper = ({ children }) => (
    <div className="relative">
        {children}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <ChevronIcon />
        </span>
    </div>
);

export const UpdateAddressInfoModal = ({ open, onClose, address }) => {
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        fullName: address.fullName,
        street: address.street,
        city: address.city,
        zipcode: address.zipcode,
        country: address.country,
        state: address.state,
        phoneNumber: address.phoneNumber,
    });

    const countries = useMemo(() => Country.getAllCountries(), []);

    const states = useMemo(() => {
        if (!form.country) return [];
        return State.getStatesOfCountry(form.country);
    }, [form.country]);

    const cities = useMemo(() => {
        if (!form.country || !form.state) return [];
        return City.getCitiesOfState(form.country, form.state);
    }, [form.country, form.state]);

    const selectedCountry = countries.find((c) => c.isoCode === form.country);

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSave = (address) => {
        if (!form.fullName || !form.street || !form.country || !form.phoneNumber) {
            toast.error("Please fill required fields", { transition: Bounce });
            return;
        }

        if (!/^[0-9]{8,15}$/.test(form.phoneNumber)) {
            toast.error("Invalid phone number", { transition: Bounce });
            return;
        }

        dispatch(updateAddress(form, address));
        onClose();
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <style>{`@import url('https://fonts.googleapis.com/css2?family=Reddit+Sans:ital,wght@0,200..900;1,200..900&display=swap');
                    .addr-modal * { font-family: 'Reddit Sans', sans-serif; }`}</style>

                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)" }}
                        onClick={handleBackdropClick}
                    >
                        {/* Modal panel */}
                        <motion.div
                            key="modal"
                            initial={{ opacity: 0, y: 24, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 16, scale: 0.97 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            className="addr-modal relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
                            style={{ boxShadow: "0 24px 64px rgba(15,23,42,0.18)" }}
                        >
                            {/* Header */}
                            <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">Update Address</h2>
                                    <p className="text-xs text-slate-400 mt-0.5">Fill in the details below</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-150"
                                >
                                    <XIcon />
                                </button>
                            </div>

                            {/* Form body */}
                            <div className="px-6 py-5 max-h-[60vh] overflow-y-auto space-y-4">

                                {/* Full Name */}
                                <div>
                                    <Label required>Full Name</Label>
                                    <input
                                        className={fieldBase}
                                        placeholder="John Doe"
                                        value={form.fullName}
                                        onChange={handleChange("fullName")}
                                    />
                                </div>

                                {/* Street */}
                                <div>
                                    <Label required>Street Address</Label>
                                    <input
                                        className={fieldBase}
                                        placeholder="123 Main St, Apt 4B"
                                        value={form.street}
                                        onChange={handleChange("street")}
                                    />
                                </div>

                                {/* Country */}
                                <div>
                                    <Label required>Country</Label>
                                    <SelectWrapper>
                                        <select
                                            className={selectBase}
                                            value={form.country}
                                            onChange={(e) =>
                                                setForm({ ...form, country: e.target.value, state: "", city: "" })
                                            }
                                        >
                                            <option value="">Select country…</option>
                                            {countries.map((c) => (
                                                <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                                            ))}
                                        </select>
                                    </SelectWrapper>
                                </div>

                                {/* State + City row */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label>State / Province</Label>
                                        <SelectWrapper>
                                            <select
                                                className={selectBase}
                                                value={form.state}
                                                disabled={!form.country}
                                                onChange={(e) =>
                                                    setForm({ ...form, state: e.target.value, city: "" })
                                                }
                                            >
                                                <option value="">Select state…</option>
                                                {states.map((s) => (
                                                    <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                                                ))}
                                            </select>
                                        </SelectWrapper>
                                    </div>

                                    <div>
                                        <Label>City</Label>
                                        <SelectWrapper>
                                            <select
                                                className={selectBase}
                                                value={form.city}
                                                disabled={!form.state}
                                                onChange={handleChange("city")}
                                            >
                                                <option value="">Select city…</option>
                                                {cities.map((c) => (
                                                    <option key={c.name} value={c.name}>{c.name}</option>
                                                ))}
                                            </select>
                                        </SelectWrapper>
                                    </div>
                                </div>

                                {/* Zip Code */}
                                <div>
                                    <Label>Zip / Postal Code</Label>
                                    <input
                                        className={fieldBase}
                                        placeholder="10001"
                                        value={form.zipcode}
                                        onChange={handleChange("zipcode")}
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <Label required>Phone Number</Label>
                                    <div className="flex gap-2">
                                        {/* Country code pill */}
                                        <div className="flex items-center px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-500 whitespace-nowrap select-none min-w-[64px] justify-center">
                                            +{selectedCountry?.phonecode || "—"}
                                        </div>
                                        <input
                                            className={`${fieldBase} flex-1`}
                                            type="tel"
                                            placeholder="912 345 678"
                                            value={form.phoneNumber}
                                            onChange={handleChange("phoneNumber")}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Footer actions */}
                            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
                                <button
                                    onClick={onClose}
                                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all duration-150"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleSave(address)}
                                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-all duration-150 shadow-sm"
                                    style={{ boxShadow: "0 4px 12px rgba(59,130,246,0.3)" }}
                                >
                                    Save Address
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};