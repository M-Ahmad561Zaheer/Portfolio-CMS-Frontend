import { useEffect, useState } from "react";
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

  const loadProfile = async () => {
    const res = await api.get("/Profile");
    setProfile(res.data);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();

    await api.put("/Profile", profile);

    setStatus("Profile updated successfully.");
    setTimeout(() => setStatus(""), 2500);
  };

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold">Profile Settings</h2>

      {status && (
        <p className="mb-5 rounded-xl bg-emerald-500/10 p-4 text-emerald-400">
          {status}
        </p>
      )}

      <form
        onSubmit={updateProfile}
        className="rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["fullName", "Full Name"],
            ["role", "Role"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["location", "Location"],
            ["githubUrl", "GitHub URL"],
            ["linkedinUrl", "LinkedIn URL"],
            ["resumeUrl", "Resume URL"],
          ].map(([key, placeholder]) => (
            <input
              key={key}
              type="text"
              placeholder={placeholder}
              value={profile[key] || ""}
              onChange={(e) =>
                setProfile({ ...profile, [key]: e.target.value })
              }
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
            />
          ))}

          <textarea
            placeholder="Short Bio"
            value={profile.shortBio || ""}
            onChange={(e) =>
              setProfile({ ...profile, shortBio: e.target.value })
            }
            rows="3"
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400 md:col-span-2"
          />

          <textarea
            placeholder="About"
            value={profile.about || ""}
            onChange={(e) =>
              setProfile({ ...profile, about: e.target.value })
            }
            rows="5"
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400 md:col-span-2"
          />
        </div>

        <button className="mt-5 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-400">
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;