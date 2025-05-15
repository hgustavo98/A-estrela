export type CellType = 'C' | '_' | 'B' | 'F' | 'A' | 'S';

export interface ICell {
  type: CellType;
  row: number;
  col: number;
}

export interface IPathNode {
  row: number;
  col: number;
  distanceTraveled: number;
  hasMagicFruit: boolean;
  estimatedTotalCost: number;
  path: number[][];
}