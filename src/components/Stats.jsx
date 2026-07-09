import { Users, Briefcase, Award, Code2 } from "lucide-react";

const Stats = () => {
  const stats = [
    {
      icon: <Briefcase size={32} />,
      number: "25+",
      title: "Projects Completed",
    },
    {
      icon: <Users size={32} />,
      number: "15+",
      title: "Happy Clients",
    },
    {
      icon: <Award size={32} />,
      number: "2+",
      title: "Years Experience",
    },
    {
      icon: <Code2 size={32} />,
      number: "10+",
      title: "Technologies",
    },
  ];

  return (
    <section className="bg-slate-50 px-6 py-24 dark:bg-slate-900/30">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-xl dark:border-white/10 dark:bg-white/5"
            >
              <div className="mb-4 flex justify-center text-emerald-500 dark:text-emerald-400">
                {item.icon}
              </div>

              <h3 className="mb-2 text-4xl font-bold text-slate-900 dark:text-white">
                {item.number}
              </h3>

              <p className="text-slate-600 dark:text-slate-400">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;