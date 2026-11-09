import React from 'react';
import {
  Radar,
  RadarChart as ReRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { SkillStats } from '../types';

interface RadarChartProps {
  stats: SkillStats;
  isVillain: boolean;
}

export default function RadarChart({ stats, isVillain }: RadarChartProps) {
  const data = [
    { subject: 'Suma/Resta', value: stats.addsub },
    { subject: 'Mult/Div', value: stats.multdiv },
    { subject: 'Agilidad', value: stats.agility },
    { subject: 'Lógica', value: stats.logic },
  ];

  // Colors depend on villain state
  const strokeColor = isVillain ? '#ff2a6d' : '#00f3ff';
  const fillColor = isVillain ? 'rgba(255, 42, 109, 0.2)' : 'rgba(0, 243, 255, 0.15)';
  const gridColor = 'rgba(255, 255, 255, 0.1)';
  const textColor = isVillain ? '#ff2a6d' : '#b026ff';

  return (
    <div className="w-full h-full min-h-[220px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height={240}>
        <ReRadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke={gridColor} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: textColor,
              fontSize: 12,
              fontFamily: 'Orbitron',
              fontWeight: 'bold',
            }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Cadet Skills"
            dataKey="value"
            stroke={strokeColor}
            fill={fillColor}
            fillOpacity={0.6}
          />
        </ReRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
