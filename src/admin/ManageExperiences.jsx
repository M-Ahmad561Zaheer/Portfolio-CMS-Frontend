import { useEffect, useState } from "react";
import { Edit, Trash2, X, Briefcase, Calendar, Sparkles, Loader2, PlusCircle, AlertCircle, ArrowUpAz } from "lucide-react";
import api from "../api/api";

const emptyForm = {
  title: "",
  company: "",
  startDate: "",
  endDate: "",
  description: "",
  displayOrder: 1,
};

const ManageExperiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getHeadersConfig = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Experiences", getHeadersConfig());
      const sortedData = (res.data || []).sort((a, b) => a.displayOrder - b.displayOrder);
      setExperiences(sortedData);
    } catch (err) {
      console.error(err);
      setStatus("Failed to load professional experiences.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus("");

    const payload = {
      ...form,
      displayOrder: Number(form.displayOrder) || 1,
    };

    try {
      if (editingId) {
        await api.put(`/Experiences/${editingId}`, payload, getHeadersConfig());
        setStatus("Experience record updated successfully.");
      } else {
        await api.post("/Experiences", payload, getHeadersConfig());
        setStatus("New experience record created successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);
      await fetchExperiences();
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      console.error(err);
      setStatus("Failed to save experience transaction.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      company: item.company,
      startDate: item.startDate,
      endDate: item.endDate,
      description: item.description,
      displayOrder: item.displayOrder,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const deleteExperience = async (id) => {
    if (!window.confirm("Are you entirely sure you want to drop this experience entry?")) return;

    try {
      await api.delete(`/Experiences/${id}`, getHeadersConfig());
      setStatus("Experience history item dropped successfully.");
      await fetchExperiences();
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      console.error(err);
      setStatus("Failed to drop the specified experience entity.");
    }
  };

  return (
    <div className="space-y-6 p-2 sm:p-4 md:p-6 text-slate-900 dark:text-slate-100 antialiased max-w-5xl mx-auto">
      
      {/* 1. Header Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-black p-6 md:p-8 shadow-2xl">
        <div className="absolute right-0 top-0 -mr-12 -mt-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />
        
        <div className="relative z-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <Briefcase size={14} className="animate-pulse" /> Career Timeline Management
          </p>
          <h2 className="text-2xl font-extrabold sm:text-3xl md:text-4xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            Manage Experiences
          </h2>
          <p className="mt-2 max-w-xl text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
            Add, update, or remove professional work history, internships, and engineering positions.
          </p>
        </div>
      </div>

      {/* Dynamic Status Notification */}
      {status && (
        <div className={`flex items-center gap-3 p-4 rounded-2xl border animate-fade-in ${
          status.includes("successfully") 
            ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400" 
            : "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400"
        }`}>
          <AlertCircle size={18} className="shrink-0" />
          <p className="font-medium text-xs sm:text-sm">{status}</p>
        </div>
      )}

      {/* 2. Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/30 p-6 backdrop-blur-md shadow-xl space-y-5"
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <PlusCircle size={16} className="text-emerald-600 dark:text-emerald-400" />
            {editingId ? "Modify Experience Target" : "Register New Career Entry"}
          </h3>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-rose-500/20 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 hover:text-rose-400 transition-all"
            >
              <X size={14} /> Cancel
            </button>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {["title", "company", "startDate", "endDate"].map((field) => (
            <div key={field} className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {field.replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type="text"
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-white/5 bg-slate-50 dark:bg-slate-950/60 px-4 py-3 outline-none text-slate-900 dark:text-slate-200 focus:border-emerald-500/40 focus:bg-white dark:focus:bg-slate-950 transition-all placeholder:text-slate-400"
                required={field !== "endDate"}
              />
            </div>
          ))}

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="4"
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-white/5 bg-slate-50 dark:bg-slate-950/60 px-4 py-3 outline-none text-slate-900 dark:text-slate-200 focus:border-emerald-500/40 focus:bg-white dark:focus:bg-slate-950 transition-all placeholder:text-slate-400 resize-y"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all w-full sm:w-auto ml-auto"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : (editingId ? "Update Entry" : "Commit New")}
        </button>
      </form>

      {/* 3. History List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 px-1">Registered ({experiences.length})</h3>
        {loading ? (
          <div className="text-center p-10 text-slate-400">Loading...</div>
        ) : experiences.map((item) => (
          <div key={item.id} className="flex flex-col md:flex-row justify-between gap-5 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/10 p-6 hover:shadow-lg transition-all">
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">{item.title}</h4>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{item.company}</p>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">{item.description}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(item)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-xl"><Edit size={16} /></button>
              <button onClick={() => deleteExperience(item.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageExperiences;