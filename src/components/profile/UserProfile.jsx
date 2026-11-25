import { useCallback, useEffect, useRef, useState } from "react";
import {
    Camera,
    Check,
    Edit3,
    Eye,
    EyeOff,
    KeyRound,
    Loader2,
    Lock,
    Mail,
    Save,
    Shield,
    User,
    X,
    ZoomIn,
    ZoomOut,
    CalendarDays,
    BadgeCheck,
    ShoppingBag,
} from "lucide-react";
import api from "../../api/api";
import { Bounce, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthInfo } from "../../store/actions";
import { Header } from "../shared/Header";
import { Link } from "react-router-dom";


const showError = (msg) =>
    toast.error(msg, {
        position: "bottom-right", autoClose: 5000,
        hideProgressBar: false, closeOnClick: false,
        pauseOnHover: true, draggable: true,
        theme: "light", transition: Bounce,
    });

const showSuccess = (msg) =>
    toast.success(msg, {
        position: "bottom-right", autoClose: 3000,
        hideProgressBar: true, closeOnClick: true,
        pauseOnHover: true, draggable: true,
        theme: "light", transition: Bounce,
    });



const AvatarCropper = ({ imageSrc, onCrop, onCancel }) => {
    const canvasRef = useRef(null);
    const imgRef = useRef(null);
    const containerRef = useRef(null);
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const dragStart = useRef(null);

    const CANVAS_SIZE = 280;

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const img = imgRef.current;
        if (!canvas || !img) return;

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        ctx.fillStyle = "rgba(241, 245, 249, 0.85)";
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        ctx.save();
        ctx.beginPath();
        ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 8, 0, Math.PI * 2);
        ctx.clip();
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        const scale = zoom * (CANVAS_SIZE / Math.min(img.naturalWidth, img.naturalHeight));
        const w = img.naturalWidth * scale;
        const h = img.naturalHeight * scale;
        const x = (CANVAS_SIZE - w) / 2 + offset.x;
        const y = (CANVAS_SIZE - h) / 2 + offset.y;

        ctx.drawImage(img, x, y, w, h);
        ctx.restore();

        ctx.beginPath();
        ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 8, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(139, 92, 246, 0.7)";
        ctx.lineWidth = 2.5;
        ctx.stroke();
    }, [zoom, offset]);

    useEffect(() => {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            imgRef.current = img;
            draw();
        };
    }, [imageSrc]);

    useEffect(() => {
        draw();
    }, [draw]);

    const handleMouseDown = (e) => {
        setDragging(true);
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        dragStart.current = { x: clientX - offset.x, y: clientY - offset.y };
    };

    const handleMouseMove = (e) => {
        if (!dragging) return;
        e.preventDefault();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        setOffset({
            x: clientX - dragStart.current.x,
            y: clientY - dragStart.current.y,
        });
    };

    const handleMouseUp = () => setDragging(false);

    const getCroppedBlob = () =>
        new Promise((resolve) => {
            const output = document.createElement("canvas");
            output.width = 256;
            output.height = 256;
            const ctx = output.getContext("2d");

            ctx.beginPath();
            ctx.arc(128, 128, 128, 0, Math.PI * 2);
            ctx.clip();

            const img = imgRef.current;
            const ratio = 256 / CANVAS_SIZE;
            const scale = zoom * (CANVAS_SIZE / Math.min(img.naturalWidth, img.naturalHeight));
            const w = img.naturalWidth * scale * ratio;
            const h = img.naturalHeight * scale * ratio;
            const x = (256 - w) / 2 + offset.x * ratio;
            const y = (256 - h) / 2 + offset.y * ratio;

            ctx.drawImage(img, x, y, w, h);
            output.toBlob(resolve, "image/jpeg", 0.92);
        });

    const handleCrop = async () => {
        const blob = await getCroppedBlob();
        onCrop(blob);
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-sm rounded-lg bg-white border border-slate-200 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-500">Crop photo</p>
                        <h3 className="mt-0.5 text-sm font-extrabold text-slate-800">Drag to reposition</h3>
                    </div>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="p-5 flex flex-col items-center gap-4">
                    <div
                        ref={containerRef}
                        className="rounded-full overflow-hidden cursor-grab active:cursor-grabbing select-none bg-slate-100 ring-2 ring-violet-400/40"
                        style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
                    >
                        <canvas
                            ref={canvasRef}
                            width={CANVAS_SIZE}
                            height={CANVAS_SIZE}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onTouchStart={handleMouseDown}
                            onTouchMove={handleMouseMove}
                            onTouchEnd={handleMouseUp}
                        />
                    </div>

                    <div className="w-full flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                            className="h-8 w-8 flex shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition"
                        >
                            <ZoomOut size={15} />
                        </button>
                        <input
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.05"
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="flex-1 accent-violet-500"
                        />
                        <button
                            type="button"
                            onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
                            className="h-8 w-8 flex shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition"
                        >
                            <ZoomIn size={15} />
                        </button>
                    </div>
                </div>

                <div className="flex gap-2 px-5 pb-5">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 h-9 rounded-lg border border-slate-200 bg-slate-50 text-sm font-bold text-slate-600 hover:bg-slate-100 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleCrop}
                        className="flex-1 h-9 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-sm font-bold text-white hover:from-violet-500 hover:to-fuchsia-500 transition flex items-center justify-center gap-2"
                    >
                        <Check size={15} />
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};


