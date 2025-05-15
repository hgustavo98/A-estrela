import { CellType } from "../types";

export const CELL_TYPES: Record<CellType, { name: string; color: string; description: string }> = {
  'C': { 
    name: 'Personagem', 
    color: 'bg-indigo-600 hover:bg-indigo-700', 
    description: 'Ponto inicial do personagem' 
  },
  '_': { 
    name: 'Caminho', 
    color: 'bg-slate-100 hover:bg-slate-200', 
    description: 'Caminho livre (custo: 1)' 
  },
  'B': { 
    name: 'Barreira', 
    color: 'bg-rose-600 hover:bg-rose-700', 
    description: 'Barreira - precisa de fruta mágica para passar' 
  },
  'F': { 
    name: 'Fruta Mágica', 
    color: 'bg-emerald-500 hover:bg-emerald-600', 
    description: 'Permite passar por uma barreira' 
  },
  'A': { 
    name: 'Semi-barreira', 
    color: 'bg-amber-500 hover:bg-amber-600', 
    description: 'Passagem mais lenta (custo: 2)' 
  },
  'S': { 
    name: 'Saída', 
    color: 'bg-violet-600 hover:bg-violet-700', 
    description: 'Objetivo final do personagem' 
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