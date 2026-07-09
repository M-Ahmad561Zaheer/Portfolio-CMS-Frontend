import { useEffect, useState } from "react";
import { BriefcaseBusiness } from "lucide-react";
import api from "../api/api";

const Timeline = () => {
  const [experiences, setExperiences] = useState([]);

  const fetchExperiences = async () => {
    const res = await api.get("/Experiences");
    setExperiences(res.data);
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  return (
    <section
      id="experience"
      className="bg-slate-50 px-6 py-24 dark:bg-slate-950"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500 dark:text-emerald-400">
            Experience
          </p>

          <h2 className="text-3xl font-bold text-slate-950 dark:text-white md:text-5xl">
            Professional Journey
          </h2>
        </div>

        <div className="relative border-l-2 border-emerald-500/30 pl-8">
          {experiences.map((item) => (
            <div
              key={item.id}
              className="relative mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg dark:border-white/10 dark:bg-slate-900"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[46px] top-8 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                <BriefcaseBusiness size={18} />
              </div>

              <span className="font-semibold text-emerald-500 dark:text-emerald-400">
                {item.startDate} - {item.endDate}
              </span>

              <h3 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
                {item.title}
              </h3>

              <p className="mb-4 text-slate-500 dark:text-slate-400">
                {item.company}
              </p>

              <p className="leading-7 text-slate-600 dark:text-slate-300">
                {item.description}
              </p>
            </div>
          ))}

          {experiences.length === 0 && (
            <p className="text-center text-slate-600 dark:text-slate-400">
              No experience added yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Timeline;