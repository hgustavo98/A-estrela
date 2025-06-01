import { useState, useEffect, useCallback, useRef } from 'react';
import Grid from './components/Grid';
import Controls from './components/Controls';
import Stats from './components/Stats';
import Legend from './components/Legend';
import { INITIAL_GRID, ANIMATION_SPEED } from './constants';
import { CellType } from './types';

import './index.css';
import BlockTypeSelector from './components/BlockTypeSelector';

// URL base do backend Flask
const API_BASE = 'http://localhost:5000';

function App() {
  // Estado editável do grid
  const [grid, setGrid] = useState(INITIAL_GRID.map(row => [...row]));
  // Novo estado: modo edição
  const [isEditMode, setIsEditMode] = useState(false);
  // Novo estado: tipo de bloco selecionado
  const [selectedBlockType, setSelectedBlockType] = useState<CellType>('C');
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
  const [visitedPositions, setVisitedPositions] = useState<Set<string>>(new Set());
  const [pathPositions, setPathPositions] = useState<[number, number][]>([]);
  const [currentNode, setCurrentNode] = useState<{
    position: [number, number] | null;
    distanceTraveled: number;
    hasMagicFruit: boolean;
    estimatedTotalCost: number;
  }>({
    position: null,
    distanceTraveled: 0,
    hasMagicFruit: false,
    estimatedTotalCost: 0
  });
  const [stepsCount, setStepsCount] = useState(0);
  const [pathFound, setPathFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const animationIntervalRef = useRef<number | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [, setNodeFeMap] = useState<Record<string, number>>({});

  type NodeType = {
    row: number;
    col: number;
    distanceTraveled: number;
    hasMagicFruit: boolean;
    estimatedTotalCost?: number;
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
      hasMagicFruit: node.hasMagicFruit,
      estimatedTotalCost: node.estimatedTotalCost ?? 0
    });
    setNodeFeMap(prev => ({
      ...prev,
      [`${node.row},${node.col}`]: node.estimatedTotalCost ?? 0
    }));
    setStepsCount(prev => prev + 1);
  }, []);

  const handleCellEdit = useCallback((row: number, col: number) => {
    if (!isEditMode) return;
    if (selectedBlockType === 'C' || selectedBlockType === 'S') {
      const exists = grid.some((r, rIdx) => r.some((cell, cIdx) => cell === selectedBlockType && (rIdx !== row || cIdx !== col)));
      if (exists) return;
    }
    setGrid(prev => {
      const newGrid = prev.map(r => [...r]);
      newGrid[row][col] = selectedBlockType;
      return newGrid;
    });
  }, [isEditMode, selectedBlockType, grid]);

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
      hasMagicFruit: false,
      estimatedTotalCost: 0
    });
    setStepsCount(0);
    setPathFound(false);
    setError(null);
    setNodeFeMap({});
    try {
      const res = await fetch(`${API_BASE}/api/reset`, { method: 'POST' });
      if (!res.ok) throw new Error('Servidor indisponível');
      await res.json();
    } catch {
      setError('Não foi possível conectar ao servidor Python.');
    }
  }, []);

  const handleStart = useCallback(async () => {
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
      hasMagicFruit: false,
      estimatedTotalCost: 0
    });
    setStepsCount(0);
    setPathFound(false);
    setError(null);
    setNodeFeMap({});
    try {
      const resReset = await fetch(`${API_BASE}/api/reset`, { method: 'POST' });
      if (!resReset.ok) throw new Error('Servidor indisponível');
      await resReset.json();
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
  }, [updateFromNode, grid]);

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
        <header className="mb-1 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2"> A-estrela</h1>
          <p className="text-gray-300">
            Observe como o algoritmo A* navega pelo grid para encontrar o caminho ideal
          </p>
        </header>
        <div className="mb-2 flex flex-wrap gap-2 items-center justify-between">
          <button
            className={`py-2 px-4 rounded-md font-bold transition-colors duration-200 ${isEditMode ? 'bg-yellow-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => setIsEditMode(e => !e)}
          >
            {isEditMode ? 'Modo Execução' : 'Modo Edição'}
          </button>
          {isEditMode && (
            <BlockTypeSelector selected={selectedBlockType} onSelect={setSelectedBlockType} />
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <div className="lg:col-span-2">
            <Grid
              grid={grid}
              currentPosition={currentPosition}
              visitedPositions={visitedPositions}
              pathPositions={pathPositions}
              isEditMode={isEditMode}
              onCellEdit={handleCellEdit}
              isMouseDown={isMouseDown}
              setIsMouseDown={setIsMouseDown}
             
            />
            <div className="mt-2">
              <Controls
                isRunning={isRunning && !isEditMode}
                isPaused={isPaused}
                onStart={!isEditMode ? handleStart : () => { }}
                onPause={!isEditMode ? handlePause : () => { }}
                onStep={!isEditMode ? handleStep : () => { }}
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