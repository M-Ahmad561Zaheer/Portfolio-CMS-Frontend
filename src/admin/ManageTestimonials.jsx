import { useEffect, useState } from "react";
import { Edit, Trash2, X, Star, Users, Image, Link, Sparkles, Loader2, PlusCircle, AlertCircle, Eye, Quote } from "lucide-react";
import api from "../api/api";

const emptyForm = {
  clientName: "",
  company: "",
  position: "",
  review: "",
  imageUrl: "",
  rating: 5,
};

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Secure Authentication Headers Config
  const getHeadersConfig = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Testimonials", getHeadersConfig());
      setTestimonials(res.data || []);
    } catch (err) {
      console.error(err);
      setStatus("Failed to load validation reviews repository.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus("");

    const payload = {
      ...form,
      rating: Number(form.rating) || 5,
    };

    try {
      if (editingId) {
        await api.put(`/Testimonials/${editingId}`, payload, getHeadersConfig());
        setStatus("Testimonial review node updated successfully.");
      } else {
        await api.post("/Testimonials", payload, getHeadersConfig());
        setStatus("New recommendation successfully committed.");
      }

      setForm(emptyForm);
      setEditingId(null);
      await fetchTestimonials();
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      console.error(err);
      setStatus("Failed to write testimonial to server node.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (testimonial) => {
    setEditingId(testimonial.id);
    setForm({
      clientName: testimonial.clientName,
      company: testimonial.company || "",
      position: testimonial.position || "",
      review: testimonial.review,
      imageUrl: testimonial.imageUrl || "",
      rating: testimonial.rating || 5,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const deleteTestimonial = async (id) => {
    if (!window.confirm("Are you sure you want to drop this client's recommendation permanently?")) return;

    try {
      await api.delete(`/Testimonials/${id}`, getHeadersConfig());
      setStatus("Testimonial dropped successfully.");
      await fetchTestimonials();
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      console.error(err);
      setStatus("Failed to delete designated recommendation data.");
    }
  };

  return (
    <div className="space-y-6 p-2 sm:p-4 md:p-6 text-slate-800 dark:text-slate-100 antialiased max-w-5xl mx-auto">
      
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-black p-6 md:p-8 shadow-sm dark:shadow-2xl">
        <div className="absolute right-0 top-0 -mr-12 -mt-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />
        
        <div className="relative z-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <Users size={14} className="animate-pulse" /> Client Validation Repository
          </p>
          <h2 className="text-2xl font-extrabold sm:text-3xl md:text-4xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            Manage Testimonials
          </h2>
          <p className="mt-2 max-w-xl text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            Control showcase professional recommendations, client profiles, reviews rating coefficients, and agency credentials.
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

      {/* 2. Admin Form Panel */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/30 p-6 shadow-md dark:shadow-xl space-y-5"
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <PlusCircle size={16} className="text-emerald-500 dark:text-emerald-400" />
            {editingId ? "Update Testimonial Metadata" : "Register Brand-New Recommendation Node"}
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
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Client Name</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={form.clientName}
              disabled={isSubmitting}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/60 px-4 py-3 outline-none text-slate-900 dark:text-slate-200 focus:border-emerald-500/40 dark:focus:bg-slate-950 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 disabled:opacity-50"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Company / Organization</label>
            <input
              type="text"
              placeholder="e.g. Tech Solutions Inc."
              value={form.company}
              disabled={isSubmitting}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/60 px-4 py-3 outline-none text-slate-900 dark:text-slate-200 focus:border-emerald-500/40 dark:focus:bg-slate-950 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Position / Work Role</label>
            <input
              type="text"
              placeholder="e.g. Lead Technical Architect"
              value={form.position}
              disabled={isSubmitting}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/60 px-4 py-3 outline-none text-slate-900 dark:text-slate-200 focus:border-emerald-500/40 dark:focus:bg-slate-950 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
              Rating Stars Assessment
            </label>
            <select
              value={form.rating}
              disabled={isSubmitting}
              onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/60 px-4 py-3 outline-none text-slate-900 dark:text-slate-200 focus:border-emerald-500/40 dark:focus:bg-slate-950 transition-all disabled:opacity-50 appearance-none"
            >
              <option value="5">⭐⭐⭐⭐⭐ Excellent (5 Stars)</option>
              <option value="4">⭐⭐⭐⭐ Great (4 Stars)</option>
              <option value="3">⭐⭐⭐ Standard (3 Stars)</option>
              <option value="2">⭐⭐ Fair (2 Stars)</option>
              <option value="1">⭐ Bad (1 Star)</option>
            </select>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Link size={12} /> Avatar URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={form.imageUrl}
              disabled={isSubmitting}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/60 px-4 py-3 outline-none text-slate-900 dark:text-slate-200 focus:border-emerald-500/40 dark:focus:bg-slate-950 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 disabled:opacity-50"
            />
          </div>

          {/* Live Portrait Preview Rendering */}
          {form.imageUrl && (
            <div className="sm:col-span-2 p-3 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/40 flex items-center gap-4">
              <div className="h-14 w-14 rounded-full overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900 shrink-0">
                <img 
                  src={form.imageUrl} 
                  alt="Avatar Preview" 
                  className="h-full w-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <Eye size={12} /> Avatar Live Sync Preview
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-600 truncate max-w-md mt-0.5">{form.imageUrl}</p>
              </div>
            </div>
          )}

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Client Endorsement Content (Review)</label>
            <textarea
              placeholder="Document the exact validation description payload, platform impact results, or project workflow satisfaction statements..."
              value={form.review}
              disabled={isSubmitting}
              onChange={(e) => setForm({ ...form, review: e.target.value })}
              rows="5"
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/60 px-4 py-3 outline-none text-slate-900 dark:text-slate-200 focus:border-emerald-500/40 dark:focus:bg-slate-950 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 disabled:opacity-50 resize-y"
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
              Saving Testimonial...
            </>
          ) : (
            <>
              {editingId ? "Update Review Details" : "Deploy Validation Payload"}
            </>
          )}
        </button>
      </form>

      {/* 3. Output Database Card Stack */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 px-1">
          Registered Client Endorsements ({testimonials.length})
        </h3>

        {loading ? (
          [1, 2].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/20 p-6 space-y-4">
              <div className="flex gap-4 items-center">
                <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-1/4 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
              <div className="h-12 w-full rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          ))
        ) : testimonials.length > 0 ? (
          <div className="space-y-4">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/10 p-5 md:flex-row md:items-start hover:bg-slate-100 dark:hover:bg-slate-900/20 transition-all relative overflow-hidden"
              >
                <div className="flex gap-4 min-w-0 flex-1">
                  {/* Portrait Avatar Container */}
                  <div className="shrink-0">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.clientName}
                        className="h-12 w-12 rounded-full object-cover border border-slate-200 dark:border-white/10"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-md font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">
                        {item.clientName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div>
                      <h4 className="text-md font-bold text-slate-900 dark:text-slate-100 truncate">
                        {item.clientName}
                      </h4>
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 truncate">
                        {item.position} {item.company && `at ${item.company}`}
                      </p>
                    </div>

                    {/* Star Indicators */}
                    <div className="flex gap-0.5 text-amber-500">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          size={12}
                          fill={index < item.rating ? "currentColor" : "none"}
                          className={index < item.rating ? "text-amber-500" : "text-slate-300 dark:text-slate-700"}
                        />
                      ))}
                    </div>

                    <div className="relative">
                      <Quote className="absolute -left-1 -top-1 h-8 w-8 text-slate-200/50 dark:text-slate-800/30 -z-10" />
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed pl-4 font-sans">
                        {item.review}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Operations Control Modules */}
                <div className="flex gap-2 shrink-0 self-end md:self-start pt-2 md:pt-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="rounded-xl bg-blue-500/10 border border-blue-500/10 hover:border-blue-500/30 p-2.5 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-all active:scale-95"
                    title="Edit Review Specs"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => deleteTestimonial(item.id)}
                    className="rounded-xl bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/30 p-2.5 text-rose-600 dark:text-rose-400 hover:text-rose-500 dark:hover:text-rose-300 transition-all active:scale-95"
                    title="Delete Review Node"
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
            No active endorsements detected inside production databases schema.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTestimonials;