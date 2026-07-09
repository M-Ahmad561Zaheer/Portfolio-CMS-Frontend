import { useEffect, useState } from "react";
import { Trash2, Edit, X } from "lucide-react";
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

  const fetchProjects = async () => {
    const res = await api.get("/Projects");
    setProjects(res.data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await api.put(`/Projects/${editingId}`, form);
    } else {
      await api.post("/Projects", form);
    }

    setForm(emptyForm);
    setEditingId(null);
    fetchProjects();
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription,
      imageUrl: project.imageUrl,
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
      techStack: project.techStack,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const deleteProject = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    await api.delete(`/Projects/${id}`);
    fetchProjects();
  };

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold">Manage Projects</h2>

      <form
        onSubmit={handleSubmit}
        className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {editingId ? "Update Project" : "Add New Project"}
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
            placeholder="Project Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
            required
          />

          <input
            type="text"
            placeholder="Tech Stack"
            value={form.techStack}
            onChange={(e) => setForm({ ...form, techStack: e.target.value })}
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
            required
          />

          <input
            type="text"
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
          />

          <input
            type="text"
            placeholder="GitHub URL"
            value={form.githubUrl}
            onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
          />

          <input
            type="text"
            placeholder="Live URL"
            value={form.liveUrl}
            onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
          />

          <input
            type="text"
            placeholder="Short Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
            required
          />

          <textarea
            placeholder="Long Description"
            value={form.longDescription}
            onChange={(e) =>
              setForm({ ...form, longDescription: e.target.value })
            }
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400 md:col-span-2"
            rows="4"
          />
        </div>

        <button className="mt-5 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-400">
          {editingId ? "Update Project" : "Add Project"}
        </button>
      </form>

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:flex-row md:items-center"
          >
            <div>
              <h3 className="text-xl font-bold">{project.title}</h3>
              <p className="text-sm text-emerald-400">{project.techStack}</p>
              <p className="mt-2 text-slate-400">{project.description}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(project)}
                className="rounded-lg bg-blue-500/20 p-3 text-blue-400"
              >
                <Edit size={18} />
              </button>

              <button
                onClick={() => deleteProject(project.id)}
                className="rounded-lg bg-red-500/20 p-3 text-red-400"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-400">
            No projects found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ManageProjects;