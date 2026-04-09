import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/public/Home';
import ProjectDetail from './pages/public/ProjectDetail';
import BlogPost from './pages/public/BlogPost';
import AdminLayout from './pages/admin/AdminLayout';
import AdminProjects from './pages/admin/AdminProjects';
import AdminBlog from './pages/admin/AdminBlog';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminTheme from './pages/admin/AdminTheme';
import AdminSettings from './pages/admin/AdminSettings';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeIn' } },
};

function PageWrap({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrap><Home /></PageWrap>} />
        <Route path="/project/:id" element={<PageWrap><ProjectDetail /></PageWrap>} />
        <Route path="/blog/:id" element={<PageWrap><BlogPost /></PageWrap>} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminProjects />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="theme" element={<AdminTheme />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
