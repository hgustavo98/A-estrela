import React from 'react';
import { CELL_TYPES } from '../constants';
import { CellType } from '../types';

const Legend: React.FC = () => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg text-white w-full">
      <h3 className="text-xl font-bold mb-3">Legenda</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(Object.entries(CELL_TYPES) as [CellType, typeof CELL_TYPES[CellType]][]).map(
          ([type, info]) => (
            <div key={type} className="flex items-center gap-2">
              <div 
                className={`w-8 h-8 flex p-3 items-center justify-center rounded-md ${info.color} text-white font-bold`}
              >
                {type}
              </div>
              <div>
                <div className="font-semibold">{info.name}</div>
                <div className="text-xs text-gray-300">{info.description}</div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Legend