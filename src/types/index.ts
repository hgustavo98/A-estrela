export type CellType = 'C' | '_' | 'B' | 'F' | 'A' | 'S';

export interface ICell {
  type: CellType;
  row: number;
  col: number;
}