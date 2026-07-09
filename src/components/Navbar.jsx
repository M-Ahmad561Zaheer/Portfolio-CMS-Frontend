import { Menu, X, Moon, Sun } from "lucide-react";
import { useState } from "react";

const Navbar = ({ darkMode, setDarkMode }) => {
  const [open, setOpen] = useState(false);

  const navLinks = [
    "Home",
    "About",
    "Skills",
    "Services",
    "Projects",
    "Experience",
    "Testimonials",
    "Blog",
    "Contact",
  ];

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#home" className="text-xl font-bold tracking-wide text-slate-950 dark:text-white">
          Ahmad<span className="text-emerald-500 dark:text-emerald-400">.dev</span>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm text-slate-600 transition hover:text-emerald-500 dark:text-slate-300 dark:hover:text-emerald-400"
            >
              {link}
            </a>
          ))}

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-xl border border-slate-300 p-2 text-slate-700 dark:border-white/10 dark:text-white"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="text-slate-900 dark:text-white md:hidden"
          aria-label="Toggle Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white px-6 py-4 dark:border-white/10 dark:bg-slate-950 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="block py-3 text-slate-600 hover:text-emerald-500 dark:text-slate-300 dark:hover:text-emerald-400"
            >
              {link}
            </a>
          ))}

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="mt-3 rounded-xl border border-slate-300 p-2 text-slate-700 dark:border-white/10 dark:text-white"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;