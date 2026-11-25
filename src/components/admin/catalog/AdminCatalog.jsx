import { useCallback, useEffect, useRef, useState } from "react";
import {
    BookOpen,
    Building2,
    ChevronLeft,
    ChevronRight,
    Code2,
    Edit3,
    Image as ImageIcon,
    Layers,
    Loader2,
    Plus,
    Search,
    Tag,
    Trash2,
    Upload,
    X,
} from "lucide-react";
import api from "../../../api/api";
import { ConfirmModal } from "../../shared/ConfirmModal";
import { Bounce, toast } from "react-toastify";

/* ─── Config ─────────────────────────────────────────────────────────────── */

const CATALOG_TYPES = [
    {
        key: "category",
        label: "Category",
        icon: Tag,
        idField: "categoryId",
        nameField: "categoryName",
        getUrl: "/public/categories",
        postUrl: "/admin/category",
        putUrl: (id) => `/admin/category/${id}`,
        deleteUrl: (id) => `/admin/category/${id}`,
        imageUrl: (id) => `/admin/category/${id}/image`,
        color: "violet",
    },
    {
        key: "genre",
        label: "Genre",
        icon: Layers,
        idField: "genreId",
        nameField: "genreName",
        getUrl: "/public/genres",
        postUrl: "/admin/genre",
        putUrl: (id) => `/admin/genre/${id}`,
        deleteUrl: (id) => `/admin/genre/${id}`,
        imageUrl: (id) => `/admin/genre/${id}/image`,
        color: "blue",
    },
    {
        key: "developer",
        label: "Developer",
        icon: Code2,
        idField: "developerId",
        nameField: "developerName",
        getUrl: "/public/developers",
        postUrl: "/admin/developer",
        putUrl: (id) => `/admin/developer/${id}`,
        deleteUrl: (id) => `/admin/developer/${id}`,
        imageUrl: (id) => `/admin/developer/${id}/image`,
        color: "emerald",
    },
    {
        key: "publisher",
        label: "Publisher",
        icon: Building2,
        idField: "publisherId",
        nameField: "publisherName",
        getUrl: "/public/publishers",
        postUrl: "/admin/publisher",
        putUrl: (id) => `/admin/publisher/${id}`,
        deleteUrl: (id) => `/admin/publisher/${id}`,
        imageUrl: (id) => `/admin/publisher/${id}/image`,
        color: "amber",
    },
];

const COLOR_MAP = {
    violet: {
        tab: "bg-violet-600 text-white shadow-violet-200 ",
        inactiveTab: "text-slate-600 hover:bg-violet-50 hover:text-violet-700",
        icon: "bg-violet-100 text-violet-600",
        badge: "bg-violet-100 text-violet-700",
        btn: "bg-violet-600 hover:bg-violet-700 text-white",
        border: "border-violet-200",
    },
    blue: {
        tab: "bg-blue-600 text-white shadow-blue-200 ",
        inactiveTab: "text-slate-600 hover:bg-blue-50 hover:text-blue-700",
        icon: "bg-blue-100 text-blue-600",
        badge: "bg-blue-100 text-blue-700",
        btn: "bg-blue-600 hover:bg-blue-700 text-white",
        border: "border-blue-200",
    },
    emerald: {
        tab: "bg-emerald-600 text-white shadow-emerald-200 ",
        inactiveTab: "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700",
        icon: "bg-emerald-100 text-emerald-600",
        badge: "bg-emerald-100 text-emerald-700",
        btn: "bg-emerald-600 hover:bg-emerald-700 text-white",
        border: "border-emerald-200",
    },
    amber: {
        tab: "bg-amber-500 text-white shadow-amber-200 ",
        inactiveTab: "text-slate-600 hover:bg-amber-50 hover:text-amber-700",
        icon: "bg-amber-100 text-amber-600",
        badge: "bg-amber-100 text-amber-700",
        btn: "bg-amber-500 hover:bg-amber-600 text-white",
        border: "border-amber-200",
    },
};

const PAGE_SIZE = 12;

/* ─── Toasts ─────────────────────────────────────────────────────────────── */

const showToast = (msg) =>
    toast.error(msg, { position: "bottom-right", autoClose: 5000, theme: "light", transition: Bounce });

const showSuccess = (msg) =>
    toast.success(msg, { position: "bottom-right", autoClose: 3000, theme: "light", transition: Bounce });

/* ─── CatalogSection: manages one entity type ────────────────────────────── */

