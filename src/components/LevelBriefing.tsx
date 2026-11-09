import React from 'react';
import { Level } from '../types';
import { Shield, Target, Play, CornerDownLeft, Swords } from 'lucide-react';
import { audioEngine } from '../utils/audio';

import valeriusMentor from '../assets/images/valerius_mentor_1782379048430.jpg';
import valeriusVillain from '../assets/images/valerius_villain_1782379071447.jpg';

interface LevelBriefingProps {
  level: Level;
  isVillain: boolean;
  onStart: () => void;
  onBack: () => void;
}

export default function LevelBriefing({ level, isVillain, onStart, onBack }: LevelBriefingProps) {
  const isDarkLevel = isVillain || level.id >= 5;
  const characterImage = isDarkLevel
    ? valeriusVillain
    : valeriusMentor;

  const themeColor = isDarkLevel ? 'text-alert-red' : 'text-neon-blue';
  const themeBorder = isDarkLevel ? 'border-alert-red' : 'border-neon-blue';
  const themeGlow = isDarkLevel ? 'shadow-[0_0_30px_rgba(255,42,109,0.3)]' : 'shadow-[0_0_30px_rgba(0,243,255,0.2)]';

  const typeLabels = {
    energy: 'SISTEMA DE ENERGÍA (Fallo = -10% energía)',
    timer: 'SISTEMA DE TIEMPO (60s. Acierto = +10s. Fallo = no suma)',
    lives: 'SISTEMA DE VIDAS (3 vidas. Fallo = -1 vida)',
    boss: 'SISTEMA ENEMIGO HP (100% HP. Acierto = -10%, Fallo = -10% energía)',
    suddenDeath: 'MUERTE SÚBITA (Un solo fallo = fin del juego)'
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full">
      <div className={`glass-panel w-full rounded-2xl overflow-hidden border-2 ${themeBorder} ${themeGlow} flex flex-col md:flex-row`}>
        
        {/* Left: Commander Artwork */}
        <div className="w-full md:w-2/5 relative h-80 md:h-auto min-h-[300px] bg-gradient-to-t from-black to-deep-void flex items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-neon-purple/20">
          <img
            src={characterImage}
            alt={isDarkLevel ? "Valerius Traidor" : "Director Valerius"}
            className="w-full h-full object-cover object-top"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 text-center">
            <span className={`font-orbitron font-bold text-lg tracking-widest ${themeColor}`}>
              {isDarkLevel ? "MALDORION" : "DIRECTOR VALERIUS"}
            </span>
            <p className="text-xs font-mono text-gray-400 mt-1">
              {isDarkLevel ? "CÉLULA DE CRISIS EXPONENCIAL" : "ESTABILIZADOR DEL TIEMPO"}
            </p>
          </div>
        </div>

        {/* Right: Briefing Specs */}
        <div className="w-full md:w-3/5 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-mono text-xs text-neon-purple bg-neon-purple/15 border border-neon-purple/30 px-3 py-1 rounded">
                ORDEN DE OPERACIÓN
              </span>
              <span className={`font-orbitron text-sm font-bold ${themeColor}`}>
                MISIÓN {level.id}
              </span>
            </div>

            <h2 className="text-2xl font-orbitron font-bold text-white tracking-wider mb-2">
              {level.title.toUpperCase()}
            </h2>

            <p className="text-gray-200 font-inter font-medium text-base md:text-lg leading-relaxed tracking-wide mb-6">
              "{level.intro}"
            </p>

            {/* Specifications Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-black/40 p-4 rounded-xl border border-gray-800 flex items-start gap-3">
                <Target className={`w-5 h-5 ${themeColor} shrink-0 mt-0.5`} />
                <div>
                  <span className="text-[10px] font-mono text-gray-500 block">OBJETIVO CENTRAL</span>
                  <span className="font-orbitron font-bold text-sm text-white">{level.objective}</span>
                </div>
              </div>

              <div className="bg-black/40 p-4 rounded-xl border border-gray-800 flex items-start gap-3">
                <Shield className="w-5 h-5 text-neon-purple shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-mono text-gray-500 block">REQUISITO DE CORRECCIÓN</span>
                  <span className="font-orbitron font-bold text-sm text-white">{level.condition}</span>
                </div>
              </div>
            </div>

            {/* Tactical Engine Mechanics Alert */}
            <div className="bg-white/5 p-4 rounded-xl border-l-4 border-neon-purple/60 mb-6 flex gap-3 items-center">
              <Swords className="w-5 h-5 text-neon-purple" />
              <div>
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Regla Especial del Nivel</p>
                <p className="text-sm font-bold text-gray-200">{typeLabels[level.type]}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-800">
            <button
              onClick={() => {
                audioEngine.playSFX('click');
                onBack();
              }}
              className="flex-1 border border-gray-700 hover:border-white text-gray-400 hover:text-white font-orbitron font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              <CornerDownLeft className="w-4 h-4" /> REGRESAR
            </button>
            <button
              onClick={() => {
                audioEngine.playSFX('success');
                onStart();
              }}
              className={`flex-1 bg-gradient-to-r ${isDarkLevel ? 'from-alert-red to-orange-700' : 'from-neon-blue to-blue-600'} text-space-black font-orbitron font-bold py-3 rounded-lg flex items-center justify-center gap-2 tracking-wider transition-all shadow-lg active:scale-95`}
            >
              INICIAR MISIÓN <Play className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
