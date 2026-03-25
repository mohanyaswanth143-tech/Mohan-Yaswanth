import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 flex flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.05)_0%,_transparent_50%)] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-pink-500 to-green-500 opacity-50"></div>
      
      {/* Header */}
      <header className="w-full p-6 flex items-center justify-center gap-3 relative z-10">
        <Terminal className="w-8 h-8 text-cyan-400" />
        <h1 className="text-3xl font-black tracking-tighter uppercase italic text-transparent bg-gradient-to-r from-cyan-400 to-pink-500 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
          Neon Snake <span className="text-gray-500 font-light">&</span> Beats
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 relative z-10">
        
        {/* Left/Top: Game Area */}
        <div className="flex-1 w-full flex justify-center">
          <SnakeGame />
        </div>

        {/* Right/Bottom: Music Player & Info */}
        <div className="w-full lg:w-96 flex flex-col gap-8 shrink-0">
          <MusicPlayer />
          
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-pink-400 font-mono text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
              System Status
            </h3>
            <ul className="space-y-3 font-mono text-xs text-gray-400">
              <li className="flex justify-between">
                <span>Audio Engine</span>
                <span className="text-cyan-400">ONLINE</span>
              </li>
              <li className="flex justify-between">
                <span>Neural Tracks</span>
                <span className="text-cyan-400">LOADED (3)</span>
              </li>
              <li className="flex justify-between">
                <span>Game Loop</span>
                <span className="text-green-400">READY</span>
              </li>
            </ul>
          </div>
        </div>

      </main>
      
      {/* Grid overlay for aesthetic */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(#0ff 1px, transparent 1px), linear-gradient(90deg, #0ff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
    </div>
  );
}
