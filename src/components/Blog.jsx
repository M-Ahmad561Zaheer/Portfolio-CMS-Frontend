import { useEffect, useState } from "react";
import api from "../api/api";

const Blog = () => {
  const [posts, setPosts] = useState([]);

  const fetchBlogs = async () => {
    try {
      const res = await api.get("/Blogs");
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    // Section background: White in light mode, Slate-950 in dark mode
    <section id="blog" className="px-6 py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.5em] text-emerald-600 dark:text-emerald-400">
            Blog
          </p>

          {/* Heading: Dark text in light mode, White text in dark mode */}
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
            Latest Articles
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              // Card background: White with border in light mode, Dark (#11131F) in dark mode
              className="rounded-[2rem] border border-slate-200 bg-white p-9 transition-all duration-300 hover:border-emerald-500/50 hover:-translate-y-1 hover:shadow-xl dark:border-white/5 dark:bg-[#11131F] dark:hover:border-emerald-400/50 dark:hover:shadow-2xl dark:hover:shadow-emerald-500/5"
            >
              {post.thumbnail && (
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="mb-6 h-44 w-full rounded-3xl object-cover"
                />
              )}

              <p className="mb-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>

              <h3 className="mb-5 text-2xl font-bold leading-tight text-slate-900 dark:text-white">
                {post.title}
              </h3>

              <p className="mb-8 line-clamp-3 text-slate-600 dark:text-slate-400 leading-relaxed">
                {post.content}
              </p>

              <button className="group flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400 transition hover:text-emerald-500 dark:hover:text-emerald-300">
                Read More
                <span className="transition-transform group-hover:translate-x-1">→</span>
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