import { useEffect, useState } from "react";
import { ExternalLink, Github, X } from "lucide-react";
import api from "../api/api";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchProjects = async () => {
    const res = await api.get("/Projects");
    setProjects(res.data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="bg-white px-6 py-24 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500 dark:text-emerald-400">
            Portfolio
          </p>

          <h2 className="text-3xl font-bold text-slate-950 dark:text-white md:text-5xl">
            Featured Projects
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-xl dark:border-white/10 dark:bg-slate-900"
            >
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="h-56 w-full object-cover"
                />
              ) : (
                <div className="h-56 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20" />
              )}

              <div className="p-6">
                <h3 className="mb-3 text-2xl font-bold text-slate-950 dark:text-white">
                  {project.title}
                </h3>

                <p className="mb-5 text-slate-600 dark:text-slate-400">
                  {project.description}
                </p>

                <p className="mb-6 text-sm font-medium text-emerald-500 dark:text-emerald-400">
                  {project.techStack}
                </p>

                <button
                  onClick={() => setSelectedProject(project)}
                  className="flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  <ExternalLink size={18} />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <p className="mt-8 text-center text-slate-600 dark:text-slate-400">
            No projects available.
          </p>
        )}
      </div>

      {/* Modal */}

      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-slate-900">

            <button
              onClick={() => setSelectedProject(null)}
              className="absolute right-5 top-5 text-slate-500 transition hover:text-red-500 dark:text-slate-400"
            >
              <X />
            </button>

            {selectedProject.imageUrl && (
              <img
                src={selectedProject.imageUrl}
                alt={selectedProject.title}
                className="mb-6 h-64 w-full rounded-2xl object-cover"
              />
            )}

            <h3 className="mb-4 text-3xl font-bold text-slate-950 dark:text-white">
              {selectedProject.title}
            </h3>

            <p className="mb-6 leading-8 text-slate-600 dark:text-slate-300">
              {selectedProject.longDescription}
            </p>

            <div className="mb-8 rounded-xl bg-emerald-500/10 p-4 text-emerald-600 dark:text-emerald-400">
              <strong>Tech Stack:</strong> {selectedProject.techStack}
            </div>

            <div className="flex flex-wrap gap-4">
              {selectedProject.githubUrl && (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-3 font-medium transition hover:border-emerald-400 dark:border-white/10"
                >
                  <Github size={18} />
                  Source Code
                </a>
              )}

              {selectedProject.liveUrl && (
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  <ExternalLink size={18} />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;