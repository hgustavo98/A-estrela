import React from 'react';
import { ICell } from '../types';
import { CELL_TYPES } from '../constants';

interface CellProps {
  cell: ICell;
  isCurrentPosition: boolean;
  isInPath: boolean;
  isVisited: boolean;
}

const Cell: React.FC<CellProps> = ({ cell, isCurrentPosition, isInPath, isVisited }) => {
  const { type, row, col } = cell;
  const cellInfo = CELL_TYPES[type];
  
  let cellClasses = `w-12 h-12 m-1 flex items-center justify-center rounded-md 
                    transition-all duration-300 transform relative
                    ${cellInfo.color} text-white font-bold
                    shadow-md hover:shadow-lg`;

  if (isCurrentPosition) {
    cellClasses += ' bg-cyan-500/60 scale-105 z-10 shadow-lg';
  } else if (isInPath) {
    cellClasses += ' bg-cyan-500/60';
  }

  if (isVisited && !isInPath && !isCurrentPosition) {
    cellClasses += ' opacity-50';
  }

  return (
    <div 
      className={cellClasses}
      title={cellInfo.description}
    >
      {type}
      <span className="absolute bottom-0 right-1 text-xs opacity-75">
        {row},{col}
      </span>
    </div>
  );
};

export default Cell;