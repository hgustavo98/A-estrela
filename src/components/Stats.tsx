import React from 'react';

interface StatsProps {
  currentNode: {
    position: [number, number] | null;
    distanceTraveled: number;
    hasMagicFruit: boolean;
  };
  stepsCount: number;
  pathFound: boolean;
}

const Stats: React.FC<StatsProps> = ({ currentNode, stepsCount, pathFound }) => {
  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-800 rounded-lg shadow-lg text-white">
      <h3 className="text-xl font-bold mb-2">Estatísticas do Algoritmo</h3>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <div className="font-semibold">Posição Atual:</div>
        <div>
          {currentNode.position 
            ? `[${currentNode.position[0]}, ${currentNode.position[1]}]` 
            : 'N/A'}
        </div>
        
        <div className="font-semibold">Distância Percorrida:</div>
        <div>{currentNode.distanceTraveled}</div>
        
        <div className="font-semibold">Fruta Mágica:</div>
        <div className={currentNode.hasMagicFruit ? 'text-green-400' : 'text-gray-400'}>
          {currentNode.hasMagicFruit ? 'Coletada ✓' : 'Não Coletada ✗'}
        </div>
        
        <div className="font-semibold">Passos Analisados:</div>
        <div>{stepsCount}</div>

        <div className="font-semibold">Status do Caminho:</div>
        <div className={pathFound ? 'text-green-400' : 'text-yellow-400'}>
            {pathFound ? 'Caminho Encontrado! ✓' : stepsCount > 0 ? 'Procurando...' : 'Pendente'}
        </div>
      </div>
    </div>
  );
};

export default Stats