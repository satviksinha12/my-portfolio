import { useParams, Link } from 'react-router-dom';
import storage from '../../utils/storage';
import './Detail.css';

export default function ProjectDetail() {
  const { id } = useParams();
  const project = storage.getProjects().find(p => p.id === id);

  if (!project) return <div className="detail-page"><p className="empty">Project not found. <Link to="/">Go back</Link></p></div>;

  return (
    <div className="detail-page">
      <nav className="detail-nav">
        <Link to="/" className="back-link">&larr; Back to portfolio</Link>
      </nav>
      <article className="detail-content">
        {project.thumbnail && <img src={project.thumbnail} alt={project.title} className="detail-hero-img" />}
        <div className="detail-meta">
          {project.category && <span className="tag">{project.category}</span>}
          {(project.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <h1>{project.title}</h1>
        {project.description && <p className="detail-desc">{project.description}</p>}
        <div className="detail-links">
          {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn" onClick={() => storage.trackClick('live', project.title)}>Live Demo</a>}
          {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline" onClick={() => storage.trackClick('repo', project.title)}>Source Code</a>}
        </div>
        {project.content && <div className="detail-body" dangerouslySetInnerHTML={{ __html: project.content }} />}
      </article>
    </div>
  );
}
