import React, { useState, useEffect, useRef } from 'react';
import { Level, Problem, LevelHistoryItem } from '../types';
import { mathEngine } from '../utils/mathEngine';
import { audioEngine } from '../utils/audio';
import { Check, X, ShieldAlert, Heart, Send, Delete, AlertCircle, ArrowRight } from 'lucide-react';

import valeriusMentor from '../assets/images/valerius_mentor_1782379048430.jpg';
import valeriusVillain from '../assets/images/valerius_villain_1782379071447.jpg';

interface GameplayScreenProps {
  level: Level;
  isVillain: boolean;
  username: string;
  onFinish: (passed: boolean, score: number, failReason: string) => void;
}

export default function GameplayScreen({ level, isVillain, username, onFinish }: GameplayScreenProps) {
  const [qIndex, setQIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [consecutiveFails, setConsecutiveFails] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [answerInput, setAnswerInput] = useState('');

  // Level specific mechanics
  const [energy, setEnergy] = useState(100); // Level 1, 5
  const [timeLeft, setTimeLeft] = useState(60); // Level 2
  const [lives, setLives] = useState(3); // Level 3
  const [bossHp, setBossHp] = useState(100); // Level 4

  // Adaptive difficulty (Rubber-banding)
  const [adaptiveMode, setAdaptiveMode] = useState<'easy' | 'normal' | 'hard'>('normal');

  // Active problem
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);
  
  // Feedback States
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Floating RPG bubble message
  const [valeriusMessage, setValeriusMessage] = useState(
    isVillain || level.id >= 5
      ? "Demuestra de lo que eres capaz... o perece en el olvido cuántico."
      : "Iniciando calibración del nodo temporal. Atento a los operadores."
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // References
  const inputRef = useRef<HTMLInputElement>(null);

  // Valerius messages arrays
  const messages = {
    correct: [
      "¡Cálculo verificado! La matriz temporal se estabiliza.",
      "Excelente respuesta. Tu resonancia mental es asombrosa.",
      "Respuesta correcta. Los deflectores funcionan con normalidad.",
      "Precisión impecable. Estamos navegando por las coordenadas correctas."
    ],
    incorrect: [
      "¡Fallo detectado! La paradoja se está expandiendo.",
      "Cuidado, ese error desestabiliza nuestros escudos.",
      "La ecuación colapsó. Concéntrate, cadete.",
      "Error de cálculo. El vórtice temporal se agita."
    ],
    streak: [
      "¡Sinergia perfecta! La Fractura está retrocediendo.",
      "¡Impresionante racha! Controlas el continuo matemático.",
      "Sobrecarga de precisión cuántica. ¡Continúa así!"
    ],
    villainCorrect: [
      "¡Eso es! Alimenta mi núcleo del cero con tu inteligencia.",
      "Bien, mi valioso peón. Tu talento sirve a mis propósitos.",
      "Sigue resolviendo... cada acierto acelera mi dominio absoluto."
    ],
    villainIncorrect: [
      "Patético fracaso. Esperaba algo más de resistencia.",
      "Tus errores demuestran la fragilidad de tu mente.",
      "Qué decepción. Pero aun así, tu energía me pertenece."
    ]
  };

  // Trigger sound engine & background music
  useEffect(() => {
    audioEngine.startBackgroundMusic();
    generateNewProblem(0, 'normal');

    // Interval for Level 2 (Timer)
    if (level.type === 'timer') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            onFinish(false, correctCount, "Tiempo de gravedad agotado");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Update Valerius dialogue based on state
  useEffect(() => {
    if (qIndex === 0) {
      setValeriusMessage(
        isVillain || level.id >= 5
          ? "Demuestra de lo que eres capaz... o perece en el olvido cuántico."
          : "Iniciando calibración del nodo temporal. Atento a los operadores."
      );
    }
  }, [qIndex]);

  const generateNewProblem = (index: number, mode: 'easy' | 'normal' | 'hard') => {
    const prob = mathEngine.generate(level.id, index, mode);
    setActiveProblem(prob);
    setAnswerInput('');
    setShowExplanation(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const speakRandom = (type: keyof typeof messages) => {
    const list = messages[type];
    const rand = list[Math.floor(Math.random() * list.length)];
    setValeriusMessage(rand);
  };

  const handleVirtualClick = (char: string) => {
    audioEngine.playSFX('click');
    if (feedback !== null) return;

    if (char === 'back') {
      setAnswerInput(prev => prev.slice(0, -1));
    } else if (char === '+/-') {
      setAnswerInput(prev => {
        if (prev.startsWith('-')) return prev.substring(1);
        return '-' + prev;
      });
    } else {
      setAnswerInput(prev => prev + char);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (feedback !== null || answerInput === '' || answerInput === '-') return;

    const parsed = parseInt(answerInput);
    if (isNaN(parsed)) return;

    const isCorrect = parsed === activeProblem?.answer;

    if (isCorrect) {
      // SUCCESS LÓGICA
      setFeedback('correct');
      audioEngine.playSFX('success');
      setCorrectCount(prev => prev + 1);
      
      const newStreak = correctStreak + 1;
      setCorrectStreak(newStreak);
      setConsecutiveFails(0);

      // Handle Rubber-banding difficulty
      let nextMode = adaptiveMode;
      if (newStreak >= 3) {
        nextMode = 'hard';
        setAdaptiveMode('hard');
      } else if (consecutiveFails === 0 && nextMode === 'easy') {
        nextMode = 'normal';
        setAdaptiveMode('normal');
      }

      // Speech bubble
      if (newStreak >= 3) {
        speakRandom('streak');
      } else {
        speakRandom(isVillain || level.id >= 5 ? 'villainCorrect' : 'correct');
      }

      // Apply Level specific successes
      if (level.type === 'timer') {
        setTimeLeft(prev => Math.min(prev + 10, 120));
      } else if (level.type === 'boss') {
        setBossHp(prev => Math.max(prev - 12.5, 0)); // 8 correct takes down 100% HP
      }

      // Advanced level flow
      setTimeout(() => {
        setFeedback(null);
        const nextIndex = qIndex + 1;
        if (nextIndex >= level.questions) {
          // Success Game complete!
          audioEngine.playSFX('level_complete');
          onFinish(true, correctCount + 1, "");
        } else {
          setQIndex(nextIndex);
          generateNewProblem(nextIndex, nextMode);
        }
      }, 1000);

    } else {
      // FAILURE LÓGICA
      setFeedback('incorrect');
      audioEngine.playSFX('error');
      
      const newFails = consecutiveFails + 1;
      setConsecutiveFails(newFails);
      setCorrectStreak(0);

      // Rubber-banding
      let nextMode = adaptiveMode;
      if (newFails >= 2) {
        nextMode = 'easy';
        setAdaptiveMode('easy');
      } else if (nextMode === 'hard') {
        nextMode = 'normal';
        setAdaptiveMode('normal');
      }

      if (level.type === 'timer') {
        // Adaptive time cushion: students who struggle are given +12 seconds buffer to solve problems calmly
        setTimeLeft(prev => Math.min(prev + 12, 120));
      }

      speakRandom(isVillain || level.id >= 5 ? 'villainIncorrect' : 'incorrect');

      // Deduct health assets
      let over = false;
      let failReasonText = "";

      if (level.type === 'energy' || level.type === 'boss') {
        setEnergy(prev => {
          const next = prev - 10;
          if (next <= 0) {
            over = true;
            failReasonText = "Fallo crítico de energía general.";
          }
          return next;
        });
      } else if (level.type === 'lives') {
        setLives(prev => {
          const next = prev - 1;
          if (next <= 0) {
            over = true;
            failReasonText = "Sistemas destruidos. Vidas agotadas.";
          }
          return next;
        });
      } else if (level.type === 'suddenDeath') {
        over = true;
        failReasonText = "Fallo de resonancia cuántica en Muerte Súbita.";
      }

      setShowExplanation(true);

      // Continue step
      setTimeout(() => {
        setFeedback(null);
        if (over) {
          onFinish(false, correctCount, failReasonText);
        } else {
          const nextIndex = qIndex + 1;
          if (nextIndex >= level.questions) {
            if (correctCount >= level.passScore) {
              onFinish(true, correctCount, "");
            } else {
              onFinish(false, correctCount, "Aciertos insuficientes para estabilizar.");
            }
          } else {
            setQIndex(nextIndex);
            generateNewProblem(nextIndex, nextMode);
          }
        }
      }, 3800); // Give 3.8s to read the explanation card
    }
  };

  // Render correct metric values
  const renderHUDMetric = () => {
    if (level.type === 'lives') {
      return (
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-400">VIDAS:</span>
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart 
                key={i} 
                className={`w-5 h-5 ${i < lives ? 'text-alert-red fill-alert-red animate-pulse' : 'text-gray-700'}`} 
              />
            ))}
          </div>
        </div>
      );
    }

    if (level.type === 'timer') {
      const percentage = Math.min(100, (timeLeft / 120) * 100);
      return (
        <div className="w-full">
          <div className="flex justify-between items-center text-xs font-mono text-gray-400 mb-1">
            <span className="flex items-center gap-1.5">
              TIEMPO EXTRAÍDO: {timeLeft}s
              {feedback === 'incorrect' && (
                <span className="text-success-green animate-pulse font-bold text-[10px] bg-success-green/10 px-1.5 py-0.5 rounded border border-success-green/20">
                  +12s ADAPTATIVO
                </span>
              )}
            </span>
            <span>MÁX: 120s</span>
          </div>
          <div className="h-4 bg-gray-900 border border-gray-800 rounded-full overflow-hidden relative shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-neon-purple to-neon-pink transition-all duration-300"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      );
    }

    if (level.type === 'boss') {
      return (
        <div className="w-full space-y-2">
          {/* Boss HP Bar */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono text-alert-red mb-1">
              <span className="font-bold flex items-center gap-1">
                <ShieldAlert className="w-4 h-4 animate-bounce" /> BOSS HP: {bossHp}%
              </span>
            </div>
            <div className="h-3 bg-gray-950 border border-alert-red/30 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-alert-red transition-all duration-500 shadow-[0_0_10px_#ff2a6d]"
                style={{ width: `${bossHp}%` }}
              ></div>
            </div>
          </div>

          {/* Player Energy Bar */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono text-neon-blue">
              <span>ENERGÍA DE LA NAVE: {energy}%</span>
            </div>
            <div className="h-3 bg-gray-950 border border-neon-blue/30 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-neon-blue transition-all duration-500 shadow-[0_0_10px_#00f3ff]"
                style={{ width: `${energy}%` }}
              ></div>
            </div>
          </div>
        </div>
      );
    }

    if (level.type === 'suddenDeath') {
      return (
        <div className="bg-alert-red/10 border border-alert-red/30 p-2.5 rounded-lg flex items-center gap-2 text-alert-red animate-pulse">
          <ShieldAlert className="w-5 h-5" />
          <span className="font-orbitron font-bold text-xs tracking-widest uppercase">
            MODO INSTANT-KILL ACTIVADO (Fallo = Muerte)
          </span>
        </div>
      );
    }

    // Default: Energy Bar (Level 1, 5)
    return (
      <div className="w-full">
        <div className="flex justify-between items-center text-xs font-mono text-gray-400 mb-1">
          <span>ESTABILIDAD NÚCLEO: {energy}%</span>
          <span>FALLO = -10%</span>
        </div>
        <div className="h-4 bg-gray-900 border border-gray-800 rounded-full overflow-hidden relative shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-neon-blue to-blue-600 transition-all duration-500 shadow-[0_0_10px_rgba(0,243,255,0.3)]"
            style={{ width: `${energy}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-grow flex flex-col justify-between max-w-4xl w-full mx-auto p-2 relative">
      
      {/* Top HUD Display */}
      <div className="glass-panel p-5 rounded-2xl border border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl z-10 mb-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-white/5 border border-gray-800 px-3 py-1.5 rounded-lg text-center shrink-0">
            <span className="text-[10px] font-mono text-gray-500 block uppercase">NIVEL {level.id}</span>
            <span className="font-orbitron text-sm font-bold text-white tracking-wider">FASE {qIndex + 1}/{level.questions}</span>
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-white leading-none">{level.title.toUpperCase()}</h3>
            <span className="font-mono text-[10px] text-neon-purple uppercase mt-1 block">RANGO: {adaptiveMode.toUpperCase()}</span>
          </div>
        </div>

        <div className="flex-1 w-full max-w-sm">
          {renderHUDMetric()}
        </div>

        <div className="text-right w-full md:w-auto shrink-0">
          <span className="text-[10px] font-mono text-gray-500 block">PUNTUACIÓN OBTENIDA</span>
          <span className="font-orbitron font-black text-xl text-success-green tracking-wide">
            {correctCount * 10} XP
          </span>
        </div>
      </div>

      {/* Main Core Display (Math & NPC dialogue) */}
      <div className="flex-grow flex flex-col justify-center items-center py-4 relative">
        
        {/* Floating NPC Dialogue Area */}
        <div className="w-full max-w-xl mb-4 min-h-[6rem] h-auto py-1 flex items-center justify-center">
          <div className="bg-gray-950/98 border-2 border-neon-purple rounded-xl p-4 flex items-center gap-3 shadow-2xl relative max-w-md w-full animate-float">
            <div className="w-12 h-12 rounded-full border border-neon-purple overflow-hidden shrink-0 bg-black">
              <img 
                src={isVillain || level.id >= 5 ? valeriusVillain : valeriusMentor} 
                alt="Valerius face"
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1">
              <span className={`text-[10px] font-mono block ${isVillain || level.id >= 5 ? 'text-alert-red' : 'text-neon-purple'} font-bold tracking-widest uppercase`}>
                {isVillain || level.id >= 5 ? "VALERIUS CORROMPIDO" : "DIRECTOR VALERIUS"}
              </span>
              <p className="text-sm text-white font-medium leading-relaxed mt-0.5">
                {valeriusMessage}
              </p>
            </div>
          </div>
        </div>

        {/* Central Formula Screen */}
        <div className="w-full glass-panel rounded-3xl border-2 border-neon-blue/30 relative p-8 md:p-14 flex flex-col items-center justify-center text-center overflow-hidden min-h-[160px]">
          {/* Subtle tech grid animation */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,243,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>

          {/* Feedback overlays */}
          {feedback === 'correct' && (
            <div className="absolute inset-0 bg-success-green/10 flex items-center justify-center animate-pulse z-10">
              <Check className="w-24 h-24 text-success-green filter drop-shadow-[0_0_15px_#00ff9d]" />
            </div>
          )}
          {feedback === 'incorrect' && (
            <div className="absolute inset-0 bg-alert-red/15 flex items-center justify-center animate-pulse z-10">
              <X className="w-24 h-24 text-alert-red filter drop-shadow-[0_0_15px_#ff2a6d]" />
            </div>
          )}

          {/* Real Math Display */}
          {activeProblem && (
            <div 
              className={`font-mono font-bold text-white tracking-normal sm:tracking-wider drop-shadow-[0_0_8px_rgba(255,255,255,0.15)] math-display select-text whitespace-nowrap text-center leading-none ${
                activeProblem.display.length > 35
                  ? "text-lg sm:text-2xl md:text-3xl"
                  : activeProblem.display.length > 25
                  ? "text-xl sm:text-3xl md:text-4xl"
                  : activeProblem.display.length > 15
                  ? "text-2xl sm:text-4xl md:text-5xl"
                  : "text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
              }`}
              dangerouslySetInnerHTML={{ __html: activeProblem.display }}
            ></div>
          )}
        </div>

        {/* Dynamic Rubber-banding alert pill */}
        {adaptiveMode !== 'normal' && (
          <div className={`mt-2 px-3 py-1 rounded-full text-[10px] font-mono border animate-bounce ${
            adaptiveMode === 'easy' 
              ? 'bg-success-green/10 border-success-green text-success-green' 
              : 'bg-neon-pink/10 border-neon-pink text-neon-pink'
          }`}>
            {adaptiveMode === 'easy' 
              ? 'MECANISMO PROTECTOR ACTIVO: Operaciones simplificadas' 
              : 'RESONANCIA ESPACIAL CRÍTICA: Rango ampliado'
            }
          </div>
        )}

      </div>

      {/* Answer Inputs & Interactive Numpad Section */}
      <div className="w-full max-w-md mx-auto space-y-4 relative z-10">
        
        {/* Interactive Math Equation solver Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9-]*"
            value={answerInput}
            onChange={e => {
              const val = e.target.value;
              if (/^-?[0-9]*$/.test(val)) {
                setAnswerInput(val);
              }
            }}
            placeholder="Introduce tu respuesta..."
            className="flex-1 bg-black/60 border-2 border-gray-800 text-white text-center text-2xl py-3.5 rounded-xl font-mono focus:border-neon-blue focus:outline-none transition-all focus:shadow-[0_0_15px_rgba(0,243,255,0.3)]"
            disabled={feedback !== null}
            autoFocus
          />
          <button
            type="submit"
            className="bg-neon-blue hover:bg-white text-space-black font-bold px-6 py-3.5 rounded-xl text-lg flex items-center justify-center shadow-lg transition-all active:scale-95 disabled:opacity-40"
            disabled={feedback !== null || answerInput === ''}
          >
            <Send className="w-5 h-5 fill-current" />
          </button>
        </form>

        {/* Virtual Numpad Grid */}
        <div className="grid grid-cols-3 gap-2 p-2 bg-black/40 rounded-2xl border border-gray-800/80">
          {[7, 8, 9, 4, 5, 6, 1, 2, 3].map(num => (
            <button
              key={num}
              type="button"
              onClick={() => handleVirtualClick(String(num))}
              className="bg-gray-900/60 hover:bg-gray-800 active:bg-neon-blue active:text-space-black p-3.5 text-lg font-mono text-white rounded-lg border border-gray-800 transition-colors cursor-pointer select-none"
              disabled={feedback !== null}
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleVirtualClick('+/-')}
            className="bg-gray-900/60 hover:bg-gray-800 active:bg-neon-blue active:text-space-black p-3.5 text-sm font-orbitron text-neon-blue rounded-lg border border-gray-800 transition-colors cursor-pointer select-none"
            disabled={feedback !== null}
          >
            +/-
          </button>
          <button
            type="button"
            onClick={() => handleVirtualClick('0')}
            className="bg-gray-900/60 hover:bg-gray-800 active:bg-neon-blue active:text-space-black p-3.5 text-lg font-mono text-white rounded-lg border border-gray-800 transition-colors cursor-pointer select-none"
            disabled={feedback !== null}
          >
            0
          </button>
          <button
            type="button"
            onClick={() => handleVirtualClick('back')}
            className="bg-gray-900/60 hover:bg-gray-800 text-alert-red active:bg-alert-red active:text-white p-3.5 text-lg rounded-lg border border-gray-800 transition-colors cursor-pointer flex items-center justify-center select-none"
            disabled={feedback !== null}
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Floating Error Step-by-Step Explanation Card */}
      {showExplanation && activeProblem && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gray-950/98 border-l-4 border-alert-red p-4 rounded-xl shadow-[0_0_30px_rgba(255,42,109,0.35)] border border-alert-red/20 z-50 animate-fade-in-up">
          <div className="flex items-center gap-2 text-alert-red font-bold font-orbitron text-sm mb-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>DESALINEACIÓN DETECTADA</span>
          </div>
          <div className="space-y-2">
            <div className="bg-white/5 p-2 rounded text-center border border-white/5 font-mono text-xs">
              <span className="text-gray-400">RESPUESTA CORRECTA: </span>
              <span className="font-bold text-success-green text-sm">{activeProblem.answer}</span>
            </div>
            <p className="text-gray-200 leading-relaxed font-inter text-sm mt-1.5">
              {activeProblem.explanation}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
