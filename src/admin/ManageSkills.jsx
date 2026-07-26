import { useEffect, useState } from "react";
import { Edit, Trash2, X, Plus, Sparkles, Award, Eye, Settings, RefreshCw } from "lucide-react";
import api from "../api/api";

const emptyForm = {
  category: "",
  name: "",
  displayOrder: 1,
};

const ManageSkills = () => {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Helper helper to get secure token header config
  const getHeadersConfig = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const fetchSkills = async (isSync = false) => {
    try {
      if (isSync) setSyncing(true);
      else setLoading(true);

      const res = await api.get("/Skills", getHeadersConfig());
      // Sort dynamically by displayOrder and then category
      const sortedData = (res.data ?? []).sort((a, b) => a.displayOrder - b.displayOrder);
      setSkills(sortedData);
    } catch (err) {
      console.error("Error fetching skills from server", err);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        displayOrder: Number(form.displayOrder),
      };

      const config = getHeadersConfig();

      if (editingId) {
        await api.put(`/Skills/${editingId}`, payload, config);
      } else {
        await api.post("/Skills", payload, config);
      }

      setForm(emptyForm);
      setEditingId(null);
      fetchSkills();
    } catch (err) {
      console.error("Error saving skill", err);
    }
  };

  const handleEdit = (skill) => {
    setEditingId(skill.id);
    setForm({
      category: skill.category,
      name: skill.name,
      displayOrder: skill.displayOrder,
    });
    // Smooth scroll back to form on mobile devices
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const deleteSkill = async (id) => {
    if (!window.confirm("Are you sure you want to remove this skill node?")) return;
    try {
      await api.delete(`/Skills/${id}`, getHeadersConfig());
      fetchSkills();
    } catch (err) {
      console.error("Error deleting skill from server", err);
    }
  };

  // Group skills by category for a much cleaner UX representation
  const groupedSkills = skills.reduce((groups, skill) => {
    const category = skill.category || "General";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(skill);
    return groups;
  }, {});

  return (
    <div className="space-y-8 px-2 sm:px-4 md:px-6 pb-12 text-slate-100 antialiased max-w-7xl mx-auto">
      
      {/* 1. Header Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-6 md:p-8 shadow-2xl">
        <div className="absolute right-0 top-0 -mr-12 -mt-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-emerald-400 flex items-center gap-2">
              <Award size={14} className="animate-pulse" /> Tech Stack Controls
            </p>
            <h2 className="text-2xl font-extrabold sm:text-3xl md:text-4xl bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Manage Core Skills
            </h2>
            <p className="mt-2 max-w-xl text-slate-400 text-xs sm:text-sm">
              Add, update, and sort technologies to show off your active technical portfolio strengths dynamically.
            </p>
          </div>

          <button
            onClick={() => fetchSkills(true)}
            disabled={syncing}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 active:scale-95 transition-all w-full sm:w-auto disabled:opacity-50"
          >
            <RefreshCw size={14} className={`${syncing ? "animate-spin text-emerald-400" : "text-slate-400"}`} />
            {syncing ? "Syncing..." : "Sync Skills"}
          </button>
        </div>
      </div>

      {/* 2. Form & Visual Preview Split Grid */}
      <div className="grid gap-8 lg:grid-cols-5 items-start">
        
        {/* Form panel */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className={`rounded-2xl border transition-all duration-300 p-6 backdrop-blur-md bg-slate-900/40 ${
              editingId ? "border-amber-500/30 shadow-amber-950/10" : "border-white/5 shadow-xl"
            }`}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-md font-bold tracking-wide uppercase text-slate-300 flex items-center gap-2">
                {editingId ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                    Modify Skill Node
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Add Skill Node
                  </>
                )}
              </h3>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1.5 rounded-lg border border-rose-500/15 transition-all"
                >
                  <X size={12} />
                  Cancel
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Category Type
                </label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Development"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full text-xs sm:text-sm rounded-xl border border-white/5 bg-slate-950/60 px-4 py-3 outline-none text-slate-200 focus:border-emerald-500/40 focus:bg-slate-950 transition-all placeholder:text-slate-600"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Skill / Technology Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. React.js, ASP.NET Core"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full text-xs sm:text-sm rounded-xl border border-white/5 bg-slate-950/60 px-4 py-3 outline-none text-slate-200 focus:border-emerald-500/40 focus:bg-slate-950 transition-all placeholder:text-slate-600"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Display Alignment Order
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1 (lowest displays first)"
                  value={form.displayOrder}
                  onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
                  className="w-full text-xs sm:text-sm rounded-xl border border-white/5 bg-slate-950/60 px-4 py-3 outline-none text-slate-200 focus:border-emerald-500/40 focus:bg-slate-950 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                editingId
                  ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/10"
                  : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/10"
              }`}
            >
              <Plus size={14} className="stroke-[3]" />
              {editingId ? "Update Existing Node" : "Register Tech Node"}
            </button>
          </form>
        </div>

        {/* Live list panel grouped by category */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Settings size={14} className="text-emerald-400" /> Active Infrastructure
            </h3>
            <span className="text-[10px] font-bold bg-white/5 border border-white/10 px-2 py-1 rounded-full text-slate-400">
              {skills.length} Registered Technologies
            </span>
          </div>

          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
            {loading ? (
              [1, 2].map((i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-white/5 bg-slate-950/40 p-5 space-y-3">
                  <div className="h-4 w-1/4 rounded bg-slate-800" />
                  <div className="h-10 w-full rounded bg-slate-800 animate-pulse" />
                </div>
              ))
            ) : Object.keys(groupedSkills).length > 0 ? (
              Object.keys(groupedSkills).map((category) => (
                <div key={category} className="space-y-3">
                  {/* Category Header Label */}
                  <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 bg-emerald-500/5 px-3 py-1.5 rounded-lg border border-emerald-500/10 self-start inline-block">
                    {category}
                  </h4>

                  {/* Skills Grid under this category */}
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    {groupedSkills[category].map((skill) => (
                      <div
                        key={skill.id}
                        className="group flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-slate-950/40 p-4 transition-all duration-300 hover:border-emerald-500/15 hover:bg-slate-950/90"
                      >
                        <div className="min-w-0">
                          <h4 className="font-semibold text-slate-200 text-sm truncate flex items-center gap-1.5">
                            <Sparkles size={12} className="text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0" />
                            {skill.name}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-medium">
                            Display Index: {skill.displayOrder}
                          </span>
                        </div>

                        {/* Interactive Action Hub */}
                        <div className="flex gap-1.5 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleEdit(skill)}
                            className="rounded-lg bg-blue-500/10 hover:bg-blue-500/20 p-2 text-blue-400 border border-blue-500/10 transition-colors"
                          >
                            <Edit size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteSkill(skill.id)}
                            className="rounded-lg bg-rose-500/10 hover:bg-rose-500/20 p-2 text-rose-400 border border-rose-500/10 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/20 p-10 text-center text-slate-500 text-xs">
                No active skills parsed on live server database. Try registering one above.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManageSkills;