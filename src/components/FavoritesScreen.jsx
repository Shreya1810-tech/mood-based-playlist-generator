import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Play, PlusCircle, Trash } from 'lucide-react';
import { useMood } from '../context/MoodContext';
import { useQueue } from '../context/QueueContext';
import { useToast } from '../context/ToastContext';
import ConfirmModal from './ConfirmModal';
import './FavoritesScreen.css';

export default function FavoritesScreen({ open, onClose, allTracks = [] }) {
  const { likedTracks, toggleLike } = useMood();
  const { addToQueue } = useQueue();
  const { success, info } = useToast();
  const [hoveredId, setHoveredId] = useState(null);
  const [confirmUnlike, setConfirmUnlike] = useState(null); // track to unlike

  const favorites = allTracks.filter(t => likedTracks.includes(t.id));

  const handleAddQueue = (track) => {
    addToQueue(track);
    success(`"${track.title}" added to queue`);
  };

  const handleUnlike = (track) => {
    setConfirmUnlike(track);
  };

  const confirmUnlikeAction = () => {
    if (confirmUnlike) {
      toggleLike(confirmUnlike.id);
      info(`Removed "${confirmUnlike.title}" from favourites`);
      setConfirmUnlike(null);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fav-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.section
            className="fav-panel glass-strong"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 32 }}
            onClick={e => e.stopPropagation()}
            aria-label="Favourites"
            role="region"
          >
            {/* Header */}
            <div className="fav-header">
              <div className="fav-header-left">
                <Heart size={18} style={{ color: '#ef4444' }} fill="#ef4444" />
                <h2 className="fav-title">Favourites</h2>
                <span className="fav-count">{favorites.length}</span>
              </div>
              <button className="fav-close" onClick={onClose} aria-label="Close favourites">
                <X size={18} />
              </button>
            </div>

            {favorites.length === 0 ? (
              <div className="fav-empty">
                <Heart size={44} style={{ opacity: 0.15, marginBottom: '1rem' }} />
                <p>No favourites yet.</p>
                <p className="fav-empty-hint">Like tracks to save them here.</p>
              </div>
            ) : (
              <div className="fav-grid">
                <AnimatePresence>
                  {favorites.map((track, i) => (
                    <motion.div
                      key={track.id}
                      className="fav-card"
                      initial={{ opacity: 0, scale: 0.88 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.28, delay: i * 0.04 }}
                      layout
                      onMouseEnter={() => setHoveredId(track.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      {/* Cover */}
                      <div className="fav-cover">
                        <span className="fav-emoji">{track.cover}</span>
                        {/* Progressive disclosure: show play on hover */}
                        <AnimatePresence>
                          {hoveredId === track.id && (
                            <motion.div
                              className="fav-cover-overlay"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <Play size={20} fill="white" color="white" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="fav-info">
                        <span className="fav-track-title">{track.title}</span>
                        <span className="fav-track-artist">{track.artist}</span>
                        <span className="fav-track-duration">{track.duration}</span>
                      </div>

                      {/* Contextual secondary actions — hover reveal */}
                      <div className="fav-actions">
                        <motion.button
                          className="fav-btn fav-btn--queue"
                          onClick={() => handleAddQueue(track)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Add to queue"
                          aria-label={`Add ${track.title} to queue`}
                        >
                          <PlusCircle size={15} />
                        </motion.button>
                        <motion.button
                          className="fav-btn fav-btn--remove"
                          onClick={() => handleUnlike(track)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Remove from favourites"
                          aria-label={`Remove ${track.title} from favourites`}
                        >
                          <Trash size={15} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.section>

          {/* Confirmation modal for unlike */}
          <ConfirmModal
            open={!!confirmUnlike}
            title="Remove from Favourites?"
            message={`"${confirmUnlike?.title}" will be removed from your favourites list. You can always like it again.`}
            confirmLabel="Remove"
            cancelLabel="Keep"
            variant="danger"
            onConfirm={confirmUnlikeAction}
            onCancel={() => setConfirmUnlike(null)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
