import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import storage from '../../utils/storage';
import { simpleHash } from '../../utils/hash';
import Toast, { useToast } from '../../components/common/Toast';
import './Admin.css';

export default function AdminLayout() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('pf_authed') === '1');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!authed) return <AuthScreen onAuth={() => setAuthed(true)} />;

  const logout = () => {
    sessionStorage.removeItem('pf_authed');
    setAuthed(false);
  };

  return (
    <div className="admin-layout">
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>&#9776;</button>
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <h2>Portfolio Admin</h2>
          <small>Manage your content</small>
        </div>
        <nav className="sidebar-nav" onClick={() => setSidebarOpen(false)}>
          <NavLink to="/admin" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            Projects
          </NavLink>
          <NavLink to="/admin/blog" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Blog
          </NavLink>
          <NavLink to="/admin/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
            Analytics
          </NavLink>
          <NavLink to="/admin/theme" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            Theme
          </NavLink>
          <NavLink to="/admin/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            Settings
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <button className="btn btn-sm" onClick={() => navigate('/')}>Preview Site</button>
          <button className="btn btn-sm btn-outline" onClick={logout}>Logout</button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
      <Toast toast={toast} />
    </div>
  );
}

function AuthScreen({ onAuth }) {
  const isSetup = storage.isSetup();
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isSetup) {
      if (pw !== pw2) { setError('Passwords do not match'); return; }
      storage.setPassword(simpleHash(pw));
      sessionStorage.setItem('pf_authed', '1');
      onAuth();
    } else {
      if (simpleHash(pw) === storage.getPassword()) {
        sessionStorage.setItem('pf_authed', '1');
        onAuth();
      } else {
        setError('Incorrect password');
      }
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h2>{isSetup ? 'Admin Login' : 'Setup Admin'}</h2>
        {!isSetup && <p>Create a password to protect your admin panel.</p>}
        <form onSubmit={handleSubmit}>
          <label>Password<input type="password" value={pw} onChange={e => setPw(e.target.value)} required minLength={4} /></label>
          {!isSetup && <label>Confirm Password<input type="password" value={pw2} onChange={e => setPw2(e.target.value)} required /></label>}
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn" style={{ marginTop: '.5rem' }}>{isSetup ? 'Login' : 'Create Password'}</button>
        </form>
      </div>
    </div>
  );
}
