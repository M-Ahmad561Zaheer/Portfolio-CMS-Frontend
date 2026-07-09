import { useEffect, useRef, useState } from "react";
import {
  Cpu,
  Layers,
  Send,
  Sparkles,
  Terminal,
  Trash2,
  X,
} from "lucide-react";
import api from "../api/api";

const AIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [experiences, setExperiences] = useState([]);

  const chatEndRef = useRef(null);

  const initialWelcomeMessage = {
    sender: "bot",
    text: "Hi, I am your AI portfolio assistant. Ask me about projects, skills, services, experience, blogs, testimonials, or contact details.",
    type: "text",
  };

  const [messages, setMessages] = useState([initialWelcomeMessage]);

  const services = [
    "Web Development",
    "ASP.NET Core API Development",
    "React Frontend Development",
    "Admin Dashboard Development",
    "CRM System Development",
    "Business Process Automation",
    "Portfolio CMS Development",
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, isTyping]);

  const loadData = async () => {
    try {
      const res = await api.get("/Profile");
      setProfile(res.data);
    } catch {
      setProfile(null);
    }

    try {
      const res = await api.get("/Projects");
      setProjects(res.data || []);
    } catch {
      setProjects([]);
    }

    try {
      const res = await api.get("/Blogs");
      setBlogs(res.data || []);
    } catch {
      setBlogs([]);
    }

    try {
      const res = await api.get("/Testimonials");
      setTestimonials(res.data || []);
    } catch {
      setTestimonials([]);
    }

    try {
      const res = await api.get("/Experiences");
      setExperiences(res.data || []);
    } catch {
      setExperiences([]);
    }
  };

  const getBotReplyStructure = (question) => {
    const q = question.toLowerCase();

    if (q.includes("react") || q.includes(".net") || q.includes("dotnet")) {
      return {
        text: "Yes. This portfolio uses a modern full-stack architecture:",
        type: "tech",
        data: [
          "React",
          "Tailwind CSS",
          "ASP.NET Core Web API",
          "JWT Authentication",
          "SQLite Database",
          "Admin CMS",
        ],
      };
    }

    if (q.includes("cms") || q.includes("admin")) {
      return {
        text: "This portfolio includes a custom CMS. The admin can manage projects, blogs, testimonials, experiences, profile content, contact messages, and replies without changing code.",
        type: "text",
      };
    }

    if (
      q.includes("name") ||
      q.includes("who is") ||
      q.includes("about you") ||
      q.includes("about")
    ) {
      return {
        text: profile
          ? `${profile.fullName} is a ${profile.role}. ${profile.shortBio || profile.about}`
          : "This portfolio belongs to Ahmad Zaheer, a .NET and React full-stack developer.",
        type: "text",
      };
    }

    const matchedProject = projects.find((p) =>
      q.includes(p.title?.toLowerCase())
    );

    if (matchedProject) {
      return {
        text: `Here are the details for ${matchedProject.title}:`,
        type: "project_single",
        data: matchedProject,
      };
    }

    if (q.includes("project") || q.includes("portfolio")) {
      if (projects.length === 0) {
        return {
          text: "No projects are available yet. Admin can add projects from the dashboard.",
          type: "text",
        };
      }

      return {
        text: "Here are the current projects in this portfolio:",
        type: "projects_list",
        data: projects,
      };
    }

    if (
      q.includes("skill") ||
      q.includes("technology") ||
      q.includes("tech stack") ||
      q.includes("tech")
    ) {
      const dynamicTech = projects
        .map((p) => p.techStack)
        .filter(Boolean)
        .join(", ");

      return {
        text: "Core technical skills and stack include:",
        type: "tech",
        data: dynamicTech
          ? [
              ...new Set(
                dynamicTech
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean)
              ),
              "React",
              "ASP.NET Core",
              "REST APIs",
              "JWT Auth",
              "SQLite / SQL",
            ]
          : [
              "React",
              "Tailwind CSS",
              "ASP.NET Core",
              "C#",
              "REST APIs",
              "JWT Authentication",
              "SQLite / SQL",
            ],
      };
    }

    if (
      q.includes("service") ||
      q.includes("offer") ||
      q.includes("work") ||
      q.includes("build")
    ) {
      return {
        text: "Professional services available:",
        type: "services",
        data: services,
      };
    }

    if (
      q.includes("experience") ||
      q.includes("journey") ||
      q.includes("work history")
    ) {
      if (experiences.length === 0) {
        return {
          text: "No experience records are available yet. Admin can add them from the dashboard.",
          type: "text",
        };
      }

      return {
        text: "Here is the professional experience listed in this portfolio:",
        type: "services",
        data: experiences.map(
          (exp) =>
            `${exp.title} at ${exp.company} (${exp.startDate} - ${exp.endDate})`
        ),
      };
    }

    if (
      q.includes("blog") ||
      q.includes("article") ||
      q.includes("writing")
    ) {
      if (blogs.length === 0) {
        return {
          text: "No blog articles are published yet.",
          type: "text",
        };
      }

      return {
        text: "Latest blog articles available:",
        type: "services",
        data: blogs.map((blog) => blog.title),
      };
    }

    if (
      q.includes("testimonial") ||
      q.includes("client review") ||
      q.includes("review")
    ) {
      if (testimonials.length === 0) {
        return {
          text: "No client testimonials are available yet.",
          type: "text",
        };
      }

      return {
        text: "Here are client testimonials from the portfolio:",
        type: "services",
        data: testimonials.map(
          (t) => `${t.clientName}: ${t.review}`
        ),
      };
    }

    if (
      q.includes("contact") ||
      q.includes("email") ||
      q.includes("phone") ||
      q.includes("reach")
    ) {
      return {
        text: profile
          ? `You can contact ${profile.fullName} via email: ${profile.email}, phone: ${profile.phone}, location: ${profile.location}. You can also submit the contact form on this website.`
          : "You can use the contact form on this website to send a message.",
        type: "text",
      };
    }

    if (
      q.includes("available") ||
      q.includes("hire") ||
      q.includes("freelance")
    ) {
      return {
        text: profile
          ? `${profile.fullName} is available for React, ASP.NET Core, admin dashboard, CRM, portfolio CMS, and business automation projects. Please send your requirements through the contact form.`
          : "Yes, you can contact through the contact form for full-stack development work.",
        type: "text",
      };
    }

    if (
      q.includes("price") ||
      q.includes("cost") ||
      q.includes("budget") ||
      q.includes("charges")
    ) {
      return {
        text: "Project cost depends on scope, features, timeline, and complexity. Please share your requirements through the contact form, and the admin can reply directly by email from the dashboard.",
        type: "text",
      };
    }

    return {
      text: "I can answer questions about projects, skills, services, experience, blogs, testimonials, contact details, CMS features, React, .NET, hiring availability, and project budget.",
      type: "text",
    };
  };

  const handleMessageSubmit = (textToSend) => {
    if (!textToSend.trim() || isTyping) return;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: textToSend, type: "text" },
    ]);

    setIsTyping(true);

    setTimeout(() => {
      const reply = getBotReplyStructure(textToSend);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: reply.text,
          type: reply.type,
          data: reply.data,
        },
      ]);

      setIsTyping(false);
    }, 700);
  };

  const clearChatLogs = () => {
    if (window.confirm("Do you want to clear current chat?")) {
      setMessages([initialWelcomeMessage]);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[200] flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-4 font-bold text-slate-950 shadow-xl transition-all duration-300 hover:scale-105"
      >
        <Sparkles size={20} className="animate-pulse text-slate-950" />
        <span>Ask AI</span>
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-[200] flex h-[550px] w-[92vw] max-w-md flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 text-white shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/5 bg-slate-900/60 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                <Terminal className="text-emerald-400" size={18} />
              </div>

              <div>
                <h3 className="text-sm font-bold tracking-tight">
                  Portfolio AI Assistant
                </h3>
                <p className="flex items-center gap-1 text-xs text-slate-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Portfolio context loaded
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearChatLogs}
                title="Clear Chat"
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-white/5 hover:text-rose-400"
              >
                <Trash2 size={16} />
              </button>

              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto border-b border-white/5 bg-slate-900/20 px-5 py-2.5">
            {[
              { label: "📁 Projects", query: "Show me your portfolio projects" },
              { label: "⚡ Tech Stack", query: "What is your tech stack?" },
              { label: "💼 Services", query: "What services do you offer?" },
              { label: "📌 Experience", query: "Show your experience" },
            ].map((prompt) => (
              <button
                key={prompt.label}
                disabled={isTyping}
                onClick={() => handleMessageSubmit(prompt.query)}
                className="whitespace-nowrap rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-emerald-500/20 hover:bg-emerald-500/5 hover:text-emerald-400 disabled:opacity-30"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex max-w-[88%] items-start gap-2.5 ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-slate-900 text-emerald-400">
                    <Cpu size={11} />
                  </div>
                )}

                <div className="w-full space-y-2">
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "rounded-tr-none bg-gradient-to-r from-emerald-500 to-teal-500 font-semibold text-slate-950"
                        : "rounded-tl-none border border-white/5 bg-white/[0.03] text-slate-200"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.sender === "bot" && msg.type === "tech" && (
                    <div className="flex flex-wrap gap-1.5 pt-1 pl-1">
                      {msg.data?.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-emerald-500/10 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {msg.sender === "bot" && msg.type === "services" && (
                    <div className="grid gap-1.5 pt-1 pl-1">
                      {msg.data?.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs text-slate-300"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                          {item}
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.sender === "bot" && msg.type === "projects_list" && (
                    <div className="grid max-h-48 gap-2 overflow-y-auto pt-1 pl-1">
                      {msg.data?.map((proj) => (
                        <div
                          key={proj.id || proj.title}
                          onClick={() =>
                            handleMessageSubmit(`Tell me about ${proj.title}`)
                          }
                          className="group flex cursor-pointer items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-2.5 transition-colors hover:bg-white/5"
                        >
                          <div className="flex items-center gap-2.5">
                            <Layers
                              size={14}
                              className="text-emerald-400 group-hover:text-emerald-300"
                            />
                            <span className="text-xs font-medium text-slate-300 group-hover:text-white">
                              {proj.title}
                            </span>
                          </div>

                          <span className="text-[10px] text-slate-500 transition-colors group-hover:text-emerald-400">
                            Inspect →
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.sender === "bot" && msg.type === "project_single" && (
                    <div className="space-y-2 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs">
                      <p className="text-slate-400">
                        <strong className="text-white">Overview:</strong>{" "}
                        {msg.data.description}
                      </p>

                      {msg.data.longDescription && (
                        <p className="text-slate-400">
                          <strong className="text-white">Details:</strong>{" "}
                          {msg.data.longDescription}
                        </p>
                      )}

                      <p className="text-slate-400">
                        <strong className="text-emerald-400">Stack:</strong>{" "}
                        {msg.data.techStack}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="mr-auto flex max-w-[85%] items-center gap-2.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-slate-900 text-emerald-400">
                  <Cpu size={11} className="animate-spin" />
                </div>

                <div className="flex items-center gap-1 rounded-2xl rounded-tl-none border border-white/5 bg-white/[0.02] px-4 py-2.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400" />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleMessageSubmit(input);
              setInput("");
            }}
            className="flex gap-2 border-t border-white/5 bg-slate-900/40 p-4"
          >
            <input
              type="text"
              disabled={isTyping}
              placeholder={
                isTyping ? "Assistant is thinking..." : "Ask about portfolio..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-emerald-500/30 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="rounded-xl bg-emerald-500 px-4 text-slate-950 transition-all hover:bg-emerald-400 disabled:opacity-20"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIAssistant;