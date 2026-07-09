import { useEffect, useState } from "react";
import api from "../api/api";

const Skills = () => {
  const [skills, setSkills] = useState([]);

  const fetchSkills = async () => {
    const res = await api.get("/Skills");
    setSkills(res.data);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill.name);
    return acc;
  }, {});

  return (
    <section id="skills" className="bg-slate-50 px-6 py-24 dark:bg-slate-900/60">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500 dark:text-emerald-400">
            Skills
          </p>

          <h2 className="text-3xl font-bold text-slate-950 dark:text-white md:text-5xl">
            Technologies I Work With
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(groupedSkills).map(([category, items]) => (
            <div
              key={category}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-950"
            >
              <h3 className="mb-5 text-xl font-semibold text-emerald-500 dark:text-emerald-400">
                {category}
              </h3>

              <div className="flex flex-wrap gap-3">
                {items.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {skills.length === 0 && (
          <p className="text-center text-slate-600 dark:text-slate-400">
            No skills added yet.
          </p>
        )}
      </div>
    </section>
  );
};

export default Skills;