import { useEffect, useState } from "react";
import { Edit, Trash2, X, Star } from "lucide-react";
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

  const fetchTestimonials = async () => {
    const res = await api.get("/Testimonials");
    setTestimonials(res.data);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      rating: Number(form.rating),
    };

    if (editingId) {
      await api.put(`/Testimonials/${editingId}`, payload);
    } else {
      await api.post("/Testimonials", payload);
    }

    setForm(emptyForm);
    setEditingId(null);
    fetchTestimonials();
  };

  const handleEdit = (testimonial) => {
    setEditingId(testimonial.id);

    setForm({
      clientName: testimonial.clientName,
      company: testimonial.company,
      position: testimonial.position,
      review: testimonial.review,
      imageUrl: testimonial.imageUrl,
      rating: testimonial.rating,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const deleteTestimonial = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this testimonial?"
    );

    if (!confirmDelete) return;

    await api.delete(`/Testimonials/${id}`);
    fetchTestimonials();
  };

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold">Manage Testimonials</h2>

      <form
        onSubmit={handleSubmit}
        className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {editingId ? "Update Testimonial" : "Add New Testimonial"}
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
            placeholder="Client Name"
            value={form.clientName}
            onChange={(e) =>
              setForm({ ...form, clientName: e.target.value })
            }
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
            required
          />

          <input
            type="text"
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
          />

          <input
            type="text"
            placeholder="Position / Role"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
          />

          <input
            type="text"
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
          />

          <select
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: e.target.value })}
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
          >
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          <textarea
            placeholder="Client Review"
            value={form.review}
            onChange={(e) => setForm({ ...form, review: e.target.value })}
            rows="5"
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400 md:col-span-2"
            required
          />
        </div>

        <button className="mt-5 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-400">
          {editingId ? "Update Testimonial" : "Add Testimonial"}
        </button>
      </form>

      <div className="space-y-4">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:flex-row md:items-center"
          >
            <div className="flex gap-4">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.clientName}
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-lg font-bold text-emerald-400">
                  {item.clientName?.charAt(0)}
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold">{item.clientName}</h3>
                <p className="text-sm text-emerald-400">
                  {item.position} {item.company && `at ${item.company}`}
                </p>

                <div className="my-2 flex gap-1 text-yellow-400">
                  {Array.from({ length: item.rating }).map((_, index) => (
                    <Star key={index} size={16} fill="currentColor" />
                  ))}
                </div>

                <p className="text-slate-400">{item.review}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(item)}
                className="rounded-lg bg-blue-500/20 p-3 text-blue-400"
              >
                <Edit size={18} />
              </button>

              <button
                onClick={() => deleteTestimonial(item.id)}
                className="rounded-lg bg-red-500/20 p-3 text-red-400"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {testimonials.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-400">
            No testimonials found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ManageTestimonials;