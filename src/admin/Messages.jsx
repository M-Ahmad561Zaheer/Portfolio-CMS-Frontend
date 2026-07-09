import { useEffect, useState } from "react";
import { Mail, Reply, CheckCircle, Loader2 } from "lucide-react"; // Loader2 icon add kiya hy
import api from "../api/api";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // New Loading State

  const fetchMessages = async () => {
    try {
      const res = await api.get("/Contact");
      setMessages(res.data);
    } catch {
      setStatus("Failed to load messages.");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const sendReply = async (id) => {
    if (!replyText.trim() || isSubmitting) return;

    setIsSubmitting(true); // Button ko foran disable aur loading state mein laane k liye
    setStatus("");

    try {
      await api.post(`/Contact/${id}/reply`, {
        replyMessage: replyText,
      });

      setStatus("Reply sent successfully.");
      
      // Optimistic/Local State Update: Bina database ko dobara fetch kiye UI update karo (No network lag)
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === id
            ? { ...msg, isReplied: true, replyMessage: replyText }
            : msg
        )
      );

      setReplyingId(null);
      setReplyText("");

      setTimeout(() => setStatus(""), 2500);
    } catch {
      setStatus("Failed to send reply.");
    } finally {
      setIsSubmitting(false); // Request complete hone par loading khatam
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold">Contact Messages</h2>

      {status && (
        <p className="mb-5 rounded-xl bg-emerald-500/10 p-4 text-emerald-400">
          {status}
        </p>
      )}

      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id} // Perfect, database ki unique ID use ho rahi hy (Duplicate key error nahi aayega)
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-start">
              <div>
                <h3 className="text-xl font-bold">{msg.name}</h3>

                <a
                  href={`mailto:${msg.email}`}
                  className="flex items-center gap-2 text-emerald-400 width-fit"
                >
                  <Mail size={16} />
                  {msg.email}
                </a>

                <p className="mt-3 text-slate-300">{msg.message}</p>

                <p className="mt-3 text-sm text-slate-500">
                  {new Date(msg.createdAt).toLocaleString()}
                </p>
              </div>

              {msg.isReplied ? (
                <span className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
                  <CheckCircle size={16} />
                  Replied
                </span>
              ) : (
                <span className="rounded-full bg-yellow-500/10 px-4 py-2 text-sm text-yellow-400">
                  Pending
                </span>
              )}
            </div>

            {msg.isReplied && (
              <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="mb-2 text-sm font-semibold text-emerald-400">
                  Your Reply:
                </p>
                <p className="text-slate-300">{msg.replyMessage}</p>
              </div>
            )}

            {replyingId === msg.id ? (
              <div className="mt-5">
                <textarea
                  rows="5"
                  placeholder="Write your reply..."
                  value={replyText}
                  disabled={isSubmitting}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400 disabled:opacity-50"
                />

                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => sendReply(msg.id)}
                    disabled={isSubmitting || !replyText.trim()}
                    className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Sending...
                      </>
                    ) : (
                      "Send Reply"
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setReplyingId(null);
                      setReplyText("");
                    }}
                    disabled={isSubmitting}
                    className="rounded-xl border border-white/10 px-5 py-3 text-slate-300 hover:border-red-400 hover:text-red-400 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Agr pehle se reply ho chuka hy toh button dubara show karne ki zaroorat nahi
              !msg.isReplied && (
                <button
                  onClick={() => {
                    setReplyingId(msg.id);
                    setReplyText("");
                  }}
                  className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  <Reply size={18} />
                  Reply
                </button>
              )
            )}
          </div>
        ))}

        {messages.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-400">
            No messages found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Messages;