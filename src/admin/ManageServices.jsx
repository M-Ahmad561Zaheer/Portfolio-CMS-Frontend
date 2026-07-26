import { useEffect, useState } from "react";
import { Edit, Trash2, X, Globe, Smartphone, Database, Settings, Code, Server, Sparkles, Loader2, PlusCircle, AlertCircle, LayoutGrid, ArrowUpAz } from "lucide-react";
import api from "../api/api";

// Dynamic Icon Mapping Lookup table
const iconMap = {
  globe: Globe,
  smartphone: Smartphone,
  database: Database,
  settings: Settings,
  code: Code,
  server: Server,
};

const emptyForm = {
  title: "",
  description: "",
  iconName: "globe",
  displayOrder: 1,
};

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Secure Authorization Token Config Helper
  const getHeadersConfig = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Services", getHeadersConfig());
      // Explicit display routing prioritization order validation
      const sortedData = (res.data || []).sort((a, b) => a.displayOrder - b.displayOrder);
      setServices(sortedData);
    } catch (err) {
      console.error(err);
      setStatus("Failed to sync structural framework services stream.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
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
        await api.put(`/Services/${editingId}`, payload, getHeadersConfig());
        setStatus("Service configurations updated successfully.");
      } else {
        await api.post("/Services", payload, getHeadersConfig());
        setStatus("New technical service published successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);
      await fetchServices();
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      console.error(err);
      setStatus("Failed to execute service entry mutation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    setForm({
      title: service.title,
      description: service.description,
      iconName: service.iconName || "globe",
      displayOrder: service.displayOrder,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const deleteService = async (id) => {
    if (!window.confirm("Are you certain you want to drop this specialized engineering service?")) return;

    try {
      await api.delete(`/Services/${id}`, getHeadersConfig());
      setStatus("Selected service dropped successfully.");
      await fetchServices();
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      console.error(err);
      setStatus("Failed to clean up targeted engineering service node.");
    }
  };

  return (
    <div className="space-y-6 p-2 sm:p-4 md:p-6 text-slate-800 dark:text-slate-100 antialiased max-w-5xl mx-auto">
      
      {/* 1. Header Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-black p-6 md:p-8 shadow-sm dark:shadow-2xl">
        <div className="absolute right-0 top-0 -mr-12 -mt-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />
        
        <div className="relative z-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <LayoutGrid size={14} className="animate-pulse" /> Offerings Architecture
          </p>
          <h2 className="text-2xl font-extrabold sm:text-3xl md:text-4xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            Manage Services
          </h2>
          <p className="mt-2 max-w-xl text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            Configure target software capabilities, service pillars, responsive icon graphics, and interface display orders.
          </p>
        </div>
      </div>

      {/* Dynamic Alert Banner Statuses */}
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

      {/* 2. Adaptive Admin Interface Control Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/30 p-6 shadow-md dark:shadow-xl space-y-5"
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <PlusCircle size={16} className="text-emerald-500 dark:text-emerald-400" />
            {editingId ? "Modify Target Capability Parameters" : "Provision New Engineering Capability"}
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
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Service Title / Name</label>
            <input
              type="text"
              placeholder="e.g. Full-Stack Web Development"
              value={form.title}
              disabled={isSubmitting}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/60 px-4 py-3 outline-none text-slate-900 dark:text-slate-200 focus:border-emerald-500/40 dark:focus:bg-slate-950 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 disabled:opacity-50"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
              Icon Vector Vector Graphics Variant
            </label>
            <div className="relative flex items-center">
              <select
                value={form.iconName}
                disabled={isSubmitting}
                onChange={(e) => setForm({ ...form, iconName: e.target.value })}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/60 pl-11 pr-4 py-3 outline-none text-slate-900 dark:text-slate-200 focus:border-emerald-500/40 dark:focus:bg-slate-950 transition-all appearance-none disabled:opacity-50"
              >
                <option value="code">Code Syntax Terminal</option>
                <option value="smartphone">Mobile Apps Integration</option>
                <option value="database">Database Matrix Management</option>
                <option value="server">Cloud Infrastructure DevOps</option>
                <option value="globe">Global Network Web System</option>
                <option value="settings">System Operations Optimization</option>
              </select>
              {/* Dynamic Inside Selector Icon Sync Rendering */}
              <div className="absolute left-4 pointer-events-none text-emerald-500 dark:text-emerald-400">
                {(() => {
                  const IconComponent = iconMap[form.iconName] || Globe;
                  return <IconComponent size={16} />;
                })()}
              </div>
            </div>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <ArrowUpAz size={12} /> Sequencing Rendering Priority Order
            </label>
            <input
              type="number"
              placeholder="1"
              value={form.displayOrder}
              disabled={isSubmitting}
              onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/60 px-4 py-3 outline-none text-slate-900 dark:text-slate-200 focus:border-emerald-500/40 dark:focus:bg-slate-950 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Service Offering Description / Scope</label>
            <textarea
              placeholder="Provide clean and detailed insights into system architectures deployed, frameworks supported, or optimization performance boundaries provided..."
              value={form.description}
              disabled={isSubmitting}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="4"
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
              Saving Parameters...
            </>
          ) : (
            <>
              {editingId ? "Update System Stream Service" : "Deploy Capability Configuration"}
            </>
          )}
        </button>
      </form>

      {/* 3. Output Microservices Database Architecture Stack */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 px-1">
          Active Provisioned Services ({services.length})
        </h3>

        {loading ? (
          [1, 2].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/20 p-6 space-y-3">
              <div className="h-6 w-1/4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-12 w-full rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          ))
        ) : services.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((service) => {
              const LiveIcon = iconMap[service.iconName] || Globe;
              return (
                <div
                  key={service.id}
                  className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/10 p-5 hover:bg-slate-100 dark:hover:bg-slate-900/20 transition-all group relative overflow-hidden shadow-sm"
                >
                  <div className="space-y-3 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">
                        <LiveIcon size={20} />
                      </div>
                      <span className="text-[10px] bg-white dark:bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-200 dark:border-white/5 font-mono font-bold">
                        Sequence Priority: {service.displayOrder}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                        {service.title}
                      </h4>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  {/* Operational Controls Area */}
                  <div className="flex gap-2 shrink-0 justify-end pt-2 border-t border-slate-200/60 dark:border-white/5">
                    <button
                      onClick={() => handleEdit(service)}
                      className="rounded-xl bg-blue-500/10 border border-blue-500/10 hover:border-blue-500/30 p-2 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-all active:scale-95"
                      title="Edit Service Scope"
                    >
                      <Edit size={15} />
                    </button>

                    <button
                      onClick={() => deleteService(service.id)}
                      className="rounded-xl bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/30 p-2 text-rose-600 dark:text-rose-400 hover:text-rose-500 dark:hover:text-rose-300 transition-all active:scale-95"
                      title="Delete Service Node"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/10 p-12 text-center text-slate-400 dark:text-slate-500 text-sm">
            <Sparkles className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={24} />
            No functional service offerings detected inside core repository endpoints.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageServices;