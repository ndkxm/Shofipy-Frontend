import { useEffect, useRef, useState } from "react";
import {
    AlertCircle,
    Boxes,
    ChevronLeft,
    ChevronRight,
    ChevronsUpDown,
    Edit3,
    Filter,
    Images,
    ImageOff,
    KeyRound,
    Loader2,
    Monitor,
    PackageOpen,
    Plus,
    RefreshCw,
    Search,
    Tag,
    Trash2,
    Upload,
    X,
} from "lucide-react";
import api from "../../../api/api";
import { ConfirmModal } from "../../shared/ConfirmModal";
import { parseImages } from "../../utils/ParseImages";
import { Bounce, toast } from "react-toastify";
import { GameKeyModal } from "./GameKeyModal";

/* ─── Constants ─────────────────────────────────────────────────────────── */

const SORT_OPTIONS = [
    { label: "Newest first", sortBy: "productId", sortOrder: "desc" },
    { label: "Oldest first", sortBy: "productId", sortOrder: "asc" },
    { label: "Name A–Z", sortBy: "productName", sortOrder: "asc" },
    { label: "Name Z–A", sortBy: "productName", sortOrder: "desc" },
    { label: "Highest price", sortBy: "price", sortOrder: "desc" },
    { label: "Lowest price", sortBy: "price", sortOrder: "asc" },
    { label: "Highest stock", sortBy: "quantity", sortOrder: "desc" },
    { label: "Lowest stock", sortBy: "quantity", sortOrder: "asc" },
];

const STOCK_FILTER_OPTIONS = [
    { label: "All stock", value: "all" },
    { label: "In stock", value: "in" },
    { label: "Low stock", value: "low" },
    { label: "Out of stock", value: "out" },
];

const PAGE_SIZE_OPTIONS = [5, 10, 20];
const MAX_DESC_IMAGES = 10;

/* ─── Helpers ───────────────────────────────────────────────────────────── */

const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    }).format(Number(value || 0));

const getImageUrl = (image) => {
    if (!image) return "";
    if (String(image).startsWith("blob:") || String(image).startsWith("http")) return image;
    return parseImages(image)[0] || "";
};

const buildEditState = (product) => ({
    productId: product?.productId || "",
    productName: product?.productName || "",
    description: product?.description || "",
    price: product?.price ?? "",
    quantity: product?.quantity ?? "",
    discount: product?.discount ?? "",
    specialPrice: product?.specialPrice ?? "",
    image: product?.image || "",
    imageFile: null,
    imagePreview: "",
});

const buildAddState = () => ({
    productName: "",
    description: "",
    price: "",
    quantity: "",
    discount: "0",
    categoriesId: [],
    genresId: [],
    developersId: [],
    publisherId: "",
    releaseDate: "",
    windows: false,
    mac: false,
    linux: false,
    thumbnailFile: null,
    thumbnailPreview: "",
    descImageFiles: [],      // File[]
    descImagePreviews: [],   // string[] (blob URLs)
});

const showToast = (message) =>
    toast.error(message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
    });

const showSuccessToast = (message) =>
    toast.success(message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
    });

/* ─── Main Component ────────────────────────────────────────────────────── */

