import { useEffect, useState } from "react";
import {
  Globe,
  Smartphone,
  Database,
  Settings,
  Code2,
  Server,
} from "lucide-react";
import api from "../api/api";

const iconMap = {
  globe: <Globe />,
  smartphone: <Smartphone />,
  database: <Database />,
  settings: <Settings />,
  code: <Code2 />,
  server: <Server />,
};

const Services = () => {
  const [services, setServices] = useState([]);

  const fetchServices = async () => {
    const res = await api.get("/Services");
    setServices(res.data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <section id="services" className="bg-white px-6 py-24 dark:bg-slate-900/50">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500 dark:text-emerald-400">
            Services
          </p>

          <h2 className="text-3xl font-bold text-slate-950 dark:text-white md:text-5xl">
            What I Can Help You Build
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm transition hover:border-emerald-400 dark:border-white/10 dark:bg-slate-950"
            >
              <div className="mb-5 text-emerald-500 dark:text-emerald-400">
                {iconMap[service.iconName] || <Globe />}
              </div>

              <h3 className="mb-3 text-xl font-semibold text-slate-950 dark:text-white">
                {service.title}
              </h3>

              <p className="text-slate-600 dark:text-slate-400">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <p className="text-center text-slate-600 dark:text-slate-400">
            No services added yet.
          </p>
        )}
      </div>
    </section>
  );
};

export default Services;