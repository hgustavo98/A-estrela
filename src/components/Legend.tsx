import React from 'react';
import { User, Flag, ShieldBan, Apple, PlayCircle, Shield } from 'lucide-react';



const customLegend = [
  { key: 'C', name: 'Início', color: 'bg-indigo-600 hover:bg-indigo-700', description: 'Ponto inicial do personagem', icon: <PlayCircle size={20} /> },
  { key: 'P', name: 'Personagem', color: 'bg-cyan-600', description: 'Posição atual do personagem', icon: <User size={20} /> },
  { key: 'S', name: 'Saída', color: 'bg-violet-600 hover:bg-violet-700', description: 'Objetivo final do personagem', icon: <Flag size={20} /> },
  { key: 'B', name: 'Barreira', color: 'bg-rose-600 hover:bg-rose-700', description: 'Barreira - precisa de fruta mágica para passar', icon: <ShieldBan size={20} /> },
  { key: 'A', name: 'Semi-barreira', color: 'bg-amber-500 hover:bg-amber-600', description: 'Passagem mais lenta (custo: 2)', icon: <Shield size={20} /> },
  { key: 'F', name: 'Fruta Mágica', color: 'bg-emerald-500 hover:bg-emerald-600', description: 'Permite passar por uma barreira', icon: <Apple size={20} /> },
  { key: '_', name: 'Caminho', color: 'bg-slate-100 hover:bg-slate-200', description: 'Caminho livre (custo: 1)', icon: null },
];

const Legend: React.FC = () => {
  return (
    <div className="p-4 bg-blue-800/10 rounded-lg shadow-lg text-white w-full">
      <h3 className="text-xl font-bold mb-3">Legenda</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {customLegend.map(({ key, name, color, description, icon }) => (
          <div key={key} className="flex items-center gap-2">
            <div 
              className={`w-8 h-8 flex p-3 items-center justify-center rounded-md ${color} text-white font-bold`}
            >
              <span className="flex items-center gap-1">
                {icon}
              </span>
            </div>
            <div>
              <div className="font-semibold">{name}</div>
              <div className="text-xs text-gray-300">{description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;