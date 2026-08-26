import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Client Core Viewports
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";

// Administrative Cluster Engine Nodes
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import ManageProjects from "./admin/ManageProjects";
import Messages from "./admin/Messages";
import AdminLayout from "./admin/AdminLayout";
import ProtectedRoute from "./admin/ProtectedRoute";
import ManageBlogs from "./admin/ManageBlogs";
import ManageTestimonials from "./admin/ManageTestimonials";
import ProfileSettings from "./admin/ProfileSettings";
import ManageExperiences from "./admin/ManageExperiences";
import ManageSkills from "./admin/ManageSkills";
import ManageServices from "./admin/ManageServices";

const RouteNotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-[#050811] dark:bg-[#050811] bg-slate-50 text-center p-6 antialiased font-sans transition-colors duration-300">
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.07),transparent_60%)]" />
    <h1 className="text-7xl font-black tracking-tighter text-rose-500/80">404</h1>
    <h2 className="mt-3 text-lg font-bold text-slate-800 dark:text-white uppercase tracking-widest">Route Intercept Failure</h2>
    <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-400 dark:text-slate-500 font-mono">
      The requested endpoint matrix could not be resolved by the virtual routing layout.
    </p>
    <a 
      href="/"
      className="mt-6 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-slate-900/40 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:border-emerald-500/20 hover:bg-emerald-500/10 transition-all"
    >
      Return to Node Matrix
    </a>
  </div>
);

function App() {
  // Sync state with localstorage to persist user configuration
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("admin-theme");
    return savedTheme ? savedTheme === "dark" : true;
  });

  useEffect(() => {
    localStorage.setItem("admin-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div className={darkMode ? "dark" : ""}>
        <Routes>
          {/* Public Portal Endpoint */}
          <Route
            path="/"
            element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />}
          />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />

          {/* Secure Handshake Login Form Gateway */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Secured Micro-Service Subsystem Framework */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                {/* Passing control down using custom layout parameters */}
                <AdminLayout darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            }
          >
            {/* Index Target Maps directly to your advanced AdminDashboard */}
            <Route index element={<AdminDashboard />} />
            
            {/* Dynamic Administration Content Child Segments */}
            <Route path="projects" element={<ManageProjects />} />
            <Route path="messages" element={<Messages />} />
            <Route path="blogs" element={<ManageBlogs />} />
            <Route path="testimonials" element={<ManageTestimonials />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="experiences" element={<ManageExperiences />} />
            <Route path="skills" element={<ManageSkills />} />
            <Route path="services" element={<ManageServices />} />
          </Route>

          {/* Universal Error Fallback Target */}
          <Route path="/404" element={<RouteNotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
