import { useState } from 'react';
import { useTheme } from '../../utils/ThemeContext';
import storage from '../../utils/storage';
import { showToast } from '../../components/common/Toast';

export default function AdminTheme() {
  const { theme, updateTheme, setTheme } = useTheme();
  const [form, setForm] = useState({ ...theme });

  const update = (key, val) => {
    const next = { ...form, [key]: val };
    setForm(next);
    // Live preview for colors
    if (key.endsWith('Color')) setTheme(next);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateTheme(form);
    showToast('Theme saved!');
  };

  const reset = () => {
    if (!confirm('Reset theme to defaults?')) return;
    localStorage.removeItem('pf_theme');
    const defaults = storage.getTheme();
    setForm(defaults);
    updateTheme(defaults);
    showToast('Theme reset');
  };

  return (
    <>
      <div className="admin-header">
        <h1>Theme Customization</h1>
        <button className="btn btn-outline" onClick={reset}>Reset Defaults</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3>Colors</h3>
        <div className="color-grid">
          {[['primaryColor', 'Primary'], ['accentColor', 'Accent'], ['bgColor', 'Background'], ['surfaceColor', 'Surface'], ['textColor', 'Text']].map(([key, label]) => (
            <div key={key} className="color-field">
              <input type="color" value={form[key]} onChange={e => update(key, e.target.value)} />
              <span>{label}</span>
            </div>
          ))}
        </div>

        <h3>Typography & Shape</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <label>Font Family
            <select value={form.fontFamily} onChange={e => update('fontFamily', e.target.value)}>
              {['Inter', 'Poppins', 'Space Grotesk', 'JetBrains Mono', 'DM Sans', 'Outfit', 'system-ui'].map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </label>
          <label>Border Radius ({form.borderRadius}px)
            <input type="range" min="0" max="24" value={form.borderRadius} onChange={e => update('borderRadius', Number(e.target.value))} />
          </label>
        </div>

        <h3>Hero Section</h3>
        <label>Site Title (nav)<input type="text" value={form.navTitle} onChange={e => update('navTitle', e.target.value)} /></label>
        <label>Hero Title<input type="text" value={form.heroTitle} onChange={e => update('heroTitle', e.target.value)} /></label>
        <label>Hero Subtitle<input type="text" value={form.heroSubtitle} onChange={e => update('heroSubtitle', e.target.value)} /></label>

        <h3>Social Links</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <label>GitHub<input type="url" value={form.socialGithub} onChange={e => update('socialGithub', e.target.value)} placeholder="https://github.com/..." /></label>
          <label>LinkedIn<input type="url" value={form.socialLinkedin} onChange={e => update('socialLinkedin', e.target.value)} placeholder="https://linkedin.com/in/..." /></label>
          <label>Twitter / X<input type="url" value={form.socialTwitter} onChange={e => update('socialTwitter', e.target.value)} placeholder="https://x.com/..." /></label>
          <label>Email<input type="email" value={form.socialEmail} onChange={e => update('socialEmail', e.target.value)} placeholder="you@example.com" /></label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn">Save Theme</button>
        </div>
      </form>
    </>
  );
}
