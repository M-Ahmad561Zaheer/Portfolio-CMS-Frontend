import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { useParams } from "react-router-dom";
import api from "../api/api";

const split = (value = "") => value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean);

export default function ProjectDetail() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [state, setState] = useState("loading");

  useEffect(() => {
    const endpoint = /^\d+$/.test(projectId)
      ? `/Projects/${projectId}`
      : `/Projects/slug/${projectId}`;
    api.get(endpoint)
      .then(({ data }) => { setProject(data); setState("ready"); })
      .catch(() => setState("error"));
  }, [projectId]);

  if (state === "loading") return <main className="case-page"><p>Loading project…</p></main>;
  if (state === "error") return <main className="case-page"><div className="case-container"><a href="/#projects" className="text-link"><ArrowLeft />Back to projects</a><h1>Project not found</h1><p>This case study is unavailable or hidden.</p></div></main>;

  const sections = [["Overview", project.longDescription], ["Problem", project.problem], ["What I Built", project.solution], ["Technical Approach", project.technicalApproach], ["Key Features", project.keyFeatures], ["Challenges", project.challenges], ["What I Learned", project.lessonsLearned]].filter(([, content]) => content);
  const screenshots = split(project.screenshots);

  return <main className="case-page"><header className="case-nav"><a href="/#projects"><ArrowLeft />Ahmad.dev</a></header><article className="case-container"><p className="kicker">{project.status || "Project case study"}</p><h1>{project.title}</h1><p className="case-lead">{project.description}</p><div className="tech-list">{split(project.techStack).map((tech) => <span key={tech}>{tech}</span>)}</div><div className="case-actions">{project.githubUrl && <a className="secondary-button" href={project.githubUrl} target="_blank" rel="noreferrer"><Github />GitHub</a>}{project.liveUrl && <a className="primary-button" href={project.liveUrl} target="_blank" rel="noreferrer">Live Demo<ExternalLink /></a>}</div>{project.imageUrl && <img className="case-hero" src={project.imageUrl} alt={`${project.title} screenshot`} />}<div className="case-sections">{sections.map(([title, content]) => <section key={title}><h2>{title}</h2><p>{content}</p></section>)}</div>{screenshots.length > 0 && <section className="case-gallery"><h2>Screenshots</h2><div>{screenshots.map((url, index) => <img src={url} alt={`${project.title} screenshot ${index + 1}`} loading="lazy" key={url} />)}</div></section>}</article></main>;
}
