import { createContext, useContext, useState, useCallback } from 'react';

const QueueContext = createContext(null);

export function QueueProvider({ children }) {
  const [queue, setQueue] = useState([]);
  const [history, setHistory] = useState([]);

  const addToQueue = useCallback((track) => {
    setQueue(prev => {
      if (prev.find(t => t.id === track.id)) return prev;
      return [...prev, track];
    });
  }, []);

  const removeFromQueue = useCallback((trackId) => {
    setQueue(prev => prev.filter(t => t.id !== trackId));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const reorderQueue = useCallback((fromIndex, toIndex) => {
    setQueue(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  }, []);

  const moveUp = useCallback((index) => {
    if (index <= 0) return;
    reorderQueue(index, index - 1);
  }, [reorderQueue]);

  const moveDown = useCallback((index) => {
    setQueue(prev => {
      if (index >= prev.length - 1) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(index, 1);
      updated.splice(index + 1, 0, moved);
      return updated;
    });
  }, []);

  const playNext = useCallback(() => {
    if (queue.length === 0) return null;
    const [next, ...rest] = queue;
    setHistory(prev => [next, ...prev.slice(0, 49)]);
    setQueue(rest);
    return next;
  }, [queue]);

  const setFullQueue = useCallback((tracks) => {
    setQueue(tracks);
  }, []);

  return (
    <QueueContext.Provider value={{
      queue, history, addToQueue, removeFromQueue, clearQueue,
      reorderQueue, moveUp, moveDown, playNext, setFullQueue,
    }}>
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  const ctx = useContext(QueueContext);
  if (!ctx) throw new Error('useQueue must be used within QueueProvider');
  return ctx;
}
