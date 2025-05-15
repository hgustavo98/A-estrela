import { CellType, IPathNode } from "../types";
import { INITIAL_GRID } from "../constants";

export function calculateDistanceToDestination(row: number, col: number): number {
  // Find the destination coordinates
  for (let i = 0; i < INITIAL_GRID.length; i++) {
    for (let j = 0; j < INITIAL_GRID[0].length; j++) {
      if (INITIAL_GRID[i][j] === 'S') {
        // Use Euclidean distance like the Python algorithm
        return Math.sqrt(Math.pow(i - row, 2) + Math.pow(j - col, 2));
      }
    }
  }
  return Infinity;
}

export function getMoveCost(cellType: CellType): number {
  return cellType === 'A' ? 2 : 1; // Semi-barrier costs 2 moves
}

export function getStartPosition(): [number, number] {
  for (let i = 0; i < INITIAL_GRID.length; i++) {
    for (let j = 0; j < INITIAL_GRID[0].length; j++) {
      if (INITIAL_GRID[i][j] === 'C') {
        return [i, j];
      }
    }
  }
  throw new Error('Start position not found');
}

export function getNeighbors(
  row: number, 
  col: number, 
  grid: CellType[][],
  hasMagicFruit: boolean,
  usedMagicFruit: boolean
): { row: number; col: number; cellType: CellType; willUseFruit: boolean }[] {
  const neighbors: { row: number; col: number; cellType: CellType; willUseFruit: boolean }[] = [];
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  
  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;
    
    if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
      const cellType = grid[newRow][newCol];
      let willUseFruit = false;

      // Handle barriers based on magic fruit
      if (cellType === 'B') {
        if (hasMagicFruit && !usedMagicFruit) {
          willUseFruit = true;
        } else {
          continue;
        }
      }

      neighbors.push({ 
        row: newRow, 
        col: newCol, 
        cellType,
        willUseFruit 
      });
    }
  }
  
  return neighbors;
}

export function pathNodeToString(node: IPathNode): string {
  return `${node.row},${node.col},${node.hasMagicFruit},${node.usedMagicFruit}`;
}

export function runPathfindingAlgorithm(
  grid: CellType[][],
  onVisitNode?: (node: IPathNode) => void,
  onFoundPath?: (finalNode: IPathNode) => void
): IPathNode[] {
  const [startRow, startCol] = getStartPosition();
  
  const startNode: IPathNode = {
    row: startRow,
    col: startCol,
    distanceTraveled: 0,
    hasMagicFruit: false,
    usedMagicFruit: false,
    estimatedTotalCost: calculateDistanceToDestination(startRow, startCol),
    path: [[startRow, startCol]]
  };
  
  const openList: IPathNode[] = [startNode];
  const closedSet = new Set<string>();
  const visitedNodes: IPathNode[] = [];
  
  while (openList.length > 0) {
    openList.sort((a, b) => a.estimatedTotalCost - b.estimatedTotalCost);
    const currentNode = openList.shift()!;
    visitedNodes.push(currentNode);
    
    if (onVisitNode) {
      onVisitNode(currentNode);
    }
    
    const currentNodeKey = pathNodeToString(currentNode);
    if (closedSet.has(currentNodeKey)) continue;
    closedSet.add(currentNodeKey);
    
    if (grid[currentNode.row][currentNode.col] === 'S') {
      if (onFoundPath) onFoundPath(currentNode);
      return visitedNodes;
    }
    
    // Update magic fruit status
    const updatedHasMagicFruit = 
      currentNode.hasMagicFruit || 
      grid[currentNode.row][currentNode.col] === 'F';
    
    const neighbors = getNeighbors(
      currentNode.row,
      currentNode.col,
      grid,
      updatedHasMagicFruit,
      currentNode.usedMagicFruit
    );
    
    for (const neighbor of neighbors) {
      const moveCost = getMoveCost(neighbor.cellType);
      const newDistance = currentNode.distanceTraveled + moveCost;
      
      const newPath = [...currentNode.path, [neighbor.row, neighbor.col]];
      
      const neighborNode: IPathNode = {
        row: neighbor.row,
        col: neighbor.col,
        distanceTraveled: newDistance,
        hasMagicFruit: updatedHasMagicFruit,
        usedMagicFruit: neighbor.willUseFruit ? true : currentNode.usedMagicFruit,
        estimatedTotalCost: newDistance + calculateDistanceToDestination(neighbor.row, neighbor.col),
        path: newPath
      };
      
      const neighborNodeKey = pathNodeToString(neighborNode);
      if (!closedSet.has(neighborNodeKey)) {
        openList.push(neighborNode);
      }
    }
  }
  
  return visitedNodes;
}