export const AdminProduct = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [genres, setGenres] = useState([]);
    const [developers, setDevelopers] = useState([]);
    const [publishers, setPublishers] = useState([]);

    const [pagination, setPagination] = useState({
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        lastPage: true,
    });
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortConfig, setSortConfig] = useState(SORT_OPTIONS[0]);
    const [searchTerm, setSearchTerm] = useState("");
    const [keyword, setKeyword] = useState("");
    const [stockFilter, setStockFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Edit state
    const [editingProduct, setEditingProduct] = useState(null);
    const [editForm, setEditForm] = useState(buildEditState(null));
    const [changeImage, setChangeImage] = useState(null);

    // Add state
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [addForm, setAddForm] = useState(buildAddState());
    const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);

    // Delete state
    const [productToDelete, setProductToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Game Key modal state
    const [keyModalProduct, setKeyModalProduct] = useState(null);

    const openKeyModal  = (product) => setKeyModalProduct(product);
    const closeKeyModal = ()        => setKeyModalProduct(null);

    /* ── Fetchers ── */

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            setError("");
            const { data } = await api.get("/public/products", {
                params: {
                    pageNumber,
                    pageSize,
                    sortBy: sortConfig.sortBy,
                    sortOrder: sortConfig.sortOrder,
                    keyword: keyword || undefined,
                },
            });
            setProducts(data?.content || []);
            setPagination({
                pageNumber: data?.pageNumber ?? 0,
                pageSize: data?.pageSize ?? pageSize,
                totalElements: data?.totalElements ?? 0,
                totalPages: data?.totalPages ?? 0,
                lastPage: Boolean(data?.lastPage),
            });
        } catch (err) {
            setProducts([]);
            setPagination((p) => ({ ...p, totalElements: 0, totalPages: 0, lastPage: true }));
            setError(err?.response?.data?.message || "Failed to load products.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMetadata = async () => {
        try {
            const [catRes, genreRes, devRes, pubRes] = await Promise.allSettled([
                api.get("/public/categories", { params: { pageSize: 200 } }),
                api.get("/public/genres", { params: { pageSize: 200 } }),
                api.get("/public/developers", { params: { pageSize: 200 } }),
                api.get("/public/publishers", { params: { pageSize: 200 } }),
            ]);
            if (catRes.status === "fulfilled") setCategories(catRes.value.data?.content || catRes.value.data || []);
            if (genreRes.status === "fulfilled") setGenres(genreRes.value.data?.content || genreRes.value.data || []);
            if (devRes.status === "fulfilled") setDevelopers(devRes.value.data?.content || devRes.value.data || []);
            if (pubRes.status === "fulfilled") setPublishers(pubRes.value.data?.content || pubRes.value.data || []);
        } catch {
            // Non-blocking
        }
    };

    useEffect(() => { fetchProducts(); }, [pageNumber, pageSize, sortConfig, keyword]);
    useEffect(() => { fetchMetadata(); }, []);

    /* ── Toolbar ── */

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setKeyword(searchTerm.trim());
        setPageNumber(0);
    };

    const handleSortChange = (e) => {
        setSortConfig(SORT_OPTIONS.find((o) => o.label === e.target.value) || SORT_OPTIONS[0]);
        setPageNumber(0);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setPageNumber(0);
    };

    /* ── Edit ── */

    const openEditForm = (product) => {
        setEditingProduct(product);
        setEditForm(buildEditState(product));
        setChangeImage(null);
    };

    const closeEditForm = () => {
        setEditingProduct(null);
        setEditForm(buildEditState(null));
        setChangeImage(null);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setChangeImage(file);
        setEditForm((prev) => ({
            ...prev,
            image: file.name,
            imageFile: file,
            imagePreview: URL.createObjectURL(file),
        }));
    };

    const handleSaveEditChange = async (productId) => {
        if (changeImage) {
            const formData = new FormData();
            formData.append("file", changeImage);
            try {
                await api.put(`/admin/products/${productId}/image`, formData);
            } catch (error) {
                showToast(error.response?.data?.message || "Failed to update image.");
            }
        }
        try {
            await api.put(`/admin/products/${productId}`, editForm);
            showSuccessToast("Product updated successfully.");
            closeEditForm();
            fetchProducts();
        } catch (error) {
            showToast(error.response?.data?.message || "Failed to update product.");
        }
    };

    /* ── Add ── */

    const openAddForm = () => {
        setAddForm(buildAddState());
        setIsAddingProduct(true);
    };

    const closeAddForm = () => {
        // Revoke blob URLs to prevent memory leaks
        addForm.descImagePreviews.forEach((url) => URL.revokeObjectURL(url));
        if (addForm.thumbnailPreview) URL.revokeObjectURL(addForm.thumbnailPreview);
        setIsAddingProduct(false);
        setAddForm(buildAddState());
    };

    const handleAddChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAddForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    // Toggle item in a multi-select array field
    const handleMultiToggle = (fieldName, id) => {
        setAddForm((prev) => {
            const current = prev[fieldName];
            return {
                ...prev,
                [fieldName]: current.includes(id)
                    ? current.filter((x) => x !== id)
                    : [...current, id],
            };
        });
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (addForm.thumbnailPreview) URL.revokeObjectURL(addForm.thumbnailPreview);
        setAddForm((prev) => ({
            ...prev,
            thumbnailFile: file,
            thumbnailPreview: URL.createObjectURL(file),
        }));
    };

    const handleDescImagesChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        const remaining = MAX_DESC_IMAGES - addForm.descImageFiles.length;
        if (remaining <= 0) {
            showToast(`Maximum ${MAX_DESC_IMAGES} description images allowed.`);
            return;
        }
        const picked = files.slice(0, remaining);
        const newPreviews = picked.map((f) => URL.createObjectURL(f));
        setAddForm((prev) => ({
            ...prev,
            descImageFiles: [...prev.descImageFiles, ...picked],
            descImagePreviews: [...prev.descImagePreviews, ...newPreviews],
        }));
        // Reset input so same file can be added again if needed
        e.target.value = "";
    };

    const removeDescImage = (index) => {
        URL.revokeObjectURL(addForm.descImagePreviews[index]);
        setAddForm((prev) => ({
            ...prev,
            descImageFiles: prev.descImageFiles.filter((_, i) => i !== index),
            descImagePreviews: prev.descImagePreviews.filter((_, i) => i !== index),
        }));
    };

    const handleAddSubmit = async () => {
        if (!addForm.productName.trim()) return showToast("Product name is required.");
        if (!addForm.price || Number(addForm.price) <= 0) return showToast("Price must be greater than 0.");
        if (addForm.categoriesId.length === 0) return showToast("Please select at least one category.");
        if (addForm.genresId.length === 0) return showToast("Please select at least one genre.");
        if (addForm.developersId.length === 0) return showToast("Please select at least one developer.");
        if (!addForm.publisherId) return showToast("Please select a publisher.");

        try {
            setIsSubmittingAdd(true);

            const productPayload = {
                productName: addForm.productName.trim(),
                description: addForm.description.trim(),
                price: Number(addForm.price),
                quantity: Number(addForm.quantity) || 0,
                discount: Number(addForm.discount) || 0,
                categoriesId: addForm.categoriesId,
                genresId: addForm.genresId,
                developersId: addForm.developersId,
                publisherId: Number(addForm.publisherId),
                releaseDate: addForm.releaseDate || null,
                windows: addForm.windows,
                mac: addForm.mac,
                linux: addForm.linux,
            };

            const formData = new FormData();
            // Append product JSON as a Part
            formData.append(
                "product",
                new Blob([JSON.stringify(productPayload)], { type: "application/json" })
            );

            // Thumbnail
            if (addForm.thumbnailFile) {
                formData.append("thumbnail", addForm.thumbnailFile);
            }

            // Description images
            addForm.descImageFiles.forEach((file) => {
                formData.append("images", file);
            });

            await api.post("/admin/add/product/media", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            showSuccessToast(`"${productPayload.productName}" added successfully.`);
            closeAddForm();
            fetchProducts();
        } catch (error) {
            showToast(error.response?.data?.message || "Failed to add product.");
        } finally {
            setIsSubmittingAdd(false);
        }
    };

    /* ── Delete ── */

    const confirmDeleteProduct = async () => {
        if (!productToDelete?.productId) return;
        try {
            setIsDeleting(true);
            await api.delete(`/admin/products/${productToDelete.productId}`);
            setProductToDelete(null);
            await fetchProducts();
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to delete product.");
        } finally {
            setIsDeleting(false);
        }
    };

    /* ── Derived ── */

    const canGoPrevious = pageNumber > 0 && !isLoading;
    const canGoNext = !pagination.lastPage && !isLoading;

    const filteredProducts = products.filter((p) => {
        const qty = Number(p.quantity || 0);
        if (stockFilter === "in") return qty > 10;
        if (stockFilter === "low") return qty > 0 && qty <= 10;
        if (stockFilter === "out") return qty === 0;
        return true;
    });

    /* ── Render ── */

    return (
        <section className="space-y-4 py-4 px-2 sm:px-0 sm:py-6">
            {/* Header card */}
            <div className="rounded-lg border border-slate-900 bg-white p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-blue-600">
                                <Boxes size={15} />
                                Admin products
                            </div>
                            <h2 className="mt-1.5 text-lg font-extrabold text-slate-950 sm:text-xl">Product management</h2>
                            <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">Browse, edit, and manage your product catalogue.</p>
                        </div>

                        <button
                            type="button"
                            onClick={openAddForm}
                            className="shrink-0 inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-3 sm:px-4 text-xs sm:text-sm font-bold text-white transition hover:bg-blue-700"
                        >
                            <Plus size={15} />
                            <span className="hidden sm:inline">Add product</span>
                            <span className="sm:hidden">Add</span>
                        </button>
                    </div>

                    <form onSubmit={handleSearchSubmit} className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                        <label className="relative flex-1 min-w-[160px]">
                            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search product name…"
                                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            />
                        </label>

                        <label className="relative flex-1 min-w-[160px]">
                            <ChevronsUpDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                            <select
                                value={sortConfig.label}
                                onChange={handleSortChange}
                                className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-8 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            >
                                {SORT_OPTIONS.map((o) => (
                                    <option key={o.label} value={o.label}>{o.label}</option>
                                ))}
                            </select>
                        </label>

                        <label className="relative flex-1 min-w-[150px]">
                            <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <select
                                value={stockFilter}
                                onChange={(e) => { setStockFilter(e.target.value); setPageNumber(0); }}
                                className={`h-9 w-full appearance-none rounded-lg border pl-9 pr-8 text-sm font-semibold outline-none transition focus:ring-2 ${
                                    stockFilter === "all"
                                        ? "border-slate-200 bg-slate-50 text-slate-700 focus:border-blue-400 focus:bg-white focus:ring-blue-100"
                                        : stockFilter === "in"
                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 focus:border-emerald-400 focus:bg-white focus:ring-emerald-100"
                                        : stockFilter === "low"
                                        ? "border-amber-200 bg-amber-50 text-amber-700 focus:border-amber-400 focus:bg-white focus:ring-amber-100"
                                        : "border-red-200 bg-red-50 text-red-700 focus:border-red-400 focus:bg-white focus:ring-red-100"
                                }`}
                            >
                                {STOCK_FILTER_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </label>

                        <select
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        >
                            {PAGE_SIZE_OPTIONS.map((s) => (
                                <option key={s} value={s}>{s} / page</option>
                            ))}
                        </select>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="inline-flex h-9 flex-1 sm:flex-none items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-700"
                            >
                                Search
                            </button>
                            <button
                                type="button"
                                onClick={fetchProducts}
                                disabled={isLoading}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-900 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                aria-label="Refresh"
                            >
                                <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <StatePanel icon={Loader2} title="Loading products…" spinning />
            ) : error ? (
                <StatePanel icon={AlertCircle} title="Could not load products" description={error} danger onRetry={fetchProducts} />
            ) : products.length === 0 ? (
                <StatePanel
                    icon={PackageOpen}
                    title="No products found"
                    description="Try a different search or add your first product."
                    action={{ label: "Add product", onClick: openAddForm }}
                />
            ) : filteredProducts.length === 0 ? (
                <StatePanel
                    icon={PackageOpen}
                    title={`No ${
                        stockFilter === "in" ? "in-stock" :
                        stockFilter === "low" ? "low-stock" :
                        stockFilter === "out" ? "out-of-stock" : ""
                    } products found`}
                    description="Try changing the stock filter or search term."
                />
            ) : (
                <div className="overflow-hidden rounded-lg border border-slate-900 bg-white">
                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100 text-left">
                            <thead className="bg-slate-100 border-b border-slate-900">
                                <tr>
                                    {["Product", "Price", "Discount", "Special price", "Stock", "Description", ""].map((h, i) => (
                                        <th
                                            key={i}
                                            className={`whitespace-nowrap px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-slate-400 ${i === 6 ? "text-right" : ""}`}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 bg-white">
                                {filteredProducts.map((product) => (
                                    <tr key={product.productId} className="hover:bg-slate-50/70 transition-colors">
                                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                                            <div className="flex items-center gap-3">
                                                <ProductImage product={product} sizeClass="h-11 w-11" />
                                                <div className="min-w-0">
                                                    <p className="max-w-[200px] truncate font-extrabold text-slate-900">{product.productName}</p>
                                                    <p className="mt-0.5 text-xs text-slate-400">ID: {product.productId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-slate-700">{formatCurrency(product.price)}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">{Number(product.discount || 0)}%</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm font-extrabold text-emerald-700">{formatCurrency(product.specialPrice)}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm"><StockPill quantity={product.quantity} /></td>
                                        <td className="px-4 py-3 text-sm text-slate-500">
                                            <p className="max-w-[240px] truncate">{product.description || "—"}</p>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => openKeyModal(product)}
                                                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-violet-100 bg-violet-50 px-2.5 text-xs font-bold text-violet-700 transition hover:bg-violet-100"
                                                >
                                                    <KeyRound size={13} />Keys
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => openEditForm(product)}
                                                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-900 bg-white px-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                                                >
                                                    <Edit3 size={13} />Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setProductToDelete(product)}
                                                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100"
                                                >
                                                    <Trash2 size={13} />Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden divide-y divide-slate-100">
                        {filteredProducts.map((product) => (
                            <div key={product.productId} className="p-4 space-y-3">
                                <div className="flex items-start gap-3">
                                    <ProductImage product={product} sizeClass="h-14 w-14 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="font-extrabold text-slate-900 text-sm leading-snug truncate">{product.productName}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">ID: {product.productId}</p>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{product.description || "No description"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <StockPill quantity={product.quantity} />
                                    <span className="text-xs text-slate-400">{formatCurrency(product.price)}</span>
                                    {Number(product.discount) > 0 && (
                                        <span className="text-xs text-slate-400">{Number(product.discount)}% off</span>
                                    )}
                                    <span className="text-xs font-bold text-emerald-700">{formatCurrency(product.specialPrice)}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => openKeyModal(product)}
                                        className="flex-1 inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-violet-100 bg-violet-50 text-xs font-bold text-violet-700 transition hover:bg-violet-100"
                                    >
                                        <KeyRound size={13} />Keys
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => openEditForm(product)}
                                        className="flex-1 inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-900 bg-white text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                                    >
                                        <Edit3 size={13} />Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setProductToDelete(product)}
                                        className="flex-1 inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-red-100 bg-red-50 text-xs font-bold text-red-600 transition hover:bg-red-100"
                                    >
                                        <Trash2 size={13} />Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col gap-2 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs font-medium text-slate-400">
                            Page {pagination.totalPages === 0 ? 0 : pagination.pageNumber + 1} of {pagination.totalPages} · {filteredProducts.length}{filteredProducts.length !== pagination.totalElements ? ` of ${pagination.totalElements}` : ""} products
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setPageNumber((p) => Math.max(0, p - 1))}
                                disabled={!canGoPrevious}
                                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-900 bg-white px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft size={14} />Previous
                            </button>
                            <button
                                type="button"
                                onClick={() => setPageNumber((p) => p + 1)}
                                disabled={!canGoNext}
                                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-900 bg-white px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next<ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit modal */}
            {editingProduct && (
                <EditProductModal
                    product={editingProduct}
                    form={editForm}
                    onChange={handleEditChange}
                    onImageChange={handleEditImageChange}
                    onClose={closeEditForm}
                    onSubmit={() => handleSaveEditChange(editingProduct.productId)}
                />
            )}

            {/* Add modal */}
            {isAddingProduct && (
                <AddProductModal
                    form={addForm}
                    categories={categories}
                    genres={genres}
                    developers={developers}
                    publishers={publishers}
                    onChange={handleAddChange}
                    onMultiToggle={handleMultiToggle}
                    onThumbnailChange={handleThumbnailChange}
                    onDescImagesChange={handleDescImagesChange}
                    onRemoveDescImage={removeDescImage}
                    onClose={closeAddForm}
                    onSubmit={handleAddSubmit}
                    isSubmitting={isSubmittingAdd}
                />
            )}

            <ConfirmModal
                isOpen={Boolean(productToDelete)}
                message={`Delete "${productToDelete?.productName || "this product"}"? This cannot be undone.`}
                onConfirm={confirmDeleteProduct}
                onCancel={() => !isDeleting && setProductToDelete(null)}
            />

            {/* Game Key modal */}
            {keyModalProduct && (
                <GameKeyModal
                    product={keyModalProduct}
                    onClose={closeKeyModal}
                    onKeysChanged={fetchProducts}
                />
            )}
        </section>
    );
};

/* ─── Add Product Modal ─────────────────────────────────────────────────── */

const AddProductModal = ({
    form, categories, genres, developers, publishers,
    onChange, onMultiToggle, onThumbnailChange, onDescImagesChange,
    onRemoveDescImage, onClose, onSubmit, isSubmitting,
}) => {
    const descImgInputRef = useRef(null);

    return (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-slate-950/60 px-0 sm:px-4">
            <div className="w-full sm:max-w-3xl max-h-[95dvh] overflow-hidden rounded-t-2xl sm:rounded-lg bg-white flex flex-col">

                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 shrink-0">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-blue-600">New product</p>
                        <h3 className="mt-1 text-lg font-extrabold text-slate-950">Add a new game</h3>
                        <p className="mt-0.5 text-xs text-slate-400">Fill in the details, upload images, and select metadata.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Close"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto flex-1 p-5 space-y-6">

                    {/* ── Section: Images ── */}
                    <FormSection icon={<Images size={14} />} title="Images">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Thumbnail */}
                            <div className="shrink-0 space-y-2">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Thumbnail</p>
                                {form.thumbnailPreview ? (
                                    <div className="relative group w-32 h-32">
                                        <img
                                            src={form.thumbnailPreview}
                                            alt="Thumbnail"
                                            className="w-32 h-32 rounded-lg border border-slate-300 object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 rounded-md border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-1 text-slate-400">
                                        <ImageOff size={20} />
                                        <span className="text-xs font-medium">No image</span>
                                    </div>
                                )}
                                <label className="flex h-8 w-32 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed border-blue-200 bg-blue-50 text-xs font-bold text-blue-700 transition hover:bg-blue-100">
                                    <Upload size={13} />
                                    {form.thumbnailFile ? "Change" : "Upload"}
                                    <input type="file" accept="image/*" onChange={onThumbnailChange} className="sr-only" />
                                </label>
                            </div>

                            {/* Description images */}
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                        Description images
                                        <span className="ml-1 font-normal normal-case text-slate-300">({form.descImageFiles.length}/{MAX_DESC_IMAGES})</span>
                                    </p>
                                    {form.descImageFiles.length < MAX_DESC_IMAGES && (
                                        <button
                                            type="button"
                                            onClick={() => descImgInputRef.current?.click()}
                                            className="inline-flex h-7 items-center gap-1 rounded-lg bg-blue-600 px-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
                                        >
                                            <Plus size={12} /> Add
                                        </button>
                                    )}
                                    <input
                                        ref={descImgInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={onDescImagesChange}
                                        className="sr-only"
                                    />
                                </div>
                                {form.descImagePreviews.length === 0 ? (
                                    <div
                                        onClick={() => descImgInputRef.current?.click()}
                                        className="cursor-pointer rounded-md border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-400 hover:border-blue-200 hover:bg-blue-50 transition"
                                    >
                                        <Images size={22} className="mx-auto mb-1" />
                                        <p className="text-xs font-medium">Click to add description images</p>
                                        <p className="text-xs text-slate-300">Up to {MAX_DESC_IMAGES} images</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                        {form.descImagePreviews.map((src, i) => (
                                            <div key={i} className="relative group aspect-square">
                                                <img
                                                    src={src}
                                                    alt={`desc-${i}`}
                                                    className="w-full h-full rounded-lg border border-slate-200 object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => onRemoveDescImage(i)}
                                                    className="absolute -top-1.5 -right-1.5 hidden group-hover:flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow"
                                                >
                                                    <X size={10} />
                                                </button>
                                            </div>
                                        ))}
                                        {form.descImageFiles.length < MAX_DESC_IMAGES && (
                                            <button
                                                type="button"
                                                onClick={() => descImgInputRef.current?.click()}
                                                className="aspect-square rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:border-blue-300 hover:text-blue-500 transition"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </FormSection>

                    {/* ── Section: Basic Info ── */}
                    <FormSection icon={<Tag size={14} />} title="Basic Info">
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <Field
                                    label="Game name"
                                    name="productName"
                                    value={form.productName}
                                    onChange={onChange}
                                    placeholder="e.g. Elden Ring"
                                    required
                                />
                            </div>

                            <Field
                                label="Price (USD)"
                                name="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.price}
                                onChange={onChange}
                                placeholder="0.00"
                                required
                            />
                            <Field
                                label="Discount (%)"
                                name="discount"
                                type="number"
                                min="0"
                                max="100"
                                value={form.discount}
                                onChange={onChange}
                                placeholder="0"
                            />
                            <Field
                                label="Release Date"
                                name="releaseDate"
                                type="date"
                                value={form.releaseDate}
                                onChange={onChange}
                            />

                            <label className="sm:col-span-2">
                                <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Description</span>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={onChange}
                                    rows={4}
                                    placeholder="Short game description…"
                                    className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                />
                            </label>
                        </div>
                    </FormSection>

                    {/* ── Section: Platform Support ── */}
                    <FormSection icon={<Monitor size={14} />} title="Platform Support">
                        <div className="flex flex-wrap gap-3">
                            {[
                                { name: "windows", label: "Windows" },
                                { name: "mac", label: "macOS" },
                                { name: "linux", label: "Linux" },
                            ].map(({ name, label }) => (
                                <label key={name} className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition has-[:checked]:border-blue-300 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-700">
                                    <input
                                        type="checkbox"
                                        name={name}
                                        checked={form[name]}
                                        onChange={onChange}
                                        className="h-4 w-4 rounded accent-blue-600"
                                    />
                                    {label}
                                </label>
                            ))}
                        </div>
                    </FormSection>

                    {/* ── Section: Metadata ── */}
                    <FormSection icon={<Boxes size={14} />} title="Metadata">
                        <div className="grid gap-4 sm:grid-cols-2">

                            {/* Publisher (single) */}
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                    Publisher <span className="text-red-500">*</span>
                                </span>
                                <select
                                    name="publisherId"
                                    value={form.publisherId}
                                    onChange={onChange}
                                    className="mt-2 h-9 w-full rounded-lg border border-slate-900 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="">Select publisher…</option>
                                    {publishers.map((p) => (
                                        <option key={p.publisherId} value={p.publisherId}>{p.publisherName}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Empty cell for grid alignment */}
                            <div className="hidden sm:block" />

                            {/* Categories (multi) */}
                            <MultiSelectChips
                                label="Categories"
                                required
                                items={categories}
                                idKey="categoryId"
                                nameKey="categoryName"
                                selected={form.categoriesId}
                                onToggle={(id) => onMultiToggle("categoriesId", id)}
                            />

                            {/* Genres (multi) */}
                            <MultiSelectChips
                                label="Genres"
                                required
                                items={genres}
                                idKey="genreId"
                                nameKey="genreName"
                                selected={form.genresId}
                                onToggle={(id) => onMultiToggle("genresId", id)}
                            />

                            {/* Developers (multi) — full width */}
                            <div className="sm:col-span-2">
                                <MultiSelectChips
                                    label="Developers"
                                    required
                                    items={developers}
                                    idKey="developerId"
                                    nameKey="developerName"
                                    selected={form.developersId}
                                    onToggle={(id) => onMultiToggle("developersId", id)}
                                />
                            </div>
                        </div>
                    </FormSection>
                </div>

                {/* Footer */}
                <div className="flex gap-2 border-t border-slate-100 px-5 py-4 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-none inline-flex h-9 items-center justify-center rounded-lg border border-slate-900 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-none inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                        {isSubmitting ? "Adding…" : "Add game"}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── Edit Product Modal (unchanged logic, kept separate) ───────────────── */

const EditProductModal = ({ product, form, onChange, onImageChange, onClose, onSubmit }) => {
    const imagePreviewSrc = form.imagePreview || getImageUrl(product?.image);

    return (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-slate-950/60 px-0 sm:px-4">
            <div className="w-full sm:max-w-2xl max-h-[95dvh] overflow-hidden rounded-t-2xl sm:rounded-lg bg-white flex flex-col">

                <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 shrink-0">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-blue-600">Edit product</p>
                        <h3 className="mt-1 text-lg font-extrabold text-slate-950 leading-snug">{product?.productName}</h3>
                    </div>
                    <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Close">
                        <X size={16} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-5">
                    <div className="flex flex-col gap-5 sm:flex-row">
                        <div className="sm:w-40 shrink-0 space-y-2">
                            {imagePreviewSrc ? (
                                <img src={imagePreviewSrc} alt="Preview" className="h-36 w-full sm:w-40 rounded-lg border border-slate-300 object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                            ) : (
                                <div className="h-36 w-full sm:w-40 rounded-md border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 text-slate-400">
                                    <ImageOff size={22} />
                                    <span className="text-xs font-medium">No image</span>
                                </div>
                            )}
                            <label className="flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-blue-200 bg-blue-50 px-3 text-xs font-bold text-blue-700 transition hover:bg-blue-100">
                                <Upload size={14} />
                                {form.imageFile ? "Change image" : "Choose image"}
                                <input type="file" accept="image/*" onChange={onImageChange} className="sr-only" />
                            </label>
                            {form.imageFile && <p className="truncate text-xs text-slate-400 text-center">{form.imageFile.name}</p>}
                        </div>

                        <div className="flex-1 grid gap-3 sm:grid-cols-2 content-start">
                            <div className="sm:col-span-2">
                                <Field label="Product name" name="productName" value={form.productName} onChange={onChange} placeholder="e.g. Elden Ring" required />
                            </div>
                            <Field label="Price (USD)" name="price" type="number" min="0" step="0.01" value={form.price} onChange={onChange} placeholder="0.00" required />
                            <Field label="Stock (= available keys)" name="quantity" type="number" value={form.quantity} onChange={onChange} disabled />
                            <Field label="Discount (%)" name="discount" type="number" min="0" max="100" value={form.discount} onChange={onChange} placeholder="0" />
                            <Field label="Special price" name="specialPrice" type="number" value={form.specialPrice} onChange={onChange} disabled />
                            <label className="sm:col-span-2">
                                <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Description</span>
                                <textarea name="description" value={form.description} onChange={onChange} rows={3} placeholder="Short product description…" className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 border-t border-slate-100 px-5 py-4 shrink-0">
                    <button type="button" onClick={onClose} className="flex-1 sm:flex-none inline-flex h-9 items-center justify-center rounded-lg border border-slate-900 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
                        Cancel
                    </button>
                    <button type="button" onClick={onSubmit} className="flex-1 sm:flex-none inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700">
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── Sub-components ────────────────────────────────────────────────────── */

const FormSection = ({ icon, title, children }) => (
    <div>
        <div className="flex items-center gap-1.5 mb-3">
            <span className="text-blue-500">{icon}</span>
            <h4 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">{title}</h4>
        </div>
        <div className="rounded-md border border-slate-100 bg-slate-50/50 p-4">
            {children}
        </div>
    </div>
);

/**
 * Multi-select chip group — renders all items as toggleable pills.
 * Scrollable if list is long.
 */
const MultiSelectChips = ({ label, required, items, idKey, nameKey, selected, onToggle }) => (
    <div>
        <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
            {label} {required && <span className="text-red-500">*</span>}
            {selected.length > 0 && (
                <span className="ml-1 font-normal normal-case text-blue-500">({selected.length} selected)</span>
            )}
        </span>
        {items.length === 0 ? (
            <p className="mt-2 text-xs text-slate-400 italic">No {label.toLowerCase()} available.</p>
        ) : (
            <div className="mt-2 flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                {items.map((item) => {
                    const id = item[idKey];
                    const isSelected = selected.includes(id);
                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => onToggle(id)}
                            className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold transition border ${
                                isSelected
                                    ? "border-blue-500 bg-blue-600 text-white "
                                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                            }`}
                        >
                            {isSelected && <span className="mr-1 text-blue-200">✓</span>}
                            {item[nameKey]}
                        </button>
                    );
                })}
            </div>
        )}
    </div>
);

const ProductImage = ({ product, sizeClass = "h-12 w-12" }) => {
    const imageUrl = getImageUrl(product.image || product.thumbnail);
    if (!imageUrl) {
        return (
            <div className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-400`}>
                <ImageOff size={16} />
            </div>
        );
    }
    return (
        <img
            src={imageUrl}
            alt={product.productName}
            className={`${sizeClass} shrink-0 rounded-lg border border-slate-300 object-cover`}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
    );
};

const StockPill = ({ quantity }) => {
    const stock = Number(quantity || 0);
    const cls = stock > 10
        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
        : stock > 0
            ? "bg-amber-50 text-amber-700 ring-amber-200"
            : "bg-red-50 text-red-700 ring-red-200";
    return (
        <span className={`inline-flex rounded-lg px-2 py-0.5 text-xs font-bold ring-1 ${cls}`}>
            {stock} in stock
        </span>
    );
};

const Field = ({ label, required = false, disabled = false, placeholder, ...props }) => (
    <label>
        <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
            {label} {required && <span className="text-red-500">*</span>}
        </span>
        <input
            {...props}
            disabled={disabled}
            placeholder={placeholder}
            className="mt-2 h-9 w-full rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-400"
        />
    </label>
);

const StatePanel = ({ icon: Icon, title, description, danger = false, spinning = false, onRetry, action }) => (
    <div className="rounded-lg border border-slate-900 bg-white p-10 text-center">
        <div className={`mx-auto flex h-11 w-11 items-center justify-center rounded-md ${danger ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-600"}`}>
            <Icon size={22} className={spinning ? "animate-spin" : ""} />
        </div>
        <h3 className="mt-4 text-base font-extrabold text-slate-900">{title}</h3>
        {description && <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">{description}</p>}
        <div className="mt-5 flex justify-center gap-2 flex-wrap">
            {onRetry && (
                <button type="button" onClick={onRetry} className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-900 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
                    <RefreshCw size={15} />Try again
                </button>
            )}
            {action && (
                <button type="button" onClick={action.onClick} className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700">
                    <Plus size={15} />{action.label}
                </button>
            )}
        </div>
    </div>
);