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
  const [foundPath, setFoundPath] = useState<[number, number][]>([]);
  const [pathIndex, setPathIndex] = useState(0);
  
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
    setFoundPath([]);
    setPathIndex(0);
  }, []);

  const handleFoundPath = useCallback((finalNode: IPathNode) => {
    setFoundPath(finalNode.path as [number, number][]);
    setPathFound(true);
    setIsPaused(true);
  }, []);

  const runAlgorithm = useCallback(() => {
    handleReset();
    const steps = runPathfindingAlgorithm(grid);
    const finalNode = steps[steps.length - 1];
    if (grid[finalNode.row][finalNode.col] === 'S') {
      handleFoundPath(finalNode);
    }
  }, [grid, handleReset, handleFoundPath]);

  const handleStart = useCallback(() => {
    if (!isRunning) {
      runAlgorithm();
      setIsRunning(true);
    } else if (pathFound && isPaused) {
      setIsPaused(false);
    }
  }, [isRunning, pathFound, isPaused, runAlgorithm]);

  const handlePause = useCallback(() => {
    setIsPaused(true);
  }, []);

  useEffect(() => {
    if (isRunning && !isPaused && pathFound && pathIndex < foundPath.length) {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }

      animationIntervalRef.current = window.setInterval(() => {
        setPathIndex(prev => {
          const newIndex = prev + 1;
          if (newIndex >= foundPath.length) {
            clearInterval(animationIntervalRef.current!);
            return prev;
          }
          setCurrentPosition(foundPath[newIndex]);
          setPathPositions(foundPath.slice(0, newIndex + 1));
          return newIndex;
        });
      }, ANIMATION_SPEED);

      return () => {
        if (animationIntervalRef.current) {
          clearInterval(animationIntervalRef.current);
        }
      };
    }
  }, [isRunning, isPaused, pathFound, pathIndex, foundPath]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">A-estrela</h1>
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
                onStep={() => {
                  if (pathFound && pathIndex < foundPath.length - 1) {
                    setPathIndex(prev => prev + 1);
                    setCurrentPosition(foundPath[pathIndex + 1]);
                    setPathPositions(foundPath.slice(0, pathIndex + 2));
                  }
                }}
                onReset={handleReset}
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <Stats 
              currentNode={{
                position: currentPosition,
                distanceTraveled: pathIndex,
                hasMagicFruit: pathFound && grid[foundPath[pathIndex]?.[0] ?? 0][foundPath[pathIndex]?.[1] ?? 0] === 'F'
              }}
              stepsCount={pathIndex}
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