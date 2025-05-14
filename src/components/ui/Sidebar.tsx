import classNames from "classnames";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Menu,
  MoonIcon,
  SmileIcon,
  SunIcon,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
  { name: "Users", path: "/users", icon: <Users size={18} /> },
  { name: "Reactions", path: "/reactions", icon: <SmileIcon size={18} /> },
];

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const user = { name: "Gabriel Schmidt", avatar: "https://i.pravatar.cc/40" };
  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white">
      {/* Sidebar */}
      <div
        className={classNames(
          "fixed z-30 inset-y-0 left-0 bg-white dark:bg-gray-800 border-r border-slate-200 dark:border-gray-700 shadow-sm transition-all duration-200 ease-in-out",
          "md:static md:translate-x-0",
          collapsed ? "w-20" : "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo + Collapse */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-md" />
            {!collapsed && (
              <span className="font-bold text-lg">True Reaction</span>
            )}
          </div>
          <div className="md:flex hidden">
            <button onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>
          </div>
          <div className="md:hidden flex">
            <button onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Nav items */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={classNames(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
                  collapsed && "justify-center"
                )}
              >
                {item.icon}
                {!collapsed && item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden bg-white border-b px-4 py-3 flex justify-between items-center dark:bg-gray-800 dark:border-gray-700">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-lg font-semibold">Dashboard</span>
        </header>

        {/* Desktop topbar */}
        <div className="hidden md:flex justify-end items-center bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-sm text-gray-600 dark:text-gray-300 hover:underline p-1 border rounded-md transition-colors cursor-pointer border-slate-800 dark:border-slate-200"
            >
              {darkMode ? (
                <SunIcon size={20} className="text-slate-200" />
              ) : (
                <MoonIcon size={20} className="text-slate-800" />
              )}
            </button>
            <div className="flex flex-row items-center gap-2">
              <img
                src={user.avatar}
                alt="User"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
