import React, { useEffect } from 'react';
import { Skull, RefreshCw, HelpCircle } from 'lucide-react';
import { audioEngine } from '../utils/audio';

import pilotImg from '../assets/images/pilot_1782379157418.jpg';
import engineerImg from '../assets/images/engineer_1782379087922.jpg';
import medicImg from '../assets/images/medic_1782379137310.jpg';
import scoutImg from '../assets/images/scout_1782379121630.jpg';
import robotImg from '../assets/images/robot_1782379104231.jpg';
import valeriusMentor from '../assets/images/valerius_mentor_1782379048430.jpg';

interface EndingFailScreenProps {
  avatarIndex: number;
  username: string;
  onRetry: () => void;
}

export default function EndingFailScreen({ avatarIndex, username, onRetry }: EndingFailScreenProps) {
  const avatars = [
    { name: 'PILOTO', role: 'Commander', color: 'text-neon-blue', bg: pilotImg },
    { name: 'INGENIERO', role: 'Aether Matrix', color: 'text-neon-purple', bg: engineerImg },
    { name: 'MÉDICO', role: 'Combat Healer', color: 'text-success-green', bg: medicImg },
    { name: 'EXPLORADOR', role: 'Crimson Sniper', color: 'text-neon-pink', bg: scoutImg },
    { name: 'ROBOT', role: 'Heavy Chassis', color: 'text-[#ffd700]', bg: robotImg },
  ];

  const currentAvatar = avatars[avatarIndex] || avatars[0];
  const valeriusImage = valeriusMentor;

  useEffect(() => {
    audioEngine.playMusic('boss');
    audioEngine.playSFX('glitch');
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto py-6 animate-fade-in text-center px-4 space-y-8">
      {/* Alert Header */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-full bg-alert-red/20 border-2 border-alert-red flex items-center justify-center shadow-[0_0_20px_rgba(255,42,109,0.4)] animate-pulse">
          <Skull className="w-8 h-8 text-alert-red" />
        </div>
        <h1 className="text-3xl font-orbitron font-black text-alert-red tracking-widest uppercase neon-text-red">
          LÍNEA TEMPORAL CONDENADA
        </h1>
        <p className="font-mono text-gray-500 text-[10px] tracking-widest uppercase">
          Estado: Colapso irreversible del continuo cuántico
        </p>
      </div>

      {/* Dramatic Battle / Fail Confrontation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Left: Your glitching/exploding avatar */}
        <div className="glass-panel p-6 rounded-3xl border border-alert-red/30 bg-black/80 flex flex-col items-center justify-between space-y-4 relative overflow-hidden group shadow-[inset_0_0_30px_rgba(255,42,109,0.1)]">
          {/* Flame overlay simulation */}
          <div className="absolute inset-0 bg-gradient-to-t from-red-600/30 to-transparent mix-blend-color-dodge animate-pulse pointer-events-none" />
          
          <span className="text-[10px] font-mono font-bold text-alert-red uppercase tracking-widest border border-alert-red/30 px-3 py-1 rounded bg-alert-red/10 animate-pulse">
            S.O.S. RECEPTOR ACORAZADO
          </span>

          <div className="w-40 h-52 rounded-2xl overflow-hidden border-2 border-alert-red/60 bg-black shadow-[0_0_25px_rgba(255,42,109,0.2)] relative flex items-center justify-center animate-shake">
            <img 
              src={currentAvatar.bg} 
              alt={currentAvatar.name} 
              className="w-full h-full object-cover object-top filter grayscale contrast-150 saturate-[3] hue-rotate-[320deg] brightness-50"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-red-950/20 mix-blend-overlay" />
            <div className="absolute inset-0 flex flex-col justify-between p-3 font-mono text-[9px] text-alert-red text-left">
              <span>TEMP: 850°C</span>
              <span>CORE_ERR: 0x000F4</span>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className={`font-orbitron font-black text-base tracking-wide ${currentAvatar.color}`}>
              UNIDAD {currentAvatar.name}
            </h3>
            <span className="text-xs font-mono text-gray-500 uppercase block">Piloto: {username}</span>
          </div>

          <p className="text-gray-300 font-mono text-xs leading-relaxed max-w-sm italic border-t border-white/10 pt-4">
            &ldquo;¡Comandante... el reactor de potencia ha estallado! La regla de signos invertida sobrecargó las compuertas cuánticas... ¡No podemos contenerlo más! ¡Sálvese... si pue- [ESTÁTICA]!&rdquo;
          </p>
        </div>

        {/* Right: Smiling Evil Lord Valerius */}
        <div className="glass-panel p-6 rounded-3xl border border-neon-purple/30 bg-black/80 flex flex-col items-center justify-between space-y-4 relative overflow-hidden shadow-[inset_0_0_30px_rgba(176,38,255,0.1)]">
          <span className="text-[10px] font-mono font-bold text-neon-purple uppercase tracking-widest border border-neon-purple/30 px-3 py-1 rounded bg-neon-purple/10">
            HOLOGRAMA TRANSMITIENDO
          </span>

          <div className="w-40 h-52 rounded-2xl overflow-hidden border-2 border-neon-purple/60 bg-black shadow-[0_0_25px_rgba(176,38,255,0.2)] relative flex items-center justify-center animate-pulse">
            <img 
              src={valeriusImage} 
              alt="Lord Valerius" 
              className="w-full h-full object-cover object-top filter hue-rotate-[290deg] saturate-[2.5] contrast-[1.2] brightness-75 animate-glitch"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-purple-950/20 mix-blend-overlay" />
            <div className="absolute inset-0 flex flex-col justify-between p-3 font-mono text-[9px] text-neon-purple text-left">
              <span>ID: ARQUITECTO</span>
              <span>SIG_VAL: ACTIVO</span>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="font-orbitron font-black text-base text-neon-pink tracking-wide">
              LORD VALERIUS
            </h3>
            <span className="text-xs font-mono text-gray-500 uppercase block">Arquitecto del Cero Absoluto</span>
          </div>

          <p className="text-neon-pink font-mono text-xs leading-relaxed max-w-sm italic border-t border-white/10 pt-4">
            &ldquo;¡JAJAJAJA! ¿Realmente pensabas que un simple cadete con fórmulas de escuela podría derrotar al Cero Absoluto? He usado tu energía para colapsar esta dimensión entera. ¡Gracias por liberarme de mis cadenas!&rdquo;
          </p>
        </div>
      </div>

      {/* Action Buttons to restart/retry */}
      <div className="w-full max-w-md mx-auto pt-4">
        <button
          onClick={() => {
            audioEngine.playSFX('success');
            onRetry();
          }}
          className="w-full bg-gradient-to-r from-alert-red to-neon-pink hover:brightness-110 text-white font-orbitron font-black py-4 rounded-xl tracking-wider shadow-[0_0_20px_rgba(255,42,109,0.3)] hover:shadow-[0_0_30px_rgba(255,42,109,0.5)] transition-all flex items-center justify-center gap-3 active:scale-95 text-sm uppercase"
        >
          <RefreshCw className="w-5 h-5 animate-spin-slow" /> REINTENTAR ALINEACIÓN EN LÍNEA TEMPORAL PARALELA
        </button>
      </div>
    </div>
  );
}
