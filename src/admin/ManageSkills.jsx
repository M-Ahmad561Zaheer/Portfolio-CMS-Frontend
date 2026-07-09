import { useEffect, useState } from "react";
import { Edit, Trash2, X } from "lucide-react";
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

  const fetchSkills = async () => {
    const res = await api.get("/Skills");
    setSkills(res.data);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      displayOrder: Number(form.displayOrder),
    };

    if (editingId) {
      await api.put(`/Skills/${editingId}`, payload);
    } else {
      await api.post("/Skills", payload);
    }

    setForm(emptyForm);
    setEditingId(null);
    fetchSkills();
  };

  const handleEdit = (skill) => {
    setEditingId(skill.id);
    setForm({
      category: skill.category,
      name: skill.name,
      displayOrder: skill.displayOrder,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const deleteSkill = async (id) => {
    if (!window.confirm("Delete this skill?")) return;

    await api.delete(`/Skills/${id}`);
    fetchSkills();
  };

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold">Manage Skills</h2>

      <form
        onSubmit={handleSubmit}
        className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {editingId ? "Update Skill" : "Add New Skill"}
          </h3>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="flex items-center gap-2 rounded-lg bg-red-500/20 px-4 py-2 text-red-400"
            >
              <X size={18} />
              Cancel
            </button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <input
            type="text"
            placeholder="Category e.g. Frontend"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
            required
          />

          <input
            type="text"
            placeholder="Skill Name e.g. React"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
            required
          />

          <input
            type="number"
            placeholder="Display Order"
            value={form.displayOrder}
            onChange={(e) =>
              setForm({ ...form, displayOrder: e.target.value })
            }
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
          />
        </div>

        <button className="mt-5 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-400">
          {editingId ? "Update Skill" : "Add Skill"}
        </button>
      </form>

      <div className="space-y-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:flex-row md:items-center"
          >
            <div>
              <h3 className="text-xl font-bold">{skill.name}</h3>
              <p className="text-sm text-emerald-400">{skill.category}</p>
              <p className="text-sm text-slate-400">
                Order: {skill.displayOrder}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(skill)}
                className="rounded-lg bg-blue-500/20 p-3 text-blue-400"
              >
                <Edit size={18} />
              </button>

              <button
                onClick={() => deleteSkill(skill.id)}
                className="rounded-lg bg-red-500/20 p-3 text-red-400"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {skills.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-400">
            No skills found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ManageSkills;