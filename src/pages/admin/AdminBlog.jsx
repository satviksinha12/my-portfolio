import { useState } from 'react';
import storage from '../../utils/storage';
import Modal from '../../components/common/Modal';
import RichEditor from '../../components/common/RichEditor';
import { showToast } from '../../components/common/Toast';

export default function AdminBlog() {
  const [posts, setPosts] = useState(storage.getPosts);
  const [editing, setEditing] = useState(null);

  const refresh = () => setPosts([...storage.getPosts()]);

  const handleDelete = (id) => {
    if (!confirm('Delete this post?')) return;
    storage.deletePost(id);
    refresh();
    showToast('Post deleted');
  };

  return (
    <>
      <div className="admin-header">
        <h1>Blog Posts</h1>
        <button className="btn" onClick={() => setEditing({})}>+ Add Post</button>
      </div>
      {posts.length === 0 ? (
        <p className="empty">No blog posts yet. Click "Add Post" to get started.</p>
      ) : (
        posts.map(p => (
          <div key={p.id} className="item-card">
            <div className="item-info">
              <h3>{p.title}</h3>
              <span className="item-meta">
                {p.createdAt && new Date(p.createdAt).toLocaleDateString()} &middot; {p.published !== false ? 'Published' : 'Draft'}
              </span>
            </div>
            <div className="item-actions">
              <button className="btn btn-sm" onClick={() => setEditing(p)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
            </div>
          </div>
        ))
      )}
      {editing !== null && (
        <PostForm
          post={editing}
          onClose={() => setEditing(null)}
          onSave={() => { refresh(); setEditing(null); showToast('Post saved!'); }}
        />
      )}
    </>
  );
}

function PostForm({ post, onClose, onSave }) {
  const [form, setForm] = useState({
    title: post.title || '',
    content: post.content || '',
    published: post.published !== false,
  });

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    storage.savePost({
      ...post.id ? { id: post.id } : {},
      ...form,
    });
    onSave();
  };

  return (
    <Modal title={post.id ? 'Edit Post' : 'New Post'} onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>Title *<input type="text" value={form.title} onChange={e => update('title', e.target.value)} required /></label>
        <label>Content</label>
        <RichEditor value={form.content} onChange={v => update('content', v)} />
        <label className="checkbox-label">
          <input type="checkbox" checked={form.published} onChange={e => update('published', e.target.checked)} /> Published
        </label>
        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn">Save Post</button>
        </div>
      </form>
    </Modal>
  );
}
