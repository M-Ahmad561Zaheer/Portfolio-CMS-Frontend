import { useEffect, useState } from "react";
import api from "../api/api";

const Blog = () => {
  const [posts, setPosts] = useState([]);

  const fetchBlogs = async () => {
    const res = await api.get("/Blogs");
    setPosts(res.data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <section id="blog" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500 dark:text-emerald-400">
            Blog
          </p>

          <h2 className="text-3xl font-bold text-slate-950 dark:text-white md:text-5xl">
            Latest Articles
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-emerald-400 dark:border-white/10 dark:bg-white/5"
            >
              {post.thumbnail && (
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="mb-5 h-40 w-full rounded-2xl object-cover"
                />
              )}

              <p className="mb-3 text-sm text-emerald-500 dark:text-emerald-400">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>

              <h3 className="mb-4 text-xl font-bold text-slate-950 dark:text-white">
                {post.title}
              </h3>

              <p className="mb-6 line-clamp-3 text-slate-600 dark:text-slate-400">
                {post.content}
              </p>

              <button className="font-semibold text-emerald-500 dark:text-emerald-400">
                Read More →
              </button>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-center text-slate-600 dark:text-slate-400">
            No blog posts available.
          </p>
        )}
      </div>
    </section>
  );
};

export default Blog;