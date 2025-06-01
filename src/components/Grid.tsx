import React from "react";
import Cell from "./Cell";
import { CellType, ICell } from "../types";

interface GridProps {
  grid: CellType[][];
  currentPosition: [number, number] | null;
  visitedPositions: Set<string>;
  pathPositions: [number, number][];
  isEditMode: boolean;
  onCellEdit: (row: number, col: number) => void;
  isMouseDown: boolean;
  setIsMouseDown: (down: boolean) => void;

}

const Grid: React.FC<GridProps> = ({
  grid,
  currentPosition,
  visitedPositions,
  pathPositions,
  isEditMode,
  onCellEdit,
  isMouseDown,
  setIsMouseDown,
}) => {
  // Convert [row, col] coordinates to string for easy comparison
  const pathSet = new Set(pathPositions.map(([row, col]) => `${row},${col}`));
  // Handlers para drag & drop
  const handleMouseDown = (row: number, col: number) => {
    if (isEditMode) {
      setIsMouseDown(true);
      onCellEdit(row, col);
    }
  };
  const handleMouseUp = () => {
    if (isEditMode) setIsMouseDown(false);
  };
  const handleMouseEnter = (row: number, col: number) => {
    if (isEditMode && isMouseDown) {
      onCellEdit(row, col);
    }
  };

  return (
    <div
      className="grid-container p-4 bg-blue-800/10 rounded-lg shadow-lg justify-center itens-center flex"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="grid grid-flow-row gap-0">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cellType, colIndex) => {
              const cell: ICell = {
                type: cellType,
                row: rowIndex,
                col: colIndex,
              };

              const isCurrentPosition =
                currentPosition !== null &&
                currentPosition[0] === rowIndex &&
                currentPosition[1] === colIndex;

              const isVisited = visitedPositions.has(`${rowIndex},${colIndex}`);
              const isInPath = pathSet.has(`${rowIndex},${colIndex}`);

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                  style={{ cursor: isEditMode ? "pointer" : "default" }}
                >
                  <Cell
                    cell={cell}
                    isCurrentPosition={isCurrentPosition}
                    isInPath={isInPath}
                    isVisited={isVisited}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Grid;
