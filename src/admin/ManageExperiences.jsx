import { useEffect, useState } from "react";
import { Edit, Trash2, X } from "lucide-react";
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

  const fetchExperiences = async () => {
    const res = await api.get("/Experiences");
    setExperiences(res.data);
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      displayOrder: Number(form.displayOrder),
    };

    if (editingId) {
      await api.put(`/Experiences/${editingId}`, payload);
    } else {
      await api.post("/Experiences", payload);
    }

    setForm(emptyForm);
    setEditingId(null);
    fetchExperiences();
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
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const deleteExperience = async (id) => {
    const confirmDelete = window.confirm("Delete this experience?");
    if (!confirmDelete) return;

    await api.delete(`/Experiences/${id}`);
    fetchExperiences();
  };

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold">Manage Experiences</h2>

      <form
        onSubmit={handleSubmit}
        className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {editingId ? "Update Experience" : "Add New Experience"}
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

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Title / Role"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
            required
          />

          <input
            type="text"
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
            required
          />

          <input
            type="text"
            placeholder="Start Date e.g. 2024"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
          />

          <input
            type="text"
            placeholder="End Date e.g. Present"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
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

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            rows="5"
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400 md:col-span-2"
            required
          />
        </div>

        <button className="mt-5 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-400">
          {editingId ? "Update Experience" : "Add Experience"}
        </button>
      </form>

      <div className="space-y-4">
        {experiences.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:flex-row md:items-center"
          >
            <div>
              <p className="text-sm text-emerald-400">
                {item.startDate} - {item.endDate}
              </p>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-slate-400">{item.company}</p>
              <p className="mt-2 text-slate-300">{item.description}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(item)}
                className="rounded-lg bg-blue-500/20 p-3 text-blue-400"
              >
                <Edit size={18} />
              </button>

              <button
                onClick={() => deleteExperience(item.id)}
                className="rounded-lg bg-red-500/20 p-3 text-red-400"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {experiences.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-400">
            No experiences found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ManageExperiences;