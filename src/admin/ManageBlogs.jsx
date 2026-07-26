import { useEffect, useState } from "react";
import { Edit, Trash2, X, FileText, Image, Link, Sparkles, Loader2, PlusCircle, AlertCircle, Eye } from "lucide-react";
import api from "../api/api";

const emptyForm = {
  title: "",
  slug: "",
  content: "",
  thumbnail: "",
};

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Token integration helper function
  const getHeadersConfig = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Blogs", getHeadersConfig());
      setBlogs(res.data || []);
    } catch (err) {
      console.error(err);
      setStatus("Failed to load articles repository stream.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm({
      ...form,
      title,
      slug: generateSlug(title),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus("");

    try {
      if (editingId) {
        await api.put(`/Blogs/${editingId}`, form, getHeadersConfig());
        setStatus("Blog post updated successfully.");
      } else {
        await api.post("/Blogs", form, getHeadersConfig());
        setStatus("New blog post published successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);
      await fetchBlogs();
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      console.error(err);
      setStatus("Failed to commit post transactions.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog.id);
    setForm({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      thumbnail: blog.thumbnail,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Are you absolutely sure you want to drop this blog post?")) return;

    try {
      await api.delete(`/Blogs/${id}`, getHeadersConfig());
      setStatus("Blog post permanently deleted.");
      await fetchBlogs();
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      console.error(err);
      setStatus("Failed to remove the specified blog node.");
    }
  };

  return (
    <div className="space-y-6 p-2 sm:p-4 md:p-6 text-slate-800 dark:text-slate-100 antialiased max-w-5xl mx-auto">
      
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-black p-6 md:p-8 shadow-sm dark:shadow-2xl">
        <div className="absolute right-0 top-0 -mr-12 -mt-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />
        
        <div className="relative z-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <FileText size={14} className="animate-pulse" /> Content Strategy Management
          </p>
          <h2 className="text-2xl font-extrabold sm:text-3xl md:text-4xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            Manage Blogs
          </h2>
          <p className="mt-2 max-w-xl text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            Create, edit, or clean portfolio documentation narratives, articles, and architectural change logs.
          </p>
        </div>
      </div>

      {/* Dynamic Status Notifications */}
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

      {/* 2. Adaptive Admin Input Panel */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/30 p-6 shadow-md dark:shadow-xl space-y-5"
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <PlusCircle size={16} className="text-emerald-500 dark:text-emerald-400" />
            {editingId ? "Modify Targeted Article" : "Write New Documentation Node"}
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
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Blog Title</label>
            <input
              type="text"
              placeholder="e.g., Deploying High Availability System Architecture"
              value={form.title}
              disabled={isSubmitting}
              onChange={handleTitleChange}
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/60 px-4 py-3 outline-none text-slate-900 dark:text-slate-200 focus:border-emerald-500/40 dark:focus:bg-slate-950 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 disabled:opacity-50"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Slug (Auto-Generated)</label>
            <input
              type="text"
              placeholder="deploying-high-availability-system-architecture"
              value={form.slug}
              disabled={isSubmitting}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/5 bg-slate-200/50 dark:bg-slate-950/60 px-4 py-3 outline-none text-slate-600 dark:text-slate-400 focus:border-emerald-500/40 dark:focus:bg-slate-950 transition-all font-mono disabled:opacity-50"
              required
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Link size={12} /> Thumbnail Image URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/... or cloud storage endpoint link"
              value={form.thumbnail}
              disabled={isSubmitting}
              onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/60 px-4 py-3 outline-none text-slate-900 dark:text-slate-200 focus:border-emerald-500/40 dark:focus:bg-slate-950 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 disabled:opacity-50"
            />
          </div>

          {/* Live Thumbnail Preview Contextual Rendering */}
          {form.thumbnail && (
            <div className="sm:col-span-2 p-3 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/40 flex items-center gap-4">
              <div className="h-16 w-28 rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900 shrink-0">
                <img 
                  src={form.thumbnail} 
                  alt="Live system container thumbnail tracking" 
                  className="h-full w-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <Eye size={12} /> Thumbnail Live Sync Preview
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-600 truncate max-w-md mt-0.5">{form.thumbnail}</p>
              </div>
            </div>
          )}

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Markdown Content Payload</label>
            <textarea
              placeholder="Write raw text descriptions or functional payload markdown formatting strings..."
              value={form.content}
              disabled={isSubmitting}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows="8"
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/60 px-4 py-3 outline-none text-slate-900 dark:text-slate-200 focus:border-emerald-500/40 dark:focus:bg-slate-950 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 disabled:opacity-50 resize-y font-sans"
              required
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
              Saving Changes...
            </>
          ) : (
            <>
              {editingId ? "Update Blog State" : "Publish Stream Entity"}
            </>
          )}
        </button>
      </form>

      {/* 3. Output Database Card Stack */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 px-1">
          Active Production Logs ({blogs.length})
        </h3>

        {loading ? (
          [1, 2].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/20 p-6 space-y-3">
              <div className="h-6 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-10 w-full rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          ))
        ) : blogs.length > 0 ? (
          <div className="space-y-4">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="flex flex-col gap-5 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/10 p-5 md:flex-row md:items-start hover:bg-slate-100 dark:hover:bg-slate-900/20 transition-all"
              >
                {/* Visual Image Grid Section */}
                {blog.thumbnail && (
                  <div className="h-28 w-full md:w-44 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-200 dark:bg-slate-950 shrink-0 shadow-inner">
                    <img 
                      src={blog.thumbnail} 
                      alt={blog.title} 
                      className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                )}

                <div className="space-y-1.5 min-w-0 flex-1">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                      {blog.title}
                    </h4>
                    <p className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">/{blog.slug}</p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {blog.content}
                  </p>
                </div>

                {/* Operations Controllers Blocks */}
                <div className="flex gap-2 shrink-0 self-end md:self-start pt-2 md:pt-0">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="rounded-xl bg-blue-500/10 border border-blue-500/10 hover:border-blue-500/30 p-2.5 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-all active:scale-95"
                    title="Edit Post"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => deleteBlog(blog.id)}
                    className="rounded-xl bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/30 p-2.5 text-rose-600 dark:text-rose-400 hover:text-rose-500 dark:hover:text-rose-300 transition-all active:scale-95"
                    title="Delete Post"
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
            No articles found inside production databases storage nodes.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBlogs;