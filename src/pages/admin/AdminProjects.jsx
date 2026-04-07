import { useState } from 'react';
import storage from '../../utils/storage';
import Modal from '../../components/common/Modal';
import RichEditor from '../../components/common/RichEditor';
import { showToast } from '../../components/common/Toast';

export default function AdminProjects() {
  const [projects, setProjects] = useState(storage.getProjects);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {id} = edit

  const refresh = () => setProjects([...storage.getProjects()]);

  const handleDelete = (id) => {
    if (!confirm('Delete this project?')) return;
    storage.deleteProject(id);
    refresh();
    showToast('Project deleted');
  };

  return (
    <>
      <div className="admin-header">
        <h1>Projects</h1>
        <button className="btn" onClick={() => setEditing({})}>+ Add Project</button>
      </div>
      {projects.length === 0 ? (
        <p className="empty">No projects yet. Click "Add Project" to get started.</p>
      ) : (
        projects.map(p => (
          <div key={p.id} className="item-card">
            <div className="item-info">
              <h3>{p.title}</h3>
              <span className="item-meta">{p.category || 'Uncategorized'} &middot; {p.published !== false ? 'Published' : 'Draft'}</span>
            </div>
            <div className="item-actions">
              <button className="btn btn-sm" onClick={() => setEditing(p)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
            </div>
          </div>
        ))
      )}
      {editing !== null && (
        <ProjectForm
          project={editing}
          onClose={() => setEditing(null)}
          onSave={() => { refresh(); setEditing(null); showToast('Project saved!'); }}
        />
      )}
    </>
  );
}

function ProjectForm({ project, onClose, onSave }) {
  const categories = storage.getCategories();
  const [form, setForm] = useState({
    title: project.title || '',
    category: project.category || '',
    description: project.description || '',
    content: project.content || '',
    thumbnail: project.thumbnail || '',
    liveUrl: project.liveUrl || '',
    repoUrl: project.repoUrl || '',
    tags: (project.tags || []).join(', '),
    published: project.published !== false,
  });

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    storage.saveProject({
      ...project.id ? { id: project.id } : {},
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    });
    onSave();
  };

  return (
    <Modal title={project.id ? 'Edit Project' : 'New Project'} onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>Title *<input type="text" value={form.title} onChange={e => update('title', e.target.value)} required /></label>
        <label>Category
          <select value={form.category} onChange={e => update('category', e.target.value)}>
            <option value="">Select...</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label>Short Description<textarea rows="3" value={form.description} onChange={e => update('description', e.target.value)} /></label>
        <label>Detailed Content</label>
        <RichEditor value={form.content} onChange={v => update('content', v)} />
        <label>Thumbnail URL<input type="url" value={form.thumbnail} onChange={e => update('thumbnail', e.target.value)} placeholder="https://..." /></label>
        <label>Live Demo URL<input type="url" value={form.liveUrl} onChange={e => update('liveUrl', e.target.value)} placeholder="https://..." /></label>
        <label>Repository URL<input type="url" value={form.repoUrl} onChange={e => update('repoUrl', e.target.value)} placeholder="https://github.com/..." /></label>
        <label>Tags (comma-separated)<input type="text" value={form.tags} onChange={e => update('tags', e.target.value)} /></label>
        <label className="checkbox-label">
          <input type="checkbox" checked={form.published} onChange={e => update('published', e.target.checked)} /> Published
        </label>
        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn">Save Project</button>
        </div>
      </form>
    </Modal>
  );
}
