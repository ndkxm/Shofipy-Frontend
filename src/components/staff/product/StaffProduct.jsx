import { useEffect, useState } from "react";
import {
    AlertCircle,
    Boxes,
    ChevronLeft,
    ChevronRight,
    ChevronsUpDown,
    Edit3,
    Filter,
    ImageOff,
    Loader2,
    PackageOpen,
    Plus,
    RefreshCw,
    Search,
    Trash2,
    Upload,
    X,
} from "lucide-react";
import api from "../../../api/api";
import { ConfirmModal } from "../../shared/ConfirmModal";
import { parseImages } from "../../utils/ParseImages";
import { Bounce, toast } from "react-toastify";

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
    discount: "",
    categoryId: "",
    imageFile: null,
    imagePreview: "",
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

export const StaffProduct = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
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

    const fetchCategories = async () => {
        try {
            const { data } = await api.get("/public/categories");
            setCategories(data?.content || []);
        } catch {
            // Non-blocking
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [pageNumber, pageSize, sortConfig, keyword]);

    useEffect(() => {
        fetchCategories();
    }, []);

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

    // ── Edit ──────────────────────────────────────────────────────────────
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

    // ── Add ───────────────────────────────────────────────────────────────
    const openAddForm = () => {
        setAddForm(buildAddState());
        setIsAddingProduct(true);
    };

    const closeAddForm = () => {
        setIsAddingProduct(false);
        setAddForm(buildAddState());
    };

    const handleAddChange = (e) => {
        const { name, value } = e.target;
        setAddForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setAddForm((prev) => ({
            ...prev,
            imageFile: file,
            imagePreview: URL.createObjectURL(file),
        }));
    };

    const handleAddSubmit = async () => {
        if (!addForm.productName.trim()) return showToast("Product name is required.");
        if (!addForm.price || Number(addForm.price) <= 0) return showToast("Price must be greater than 0.");
        if (!addForm.categoryId) return showToast("Please select a category.");

        try {
            setIsSubmittingAdd(true);
            const payload = {
                productName: addForm.productName.trim(),
                description: addForm.description.trim(),
                price: Number(addForm.price),
                quantity: Number(addForm.quantity) || 0,
                discount: Number(addForm.discount) || 0,
            };
            const { data: newProduct } = await api.post(
                `/admin/categories/${addForm.categoryId}/product`,
                payload
            );
            if (addForm.imageFile && newProduct?.productId) {
                const formData = new FormData();
                formData.append("file", addForm.imageFile);
                try {
                    await api.put(`/admin/products/${newProduct.productId}/image`, formData);
                } catch { /* non-blocking */ }
            }
            showSuccessToast(`"${payload.productName}" added successfully.`);
            closeAddForm();
            fetchProducts();
        } catch (error) {
            showToast(error.response?.data?.message || "Failed to add product.");
        } finally {
            setIsSubmittingAdd(false);
        }
    };


    const canGoPrevious = pageNumber > 0 && !isLoading;
    const canGoNext = !pagination.lastPage && !isLoading;

    const filteredProducts = products.filter((p) => {
        const qty = Number(p.quantity || 0);
        if (stockFilter === "in") return qty > 10;
        if (stockFilter === "low") return qty > 0 && qty <= 10;
        if (stockFilter === "out") return qty === 0;
        return true;
    });

    return (
        <section className="space-y-4 py-4 px-2 sm:px-0 sm:py-6">
            {/* Header card */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-blue-600">
                                <Boxes size={15} />
                                Staff products
                            </div>
                            <h2 className="mt-1.5 text-lg font-extrabold text-slate-950 sm:text-xl">Product management</h2>
                            <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">Browse, edit, and manage your product catalogue.</p>
                        </div>

                        <button
                            type="button"
                            onClick={openAddForm}
                            className="shrink-0 inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-3 sm:px-4 text-xs sm:text-sm font-bold text-white transition hover:bg-blue-700 shadow-sm"
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
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
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
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100 text-left">
                            <thead className="bg-slate-50">
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
                                                    onClick={() => openEditForm(product)}
                                                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                                                >
                                                    <Edit3 size={13} />Edit
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
                                        onClick={() => openEditForm(product)}
                                        className="flex-1 inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                                    >
                                        <Edit3 size={13} />Edit
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
                                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft size={14} />Previous
                            </button>
                            <button
                                type="button"
                                onClick={() => setPageNumber((p) => p + 1)}
                                disabled={!canGoNext}
                                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next<ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit modal */}
            {editingProduct && (
                <ProductModal
                    mode="edit"
                    product={editingProduct}
                    form={editForm}
                    categories={categories}
                    onChange={handleEditChange}
                    onImageChange={handleEditImageChange}
                    onClose={closeEditForm}
                    onSubmit={() => handleSaveEditChange(editingProduct.productId)}
                />
            )}

            {/* Add modal */}
            {isAddingProduct && (
                <ProductModal
                    mode="add"
                    form={addForm}
                    categories={categories}
                    onChange={handleAddChange}
                    onImageChange={handleAddImageChange}
                    onClose={closeAddForm}
                    onSubmit={handleAddSubmit}
                    isSubmitting={isSubmittingAdd}
                />
            )}
        </section>
    );
};

