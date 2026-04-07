import { useParams, Link } from 'react-router-dom';
import storage from '../../utils/storage';
import './Detail.css';

export default function BlogPost() {
  const { id } = useParams();
  const post = storage.getPosts().find(p => p.id === id);

  if (!post) return <div className="detail-page"><p className="empty">Post not found. <Link to="/">Go back</Link></p></div>;

  return (
    <div className="detail-page">
      <nav className="detail-nav">
        <Link to="/" className="back-link">&larr; Back to portfolio</Link>
      </nav>
      <article className="detail-content">
        <time className="detail-date">{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
        <h1>{post.title}</h1>
        <div className="detail-body" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </div>
  );
}
