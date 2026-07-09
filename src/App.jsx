import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
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


function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <BrowserRouter>
      <div className={darkMode ? "dark" : ""}>
        <Routes>
          <Route
            path="/"
            element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />}
          />

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<ManageProjects />} />
            <Route path="messages" element={<Messages />} />
            <Route path="blogs" element={<ManageBlogs />} />
            <Route path="testimonials" element={<ManageTestimonials />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="experiences" element={<ManageExperiences />} />
            <Route path="skills" element={<ManageSkills />} />
            <Route path="services" element={<ManageServices />} />
            
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;