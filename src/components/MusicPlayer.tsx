import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Cybernetic Horizon (AI Gen)",
    artist: "Neural Network Alpha",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "6:12"
  },
  {
    id: 2,
    title: "Neon Syndicate (AI Gen)",
    artist: "Deep Learning Beta",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "7:05"
  },
  {
    id: 3,
    title: "Grid Runner (AI Gen)",
    artist: "TensorFlow Gamma",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "5:44"
  }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    playNext();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-900/80 backdrop-blur-md border-[10px] border-cyan-400 rounded-2xl p-6 neon-border-cyan flex flex-col gap-4">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />
      
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-lg bg-gray-800 border-[6px] border-pink-400 flex items-center justify-center neon-border-pink shrink-0 overflow-hidden relative group">
          <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-pink-500/20 ${isPlaying ? 'animate-pulse' : ''}`}></div>
          <Music className={`w-8 h-8 text-pink-400 ${isPlaying ? 'animate-bounce' : ''}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-cyan-400 font-bold truncate neon-text-cyan text-xl">
            {currentTrack.title}
          </h3>
          <p className="text-gray-400 text-sm truncate">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div 
        className="h-2 bg-gray-800 rounded-full overflow-hidden cursor-pointer relative"
        onClick={handleProgressClick}
      >
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-pink-500 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white blur-[2px]"></div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-cyan-400 transition-colors">
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-20 accent-cyan-400"
          />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={playPrev}
            className="p-2 text-gray-300 hover:text-pink-400 hover:neon-text-pink transition-all"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="p-3 bg-gray-800 border-[4px] border-cyan-400 rounded-full text-cyan-400 hover:bg-cyan-400/10 hover:neon-border-cyan transition-all"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
          </button>
          
          <button 
            onClick={playNext}
            className="p-2 text-gray-300 hover:text-pink-400 hover:neon-text-pink transition-all"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
}
