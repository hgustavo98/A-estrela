import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface ControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  isRunning,
  isPaused,
  onStart,
  onPause,
 
  onReset
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-blue-800/10 rounded-lg shadow-lg itens-center justify-center">
      <div className="flex gap-2">
        {!isRunning || isPaused ? (
          <button 
            onClick={onStart}
            className="flex items-center gap-2 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md
                      transition-colors duration-200"
          >
            <Play size={18} /> {isPaused ? 'Continuar' : 'Iniciar'}
          </button>
        ) : (
          <button 
            onClick={onPause}
            className="flex items-center gap-2 py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md
                      transition-colors duration-200"
          >
            <Pause size={18} /> Pausar
          </button>
        )}
        
       
        
        <button 
          onClick={onReset}
          className="flex items-center gap-2 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md
                    transition-colors duration-200"
        >
          <RotateCcw size={18} /> Reiniciar
        </button>
      </div>
    </div>
  );
}

export default Controls