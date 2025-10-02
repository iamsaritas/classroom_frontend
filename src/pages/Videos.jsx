import { useEffect, useState } from 'react';
import api from '../api/http';

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/videos/mine')
      .then(res => setVideos(res.data || []))
      .catch(err => setError(err?.response?.data?.message || 'Error loading videos'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="h4 mb-4">🎬 My Videos</h2>
      {videos.length === 0 ? (
        <p className="text-muted">No videos assigned yet.</p>
      ) : (
        <div className="row g-4">
          {videos.map(v => {
            const url = v.url || v.filePath || '';
            const isYouTube = /youtu\.be|youtube\.com/.test(url);

            return (
              <div className="col-md-4" key={v.id}>
                <div className="card shadow-sm h-100">

                  {/* Video player (download disabled) */}
                  {isYouTube ? (
                    <div className="ratio ratio-16x9">
                      <iframe
                        src={url.includes("embed") ? url : url.replace("watch?v=", "embed/")}
                        title={v.title}
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <video 
                      className="card-img-top" 
                      controls 
                      controlsList="nodownload noremoteplayback" 
                      disablePictureInPicture
                    >
                      <source 
                        src={
                          url.startsWith('/uploads')
                            ? `${import.meta.env.VITE_API_URL}${url}`
                            : url
                        }
                      />
                    </video>
                  )}

                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{v.title || 'Untitled Video'}</h5>
                    <p className="card-text text-muted small">
                      Batch: {v.Batch?.name || v.batchId || "N/A"}
                    </p>
                    {v.description && (
                      <p className="card-text small">{v.description}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
