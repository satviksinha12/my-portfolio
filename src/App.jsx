import { Routes, Route } from 'react-router-dom';
import Home from './pages/public/Home';
import ProjectDetail from './pages/public/ProjectDetail';
import BlogPost from './pages/public/BlogPost';
import AdminLayout from './pages/admin/AdminLayout';
import AdminProjects from './pages/admin/AdminProjects';
import AdminBlog from './pages/admin/AdminBlog';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminTheme from './pages/admin/AdminTheme';
import AdminSettings from './pages/admin/AdminSettings';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/project/:id" element={<ProjectDetail />} />
      <Route path="/blog/:id" element={<BlogPost />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminProjects />} />
        <Route path="blog" element={<AdminBlog />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="theme" element={<AdminTheme />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}
