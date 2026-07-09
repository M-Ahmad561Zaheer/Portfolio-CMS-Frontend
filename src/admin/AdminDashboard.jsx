import { useEffect, useState } from "react";
import {
  FolderKanban,
  Mail,
  ShieldCheck,
  MessageSquareQuote,
  Newspaper,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  Code2,
  Settings,
  BriefcaseBusiness,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    messages: 0,
    admins: 0,
    blogs: 0,
    testimonials: 0,
    experience: 0,
    skills: 0,
    services: 0,
  });

  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);

  const loadData = async () => {
    const statsRes = await api.get("/Dashboard/stats");
    setStats(statsRes.data);

    const msgRes = await api.get("/Contact");
    setMessages(msgRes.data.slice(0, 4));

    const projectRes = await api.get("/Projects");
    setProjects(projectRes.data.slice(0, 4));
  };

  useEffect(() => {
    loadData();
  }, []);

  const cards = [
    { title: "Projects", value: stats.projects, icon: <FolderKanban />, link: "/admin/projects" },
    { title: "Messages", value: stats.messages, icon: <Mail />, link: "/admin/messages" },
    { title: "Blogs", value: stats.blogs, icon: <Newspaper />, link: "/admin/blogs" },
    { title: "Testimonials", value: stats.testimonials, icon: <MessageSquareQuote />, link: "/admin/testimonials" },
    { title: "Admins", value: stats.admins, icon: <ShieldCheck />, link: "/admin/profile" },
    { title: "Experience", value: stats.experience, icon: <BriefcaseBusiness />, link: "/admin/experiences" },
    { title: "Skills", value: stats.skills, icon: <Code2 />, link: "/admin/skills" },
    { title: "Services", value: stats.services, icon: <Settings />, link: "/admin/services" },
  ];

  const quickActions = [
    { label: "Add Project", to: "/admin/projects", icon: <Plus /> },
    { label: "Write Blog", to: "/admin/blogs", icon: <Newspaper /> },
    { label: "View Messages", to: "/admin/messages", icon: <Mail /> },
    { label: "View Website", to: "/", icon: <Eye /> },
  ];

  const pendingMessages = messages.filter((m) => !m.isReplied).length;

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-500/20 via-cyan-500/10 to-slate-900 p-8 shadow-2xl">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />

        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Portfolio CMS
        </p>

        <h2 className="text-3xl font-bold md:text-4xl">
          Welcome back, Ahmad 👋
        </h2>

        <p className="mt-3 max-w-2xl text-slate-300">
          Manage your portfolio content, client messages, projects, blogs,
          skills, services, and profile updates from one clean admin command center.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:bg-white/10"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                {card.icon}
              </div>

              <ArrowUpRight
                size={18}
                className="text-slate-500 transition group-hover:text-emerald-400"
              />
            </div>

            <p className="text-sm text-slate-400">{card.title}</p>

            <h3 className="mt-2 text-4xl font-bold text-white">
              {card.value ?? 0}
            </h3>
          </Link>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-emerald-400 hover:bg-white/10"
          >
            <div className="flex items-center gap-3">
              <span className="text-emerald-400">{action.icon}</span>
              <span>{action.label}</span>
            </div>

            <ArrowUpRight size={16} className="text-slate-500" />
          </Link>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-2xl font-bold">Recent Messages</h3>

            <Link
              to="/admin/messages"
              className="text-sm text-emerald-400 hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="rounded-2xl border border-white/10 bg-slate-950 p-5 transition hover:border-emerald-400/50"
              >
                <div className="mb-2 flex items-center justify-between gap-4">
                  <h4 className="font-semibold">{msg.name}</h4>

                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      msg.isReplied
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {msg.isReplied ? "Replied" : "Pending"}
                  </span>
                </div>

                <p className="text-sm text-emerald-400">{msg.email}</p>

                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">
                  {msg.message}
                </p>
              </div>
            ))}

            {messages.length === 0 && (
              <p className="rounded-2xl border border-white/10 bg-slate-950 p-5 text-slate-400">
                No recent messages.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="mb-5 flex items-center gap-3">
              <Activity className="text-emerald-400" />
              <h3 className="text-2xl font-bold">Content Health</h3>
            </div>

            <div className="space-y-4 text-sm">
              {[
                ["Projects Added", stats.projects],
                ["Blogs Added", stats.blogs],
                ["Testimonials", stats.testimonials],
                ["Skills Added", stats.skills],
                ["Services Added", stats.services],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-slate-300">{label}</span>
                  <span
                    className={
                      value > 0 ? "text-emerald-400" : "text-red-400"
                    }
                  >
                    {value > 0 ? "Good" : "Missing"}
                  </span>
                </div>
              ))}

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Pending Messages</span>
                <span
                  className={
                    pendingMessages > 0 ? "text-yellow-400" : "text-emerald-400"
                  }
                >
                  {pendingMessages}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-2xl font-bold">Recent Projects</h3>

              <Link
                to="/admin/projects"
                className="text-sm text-emerald-400 hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="flex items-start gap-3">
                  <CheckCircle className="mt-1 text-emerald-400" size={18} />

                  <div>
                    <h4 className="font-semibold">{project.title}</h4>
                    <p className="line-clamp-1 text-sm text-slate-400">
                      {project.techStack}
                    </p>
                  </div>
                </div>
              ))}

              {projects.length === 0 && (
                <p className="text-slate-400">No projects yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3">
              <Clock className="text-emerald-400" />
              <div>
                <h3 className="font-semibold">Last Updated</h3>
                <p className="text-sm text-slate-400">
                  {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;