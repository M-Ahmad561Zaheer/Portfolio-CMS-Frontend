import { useEffect, useState } from "react";
import { Edit, Trash2, X, FolderKanban, Image, Github, ExternalLink, Sparkles, Loader2, PlusCircle, AlertCircle, Eye, Code } from "lucide-react";
import api from "../api/api";

const emptyForm = {
  title: "",
  description: "",
  longDescription: "",
  imageUrl: "",
  githubUrl: "",
  liveUrl: "",
  techStack: "",
};

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Secure Authorization Token Helper
  const getHeadersConfig = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Projects", getHeadersConfig());
      setProjects(res.data || []);
    } catch (err) {
      console.error(err);
      setStatus("Failed to load projects repository archive.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus("");

    try {
      if (editingId) {
        await api.put(`/Projects/${editingId}`, form, getHeadersConfig());
        setStatus("Project configured parameters updated successfully.");
      } else {
        await api.post("/Projects", form, getHeadersConfig());
        setStatus("New portfolio project committed successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);
      await fetchProjects();
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      console.error(err);
      setStatus("Failed to commit project build specifications.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription || "",
      imageUrl: project.imageUrl || "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      techStack: project.techStack,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Are you entirely sure you want to clean this project from production repositories?")) return;

    try {
      await api.delete(`/Projects/${id}`, getHeadersConfig());
      setStatus("Project node cleared successfully.");
      await fetchProjects();
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      console.error(err);
      setStatus("Failed to clean selected project element.");
    }
  };

  return (
    <div className="space-y-6 p-2 sm:p-4 md:p-6 text-slate-800 dark:text-slate-100 antialiased max-w-5xl mx-auto">
      
      {/* 1. Header Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-black p-6 md:p-8 shadow-sm dark:shadow-2xl">
        <div className="absolute right-0 top-0 -mr-12 -mt-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />
        
        <div className="relative z-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <FolderKanban size={14} className="animate-pulse" /> Engineering Registry
          </p>
          <h2 className="text-2xl font-extrabold sm:text-3xl md:text-4xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            Manage Projects
          </h2>
          <p className="mt-2 max-w-xl text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            Control showcase architectures, deploy specifications, dynamic cover illustrations, and system targets.
          </p>
        </div>
      </div>

      {/* Dynamic Status Alert Banner */}
      {status && (
        <div className={`flex items-center gap-3 p-4 rounded-2xl border animate-fade-in ${
          status.includes("successfully") 
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
            : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
        }`}>
          <AlertCircle size={18} className="shrink-0" />
          <p className="font-medium text-xs sm:text-sm">{status}</p>
        </div>
      )}

      {/* 2. Unified Form Panel */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/30 p-6 shadow-md dark:shadow-xl space-y-5"
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <PlusCircle size={16} className="text-emerald-500 dark:text-emerald-400" />
            {editingId ? "Update System Architecture Metadata" : "Register Brand-New Microservice Project"}
          </h3>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-rose-500/20 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-all"
            >
              <X size={14} />
              Cancel Changes
            </button>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Project Title</label>
            <input
              type="text"
              placeholder="e.g. Apex Estate Portal"
              value={form.title}
              disabled={isSubmitting}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/60 px-4 py-3 outline-none text-slate-900 dark:text-slate-200 focus:border-emerald-500/40 dark:focus:bg-slate-950 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 disabled:opacity-50"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Code size={12} /> Technology Stack Keywords
            </label>
            <input
              type="text"
              placeholder="e.g. React, Tailwind CSS, ASP.NET Core, EF Core"
              value={form.techStack}
              disabled={isSubmitting}
              onChange={(e) => setForm({ ...form, techStack: e.target.value })}
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/60 px-4 py-3 outline-none text-slate-900 dark:text-slate-200 focus:border-emerald-500/40 dark:focus:bg-slate-950 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 disabled:opacity-50"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Github size={12} /> GitHub Repository URL
            </label>
            <input
              type="url"
              placeholder="https://github.com/..."
              value={form.githubUrl}
              disabled={isSubmitting}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/60 px-4 py-3 outline-none text-slate-900 dark:text-slate-200 focus:border-emerald-500/40 dark:focus:bg-slate-950 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <ExternalLink size={12} /> Live Host / Demo URL
            </label>
            <input
              type="url"
              placeholder="https://yourproject.com"
              value={form.liveUrl}
              disabled={isSubmitting}
              onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/60 px-4 py-3 outline-none text-slate-900 dark:text-slate-200 focus:border-emerald-500/40 dark:focus:bg-slate-950 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Image size={12} /> Layout Graphic / Cover URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={form.imageUrl}
              disabled={isSubmitting}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/60 px-4 py-3 outline-none text-slate-900 dark:text-slate-200 focus:border-emerald-500/40 dark:focus:bg-slate-950 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 disabled:opacity-50"
            />
          </div>

          {/* Graphical Live Cover Rendering */}
          {form.imageUrl && (
            <div className="sm:col-span-2 p-3 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/40 flex items-center gap-4">
              <div className="h-16 w-28 rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900 shrink-0">
                <img 
                  src={form.imageUrl} 
                  alt="Dynamic Live Project Cover Preview" 
                  className="h-full w-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <Eye size={12} /> Interactive Cover Live Sync Preview
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-600 truncate max-w-md mt-0.5">{form.imageUrl}</p>
              </div>
            </div>
          )}

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Short Catchy Narrative Summary</label>
            <input
              type="text"
              placeholder="e.g. Real Estate landing portal with advanced searching algorithms and smooth framer-motion transitions."
              value={form.description}
              disabled={isSubmitting}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/60 px-4 py-3 outline-none text-slate-900 dark:text-slate-200 focus:border-emerald-500/40 dark:focus:bg-slate-950 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 disabled:opacity-50"
              required
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Detailed Structural Breakdown (Long Description)</label>
            <textarea
              placeholder="Elaborate on architectural problems solved, system layout decisions, database schema components chosen, and team workflow strategies..."
              value={form.longDescription}
              disabled={isSubmitting}
              onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
              rows="4"
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/60 px-4 py-3 outline-none text-slate-900 dark:text-slate-200 focus:border-emerald-500/40 dark:focus:bg-slate-950 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 disabled:opacity-50 resize-y"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] w-full sm:w-auto ml-auto shadow-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={14} />
              Saving Project State...
            </>
          ) : (
            <>
              {editingId ? "Update Project Frame" : "Commit New Registry"}
            </>
          )}
        </button>
      </form>

      {/* 3. Output Database Archive Canvas */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 px-1">
          Configured Sandbox Microservices ({projects.length})
        </h3>

        {loading ? (
          [1, 2].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/20 p-6 space-y-3">
              <div className="h-6 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-10 w-full rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          ))
        ) : projects.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col gap-5 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/10 p-5 lg:flex-row lg:items-start hover:bg-slate-100 dark:hover:bg-slate-900/20 transition-all"
              >
                {/* Graphics Cover Column */}
                {project.imageUrl && (
                  <div className="h-28 w-full lg:w-44 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-200 dark:bg-slate-950 shrink-0 shadow-inner">
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                )}

                <div className="space-y-1.5 min-w-0 flex-1">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                      {project.title}
                    </h4>
                    <p className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">{project.techStack}</p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Operations Block */}
                <div className="flex gap-2 shrink-0 self-end lg:self-start pt-2 lg:pt-0">
                  <button
                    onClick={() => handleEdit(project)}
                    className="rounded-xl bg-blue-500/10 border border-blue-500/10 hover:border-blue-500/30 p-2.5 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-all active:scale-95"
                    title="Edit Specs"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => deleteProject(project.id)}
                    className="rounded-xl bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/30 p-2.5 text-rose-600 dark:text-rose-400 hover:text-rose-500 dark:hover:text-rose-300 transition-all active:scale-95"
                    title="Delete Specs"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/10 p-12 text-center text-slate-400 dark:text-slate-500 text-sm">
            <Sparkles className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={24} />
            No sandbox applications detected inside portfolio registry configurations.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProjects;