/* ── Mock Playlist Data ── */

const allTracks = [
  // ── Happy / Upbeat ──
  { id: 'h1', title: 'Walking on Sunshine', artist: 'Katrina & The Waves', duration: '3:58', mood: 'happy', cover: '🌞', album: 'Walking on Sunshine' },
  { id: 'h2', title: 'Happy', artist: 'Pharrell Williams', duration: '3:53', mood: 'happy', cover: '😊', album: 'G I R L' },
  { id: 'h3', title: 'Good as Hell', artist: 'Lizzo', duration: '2:39', mood: 'happy', cover: '💅', album: 'Cuz I Love You' },
  { id: 'h4', title: 'Uptown Funk', artist: 'Bruno Mars', duration: '4:30', mood: 'happy', cover: '🕺', album: 'Uptown Special' },
  { id: 'h5', title: 'Can\'t Stop the Feeling', artist: 'Justin Timberlake', duration: '3:56', mood: 'happy', cover: '💃', album: 'Trolls OST' },
  { id: 'h6', title: 'Levitating', artist: 'Dua Lipa', duration: '3:23', mood: 'happy', cover: '🪩', album: 'Future Nostalgia' },
  { id: 'h7', title: 'Shake It Off', artist: 'Taylor Swift', duration: '3:39', mood: 'happy', cover: '✨', album: '1989' },
  { id: 'h8', title: 'Here Comes the Sun', artist: 'The Beatles', duration: '3:05', mood: 'happy', cover: '☀️', album: 'Abbey Road' },

  // ── Energetic ──
  { id: 'e1', title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:20', mood: 'energetic', cover: '🌃', album: 'After Hours' },
  { id: 'e2', title: 'Titanium', artist: 'David Guetta ft. Sia', duration: '4:05', mood: 'energetic', cover: '⚡', album: 'Nothing but the Beat' },
  { id: 'e3', title: 'Stronger', artist: 'Kanye West', duration: '5:12', mood: 'energetic', cover: '💪', album: 'Graduation' },
  { id: 'e4', title: 'Don\'t Stop Me Now', artist: 'Queen', duration: '3:29', mood: 'energetic', cover: '🚀', album: 'Jazz' },
  { id: 'e5', title: 'Lose Yourself', artist: 'Eminem', duration: '5:26', mood: 'energetic', cover: '🎤', album: '8 Mile OST' },
  { id: 'e6', title: 'Thunder', artist: 'Imagine Dragons', duration: '3:07', mood: 'energetic', cover: '⛈️', album: 'Evolve' },
  { id: 'e7', title: 'Run the World', artist: 'Beyoncé', duration: '3:56', mood: 'energetic', cover: '👑', album: '4' },
  { id: 'e8', title: 'Believer', artist: 'Imagine Dragons', duration: '3:24', mood: 'energetic', cover: '🔥', album: 'Evolve' },

  // ── Calm / Relaxed ──
  { id: 'c1', title: 'Weightless', artist: 'Marconi Union', duration: '8:09', mood: 'calm', cover: '🌊', album: 'Weightless' },
  { id: 'c2', title: 'Clair de Lune', artist: 'Debussy', duration: '5:15', mood: 'calm', cover: '🌙', album: 'Suite bergamasque' },
  { id: 'c3', title: 'Breathe Me', artist: 'Sia', duration: '4:34', mood: 'calm', cover: '🍃', album: 'Colour the Small One' },
  { id: 'c4', title: 'Strawberry Swing', artist: 'Coldplay', duration: '4:09', mood: 'calm', cover: '🍓', album: 'Viva la Vida' },
  { id: 'c5', title: 'Sunset Lover', artist: 'Petit Biscuit', duration: '3:34', mood: 'calm', cover: '🌅', album: 'Presence' },
  { id: 'c6', title: 'Ocean', artist: 'John Butler', duration: '12:02', mood: 'calm', cover: '🐚', album: 'Grand National' },
  { id: 'c7', title: 'Bloom', artist: 'The Paper Kites', duration: '3:36', mood: 'calm', cover: '🌸', album: 'Woodland' },
  { id: 'c8', title: 'River Flows in You', artist: 'Yiruma', duration: '3:12', mood: 'calm', cover: '💧', album: 'First Love' },

  // ── Sad / Melancholy ──
  { id: 's1', title: 'Skinny Love', artist: 'Bon Iver', duration: '3:59', mood: 'sad', cover: '🌧️', album: 'For Emma, Forever Ago' },
  { id: 's2', title: 'Someone Like You', artist: 'Adele', duration: '4:45', mood: 'sad', cover: '💔', album: '21' },
  { id: 's3', title: 'Mad World', artist: 'Gary Jules', duration: '3:07', mood: 'sad', cover: '🌑', album: 'Trading Snakeoil' },
  { id: 's4', title: 'Hurt', artist: 'Johnny Cash', duration: '3:38', mood: 'sad', cover: '🥀', album: 'American IV' },
  { id: 's5', title: 'The Night We Met', artist: 'Lord Huron', duration: '3:28', mood: 'sad', cover: '🌌', album: 'Strange Trails' },
  { id: 's6', title: 'All I Want', artist: 'Kodaline', duration: '5:07', mood: 'sad', cover: '😢', album: 'In a Perfect World' },
  { id: 's7', title: 'Fix You', artist: 'Coldplay', duration: '4:55', mood: 'sad', cover: '🕯️', album: 'X&Y' },
  { id: 's8', title: 'Liability', artist: 'Lorde', duration: '2:52', mood: 'sad', cover: '🫧', album: 'Melodrama' },

  // ── Romantic ──
  { id: 'r1', title: 'At Last', artist: 'Etta James', duration: '3:02', mood: 'romantic', cover: '💕', album: 'At Last!' },
  { id: 'r2', title: 'Lover', artist: 'Taylor Swift', duration: '3:41', mood: 'romantic', cover: '💘', album: 'Lover' },
  { id: 'r3', title: 'All of Me', artist: 'John Legend', duration: '4:29', mood: 'romantic', cover: '❤️', album: 'Love in the Future' },
  { id: 'r4', title: 'La Vie en Rose', artist: 'Edith Piaf', duration: '3:07', mood: 'romantic', cover: '🌹', album: 'La Vie en Rose' },
  { id: 'r5', title: 'Thinking Out Loud', artist: 'Ed Sheeran', duration: '4:41', mood: 'romantic', cover: '💞', album: 'x' },
  { id: 'r6', title: 'Fallingforyou', artist: 'The 1975', duration: '4:19', mood: 'romantic', cover: '🦋', album: 'Music for Cars' },
  { id: 'r7', title: 'Adorn', artist: 'Miguel', duration: '3:13', mood: 'romantic', cover: '💋', album: 'Kaleidoscope Dream' },
  { id: 'r8', title: 'Electric', artist: 'Alina Baraz', duration: '3:45', mood: 'romantic', cover: '⚡', album: 'Urban Flora' },

  // ── Focused ──
  { id: 'f1', title: 'Experience', artist: 'Ludovico Einaudi', duration: '5:15', mood: 'focused', cover: '🎯', album: 'In a Time Lapse' },
  { id: 'f2', title: 'Intro', artist: 'The xx', duration: '2:07', mood: 'focused', cover: '🔮', album: 'xx' },
  { id: 'f3', title: 'Midnight City', artist: 'M83', duration: '4:03', mood: 'focused', cover: '🏙️', album: 'Hurry Up' },
  { id: 'f4', title: 'Opus', artist: 'Eric Prydz', duration: '9:03', mood: 'focused', cover: '💎', album: 'Opus' },
  { id: 'f5', title: 'Daylight', artist: 'Joji', duration: '2:43', mood: 'focused', cover: '🌤️', album: 'Smithereens' },
  { id: 'f6', title: 'Sleepwalking', artist: 'Isadora', duration: '3:12', mood: 'focused', cover: '🧘', album: 'Sleepwalking' },
  { id: 'f7', title: 'Gymnopédie No.1', artist: 'Erik Satie', duration: '3:30', mood: 'focused', cover: '🎹', album: 'Gymnopédies' },
  { id: 'f8', title: 'Time', artist: 'Hans Zimmer', duration: '4:35', mood: 'focused', cover: '⏳', album: 'Inception OST' },

  // ── Nostalgic ──
  { id: 'n1', title: 'Dreams', artist: 'Fleetwood Mac', duration: '4:14', mood: 'nostalgic', cover: '✨', album: 'Rumours' },
  { id: 'n2', title: 'Space Oddity', artist: 'David Bowie', duration: '5:18', mood: 'nostalgic', cover: '🚀', album: 'David Bowie' },
  { id: 'n3', title: 'Heroes', artist: 'David Bowie', duration: '6:07', mood: 'nostalgic', cover: '🌟', album: 'Heroes' },
  { id: 'n4', title: 'Wish You Were Here', artist: 'Pink Floyd', duration: '5:34', mood: 'nostalgic', cover: '🤝', album: 'Wish You Were Here' },
  { id: 'n5', title: 'Bohemian Rhapsody', artist: 'Queen', duration: '5:55', mood: 'nostalgic', cover: '👑', album: 'A Night at the Opera' },
  { id: 'n6', title: 'Hotel California', artist: 'Eagles', duration: '6:30', mood: 'nostalgic', cover: '🏨', album: 'Hotel California' },
  { id: 'n7', title: 'Come As You Are', artist: 'Nirvana', duration: '3:39', mood: 'nostalgic', cover: '🎸', album: 'Nevermind' },
  { id: 'n8', title: 'Landslide', artist: 'Fleetwood Mac', duration: '3:19', mood: 'nostalgic', cover: '🏔️', album: 'Fleetwood Mac' },

  // ── Angry / Intense ──
  { id: 'a1', title: 'Killing in the Name', artist: 'Rage Against the Machine', duration: '5:13', mood: 'angry', cover: '🔥', album: 'RATM' },
  { id: 'a2', title: 'Break Stuff', artist: 'Limp Bizkit', duration: '2:46', mood: 'angry', cover: '💢', album: 'Significant Other' },
  { id: 'a3', title: 'Bodies', artist: 'Drowning Pool', duration: '3:22', mood: 'angry', cover: '⚠️', album: 'Sinner' },
  { id: 'a4', title: 'Chop Suey!', artist: 'System of a Down', duration: '3:30', mood: 'angry', cover: '🗡️', album: 'Toxicity' },
  { id: 'a5', title: 'Given Up', artist: 'Linkin Park', duration: '3:09', mood: 'angry', cover: '💥', album: 'Minutes to Midnight' },
  { id: 'a6', title: 'Du Hast', artist: 'Rammstein', duration: '3:54', mood: 'angry', cover: '🖤', album: 'Sehnsucht' },
  { id: 'a7', title: 'Toxicity', artist: 'System of a Down', duration: '3:39', mood: 'angry', cover: '☠️', album: 'Toxicity' },
  { id: 'a8', title: 'Numb', artist: 'Linkin Park', duration: '3:07', mood: 'angry', cover: '🔇', album: 'Meteora' },
];

/* ── Keyword → Mood Mapping for Text Input ── */
export const moodKeywords = {
  happy: ['happy', 'joy', 'excited', 'great', 'amazing', 'wonderful', 'cheerful', 'delighted', 'blessed', 'fantastic', 'thrilled', 'ecstatic', 'good', 'awesome', 'smile', 'laugh', 'celebration'],
  energetic: ['energetic', 'pumped', 'hyped', 'powerful', 'motivated', 'strong', 'alive', 'fired up', 'energized', 'workout', 'gym', 'run', 'dance', 'wild', 'unstoppable', 'adrenaline'],
  calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'chill', 'quiet', 'meditate', 'zen', 'easy', 'slow', 'gentle', 'soothing', 'rest', 'unwind', 'breathe', 'soft'],
  sad: ['sad', 'down', 'blue', 'melancholy', 'depressed', 'lonely', 'heartbroken', 'cry', 'tears', 'hurt', 'pain', 'empty', 'lost', 'missing', 'grief', 'sorrow', 'gloomy'],
  romantic: ['romantic', 'love', 'passion', 'intimate', 'tender', 'crush', 'date', 'kiss', 'heart', 'sweet', 'affection', 'desire', 'adore', 'darling', 'beloved', 'enchanted'],
  focused: ['focused', 'productive', 'study', 'work', 'concentrate', 'think', 'deep', 'flow', 'zone', 'coding', 'reading', 'creative', 'mindful', 'determined', 'driven', 'clarity'],
  nostalgic: ['nostalgic', 'remember', 'memories', 'past', 'childhood', 'miss', 'throwback', 'vintage', 'old', 'retro', 'classic', 'reminisce', 'bittersweet', 'sentimental', 'wistful'],
  angry: ['angry', 'mad', 'furious', 'frustrated', 'rage', 'annoyed', 'irritated', 'pissed', 'vent', 'scream', 'aggravated', 'livid', 'bitter', 'hostile', 'fierce', 'intense'],
};

/* ── Dual Mood Blending ── */
export function blendMoods(mood1Id, mood2Id) {
  const m1 = allTracks.filter(t => t.mood === mood1Id);
  const m2 = allTracks.filter(t => t.mood === mood2Id);
  const blended = [];
  const maxLen = Math.max(m1.length, m2.length);
  for (let i = 0; i < maxLen; i++) {
    if (m1[i]) blended.push(m1[i]);
    if (m2[i]) blended.push(m2[i]);
  }
  return blended.slice(0, 10);
}

/* ── Detect mood from text ── */
export function detectMoodFromText(text) {
  const lower = text.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lower.includes(keyword)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = mood;
    }
  }

  /* Fallback: hopeful → calm+happy blend conceptually maps to calm */
  if (!bestMatch) {
    if (lower.includes('tired') || lower.includes('exhausted') || lower.includes('sleepy')) bestMatch = 'calm';
    else if (lower.includes('hopeful') || lower.includes('optimistic')) bestMatch = 'happy';
    else bestMatch = 'calm'; // safe default
  }

  return bestMatch;
}

/* ── Get playlist for a mood ── */
export function getPlaylistForMood(moodId, energyLevel = 0.5) {
  let tracks = allTracks.filter(t => t.mood === moodId);

  /* If high energy, sprinkle in some energetic tracks; if low, sprinkle calm */
  if (energyLevel > 0.7 && moodId !== 'energetic') {
    const energeticExtras = allTracks.filter(t => t.mood === 'energetic').slice(0, 2);
    tracks = [...tracks.slice(0, 6), ...energeticExtras];
  } else if (energyLevel < 0.3 && moodId !== 'calm') {
    const calmExtras = allTracks.filter(t => t.mood === 'calm').slice(0, 2);
    tracks = [...tracks.slice(0, 6), ...calmExtras];
  }

  return tracks.map((t, i) => ({ ...t, index: i + 1 }));
}

/* ── Surprise me ── */
export function getSurprisePlaylist() {
  const shuffled = [...allTracks].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10).map((t, i) => ({ ...t, index: i + 1 }));
}

/* ── Get time-based greeting ── */
export function getTimeOfDayGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return { greeting: 'Late night?', suggestion: 'calm', emoji: '🌙' };
  if (hour < 12) return { greeting: 'Good morning', suggestion: 'happy', emoji: '☀️' };
  if (hour < 17) return { greeting: 'Good afternoon', suggestion: 'focused', emoji: '🌤️' };
  if (hour < 21) return { greeting: 'Good evening', suggestion: 'calm', emoji: '🌅' };
  return { greeting: 'Good night', suggestion: 'calm', emoji: '🌙' };
}

export default allTracks;
