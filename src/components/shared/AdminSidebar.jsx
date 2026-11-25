import {
    BarChart3,
    BookOpen,
    Boxes,
    ClipboardList,
    LayoutDashboard,
    Menu,
    RotateCcw,
    Settings,
    Store,
    Users,
    X,
} from "lucide-react";

const ADMIN_TABS = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ClipboardList },
    { id: "products", label: "Products", icon: Boxes },
    { id: "catalog", label: "Catalog", icon: BookOpen },
    { id: "customers", label: "Customers", icon: Users },
    { id: "refunds", label: "Refunds", icon: RotateCcw },
];

export const AdminSidebar = ({ activeTab, onTabChange, isOpen, onClose, onToggle }) => {
    const handleTabClick = (tabId) => {
        onTabChange(tabId);
        onClose?.();
    };

    return (
        <>
            <button
                type="button"
                onClick={onToggle}
                className="fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-md border border-slate-900 bg-white text-slate-900 lg:hidden"
                aria-label="Open admin menu"
            >
                <Menu size={20} />
            </button>

            {isOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
                    onClick={onClose}
                    aria-label="Close admin menu overlay"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-900 bg-slate-900 text-slate-300 transition-transform duration-200 lg:translate-x-0 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-600 text-white border border-slate-50">
                            <LayoutDashboard size={20} />
                        </div>
                        <div>
                            <p className="text-base font-extrabold text-slate-50">Admin</p>
                            <p className="label-mono text-slate-500">Shofipy control</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 lg:hidden"
                        aria-label="Close admin menu"
                    >
                        <X size={18} />
                    </button>
                </div>

                <nav className="flex-1 space-y-1 px-3 py-4">
                    {ADMIN_TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                type="button"
                                key={tab.id}
                                onClick={() => handleTabClick(tab.id)}
                                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors ${
                                    isActive
                                        ? "bg-slate-50 text-slate-900"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-50"
                                }`}
                            >
                                <Icon size={18} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="border-t border-slate-800 p-4">
                    <div className="rounded-md border border-slate-700 p-3">
                        <p className="text-sm font-bold text-slate-100">Analytics API</p>
                        <p className="mt-1 text-xs leading-5 text-slate-400">
                            Dashboard uses live data from backend admin analytics.
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
};
