import { useEffect, useMemo, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  Cpu,
  Download,
  ExternalLink,
  Github,
  Layers,
  Linkedin,
  Mail,
  MessageSquareQuote,
  Phone,
  Send,
  Sparkles,
  Terminal,
  Trash2,
  X,
} from "lucide-react";
import api from "../api/api";

const STORAGE_KEY = "portfolio_ai_chat_v2";

const normalizeText = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s.+#-]/g, " ")
    .replace(/\s+/g, " ");

const includesAny = (text, words) =>
  words.some((word) => text.includes(normalizeText(word)));

const uniqueStrings = (items) =>
  [...new Set(items.map((item) => item?.trim()).filter(Boolean))];

const splitTechStack = (value = "") =>
  value
    .split(/[,|/]/)
    .map((item) => item.trim())
    .filter(Boolean);

const safeArray = (value) => (Array.isArray(value) ? value : []);

const AIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingContext, setIsLoadingContext] = useState(true);

  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [services, setServices] = useState([]);

  const chatEndRef = useRef(null);
  const typingTimerRef = useRef(null);

  const initialWelcomeMessage = useMemo(
    () => ({
      sender: "bot",
      type: "welcome",
      text: "Hi! I’m Ahmad’s portfolio assistant. I can help you explore projects, skills, services, experience, blogs, testimonials, resume, and contact details.",
    }),
    []
  );

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : null;

      return Array.isArray(parsed) && parsed.length > 0
        ? parsed
        : [initialWelcomeMessage];
    } catch {
      return [initialWelcomeMessage];
    }
  });

  useEffect(() => {
    loadPortfolioContext();

    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, isTyping]);

  const loadPortfolioContext = async () => {
    setIsLoadingContext(true);

    const requests = [
      ["profile", "/Profile"],
      ["projects", "/Projects"],
      ["blogs", "/Blogs"],
      ["testimonials", "/Testimonials"],
      ["experiences", "/Experiences"],
      ["skills", "/Skills"],
      ["services", "/Services"],
    ];

    const results = await Promise.allSettled(
      requests.map(([, endpoint]) => api.get(endpoint))
    );

    results.forEach((result, index) => {
      const [key] = requests[index];
      const data =
        result.status === "fulfilled" ? result.value?.data : null;

      if (key === "profile") setProfile(data || null);
      if (key === "projects") setProjects(safeArray(data));
      if (key === "blogs") setBlogs(safeArray(data));
      if (key === "testimonials") setTestimonials(safeArray(data));
      if (key === "experiences") setExperiences(safeArray(data));
      if (key === "skills") setSkills(safeArray(data));
      if (key === "services") setServices(safeArray(data));
    });

    setIsLoadingContext(false);
  };

  const groupedSkills = useMemo(() => {
    return skills.reduce((acc, skill) => {
      const category = skill.category || "Other";

      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push(skill.name);
      return acc;
    }, {});
  }, [skills]);

  const technologyList = useMemo(() => {
    const fromSkills = skills.map((skill) => skill.name);
    const fromProjects = projects.flatMap((project) =>
      splitTechStack(project.techStack)
    );

    return uniqueStrings([
      ...fromSkills,
      ...fromProjects,
      "React",
      "Tailwind CSS",
      "ASP.NET Core",
      "C#",
      "REST APIs",
      "JWT Authentication",
      "Entity Framework Core",
      "PostgreSQL",
      "Neon",
      "Docker",
      "Render",
      "Vercel",
    ]);
  }, [projects, skills]);

  const findMatchingProject = (query) => {
    const normalizedQuery = normalizeText(query);

    return projects.find((project) => {
      const title = normalizeText(project.title);
      const description = normalizeText(
        `${project.description || ""} ${project.longDescription || ""}`
      );

      return (
        (title && normalizedQuery.includes(title)) ||
        title
          .split(" ")
          .filter((word) => word.length > 2)
          .some((word) => normalizedQuery.includes(word)) ||
        description
          .split(" ")
          .filter((word) => word.length > 5)
          .some((word) => normalizedQuery.includes(word))
      );
    });
  };

  const createResponse = (question) => {
    const q = normalizeText(question);
    const matchingProject = findMatchingProject(q);

    const asksForContact = includesAny(q, [
      "contact",
      "email",
      "phone",
      "reach",
      "linkedin",
      "github",
      "connect",
    ]);

    const asksForResume = includesAny(q, [
      "resume",
      "cv",
      "download cv",
      "download resume",
    ]);

    const asksForProject = includesAny(q, [
      "project",
      "portfolio",
      "work",
      "built",
      "developed",
      "application",
      "software",
      "case study",
    ]);

    const asksForTechnology = includesAny(q, [
      "skill",
      "skills",
      "technology",
      "technologies",
      "tech stack",
      "stack",
      "react",
      ".net",
      "dotnet",
      "asp.net",
      "postgres",
      "database",
    ]);

    if (asksForResume) {
      if (!profile?.resumeUrl) {
        return {
          type: "text",
          text: "A resume has not been uploaded yet. You can still contact Ahmad through the contact form.",
        };
      }

      return {
        type: "resume",
        text: "You can view or download Ahmad’s latest resume below.",
        data: {
          resumeUrl: profile.resumeUrl,
          fullName: profile.fullName || "Ahmad Zaheer",
        },
      };
    }

    if (asksForContact) {
      return {
        type: "contact",
        text: "Here are the available contact options:",
        data: {
          fullName: profile?.fullName || "Ahmad Zaheer",
          email: profile?.email,
          phone: profile?.phone,
          location: profile?.location,
          githubUrl: profile?.githubUrl,
          linkedinUrl: profile?.linkedinUrl,
        },
      };
    }

    if (matchingProject && (asksForProject || asksForTechnology)) {
      return {
        type: "project_single",
        text: `Here are the details for ${matchingProject.title}:`,
        data: matchingProject,
      };
    }

    if (
      includesAny(q, [
        "who is",
        "about",
        "your name",
        "developer",
        "tell me about ahmad",
        "profile",
      ])
    ) {
      return {
        type: "about",
        text: profile
          ? `${profile.fullName} is a ${profile.role}. ${
              profile.shortBio || profile.about || ""
            }`
          : "This portfolio belongs to Ahmad Zaheer, a full-stack developer specializing in React and ASP.NET Core.",
        data: profile,
      };
    }

    if (asksForTechnology) {
      return {
        type: "skills",
        text: "Here is the current technical stack and skill set:",
        data: {
          groupedSkills,
          technologies: technologyList,
        },
      };
    }

    if (
      includesAny(q, [
        "service",
        "services",
        "offer",
        "hire",
        "freelance",
        "available",
        "what can you build",
      ])
    ) {
      const dynamicServices =
        services.length > 0
          ? services
          : [
              {
                title: "Web Development",
                description: "Modern responsive web applications.",
              },
              {
                title: "ASP.NET Core APIs",
                description: "Secure REST APIs and backend systems.",
              },
              {
                title: "Admin Dashboards",
                description: "Custom content management and business dashboards.",
              },
              {
                title: "Business Automation",
                description: "Workflow automation and custom software solutions.",
              },
            ];

      return {
        type: "services",
        text: "These are the services currently available:",
        data: dynamicServices,
      };
    }

    if (asksForProject) {
      if (projects.length === 0) {
        return {
          type: "text",
          text: "No portfolio projects are available yet.",
        };
      }

      return {
        type: "projects_list",
        text: "Here are the current portfolio projects:",
        data: projects,
      };
    }

    if (
      includesAny(q, [
        "experience",
        "journey",
        "work history",
        "employment",
        "career",
      ])
    ) {
      if (experiences.length === 0) {
        return {
          type: "text",
          text: "No experience records are available yet.",
        };
      }

      return {
        type: "experiences",
        text: "Here is Ahmad’s professional journey:",
        data: experiences,
      };
    }

    if (
      includesAny(q, ["blog", "blogs", "article", "articles", "writing"])
    ) {
      if (blogs.length === 0) {
        return {
          type: "text",
          text: "No blog articles are published yet.",
        };
      }

      return {
        type: "blogs",
        text: "Here are the latest published articles:",
        data: blogs.slice(0, 5),
      };
    }

    if (
      includesAny(q, [
        "testimonial",
        "testimonials",
        "client review",
        "reviews",
        "feedback",
      ])
    ) {
      if (testimonials.length === 0) {
        return {
          type: "text",
          text: "No client testimonials are available yet.",
        };
      }

      return {
        type: "testimonials",
        text: "Here is recent client feedback:",
        data: testimonials.slice(0, 5),
      };
    }

    if (
      includesAny(q, ["price", "cost", "budget", "charges", "quote", "estimate"])
    ) {
      return {
        type: "budget",
        text: "Project cost depends on scope, features, timeline, integrations, and complexity. Share your requirements through the contact form to receive a tailored estimate.",
      };
    }

    if (
      includesAny(q, [
        "cms",
        "admin panel",
        "dashboard",
        "manage content",
        "content management",
      ])
    ) {
      return {
        type: "cms",
        text: "This portfolio includes a custom admin CMS for managing projects, blogs, testimonials, experiences, skills, services, profile details, resume, contact messages, and replies.",
      };
    }

    return {
      type: "help",
      text: "I can help with projects, technologies, services, experience, blogs, testimonials, resume, pricing, CMS features, and contact information.",
    };
  };

  const handleMessageSubmit = (textToSend) => {
    const cleanText = textToSend.trim();

    if (!cleanText || isTyping) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        type: "text",
        text: cleanText,
      },
    ]);

    setInput("");
    setIsTyping(true);

    typingTimerRef.current = setTimeout(() => {
      const response = createResponse(cleanText);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          ...response,
        },
      ]);

      setIsTyping(false);
    }, 600);
  };

  const clearChat = () => {
    setMessages([initialWelcomeMessage]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const quickPrompts = useMemo(() => {
    const prompts = [
      { label: "Projects", query: "Show me your portfolio projects" },
      { label: "Tech Stack", query: "What is your tech stack?" },
      { label: "Services", query: "What services do you offer?" },
      { label: "Experience", query: "Show your experience" },
    ];

    if (profile?.resumeUrl) {
      prompts.push({
        label: "Resume",
        query: "Show me your resume",
      });
    }

    return prompts;
  }, [profile]);

  const renderBotContent = (message) => {
    if (message.type === "welcome") {
      return (
        <div className="space-y-3">
          <p>{message.text}</p>

          <div className="grid gap-2 text-xs">
            {[
              "Explore projects and case studies",
              "Review skills and technologies",
              "Check services and availability",
              "View resume and contact details",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 text-slate-300"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {item}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (message.type === "skills") {
      return (
        <div className="space-y-3">
          <p>{message.text}</p>

          {Object.keys(message.data?.groupedSkills || {}).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(message.data.groupedSkills).map(
                ([category, items]) => (
                  <div
                    key={category}
                    className="rounded-xl border border-white/5 bg-white/[0.03] p-3"
                  >
                    <p className="mb-2 text-xs font-semibold text-emerald-400">
                      {category}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {items.map((item) => (
                        <span
                          key={item}
                          className="rounded-md border border-emerald-500/10 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {message.data?.technologies?.map((technology) => (
                <span
                  key={technology}
                  className="rounded-md border border-emerald-500/10 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-300"
                >
                  {technology}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (message.type === "services") {
      return (
        <div className="space-y-3">
          <p>{message.text}</p>

          <div className="grid gap-2">
            {message.data?.map((service) => (
              <div
                key={service.id || service.title}
                className="rounded-xl border border-white/5 bg-white/[0.03] p-3"
              >
                <p className="text-xs font-semibold text-white">
                  {service.title}
                </p>
                <p className="mt-1 text-[11px] leading-5 text-slate-400">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (message.type === "projects_list") {
      return (
        <div className="space-y-3">
          <p>{message.text}</p>

          <div className="grid max-h-56 gap-2 overflow-y-auto">
            {message.data?.map((project) => (
              <button
                key={project.id || project.title}
                type="button"
                onClick={() =>
                  handleMessageSubmit(`Tell me about ${project.title}`)
                }
                className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 text-left transition hover:border-emerald-500/20 hover:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <Layers
                    size={15}
                    className="shrink-0 text-emerald-400"
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-200">
                      {project.title}
                    </p>
                    <p className="mt-1 line-clamp-1 text-[10px] text-slate-500">
                      {project.techStack}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] text-slate-500 group-hover:text-emerald-400">
                  View →
                </span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (message.type === "project_single") {
      const project = message.data || {};

      return (
        <div className="space-y-3">
          <p>{message.text}</p>

          <div className="space-y-3 rounded-xl border border-white/5 bg-white/[0.03] p-3">
            {project.imageUrl && (
              <img
                src={project.imageUrl}
                alt={project.title}
                className="h-28 w-full rounded-lg object-cover"
              />
            )}

            <p className="text-xs leading-5 text-slate-300">
              {project.longDescription || project.description}
            </p>

            {project.techStack && (
              <div className="flex flex-wrap gap-1.5">
                {splitTechStack(project.techStack).map((technology) => (
                  <span
                    key={technology}
                    className="rounded-md bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-300"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-[11px] text-slate-200 transition hover:border-emerald-400"
                >
                  <Github size={13} />
                  Source
                </a>
              )}

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-[11px] font-semibold text-slate-950"
                >
                  <ExternalLink size={13} />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (message.type === "experiences") {
      return (
        <div className="space-y-3">
          <p>{message.text}</p>

          <div className="space-y-2 border-l border-emerald-500/30 pl-3">
            {message.data?.map((experience) => (
              <div
                key={experience.id}
                className="relative rounded-xl border border-white/5 bg-white/[0.03] p-3"
              >
                <span className="absolute -left-[17px] top-4 h-2 w-2 rounded-full bg-emerald-400" />
                <p className="text-xs font-semibold text-white">
                  {experience.title}
                </p>
                <p className="mt-1 text-[11px] text-emerald-400">
                  {experience.company}
                </p>
                <p className="mt-1 text-[10px] text-slate-500">
                  {experience.startDate} — {experience.endDate}
                </p>
                {experience.description && (
                  <p className="mt-2 text-[11px] leading-5 text-slate-400">
                    {experience.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (message.type === "blogs") {
      return (
        <div className="space-y-3">
          <p>{message.text}</p>

          <div className="grid gap-2">
            {message.data?.map((blog) => (
              <div
                key={blog.id}
                className="overflow-hidden rounded-xl border border-white/5 bg-white/[0.03]"
              >
                {blog.thumbnail && (
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="h-24 w-full object-cover"
                  />
                )}

                <div className="p-3">
                  <p className="text-xs font-semibold text-white">
                    {blog.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-slate-400">
                    {blog.content}
                  </p>

                  {blog.slug && (
                    <a
                      href={`#blog`}
                      className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400"
                    >
                      Read article
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (message.type === "testimonials") {
      return (
        <div className="space-y-3">
          <p>{message.text}</p>

          <div className="grid gap-2">
            {message.data?.map((testimonial) => (
              <div
                key={testimonial.id}
                className="rounded-xl border border-white/5 bg-white/[0.03] p-3"
              >
                <div className="mb-2 flex items-center gap-1 text-yellow-400">
                  {Array.from({
                    length: Math.min(Math.max(testimonial.rating || 5, 1), 5),
                  }).map((_, index) => (
                    <span key={index}>★</span>
                  ))}
                </div>

                <p className="text-[11px] leading-5 text-slate-300">
                  “{testimonial.review}”
                </p>

                <p className="mt-2 text-xs font-semibold text-white">
                  {testimonial.clientName}
                </p>

                <p className="text-[10px] text-slate-500">
                  {[testimonial.position, testimonial.company]
                    .filter(Boolean)
                    .join(" at ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (message.type === "contact") {
      const contact = message.data || {};

      return (
        <div className="space-y-3">
          <p>{message.text}</p>

          <div className="grid gap-2">
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-xs text-slate-300 transition hover:border-emerald-500/20"
              >
                <Mail size={15} className="text-emerald-400" />
                {contact.email}
              </a>
            )}

            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-xs text-slate-300 transition hover:border-emerald-500/20"
              >
                <Phone size={15} className="text-emerald-400" />
                {contact.phone}
              </a>
            )}

            {contact.linkedinUrl && (
              <a
                href={contact.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-xs text-slate-300 transition hover:border-emerald-500/20"
              >
                <Linkedin size={15} className="text-emerald-400" />
                LinkedIn
              </a>
            )}

            {contact.githubUrl && (
              <a
                href={contact.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-xs text-slate-300 transition hover:border-emerald-500/20"
              >
                <Github size={15} className="text-emerald-400" />
                GitHub
              </a>
            )}
          </div>
        </div>
      );
    }

    if (message.type === "resume") {
      return (
        <div className="space-y-3">
          <p>{message.text}</p>

          <a
            href={message.data?.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            <Download size={15} />
            View Resume
          </a>
        </div>
      );
    }

    return <p>{message.text}</p>;
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[200] flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-5 py-3.5 font-bold text-slate-950 shadow-xl transition-all duration-300 hover:scale-105 sm:px-6 sm:py-4"
        aria-label="Open portfolio assistant"
      >
        <Sparkles size={20} className="animate-pulse" />
        <span className="hidden sm:inline">Ask AI</span>
      </button>

      {open && (
        <div className="fixed inset-x-3 bottom-20 z-[200] flex h-[min(680px,calc(100vh-6rem))] flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 text-white shadow-2xl backdrop-blur-xl sm:inset-x-auto sm:bottom-24 sm:right-6 sm:w-[430px]">
          <div className="flex items-center justify-between border-b border-white/5 bg-slate-900/70 px-4 py-4 sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                <Terminal className="text-emerald-400" size={18} />
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-sm font-bold">
                  Portfolio Assistant
                </h3>

                <p className="flex items-center gap-1 text-xs text-slate-400">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isLoadingContext
                        ? "animate-pulse bg-yellow-400"
                        : "bg-emerald-500"
                    }`}
                  />
                  {isLoadingContext
                    ? "Loading portfolio context..."
                    : "Portfolio context ready"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                title="Clear chat"
                className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-rose-400"
              >
                <Trash2 size={16} />
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                title="Close assistant"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto border-b border-white/5 bg-slate-900/30 px-4 py-2.5">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt.label}
                type="button"
                disabled={isTyping || isLoadingContext}
                onClick={() => handleMessageSubmit(prompt.query)}
                className="whitespace-nowrap rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-slate-400 transition hover:border-emerald-500/20 hover:bg-emerald-500/5 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
            {messages.map((message, index) => (
              <div
                key={`${message.sender}-${index}`}
                className={`flex max-w-[92%] items-start gap-2.5 ${
                  message.sender === "user"
                    ? "ml-auto flex-row-reverse"
                    : "mr-auto"
                }`}
              >
                {message.sender === "bot" && (
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-slate-900 text-emerald-400">
                    <Cpu size={12} />
                  </div>
                )}

                <div
                  className={`min-w-0 rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.sender === "user"
                      ? "rounded-tr-none bg-gradient-to-r from-emerald-500 to-teal-500 font-semibold text-slate-950"
                      : "w-full rounded-tl-none border border-white/5 bg-white/[0.03] text-slate-200"
                  }`}
                >
                  {message.sender === "bot"
                    ? renderBotContent(message)
                    : message.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="mr-auto flex max-w-[85%] items-center gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-slate-900 text-emerald-400">
                  <Cpu size={12} className="animate-spin" />
                </div>

                <div className="flex items-center gap-1 rounded-2xl rounded-tl-none border border-white/5 bg-white/[0.03] px-4 py-3">
                  {[0, 1, 2].map((item) => (
                    <span
                      key={item}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400"
                      style={{ animationDelay: `${item * 120}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleMessageSubmit(input);
            }}
            className="flex gap-2 border-t border-white/5 bg-slate-900/50 p-3 sm:p-4"
          >
            <input
              type="text"
              disabled={isTyping}
              placeholder={
                isTyping
                  ? "Assistant is preparing a response..."
                  : "Ask about the portfolio..."
              }
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-500/40 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="rounded-xl bg-emerald-500 px-4 text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
