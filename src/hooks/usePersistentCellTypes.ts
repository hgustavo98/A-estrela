import { useEffect, useState } from 'react';
import { CELL_TYPES as DEFAULT_CELL_TYPES } from '../constants';

export function usePersistentCellTypes() {
  const [cellTypes, setCellTypes] = useState(() => {
    const saved = localStorage.getItem('cellTypes');
    return saved ? JSON.parse(saved) : DEFAULT_CELL_TYPES;
  });

  useEffect(() => {
    localStorage.setItem('cellTypes', JSON.stringify(cellTypes));
  }, [cellTypes]);

  return [cellTypes, setCellTypes];
}
