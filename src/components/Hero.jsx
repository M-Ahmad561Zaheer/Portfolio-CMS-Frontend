import { useEffect, useState } from "react";
import { Mail, Download } from "lucide-react";
import { motion } from "framer-motion";
import api from "../api/api";

const Hero = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/Profile");
        setProfile(res.data);
      } catch {
        setProfile(null);
      }
    };

    loadProfile();
  }, []);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden bg-white px-4 pt-28 pb-16 dark:bg-slate-950 sm:px-6 lg:px-8"
    >
      <div className="absolute left-1/2 top-28 h-56 w-56 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl sm:h-72 sm:w-72" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-500 dark:text-emerald-400 sm:text-sm">
            {profile?.role || "Full Stack Developer"}
          </p>

          <h1 className="text-4xl font-bold leading-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
            Hi, I&apos;m {profile?.fullName || "Ahmad Zaheer"}
            <span className="block text-emerald-500 dark:text-emerald-400">
              .NET & React Developer
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg lg:mx-0">
            {profile?.shortBio ||
              "I build scalable web applications, secure APIs, SaaS platforms, dashboards, and modern digital systems using ASP.NET Core, React, Tailwind CSS, and SQL databases."}
          </p>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400 sm:text-base lg:mx-0">
            {profile?.about ||
              "I create modern full-stack solutions including dashboards, CRM systems, APIs, and business automation platforms."}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="#projects"
              className="rounded-xl bg-emerald-500 px-6 py-3 text-center font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              View Projects
            </a>

            <a
              href="#contact"
              className="rounded-xl border border-slate-300 px-6 py-3 text-center font-semibold text-slate-950 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-white/20 dark:text-white dark:hover:text-emerald-400"
            >
              Contact Me
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-5 text-slate-500 dark:text-slate-400 lg:justify-start">
            <a
              href={profile?.githubUrl || "#"}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-emerald-500 dark:hover:text-emerald-400"
            >
              <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>

            <a
              href={profile?.linkedinUrl || "#"}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-emerald-500 dark:hover:text-emerald-400"
            >
              <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>

            <a href={`mailto:${profile?.email || "your-email@example.com"}`}>
              <Mail />
            </a>

            <a href={profile?.resumeUrl || "#"} target="_blank" rel="noreferrer">
              <Download />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mx-auto w-full max-w-xl lg:max-w-none"
        >
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-white/5 sm:p-6">
            <div className="mb-4 flex gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
            </div>

            <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-words text-xs leading-6 text-slate-700 dark:text-slate-300 sm:text-sm sm:leading-7">
              {`const developer = {
                name: "${profile?.fullName || "Ahmad Zaheer"}",
                role: "${profile?.role || "Full Stack Developer"}",
                frontend: ["React", "Tailwind CSS"],
                backend:  [".NET Core", "C#", "Node.js", "Express"],
                database: ["SQLite", "SQL", "MongoDB"],
                focus: "Scalable Web Apps"
              };`}
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;