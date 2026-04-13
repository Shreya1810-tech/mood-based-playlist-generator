import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useTheme, THEMES } from '../context/ThemeContext';
import './ThemeSwitcher.css';

export default function ThemeSwitcher({ open, onClose }) {
  const { currentTheme, switchTheme } = useTheme();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="theme-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="theme-popover glass-strong"
            initial={{ opacity: 0, scale: 0.88, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-label="Choose theme"
          >
            <div className="theme-header">
              <span className="theme-header-title">Theme</span>
              <button className="theme-close" onClick={onClose} aria-label="Close theme picker">
                <X size={15} />
              </button>
            </div>
            <div className="theme-grid">
              {Object.values(THEMES).map(theme => (
                <motion.button
                  key={theme.id}
                  id={`theme-${theme.id}`}
                  className={`theme-option ${currentTheme === theme.id ? 'active' : ''}`}
                  onClick={() => { switchTheme(theme.id); onClose(); }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  aria-label={`Switch to ${theme.label} theme`}
                  aria-pressed={currentTheme === theme.id}
                  style={{ '--preview-bg': theme.bgBase }}
                >
                  {/* Preview swatch */}
                  <div
                    className="theme-preview"
                    style={{ background: `linear-gradient(135deg, ${theme.bgBase}, color-mix(in srgb, ${theme.bgBase} 60%, white))` }}
                  >
                    <div
                      className="theme-preview-bar"
                      style={{ background: theme.surface, borderColor: theme.border }}
                    />
                    <div className="theme-preview-dots">
                      <span style={{ background: theme.textSecondary }} />
                      <span style={{ background: theme.textMuted }} />
                    </div>
                  </div>

                  <span className="theme-icon">{theme.icon}</span>
                  <span className="theme-label">{theme.label}</span>

                  {currentTheme === theme.id && (
                    <motion.span
                      className="theme-check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      <Check size={10} />
                    </motion.span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
