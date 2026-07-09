import { useEffect, useState } from "react";
import { Edit, Trash2, X } from "lucide-react";
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

  const fetchBlogs = async () => {
    const res = await api.get("/Blogs");
    setBlogs(res.data);
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

    if (editingId) {
      await api.put(`/Blogs/${editingId}`, form);
    } else {
      await api.post("/Blogs", form);
    }

    setForm(emptyForm);
    setEditingId(null);
    fetchBlogs();
  };

  const handleEdit = (blog) => {
    setEditingId(blog.id);

    setForm({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      thumbnail: blog.thumbnail,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const deleteBlog = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    await api.delete(`/Blogs/${id}`);
    fetchBlogs();
  };

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold">Manage Blogs</h2>

      <form
        onSubmit={handleSubmit}
        className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {editingId ? "Update Blog" : "Add New Blog"}
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

        <div className="grid gap-4">
          <input
            type="text"
            placeholder="Blog Title"
            value={form.title}
            onChange={handleTitleChange}
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
            required
          />

          <input
            type="text"
            placeholder="Slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
            required
          />

          <input
            type="text"
            placeholder="Thumbnail URL"
            value={form.thumbnail}
            onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
          />

          <textarea
            placeholder="Blog Content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows="8"
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
            required
          />
        </div>

        <button className="mt-5 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-400">
          {editingId ? "Update Blog" : "Add Blog"}
        </button>
      </form>

      <div className="space-y-4">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:flex-row md:items-center"
          >
            <div>
              <h3 className="text-xl font-bold">{blog.title}</h3>
              <p className="text-sm text-emerald-400">{blog.slug}</p>
              <p className="mt-2 line-clamp-2 text-slate-400">
                {blog.content}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(blog)}
                className="rounded-lg bg-blue-500/20 p-3 text-blue-400"
              >
                <Edit size={18} />
              </button>

              <button
                onClick={() => deleteBlog(blog.id)}
                className="rounded-lg bg-red-500/20 p-3 text-red-400"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {blogs.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-400">
            No blogs found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ManageBlogs;