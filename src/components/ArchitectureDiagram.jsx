import { ArrowRight, Code2, Database, Server, ShieldCheck } from "lucide-react";

const layers = [
  { icon: Code2, label: "Presentation", title: "React Frontend", stack: "React · Vite · Tailwind CSS", description: "A responsive portfolio for visitors and a dedicated dashboard for managing content.", details: ["Reusable components and page routing", "Axios requests to the REST API", "Admin forms for projects, experience and education"] },
  { icon: Server, label: "Application", title: "ASP.NET Core API", stack: "C# · REST endpoints · JWT", description: "Controllers handle requests, validate incoming data and control access to content updates.", details: ["Public endpoints serve portfolio content", "JWT authentication protects admin operations", "Create, read, update and delete workflows"] },
  { icon: Database, label: "Persistence", title: "PostgreSQL", stack: "Entity Framework Core · Npgsql", description: "Portfolio content is stored in relational tables and accessed through a shared database context.", details: ["EF Core maps C# models to database tables", "Async queries load and save content", "Schema updates support new content fields"] },
];

export default function ArchitectureDiagram() {
  return <div className="architecture-diagram">
    <div className="architecture-layers">
      {layers.map(({ icon: Icon, label, title, stack, description, details }, index) => <article className="architecture-layer" key={title}>
        <div className="architecture-layer-top"><span className="architecture-icon"><Icon aria-hidden="true"/></span><span className="architecture-step">0{index + 1} / {label}</span></div>
        <h3>{title}</h3><p className="architecture-stack">{stack}</p>
        <p className="architecture-description">{description}</p>
        <ul>{details.map(detail => <li key={detail}>{detail}</li>)}</ul>
        {index < layers.length - 1 && <span className="architecture-connector" aria-hidden="true"><ArrowRight/></span>}
      </article>)}
    </div>
    <div className="architecture-request"><div><span className="architecture-caption">A request, end to end</span><h3>From a click to saved content</h3></div><ol><li>React sends a request</li><li>API validates & authorizes</li><li>EF Core reads / writes data</li><li>JSON response updates the UI</li></ol></div>
    <p className="architecture-security"><ShieldCheck aria-hidden="true"/><span>Visitors can browse public content. Admin changes require a valid authentication token.</span></p>
  </div>;
}
