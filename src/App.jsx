import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import AmbientBackground from './components/AmbientBackground';
import LandingPage from './components/LandingPage';
import LoadingTransition from './components/LoadingTransition';
import PlaylistView from './components/PlaylistView';
import { useMood } from './context/MoodContext';
import { getPlaylistForMood, getSurprisePlaylist } from './data/mockData';
import './App.css';

function App() {
  const { currentMood, energyLevel } = useMood();
  const [screen, setScreen] = useState('landing'); // 'landing' | 'loading' | 'playlist'
  const [playlist, setPlaylist] = useState([]);
  const [isSurprise, setIsSurprise] = useState(false);

  const handleGenerate = useCallback((surprise = false) => {
    setIsSurprise(surprise);
    setScreen('loading');
  }, []);

  const handleLoadingComplete = useCallback(() => {
    if (isSurprise) {
      setPlaylist(getSurprisePlaylist());
    } else {
      setPlaylist(getPlaylistForMood(currentMood.id, energyLevel));
    }
    setScreen('playlist');
  }, [currentMood, energyLevel, isSurprise]);

  const handleBack = useCallback(() => {
    setScreen('landing');
    setPlaylist([]);
  }, []);

  return (
    <div className="app-container">
      <AmbientBackground />
      <AnimatePresence mode="wait">
        {screen === 'landing' && (
          <LandingPage key="landing" onGenerate={handleGenerate} />
        )}
        {screen === 'loading' && (
          <LoadingTransition key="loading" onComplete={handleLoadingComplete} />
        )}
        {screen === 'playlist' && (
          <PlaylistView
            key="playlist"
            tracks={playlist}
            isSurprise={isSurprise}
            onBack={handleBack}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
