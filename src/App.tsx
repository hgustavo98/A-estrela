import { useState, useEffect, useCallback, useRef } from 'react';
import Grid from './components/Grid';
import Controls from './components/Controls';
import Stats from './components/Stats';
import Legend from './components/Legend';
import { INITIAL_GRID, ANIMATION_SPEED } from './constants';
import './index.css'; 


// URL base do backend Flask
const API_BASE = 'http://localhost:5000';

function App() {
  const [grid] = useState(INITIAL_GRID);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
  const [visitedPositions, setVisitedPositions] = useState<Set<string>>(new Set());
  const [pathPositions, setPathPositions] = useState<[number, number][]>([]);
  const [currentNode, setCurrentNode] = useState<{
    position: [number, number] | null;
    distanceTraveled: number;
    hasMagicFruit: boolean;
  }>({
    position: null,
    distanceTraveled: 0,
    hasMagicFruit: false
  });
  const [stepsCount, setStepsCount] = useState(0);
  const [pathFound, setPathFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const animationIntervalRef = useRef<number | null>(null);

  // Função para atualizar o estado do nó atual a partir da resposta do backend
  type NodeType = {
    row: number;
    col: number;
    distanceTraveled: number;
    hasMagicFruit: boolean;
    path?: [number, number][];
  };

  const updateFromNode = useCallback((node: NodeType) => {
    setCurrentPosition([node.row, node.col]);
    setVisitedPositions(prev => {
      const updated = new Set(prev);
      updated.add(`${node.row},${node.col}`);
      return updated;
    });
    setPathPositions(node.path ? node.path : []);
    setCurrentNode({
      position: [node.row, node.col],
      distanceTraveled: node.distanceTraveled,
      hasMagicFruit: node.hasMagicFruit
    });
    setStepsCount(prev => prev + 1);
  }, []);

  const handleReset = useCallback(async () => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }
    setIsRunning(false);
    setIsPaused(false);
    setCurrentPosition(null);
    setVisitedPositions(new Set());
    setPathPositions([]);
    setCurrentNode({
      position: null,
      distanceTraveled: 0,
      hasMagicFruit: false
    });
    setStepsCount(0);
    setPathFound(false);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/reset`, { method: 'POST' });
      if (!res.ok) throw new Error('Servidor indisponível');
      await res.json();
    } catch {
      setError('Não foi possível conectar ao servidor Python.');
    }
  }, []);

  const handleStart = useCallback(async () => {
    await handleReset();
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grid }),
      });
      if (!res.ok) throw new Error('Servidor indisponível');
      const data = await res.json();
      if (data && data.node) {
        updateFromNode(data.node);
        setIsRunning(true);
        setIsPaused(false);
        setPathFound(false);
      }
    } catch {
      setError('Não foi possível conectar ao servidor Python.');
    }
  }, [handleReset, updateFromNode, grid]);

  const handleStep = useCallback(async () => {
    if (!isRunning || pathFound) return;
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/step`, { method: 'POST' });
      if (!res.ok) throw new Error('Servidor indisponível');
      const data = await res.json();
      if (data.status === 'found') {
        setPathPositions(data.path);
        setPathFound(true);
        setIsPaused(true);
        updateFromNode(data.node);
      } else if (data.status === 'not_found') {
        setIsPaused(true);
        setIsRunning(false);
      } else if (data.status === 'running' && data.node) {
        updateFromNode(data.node);
      }
    } catch {
      setError('Não foi possível conectar ao servidor Python.');
    }
  }, [isRunning, pathFound, updateFromNode]);

  const handlePause = useCallback(() => {
    setIsPaused(true);
  }, []);

  // Animação automática dos passos
  useEffect(() => {
    if (isRunning && !isPaused && !pathFound) {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
      animationIntervalRef.current = window.setInterval(() => {
        handleStep();
      }, ANIMATION_SPEED);
      return () => {
        if (animationIntervalRef.current) {
          clearInterval(animationIntervalRef.current);
          animationIntervalRef.current = null;
        }
      };
    }
  }, [isRunning, isPaused, pathFound, handleStep]);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2"> A-estrela</h1>
          <p className="text-gray-300">
            Observe como o algoritmo A* navega pelo grid para encontrar o caminho ideal
          </p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Grid 
              grid={grid}
              currentPosition={currentPosition}
              visitedPositions={visitedPositions}
              pathPositions={pathPositions}
            />
            <div className="mt-4">
              <Controls 
                isRunning={isRunning}
                isPaused={isPaused}
                onStart={handleStart}
                onPause={handlePause}
                onStep={handleStep}
                onReset={handleReset}
              />
            </div>
          </div>
          <div className="space-y-6">
            <Stats 
              currentNode={currentNode}
              stepsCount={stepsCount}
              pathFound={pathFound}
            />
          </div>
          <div className="lg:col-span-2">
            <Legend />
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

export default App;