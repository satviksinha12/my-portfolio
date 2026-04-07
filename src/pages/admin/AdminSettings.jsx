import { useState } from 'react';
import storage from '../../utils/storage';
import { showToast } from '../../components/common/Toast';

export default function AdminSettings() {
  const [profile, setProfile] = useState(storage.getProfile);
  const [categories, setCategories] = useState(storage.getCategories);

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

      <h3 style={{ margin: '2rem 0 .75rem' }}>Data Management</h3>
      <div style={{ display: 'flex', gap: '.75rem' }}>
        <button className="btn btn-outline" onClick={exportData}>Export Data</button>
        <button className="btn btn-outline" onClick={importData}>Import Data</button>
      </div>
    </>
  );
}
