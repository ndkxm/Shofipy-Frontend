import {
    BarChart3,
    Boxes,
    ClipboardList,
    LayoutDashboard,
    Menu,
    Settings,
    Store,
    Users,
    X,
} from "lucide-react";
import { Link } from "react-router-dom";

const ADMIN_TABS = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ClipboardList },
    { id: "products", label: "Products", icon: Boxes },
    { id: "customers", label: "Customers", icon: Users },
];

const BagIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
);

export const StaffSidebar = ({ activeTab, onTabChange, isOpen, onClose, onToggle }) => {
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
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-900 bg-slate-900 text-slate-300 transition-transform duration-200 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-600 text-white border border-slate-50">
                            <Link to="/">
                                <BagIcon size={20} />
                            </Link>
                        </div>
                        <div>
                            <p className="text-base font-extrabold text-slate-50">Staff</p>
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
                                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors ${isActive
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
            </aside>
        </>
    );
};
