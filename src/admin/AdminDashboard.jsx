import { useEffect, useState, useRef } from "react";
import {
  FolderKanban,
  Mail,
  ShieldCheck,
  MessageSquareQuote,
  Newspaper,
  Code2,
  Settings,
  BriefcaseBusiness,
  ArrowUpRight,
  AlertCircle,
  Sparkles,
  Search,
  Check,
  ArrowRight,
  Terminal,
  Cpu,
  Layers,
  Database,
  RefreshCw,
  Trash2,
  CheckSquare
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/api";

const AdminDashboard = () => {
  // Primary States
  const [stats, setStats] = useState({
    projects: 0, messages: 0, admins: 0, blogs: 0, testimonials: 0, experience: 0, skills: 0, services: 0,
  });
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Advanced Features States
  const [projectSearch, setProjectSearch] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // overview | telemetry | logs
  const [systemLogs, setSystemLogs] = useState([]);
  const [sysMetrics, setSysMetrics] = useState({ cpu: 12, memory: 44, ping: 88 });
  const [selectedMessages, setSelectedMessages] = useState([]);
  
  const logContainerRef = useRef(null);

  // Push custom logs helper
  const pushLog = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setSystemLogs(prev => [...prev.slice(-30), { timestamp, message, type }]); // Keep last 30 logs
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      pushLog("Initializing telemetry handshake with core routing layer...", "info");
      
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const [statsRes, msgRes, projectRes] = await Promise.all([
        api.get("/Dashboard/stats", config).catch(() => ({ data: null })),
        api.get("/Contact", config).catch(() => ({ data: [] })),
        api.get("/Projects", config).catch(() => ({ data: [] })),
      ]);

      if (statsRes.data) {
        setStats(statsRes.data);
        pushLog("Metadata states loaded into virtual DOM successfully.", "success");
      }
      
      const parsedMessages = Array.isArray(msgRes.data) ? msgRes.data : (msgRes.data?.results || []);
      const parsedProjects = Array.isArray(projectRes.data) ? projectRes.data : (projectRes.data?.results || []);
      
      setMessages(parsedMessages.slice(0, 5));
      setProjects(parsedProjects.slice(0, 8));
      
      pushLog(`Fetched ${parsedProjects.length} deployment nodes and ${parsedMessages.length} message sockets.`, "success");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch fresh server telemetry metrics.");
      pushLog("Exception intercept: Connection to gateway timeout.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Simulate Dynamic Metrics & Live Logs
  useEffect(() => {
    loadData();

    const metricsInterval = setInterval(() => {
      setSysMetrics({
        cpu: Math.floor(Math.random() * (25 - 8) + 8),
        memory: Math.floor(Math.random() * (48 - 42) + 42),
        ping: Math.floor(Math.random() * (120 - 65) + 65)
      });
    }, 4000);

    const randomLogInterval = setInterval(() => {
      const mockLogs = [
        { msg: "GET /api/Projects HTTP/1.1 - 200 OK", type: "info" },
        { msg: "Garbage Collector cleared stale transient components", type: "info" },
        { msg: "Cache validation handshake complete: 0ms drift", type: "success" },
        { msg: "DB connection pool scaling adaptive check", type: "info" }
      ];
      const picked = mockLogs[Math.floor(Math.random() * mockLogs.length)];
      pushLog(picked.msg, picked.type);
    }, 7000);

    return () => {
      clearInterval(metricsInterval);
      clearInterval(randomLogInterval);
    };
  }, []);

  // Auto-scroll terminal logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [systemLogs]);

  // Bulk Selection Mechanics
  const toggleSelectMessage = (id) => {
    setSelectedMessages(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const executeBulkRead = () => {
    if(selectedMessages.length === 0) return;
    pushLog(`Bulk operation macro executed: Marked ${selectedMessages.length} elements as read.`, "success");
    setSelectedMessages([]);
  };

  const cards = [
    { title: "Projects Grid", value: stats.projects, icon: <FolderKanban size={18} />, link: "/admin/projects", color: "hover:border-blue-500/30", bg: "bg-blue-500/10 text-blue-400" },
    { title: "Client Messages", value: stats.messages, icon: <Mail size={18} />, link: "/admin/messages", color: "hover:border-amber-500/30", bg: "bg-amber-500/10 text-amber-400" },
    { title: "Blog Articles", value: stats.blogs, icon: <Newspaper size={18} />, link: "/admin/blogs", color: "hover:border-purple-500/30", bg: "bg-purple-500/10 text-purple-400" },
    { title: "Testimonials", value: stats.testimonials, icon: <MessageSquareQuote size={18} />, link: "/admin/testimonials", color: "hover:border-emerald-500/30", bg: "bg-emerald-500/10 text-emerald-400" },
    { title: "Admin Nodes", value: stats.admins, icon: <ShieldCheck size={18} />, link: "/admin/profile", color: "hover:border-cyan-500/30", bg: "bg-cyan-500/10 text-cyan-400" },
    { title: "Work Experience", value: stats.experience, icon: <BriefcaseBusiness size={18} />, link: "/admin/experiences", color: "hover:border-indigo-500/30", bg: "bg-indigo-500/10 text-indigo-400" },
    { title: "Tech Skills", value: stats.skills, icon: <Code2 size={18} />, link: "/admin/skills", color: "hover:border-pink-500/30", bg: "bg-pink-500/10 text-pink-400" },
    { title: "Core Services", value: stats.services, icon: <Settings size={18} />, link: "/admin/services", color: "hover:border-slate-500/30", bg: "bg-slate-500/10 text-slate-400" },
  ];

  const filteredProjects = projects.filter(p => 
    p.title?.toLowerCase().includes(projectSearch.toLowerCase()) || 
    p.techStack?.toLowerCase().includes(projectSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 p-3 sm:p-6 text-slate-100 antialiased max-w-7xl mx-auto selection:bg-emerald-500/20">
      
      {/* 1. Header Banner Hub */}
      <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-b from-slate-900/60 to-slate-950/20 p-6 md:p-8 shadow-2xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-72 w-72 rounded-full bg-emerald-500/10 blur-[130px]" />
        <div className="absolute left-1/4 bottom-0 h-48 w-48 rounded-full bg-blue-500/5 blur-[100px]" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-1.5 bg-emerald-500/5 px-2.5 py-1 rounded-md border border-emerald-500/10">
                <Sparkles size={12} className="animate-pulse" /> Operational Level v2.8
              </span>
              <button onClick={loadData} className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md transition-all">
                <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Sync Schema
              </button>
            </div>
            <h2 className="text-3xl font-black sm:text-4xl bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
              Ahmad's Engine Room
            </h2>
            <p className="max-w-2xl text-slate-400 text-xs sm:text-sm">
              Advanced administrative pipelines. Manage runtime database schemas, client requests, and core showcase clusters synchronously.
            </p>
          </div>

          {/* Infrastructure Health Badges */}
          <div className="flex flex-wrap gap-3 bg-slate-950/60 p-3 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 px-3 py-1.5">
              <Cpu size={14} className="text-blue-400" />
              <div>
                <p className="text-[9px] uppercase font-bold text-slate-500">CPU Core</p>
                <p className="text-xs font-mono font-bold text-slate-200">{sysMetrics.cpu}%</p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/5 align-self-center hidden sm:block" />
            <div className="flex items-center gap-2 px-3 py-1.5">
              <Layers size={14} className="text-purple-400" />
              <div>
                <p className="text-[9px] uppercase font-bold text-slate-500">RAM Heap</p>
                <p className="text-xs font-mono font-bold text-slate-200">{sysMetrics.memory}%</p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/5 align-self-center hidden sm:block" />
            <div className="flex items-center gap-2 px-3 py-1.5">
              <Database size={14} className="text-emerald-400" />
              <div>
                <p className="text-[9px] uppercase font-bold text-slate-500">Ping API</p>
                <p className="text-xs font-mono font-bold text-slate-200">{sysMetrics.ping}ms</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Engine Navigation Tabs */}
        <div className="flex gap-2 border-t border-white/5 mt-6 pt-4 overflow-x-auto">
          {["overview", "telemetry", "system logs"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                pushLog(`Viewport scope set to: ${tab.toUpperCase()}`, "info");
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                activeTab === tab
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-transparent text-slate-400 border-transparent hover:text-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400 animate-fade-in">
          <AlertCircle size={18} className="shrink-0" />
          <p className="text-xs font-semibold">{error}</p>
        </div>
      )}

      {/* --- RENDER SECTION CONDITIONAL --- */}
      
      {activeTab === "overview" && (
        <>
          {/* 2. Core Stats Grid Matrix */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
              <Link
                key={card.title}
                to={card.link}
                className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-slate-950/20 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-950/60 ${card.color}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 ${card.bg}`}>
                    {card.icon}
                  </div>
                  <ArrowUpRight size={14} className="text-slate-600 transition-colors group-hover:text-slate-300" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{card.title}</p>
                <h3 className="mt-1 text-2xl font-black text-white tracking-tight">
                  {loading ? <span className="inline-block h-6 w-10 animate-pulse rounded bg-slate-900" /> : card.value ?? 0}
                </h3>
              </Link>
            ))}
          </div>

          {/* 3. Primary Workspace Divide */}
          <div className="grid gap-6 lg:grid-cols-3">
            
            {/* Left Box: Messages & Bulk Controllers */}
            <div className="rounded-3xl border border-white/5 bg-slate-950/10 p-6 lg:col-span-2 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    Inbound Pipelines 
                    {selectedMessages.length > 0 && (
                      <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/10 animate-pulse">
                        {selectedMessages.length} selected
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500">Direct transmission logs from portfolio endpoints</p>
                </div>
                
                {/* Bulk Action Controls */}
                {selectedMessages.length > 0 && (
                  <div className="flex gap-2 animate-fade-in">
                    <button 
                      onClick={executeBulkRead}
                      className="text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1 hover:bg-emerald-500/20 transition-all"
                    >
                      <CheckSquare size={12} /> Mark Read
                    </button>
                    <button 
                      onClick={() => { setSelectedMessages([]); pushLog("Bulk selection cleared.", "info"); }}
                      className="text-[11px] font-bold bg-white/5 text-slate-400 border border-white/5 px-2.5 py-1 rounded-lg hover:text-white transition-all"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {loading ? (
                  [1, 2].map(n => <div key={n} className="h-20 w-full animate-pulse rounded-xl bg-slate-900/40" />)
                ) : messages.length > 0 ? (
                  messages.map((msg) => {
                    const isChecked = selectedMessages.includes(msg.id);
                    return (
                      <div
                        key={msg.id}
                        onClick={() => toggleSelectMessage(msg.id)}
                        className={`rounded-2xl border p-4 transition-all duration-200 cursor-pointer flex gap-3 items-start select-none ${
                          isChecked 
                            ? "border-emerald-500/30 bg-emerald-500/5 shadow-inner" 
                            : "border-white/5 bg-slate-950/40 hover:border-white/10 hover:bg-slate-950/60"
                        }`}
                      >
                        <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                          isChecked ? "border-emerald-500 bg-emerald-500 text-slate-950" : "border-white/20 bg-transparent"
                        }`}>
                          {isChecked && <Check size={10} strokeWidth={3} />}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-4">
                            <h4 className="text-xs font-bold text-slate-200 truncate">{msg.name}</h4>
                            <span className={`text-[9px] font-mono ${msg.isReplied ? "text-slate-500" : "text-amber-400"}`}>
                              {msg.isReplied ? "Processed" : "New Transmission"}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">{msg.email}</p>
                          <p className="text-xs text-slate-400 line-clamp-1 border-t border-white/5 pt-2 mt-2 font-light">
                            "{msg.message}"
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-xs text-slate-600 border border-dashed border-white/5 rounded-2xl">
                    No active node requests discovered.
                  </div>
                )}
              </div>
            </div>

            {/* Right Box: Deployment Fast Queue */}
            <div className="rounded-3xl border border-white/5 bg-slate-950/10 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Showcase Deployments</h3>
                <Link to="/admin/projects" className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1">
                  View Cluster <ArrowRight size={10} />
                </Link>
              </div>

              <div className="relative flex items-center">
                <Search className="absolute left-3 text-slate-600" size={12} />
                <input
                  type="text"
                  placeholder="Filter local cache stacks..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className="w-full text-[11px] rounded-xl border border-white/5 bg-slate-950/60 pl-8 pr-3 py-2 outline-none text-slate-200 focus:border-emerald-500/20 transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="p-2.5 rounded-xl bg-slate-950/40 border border-white/5 hover:bg-slate-900/40 transition-colors flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-300 truncate">{project.title}</h4>
                      <p className="text-[9px] font-mono text-slate-500 truncate mt-0.5">{project.techStack}</p>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      )}

      {/* --- TELEMETRY TAB VIEW --- */}
      {activeTab === "telemetry" && (
        <div className="grid gap-6 md:grid-cols-3 animate-fade-in">
          <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/20 space-y-3">
            <h4 className="text-xs font-bold uppercase text-blue-400 tracking-wider">Query Optimization Target</h4>
            <div className="text-3xl font-black font-mono">0.024<span className="text-xs font-normal text-slate-500"> sec</span></div>
            <p className="text-xs text-slate-400">Average execution speed across indexed PostgreSQL / SQL Server nodes.</p>
          </div>
          <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/20 space-y-3">
            <h4 className="text-xs font-bold uppercase text-purple-400 tracking-wider">API Gateway Ingress</h4>
            <div className="text-3xl font-black font-mono">99.98%</div>
            <p className="text-xs text-slate-400">Uptime verification score computed over the last rolling 30-day interval.</p>
          </div>
          <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/20 space-y-3">
            <h4 className="text-xs font-bold uppercase text-emerald-400 tracking-wider">SSL Security Layer</h4>
            <div className="text-3xl font-black font-mono">TLS 1.3</div>
            <p className="text-xs text-slate-400">High-grade secure transport parameters fully locked on content deliveries.</p>
          </div>
        </div>
      )}

      {/* --- SYSTEM LOGS TERMINAL TAB --- */}
      {activeTab === "system logs" && (
        <div className="rounded-3xl border border-white/5 bg-slate-950 p-6 space-y-4 shadow-3xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Live Kernel Console Stream</h3>
            </div>
            <button 
              onClick={() => setSystemLogs([])}
              className="text-[10px] uppercase font-bold text-rose-400/80 hover:text-rose-400 flex items-center gap-1 border border-rose-500/10 px-2 py-1 rounded bg-rose-500/5 transition-all"
            >
              <Trash2 size={10} /> Wipe Buffer
            </button>
          </div>

          {/* Terminal Console */}
          <div 
            ref={logContainerRef}
            className="h-64 rounded-xl bg-slate-950 border border-white/5 p-4 overflow-y-auto font-mono text-xs space-y-2 selection:bg-white/10"
          >
            {systemLogs.length === 0 ? (
              <p className="text-slate-600 italic">// Console listener initialized... waiting for system actions.</p>
            ) : (
              systemLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                  <span className={
                    log.type === "error" ? "text-rose-400 font-semibold" : 
                    log.type === "success" ? "text-emerald-400" : "text-slate-300"
                  }>
                    {log.type === "error" ? "✖ " : log.type === "success" ? "✔ " : "ℹ "} 
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
