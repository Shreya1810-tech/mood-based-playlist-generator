import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';
import './ShortcutsHelp.css';

export default function ShortcutsHelp({ open, onClose, shortcuts }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="shortcuts-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Keyboard shortcuts"
        >
          <motion.div
            className="shortcuts-card glass-strong"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="shortcuts-header">
              <div className="shortcuts-title-row">
                <Keyboard size={18} style={{ color: 'var(--mood-primary)' }} />
                <h2 className="shortcuts-title">Keyboard Shortcuts</h2>
              </div>
              <button className="shortcuts-close" onClick={onClose} aria-label="Close shortcuts">
                <X size={16} />
              </button>
            </div>

            <div className="shortcuts-grid">
              {shortcuts.map((s, i) => (
                <motion.div
                  key={s.action}
                  className="shortcut-row"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <kbd className="shortcut-key">{s.label}</kbd>
                  <span className="shortcut-desc">{s.description}</span>
                </motion.div>
              ))}
            </div>

            <p className="shortcuts-footer">Press <kbd className="shortcut-key shortcut-key--sm">?</kbd> anytime to toggle this panel.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
