import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Services from "../components/Services";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Timeline from "../components/Timeline";
import Stats from "../components/Stats";
import Blog from "../components/Blog";
import Testimonials from "../components/Testimonials";
import AIAssistant from "../components/AIAssistant";

const Home = ({ darkMode, setDarkMode }) => {
  return (
    <main className="min-h-screen bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <Hero />

        <Stats />

        <About />

        <Skills />

        <Services />

        <Projects />

        <Timeline />

        <Testimonials />

        <Blog />

        <Contact />

        <Footer />

        <AIAssistant />
    </main>
  );
};

export default Home;