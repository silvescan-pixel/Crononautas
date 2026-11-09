import React, { useState, useEffect } from 'react';
import { ClassroomCode, StudentResult } from '../types';
import { Download, Plus, Trash2, X, ShieldAlert, BookOpen } from 'lucide-react';
import { audioEngine } from '../utils/audio';

interface TeacherPanelProps {
  onClose: () => void;
}

export default function TeacherPanel({ onClose }: TeacherPanelProps) {
  const [codes, setCodes] = useState<ClassroomCode[]>([]);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [newCode, setNewCode] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'codes' | 'results'>('codes');

  useEffect(() => {
    // Load codes
    const savedCodes = localStorage.getItem('crononautas_classroom_codes');
    if (savedCodes) {
      setCodes(JSON.parse(savedCodes));
    } else {
      const defaultCodes: ClassroomCode[] = [
        { code: 'APEIRON', description: 'Código inicial de la Academia', createdAt: new Date().toLocaleDateString() },
        { code: 'ESO1', description: 'Primer Curso de Secundaria', createdAt: new Date().toLocaleDateString() },
        { code: 'ESO2', description: 'Segundo Curso de Secundaria', createdAt: new Date().toLocaleDateString() },
      ];
      localStorage.setItem('crononautas_classroom_codes', JSON.stringify(defaultCodes));
      setCodes(defaultCodes);
    }

    // Load results
    const savedResults = localStorage.getItem('crononautas_student_results');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    } else {
      // Seed initial dummy student results to show how beautiful the panel is!
      const defaultResults: StudentResult[] = [
        {
          id: 'res-1',
          username: 'ALEX-01',
          code: 'APEIRON',
          date: new Date(Date.now() - 3600000 * 2).toLocaleDateString(),
          totalScore: 450,
          precision: 85,
          levelHistory: {
            1: { bestScore: 14, max: 15, pct: 93, passed: true },
            2: { bestScore: 13, max: 15, pct: 86, passed: true },
            3: { bestScore: 12, max: 15, pct: 80, passed: true },
            4: { bestScore: 8, max: 10, pct: 80, passed: true }
          }
        },
        {
          id: 'res-2',
          username: 'SARA_TECH',
          code: 'ESO1',
          date: new Date(Date.now() - 3600000 * 5).toLocaleDateString(),
          totalScore: 310,
          precision: 90,
          levelHistory: {
            1: { bestScore: 15, max: 15, pct: 100, passed: true },
            2: { bestScore: 14, max: 15, pct: 93, passed: true }
          }
        }
      ];
      localStorage.setItem('crononautas_student_results', JSON.stringify(defaultResults));
      setResults(defaultResults);
    }
  }, []);

  const handleCreateCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = newCode.trim().toUpperCase();
    if (!cleanCode) return;

    if (codes.some(c => c.code === cleanCode)) {
      alert('Este código ya existe.');
      return;
    }

    const updated = [
      ...codes,
      {
        code: cleanCode,
        description: newDescription.trim() || 'Sin descripción',
        createdAt: new Date().toLocaleDateString(),
      },
    ];

    setCodes(updated);
    localStorage.setItem('crononautas_classroom_codes', JSON.stringify(updated));
    setNewCode('');
    setNewDescription('');
    audioEngine.playSFX('success');
  };

  const handleDeleteCode = (codeToDelete: string) => {
    if (codeToDelete === 'APEIRON') {
      alert('No se puede eliminar el código principal de la Academia.');
      return;
    }
    if (confirm(`¿Seguro que deseas eliminar el código ${codeToDelete}?`)) {
      const updated = codes.filter(c => c.code !== codeToDelete);
      setCodes(updated);
      localStorage.setItem('crononautas_classroom_codes', JSON.stringify(updated));
      audioEngine.playSFX('click');
    }
  };

  const handleClearResults = () => {
    if (confirm('¿Seguro que deseas BORRAR permanentemente todas las calificaciones de los estudiantes?')) {
      localStorage.removeItem('crononautas_student_results');
      setResults([]);
      audioEngine.playSFX('error');
    }
  };

  const handleExportCSV = () => {
    if (results.length === 0) {
      alert('No hay calificaciones disponibles para exportar.');
      return;
    }

    // Build elegant CSV content
    let csvContent = 'ID_REPORTE,FECHA,CADETE,CODIGO_AULA,XP_TOTAL,PRECISION_PROMEDIO,NIVEL_1,NIVEL_2,NIVEL_3,NIVEL_4,NIVEL_5,NIVEL_6\n';
    
    results.forEach(r => {
      const getLvlScore = (id: number) => {
        const hist = r.levelHistory[id];
        return hist ? `${hist.bestScore}/${hist.max} (${hist.pct}%)` : '--';
      };

      const row = [
        r.id,
        r.date,
        r.username,
        r.code,
        r.totalScore,
        `${r.precision}%`,
        getLvlScore(1),
        getLvlScore(2),
        getLvlScore(3),
        getLvlScore(4),
        getLvlScore(5),
        getLvlScore(6)
      ].join(',');

      csvContent += row + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Crononautas_Calificaciones_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    audioEngine.playSFX('success');
  };

  return (
    <div className="fixed inset-0 bg-space-black/95 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-4xl rounded-2xl border-2 border-neon-purple shadow-[0_0_50px_rgba(176,38,255,0.3)] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-neon-purple/30 bg-deep-void">
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-neon-purple w-8 h-8 animate-pulse" />
            <div>
              <h2 className="text-2xl font-orbitron font-bold text-white tracking-widest neon-text-purple">
                PANEL DEL PROFESOR
              </h2>
              <p className="text-xs text-gray-400 font-mono">Gestión de códigos de aula y evaluación de cadetes</p>
            </div>
          </div>
          <button
            onClick={() => {
              audioEngine.playSFX('click');
              onClose();
            }}
            className="text-gray-400 hover:text-white p-2 border border-gray-700 hover:border-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neon-purple/20 bg-deep-void/50">
          <button
            onClick={() => {
              audioEngine.playSFX('click');
              setActiveTab('codes');
            }}
            className={`flex-1 py-4 text-center font-orbitron font-bold text-sm tracking-wider transition-all border-b-2 ${
              activeTab === 'codes'
                ? 'border-neon-purple text-neon-purple bg-neon-purple/5'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            CÓDIGOS DE AULA
          </button>
          <button
            onClick={() => {
              audioEngine.playSFX('click');
              setActiveTab('results');
            }}
            className={`flex-1 py-4 text-center font-orbitron font-bold text-sm tracking-wider transition-all border-b-2 ${
              activeTab === 'results'
                ? 'border-neon-purple text-neon-purple bg-neon-purple/5'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            CALIFICACIONES ({results.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'codes' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form to create */}
              <div className="lg:col-span-1 bg-black/40 p-5 rounded-xl border border-neon-purple/20 h-fit">
                <h3 className="text-lg font-orbitron text-white mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-neon-purple" /> CREAR CÓDIGO
                </h3>
                <form onSubmit={handleCreateCode} className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 font-mono block mb-1">CÓDIGO (Ej: CLASE-3B)</label>
                    <input
                      type="text"
                      value={newCode}
                      onChange={e => setNewCode(e.target.value)}
                      maxLength={12}
                      placeholder="NUEVO_CODIGO"
                      className="w-full bg-deep-void border border-gray-700 rounded p-3 text-white focus:border-neon-purple focus:outline-none uppercase font-orbitron"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 font-mono block mb-1">CURSO / GRUPO</label>
                    <input
                      type="text"
                      value={newDescription}
                      onChange={e => setNewDescription(e.target.value)}
                      placeholder="Ej: Matemáticas 1º ESO"
                      className="w-full bg-deep-void border border-gray-700 rounded p-3 text-white focus:border-neon-purple focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-neon-purple hover:bg-white hover:text-deep-void text-white font-bold py-3 rounded font-orbitron tracking-wide transition-all"
                  >
                    GUARDAR CÓDIGO
                  </button>
                </form>
              </div>

              {/* Codes list */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-orbitron text-white">CÓDIGOS ACTIVOS</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {codes.map(c => (
                    <div
                      key={c.code}
                      className="bg-black/50 border border-neon-purple/20 rounded-xl p-4 flex justify-between items-center group hover:bg-neon-purple/5 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-orbitron font-bold text-lg text-neon-purple">{c.code}</span>
                          <span className="text-[10px] font-mono bg-white/5 text-gray-400 px-2 py-0.5 rounded">
                            {c.createdAt}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1 font-sans">{c.description}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteCode(c.code)}
                        className="text-gray-600 hover:text-alert-red p-2 rounded transition-colors"
                        title="Eliminar Código"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-orbitron text-white">REPORTE DE CALIFICACIONES</h3>
                <div className="flex gap-3">
                  <button
                    onClick={handleClearResults}
                    className="border border-alert-red/30 hover:border-alert-red hover:bg-alert-red/10 text-alert-red px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 font-mono"
                  >
                    <Trash2 className="w-4 h-4" /> BORRAR HISTORIAL
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="bg-neon-purple hover:bg-white hover:text-deep-void text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 font-orbitron"
                  >
                    <Download className="w-4 h-4" /> EXPORTAR CSV
                  </button>
                </div>
              </div>

              {results.length === 0 ? (
                <div className="text-center py-16 border border-gray-800 rounded-xl bg-black/25">
                  <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 font-mono text-lg">Aún no hay registros de estudiantes.</p>
                  <p className="text-sm text-gray-600">Completa niveles en el juego para generar resultados.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-800 rounded-xl bg-black/40">
                  <table className="w-full text-left border-collapse font-mono text-sm">
                    <thead>
                      <tr className="bg-deep-void text-neon-purple border-b border-gray-800">
                        <th className="p-4">FECHA</th>
                        <th className="p-4">CADETE</th>
                        <th className="p-4">CÓDIGO AULA</th>
                        <th className="p-4 text-center">XP</th>
                        <th className="p-4 text-center">PRECISIÓN</th>
                        <th className="p-4">FASES SUPERADAS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-900 text-gray-300">
                      {results.map((r, i) => {
                        // Calculate list of completed levels
                        const levelKeys = Object.keys(r.levelHistory);
                        const passedLevels = levelKeys
                          .filter(k => r.levelHistory[Number(k)].passed)
                          .map(k => `N${k}`)
                          .join(', ');

                        return (
                          <tr key={r.id + '-' + i} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 text-gray-500">{r.date}</td>
                            <td className="p-4 text-white font-bold">{r.username}</td>
                            <td className="p-4 text-neon-purple font-bold">{r.code}</td>
                            <td className="p-4 text-center text-neon-gold">{r.totalScore} XP</td>
                            <td className="p-4 text-center text-success-green">{r.precision}%</td>
                            <td className="p-4 text-xs text-gray-400">{passedLevels || 'Ninguna'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
