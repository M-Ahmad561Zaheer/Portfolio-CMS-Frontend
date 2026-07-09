import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Mail,
  LogOut,
  Newspaper,
  MessageSquareQuote,
  UserCog,
  BriefcaseBusiness,
  Code2,
  Settings,
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const links = [
    { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/admin/projects", label: "Projects", icon: <FolderKanban size={20} /> },
    { to: "/admin/blogs", label: "Blogs", icon: <Newspaper size={20} /> },
    { to: "/admin/experiences", label: "Experiences", icon: <BriefcaseBusiness size={20} /> },
    { to: "/admin/skills", label: "Skills", icon: <Code2 size={20} /> },
    { to: "/admin/services", label: "Services", icon: <Settings size={20} /> },
    { to: "/admin/testimonials", label: "Testimonials", icon: <MessageSquareQuote size={20} /> },
    { to: "/admin/profile", label: "Profile Settings", icon: <UserCog size={20} /> },
    { to: "/admin/messages", label: "Messages", icon: <Mail size={20} /> },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <aside className="fixed left-0 top-0 hidden h-full w-64 overflow-y-auto border-r border-white/10 bg-slate-900 p-6 md:block">
        <h2 className="mb-10 text-2xl font-bold">
          Admin<span className="text-emerald-400">Panel</span>
        </h2>

        <nav className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                  isActive
                    ? "bg-emerald-500 text-slate-950"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-300 transition hover:bg-red-500/20 hover:text-red-400"
          >
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </aside>

      <section className="md:ml-64">
        <div className="p-6">
          <Outlet />
        </div>
      </section>
    </main>
  );
};

export default AdminLayout;