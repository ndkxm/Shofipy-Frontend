import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { AdminSidebar } from "../shared/AdminSidebar";
import { AdminOrder } from "./orders/AdminOrder";
import { AdminProduct } from "./product/AdminProduct";
import { DashboardHome } from "./dashboard/DashboardHome";
import { AdminUsers } from "./users/AdminUsers";
import { AdminCatalog } from "./catalog/AdminCatalog";
import { AdminRefunds } from "./refunds/AdminRefunds";

// ─── tab config ───────────────────────────────────────────────────────────────
const tabTitles = {
    dashboard: "Dashboard",
    orders:    "Orders",
    products:  "Products",
    catalog:   "Catalog",
    sellers:   "Sellers",
    customers: "Customers",
    refunds:   "Refunds",
    reports:   "Reports",
    settings:  "Settings",
};

const getTodayLabel = () =>
    new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month:   "short",
        day:     "2-digit",
        year:    "numeric",
    }).format(new Date());

// ─── main admin shell ─────────────────────────────────────────────────────────
export const AdminDashboard = () => {
    const [activeTab, setActiveTab]     = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <AdminSidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onToggle={() => setSidebarOpen((o) => !o)}
            />

            <main className="lg:pl-72">
                <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">

                    {/* ── page header ── */}
                    <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 pl-14 lg:pl-0 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-blue-600">{getTodayLabel()}</p>
                            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                                {tabTitles[activeTab] || "Admin"}
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                Manage store operations and monitor performance from one workspace.
                            </p>
                        </div>
                    </header>

                    {/* ── tab content ── */}
                    {activeTab === "dashboard" && <DashboardHome />}
                    {activeTab === "orders"    && <AdminOrder />}
                    {activeTab === "products"  && <AdminProduct />}
                    {activeTab === "customers" && <AdminUsers />}
                    {activeTab === "catalog"   && <AdminCatalog />}
                    {activeTab === "refunds"   && <AdminRefunds />}

                    {/* ── placeholder for unbuilt tabs ── */}
                    {!["dashboard", "orders", "products", "customers", "catalog", "refunds"].includes(activeTab) && (
                        <TabPlaceholder tabName={tabTitles[activeTab] || activeTab} />
                    )}
                </div>
            </main>
        </div>
    );
};

// ─── placeholder ──────────────────────────────────────────────────────────────
const TabPlaceholder = ({ tabName }) => (
    <section className="flex flex-1 items-center justify-center py-20">
        <div className="w-full max-w-xl rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <ShieldCheck size={26} />
            </div>
            <h2 className="mt-5 text-xl font-extrabold text-slate-950">{tabName} workspace</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
                This tab is ready in the admin layout. Connect its component when the backend endpoint is available.
            </p>
        </div>
    </section>
);
