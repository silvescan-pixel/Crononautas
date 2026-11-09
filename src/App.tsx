import React, { useState, useEffect, useRef } from 'react';
import { Level, PlayerState, StudentResult, ClassroomCode } from './types';
import { audioEngine } from './utils/audio';
import RadarChart from './components/RadarChart';
import TeacherPanel from './components/TeacherPanel';
import NarrativeScreen from './components/NarrativeScreen';
import LevelBriefing from './components/LevelBriefing';
import PlayerCard from './components/PlayerCard';
import GameplayScreen from './components/GameplayScreen';
import GlitchScreen from './components/GlitchScreen';
import EndingFailScreen from './components/EndingFailScreen';
import EndingEpicScreen from './components/EndingEpicScreen';
import { Volume2, VolumeX, ShieldAlert, Award, FileSpreadsheet, Lock, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

import pilotImg from './assets/images/pilot_1782379157418.jpg';
import engineerImg from './assets/images/engineer_1782379087922.jpg';
import medicImg from './assets/images/medic_1782379137310.jpg';
import scoutImg from './assets/images/scout_1782379121630.jpg';
import robotImg from './assets/images/robot_1782379104231.jpg';
import valeriusMentor from './assets/images/valerius_mentor_1782379048430.jpg';

const levels: Level[] = [
  {
    id: 1,
    title: "Calibración Térmica",
    bg: "https://images.unsplash.com/photo-1581093458891-8f30869815bb?q=80&w=1920",
    icon: "Sliders",
    desc: "Ajuste de escudos térmicos con sumas y restas de números enteros.",
    intro: "Bienvenido, piloto. Los escudos térmicos de nuestra fragata están fluctuando. Necesitamos calibrar la matriz mediante sumas y restas básicas para resistir el calor del hiperespacio.",
    objective: "Sumas y restas básicas de enteros",
    condition: "Acertar 12 de 15 operaciones",
    questions: 15,
    passScore: 12,
    type: 'energy'
  },
  {
    id: 2,
    title: "Gravedad Artificial",
    bg: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1920",
    icon: "Hurricane",
    desc: "Estabilización rotacional mediante multiplicaciones y divisiones exactas.",
    intro: "¡La gravedad artificial ha colapsado! La fuerza rotacional se rige por multiplicaciones y divisiones de números enteros. Resuelve con precisión o saldremos flotando hacia el olvido.",
    objective: "Multiplicaciones y divisiones enteras",
    condition: "Acertar 12 de 15 operaciones bajo tiempo",
    questions: 15,
    passScore: 12,
    type: 'timer'
  },
  {
    id: 3,
    title: "Cinturón de Asteroides",
    bg: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=1920",
    icon: "Meteor",
    desc: "Maniobras evasivas usando operaciones de signos aleatorios.",
    intro: "¡Cuidado! Nos adentramos en un denso campo de asteroides. Las operaciones mixtas activan los propulsores laterales. Tienes 3 escudos protectores; un error estructural dañará la nave.",
    objective: "Operaciones aleatorias mixtas",
    condition: "Sobrevivir 15 asteroides con menos de 3 fallos",
    questions: 15,
    passScore: 12,
    type: 'lives'
  },
  {
    id: 4,
    title: "El Guardián Jerárquico",
    bg: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920",
    icon: "Dungeon",
    desc: "Apertura del portal dimensional con operaciones combinadas y corchetes.",
    intro: "El Guardián del Vórtice bloquea la salida. Su cerradura cuántica requiere aplicar la jerarquía estricta de operaciones con corchetes y multiplicaciones. Cada acierto daña su escudo un 12.5%.",
    objective: "Jerarquía de operaciones y corchetes",
    condition: "Vencer al Guardián resolviendo 8 combinadas",
    questions: 10,
    passScore: 8,
    type: 'boss'
  },
  {
    id: 5,
    title: "Inversión Exponencial",
    bg: "https://images.unsplash.com/photo-1614730341194-75c60740a123?q=80&w=1920",
    icon: "Cube",
    desc: "Dominio de potencias con bases negativas y exponentes pares e impares.",
    intro: "¡Jajaja! ¿Creías que el Director te guiaría para siempre? Bienvenido a mi dimensión exponencial, cadete. Las potencias gobiernan la materia aquí. Resuelve bases negativas con precisión o te desintegraré.",
    objective: "Potencias de números enteros",
    condition: "Calibrar 8 de 10 potencias complejas",
    questions: 10,
    passScore: 8,
    type: 'energy',
    isSecret: true
  },
  {
    id: 6,
    title: "El Núcleo del Cero",
    bg: "https://images.unsplash.com/photo-1614730341194-75c60740a123?q=80&w=1920",
    icon: "Sun",
    desc: "Sobrecarga del núcleo con la ecuación maestra definitiva.",
    intro: "Este es el núcleo de la grieta. La ecuación maestra definitiva combina todas las reglas, potencias, corchetes y signos. La sobrecarga no tolera fallos: un solo error causará un colapso total.",
    objective: "Ecuación matemática unificada",
    condition: "10 de 10 aciertos perfectos (Muerte Súbita)",
    questions: 10,
    passScore: 10,
    type: 'suddenDeath',
    isSecret: true
  }
];

export default function App() {
  const [view, setView] = useState<'login' | 'narrative' | 'avatar' | 'hub' | 'briefing' | 'game' | 'results' | 'glitch' | 'ending_fail' | 'ending_epic'>('login');
  const [activeMapTab, setActiveMapTab] = useState<'apeiron' | 'fracture'>('apeiron');
  const [usernameInput, setUsernameInput] = useState('');
  const [classCodeInput, setClassCodeInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Player State
  const [playerState, setPlayerState] = useState<PlayerState>({
    username: '',
    avatarIndex: 0,
    unlockedLevels: [1],
    completedLevels: [],
    totalScore: 0,
    levelHistory: {},
    skillStats: { addsub: 0, multdiv: 0, agility: 0, logic: 0 },
    currentClassCode: ''
  });

  // Level States
  const [activeLevel, setActiveLevel] = useState<Level | null>(null);
  const [gameResult, setGameResult] = useState<{ passed: boolean; score: number; failReason: string } | null>(null);

  // UI States
  const [showTeacherPanel, setShowTeacherPanel] = useState(false);
  const [showPlayerCard, setShowPlayerCard] = useState(false);
  const [isVillain, setIsVillain] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  // Long press timer ref for teacher panel
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initial seeds
    if (!localStorage.getItem('crononautas_classroom_codes')) {
      const defaultCodes: ClassroomCode[] = [
        { code: 'APEIRON', description: 'Código inicial de la Academia', createdAt: new Date().toLocaleDateString() },
        { code: 'ESO1', description: 'Primer Curso de Secundaria', createdAt: new Date().toLocaleDateString() },
        { code: 'ESO2', description: 'Segundo Curso de Secundaria', createdAt: new Date().toLocaleDateString() },
      ];
      localStorage.setItem('crononautas_classroom_codes', JSON.stringify(defaultCodes));
    }
  }, []);

  const handleTeacherPressStart = () => {
    pressTimerRef.current = setTimeout(() => {
      audioEngine.playSFX('glitch');
      setShowTeacherPanel(true);
    }, 5000); // 5 seconds holding triggers teacher panel
  };

  const handleTeacherPressEnd = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const toggleSound = () => {
    const isPlaying = audioEngine.toggleMusic();
    setSoundOn(isPlaying);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanUsername = usernameInput.trim().toUpperCase();
    const cleanClassCode = classCodeInput.trim().toUpperCase();

    if (!cleanUsername) {
      setLoginError('Identificador del piloto requerido.');
      return;
    }

    if (!cleanClassCode) {
      setLoginError('Código de aula requerido.');
      return;
    }

    // Validate Classroom code
    const storedCodesRaw = localStorage.getItem('crononautas_classroom_codes');
    const storedCodes: ClassroomCode[] = storedCodesRaw ? JSON.parse(storedCodesRaw) : [];
    
    const codeExists = storedCodes.some(c => c.code === cleanClassCode);
    if (!codeExists) {
      setLoginError('Código de aula incorrecto o inactivo.');
      return;
    }

    // Create / Load player profiles
    const savedProfilesRaw = localStorage.getItem(`crononautas_profile_${cleanUsername}`);
    if (savedProfilesRaw) {
      const parsed = JSON.parse(savedProfilesRaw);
      setPlayerState({
        ...parsed,
        currentClassCode: cleanClassCode
      });
      // Check if villain is already revealed (Level 4 completed with perfect score)
      if (parsed.unlockedLevels.includes(5)) {
        setIsVillain(true);
        setActiveMapTab('fracture');
        setTimeout(() => audioEngine.playMusic('boss'), 100);
      } else {
        setIsVillain(false);
        setActiveMapTab('apeiron');
        setTimeout(() => audioEngine.playMusic('ambient'), 100);
      }
      setView('hub');
    } else {
      setPlayerState({
        username: cleanUsername,
        avatarIndex: 0,
        unlockedLevels: [1],
        completedLevels: [],
        totalScore: 0,
        levelHistory: {},
        skillStats: { addsub: 0, multdiv: 0, agility: 0, logic: 0 },
        currentClassCode: cleanClassCode
      });
      setView('narrative');
    }

    // Play music automatically upon login
    audioEngine.startBackgroundMusic();
    setSoundOn(true);
  };

  const handleConfirmAvatar = (index: number) => {
    const updated = {
      ...playerState,
      avatarIndex: index
    };
    setPlayerState(updated);
    savePlayerProfile(updated);
    setView('hub');
  };

  const handleStartLevel = (level: Level) => {
    setActiveLevel(level);
    setView('briefing');
  };

  const handleLaunchLevel = () => {
    setView('game');
  };

  const handleFinishLevel = (passed: boolean, score: number, failReason: string) => {
    if (!activeLevel) return;

    // Calculate precision
    const pct = Math.round((score / activeLevel.questions) * 100);

    // Update history
    const updatedHistory = { ...playerState.levelHistory };
    const bestScore = updatedHistory[activeLevel.id] 
      ? Math.max(updatedHistory[activeLevel.id].bestScore, score)
      : score;

    updatedHistory[activeLevel.id] = {
      bestScore,
      max: activeLevel.questions,
      pct,
      passed: passed || (updatedHistory[activeLevel.id]?.passed ?? false)
    };

    // Calculate new totalScore
    const totalScore = Object.values(updatedHistory).reduce((sum: number, h: any) => sum + h.bestScore * 10, 0);

    // Calculate completed levels
    const completedLevels = [...playerState.completedLevels];
    if (passed && !completedLevels.includes(activeLevel.id)) {
      completedLevels.push(activeLevel.id);
    }

    // Unlocking mechanics
    const unlockedLevels = [...playerState.unlockedLevels];
    
    // Level 5 Exponential triggers when completing Level 4 with perfect score (10/10)
    if (activeLevel.id === 4 && score === 10 && !unlockedLevels.includes(5)) {
      unlockedLevels.push(5);
    }
    // Standard unlock progression
    if (activeLevel.id !== 4 && passed && !unlockedLevels.includes(activeLevel.id + 1) && (activeLevel.id + 1 <= 6)) {
      unlockedLevels.push(activeLevel.id + 1);
    }
    // Level 6 unlocks if level 5 is completed
    if (activeLevel.id === 5 && passed && !unlockedLevels.includes(6)) {
      unlockedLevels.push(6);
    }

    // Update Radar Chart Metrics
    const skillStats = { ...playerState.skillStats };
    if (activeLevel.id === 1 && passed) skillStats.addsub = Math.min(100, skillStats.addsub + 20);
    if (activeLevel.id === 2 && passed) skillStats.multdiv = Math.min(100, skillStats.multdiv + 20);
    if (activeLevel.id === 3 && passed) skillStats.agility = Math.min(100, skillStats.agility + 20);
    if (activeLevel.id >= 4 && passed) skillStats.logic = Math.min(100, skillStats.logic + 20);

    // Save final updated states
    const updatedState: PlayerState = {
      ...playerState,
      completedLevels,
      unlockedLevels,
      totalScore,
      levelHistory: updatedHistory,
      skillStats
    };

    setPlayerState(updatedState);
    savePlayerProfile(updatedState);

    // Record results inside classroom grades for teacher panel
    saveStudentGrade(updatedState, activeLevel.id, passed);

    // Check for villain plot-twist trigger (perfect score on Level 4 for the first time)
    const isNewSecretUnlock = activeLevel.id === 4 && score === 10 && !playerState.unlockedLevels.includes(5);

    setGameResult({ passed, score, failReason });

    if (isNewSecretUnlock) {
      setView('glitch');
    } else if (isVillain && !passed) {
      setView('ending_fail');
    } else if (isVillain && passed && activeLevel.id === 6) {
      setView('ending_epic');
    } else {
      setView('results');
    }
  };

  const savePlayerProfile = (state: PlayerState) => {
    localStorage.setItem(`crononautas_profile_${state.username}`, JSON.stringify(state));
  };

  const saveStudentGrade = (state: PlayerState, levelId: number, passed: boolean) => {
    const rawResults = localStorage.getItem('crononautas_student_results');
    const resultsList: StudentResult[] = rawResults ? JSON.parse(rawResults) : [];

    // Calculate overall precision
    let totalPct = 0;
    let count = 0;
    Object.values(state.levelHistory).forEach(h => {
      totalPct += h.pct;
      count++;
    });
    const precision = count > 0 ? Math.round(totalPct / count) : 0;

    const existingIndex = resultsList.findIndex(r => r.username === state.username && r.code === state.currentClassCode);

    const newResult: StudentResult = {
      id: `res-${Math.floor(Math.random() * 900000) + 100000}`,
      username: state.username,
      code: state.currentClassCode,
      date: new Date().toLocaleDateString(),
      totalScore: state.totalScore,
      precision,
      levelHistory: state.levelHistory
    };

    if (existingIndex >= 0) {
      resultsList[existingIndex] = newResult;
    } else {
      resultsList.push(newResult);
    }

    localStorage.setItem('crononautas_student_results', JSON.stringify(resultsList));
  };

  return (
    <div className={`min-h-screen bg-space-black flex flex-col justify-between select-none relative overflow-hidden transition-all duration-700 ${
      isVillain ? 'border-t-4 border-alert-red' : 'border-t-4 border-neon-blue'
    }`}>
      
      {/* Aesthetic Scanline effect */}
      <div className="absolute inset-0 scanline pointer-events-none h-20 opacity-20 z-40"></div>
      
      {/* Background Starfield and Grid Patterns */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter brightness-[0.22] contrast-[1.1] transition-all duration-1000 z-0"
        style={{ 
          backgroundImage: `url('${
            view === 'login' ? 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1920' : 
            view === 'game' && activeLevel ? activeLevel.bg : 
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920'
          }')`,
          filter: isVillain ? 'brightness(0.18) contrast(1.3) hue-rotate(310deg)' : 'brightness(0.22) contrast(1.1)'
        }}
      ></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(176,38,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(176,38,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-25 z-0 pointer-events-none"></div>

      {/* Main Header */}
      <header className={`relative z-10 p-4 border-b border-white/10 ${
        isVillain ? 'bg-black/90' : 'bg-deep-void/80'
      } backdrop-blur-md flex justify-between items-center transition-colors duration-500`}>
        <div 
          onMouseDown={handleTeacherPressStart}
          onMouseUp={handleTeacherPressEnd}
          onTouchStart={handleTeacherPressStart}
          onTouchEnd={handleTeacherPressEnd}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-500 ${
            isVillain 
              ? 'border-alert-red bg-alert-red/10 shadow-[0_0_15px_rgba(255,42,109,0.3)]' 
              : 'border-neon-blue bg-neon-blue/10 shadow-[0_0_15px_rgba(0,243,255,0.3)]'
          }`}>
            <ShieldAlert className={`w-6 h-6 ${isVillain ? 'text-alert-red' : 'text-neon-blue'} animate-pulse`} />
          </div>
          <div>
            <h1 className={`text-xl md:text-2xl font-orbitron font-black tracking-widest text-white transition-all duration-500 ${
              isVillain ? 'neon-text-red' : 'neon-text-blue'
            }`}>
              CRONONAUTAS
            </h1>
            <p className="text-[10px] font-mono text-neon-purple tracking-[0.2em] uppercase leading-none mt-1">
              {isVillain ? "La fractura del cero (REVELIÓN)" : "ACADEMIA APEIRON"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Sound Control */}
          <button
            onClick={toggleSound}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
              soundOn 
                ? (isVillain ? 'border-alert-red text-alert-red bg-alert-red/10' : 'border-neon-blue text-neon-blue bg-neon-blue/10') 
                : 'border-gray-700 text-gray-500 hover:text-white'
            }`}
          >
            {soundOn ? <Volume2 className="w-5 h-5 animate-bounce" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {playerState.username && (
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-[10px] font-mono text-gray-400">PILOTO DE ASALTO</span>
              <span className="font-orbitron font-bold text-sm text-white tracking-wide uppercase">{playerState.username}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Window router */}
      <main className="relative z-10 flex-grow flex flex-col justify-center py-6 px-4">
        
        {/* VIEW: LOGIN SCREEN */}
        {view === 'login' && (
          <div className="w-full max-w-lg mx-auto py-6 animate-fade-in">
            <div className={`glass-panel p-8 md:p-10 rounded-3xl border-2 shadow-2xl relative overflow-hidden flex flex-col items-center text-center transition-colors duration-500 ${
              isVillain ? 'border-alert-red shadow-alert-red/10' : 'border-neon-blue shadow-neon-blue/10'
            }`}>
              {/* Spinning Logo spaceship animation */}
              <div className="w-28 h-28 mb-6 relative animate-float">
                <svg viewBox="0 0 32 32" className="w-full h-full">
                  <path 
                    d="M16 2 L28 14 L20 18 L24 24 L16 30 L8 24 L12 18 L4 14 Z" 
                    fill="none" 
                    stroke={isVillain ? '#ff2a6d' : '#00f3ff'} 
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                  <polygon points="16,8 20,14 12,14" fill={isVillain ? '#ff2a6d' : '#b026ff'} />
                </svg>
              </div>

              <h2 className="text-3xl font-orbitron font-black text-white tracking-widest leading-tight">
                CRONONAUTAS
              </h2>
              <span className="font-mono text-neon-purple text-xs tracking-[0.4em] uppercase block mt-1.5 mb-8">
                LA FRACTURA DEL CERO
              </span>

              <form onSubmit={handleLoginSubmit} className="w-full space-y-6 text-left">
                <div>
                  <label className="text-[10px] font-mono tracking-widest text-cyan-300 block mb-1.5 uppercase">
                    Identificación del Piloto
                  </label>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={e => setUsernameInput(e.target.value)}
                    placeholder="EJ: ALEX-01"
                    maxLength={10}
                    className="w-full bg-black/60 border border-gray-700 rounded-xl p-4 text-center text-xl font-orbitron text-white focus:outline-none focus:border-neon-blue transition-all uppercase placeholder-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono tracking-widest text-cyan-300 block mb-1.5 uppercase">
                    Código de Acceso del Profesor
                  </label>
                  <input
                    type="text"
                    value={classCodeInput}
                    onChange={e => setClassCodeInput(e.target.value)}
                    placeholder="INTRODUCE EL CÓDIGO DE TU AULA"
                    maxLength={12}
                    className="w-full bg-black/60 border border-gray-700 rounded-xl p-4 text-center text-base font-orbitron text-white focus:outline-none focus:border-neon-blue transition-all uppercase placeholder-gray-800"
                    required
                  />
                </div>

                {loginError && (
                  <div className="bg-alert-red/10 border border-alert-red/30 p-3 rounded-lg flex items-center gap-2 text-alert-red text-xs font-mono">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className={`w-full text-space-black font-orbitron font-black text-lg py-4 rounded-xl transition-all shadow-lg hover:brightness-110 active:scale-95 ${
                    isVillain 
                      ? 'bg-alert-red shadow-alert-red/30' 
                      : 'bg-gradient-to-r from-neon-blue to-blue-600 shadow-neon-blue/20 border border-cyan-400'
                  }`}
                >
                  CONECTAR AL VÓRTICE
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW: NARRATIVE DIALOGUE SCREEN */}
        {view === 'narrative' && (
          <NarrativeScreen onComplete={() => setView('avatar')} />
        )}

        {/* VIEW: AVATAR SELECTION */}
        {view === 'avatar' && (
          <div className="w-full max-w-4xl mx-auto py-6 animate-fade-in">
            <div className="glass-panel p-6 md:p-8 rounded-3xl border border-gray-800 text-center flex flex-col items-center">
              <h2 className="text-2xl md:text-3xl font-orbitron font-bold text-white tracking-wide">
                SELECCIONA TU UNIDAD TÁCTICA
              </h2>
              <p className="text-sm text-gray-400 mt-1 font-mono mb-8">
                Elige el droide de asalto Apeiron que te acompañará en la grieta
              </p>

              {/* Grid of Avatars */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 w-full max-w-5xl mb-8">
                {[
                  { name: 'PILOTO', role: 'Commander', color: 'border-neon-blue text-neon-blue', bg: pilotImg },
                  { name: 'INGENIERO', role: 'Aether Matrix', color: 'border-neon-purple text-neon-purple', bg: engineerImg },
                  { name: 'MÉDICO', role: 'Combat Healer', color: 'border-success-green text-success-green', bg: medicImg },
                  { name: 'EXPLORADOR', role: 'Crimson Sniper', color: 'border-neon-pink text-neon-pink', bg: scoutImg },
                  { name: 'ROBOT', role: 'Heavy Chassis', color: 'border-[#ffd700] text-[#ffd700]', bg: robotImg },
                ].map((av, index) => {
                  const isSelected = playerState.avatarIndex === index;
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        audioEngine.playSFX('click');
                        setPlayerState(prev => ({ ...prev, avatarIndex: index }));
                      }}
                      className={`glass-panel border-2 rounded-2xl p-6 flex flex-col items-center justify-between cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                        isSelected 
                          ? `${av.color} scale-105 bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]` 
                          : 'border-gray-800 opacity-60 hover:opacity-100 hover:scale-102'
                      }`}
                    >
                      <div className="w-32 sm:w-36 h-44 sm:h-48 rounded-xl overflow-hidden mb-4 border border-white/10 bg-black shadow-inner">
                        <img 
                          src={av.bg} 
                          alt={av.name} 
                          className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="text-center">
                        <span className="font-orbitron font-black text-sm tracking-wider block text-white">{av.name}</span>
                        <span className="text-xs font-mono text-gray-500 block uppercase mt-1">{av.role}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => handleConfirmAvatar(playerState.avatarIndex)}
                className="bg-neon-blue hover:bg-white text-space-black font-orbitron font-bold py-3 px-12 rounded-xl tracking-wider transition-all active:scale-95 shadow-[0_0_15px_rgba(0,243,255,0.3)]"
              >
                CONFIRMAR ASIGNACIÓN
              </button>
            </div>
          </div>
        )}

        {/* VIEW: MISSION HUB */}
        {view === 'hub' && (
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            
            {/* Left/Middle Column: Mission Map */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-end border-b border-gray-800 pb-2 mb-4">
                <h2 className={`font-orbitron text-xl font-bold tracking-widest ${activeMapTab === 'fracture' ? 'text-alert-red neon-text-red' : 'text-neon-purple'}`}>
                  {activeMapTab === 'fracture' ? 'MAPA DE LA FRACTURA DEL CERO' : 'MAPA DE COORDINADAS TEMPORALES'}
                </h2>
                <span className={`text-[10px] font-mono animate-pulse ${activeMapTab === 'fracture' ? 'text-alert-red' : 'text-neon-blue'}`}>
                  {activeMapTab === 'fracture' ? 'ESTADO: SISTEMA COLAPSADO' : 'ESTADO: CRÍTICO'}
                </span>
              </div>

              {/* Coordinate Map Selector (Tabs) */}
              {(playerState.unlockedLevels.includes(5) || isVillain) && (
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-black/60 border border-gray-800 rounded-xl mb-4">
                  <button
                    onClick={() => {
                      audioEngine.playSFX('click');
                      setActiveMapTab('apeiron');
                      audioEngine.playMusic('ambient');
                    }}
                    className={`font-orbitron font-bold text-[10px] sm:text-xs py-2.5 rounded-lg tracking-widest transition-all ${
                      activeMapTab === 'apeiron'
                        ? 'bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 border border-neon-blue/30 text-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.15)]'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    ACADEMIA APEIRON (FASES 1-4)
                  </button>
                  <button
                    onClick={() => {
                      audioEngine.playSFX('glitch');
                      setActiveMapTab('fracture');
                      audioEngine.playMusic('boss');
                    }}
                    className={`font-orbitron font-bold text-[10px] sm:text-xs py-2.5 rounded-lg tracking-widest transition-all ${
                      activeMapTab === 'fracture'
                        ? 'bg-gradient-to-r from-alert-red/25 to-neon-pink/25 border border-alert-red/30 text-alert-red shadow-[0_0_10px_rgba(255,42,109,0.15)]'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    LA FRACTURA DEL CERO (SECRETAS)
                  </button>
                </div>
              )}

              {/* Levels container with custom watermarks */}
              <div className={`relative p-5 rounded-2xl border transition-all duration-700 ${
                activeMapTab === 'fracture' 
                  ? 'border-alert-red/20 bg-black/70 shadow-[inset_0_0_30px_rgba(255,42,109,0.05)]' 
                  : 'border-gray-800 bg-black/40'
              } overflow-hidden min-h-[320px]`}>
                
                {/* Background Watermark */}
                {activeMapTab === 'fracture' ? (
                  <div 
                    className="absolute right-0 bottom-0 top-0 w-1/2 opacity-15 pointer-events-none bg-no-repeat bg-contain bg-right mix-blend-color-dodge transition-all duration-1000"
                    style={{
                      backgroundImage: `url('${valeriusMentor}')`,
                      filter: 'brightness(0.9) contrast(2.5) hue-rotate(295deg) saturate(200%)',
                    }}
                  ></div>
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,243,255,0.02),transparent)] pointer-events-none transition-all duration-1000"></div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                  {levels
                    .filter(lvl => {
                      if (activeMapTab === 'fracture') return true; // show all 6 levels
                      return lvl.id <= 4; // Map 1 only shows levels 1-4
                    })
                    .map(lvl => {
                      const unlocked = playerState.unlockedLevels.includes(lvl.id);
                      const completed = playerState.completedLevels.includes(lvl.id);
                      const isLevelCorrupted = activeMapTab === 'fracture' && lvl.id <= 4;

                      if (isLevelCorrupted) {
                        return (
                          <div
                            key={lvl.id}
                            onClick={() => {
                              audioEngine.playSFX('glitch');
                            }}
                            className="p-4 rounded-xl border border-red-950 bg-red-950/5 opacity-45 hover:opacity-60 cursor-not-allowed transition-all duration-300 flex justify-between items-start select-none group"
                          >
                            <div className="space-y-1 pr-6 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-alert-red/10 text-alert-red border border-alert-red/20 animate-pulse">
                                  CORRUPTO
                                </span>
                              </div>
                              <h3 className="font-orbitron font-bold text-red-500 text-base tracking-wide truncate max-w-[200px] line-through">
                                {lvl.title.toUpperCase()}
                              </h3>
                              <p className="text-[11px] text-red-950/80 leading-normal font-mono">
                                ACCESO CAÍDO — CÓDIGO FRAGMENTADO
                              </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-red-950 text-red-900 bg-red-950/10">
                              <ShieldAlert className="w-4 h-4 animate-pulse" />
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={lvl.id}
                          onClick={() => unlocked && handleStartLevel(lvl)}
                          className={`p-4 rounded-xl border relative transition-all duration-300 flex justify-between items-start select-none ${
                            unlocked 
                              ? `cursor-pointer ${
                                  activeMapTab === 'fracture'
                                    ? 'border-alert-red/30 hover:border-alert-red hover:bg-alert-red/5 bg-black/40 shadow-[0_0_15px_rgba(255,42,109,0.05)]' 
                                    : 'border-neon-blue/30 hover:border-neon-blue hover:bg-neon-blue/5 bg-black/40'
                                }` 
                              : 'border-gray-900 bg-gray-950/20 opacity-30 cursor-not-allowed'
                          }`}
                        >
                          <div className="space-y-1 pr-6 flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                                lvl.isSecret ? 'bg-alert-red/10 text-alert-red border border-alert-red/20' : 'bg-neon-purple/10 text-neon-purple'
                              }`}>
                                {lvl.isSecret ? 'SECRETO' : `FASE ${lvl.id}`}
                              </span>
                              {completed && (
                                <span className="text-success-green font-mono text-[9px] flex items-center gap-0.5">
                                  <CheckCircle className="w-3 h-3 fill-current text-success-green text-space-black" /> COMPLETADO
                                </span>
                              )}
                            </div>
                            <h3 className="font-orbitron font-bold text-white text-base tracking-wide truncate max-w-[200px]">
                              {lvl.title.toUpperCase()}
                            </h3>
                            <p className="text-xs text-gray-400 leading-normal line-clamp-2">
                              {unlocked ? lvl.desc : 'COORDENADA ENCRIPTADA'}
                            </p>
                          </div>

                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                            unlocked 
                              ? (activeMapTab === 'fracture' ? 'border-alert-red/30 text-alert-red' : 'border-neon-blue/30 text-neon-blue') 
                              : 'border-gray-800 text-gray-700'
                          }`}>
                            {!unlocked ? <Lock className="w-4 h-4 text-gray-700" /> : <Award className="w-5 h-5" />}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Right Column: Skill Assessment Diagnostic */}
            <div className="glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col justify-between h-fit space-y-6">
              <div className="text-center">
                <h3 className="font-orbitron font-bold text-white text-base tracking-wide uppercase">
                  DIAGNÓSTICO DEL PILOTO
                </h3>
                <p className="text-[10px] font-mono text-neon-purple mt-0.5 tracking-wider uppercase">Habilidades en tiempo real</p>
              </div>

              {/* Radar Chart Component */}
              <div className="w-full flex justify-center">
                <RadarChart stats={playerState.skillStats} isVillain={activeMapTab === 'fracture'} />
              </div>

              {/* Summary */}
              <div className="bg-black/50 border border-gray-800 rounded-xl p-4 font-mono text-xs space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-gray-500">PUNTUACIÓN EXP</span>
                  <span className="text-neon-gold font-bold text-sm">{playerState.totalScore} XP</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">CÓDIGO DE AULA</span>
                  <span className="text-neon-purple font-bold uppercase">{playerState.currentClassCode}</span>
                </div>
              </div>

              {/* Export/Card Buttons */}
              <button
                onClick={() => {
                  audioEngine.playSFX('success');
                  setShowPlayerCard(true);
                }}
                className={`w-full text-space-black font-orbitron font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 tracking-widest transition-all hover:brightness-110 shadow-lg ${
                  isVillain 
                    ? 'bg-alert-red shadow-alert-red/20' 
                    : 'bg-neon-blue shadow-neon-blue/20'
                }`}
              >
                <Award className="w-4 h-4" /> VER TARJETA DE JUGADOR
              </button>

              {/* Debug/Tester Utility Panel */}
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/5">
                <button
                  onClick={() => {
                    audioEngine.playSFX('click');
                    setView('narrative');
                  }}
                  className="bg-black/50 hover:bg-black/90 border border-gray-800 text-gray-300 font-mono text-[10px] py-2 rounded-lg transition-all uppercase tracking-wider flex items-center justify-center gap-1 hover:text-neon-blue hover:border-neon-blue/40"
                  title="Ver de nuevo el diálogo inicial del Director Valerius"
                >
                  Ver Prólogo
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("¿Estás seguro de que deseas reiniciar todo tu progreso de juego? Se borrará tu puntuación, nivel actual, historial y se iniciará la intro.")) {
                      audioEngine.playSFX('glitch');
                      const resetState = {
                        username: playerState.username,
                        avatarIndex: 0,
                        unlockedLevels: [1],
                        completedLevels: [],
                        totalScore: 0,
                        levelHistory: {},
                        skillStats: { addsub: 0, multdiv: 0, agility: 0, logic: 0 },
                        currentClassCode: playerState.currentClassCode
                      };
                      setPlayerState(resetState);
                      savePlayerProfile(resetState);
                      setView('narrative');
                    }
                  }}
                  className="bg-red-950/10 hover:bg-red-950/40 border border-red-900/20 text-red-400 hover:text-red-300 font-mono text-[10px] py-2 rounded-lg transition-all uppercase tracking-wider flex items-center justify-center gap-1 hover:border-red-500/40"
                  title="Borrar puntuación XP e historial de fases para volver a jugar"
                >
                  <RefreshCw className="w-3 h-3 text-red-500" /> Reiniciar XP
                </button>
              </div>
            </div>

          </div>
        )}

        {/* VIEW: LEVEL BRIEFING */}
        {view === 'briefing' && activeLevel && (
          <LevelBriefing
            level={activeLevel}
            isVillain={isVillain}
            onStart={handleLaunchLevel}
            onBack={() => setView('hub')}
          />
        )}

        {/* VIEW: ACTIVE GAMEPLAY */}
        {view === 'game' && activeLevel && (
          <GameplayScreen
            level={activeLevel}
            isVillain={isVillain}
            username={playerState.username}
            onFinish={handleFinishLevel}
          />
        )}

        {/* VIEW: GLITCH SYSTEM REVELATION SCENE */}
        {view === 'glitch' && (
          <GlitchScreen
            username={playerState.username}
            onComplete={() => {
              setIsVillain(true);
              setActiveMapTab('fracture');
              setView('hub');
              audioEngine.playMusic('boss');
            }}
          />
        )}

        {/* VIEW: RESULTS SUMMARY */}
        {view === 'results' && gameResult && activeLevel && (
          <div className="w-full max-w-lg mx-auto py-6 animate-fade-in">
            <div className={`glass-panel p-8 rounded-3xl border-2 text-center relative flex flex-col items-center ${
              gameResult.passed ? 'border-success-green shadow-success-green/10' : 'border-alert-red shadow-alert-red/10'
            }`}>
              {/* Giant Trophy/Warning Icon */}
              <div className={`w-20 h-20 rounded-full flex items-center justify-center border-2 mb-6 ${
                gameResult.passed 
                  ? 'border-success-green bg-success-green/10 text-success-green shadow-[0_0_15px_rgba(0,255,157,0.3)] animate-bounce' 
                  : 'border-alert-red bg-alert-red/10 text-alert-red shadow-[0_0_15px_rgba(255,42,109,0.3)] animate-pulse'
              }`}>
                {gameResult.passed ? <CheckCircle className="w-10 h-10" /> : <ShieldAlert className="w-10 h-10" />}
              </div>

              <h2 className={`text-3xl font-orbitron font-black tracking-wide ${
                gameResult.passed ? 'text-success-green neon-text-green' : 'text-alert-red neon-text-red'
              }`}>
                {gameResult.passed ? 'MISIÓN CUMPLIDA' : 'MISIÓN FALLIDA'}
              </h2>
              <p className="text-gray-400 font-mono text-xs uppercase mt-1 mb-8">NIVEL {activeLevel.id}: RESULTADO</p>

              {/* Stats Box */}
              <div className="grid grid-cols-2 gap-4 w-full mb-8">
                <div className="bg-black/50 border border-gray-800 p-4 rounded-xl text-center">
                  <span className="text-[10px] font-mono text-gray-500 block uppercase">OPERACIONES</span>
                  <span className={`text-2xl font-orbitron font-bold ${gameResult.passed ? 'text-success-green' : 'text-white'}`}>
                    {gameResult.score}/{activeLevel.questions}
                  </span>
                </div>

                <div className="bg-black/50 border border-gray-800 p-4 rounded-xl text-center">
                  <span className="text-[10px] font-mono text-gray-500 block uppercase">PUNTOS GANADOS</span>
                  <span className="text-2xl font-orbitron font-bold text-neon-gold">
                    {gameResult.score * 10} XP
                  </span>
                </div>
              </div>

              {/* Failure reason details if any */}
              {!gameResult.passed && gameResult.failReason && (
                <div className="bg-alert-red/10 border border-alert-red/30 p-3.5 rounded-xl text-alert-red font-mono text-xs mb-8 w-full">
                  Motivo: {gameResult.failReason}
                </div>
              )}

              {/* FINAL ABIERTO: If they pass Level 4 but scored < 10 */}
              {activeLevel.id === 4 && gameResult.passed && gameResult.score < 10 && (
                <div className="bg-neon-purple/10 border border-neon-purple/30 p-5 rounded-2xl text-left space-y-2 mb-6 w-full animate-pulse-subtle">
                  <div className="flex items-center gap-1.5 text-neon-pink">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                      INFORME DE MISIÓN: FINAL ABIERTO
                    </span>
                  </div>
                  <h4 className="font-orbitron text-xs font-bold text-white uppercase tracking-wide">
                    La Calibración del Vórtice no encaja...
                  </h4>
                  <p className="text-gray-300 font-mono text-[11px] leading-relaxed">
                    Has derrotado al Guardián Jerárquico y estabilizado temporalmente el sector. El Director Valerius te felicita con una frialdad inusual y te ordena cerrar el simulador de inmediato. 
                  </p>
                  <p className="text-gray-400 font-mono text-[11px] leading-relaxed">
                    Sin embargo, los sensores de telemetría de tu nave registran extrañas fluctuaciones cuánticas de fondo que Valerius parece estar ocultando de forma deliberada. ¿Por qué tiene tanta prisa en que te retires? Sientes que hay un secreto mayor...
                  </p>
                  <div className="pt-2 border-t border-white/5 flex flex-col gap-1 text-[10px] text-neon-blue font-mono font-bold">
                    <span>💡 PISTA DEL CONTINUO:</span>
                    <span className="text-gray-400 font-normal">
                      Intenta conseguir una <strong className="text-neon-blue">precisión perfecta del 100% (10 de 10 aciertos)</strong> en esta Fase 4 para piratear los registros encriptados de la Academia y revelar qué está ocurriendo realmente en la Fractura.
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 w-full">
                <button
                  onClick={() => {
                    audioEngine.playSFX('click');
                    setView('hub');
                  }}
                  className="w-full bg-neon-purple hover:bg-white hover:text-deep-void text-white font-orbitron font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg active:scale-95"
                >
                  MAPA DE NIVELES
                </button>

                {activeLevel.id === 4 && gameResult.passed && gameResult.score < 10 && (
                  <button
                    onClick={() => {
                      audioEngine.playSFX('success');
                      setView('game');
                    }}
                    className="w-full bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/40 hover:border-neon-blue text-neon-blue font-orbitron font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_10px_rgba(0,243,255,0.1)] hover:shadow-[0_0_15px_rgba(0,243,255,0.2)]"
                  >
                    <RefreshCw className="w-4 h-4" /> REINTENTAR ALINEACIÓN PERFECTA (10/10)
                  </button>
                )}

                {!gameResult.passed && (
                  <button
                    onClick={() => {
                      audioEngine.playSFX('success');
                      setView('game');
                    }}
                    className="w-full border border-gray-700 hover:border-white text-gray-300 hover:text-white font-mono py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <RefreshCw className="w-4 h-4" /> REINTENTAR COORDENADA
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: ENDING FAIL SCREEN */}
        {view === 'ending_fail' && (
          <EndingFailScreen
            avatarIndex={playerState.avatarIndex}
            username={playerState.username}
            onRetry={() => {
              setView('game');
            }}
          />
        )}

        {/* VIEW: ENDING EPIC SCREEN */}
        {view === 'ending_epic' && (
          <EndingEpicScreen
            avatarIndex={playerState.avatarIndex}
            username={playerState.username}
            totalScore={playerState.totalScore}
            classCode={playerState.currentClassCode}
            onRestart={() => {
              setPlayerState({
                username: '',
                avatarIndex: 0,
                unlockedLevels: [1],
                completedLevels: [],
                totalScore: 0,
                levelHistory: {},
                skillStats: { addsub: 0, multdiv: 0, agility: 0, logic: 0 },
                currentClassCode: ''
              });
              setIsVillain(false);
              setActiveMapTab('apeiron');
              setView('login');
            }}
          />
        )}

      </main>

      {/* Hidden Teacher Panel Drawer Modal */}
      {showTeacherPanel && (
        <TeacherPanel onClose={() => setShowTeacherPanel(false)} />
      )}

      {/* Student/Player Card Modal */}
      {showPlayerCard && (
        <PlayerCard
          playerState={playerState}
          levels={levels}
          onClose={() => setShowPlayerCard(false)}
        />
      )}

      {/* Simple Tech Footer */}
      <footer className="relative z-10 p-3 border-t border-white/5 bg-black/90 text-center text-[10px] font-mono text-gray-600 flex flex-col sm:flex-row justify-between items-center gap-2 px-6">
        <span>CRONONAUTAS V7.0 PLATINUM EDITION — DESARROLLO INTEGRADO DE MATEMÁTICAS ESO</span>
        <span>ACADEMIA APEIRON COPYRIGHT 2026</span>
      </footer>

    </div>
  );
}