const Field = ({ label, icon: Icon, editing, value, name, type = "text", placeholder, onChange }) => (
    <div>
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{label}</label>
        <div className="relative mt-1.5">
            {Icon && (
                <Icon
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
            )}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                disabled={!editing}
                placeholder={placeholder}
                className={`h-10 w-full rounded-md border px-3 text-sm font-medium outline-none transition
                    ${Icon ? "pl-9" : ""}
                    ${editing
                        ? "border-violet-300 bg-white text-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 "
                        : "border-transparent bg-slate-100 text-slate-600 cursor-default select-none"
                    }`}
            />
        </div>
    </div>
);


const PasswordField = ({ label, name, value, onChange, placeholder, required }) => {
    const [show, setShow] = useState(false);
    return (
        <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                {label} {required && <span className="text-fuchsia-500">*</span>}
            </label>
            <div className="relative mt-1.5">
                <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type={show ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete="off"
                    className="h-10 w-full rounded-lg border border-slate-900 bg-white pl-9 pr-10 text-sm font-medium text-slate-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15"
                />
                <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                    tabIndex={-1}
                    aria-label={show ? "Hide password" : "Show password"}
                >
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
            </div>
        </div>
    );
};


const PASS_INIT = { currentPassword: "", newPassword: "", confirmPassword: "" };

const ChangePasswordModal = ({ onClose, id }) => {
    const [form, setForm] = useState(PASS_INIT);
    const [isSubmitting, setIsSubmitting] = useState(false);

    console.log(id);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        if (!form.currentPassword) return "Current password is required.";
        if (!form.newPassword) return "New password is required.";
        if (form.newPassword.length < 8) return "New password must be at least 8 characters.";
        if (form.newPassword === form.currentPassword) return "New password must be different from current password.";
        if (form.newPassword !== form.confirmPassword) return "Passwords do not match.";
        return null;
    };

    const handleSubmit = async () => {
        const err = validate();
        if (err) { showError(err); return; }
        try {
            setIsSubmitting(true);
            await api.patch(`/user/${id}/password`, {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
            });
            showSuccess("Password changed successfully.");
            onClose();
        } catch (err) {
            showError(err?.response?.data?.message || "Failed to change password.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[75] flex items-end sm:items-center justify-center bg-black/30 px-0 sm:px-4">
            <div className="w-full sm:max-w-md rounded-t-2xl sm:rounded-lg bg-white border border-amber-200 flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-50 text-amber-500 ring-1 ring-amber-200">
                            <KeyRound size={17} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500">Security</p>
                            <h3 className="text-sm font-extrabold text-slate-800 leading-tight">Change password</h3>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                        aria-label="Close"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-3 bg-slate-50/50">
                    <PasswordField
                        label="Current password"
                        name="currentPassword"
                        value={form.currentPassword}
                        onChange={handleChange}
                        placeholder="Enter your current password"
                        required
                    />
                    <div className="border-t border-slate-100 my-1" />
                    <PasswordField
                        label="New password"
                        name="newPassword"
                        value={form.newPassword}
                        onChange={handleChange}
                        placeholder="At least 8 characters"
                        required
                    />
                    <PasswordField
                        label="Confirm new password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="Repeat new password"
                        required
                    />

                    {form.newPassword && (
                        <PasswordStrength password={form.newPassword} />
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-2 border-t border-slate-100 px-5 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-none h-9 rounded-lg border border-slate-900 bg-white px-4 text-sm font-bold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-none inline-flex h-9 items-center justify-center gap-2 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 px-4 text-sm font-bold text-white hover:from-amber-400 hover:to-orange-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                        {isSubmitting ? "Saving..." : "Update password"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const PasswordStrength = ({ password }) => {
    const score = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        /[^A-Za-z0-9]/.test(password),
    ].filter(Boolean).length;

    const levels = [
        { label: "Weak", color: "bg-red-400", textColor: "text-red-500" },
        { label: "Fair", color: "bg-orange-400", textColor: "text-orange-500" },
        { label: "Good", color: "bg-amber-400", textColor: "text-amber-500" },
        { label: "Strong", color: "bg-emerald-500", textColor: "text-emerald-600" },
    ];

    const level = levels[score - 1] || levels[0];

    return (
        <div className="space-y-1.5">
            <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all ${i < score ? level.color : "bg-slate-200"}`}
                    />
                ))}
            </div>
            <p className={`text-xs font-semibold ${level.textColor}`}>{level.label}</p>
        </div>
    );
};

/* ─── Stat pill used inside the profile card ─── */
const StatPill = ({ icon: Icon, label, value, color }) => (
    <div className={`flex items-center gap-2.5 rounded-md px-4 py-3 ${color}`}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/70">
            <Icon size={15} className="text-slate-600" />
        </div>
        <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-none">{label}</p>
            <p className="mt-0.5 text-sm font-extrabold text-slate-700 truncate">{value}</p>
        </div>
    </div>
);

const DEFAULT_PROFILE = {
    username: "",
    email: "",
    avatar: "",
};

export const UserProfile = () => {
    const [profile, setProfile] = useState(DEFAULT_PROFILE);
    const [form, setForm] = useState(DEFAULT_PROFILE);
    const [editing, setEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [totalSpent, setTotalSpent] = useState(null);

    // Password modal
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // Avatar state
    const [avatarPreview, setAvatarPreview] = useState(""); // current displayed (cropped blob URL)
    const [croppedBlob, setCroppedBlob] = useState(null);    // blob to upload on Save
    const [cropSrc, setCropSrc] = useState("");              // raw file URL for cropper
    const [showCropper, setShowCropper] = useState(false);

    const data = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    const fileInputRef = useRef(null);

    /* fetch profile */
    useEffect(() => {
        const load = async () => {
            try {
                const mapped = {
                    username: data.username || "",
                    email: data.email || "",
                    avatar: data.avatar || data.image || "",
                };
                setProfile(mapped);
                setForm(mapped);
                if (mapped.avatar) setAvatarPreview(mapped.avatar);

                // Fetch total spent
                try {
                    const { data: spentData } = await api.get(`/user/${data.id}/total-spent`);
                    setTotalSpent(spentData.totalSpent);
                } catch {
                    setTotalSpent(0);
                }
            } catch (err) {
                showError(err?.response?.data?.message || "Failed to load profile.");
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    /* handlers */
    const handleEdit = () => {
        setForm({ ...profile });
        setEditing(true);
    };

    const handleCancel = () => {
        setForm({ ...profile });
        setAvatarPreview(profile.avatar || "");
        setCroppedBlob(null);
        setEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    /* avatar pick -> open cropper */
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            showError("Please select an image file.");
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setCropSrc(objectUrl);
        setShowCropper(true);
        e.target.value = "";
    };

    /* cropper confirmed */
    const handleCropDone = (blob) => {
        setCroppedBlob(blob);
        setAvatarPreview(URL.createObjectURL(blob));
        setShowCropper(false);
        URL.revokeObjectURL(cropSrc);
        setCropSrc("");
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);

            // 1. Upload avatar if changed
            if (croppedBlob) {
                const formData = new FormData();
                formData.append("file", croppedBlob, "avatar.jpg");
                try {
                    await api.put(`/user/${data.id}/avatar`, formData);
                } catch (err) {
                    showError(err?.response?.data?.message || "Failed to upload avatar.");
                }
            }

            // 2. Update profile info
            const payload = {
                username: form.username.trim(),
                email: form.email.trim(),
            };
            const { data: response } = await api.patch(`/user/${data.id}/update`, payload);

            const updated = {
                username: response.username || payload.username,
                email: response.email || payload.email,
                avatar: response.avatar || response.image || form.avatar,
            };
            setProfile(updated);
            setForm(updated);
            setCroppedBlob(null);
            setEditing(false);

            dispatch(fetchAuthInfo(updated));

            showSuccess("Profile saved.");
        } catch (err) {
            showError(err?.response?.data?.message || "Failed to save profile.");
        } finally {
            setIsSaving(false);
        }
    };


    if (isLoading) {
        return (
            <>
                <Header />
                <div className="pt-[72px] flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-indigo-50/60 to-violet-50">
                    <Loader2 size={28} className="animate-spin text-violet-500" />
                </div>
            </>
        );
    }

    const displayName = profile.username || "Your Name";
    const initials = displayName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const memberSince = new Date().getFullYear();

    return (
        <>
            <Header />

            {showCropper && (
                <AvatarCropper
                    imageSrc={cropSrc}
                    onCrop={handleCropDone}
                    onCancel={() => {
                        setShowCropper(false);
                        URL.revokeObjectURL(cropSrc);
                        setCropSrc("");
                    }}
                />
            )}

            {showPasswordModal && (
                <ChangePasswordModal onClose={() => setShowPasswordModal(false)} id={data.id} />
            )}

            {/* ── PAGE BACKGROUND ── */}
            <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-br from-slate-100 via-indigo-50/60 to-violet-50">
                <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-violet-300/20 blur-[120px]" />
                <div className="absolute top-1/2 -right-32 h-72 w-72 rounded-full bg-fuchsia-200/20 blur-[120px]" />
                <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-cyan-200/20 blur-[120px]" />
                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage: "radial-gradient(circle, #3d5776 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                    }}
                />
            </div>

            {/* ── MAIN WRAPPER — offset for fixed header (≈ 72px) ── */}
            <div className="pt-[72px] min-h-screen">

                <section className="relative py-6 px-4 sm:px-6 max-w-2xl mx-auto space-y-4 pb-12">

                    {/* ── MAIN CARD ── */}
                    <div className="rounded-lg border border-slate-200/80 bg-white /60 overflow-hidden">

                        {/* Top banner */}
                        <div className="relative h-28 bg-gradient-to-br from-violet-600 via-fuchsia-500 to-cyan-500 overflow-hidden">
                            <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:20px_20px]" />
                            <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                            <div className="absolute top-3 left-4 flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1">
                                <BadgeCheck size={12} className="text-white" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white">My Profile</span>
                            </div>
                        </div>

                        {/* Avatar + name row */}
                        <div className="px-6 pb-5">
                            <div className="flex items-end justify-between -mt-12 mb-5 gap-3">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="h-24 w-24 rounded-full border-4 border-white /60 ring-2 ring-violet-300/50 overflow-hidden bg-slate-100 shrink-0">
                                        {avatarPreview ? (
                                            <img
                                                src={avatarPreview}
                                                alt={displayName}
                                                className="h-full w-full object-cover"
                                                onError={(e) => { e.currentTarget.style.display = "none"; }}
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-violet-100 to-fuchsia-100">
                                                <span className="text-2xl font-extrabold text-violet-500 tracking-tight">
                                                    {initials || <User size={30} className="text-violet-400" />}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Camera button — only in edit mode */}
                                    {editing && (
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute -bottom-1 -right-1 h-8 w-8 flex items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white hover:from-violet-400 hover:to-fuchsia-400 transition"
                                            aria-label="Change avatar"
                                        >
                                            <Camera size={14} />
                                        </button>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="sr-only"
                                    />
                                </div>

                                {/* Action buttons */}
                                <div className="flex gap-2 pb-1">
                                    {editing ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={handleCancel}
                                                disabled={isSaving}
                                                className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-900 bg-white px-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
                                            >
                                                <X size={14} />
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleSave}
                                                disabled={isSaving}
                                                className="inline-flex h-9 items-center gap-2 rounded-md bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 text-xs font-bold text-white hover:from-violet-500 hover:to-fuchsia-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {isSaving
                                                    ? <Loader2 size={14} className="animate-spin" />
                                                    : <Save size={14} />
                                                }
                                                {isSaving ? "Saving..." : "Save"}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswordModal(true)}
                                                className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-900 bg-white px-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                                            >
                                                <KeyRound size={14} />
                                                <span className="hidden sm:inline">Password</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleEdit}
                                                className="inline-flex h-9 items-center gap-2 rounded-md border border-violet-200 bg-violet-50 px-4 text-xs font-bold text-violet-700 hover:bg-violet-100 transition"
                                            >
                                                <Edit3 size={14} />
                                                Edit profile
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Name + subtitle */}
                            <div className="flex items-center gap-2">
                                <div>
                                    <h2 className="text-lg font-extrabold text-slate-800 leading-tight">{displayName}</h2>
                                    <p className="mt-0.5 text-xs text-slate-400">{profile.email || "No email set"}</p>
                                </div>
                                <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                                    <Shield size={11} />
                                    Verified
                                </span>
                            </div>
                        </div>

                        {/* ── STAT PILLS ── */}
                        <div className="px-6 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <StatPill
                                icon={ShoppingBag}
                                label="Total spent"
                                value={
                                    totalSpent !== null
                                        ? `$${Number(totalSpent).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                        : "—"
                                }
                                color="bg-emerald-50"
                            />
                            <StatPill
                                icon={CalendarDays}
                                label="Member since"
                                value={memberSince}
                                color="bg-fuchsia-50"
                            />
                        </div>

                        {/* Divider */}
                        <div className="border-t border-slate-100 mx-6" />

                        {/* Form fields */}
                        <div className="px-6 py-5 space-y-4">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">
                                    Account information
                                </p>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Field
                                        label="Display name"
                                        icon={User}
                                        name="username"
                                        editing={editing}
                                        value={form.username}
                                        onChange={handleChange}
                                        placeholder="Your name"
                                    />
                                    <Field
                                        label="Email address"
                                        icon={Mail}
                                        name="email"
                                        type="email"
                                        editing={editing}
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            {/* Edit hint */}
                            {editing && (
                                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-violet-400" />
                                    Changes are only saved when you click <strong className="font-bold text-slate-600">Save</strong>.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ── SECURITY CARD ── */}
                    <div className="rounded-lg border border-slate-200/80 bg-white overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-50 ring-1 ring-amber-200">
                                    <Lock size={15} className="text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Security</p>
                                    <h3 className="text-sm font-extrabold text-slate-800">Password & access</h3>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowPasswordModal(true)}
                                className="inline-flex h-9 items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-4 text-xs font-bold text-amber-700 hover:bg-amber-100 transition"
                            >
                                <KeyRound size={13} />
                                Change password
                            </button>
                        </div>
                        <div className="border-t border-slate-100 mx-6" />
                        <div className="px-6 py-4 flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_1px_rgba(52,211,153,0.5)]" />
                            <p className="text-xs text-slate-500">
                                Your account is secured. We recommend using a strong, unique password.
                            </p>
                        </div>
                    </div>

                </section>
            </div>
        </>
    );
};