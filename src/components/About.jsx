import { Code2, Database, Server, Rocket } from "lucide-react";

const About = () => {
  const points = [
    {
      icon: <Code2 />,
      title: "Frontend Development",
      desc: "Modern responsive interfaces using React and Tailwind CSS.",
    },
    {
      icon: <Server />,
      title: "Backend APIs",
      desc: "Secure and scalable REST APIs using ASP.NET Core.",
    },
    {
      icon: <Database />,
      title: "Database Design",
      desc: "Clean relational database structure using SQL Server & MongoDB.",
    },
    {
      icon: <Rocket />,
      title: "Product Focus",
      desc: "Building dashboards, SaaS platforms, CRM systems, and business automation solutions.",
    },
  ];

  return (
    <section
      id="about"
      className="bg-white px-6 py-24 dark:bg-slate-950"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500 dark:text-emerald-400">
            About Me
          </p>

          <h2 className="text-3xl font-bold text-slate-950 dark:text-white md:text-5xl">
            I build practical software solutions for real business problems.
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
            I am a Full Stack Developer focused on building scalable web
            applications using React, ASP.NET Core, SQL Server, MongoDB and
            Tailwind CSS. I develop modern dashboards, CRM systems, business
            automation platforms, secure REST APIs and custom software
            solutions that solve real-world business challenges.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {points.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg dark:border-white/10 dark:bg-slate-900"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
                {item.icon}
              </div>

              <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                {item.title}
              </h3>

              <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;