import { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Github, Linkedin, FileText, Briefcase, Sparkles, Loader2, Save, AlertCircle } from "lucide-react";
import api from "../api/api";

const emptyProfile = {
  fullName: "",
  role: "",
  shortBio: "",
  about: "",
  email: "",
  phone: "",
  location: "",
  githubUrl: "",
  linkedinUrl: "",
  resumeUrl: "",
};

const ProfileSettings = () => {
  const [profile, setProfile] = useState(emptyProfile);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Secure API Call configurations
  const getHeadersConfig = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Profile", getHeadersConfig());
      setProfile(res.data || emptyProfile);
    } catch (err) {
      console.error("Error fetching profile details:", err);
      setStatus("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    try {
      await api.put("/Profile", profile, getHeadersConfig());
      setStatus("Profile updated successfully.");
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      console.error("Error updating profile details:", err);
      setStatus("Failed to update profile settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputFields = [
    { key: "fullName", label: "Full Name", icon: <User size={16} />, type: "text" },
    { key: "role", label: "Professional Role", icon: <Briefcase size={16} />, type: "text" },
    { key: "email", label: "Public Contact Email", icon: <Mail size={16} />, type: "email" },
    { key: "phone", label: "Phone Number", icon: <Phone size={16} />, type: "text" },
    { key: "location", label: "Location", icon: <MapPin size={16} />, type: "text" },
    { key: "githubUrl", label: "GitHub Profile Link", icon: <Github size={16} />, type: "url" },
    { key: "linkedinUrl", label: "LinkedIn Profile Link", icon: <Linkedin size={16} />, type: "url" },
    { key: "resumeUrl", label: "Resume / CV Document Link", icon: <FileText size={16} />, type: "url" },
  ];

  return (
    <div className="space-y-6 p-2 sm:p-4 md:p-6 text-slate-100 antialiased max-w-5xl mx-auto">
      
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-6 md:p-8 shadow-2xl">
        <div className="absolute right-0 top-0 -mr-12 -mt-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />
        
        <div className="relative z-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-emerald-400 flex items-center gap-2">
            <User size={14} className="animate-pulse" /> Identity Management
          </p>
          <h2 className="text-2xl font-extrabold sm:text-3xl md:text-4xl bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Profile Settings
          </h2>
          <p className="mt-2 max-w-xl text-slate-400 text-xs sm:text-sm">
            Control your primary meta data, socials, resume documentation, and core professional about descriptions.
          </p>
        </div>
      </div>

      {/* Alert Banner */}
      {status && (
        <div className={`flex items-center gap-3 p-4 rounded-2xl border animate-fade-in ${
          status.includes("successfully") 
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
            : "bg-rose-500/10 border-rose-500/20 text-rose-400"
        }`}>
          <AlertCircle size={18} className="shrink-0" />
          <p className="font-medium text-xs sm:text-sm">{status}</p>
        </div>
      )}

      {/* 2. Setup Loading Placeholder */}
      {loading ? (
        <div className="rounded-2xl border border-white/5 bg-slate-900/10 p-12 text-center flex flex-col items-center justify-center space-y-3">
          <Loader2 className="animate-spin text-emerald-400" size={32} />
          <p className="text-sm text-slate-500">Retrieving secure portfolio parameters...</p>
        </div>
      ) : (
        /* 3. Main Modern Form Layout */
        <form onSubmit={updateProfile} className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-slate-900/30 p-6 md:p-8 backdrop-blur-md space-y-6 shadow-xl">
            
            {/* Split Section: Core Metrics */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-5 flex items-center gap-2">
                <Sparkles size={14} className="text-emerald-400" /> General & Social Coordinates
              </h3>

              <div className="grid gap-5 sm:grid-cols-2">
                {inputFields.map(({ key, label, icon, type }) => (
                  <div key={key} className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      {icon} {label}
                    </label>
                    <input
                      type={type}
                      placeholder={`Enter ${label.toLowerCase()}...`}
                      value={profile[key] || ""}
                      disabled={isSubmitting}
                      onChange={(e) =>
                        setProfile({ ...profile, [key]: e.target.value })
                      }
                      className="w-full text-xs sm:text-sm rounded-xl border border-white/5 bg-slate-950/60 px-4 py-3 outline-none text-slate-200 focus:border-emerald-500/40 focus:bg-slate-950 transition-all placeholder:text-slate-700 disabled:opacity-50"
                    />
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-white/5" />

            {/* Split Section: Biographical Texts */}
            <div className="space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <FileText size={14} className="text-emerald-400" /> Introductory Narratives
              </h3>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Short Catchy Bio
                  </label>
                  <textarea
                    placeholder="Describe yourself in one short punchy line..."
                    value={profile.shortBio || ""}
                    disabled={isSubmitting}
                    onChange={(e) =>
                      setProfile({ ...profile, shortBio: e.target.value })
                    }
                    rows="2"
                    className="w-full text-xs sm:text-sm rounded-xl border border-white/5 bg-slate-950/60 px-4 py-3 outline-none text-slate-200 focus:border-emerald-500/40 focus:bg-slate-950 transition-all placeholder:text-slate-700 disabled:opacity-50 resize-y"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Full Narrative (About Me)
                  </label>
                  <textarea
                    placeholder="Write a thorough summary of your professional journey, stack capabilities, and interests..."
                    value={profile.about || ""}
                    disabled={isSubmitting}
                    onChange={(e) =>
                      setProfile({ ...profile, about: e.target.value })
                    }
                    rows="6"
                    className="w-full text-xs sm:text-sm rounded-xl border border-white/5 bg-slate-950/60 px-4 py-3 outline-none text-slate-200 focus:border-emerald-500/40 focus:bg-slate-950 transition-all placeholder:text-slate-700 disabled:opacity-50 resize-y"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Form Action Controls */}
          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  Saving updates...
                </>
              ) : (
                <>
                  <Save size={14} className="stroke-[2.5]" />
                  Save Profile Configuration
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileSettings;