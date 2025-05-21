import React from 'react';
import { ICell } from '../types';
import { CELL_TYPES } from '../constants';
import clsx from 'clsx';
import { User, Flag, ShieldBan, Apple, PlayCircle, Shield } from 'lucide-react';

interface CellProps {
  cell: ICell;
  isCurrentPosition: boolean;
  isInPath: boolean;
  isVisited: boolean;
}

const cellIcons: Record<string, React.ReactNode> = {
  'C': <PlayCircle size={20} />,
  'S': <Flag size={20} />,
  'B': <ShieldBan size={20} />,
  'A': <Shield size={20} />,
  'F': <Apple size={20} />,
  '_': null,
};

const Cell: React.FC<CellProps> = ({ cell, isCurrentPosition, isInPath, isVisited }) => {
  const { type, row, col } = cell;
  const cellInfo = CELL_TYPES[type];
  const icon = cellIcons[type];

  // Lógica de cor com prioridade
  const backgroundColorClass = (() => {
    if (isCurrentPosition) return 'bg-cyan-500';
    if (isInPath) return 'bg-cyan-500';
    return cellInfo.color;
  })();

  return (
    <div
      className={clsx(
        'w-12 h-12 m-1 flex items-center justify-center rounded-md transition-all duration-300 transform relative text-black font-bold shadow-md hover:shadow-lg',
        backgroundColorClass,
        isCurrentPosition && 'scale-110 shadow-lg',
        isInPath && !isCurrentPosition && 'scale-110',
        isVisited && !isInPath && !isCurrentPosition && 'opacity-50',
      )}
      title={cellInfo.description}
    >
      <span className="flex items-center gap-1">
        {isCurrentPosition ? <User className='rounded-full transition-all duration-1000' size={22} /> : icon}
      </span>
      <span className="absolute bottom-0 right-1 text-xs opacity-75">
        {row},{col}
      </span>
    </div>
  );
};

export default Cell;
