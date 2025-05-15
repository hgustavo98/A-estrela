import { useState, useEffect, useCallback, useRef } from 'react';
import Grid from './components/Grid';
import Controls from './components/Controls';
import Stats from './components/Stats';
import Legend from './components/Legend';
import { runPathfindingAlgorithm } from './utils/pathfinding';
import { INITIAL_GRID, ANIMATION_SPEED } from './constants';
import { IPathNode } from './types';

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
  
  const [algorithmSteps, setAlgorithmSteps] = useState<IPathNode[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const animationIntervalRef = useRef<number | null>(null);
  
  const handleReset = useCallback(() => {
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
    setAlgorithmSteps([]);
    setCurrentStepIndex(0);
  }, []);
  
  const handleVisitNode = useCallback((node: IPathNode) => {
    setCurrentPosition([node.row, node.col]);
    setVisitedPositions(prev => {
      const updated = new Set(prev);
      updated.add(`${node.row},${node.col}`);
      return updated;
    });
    setPathPositions(node.path.slice(0, -1) as [number, number][]);
    setCurrentNode({
      position: [node.row, node.col],
      distanceTraveled: node.distanceTraveled,
      hasMagicFruit: node.hasMagicFruit
    });
    setStepsCount(prev => prev + 1);
  }, []);
  
  const handleFoundPath = useCallback((finalNode: IPathNode) => {
    setPathPositions(finalNode.path as [number, number][]);
    setPathFound(true);
    setIsPaused(true);
  }, []);
  
  const runAlgorithm = useCallback(() => {
    handleReset();
    const steps = runPathfindingAlgorithm(grid);
    setAlgorithmSteps(steps);
    setIsRunning(true);
  }, [grid, handleReset]);
  
  const handleStep = useCallback(() => {
    if (currentStepIndex < algorithmSteps.length) {
      const node = algorithmSteps[currentStepIndex];
      handleVisitNode(node);
      
      if (grid[node.row][node.col] === 'S') {
        handleFoundPath(node);
      }
      
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [currentStepIndex, algorithmSteps, handleVisitNode, handleFoundPath, grid]);
  
  const handleStart = useCallback(() => {
    if (!isRunning) {
      runAlgorithm();
    } else {
      setIsPaused(false);
    }
  }, [isRunning, runAlgorithm]);
  
  const handlePause = useCallback(() => {
    setIsPaused(true);
  }, []);
  
  useEffect(() => {
    if (isRunning && !isPaused && algorithmSteps.length > 0) {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
      
      animationIntervalRef.current = window.setInterval(() => {
        if (currentStepIndex < algorithmSteps.length) {
          const node = algorithmSteps[currentStepIndex];
          handleVisitNode(node);
          
          if (grid[node.row][node.col] === 'S') {
            handleFoundPath(node);
            clearInterval(animationIntervalRef.current!);
            animationIntervalRef.current = null;
          }
          
          setCurrentStepIndex(prev => prev + 1);
        } else {
          clearInterval(animationIntervalRef.current!);
          animationIntervalRef.current = null;
          setIsPaused(true);
        }
      }, ANIMATION_SPEED);
      
      return () => {
        if (animationIntervalRef.current) {
          clearInterval(animationIntervalRef.current);
          animationIntervalRef.current = null;
        }
      };
    }
  }, [
    isRunning, 
    isPaused, 
    algorithmSteps, 
    currentStepIndex, 
    handleVisitNode, 
    handleFoundPath,
    grid
  ]);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
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
      </div>
    </div>
  );
}

export default App;