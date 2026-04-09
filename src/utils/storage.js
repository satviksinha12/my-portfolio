// localStorage-based data layer

const get = (key) => {
  try { return JSON.parse(localStorage.getItem(key)) || null; }
  catch { return null; }
};
const set = (key, val) => localStorage.setItem(key, JSON.stringify(val));

const storage = {
  // Projects
  getProjects: () => get('pf_projects') || [],
  saveProject(project) {
    const list = this.getProjects();
    const idx = list.findIndex(p => p.id === project.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...project, updatedAt: Date.now() };
    } else {
      project.id = crypto.randomUUID();
      project.createdAt = Date.now();
      project.updatedAt = Date.now();
      list.push(project);
    }
    set('pf_projects', list);
    return project;
  },
  deleteProject(id) { set('pf_projects', this.getProjects().filter(p => p.id !== id)); },

  // Blog
  getPosts: () => get('pf_posts') || [],
  savePost(post) {
    const list = this.getPosts();
    const idx = list.findIndex(p => p.id === post.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...post, updatedAt: Date.now() };
    } else {
      post.id = crypto.randomUUID();
      post.createdAt = Date.now();
      post.updatedAt = Date.now();
      list.push(post);
    }
    set('pf_posts', list);
    return post;
  },
  deletePost(id) { set('pf_posts', this.getPosts().filter(p => p.id !== id)); },

  // Categories
  getCategories: () => get('pf_categories') || ['Web Development', 'Mobile Apps', 'Design', 'Other'],
  saveCategories: (cats) => set('pf_categories', cats),

  // Theme
  getTheme: () => get('pf_theme') || {
    primaryColor: '#6366f1',
    accentColor: '#f59e0b',
    bgColor: '#0f172a',
    surfaceColor: '#1e293b',
    textColor: '#e2e8f0',
    fontFamily: 'Inter',
    borderRadius: 12,
    heroTitle: "Hi, I'm a Developer",
    heroSubtitle: 'Building digital experiences that matter',
    navTitle: 'Portfolio',
    socialGithub: '',
    socialLinkedin: '',
    socialTwitter: '',
    socialEmail: '',
  },
  saveTheme: (t) => set('pf_theme', t),

  // Profile
  getProfile: () => get('pf_profile') || { name: '', title: '', bio: '' },
  saveProfile: (p) => set('pf_profile', p),

  // Analytics
  getAnalytics: () => get('pf_analytics') || { views: [], clicks: [] },
  trackView(page) {
    const a = this.getAnalytics();
    a.views.push({ page, ts: Date.now(), date: new Date().toISOString().split('T')[0] });
    if (a.views.length > 1000) a.views = a.views.slice(-1000);
    set('pf_analytics', a);
  },
  trackClick(target, label) {
    const a = this.getAnalytics();
    a.clicks.push({ target, label, ts: Date.now(), date: new Date().toISOString().split('T')[0] });
    if (a.clicks.length > 1000) a.clicks = a.clicks.slice(-1000);
    set('pf_analytics', a);
  },

  // Skills
  getSkills: () => get('pf_skills') || [],
  saveSkills: (skills) => set('pf_skills', skills),

  // Auth
  getPassword: () => get('pf_admin_pw'),
  setPassword: (pw) => set('pf_admin_pw', pw),
  isSetup: () => !!get('pf_admin_pw'),

  // Export / Import
  exportAll() {
    return JSON.stringify({
      projects: this.getProjects(), posts: this.getPosts(),
      categories: this.getCategories(), theme: this.getTheme(), profile: this.getProfile(),
      skills: this.getSkills(),
    }, null, 2);
  },
  importAll(json) {
    const d = JSON.parse(json);
    if (d.projects) set('pf_projects', d.projects);
    if (d.posts) set('pf_posts', d.posts);
    if (d.categories) set('pf_categories', d.categories);
    if (d.theme) set('pf_theme', d.theme);
    if (d.profile) set('pf_profile', d.profile);
    if (d.skills) set('pf_skills', d.skills);
  },
};

export default storage;
