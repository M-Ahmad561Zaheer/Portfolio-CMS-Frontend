import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Mail,
  LogOut,
  Newspaper,
  MessageSquareQuote,
  UserCog,
  BriefcaseBusiness,
  GraduationCap,
  Code2,
  Settings,
  Menu,
  X,
  Sparkles,
  Sun,
  Moon
} from "lucide-react";

const AdminLayout = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setIsMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  const logout = () => {
    if (!window.confirm("Are you sure you want to end your admin session?")) return;
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const links = [
    { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { to: "/admin/projects", label: "Projects", icon: <FolderKanban size={16} /> },
    { to: "/admin/blogs", label: "Blogs", icon: <Newspaper size={16} /> },
    { to: "/admin/educations", label: "Education", icon: <GraduationCap size={16} /> },
    { to: "/admin/experiences", label: "Experiences", icon: <BriefcaseBusiness size={16} /> },
    { to: "/admin/skills", label: "Skills", icon: <Code2 size={16} /> },
    { to: "/admin/services", label: "Services", icon: <Settings size={16} /> },
    { to: "/admin/testimonials", label: "Testimonials", icon: <MessageSquareQuote size={16} /> },
    { to: "/admin/profile", label: "Profile Settings", icon: <UserCog size={16} /> },
    { to: "/admin/messages", label: "Messages", icon: <Mail size={16} /> },
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#050811] text-slate-800 dark:text-slate-100 antialiased font-sans selection:bg-emerald-500/20 transition-colors duration-300">
      
      {/* Background Neon Lighting Blurs */}
      <div className="pointer-events-none fixed left-0 top-0 -z-50 h-[400px] w-[400px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/5 bg-emerald-500/10 blur-[120px]" />
      <div className="pointer-events-none fixed right-0 bottom-0 -z-50 h-[400px] w-[400px] rounded-full bg-blue-500/5 dark:bg-blue-500/5 bg-blue-500/10 blur-[120px]" />

      {/* 1. Mobile Top Navigation Header */}
      <header className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-white/5 bg-white/70 dark:bg-slate-950/70 px-6 backdrop-blur-xl md:hidden fixed top-0 left-0 right-0 z-40 transition-colors">
        <h2 className="text-lg font-black tracking-wider uppercase">
          Admin<span className="text-emerald-500">Panel</span>
        </h2>
        <div className="flex items-center gap-3">
          {/* Mobile Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-xl bg-slate-200/50 dark:bg-white/5 p-2 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5 active:scale-95 transition-all"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="rounded-xl bg-slate-200/50 dark:bg-white/5 p-2 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5 active:scale-95 transition-all"
          >
            {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Backdrop overlay for active mobile menu */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 dark:bg-black/80 backdrop-blur-sm md:hidden transition-all duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 2. Side Navigation Sidebar */}
      <aside className={`fixed bottom-0 top-0 left-0 z-50 w-64 overflow-y-auto border-r border-slate-200 dark:border-white/5 bg-white/95 dark:bg-slate-950/90 md:bg-white/60 md:dark:bg-slate-950/60 p-6 backdrop-blur-xl transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        
        {/* Brand Logo Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-black tracking-wider uppercase flex items-center gap-2 text-slate-800 dark:text-white">
            <Sparkles size={18} className="text-emerald-500 dark:text-emerald-400 animate-pulse" />
            <span>
              Admin<span className="text-emerald-500 dark:text-emerald-400">Panel</span>
            </span>
          </h2>
          {isMobileOpen && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="rounded-xl p-1.5 text-slate-500 hover:text-slate-300 border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 md:hidden"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Navigation stack links */}
        <nav className="space-y-1">
          <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
            Navigation Hub
          </p>
          
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 border ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 border-emerald-400/20 shadow-lg shadow-emerald-500/10 scale-[1.02]"
                    : "text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-100 hover:border-slate-200 dark:hover:border-white/5"
                }`
              }
            >
              <span className="shrink-0">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}

          {/* Separation Border & Logout Gateway */}
          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-white/5">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 border border-transparent hover:border-rose-500/15 transition-all duration-200"
            >
              <LogOut size={16} className="shrink-0" />
              Logout Session
            </button>
          </div>
        </nav>
      </aside>

      {/* 3. Primary Content Panel */}
      <section className="md:ml-64 min-h-screen pt-16 md:pt-0 flex flex-col">
        {/* Desktop Top Bar for Theme Switcher */}
        <div className="hidden md:flex h-16 items-center justify-end px-8 border-b border-slate-200 dark:border-white/5">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-950/40 px-3 py-1.5 text-xs font-semibold hover:border-emerald-500/30 transition-all text-slate-600 dark:text-slate-300"
          >
            {darkMode ? (
              <>
                <Sun size={14} className="text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={14} className="text-blue-500" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>

        {/* Global context dynamic injector for underlying admin pages */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ darkMode }} />
        </div>
        
        {/* Universal Brand Footer */}
        <footer className="py-6 text-center border-t border-slate-200 dark:border-white/5 text-[9px] uppercase font-bold tracking-[0.3em] text-slate-400 dark:text-slate-600 transition-colors">
          Portfolio CMS Console © {new Date().getFullYear()}
        </footer>
      </section>
    </main>
  );
};

export default AdminLayout;