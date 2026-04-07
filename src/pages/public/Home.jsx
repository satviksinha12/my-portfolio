import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../utils/ThemeContext';
import storage from '../../utils/storage';
import './Home.css';

export default function Home() {
  const { theme } = useTheme();
  const profile = storage.getProfile();
  const projects = storage.getProjects().filter(p => p.published !== false);
  const posts = storage.getPosts().filter(p => p.published !== false);
  const categories = [...new Set(projects.map(p => p.category).filter(Boolean))];
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => { storage.trackView('/'); }, []);

  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  return (
    <div className="home">
      {/* Navbar */}
      <Nav title={theme.navTitle || profile.name || 'Portfolio'} />

      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero-glow" />
        <h1 className="hero-title">{theme.heroTitle || `Hi, I'm ${profile.name || 'a Developer'}`}</h1>
        <p className="hero-subtitle">{theme.heroSubtitle}</p>
        <div className="hero-social">
          {theme.socialGithub && <SocialIcon href={theme.socialGithub} label="github" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />}
          {theme.socialLinkedin && <SocialIcon href={theme.socialLinkedin} label="linkedin" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />}
          {theme.socialTwitter && <SocialIcon href={theme.socialTwitter} label="twitter" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />}
          {theme.socialEmail && (
            <a href={`mailto:${theme.socialEmail}`} className="social-link" title="Email">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </a>
          )}
        </div>
        <div className="hero-cta">
          <a href="#projects" className="btn">View Projects</a>
          <a href="#blog" className="btn btn-outline">Read Blog</a>
        </div>
        <div className="hero-scroll">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
        </div>
      </section>

      {/* About (if bio exists) */}
      {profile.bio && (
        <section className="section" id="about">
          <h2 className="section-title">About Me</h2>
          <p className="about-text">{profile.bio}</p>
        </section>
      )}

      {/* Projects */}
      <section className="section" id="projects">
        <h2 className="section-title">Projects</h2>
        <p className="section-sub">A selection of my recent work</p>
        {categories.length > 1 && (
          <div className="filter-bar">
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
            {categories.map(c => (
              <button key={c} className={`filter-btn ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c}</button>
            ))}
          </div>
        )}
        {filtered.length === 0 ? (
          <p className="empty">No projects yet. Add some from the <Link to="/admin">admin panel</Link>.</p>
        ) : (
          <div className="projects-grid">
            {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </section>

      {/* Blog */}
      <section className="section" id="blog">
        <h2 className="section-title">Blog</h2>
        <p className="section-sub">Thoughts, tutorials, and insights</p>
        {posts.length === 0 ? (
          <p className="empty">No blog posts yet.</p>
        ) : (
          <div className="blog-grid">
            {posts.sort((a, b) => b.createdAt - a.createdAt).map(p => (
              <article key={p.id} className="blog-card" onClick={() => { storage.trackClick('blog', p.title); navigate(`/blog/${p.id}`); }}>
                <time className="blog-date">{new Date(p.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                <h3 className="blog-title">{p.title}</h3>
                <p className="blog-excerpt">{(p.content || '').replace(/<[^>]*>/g, '').slice(0, 150)}...</p>
                <span className="read-more">Read more &rarr;</span>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} {profile.name || theme.navTitle || 'Portfolio'}. All rights reserved.</p>
        <Link to="/admin" className="footer-admin">Admin</Link>
      </footer>
    </div>
  );
}

function Nav({ title }) {
  const [open, setOpen] = useState(false);
  return (
    <nav className={`navbar ${open ? 'open' : ''}`}>
      <Link className="nav-brand" to="/">{title}</Link>
      <button className="nav-toggle" onClick={() => setOpen(!open)}>&#9776;</button>
      <ul className="nav-links">
        <li><a href="#projects" onClick={() => setOpen(false)}>Projects</a></li>
        <li><a href="#blog" onClick={() => setOpen(false)}>Blog</a></li>
        <li><Link to="/admin" onClick={() => setOpen(false)}>Admin</Link></li>
      </ul>
    </nav>
  );
}

function ProjectCard({ project: p }) {
  return (
    <Link to={`/project/${p.id}`} className="project-card" onClick={() => storage.trackClick('project', p.title)}>
      {p.thumbnail ? (
        <div className="project-thumb"><img src={p.thumbnail} alt={p.title} loading="lazy" /></div>
      ) : (
        <div className="project-thumb placeholder">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
        </div>
      )}
      <div className="project-body">
        {p.category && <span className="project-cat">{p.category}</span>}
        <h3 className="project-title">{p.title}</h3>
        <p className="project-desc">{p.description}</p>
        <div className="project-tags">
          {(p.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
        </div>
      </div>
    </Link>
  );
}

function SocialIcon({ href, label, d }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="social-link" title={label} onClick={() => storage.trackClick('social', label)}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d={d} /></svg>
    </a>
  );
}
