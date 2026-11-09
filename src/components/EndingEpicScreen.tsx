import React, { useEffect, useState } from 'react';
import { Award, Zap, Trophy, Shield, RefreshCw } from 'lucide-react';
import { audioEngine } from '../utils/audio';

import pilotImg from '../assets/images/pilot_1782379157418.jpg';
import engineerImg from '../assets/images/engineer_1782379087922.jpg';
import medicImg from '../assets/images/medic_1782379137310.jpg';
import scoutImg from '../assets/images/scout_1782379121630.jpg';
import robotImg from '../assets/images/robot_1782379104231.jpg';
import valeriusMentor from '../assets/images/valerius_mentor_1782379048430.jpg';

interface EndingEpicScreenProps {
  avatarIndex: number;
  username: string;
  totalScore: number;
  classCode: string;
  onRestart: () => void;
}

export default function EndingEpicScreen({ avatarIndex, username, totalScore, classCode, onRestart }: EndingEpicScreenProps) {
  const [showCelebration, setShowCelebration] = useState(false);

  const avatars = [
    { name: 'PILOTO', role: 'Commander', color: 'border-neon-blue text-neon-blue shadow-neon-blue/20', bg: pilotImg },
    { name: 'INGENIERO', role: 'Aether Matrix', color: 'border-neon-purple text-neon-purple shadow-neon-purple/20', bg: engineerImg },
    { name: 'MÉDICO', role: 'Combat Healer', color: 'border-success-green text-success-green shadow-success-green/20', bg: medicImg },
    { name: 'EXPLORADOR', role: 'Crimson Sniper', color: 'border-neon-pink text-neon-pink shadow-neon-pink/20', bg: scoutImg },
    { name: 'ROBOT', role: 'Heavy Chassis', color: 'border-[#ffd700] text-[#ffd700] shadow-[#ffd700]/20', bg: robotImg },
  ];

  const currentAvatar = avatars[avatarIndex] || avatars[0];
  const valeriusImage = valeriusMentor;

  useEffect(() => {
    audioEngine.playMusic('ambient');
    audioEngine.playSFX('level_complete');
    
    const timer = setTimeout(() => {
      setShowCelebration(true);
    }, 4500); // Transition to the global team celebration after 4.5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto py-6 text-center px-4 space-y-8 select-none">
      
      {!showCelebration ? (
        // Cinematic Stage 1: Defeat of Valerius and sealing of the core
        <div className="space-y-8 animate-fade-in">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-success-green/20 border-2 border-success-green flex items-center justify-center shadow-[0_0_20px_rgba(46,204,113,0.4)] animate-bounce">
              <Trophy className="w-8 h-8 text-success-green" />
            </div>
            <h1 className="text-3xl font-orbitron font-black text-success-green tracking-widest uppercase neon-text-green">
              VÓRTICE ESTABILIZADO
            </h1>
            <p className="font-mono text-gray-500 text-[10px] tracking-widest uppercase">
              Estado: Continuum cuántico asegurado al 100%
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Left: Your hero selected avatar */}
            <div className="glass-panel p-6 rounded-3xl border border-success-green/30 bg-black/80 flex flex-col items-center justify-between space-y-4 relative overflow-hidden shadow-[0_0_30px_rgba(46,204,113,0.1)]">
              <div className="absolute inset-0 bg-gradient-to-t from-success-green/20 to-transparent pointer-events-none" />
              
              <span className="text-[10px] font-mono font-bold text-success-green uppercase tracking-widest border border-success-green/30 px-3 py-1 rounded bg-success-green/10">
                LÍDER OPERATIVO RECONOCIDO
              </span>

              <div className="w-40 h-52 rounded-2xl overflow-hidden border-2 border-success-green/60 bg-black shadow-[0_0_25px_rgba(46,204,113,0.2)] relative flex items-center justify-center">
                <img 
                  src={currentAvatar.bg} 
                  alt={currentAvatar.name} 
                  className="w-full h-full object-cover object-top filter saturate-[1.2] brightness-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-cyan-950/10 mix-blend-overlay" />
                <div className="absolute inset-0 flex flex-col justify-between p-3 font-mono text-[9px] text-success-green text-left">
                  <span>TEMP: OPTIMAL</span>
                  <span>SYNC_OK: 100%</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className={`font-orbitron font-black text-base tracking-wide ${currentAvatar.color}`}>
                  UNIDAD {currentAvatar.name}
                </h3>
                <span className="text-xs font-mono text-gray-400 uppercase block">Piloto: {username}</span>
              </div>

              <p className="text-gray-300 font-mono text-xs leading-relaxed max-w-sm italic border-t border-white/10 pt-4">
                &ldquo;¡LO HEMOS CONSEGUIDO, COMANDANTE! Los signos negativos se han alineado con absoluta simetría cuántica. El reactor ha vuelto a su equilibrio natural. Es usted una maldita leyenda del espacio-tiempo.&rdquo;
              </p>
            </div>

            {/* Right: Imprisoned defeated Valerius */}
            <div className="glass-panel p-6 rounded-3xl border border-gray-800 bg-black/80 flex flex-col items-center justify-between space-y-4 relative overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]">
              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest border border-gray-800 px-3 py-1 rounded bg-gray-900/50">
                ESPEJO DE SEGURIDAD CUÁNTICA
              </span>

              <div className="w-40 h-52 rounded-2xl overflow-hidden border-2 border-red-950 bg-black shadow-[inset_0_0_20px_rgba(255,0,0,0.5)] relative flex items-center justify-center filter brightness-50">
                <img 
                  src={valeriusImage} 
                  alt="Lord Valerius" 
                  className="w-full h-full object-cover object-top filter saturate-[0.2] contrast-[1.8] blur-[1px]"
                  referrerPolicy="no-referrer"
                />
                {/* Visual jail bars overlay */}
                <div className="absolute inset-0 flex justify-between px-4 pointer-events-none opacity-40">
                  <div className="w-1.5 h-full bg-cyan-400/50 shadow-[0_0_10px_rgba(0,243,255,0.8)]" />
                  <div className="w-1.5 h-full bg-cyan-400/50 shadow-[0_0_10px_rgba(0,243,255,0.8)]" />
                  <div className="w-1.5 h-full bg-cyan-400/50 shadow-[0_0_10px_rgba(0,243,255,0.8)]" />
                </div>
                <div className="absolute inset-0 flex flex-col justify-between p-3 font-mono text-[9px] text-alert-red text-left">
                  <span>PRISIÓN INTERNA</span>
                  <span>SIG_VAL: SELLADO</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-orbitron font-black text-base text-gray-400 tracking-wide">
                  VALERIUS DESTRONADO
                </h3>
                <span className="text-xs font-mono text-gray-500 uppercase block">Sellado perpetuamente en el Cero</span>
              </div>

              <p className="text-red-400 font-mono text-xs leading-relaxed max-w-sm italic border-t border-white/10 pt-4">
                &ldquo;¡N-NOOO! ¡Esto es científicamente imposible! ¿Cómo ha podido un simple cadete descifrar el álgebra perfecta del fin de los tiempos? ¡Mi imperio... mi obra maestra desvanecida! ¡MALDECIDO SEAS, PILOTO!&rdquo;
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 pt-4">
            <span className="text-xs font-mono text-neon-blue animate-pulse uppercase">Cargando celebración de fin de misión...</span>
            <div className="w-48 h-1.5 bg-gray-900 rounded-full overflow-hidden border border-white/10">
              <div className="h-full bg-gradient-to-r from-neon-blue to-neon-purple animate-loading-bar" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      ) : (
        // Cinematic Stage 2: GRANDIOSE "FIN" CELEBRATION WITH ALL AVATARS CELEBRATING TOGETHER!
        <div className="space-y-8 animate-fade-in-up">
          {/* FIN Title and Team Frame */}
          <div className="space-y-3">
            <div className="inline-block px-4 py-1.5 border border-neon-gold/40 rounded-full bg-neon-gold/5 font-mono text-xs text-neon-gold uppercase tracking-[0.3em] shadow-[0_0_15px_rgba(212,175,55,0.15)] animate-pulse">
              MISIÓN COMPLETADA CON HONORES AL MÁXIMO
            </div>
            <h1 className="text-5xl md:text-7xl font-orbitron font-black text-white tracking-[0.3em] uppercase leading-none drop-shadow-[0_0_30px_rgba(0,243,255,0.4)]">
              FIN
            </h1>
            <p className="font-mono text-neon-blue text-sm tracking-widest uppercase">
              ALIANZA DE LA ACADEMIA APEIRON Y LOS CRONONAUTAS
            </p>
          </div>

          {/* Golden Trophy Hero Card Row with all 5 Avatars Celebrating together! */}
          <div className="glass-panel p-8 rounded-3xl border-2 border-neon-gold/50 bg-black/90 relative overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.15)]">
            {/* Visual party particle decorations */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06),transparent)] pointer-events-none" />
            
            <h3 className="font-orbitron font-bold text-neon-gold text-lg tracking-widest uppercase mb-6 text-center">
              ¡NUESTRO EQUIPO DE HÉROES HA SALVADO EL TIEMPO!
            </h3>

            {/* Row of 5 Avatars */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {avatars.map((av, idx) => (
                <div 
                  key={idx} 
                  className={`glass-panel border-2 rounded-xl p-3 flex flex-col items-center bg-white/5 space-y-2 transition-all duration-300 transform hover:scale-105 ${
                    idx === avatarIndex ? 'border-neon-gold scale-105 shadow-[0_0_15px_rgba(212,175,55,0.25)]' : 'border-gray-800'
                  }`}
                >
                  <div className="w-full aspect-[4/5] rounded-lg overflow-hidden border border-white/10 relative">
                    <img 
                      src={av.bg} 
                      alt={av.name} 
                      className="w-full h-full object-cover object-top filter saturate-[1.25]"
                      referrerPolicy="no-referrer"
                    />
                    {idx === avatarIndex && (
                      <div className="absolute top-1 right-1 bg-neon-gold text-space-black p-1 rounded-md text-[8px] font-mono font-bold uppercase shadow-lg">
                        LÍDER
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <span className="font-orbitron font-black text-xs tracking-wider block text-white">{av.name}</span>
                    <span className="text-[9px] font-mono text-neon-purple block uppercase leading-none mt-0.5">{av.role}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Victory summary text */}
            <p className="mt-8 text-sm text-gray-300 font-mono max-w-2xl mx-auto leading-relaxed border-t border-white/5 pt-6">
              ¡Felicidades, <span className="text-neon-gold font-bold">{username}</span>! Has derrotado la rebelión matemática de Lord Valerius y estabilizado las coordenadas de la Academia Apeiron. Con tu precisión cuántica de <span className="text-neon-blue font-bold">{totalScore} XP</span>, has establecido una nueva era de paz en nuestra aula bajo el código de acceso <span className="text-neon-purple font-bold">{classCode}</span>.
            </p>
          </div>

          {/* Action Buttons to restart the adventure */}
          <div className="w-full max-w-md mx-auto pt-4 flex flex-col gap-3">
            <button
              onClick={() => {
                audioEngine.playSFX('success');
                onRestart();
              }}
              className="w-full bg-gradient-to-r from-neon-gold to-yellow-600 hover:brightness-110 text-space-black font-orbitron font-black py-4 rounded-xl tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all flex items-center justify-center gap-3 active:scale-95 text-sm uppercase"
            >
              <RefreshCw className="w-5 h-5" /> REINICIAR NUEVA SIMULACIÓN TEMPORAL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
