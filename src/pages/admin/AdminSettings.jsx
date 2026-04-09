import { useState } from 'react';
import storage from '../../utils/storage';
import { showToast } from '../../components/common/Toast';

export default function AdminSettings() {
  const [profile, setProfile] = useState(storage.getProfile);
  const [categories, setCategories] = useState(storage.getCategories);
  const [skills, setSkills] = useState(storage.getSkills);
  const [newSkill, setNewSkill] = useState('');

  const saveProfile = (e) => {
    e.preventDefault();
    storage.saveProfile(profile);
    showToast('Profile saved!');
  };

  const updateCategory = (idx, val) => {
    const next = [...categories];
    next[idx] = val;
    setCategories(next);
    storage.saveCategories(next);
  };

  const removeCategory = (idx) => {
    const next = categories.filter((_, i) => i !== idx);
    setCategories(next);
    storage.saveCategories(next);
  };

  const addCategory = () => {
    const name = prompt('Category name:');
    if (!name) return;
    const next = [...categories, name.trim()];
    setCategories(next);
    storage.saveCategories(next);
  };

  const exportData = () => {
    const blob = new Blob([storage.exportAll()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'portfolio-backup.json';
    a.click();
    URL.revokeObjectURL(a.href);
    showToast('Data exported!');
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          storage.importAll(reader.result);
          showToast('Imported! Refreshing...');
          setTimeout(() => location.reload(), 1000);
        } catch {
          showToast('Invalid file', true);
        }
      };
      reader.readAsText(e.target.files[0]);
    };
    input.click();
  };

  return (
    <>
      <div className="admin-header"><h1>Settings</h1></div>

      <h3 style={{ marginBottom: '.75rem' }}>Profile</h3>
      <form onSubmit={saveProfile} style={{ maxWidth: 500, marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>Name<input type="text" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} placeholder="Your Name" /></label>
        <label>Title<input type="text" value={profile.title} onChange={e => setProfile(p => ({ ...p, title: e.target.value }))} placeholder="Full Stack Developer" /></label>
        <label>Bio<textarea rows="4" value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} placeholder="A short bio about yourself..." /></label>
        <div className="form-actions" style={{ justifyContent: 'flex-start' }}>
          <button type="submit" className="btn">Save Profile</button>
        </div>
      </form>

      <h3 style={{ marginBottom: '.75rem' }}>Project Categories</h3>
      {categories.map((c, i) => (
        <div key={i} className="category-item">
          <input type="text" value={c} onChange={e => updateCategory(i, e.target.value)} />
          <button className="btn btn-sm btn-danger" onClick={() => removeCategory(i)}>x</button>
        </div>
      ))}
      <button className="btn btn-sm" onClick={addCategory} style={{ marginTop: '.5rem' }}>+ Add Category</button>

      <h3 style={{ margin: '2rem 0 .75rem' }}>Tech Stack / Skills</h3>
      <p style={{ color: 'var(--dim)', fontSize: '.85rem', marginBottom: '.75rem' }}>These appear in the "Tech Stack" section on your homepage.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginBottom: '.75rem' }}>
        {skills.map((s, i) => (
          <span key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: '.4rem',
            padding: '.35rem .75rem', borderRadius: '100px',
            background: 'rgba(99,102,241,.15)', color: 'var(--primary)', fontSize: '.85rem'
          }}>
            {s}
            <button
              onClick={() => { const next = skills.filter((_, j) => j !== i); setSkills(next); storage.saveSkills(next); }}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1, padding: 0 }}
            >&times;</button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '.5rem', maxWidth: 400 }}>
        <input
          type="text" value={newSkill} onChange={e => setNewSkill(e.target.value)}
          placeholder="e.g. React, Python, Docker..."
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const val = newSkill.trim();
              if (val && !skills.includes(val)) {
                const next = [...skills, val];
                setSkills(next);
                storage.saveSkills(next);
                setNewSkill('');
              }
            }
          }}
        />
        <button className="btn btn-sm" onClick={() => {
          const val = newSkill.trim();
          if (val && !skills.includes(val)) {
            const next = [...skills, val];
            setSkills(next);
            storage.saveSkills(next);
            setNewSkill('');
          }
        }}>Add</button>
      </div>

      <h3 style={{ margin: '2rem 0 .75rem' }}>Data Management</h3>
      <div style={{ display: 'flex', gap: '.75rem' }}>
        <button className="btn btn-outline" onClick={exportData}>Export Data</button>
        <button className="btn btn-outline" onClick={importData}>Import Data</button>
      </div>
    </>
  );
}