/* ─── Shared ProductModal ────────────────────────────────────────────────── */

const ProductModal = ({ mode, product, form, categories, onChange, onImageChange, onClose, onSubmit, isSubmitting = false }) => {
    const isAdd = mode === "add";
    const imagePreviewSrc = form.imagePreview || (isAdd ? "" : getImageUrl(product?.image));

    return (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-slate-950/60 px-0 sm:px-4">
            <div className="w-full sm:max-w-2xl max-h-[95dvh] overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl flex flex-col">

                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 shrink-0">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                            {isAdd ? "New product" : "Edit product"}
                        </p>
                        <h3 className="mt-1 text-base font-extrabold text-slate-950 leading-snug">
                            {isAdd ? "Add a new product" : product?.productName}
                        </h3>
                        {isAdd && (
                            <p className="mt-0.5 text-xs text-slate-400">Fill in the details below to create a new product.</p>
                        )}
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

                {/* Body */}
                <div className="overflow-y-auto flex-1 p-5">
                    <div className="flex flex-col gap-5 sm:flex-row">
                        {/* Image column */}
                        <div className="sm:w-40 shrink-0 space-y-2">
                            {imagePreviewSrc ? (
                                <img
                                    src={imagePreviewSrc}
                                    alt="Preview"
                                    className="h-36 w-full sm:w-40 rounded-xl border border-slate-200 object-cover"
                                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                                />
                            ) : (
                                <div className="h-36 w-full sm:w-40 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 text-slate-400">
                                    <ImageOff size={22} />
                                    <span className="text-xs font-medium">No image</span>
                                </div>
                            )}
                            <label className="flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-blue-200 bg-blue-50 px-3 text-xs font-bold text-blue-700 transition hover:bg-blue-100">
                                <Upload size={14} />
                                {form.imageFile ? "Change image" : "Choose image"}
                                <input type="file" accept="image/*" onChange={onImageChange} className="sr-only" />
                            </label>
                            {form.imageFile && (
                                <p className="truncate text-xs text-slate-400 text-center">{form.imageFile.name}</p>
                            )}
                        </div>

                        {/* Fields */}
                        <div className="flex-1 grid gap-3 sm:grid-cols-2 content-start">
                            <div className="sm:col-span-2">
                                <Field
                                    label="Product name"
                                    name="productName"
                                    value={form.productName}
                                    onChange={onChange}
                                    placeholder="e.g. Wireless Headphones"
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
                                label="Quantity"
                                name="quantity"
                                type="number"
                                min="0"
                                value={form.quantity}
                                onChange={onChange}
                                placeholder="0"
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

                            {/* Special price: readonly on edit only */}
                            {!isAdd && (
                                <Field
                                    label="Special price"
                                    name="specialPrice"
                                    type="number"
                                    value={form.specialPrice}
                                    onChange={onChange}
                                    disabled
                                />
                            )}

                            {/* Category dropdown: add only */}
                            {isAdd && (
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                        Category <span className="text-red-500 font-bold">*</span>
                                    </span>
                                    <select
                                        name="categoryId"
                                        value={form.categoryId}
                                        onChange={onChange}
                                        className="mt-2 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option value="">Select a category…</option>
                                        {categories.map((cat) => (
                                            <option key={cat.categoryId} value={cat.categoryId}>
                                                {cat.categoryName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <label className="sm:col-span-2">
                                <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Description</span>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={onChange}
                                    rows={3}
                                    placeholder="Short product description…"
                                    className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-2 border-t border-slate-100 px-5 py-4 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-none inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-none inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                        {isAdd ? (isSubmitting ? "Adding…" : "Add product") : "Save changes"}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── Sub-components ─────────────────────────────────────────────────────── */

const ProductImage = ({ product, sizeClass = "h-12 w-12" }) => {
    const imageUrl = getImageUrl(product.image);
    if (!imageUrl) {
        return (
            <div className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400`}>
                <ImageOff size={16} />
            </div>
        );
    }
    return (
        <img
            src={imageUrl}
            alt={product.productName}
            className={`${sizeClass} shrink-0 rounded-xl border border-slate-200 object-cover`}
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
    <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className={`mx-auto flex h-11 w-11 items-center justify-center rounded-xl ${danger ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-600"}`}>
            <Icon size={22} className={spinning ? "animate-spin" : ""} />
        </div>
        <h3 className="mt-4 text-base font-extrabold text-slate-900">{title}</h3>
        {description && <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">{description}</p>}
        <div className="mt-5 flex justify-center gap-2 flex-wrap">
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                    <RefreshCw size={15} />Try again
                </button>
            )}
            {action && (
                <button
                    type="button"
                    onClick={action.onClick}
                    className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                    <Plus size={15} />{action.label}
                </button>
            )}
        </div>
    </div>
);