import { useEffect, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import api from "../api/api";

const Contact = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const loadProfile = async () => {
    try {
      const res = await api.get("/Profile");
      setProfile(res.data);
    } catch {
      setProfile(null);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const submitMessage = async (e) => {
    e.preventDefault();

    try {
      await api.post("/Contact", form);
      setStatus("Message sent successfully.");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("Something went wrong.");
    }
  };

  return (
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500 dark:text-emerald-400">
            Contact
          </p>

          <h2 className="text-3xl font-bold text-slate-950 dark:text-white md:text-5xl">
            Let&apos;s Build Something Great
          </h2>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-6">
            {[
              {
                icon: <Mail className="mb-3 text-emerald-500 dark:text-emerald-400" />,
                title: "Email",
                value: profile?.email || "your-email@example.com",
              },
              {
                icon: <Phone className="mb-3 text-emerald-500 dark:text-emerald-400" />,
                title: "Phone",
                value: profile?.phone || "+92 300 0000000",
              },
              {
                icon: <MapPin className="mb-3 text-emerald-500 dark:text-emerald-400" />,
                title: "Location",
                value: profile?.location || "Pakistan",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
              >
                {item.icon}
                <h3 className="font-semibold text-slate-950 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <form
            onSubmit={submitMessage}
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/5"
          >
            {status && (
              <p className="mb-4 rounded-xl bg-emerald-500/10 p-3 text-emerald-500 dark:text-emerald-400">
                {status}
              </p>
            )}

            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mb-5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-slate-950 dark:text-white"
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mb-5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-slate-950 dark:text-white"
              required
            />

            <textarea
              rows="5"
              placeholder="Write your message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mb-5 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-slate-950 dark:text-white"
              required
            />

            <button className="w-full rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-400">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;