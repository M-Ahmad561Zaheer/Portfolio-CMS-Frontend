import { useEffect, useState } from "react";
import { Quote, Star } from "lucide-react";
import api from "../api/api";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  const loadTestimonials = async () => {
    const response = await api.get("/Testimonials");
    setTestimonials(response.data);
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  return (
    <section id="testimonials" className="bg-slate-50 px-6 py-24 dark:bg-slate-900/50">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500 dark:text-emerald-400">
            Testimonials
          </p>

          <h2 className="text-3xl font-bold text-slate-950 dark:text-white md:text-5xl">
            What Clients Say
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-slate-950"
            >
              <Quote className="mb-5 text-emerald-500 dark:text-emerald-400" />

              <div className="mb-4 flex gap-1 text-yellow-400">
                {Array.from({ length: item.rating || 5 }).map((_, index) => (
                  <Star key={index} size={16} fill="currentColor" />
                ))}
              </div>

              <p className="mb-6 leading-7 text-slate-600 dark:text-slate-300">
                “{item.review}”
              </p>

              <h3 className="font-semibold text-slate-950 dark:text-white">
                {item.clientName}
              </h3>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {item.position}
                {item.company && ` at ${item.company}`}
              </p>
            </div>
          ))}
        </div>

        {testimonials.length === 0 && (
          <p className="text-center text-slate-600 dark:text-slate-400">
            No testimonials available.
          </p>
        )}
      </div>
    </section>
  );
};

export default Testimonials;