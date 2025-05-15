import React from 'react';
import Cell from './Cell';
import { CellType, ICell } from '../types';

interface GridProps {
  grid: CellType[][];
  currentPosition: [number, number] | null;
  visitedPositions: Set<string>;
  pathPositions: [number, number][];
}

const Grid: React.FC<GridProps> = ({ 
  grid, 
  currentPosition,
  visitedPositions,
  pathPositions
}) => {
  // Convert [row, col] coordinates to string for easy comparison
  const pathSet = new Set(pathPositions.map(([row, col]) => `${row},${col}`));
  
  return (
    <div className="grid-container p-4 bg-blue-800/10 rounded-lg shadow-lg justify-center itens-center flex">
      <div className="grid grid-flow-row gap-0">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cellType, colIndex) => {
              const cell: ICell = {
                type: cellType,
                row: rowIndex,
                col: colIndex
              };
              
              const isCurrentPosition = 
                currentPosition !== null && 
                currentPosition[0] === rowIndex && 
                currentPosition[1] === colIndex;
              
              const isVisited = visitedPositions.has(`${rowIndex},${colIndex}`);
              const isInPath = pathSet.has(`${rowIndex},${colIndex}`);
              
              return (
                <Cell
                  key={`${rowIndex}-${colIndex}`}
                  cell={cell}
                  isCurrentPosition={isCurrentPosition}
                  isInPath={isInPath}
                  isVisited={isVisited}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Grid;