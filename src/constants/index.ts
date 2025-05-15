import { CellType } from "../types";

export const CELL_TYPES: Record<CellType, { name: string; color: string; description: string }> = {
  'C': { 
    name: 'Início', 
    color: 'bg-indigo-600 hover:bg-indigo-700', 
    description: 'Ponto inicial da jornada' 
  },
  '_': { 
    name: 'Vazio', 
    color: 'bg-slate-100 hover:bg-slate-200', 
    description: 'Espaço vazio que pode ser atravessado (custo: 1)' 
  },
  'B': { 
    name: 'Barreira', 
    color: 'bg-rose-600 hover:bg-rose-700', 
    description: 'Barreira que só pode ser atravessada com uma fruta mágica' 
  },
  'F': { 
    name: 'Fruta Mágica', 
    color: 'bg-emerald-500 hover:bg-emerald-600', 
    description: 'Permite atravessar barreiras quando coletada' 
  },
  'A': { 
    name: 'Terreno Difícil', 
    color: 'bg-amber-500 hover:bg-amber-600', 
    description: 'Terreno difícil que custa 2 para atravessar' 
  },
  'S': { 
    name: 'Destino', 
    color: 'bg-violet-600 hover:bg-violet-700', 
    description: 'O destino final' 
  }
};

export const INITIAL_GRID: CellType[][] = [
  ['C', '_', '_', '_', 'B', '_'],
  ['_', 'B', '_', '_', '_', '_'],
  ['_', '_', 'F', '_', '_', '_'],
  ['_', '_', '_', 'B', 'B', '_'],
  ['_', '_', '_', 'A', '_', '_'],
  ['_', '_', '_', '_', '_', 'S'],
];

export const ANIMATION_SPEED = 600; // ms