import { CellType, IPathNode } from "../types";
import { INITIAL_GRID } from "../constants";

export function calculateDistanceToDestination(row: number, col: number): number {
  // Find the destination coordinates
  for (let i = 0; i < INITIAL_GRID.length; i++) {
    for (let j = 0; j < INITIAL_GRID[0].length; j++) {
      if (INITIAL_GRID[i][j] === 'S') {
        // Use Euclidean distance
        return Math.sqrt(Math.pow(i - row, 2) + Math.pow(j - col, 2));
      }
    }
  }
  return -1;
}

export function getMoveCost(cellType: CellType): number {
  return cellType === 'A' ? 2 : 1;
}

export function getStartPosition(): [number, number] {
  for (let i = 0; i < INITIAL_GRID.length; i++) {
    for (let j = 0; j < INITIAL_GRID[0].length; j++) {
      if (INITIAL_GRID[i][j] === 'C') {
        return [i, j];
      }
    }
  }
  return [0, 0]; // Default if not found
}

export function getNeighbors(
  row: number, 
  col: number, 
  grid: CellType[][],
  hasMagicFruit: boolean
): { row: number; col: number; cellType: CellType }[] {
  const neighbors: { row: number; col: number; cellType: CellType }[] = [];
  const directions = [
    [-1, 0], // up
    [1, 0],  // down
    [0, -1], // left
    [0, 1]   // right
  ];
  
  directions.forEach(([dr, dc]) => {
    const newRow = row + dr;
    const newCol = col + dc;
    
    // Check if within grid bounds
    if (
      newRow >= 0 && 
      newRow < grid.length && 
      newCol >= 0 && 
      newCol < grid[0].length
    ) {
      const cellType = grid[newRow][newCol];
      
      // Check if we can move to this cell
      if (cellType !== 'B' || hasMagicFruit) {
        neighbors.push({ row: newRow, col: newCol, cellType });
      }
    }
  });
  
  return neighbors;
}

export function pathNodeToString(node: IPathNode): string {
  return `${node.row},${node.col}`;
}

export function runPathfindingAlgorithm(
  grid: CellType[][],
  onVisitNode?: (node: IPathNode) => void,
  onFoundPath?: (finalNode: IPathNode) => void
): IPathNode[] {
  const [startRow, startCol] = getStartPosition();
  
  // Initialize start node
  const startNode: IPathNode = {
    row: startRow,
    col: startCol,
    distanceTraveled: 0,
    hasMagicFruit: false,
    estimatedTotalCost: calculateDistanceToDestination(startRow, startCol),
    path: [[startRow, startCol]]
  };
  
  const openList: IPathNode[] = [startNode];
  const closedSet = new Set<string>();
  const visitedNodes: IPathNode[] = [];
  
  while (openList.length > 0) {
    // Get node with lowest estimated cost
    openList.sort((a, b) => a.estimatedTotalCost - b.estimatedTotalCost);
    const currentNode = openList.shift()!;
    
    // Add to visited nodes for visualization
    visitedNodes.push(currentNode);
    if (onVisitNode) onVisitNode(currentNode);
    
    const currentNodeKey = pathNodeToString(currentNode);
    
    // If already processed, skip
    if (closedSet.has(currentNodeKey)) continue;
    
    // Add to closed set
    closedSet.add(currentNodeKey);
    
    // Check if destination reached
    if (grid[currentNode.row][currentNode.col] === 'S') {
      if (onFoundPath) onFoundPath(currentNode);
      return visitedNodes;
    }
    
    // Check if current cell has magic fruit
    const updatedHasMagicFruit = 
      currentNode.hasMagicFruit || 
      grid[currentNode.row][currentNode.col] === 'F';
    
    // Get neighbors
    const neighbors = getNeighbors(
      currentNode.row,
      currentNode.col,
      grid,
      updatedHasMagicFruit
    );
    
    for (const neighbor of neighbors) {
      const neighborNodeKey = `${neighbor.row},${neighbor.col}`;
      
      // Skip if already processed
      if (closedSet.has(neighborNodeKey)) continue;
      
      // Calculate new distance
      const moveCost = getMoveCost(neighbor.cellType);
      const newDistance = currentNode.distanceTraveled + moveCost;
      
      // Create new path
      const newPath = [...currentNode.path, [neighbor.row, neighbor.col]];
      
      // Create neighbor node
      const neighborNode: IPathNode = {
        row: neighbor.row,
        col: neighbor.col,
        distanceTraveled: newDistance,
        hasMagicFruit: updatedHasMagicFruit,
        estimatedTotalCost: newDistance + calculateDistanceToDestination(neighbor.row, neighbor.col),
        path: newPath
      };
      
      // Add to open list
      openList.push(neighborNode);
    }
  }
  
  return visitedNodes;
}