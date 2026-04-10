// localStorage-based data layer

const DEFAULT_PROJECTS = [
  {
    id: 'project-1',
    title: 'PulseFit Dashboard',
    category: 'Web Development',
    description: 'A responsive fitness analytics dashboard with weekly goals, activity trends, and clean data visualizations.',
    content: '<p>PulseFit Dashboard combines a focused dashboard layout with lightweight charts and a fast filter flow so users can track workouts without noise. The project was designed to feel polished on desktop and mobile, with a strong emphasis on readable metrics and clear calls to action.</p><p>Highlights include summary cards, timeline views, and a compact project experience that makes fitness data feel approachable.</p>',
    tags: ['React', 'Vite', 'Charting', 'Responsive UI'],
    liveUrl: 'https://example.com/pulsefit',
    repoUrl: 'https://github.com/',
    published: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
  },
  {
    id: 'project-2',
    title: 'Northstar Brand Site',
    category: 'Design',
    description: 'A bold landing page concept for a creative studio, built around motion, contrast, and strong typography.',
    content: '<p>Northstar Brand Site explores a more editorial visual style with layered sections, storytelling-driven copy, and deliberate spacing. It is intended to show how a portfolio can feel more like a brand experience than a standard brochure site.</p><p>The implementation balances visual personality with fast loading and simple navigation.</p>',
    tags: ['Branding', 'Motion', 'Landing Page'],
    liveUrl: 'https://example.com/northstar',
    repoUrl: 'https://github.com/',
    published: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
  },
  {
    id: 'project-3',
    title: 'TaskFlow Mobile App',
    category: 'Mobile Apps',
    description: 'A task management concept for mobile, focused on quick capture, swipe interactions, and daily planning.',
    content: '<p>TaskFlow Mobile App was created to demonstrate a product-first portfolio project with practical interaction patterns. The UI favors compact controls, clear hierarchy, and a streamlined task list that works well on smaller screens.</p><p>It shows how simple systems can still feel premium when spacing, color, and motion are handled carefully.</p>',
    tags: ['React Native', 'Product Design', 'UX'],
    liveUrl: 'https://example.com/taskflow',
    repoUrl: 'https://github.com/',
    published: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
  },
];

const DEFAULT_POSTS = [
  {
    id: 'post-1',
    title: 'Designing a portfolio that feels intentional',
    content: '<p>A strong portfolio does more than list projects. It sets a point of view, explains tradeoffs, and gives people a reason to keep reading. I like starting with a clear visual direction and then using structure to support that direction instead of fighting it.</p><p>The best results usually come from editing harder, not adding more sections.</p>',
    published: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 21,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 21,
  },
  {
    id: 'post-2',
    title: 'Why small UI decisions matter more than large ones',
    content: '<p>Spacing, type scale, color contrast, and motion pacing usually shape the experience more than any single feature. Those small choices control whether a site feels generic or deliberate.</p><p>For portfolio work, I treat those decisions as part of the product rather than decoration.</p>',
    published: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
  },
  {
    id: 'post-3',
    title: 'Building fast with a simple content model',
    content: '<p>Keeping content in a tiny local storage layer makes it easy to prototype quickly. It is enough for a personal site, and it keeps the public pages and admin pages using the same source of truth.</p><p>That makes it easy to add, edit, or replace content without changing the routing or layout.</p>',
    published: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
];

const get = (key) => {
  try { return JSON.parse(localStorage.getItem(key)) || null; }
  catch { return null; }
};
const set = (key, val) => localStorage.setItem(key, JSON.stringify(val));
const getList = (key, fallback) => {
  const value = get(key);
  return Array.isArray(value) && value.length > 0 ? value : fallback;
};

const storage = {
  // Projects
  getProjects: () => getList('pf_projects', DEFAULT_PROJECTS),
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
  getPosts: () => getList('pf_posts', DEFAULT_POSTS),
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
    heroTitle: "Hi, I'm Satvik",
    heroSubtitle: 'Building digital experiences that matter',
    navTitle: 'Portfolio',
    socialGithub: '',
    socialLinkedin: '',
    socialTwitter: '',
    socialEmail: '',
  },
  saveTheme: (t) => set('pf_theme', t),

  // Profile
  getProfile: () => get('pf_profile') || { name: 'Satvik', title: '', bio: '' },
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
