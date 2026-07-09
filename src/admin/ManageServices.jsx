import { useEffect, useState } from "react";
import { Edit, Trash2, X } from "lucide-react";
import api from "../api/api";

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

  const fetchServices = async () => {
    const res = await api.get("/Services");
    setServices(res.data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      displayOrder: Number(form.displayOrder),
    };

    if (editingId) {
      await api.put(`/Services/${editingId}`, payload);
    } else {
      await api.post("/Services", payload);
    }

    setForm(emptyForm);
    setEditingId(null);
    fetchServices();
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    setForm({
      title: service.title,
      description: service.description,
      iconName: service.iconName,
      displayOrder: service.displayOrder,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const deleteService = async (id) => {
    if (!window.confirm("Delete this service?")) return;

    await api.delete(`/Services/${id}`);
    fetchServices();
  };

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold">Manage Services</h2>

      <form
        onSubmit={handleSubmit}
        className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {editingId ? "Update Service" : "Add New Service"}
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
            placeholder="Service Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
            required
          />

          <select
            value={form.iconName}
            onChange={(e) => setForm({ ...form, iconName: e.target.value })}
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
          >
            <option value="globe">Globe</option>
            <option value="smartphone">Smartphone</option>
            <option value="database">Database</option>
            <option value="settings">Settings</option>
            <option value="code">Code</option>
            <option value="server">Server</option>
          </select>

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
            placeholder="Service Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            rows="4"
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400 md:col-span-2"
            required
          />
        </div>

        <button className="mt-5 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-400">
          {editingId ? "Update Service" : "Add Service"}
        </button>
      </form>

      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:flex-row md:items-center"
          >
            <div>
              <h3 className="text-xl font-bold">{service.title}</h3>
              <p className="text-sm text-emerald-400">
                Icon: {service.iconName}
              </p>
              <p className="mt-2 text-slate-400">{service.description}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(service)}
                className="rounded-lg bg-blue-500/20 p-3 text-blue-400"
              >
                <Edit size={18} />
              </button>

              <button
                onClick={() => deleteService(service.id)}
                className="rounded-lg bg-red-500/20 p-3 text-red-400"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-400">
            No services found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ManageServices;