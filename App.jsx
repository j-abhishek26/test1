import React, { useEffect, useState } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";

const API = (import.meta.env.VITE_API_URL || "http://localhost:5000/api")
  .replace(/\/$/, "");

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadProjects() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/projects`);
      if (!res.ok) throw new Error("Could not load projects");
      setProjects(await res.json());
    } catch (e) {
      setError(e.message + ". Check backend and API URL.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadProjects(); }, []);

  async function addProject(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not add project");
      setName("");
      setDescription("");
      setStatus("Pending");
      await loadProjects();
    } catch (e) {
      setError(e.message);
    }
  }

  async function deleteProject(id) {
    if (!window.confirm("Delete this project?")) return;
    try {
      const res = await fetch(`${API}/projects/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      await loadProjects();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main className="container">
      <header>
        <p className="eyebrow">FULL STACK DEVELOPMENT</p>
        <h1>Project Management</h1>
        <p className="muted">Create, view and manage project records.</p>
      </header>

      <section className="panel">
        <h2>Add Project</h2>
        <form onSubmit={addProject}>
          <label>Project name
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="AI Project" required />
          </label>
          <label>Description
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Project description" rows="2" />
          </label>
          <label>Status
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </label>
          <button type="submit">Add Project</button>
        </form>
      </section>

      <section className="panel">
        <div className="heading">
          <h2>Project List</h2>
          <button className="secondary" onClick={loadProjects}>Refresh</button>
        </div>
        {error && <p className="error">{error}</p>}
        {loading ? <p>Loading...</p> : projects.length === 0
          ? <p>No projects found. Add one above.</p>
          : projects.map(p => (
            <article className="project" key={p._id}>
              <div>
                <h3><Link to={`/projects/${p._id}`}>{p.name}</Link></h3>
                <p className="muted">{p.description || "No description"}</p>
                <span className="status">{p.status}</span>
              </div>
              <button className="danger" onClick={() => deleteProject(p._id)}>Delete</button>
            </article>
          ))}
      </section>
    </main>
  );
}

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/projects/${id}`)
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Project not found");
        return data;
      })
      .then(setProject)
      .catch(e => setError(e.message));
  }, [id]);

  return (
    <main className="container">
      <Link to="/">← Back to projects</Link>
      <section className="panel">
        <h1>Project Details</h1>
        {error && <p className="error">{error}</p>}
        {!project && !error && <p>Loading...</p>}
        {project && <>
          <h2>{project.name}</h2>
          <p>{project.description || "No description"}</p>
          <p>Status: <strong>{project.status}</strong></p>
          <p>Project ID: {project._id}</p>
        </>}
      </section>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ProjectList />} />
      <Route path="/projects/:id" element={<ProjectDetails />} />
      <Route path="*" element={<main className="container"><h1>Page not found</h1><Link to="/">Home</Link></main>} />
    </Routes>
  );
}
