import { useEffect, useState } from "react";
import { Reply, MessageSquare } from "lucide-react";
import api from "../api/api";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const getHeadersConfig = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Contact", getHeadersConfig());
      setMessages(res.data || []);
    } catch {
      console.error(err);
      setStatus("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const sendReply = async (id) => {
    if (!replyText.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setStatus("");
    try {
      await api.post(`/Contact/${id}/reply`, { replyMessage: replyText }, getHeadersConfig());
      setStatus("Reply sent successfully.");
      setMessages((prev) => prev.map((msg) => msg.id === id ? { ...msg, isReplied: true, replyMessage: replyText } : msg));
      setReplyingId(null);
      setReplyText("");
      setTimeout(() => setStatus(""), 4000);
    } catch {
      setStatus("Failed to send reply.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMessages = messages
    .filter((msg) => (activeTab === "pending" ? !msg.isReplied : activeTab === "replied" ? msg.isReplied : true))
    .filter((msg) => (msg.name + msg.email + msg.message).toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6 p-2 sm:p-4 md:p-6 text-slate-900 dark:text-slate-100 antialiased max-w-6xl mx-auto transition-colors duration-300">
      
      {/* 1. Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-black p-6 md:p-8 shadow-2xl">
        <div className="absolute right-0 top-0 -mr-12 -mt-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="relative z-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <MessageSquare size={14} /> Live Client Communications
          </p>
          <h2 className="text-2xl font-extrabold sm:text-3xl md:text-4xl text-slate-900 dark:text-white">Contact Inbox</h2>
        </div>
      </div>

      {/* 2. Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-950 p-1 rounded-xl border border-slate-300 dark:border-white/5 overflow-x-auto">
          {["all", "pending", "replied"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab ? "bg-white dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm" : "text-slate-500"}`}>
              {tab}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-white/5 text-slate-900 dark:text-slate-200 text-xs sm:text-sm outline-none focus:border-emerald-500"
        />
      </div>

      {/* 3. Messages Stack */}
      <div className="space-y-4">
        {filteredMessages.map((msg) => (
          <div key={msg.id} className="group rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/10 p-6 hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{msg.name}</h3>
                <a href={`mailto:${msg.email}`} className="text-xs text-emerald-600 dark:text-emerald-400">{msg.email}</a>
                <p className="text-slate-600 dark:text-slate-300 text-sm pt-2">{msg.message}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${msg.isReplied ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"}`}>
                {msg.isReplied ? "Replied" : "Pending"}
              </span>
            </div>
            
            {replyingId === msg.id ? (
               <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5">
                 <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} className="w-full p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-slate-200 text-sm mb-2" rows="3" />
                 <div className="flex gap-2">
                    <button onClick={() => sendReply(msg.id)} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold uppercase">Send</button>
                    <button onClick={() => setReplyingId(null)} className="px-4 py-2 rounded-lg border text-slate-500 text-xs font-bold uppercase">Cancel</button>
                 </div>
               </div>
            ) : !msg.isReplied && (
              <button onClick={() => setReplyingId(msg.id)} className="mt-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <Reply size={14} /> Write Reply
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
