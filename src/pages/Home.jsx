import ArchitectureDiagram from "../components/ArchitectureDiagram";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, Boxes, BriefcaseBusiness, Code2, ExternalLink, Github, Linkedin, Mail, MapPin, Menu, Music2, Phone, Server, Sparkles, X } from "lucide-react";
import api from "../api/api";
import { subscribeToProfileUpdates } from "../utils/portfolioUpdates";
import { RESUME_URL } from "../utils/resume";

const navItems = ["home", "about", "projects", "experience", "skills", "education", "blog", "contact"];
const container = "mx-auto max-w-7xl px-5 sm:px-8";
const isOn = (profile, key) => profile?.[key] !== false;
const validUrl = (value) => value && value !== "#" ? value : null;
const safe = (value) => Array.isArray(value) ? value : [];
const splitItems = (value = "") => value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
const spotifyEmbed = (url) => {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("spotify.com")) return null;
    return parsed.pathname.startsWith("/embed/") ? parsed.toString() : `https://open.spotify.com/embed${parsed.pathname}`;
  } catch { return null; }
};

function Header({ profile, sections }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  useEffect(() => {
    let frame;
    const updateActive = () => {
      const available = sections.map(id => document.getElementById(id)).filter(Boolean);
      let current = available[0]?.id || "home";
      const offset = 100;
      for (const section of available) {
        if (section.getBoundingClientRect().top <= offset) current = section.id;
      }
      if (window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = available.at(-1)?.id || current;
      }
      setActive(current);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActive);
    };
    updateActive();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    const page = document.querySelector(".portfolio-page");
    if (page) observer.observe(page);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [sections]);
  const links = sections;
  return <header className="site-header"><div className={`${container} flex h-[70px] items-center justify-between`}>
    <a href="#home" className="brand">Ahmad<span>.dev</span></a>
    <nav className="desktop-nav" aria-label="Primary navigation">{links.map((item) => <a key={item} href={`#${item}`} className={active === item ? "active" : ""} aria-current={active === item ? "location" : undefined}>{item}</a>)}</nav>
    <div className="hidden items-center gap-2 lg:flex">{validUrl(profile?.githubUrl) && <a className="icon-button" href={profile.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub"><Github/></a>}{validUrl(profile?.linkedinUrl) && <a className="icon-button" href={profile.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin/></a>}<a className="primary-button compact" href={RESUME_URL} target="_blank" rel="noreferrer">Download CV</a></div>
    <button className="icon-button lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation">{open ? <X/> : <Menu/>}</button>
  </div>{open && <nav className="mobile-nav" aria-label="Mobile navigation">{links.map((item) => <a key={item} href={`#${item}`} className={active === item ? "active" : ""} aria-current={active === item ? "location" : undefined} onClick={() => setOpen(false)}>{item}</a>)}<div className="mobile-proof-links">{validUrl(profile?.githubUrl) && <a href={profile.githubUrl} target="_blank" rel="noreferrer"><Github/>GitHub</a>}{validUrl(profile?.linkedinUrl) && <a href={profile.linkedinUrl} target="_blank" rel="noreferrer"><Linkedin/>LinkedIn</a>}<a href={RESUME_URL} target="_blank" rel="noreferrer"><ExternalLink/>Download CV</a></div></nav>}</header>;
}

function CompactDescription({ text = "", bullets = false }) {
  const parts = text.split(/\n+|(?<=[.!?])\s+/).map(part => part.replace(/^\s*[•-]\s*/, "").trim()).filter(Boolean);
  if (!parts.length) return null;
  const limit = bullets ? 3 : 2;
  const visible = parts.slice(0, limit);
  return <div className="compact-description">
    {bullets ? <ul>{visible.map((part, index) => <li key={index}>{part}</li>)}</ul> : <p>{visible.join(" ")}</p>}
    {parts.length > limit && <details><summary>Read more</summary><p>{parts.slice(limit).join("\n\n")}</p></details>}
  </div>;
}

function CodeWindow({ profile }) {
  const lines = ["class Developer", "{", `  name = "${profile?.fullName || "Ahmad Zaheer"}";`, `  role = "${profile?.role || ".NET & React Developer"}";`, "", "  focus = [", '    "Clean Code", "APIs",', '    "UI/UX", "Performance"', "  ];", "", '  Build() => "Learning. Building. Improving. 🚀";', "}"];
  return <div className="code-window"><div className="code-toolbar"><div><span/><span/><span/></div><b>Developer.cs</b><small>C#</small></div><ol>{lines.map((line, index) => <li key={index}><code>{line || " "}</code></li>)}</ol></div>;
}

function HeroStats({ projects, skills, experiences, githubUrl }) {
  const items = [
    projects.length > 0 && { icon: Boxes, value: projects.length, label: "Projects built" },
    skills.length > 0 && { icon: Code2, value: skills.length, label: "Technologies" },
    experiences.length > 0 && { icon: BriefcaseBusiness, value: experiences.length, label: "Learning milestones" },
    validUrl(githubUrl) && { icon: Github, value: "Open", label: "GitHub activity", href: githubUrl },
  ].filter(Boolean);

  if (items.length === 0) return null;

  return <div className="hero-stats" aria-label="Portfolio credibility indicators">{items.map(({ icon: Icon, value, label, href }) => {
    const content = <><span className="hero-stat-icon"><Icon/></span><span className="hero-stat-copy"><strong>{value}</strong><small>{label}</small></span>{href && <ArrowRight className="hero-stat-arrow"/>}</>;
    return href ? <a className="hero-stat" href={href} target="_blank" rel="noreferrer" key={label}>{content}</a> : <div className="hero-stat" key={label}>{content}</div>;
  })}</div>;
}

function ProjectBuildSummary({ project }) {
  const details = [
    ["Problem", project.problem],
    ["My Approach", project.solution || project.longDescription],
    ["Key Technical Decision", project.technicalApproach],
    ["Architecture / Stack", project.techStack],
    ["What I Learned", project.lessonsLearned],
  ].filter(([, value]) => value?.trim());

  if (details.length === 0) return null;

  return <details className="build-summary"><summary>How I Built It <ArrowRight/></summary><div className="build-summary-content">{details.map(([title, value]) => <section key={title}><h4>{title}</h4>{title === "Architecture / Stack" ? <div className="tech-list">{splitItems(value).map((tech) => <span key={tech}>{tech}</span>)}</div> : <p>{value.length > 420 ? `${value.slice(0, 417).trim()}…` : value}</p>}</section>)}</div></details>;
}

function MusicCard({ profile }) {
  const embed = spotifyEmbed(profile?.musicUrl);
  if (!profile?.musicEnabled || !embed) return null;
  return <section className="music-shell" aria-labelledby="music-title"><div className="music-copy"><div className="music-art">{profile.musicCoverUrl ? <img src={profile.musicCoverUrl} alt="Playlist cover"/> : <Music2/>}</div><div><span>{profile.musicLabel || "Focus Mode"}</span><h3 id="music-title">{profile.musicHeading || "While You Browse"} 🎧</h3><p>{profile.musicDescription || "Play some lo-fi beats and stay in the zone."}</p><a href={profile.musicUrl} target="_blank" rel="noreferrer">Open in Spotify <ArrowRight/></a></div></div><iframe src={embed} height="152" title="Spotify music player" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"/></section>;
}

function GitHubActivity({ profile, projects }) {
  if (!isOn(profile, "githubEnabled") || !validUrl(profile?.githubUrl)) return null;
  const repositories = safe(projects).filter((project) => validUrl(project.githubUrl)).slice(0, 3);
  return <section id="github" className="section-block"><div className={container}><div className="github-heading"><div><p className="kicker">Proof of work</p><h2>GitHub Activity</h2><p>Real repositories, experiments and code behind the work.</p></div><a className="text-link" href={profile.githubUrl} target="_blank" rel="noreferrer">View GitHub Profile <ArrowRight/></a></div>
    {repositories.length > 0 ? <div className="repo-grid">{repositories.map((project) => <a className="repo-card" href={project.githubUrl} target="_blank" rel="noreferrer" key={project.id}><Github/><div><h3>{project.title}</h3><p>{project.description || "Explore this project repository on GitHub."}</p><span>{splitItems(project.techStack).slice(0, 4).join(" · ") || "Source repository"}</span></div><ExternalLink/></a>)}</div> : <div className="github-fallback"><Github/><p>Add a GitHub URL to your projects in the admin panel to feature repositories here.</p><a href={profile.githubUrl} target="_blank" rel="noreferrer">Open profile <ArrowRight/></a></div>}
  </div></section>;
}

export default function Home() {
  const [data, setData] = useState({ profile: {}, projects: [], skills: [], experiences: [], educations: [], blogs: [] });
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllArticles, setShowAllArticles] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [formState, setFormState] = useState({ busy: false, message: "", error: false });
  const refreshProfile = useCallback(() => api.get("/Profile").then(({ data: profile }) => setData((current) => ({ ...current, profile }))).catch(() => {}), []);
  useEffect(() => {
    Promise.allSettled([api.get("/Profile"), api.get("/Projects"), api.get("/Skills"), api.get("/Experiences"), api.get("/Blogs"), api.get("/Educations")])
      .then(([profile, projects, skills, experiences, blogs, educations]) => setData({ profile: profile.value?.data || {}, projects: safe(projects.value?.data), skills: safe(skills.value?.data), experiences: safe(experiences.value?.data), blogs: safe(blogs.value?.data), educations: safe(educations.value?.data) }));
    const unsubscribe = subscribeToProfileUpdates(refreshProfile);
    const interval = window.setInterval(refreshProfile, 15000);
    const refreshWhenVisible = () => { if (document.visibilityState === "visible") refreshProfile(); };
    window.addEventListener("focus", refreshProfile);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      unsubscribe();
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshProfile);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [refreshProfile]);
  const { profile, projects, skills, experiences, blogs, educations } = data;
  const skillGroups = useMemo(() => skills.reduce((groups, skill) => { (groups[skill.category || "Other"] ||= []).push(skill); return groups; }, {}), [skills]);
  const exploring = splitItems(profile.exploringItems);
  const sections = useMemo(() => navItems.filter(id => {
    if (id === "home") return true;
    if (id === "blog") return (isOn(profile, "blogEnabled") && blogs.length > 0) || (profile.exploringEnabled && splitItems(profile.exploringItems).length > 0);
    const counts = { projects: projects.length, experience: experiences.length, skills: skills.length, education: educations.length };
    return isOn(profile, `${id}Enabled`) && (!(id in counts) || counts[id] > 0);
  }), [profile, projects.length, experiences.length, skills.length, educations.length, blogs.length]);
  const submit = async (event) => {
    event.preventDefault(); if (formState.busy) return;
    setFormState({ busy: true, message: "", error: false });
    try { await api.post("/Contact", form); setForm({ name: "", email: "", message: "" }); setFormState({ busy: false, message: "Thanks — your message has been sent.", error: false }); }
    catch (error) { setFormState({ busy: false, message: error.response?.data?.message || "Message could not be sent. Please try again.", error: true }); }
  };
  return <main className="portfolio-page"><Header profile={profile} sections={sections}/>
    {/* Testimonials, Services, AI Assistant and duplicate Stats are intentionally not rendered on the public portfolio. Their admin/backend data remains untouched. */}
    <section id="home" className={`${container} hero`}><div className="hero-copy">{profile.availabilityText && <div className="availability"><span/>{profile.availabilityText}</div>}<p className="kicker">Hi, I&apos;m</p><h1>{profile.fullName || "Ahmad Zaheer"}</h1><h2>{profile.role || ".NET & React Developer"}</h2><p className="hero-intro">{profile.shortBio || "Building thoughtful web applications, APIs, dashboards and practical software while learning every day."}</p><div className="hero-actions"><a className="primary-button" href="#projects">View My Work <ArrowRight/></a><a className="secondary-button" href="#contact">Let&apos;s Connect</a></div><HeroStats projects={projects} skills={skills} experiences={experiences} githubUrl={profile.githubUrl}/></div><CodeWindow profile={profile}/></section>

    <section className="credibility-strip"><div className={`${container} credibility-grid`}>{[[Boxes,"Real Projects","Built end-to-end"],[Code2,"Clean Code","Maintainable solutions"],[Server,"Modern Stack","Practical technologies"],[Sparkles,"Continuous Learning","Improving consistently"]].map(([Icon,title,text]) => <div key={title}><Icon/><span><b>{title}</b><small>{text}</small></span></div>)}</div></section>

    {isOn(profile,"aboutEnabled") && <section id="about" className="section-block surface"><div className={`${container} philosophy`}><div><p className="kicker">About</p><h2>Engineering Philosophy</h2><CompactDescription text={profile.about || profile.shortBio}/></div><div>{["Solve real problems with practical solutions","Write clean, testable and maintainable code","Keep learning and ship consistently"].map((text,index) => <div className="principle" key={text}><span>0{index+1}</span><b>{text}</b></div>)}</div></div></section>}

    {isOn(profile,"projectsEnabled") && projects.length > 0 && <section id="projects" className="section-block tint"><div className={container}><div className="section-heading split"><div><p className="kicker">Portfolio</p><h2>Selected Engineering Work</h2><p>Applications and systems built to solve practical problems.</p></div>{projects.length > 3 && <button className="text-link" onClick={() => setShowAllProjects(!showAllProjects)}>{showAllProjects ? "Show Selected" : "View All Projects"} <ArrowRight/></button>}</div><div className="project-grid">{projects.slice(0,showAllProjects ? projects.length : 3).map((project) => <article className="project-card" key={project.id}><div className="project-media">{project.imageUrl ? <img src={project.imageUrl} alt={`${project.title} screenshot`} loading="lazy" onError={(event) => event.currentTarget.parentElement.classList.add("image-error")}/> : <Code2/>}</div><div className="project-body"><div className="project-top"><h3>{project.title}</h3><div>{validUrl(project.githubUrl) && <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={`${project.title} GitHub repository`}><Github/></a>}{validUrl(project.liveUrl) && <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`${project.title} live demo`}><ExternalLink/></a>}</div></div><p>{project.description}</p><div className="tech-list">{splitItems(project.techStack).map((tech) => <span key={tech}>{tech}</span>)}</div><ProjectBuildSummary project={project}/>{[project.longDescription,project.problem,project.solution,project.technicalApproach].some(Boolean)&&<a className="text-link case-link" href={`/projects/${project.slug||project.id}`}>View Full Case Study <ArrowRight/></a>}</div></article>)}</div></div></section>}

    {isOn(profile,"experienceEnabled") && experiences.length > 0 && <section id="experience" className="section-block surface"><div className={container}><div className="section-heading"><p className="kicker">Journey</p><h2>Experience & Learning Journey</h2><p>Practical experience, steady growth and lessons carried into every build.</p></div><div className="timeline">{experiences.map((item) => <article key={item.id}><span className="timeline-dot"/><time>{item.startDate} — {item.isCurrent ? "Present" : item.endDate?.replace(/Augest/gi, "August")}</time><h3>{item.title}</h3><h4>{item.company}{item.employmentType&&` · ${item.employmentType.replace(/full-time/gi, "Full-Time")}`}{item.location&&` · ${item.location}`}</h4><CompactDescription text={item.description} bullets/>{item.technologies&&<div className="tech-list">{splitItems(item.technologies).map(tech=><span key={tech}>{tech}</span>)}</div>}</article>)}</div></div></section>}

    {isOn(profile,"skillsEnabled") && skills.length > 0 && <section id="skills" className="section-block"><div className={container}><div className="section-heading"><p className="kicker">Technical Expertise</p><h2>Tools I Use to Build</h2><p>A practical toolkit shaped by real projects and continuous learning.</p></div><div className="skill-grid">{Object.entries(skillGroups).map(([category,items]) => <article className="skill-card" key={category}><div className="skill-title"><Code2/><h3>{category}</h3></div><div>{items.map((skill) => <span key={skill.id}>{skill.iconUrl&&<img src={skill.iconUrl} alt=""/>}{skill.name}{skill.proficiency && <small>{skill.proficiency}</small>}</span>)}</div></article>)}</div></div></section>}

    {isOn(profile,"educationEnabled") && educations.length > 0 && <section id="education" className="section-block surface"><div className={container}><div className="section-heading"><p className="kicker">Education</p><h2>Academic Journey</h2><p>Qualifications and learning that shaped my work.</p></div><div className="timeline">{educations.map(item => <article key={item.id}><span className="timeline-dot"/><time>{[item.startDate, item.isCurrent ? "Present" : item.endDate].filter(Boolean).join(" — ")}</time><h3>{item.degree === "BS Software Engineer" ? "BS Software Engineering" : item.degree}</h3><h4>{item.institution}{item.location && ` · ${item.location}`}</h4>{item.grade && <div className="tech-list"><span>Grade / CGPA: {item.grade}</span></div>}{item.description && <CompactDescription text={item.description}/>}</article>)}</div></div></section>}

    {isOn(profile,"architectureEnabled") && <section id="architecture" className="section-block"><div className={container}><div className="section-heading centered"><p className="kicker">How This Portfolio Works</p><h2>{profile.architectureTitle || "System Design & Architecture"}</h2><p>{profile.architectureDescription}</p></div><ArchitectureDiagram/></div></section>}

    <GitHubActivity profile={profile} projects={projects}/>

    {(isOn(profile,"blogEnabled") && blogs.length > 0) || (profile.exploringEnabled && exploring.length > 0) ? <section id="blog" className="section-block tint"><div className={container}>{isOn(profile,"blogEnabled") && blogs.length > 0 && <><div className="section-heading split"><div><p className="kicker">Writing</p><h2>Latest Insights</h2><p>Notes from projects, problems and things I am learning.</p></div>{blogs.length > 3 && <button className="text-link" onClick={() => setShowAllArticles(!showAllArticles)}>{showAllArticles ? "Show Latest" : "View All Articles"} <ArrowRight/></button>}</div><div className={`blog-grid count-${Math.min(blogs.length,3)}`}>{blogs.slice(0,showAllArticles ? blogs.length : 3).map((post) => <article className="blog-card" key={post.id}>{post.thumbnail ? <img src={post.thumbnail} alt="" loading="lazy"/> : <div className="blog-placeholder"><BookOpen/></div>}<div><div className="blog-meta">{post.category&&<span>{post.category}</span>}<time>{new Date(post.publishedAt||post.createdAt).toLocaleDateString()}</time>{post.readingTime>0&&<span>{post.readingTime} min read</span>}</div><h3>{post.title}</h3><p>{post.excerpt||post.content}</p><details><summary className="text-link">Read More <ArrowRight/></summary><div className="article-content">{post.content}</div></details></div></article>)}</div></>}{profile.exploringEnabled && exploring.length > 0 && <div className="exploring"><div><p className="kicker">Growth</p><h2>Currently Exploring</h2><p>Ideas and technologies I am actively learning—not claiming to have mastered.</p></div><div>{exploring.map((item) => <span key={item}><Sparkles/>{item}<small>{profile.exploringStatus || "Learning"}</small></span>)}</div></div>}</div></section> : null}

    {profile.musicEnabled && spotifyEmbed(profile.musicUrl) && <section className="music-section"><div className={container}><MusicCard profile={profile}/></div></section>}









    {isOn(profile,"contactEnabled") && <section id="contact" className="section-block"><div className={`${container} contact-layout`}><div><p className="kicker">Contact</p><h2>{profile.contactTitle || "Let's Build Something Great"}</h2><p>{profile.contactSubtitle || "Have a project, opportunity or idea? I'd be glad to hear about it."}</p><div className="contact-details">{profile.email && <a href={`mailto:${profile.email}`}><Mail/>{profile.email}</a>}{profile.phone && <a href={`tel:${profile.phone}`}><Phone/>{profile.phone}</a>}{profile.location && <span><MapPin/>{profile.location}</span>}</div></div>{profile.contactFormEnabled !== false && <form className="contact-form" onSubmit={submit}><label>Name<input required minLength="2" maxLength="100" value={form.name} onChange={(event) => setForm({...form,name:event.target.value})}/></label><label>Email<input required type="email" maxLength="160" value={form.email} onChange={(event) => setForm({...form,email:event.target.value})}/></label><label>Message<textarea required minLength="10" maxLength="3000" rows="5" value={form.message} onChange={(event) => setForm({...form,message:event.target.value})}/></label>{formState.message && <p role="status" className={formState.error ? "error" : "success"}>{formState.message}</p>}<button className="primary-button" disabled={formState.busy}>{formState.busy ? "Sending…" : "Send Message"}<ArrowRight/></button></form>}</div></section>}
    <footer><div className={container}><p>© {new Date().getFullYear()} {profile.fullName || "Ahmad Zaheer"}. All rights reserved.</p><div className="footer-links">{validUrl(profile.githubUrl) && <a href={profile.githubUrl} target="_blank" rel="noreferrer"><Github/>GitHub</a>}{validUrl(profile.linkedinUrl) && <a href={profile.linkedinUrl} target="_blank" rel="noreferrer"><Linkedin/>LinkedIn</a>}{profile.email && <a href={`mailto:${profile.email}`}><Mail/>Email</a>}</div><p>Built with ❤️ and lots of ☕</p></div></footer>
  </main>;
}
