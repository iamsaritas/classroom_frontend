// src/pages/Upload.jsx
import { useEffect, useState } from 'react';
import api from '../api/http';

export default function Upload() {
  const [tab, setTab] = useState('file'); // 'file' | 'url'
  const [batches, setBatches] = useState([]);

  // Shared fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [batchId, setBatchId] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  // File upload
  const [file, setFile] = useState(null);

  // URL upload
  const [url, setUrl] = useState('');

  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get('/batches/list')               // list all batches
      .then(res => setBatches(res.data || []))
      .catch(() => setBatches([]));
  }, []);

  async function onUploadFile(e) {
    e.preventDefault();
    setMsg(''); setErr('');
    try {
      const fd = new FormData();
      fd.append('file', file);             // <-- MUST be "file" (multer field) :contentReference[oaicite:5]{index=5}
      fd.append('title', title);
      if (description) fd.append('description', description);
      if (batchId) fd.append('batchId', batchId);
      fd.append('isPublic', isPublic ? 'true' : 'false');

      await api.post('/videos/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg('Video uploaded successfully.');
      setTitle(''); setDescription(''); setBatchId(''); setIsPublic(false); setFile(null);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Upload failed');
    }
  }

  async function onCreateByUrl(e) {
    e.preventDefault();
    setMsg(''); setErr('');
    try {
      await api.post('/videos/create', {
        title, description: description || null, url, batchId: batchId || null, isPublic
      }); // controller accepts {title,url,[description,batchId,isPublic]} :contentReference[oaicite:6]{index=6}
      setMsg('Video added by URL.');
      setTitle(''); setDescription(''); setBatchId(''); setIsPublic(false); setUrl('');
    } catch (e) {
      setErr(e?.response?.data?.message || 'Create failed');
    }
  }

  return (
    <div className="container py-4">
      <h2 className="h4 mb-3">Upload Video (Admin)</h2>

      {msg && <div className="alert alert-success">{msg}</div>}
      {err && <div className="alert alert-danger">{err}</div>}

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${tab==='file'?'active':''}`} onClick={()=>setTab('file')}>Upload File</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab==='url'?'active':''}`} onClick={()=>setTab('url')}>Add by URL</button>
        </li>
      </ul>

      {tab === 'file' ? (
        <form className="card shadow-sm p-3" onSubmit={onUploadFile}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Title *</label>
              <input className="form-control" value={title} onChange={e=>setTitle(e.target.value)} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Batch</label>
              <select className="form-select" value={batchId} onChange={e=>setBatchId(e.target.value)}>
                <option value="">— None —</option>
                {batches.map(b => (
                  <option key={b.id} value={b.id}>{b.name || `Batch #${b.id}`}</option>
                ))}
              </select>
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows="2" value={description} onChange={e=>setDescription(e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label">Video File *</label>
              <input
                className="form-control"
                type="file"
                accept="video/*"
                onChange={e => setFile(e.target.files[0])}
                required
              />
              <div className="form-text">Max 200MB. Stored under /uploads/videos.</div>
            </div>

            <div className="col-12 form-check">
              <input className="form-check-input" type="checkbox" id="pub1" checked={isPublic} onChange={e=>setIsPublic(e.target.checked)} />
              <label className="form-check-label" htmlFor="pub1">Make Public</label>
            </div>
            <div className="col-12">
              <button className="btn btn-primary">Upload</button>
            </div>
          </div>
        </form>
      ) : (
        <form className="card shadow-sm p-3" onSubmit={onCreateByUrl}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Title *</label>
              <input className="form-control" value={title} onChange={e=>setTitle(e.target.value)} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Batch</label>
              <select className="form-select" value={batchId} onChange={e=>setBatchId(e.target.value)}>
                <option value="">— None —</option>
                {batches.map(b => (
                  <option key={b.id} value={b.id}>{b.name || `Batch #${b.id}`}</option>
                ))}
              </select>
            </div>
            <div className="col-12">
              <label className="form-label">Video URL *</label>
              <input className="form-control" placeholder="https://..." value={url} onChange={e=>setUrl(e.target.value)} required />
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows="2" value={description} onChange={e=>setDescription(e.target.value)} />
            </div>
            <div className="col-12 form-check">
              <input className="form-check-input" type="checkbox" id="pub2" checked={isPublic} onChange={e=>setIsPublic(e.target.checked)} />
              <label className="form-check-label" htmlFor="pub2">Make Public</label>
            </div>
            <div className="col-12">
              <button className="btn btn-primary">Add</button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
