import React, { useState, useEffect } from 'react';
import { ShieldAlert, Zap, Terminal, Skull } from 'lucide-react';
import { audioEngine } from '../utils/audio';
import valeriusMentor from '../assets/images/valerius_mentor_1782379048430.jpg';

interface GlitchScreenProps {
  username: string;
  onComplete: () => void;
}

export default function GlitchScreen({ username, onComplete }: GlitchScreenProps) {
  const [step, setStep] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [glitchIntensity, setGlitchIntensity] = useState(0); // 0 = normal, 1 = warning, 2 = full glitch, 3 = villain
  const [shake, setShake] = useState(false);

  const valeriusImage = valeriusMentor;

  const dialogue = [
    {
      text: `¡Excelente trabajo, ${username || 'cadete'}! La calibración de la jerarquía cuántica ha sido un éxito absoluto. El continuum temporal está a salvo.`,
      sender: "Director Valerius",
      emotion: "DIAGNÓSTICO ESTABLE",
      intensity: 0
    },
    {
      text: "[ALERTA: INTERFERENCIA EN LA MATRIZ... SISTEMA EXPUESTO... PROTOCOLO DE DEFENSA INACTIVO...]",
      sender: "SISTEMA OPERATIVO APEIRON",
      emotion: "CRITICAL FAILURE",
      intensity: 1
    },
    {
      text: `¿Estable? ¿Sellar la grieta? Oh, mi dulce e ingenuo ${username || 'cadete'}... ¿Realmente creías que nos importaba salvar esta patética dimensión?`,
      sender: "Director Valerius (?)",
      emotion: "ERROR DE PROTOCOLO",
      intensity: 2
    },
    {
      text: `Cada nodo que has calibrado, cada ecuación de signos que has ordenado... no estaba estabilizando el universo. Estabas rompiendo mis cadenas, ${username || 'cadete'}.`,
      sender: "Lord Valerius",
      emotion: "CONVERSIÓN COMPLETADA",
      intensity: 3
    },
    {
      text: "¡Sí! Soy yo, el Arquitecto del Cero Absoluto. He usado tu brillante mente matemática para desmantelar la seguridad cuántica de la Academia Apeiron.",
      sender: "Lord Valerius",
      emotion: "SADISMO MATEMÁTICO",
      intensity: 3
    },
    {
      text: "Te doy la bienvenida a mi verdadero hogar: La Fractura del Cero. Si crees tener el valor, enfréntate a mis fases exponenciales secretas. El destino del tiempo... ahora es mi juguete. ¡Jajajaja!",
      sender: "Lord Valerius",
      emotion: "NÚCLEO EN VÓRTICE",
      intensity: 3
    }
  ];

  useEffect(() => {
    // Start background glitchy transition sounds
    audioEngine.playSFX('glitch');
    
    // Play intense boss theme if it reaches step 3
    if (step === 3) {
      audioEngine.playMusic('boss');
    }
  }, [step]);

  useEffect(() => {
    let active = true;
    const currentLine = dialogue[step];
    setGlitchIntensity(currentLine.intensity);
    
    // Shake screen on higher intensities
    if (currentLine.intensity >= 1) {
      setShake(true);
      const t = setTimeout(() => setShake(false), 500);
    }

    const textToType = currentLine.text;
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
    }, currentLine.intensity >= 2 ? 15 : 25); // type faster as glitch intensifies

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [step]);

  const handleNext = () => {
    if (isTyping) {
      setDisplayedText(dialogue[step].text);
      setIsTyping(false);
      return;
    }

    if (step < dialogue.length - 1) {
      setStep(step + 1);
    } else {
      audioEngine.playSFX('glitch');
      onComplete();
    }
  };

  // Build filter class based on glitch intensity
  const getImageFilter = () => {
    if (glitchIntensity === 0) return "scale-[1.6] origin-top transition-all duration-1000";
    if (glitchIntensity === 1) return "scale-[1.6] origin-top brightness-50 contrast-125 sepia transition-all duration-500 animate-pulse";
    if (glitchIntensity === 2) return "scale-[1.7] origin-top brightness-75 contrast-200 saturate-150 hue-rotate-[180deg] transition-all duration-300";
    return "scale-[1.8] origin-top brightness-90 contrast-[2.5] hue-rotate-[290deg] saturate-200 transition-all duration-300 drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]";
  };

  return (
    <div className={`flex-grow flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full transition-all duration-500 ${
      shake ? 'animate-shake' : ''
    }`}>
      
      {/* Glitch Overlay effect */}
      {glitchIntensity >= 2 && (
        <div className="absolute inset-0 bg-red-950/10 pointer-events-none mix-blend-color-dodge animate-pulse z-30"></div>
      )}

      <div className={`glass-panel w-full rounded-2xl overflow-hidden border-2 transition-all duration-1000 flex flex-col bg-black ${
        glitchIntensity === 0 ? 'border-neon-blue shadow-[0_0_40px_rgba(0,243,255,0.25)]' :
        glitchIntensity === 1 ? 'border-neon-purple shadow-[0_0_45px_rgba(176,38,255,0.3)]' :
        'border-alert-red shadow-[0_0_60px_rgba(255,42,109,0.4)]'
      }`}>
        
        {/* Character Visual Showcase */}
        <div className="relative h-96 bg-gradient-to-b from-deep-void to-black flex items-center justify-center overflow-hidden">
          {/* Background grid warping */}
          <div className={`absolute inset-0 transition-opacity duration-1000 ${
            glitchIntensity >= 2 ? 'opacity-80' : 'opacity-10'
          } bg-[radial-gradient(ellipse_at_center,rgba(255,42,109,0.2),transparent)]`}></div>
          
          {/* Corrupted Valerius card */}
          <div className={`relative z-10 w-64 h-80 rounded-xl overflow-hidden border-2 shadow-2xl transition-all duration-1000 bg-black mt-4 ${
            glitchIntensity === 0 ? 'border-neon-blue shadow-[0_0_20px_rgba(0,243,255,0.3)] animate-float' :
            glitchIntensity === 1 ? 'border-neon-purple shadow-[0_0_25px_rgba(176,38,255,0.4)] animate-pulse' :
            'border-alert-red shadow-[0_0_35px_rgba(255,42,109,0.6)] scale-105'
          }`}>
            <img 
              src={valeriusImage} 
              alt="Director Valerius" 
              className={getImageFilter()}
              referrerPolicy="no-referrer"
            />
            <div className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 text-center transition-all duration-500`}>
              <span className={`font-orbitron font-black tracking-widest text-sm transition-colors duration-1000 ${
                glitchIntensity >= 2 ? 'text-alert-red' : 'text-neon-blue'
              }`}>
                {glitchIntensity >= 2 ? 'LORD VALERIUS' : 'ARES VANDER'}
              </span>
              <p className="text-[10px] font-mono text-gray-400 mt-0.5 uppercase tracking-wider">
                {glitchIntensity >= 3 ? 'ARQUITECTO DEL CAOS' : glitchIntensity >= 1 ? 'SISTEMA INESTABLE' : 'DIRECTOR DE OPERACIONES'}
              </p>
            </div>
          </div>

          {/* Glitch lines overlay */}
          {glitchIntensity >= 1 && (
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40 z-20">
              <div className="h-1 bg-alert-red/80 w-full animate-pulse my-2"></div>
              <div className="h-0.5 bg-neon-purple/70 w-full animate-pulse my-4"></div>
              <div className="h-1 bg-alert-red/60 w-full animate-pulse my-1"></div>
            </div>
          )}
        </div>

        {/* Dialogue Box */}
        <div className={`p-6 min-h-[190px] flex flex-col justify-between bg-black border-t-2 transition-colors duration-1000 ${
          glitchIntensity === 0 ? 'border-neon-blue/40' :
          glitchIntensity === 1 ? 'border-neon-purple/50' :
          'border-alert-red/70'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {glitchIntensity >= 3 ? (
                  <Skull className="w-5 h-5 text-alert-red animate-bounce" />
                ) : glitchIntensity >= 1 ? (
                  <ShieldAlert className="w-5 h-5 text-neon-purple animate-pulse" />
                ) : (
                  <Zap className="w-5 h-5 text-neon-blue animate-pulse" />
                )}
                <span className={`font-orbitron font-black text-sm tracking-widest uppercase transition-colors duration-1000 ${
                  glitchIntensity >= 2 ? 'text-alert-red neon-text-red' : 'text-neon-blue'
                }`}>
                  {dialogue[step].sender}
                </span>
              </div>
              <span className={`font-mono text-[10px] px-2.5 py-0.5 rounded border uppercase font-bold transition-all duration-1000 ${
                glitchIntensity >= 2 ? 'bg-alert-red/15 text-alert-red border-alert-red/40 animate-pulse' :
                glitchIntensity === 1 ? 'bg-neon-purple/15 text-neon-purple border-neon-purple/40' :
                'bg-neon-blue/10 text-neon-blue border-neon-blue/30'
              }`}>
                {dialogue[step].emotion}
              </span>
            </div>
            
            <p className={`text-base md:text-lg font-inter font-medium leading-relaxed tracking-wide min-h-[85px] transition-colors duration-500 ${
              glitchIntensity >= 2 ? 'text-red-100' : 'text-gray-100'
            }`}>
              {displayedText}
              {isTyping && (
                <span className={`animate-ping ${glitchIntensity >= 2 ? 'text-alert-red' : 'text-neon-blue'}`}>█</span>
              )}
            </p>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleNext}
              className={`font-orbitron font-black py-3 px-10 rounded-lg flex items-center gap-2 tracking-widest transition-all active:scale-95 shadow-md ${
                glitchIntensity === 0 ? 'bg-neon-blue hover:bg-white text-space-black shadow-neon-blue/20' :
                glitchIntensity === 1 ? 'bg-neon-purple text-white hover:bg-white hover:text-black shadow-neon-purple/20' :
                'bg-alert-red text-white hover:bg-white hover:text-black shadow-alert-red/30'
              }`}
            >
              {step === dialogue.length - 1 ? "ENTRAR EN LA FRACTURA" : "CONTINUAR"}
              <Terminal className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
