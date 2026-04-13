import { useEffect, useCallback, useState } from 'react';

const SHORTCUTS = [
  { key: ' ', label: 'Space', description: 'Play / Pause', action: 'togglePlay' },
  { key: 'ArrowRight', label: '→', description: 'Next Track', action: 'nextTrack' },
  { key: 'ArrowLeft', label: '←', description: 'Previous Track', action: 'prevTrack' },
  { key: 'l', label: 'L', description: 'Like Current Track', action: 'likeTrack' },
  { key: 'q', label: 'Q', description: 'Toggle Queue', action: 'toggleQueue' },
  { key: 'f', label: 'F', description: 'Toggle Favorites', action: 'toggleFavorites' },
  { key: 's', label: 'S', description: 'Toggle Stats', action: 'toggleStats' },
  { key: 'a', label: 'A', description: 'Toggle Ambient Mode', action: 'toggleAmbient' },
  { key: 't', label: 'T', description: 'Cycle Theme', action: 'cycleTheme' },
  { key: '/', label: '/', description: 'Focus Search', action: 'focusSearch' },
  { key: 'Escape', label: 'Esc', description: 'Close Panel / Go Back', action: 'escape' },
  { key: '?', label: '?', description: 'Show Shortcuts', action: 'showShortcuts' },
];

export default function useKeyboardShortcuts(handlers = {}) {
  const [showHelp, setShowHelp] = useState(false);

  const handleKeyDown = useCallback((e) => {
    /* Don't fire in input fields */
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
      if (e.key === 'Escape') {
        e.target.blur();
      }
      return;
    }

    /* Prevent default for space (scroll) */
    if (e.key === ' ') e.preventDefault();

    const shortcut = SHORTCUTS.find(s => s.key === e.key);
    if (!shortcut) return;

    if (shortcut.action === 'showShortcuts') {
      setShowHelp(prev => !prev);
      return;
    }

    if (handlers[shortcut.action]) {
      handlers[shortcut.action]();
    }
  }, [handlers]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { showHelp, setShowHelp, SHORTCUTS };
}
