import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { PlayerState, Level } from '../types';
import { Download, ShieldAlert, Award, Star } from 'lucide-react';
import { audioEngine } from '../utils/audio';

import pilotImg from '../assets/images/pilot_1782379157418.jpg';
import engineerImg from '../assets/images/engineer_1782379087922.jpg';
import medicImg from '../assets/images/medic_1782379137310.jpg';
import scoutImg from '../assets/images/scout_1782379121630.jpg';
import robotImg from '../assets/images/robot_1782379104231.jpg';

interface PlayerCardProps {
  playerState: PlayerState;
  levels: Level[];
  onClose: () => void;
}

export default function PlayerCard({ playerState, levels, onClose }: PlayerCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const avatars = [
    { name: 'PILOTO COMANDANTE', img: pilotImg, color: '#00f3ff' },
    { name: 'INGENIERO DE MATRIZ', img: engineerImg, color: '#b026ff' },
    { name: 'MÉDICO DE COMBATE', img: medicImg, color: '#00ff9d' },
    { name: 'EXPLORADOR FRONTERIZO', img: scoutImg, color: '#ff2a6d' },
    { name: 'SISTEMA AUTÓNOMO ROBOT', img: robotImg, color: '#ffd700' }
  ];

  const selectedAvatar = avatars[playerState.avatarIndex] || avatars[0];

  // Calculate stats
  let totalPct = 0;
  let count = 0;
  Object.values(playerState.levelHistory).forEach(h => {
    totalPct += h.pct;
    count++;
  });
  const avgAccuracy = count > 0 ? Math.round(totalPct / count) : 0;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    audioEngine.playSFX('success');

    try {
      // Delay slightly for render cycles
      await new Promise(resolve => setTimeout(resolve, 300));
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // Retinal high resolution
        backgroundColor: '#05000a',
        useCORS: true,
        allowTaint: true
      });

      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `PlayerCard_Crononautas_${playerState.username.toUpperCase()}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Error generating image:', e);
      alert('Error de renderizado de tarjeta. Inténtelo de nuevo.');
    } finally {
      setDownloading(false);
    }
  };

  // Determine Cadet Title based on XP
  const getCadetTitle = (xp: number) => {
    if (xp >= 500) return 'COMANDANTE SUPREMO';
    if (xp >= 350) return 'TENIENTE CRONONAUTA';
    if (xp >= 200) return 'PILOTO DE VÓRTICE';
    return 'CADETE ESPACIAL';
  };

  return (
    <div className="fixed inset-0 bg-space-black/90 z-50 flex flex-col items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-4xl w-full flex flex-col items-center">
        
        {/* Buttons */}
        <div className="w-full max-w-[420px] flex justify-between gap-3 mb-4">
          <button
            onClick={() => {
              audioEngine.playSFX('click');
              onClose();
            }}
            className="border border-gray-700 hover:border-white text-gray-400 hover:text-white px-5 py-2.5 rounded-lg text-sm font-orbitron transition-colors"
          >
            CERRAR
          </button>
          
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="bg-neon-blue hover:bg-white text-space-black font-orbitron font-bold px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,243,255,0.4)]"
          >
            <Download className="w-4 h-4" />
            {downloading ? 'GENERANDO...' : 'DESCARGAR TARJETA'}
          </button>
        </div>

        {/* Printable Player Card Canvas */}
        <div 
          ref={cardRef} 
          id="player-card-downloadable" 
          className="w-[390px] h-[580px] bg-space-black p-6 rounded-2xl border-4 flex flex-col justify-between relative overflow-hidden select-none font-sans"
          style={{ borderColor: selectedAvatar.color, boxShadow: `0 0 30px ${selectedAvatar.color}50` }}
        >
          {/* Futuristic Background grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>
          
          {/* Background circles */}
          <div className="absolute top-[-50px] right-[-50px] w-48 h-48 rounded-full pointer-events-none filter blur-3xl opacity-20" style={{ backgroundColor: selectedAvatar.color }}></div>
          <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 rounded-full pointer-events-none filter blur-3xl opacity-10" style={{ backgroundColor: selectedAvatar.color }}></div>

          {/* Top Panel: Identification */}
          <div className="relative z-10 flex justify-between items-start border-b border-gray-800 pb-3">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-gray-500 block uppercase">CADETE REGISTRADO</span>
              <h1 className="text-xl font-orbitron font-black text-white tracking-widest truncate max-w-[200px]">
                {playerState.username.toUpperCase()}
              </h1>
              <p className="text-[9px] font-mono mt-0.5" style={{ color: selectedAvatar.color }}>
                {getCadetTitle(playerState.totalScore)}
              </p>
            </div>
            
            <div className="text-right">
              <span className="text-[10px] font-mono text-gray-500 block">XP TOTAL</span>
              <span className="text-lg font-orbitron font-black text-white tracking-wider">{playerState.totalScore} XP</span>
            </div>
          </div>

          {/* Middle Section: Avatar Visual Frame */}
          <div className="relative z-10 my-4 flex-1 flex items-center justify-center">
            <div className="relative w-[180px] h-[240px] rounded-xl overflow-hidden border-2 bg-black/60 shadow-lg flex items-center justify-center shrink-0" style={{ borderColor: selectedAvatar.color }}>
              <img
                src={selectedAvatar.img}
                alt={selectedAvatar.name}
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
              {/* Cadet Class overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/75 to-transparent p-2 text-center">
                <span className="font-orbitron font-bold text-[10px] text-white tracking-wider">
                  {selectedAvatar.name}
                </span>
              </div>
            </div>

            {/* Left/Right Stats Columns */}
            <div className="flex-1 pl-4 flex flex-col justify-center space-y-4 font-mono">
              <div>
                <span className="text-[9px] text-gray-500 block uppercase">PRECISIÓN PROMEDIO</span>
                <span className="text-3xl font-orbitron font-black text-white">{avgAccuracy}%</span>
              </div>
              
              <div>
                <span className="text-[9px] text-gray-500 block uppercase">NIVEL MÁXIMO</span>
                <span className="text-sm font-orbitron font-bold text-gray-200">
                  NIVEL {playerState.unlockedLevels[playerState.unlockedLevels.length - 1]}
                </span>
              </div>

              <div>
                <span className="text-[9px] text-gray-500 block uppercase">FECHA DE EMISIÓN</span>
                <span className="text-xs text-gray-400">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Levels Table */}
          <div className="relative z-10 bg-black/50 border border-gray-800 rounded-lg p-3 font-mono text-[10px] space-y-1">
            <div className="flex justify-between font-bold border-b border-gray-800 pb-1 text-gray-500 uppercase tracking-widest">
              <span>Nivel</span>
              <span>Aciertos</span>
              <span>Porcentaje</span>
            </div>
            {levels.map(l => {
              const hist = playerState.levelHistory[l.id];
              if (l.isSecret && !hist && !playerState.unlockedLevels.includes(l.id)) return null;

              return (
                <div key={l.id} className="flex justify-between py-0.5 border-b border-white/5 last:border-0">
                  <span className="text-gray-300 truncate max-w-[150px]">{l.title}</span>
                  <span className="text-white">{hist ? `${hist.bestScore}/${hist.max}` : '--'}</span>
                  <span className={hist && hist.passed ? 'text-success-green' : 'text-gray-500'}>
                    {hist ? `${hist.pct}%` : 'PENDIENTE'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Footer: Credentials */}
          <div className="relative z-10 border-t border-gray-900 pt-3 flex justify-between items-center text-[9px] font-mono text-gray-500">
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" style={{ color: selectedAvatar.color }} />
              <span>ACADEMIA APEIRON MATEMÁTICAS</span>
            </div>
            <span>ID: CRONO-{Math.floor(Math.random() * 90000) + 10000}</span>
          </div>

        </div>

      </div>
    </div>
  );
}