const CatalogSection = ({ config }) => {
    const { idField, nameField, getUrl, postUrl, putUrl, deleteUrl, imageUrl, color, label } = config;
    const colors = COLOR_MAP[color];

    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal state
    const [modalMode, setModalMode] = useState(null); // "add" | "edit" | null
    const [formName, setFormName] = useState("");
    const [formImageFile, setFormImageFile] = useState(null);
    const [formImagePreview, setFormImagePreview] = useState("");
    const [currentItem, setCurrentItem] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Delete
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const imageInputRef = useRef(null);

    /* ── Fetch ── */

    const fetchItems = useCallback(async (page = 0) => {
        try {
            setIsLoading(true);
            const { data } = await api.get(getUrl, {
                params: { pageNumber: page, pageSize: PAGE_SIZE, sortOrder: "asc" },
            });
            setItems(data?.content || []);
            setTotalPages(data?.totalPages ?? 0);
            setTotalElements(data?.totalElements ?? 0);
        } catch {
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    }, [getUrl]);

    useEffect(() => { fetchItems(pageNumber); }, [fetchItems, pageNumber]);

    /* ── Filtered list ── */

    const filtered = items.filter((it) =>
        (it[nameField] || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    /* ── Modal helpers ── */

    const openAdd = () => {
        setFormName("");
        setFormImageFile(null);
        setFormImagePreview("");
        setCurrentItem(null);
        setModalMode("add");
    };

    const openEdit = (item) => {
        setFormName(item[nameField] || "");
        setFormImageFile(null);
        setFormImagePreview(item.image || "");
        setCurrentItem(item);
        setModalMode("edit");
    };

    const closeModal = () => {
        if (formImagePreview && formImagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(formImagePreview);
        }
        setModalMode(null);
        setFormName("");
        setFormImageFile(null);
        setFormImagePreview("");
        setCurrentItem(null);
    };

    const handleImagePick = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (formImagePreview?.startsWith("blob:")) URL.revokeObjectURL(formImagePreview);
        setFormImageFile(file);
        setFormImagePreview(URL.createObjectURL(file));
    };

    /* ── Submit ── */

    const handleSubmit = async () => {
        if (!formName.trim()) { showToast("Please enter the name."); return; }

        setIsSubmitting(true);
        try {
            let savedItem;
            const payload = { [nameField]: formName.trim() };

            if (modalMode === "add") {
                const { data } = await api.post(postUrl, payload);
                savedItem = data;
                showSuccess(`${label.slice(0, -1)} created!`);
            } else {
                const { data } = await api.put(putUrl(currentItem[idField]), payload);
                savedItem = data;
                showSuccess(`${label.slice(0, -1)} updated!`);
            }

            // Upload image if picked
            if (formImageFile && savedItem?.[idField]) {
                const fd = new FormData();
                fd.append("file", formImageFile);
                try {
                    await api.put(imageUrl(savedItem[idField]), fd);
                } catch {
                    showToast("Save successfully but upload image failed.");
                }
            }

            closeModal();
            fetchItems(pageNumber);
        } catch (err) {
            showToast(err?.response?.data?.message || "Action failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ── Delete ── */

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            await api.delete(deleteUrl(deleteTarget[idField]));
            showSuccess(`${label.slice(0, -1)} deleted!`);
            setDeleteTarget(null);
            fetchItems(pageNumber);
        } catch (err) {
            showToast(err?.response?.data?.message || "Delete failed.");
        } finally {
            setIsDeleting(false);
        }
    };

    /* ── Render ── */

    return (
        <div className="mt-4">
            {/* Toolbar */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input
                        type="text"
                        placeholder={`Search ${label.toLowerCase()}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border border-slate-900 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${colors.badge}`}>
                        {totalElements} total
                    </span>
                    <button
                        onClick={openAdd}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${colors.btn}`}
                    >
                        <Plus size={15} />
                        Add {label}
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border border-slate-900 bg-white">
                {isLoading ? (
                    <div className="flex items-center justify-center py-16 text-slate-400">
                        <Loader2 size={24} className="animate-spin mr-2" /> Loading...
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                        <ImageIcon size={40} className="mb-3 opacity-30" />
                        <p className="text-sm font-medium">No {label.toLowerCase()} found</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <th className="px-4 py-3 w-14">Image</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map((item) => (
                                <tr key={item[idField]} className="group hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item[nameField]}
                                                className="h-10 w-10 rounded-lg object-cover border border-slate-200"
                                            />
                                        ) : (
                                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${colors.icon}`}>
                                                <ImageIcon size={16} />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-slate-800">
                                        {item[nameField]}
                                        <span className="ml-2 text-xs text-slate-400">#{item[idField]}</span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEdit(item)}
                                                className="flex items-center gap-1.5 rounded-lg border border-slate-900 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
                                            >
                                                <Edit3 size={13} /> Edit
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(item)}
                                                className="flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-100 transition-colors"
                                            >
                                                <Trash2 size={13} /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                        Page {pageNumber + 1} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={pageNumber === 0}
                            onClick={() => setPageNumber((p) => p - 1)}
                            className="flex items-center gap-1 rounded-lg border border-slate-900 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 disabled:opacity-40 hover:bg-slate-50"
                        >
                            <ChevronLeft size={14} /> Prev
                        </button>
                        <button
                            disabled={pageNumber >= totalPages - 1}
                            onClick={() => setPageNumber((p) => p + 1)}
                            className="flex items-center gap-1 rounded-lg border border-slate-900 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 disabled:opacity-40 hover:bg-slate-50"
                        >
                            Next <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {modalMode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/50"
                        onClick={closeModal}
                    />
                    <div className="relative z-10 w-full max-w-md rounded-lg bg-white">
                        {/* Header */}
                        <div className={`flex items-center justify-between rounded-t-2xl px-6 py-4 border-b border-slate-100`}>
                            <h3 className="text-base font-extrabold text-slate-900">
                                {modalMode === "add" ? `Add ${label}` : `Edit ${label}`}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-5 space-y-5">
                            {/* Image preview & upload */}
                            <div className="flex flex-col items-center gap-3">
                                <div
                                    onClick={() => imageInputRef.current?.click()}
                                    className={`relative h-28 w-28 cursor-pointer overflow-hidden rounded-lg border-2 border-dashed flex items-center justify-center transition-all ${
                                        formImagePreview
                                            ? "border-slate-300"
                                            : `border-slate-300 hover:${colors.border}`
                                    } bg-slate-50`}
                                >
                                    {formImagePreview ? (
                                        <>
                                            <img
                                                src={formImagePreview}
                                                alt="preview"
                                                className="h-full w-full object-cover"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                                                <Upload size={20} className="text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-1 text-slate-400">
                                            <Upload size={22} />
                                            <span className="text-xs font-medium">Upload</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={imageInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImagePick}
                                />
                                <p className="text-xs text-slate-400">Click to upload image (optional)</p>
                            </div>

                            {/* Name field */}
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                    placeholder={`Enter ${label.slice(0, -1).toLowerCase()} name...`}
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
                            <button
                                onClick={closeModal}
                                className="rounded-lg border border-slate-900 bg-white px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`flex items-center gap-2 rounded-md px-5 py-2 text-sm font-semibold transition-all disabled:opacity-60 ${colors.btn}`}
                            >
                                {isSubmitting ? (
                                    <Loader2 size={15} className="animate-spin" />
                                ) : null}
                                {modalMode === "add" ? "Create" : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteTarget && (
                <ConfirmModal
                    isOpen={!!deleteTarget}
                    title={`Delete ${label.slice(0, -1)}`}
                    message={`Are you sure you want to delete "${deleteTarget[nameField]}"? This action cannot be undone.`}
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteTarget(null)}
                    isLoading={isDeleting}
                />
            )}
        </div>
    );
};

/* ─── Main Component ────────────────────────────────────────────────────── */

export const AdminCatalog = () => {
    const [activeType, setActiveType] = useState(CATALOG_TYPES[0].key);

    const current = CATALOG_TYPES.find((t) => t.key === activeType);
    const colors = COLOR_MAP[current.color];

    return (
        <section className="mt-6 space-y-2">
            {/* Type tabs */}
            <div className="flex flex-wrap gap-2 rounded-lg border border-slate-900 bg-white p-2">
                {CATALOG_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isActive = activeType === type.key;
                    const tc = COLOR_MAP[type.color];
                    return (
                        <button
                            key={type.key}
                            onClick={() => setActiveType(type.key)}
                            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-all ${
                                isActive ? tc.tab : tc.inactiveTab
                            }`}
                        >
                            <Icon size={15} />
                            {type.label}
                        </button>
                    );
                })}
            </div>

            {/* Section content */}
            <div className="rounded-lg border border-slate-900 bg-white p-5">
                <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-md ${colors.icon}`}>
                        {(() => {
                            const Icon = current.icon;
                            return <Icon size={20} />;
                        })()}
                    </div>
                    <div>
                        <h2 className="text-base font-extrabold text-slate-900">{current.label}</h2>
                        <p className="text-xs text-slate-500">Manage {current.label.toLowerCase()} for your catalog</p>
                    </div>
                </div>
                <CatalogSection key={activeType} config={current} />
            </div>
        </section>
    );
};
