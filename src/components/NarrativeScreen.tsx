import React, { useState, useEffect } from 'react';
import { DialogueStep } from '../types';
import { ChevronRight, Sparkles } from 'lucide-react';
import { audioEngine } from '../utils/audio';
import valeriusMentor from '../assets/images/valerius_mentor_1782379048430.jpg';

interface NarrativeScreenProps {
  onComplete: () => void;
}

export default function NarrativeScreen({ onComplete }: NarrativeScreenProps) {
  const steps: DialogueStep[] = [
    {
      text: "Cadete... detecto que el tiempo se fragmenta. Los cimientos de la realidad matemática están colapsando a una velocidad alarmante.",
      emotion: "DIAGNÓSTICO CRÍTICO"
    },
    {
      text: "Soy el Director Valerius de la Academia Apeiron. Durante siglos, nuestra orden ha custodiado el Vórtice Numérico.",
      emotion: "DIRECTOR DE LA ACADEMIA"
    },
    {
      text: "Pero hoy, una grieta temporal, 'La Fractura del Cero', amenaza con desintegrar la lógica elemental de la galaxia.",
      emotion: "ADVERTENCIA TÁCTICA"
    },
    {
      text: "Los análisis indican que tu patrón mental tiene una resonancia perfecta para la calibración matemática. Eres nuestra única opción.",
      emotion: "RESONANCIA COMPATIBLE"
    },
    {
      text: "Elige una unidad de asalto en el hangar Apeiron y prepárate para saltar al vórtice. El destino del continuum espacial pende de un hilo.",
      emotion: "SECUENCIA DE SALTO"
    }
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const valeriusImage = valeriusMentor;

  useEffect(() => {
    let active = true;
    const textToType = steps[currentStepIndex].text;
    setDisplayedText(textToType.charAt(0));
    setIsTyping(true);
    audioEngine.playSFX('click');

    let i = 1;
    const timer = setInterval(() => {
      if (!active) return;
      if (i < textToType.length) {
        setDisplayedText(textToType.substring(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 25);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [currentStepIndex]);

  const handleNext = () => {
    if (isTyping) {
      // Fast forward
      setDisplayedText(steps[currentStepIndex].text);
      setIsTyping(false);
      return;
    }

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      audioEngine.playSFX('level_complete');
      onComplete();
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full">
      <div className="glass-panel w-full rounded-2xl overflow-hidden border-2 border-neon-blue shadow-[0_0_40px_rgba(0,243,255,0.25)] flex flex-col">
        
        {/* Character Visual Showcase */}
        <div className="relative h-96 bg-gradient-to-b from-deep-void to-black flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,243,255,0.15),transparent)]"></div>
          
          {/* Valerius full card */}
          <div className="relative z-10 w-64 h-80 rounded-xl overflow-hidden border-2 border-neon-blue shadow-[0_0_20px_rgba(0,243,255,0.3)] animate-float mt-4 bg-black">
            <img 
              src={valeriusImage} 
              alt="Director Valerius" 
              className="w-full h-full object-cover object-top scale-[1.6] origin-top transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/60 to-transparent p-3 text-center">
              <span className="font-orbitron font-bold text-neon-blue text-sm tracking-widest">DIRECTOR VALERIUS</span>
              <p className="text-[10px] font-mono text-gray-400 mt-0.5">RECTOR DE LA ACADEMIA</p>
            </div>
          </div>
        </div>

        {/* Cinematic Subtitles & Dialogue Screen */}
        <div className="bg-black/95 border-t-2 border-neon-blue/40 p-6 min-h-[180px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-neon-blue animate-pulse" />
                <span className="font-orbitron font-bold text-neon-blue text-sm tracking-widest uppercase">
                  DIRECTOR VALERIUS
                </span>
              </div>
              <span className="font-mono text-[10px] text-neon-purple px-2 py-0.5 bg-neon-purple/10 border border-neon-purple/30 rounded">
                {steps[currentStepIndex].emotion}
              </span>
            </div>
            
            <p className="text-gray-100 text-base md:text-lg font-inter font-medium leading-relaxed tracking-wide min-h-[80px]">
              {displayedText}
              {isTyping && <span className="animate-pulse text-neon-blue">_</span>}
            </p>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleNext}
              className="bg-neon-blue hover:bg-white text-space-black font-orbitron font-bold py-3 px-8 rounded-lg flex items-center gap-2 tracking-wider transition-all active:scale-95"
            >
              {currentStepIndex === steps.length - 1 ? "SELECCIONAR AVATAR" : "SIGUIENTE"}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
