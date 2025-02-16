import { useState, useCallback } from 'react';

function useUndoRedo(initialState) {
  const [history, setHistory] = useState([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const state = history[currentIndex];

  const set = useCallback(
    (newState) => {
      setHistory((prevHistory) => {
        const updatedHistory = prevHistory.slice(0, currentIndex + 1);
        const resolvedState =
          typeof newState === 'function' ? newState(prevHistory[currentIndex]) : newState;
        return [...updatedHistory, resolvedState];
      });
      setCurrentIndex((prevIndex) => prevIndex + 1);
    },
    [currentIndex]
  );

  const undo = useCallback(() => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0)); // Назад, но не ниже 0
  }, []);

  const redo = useCallback(() => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, history.length - 1)); // Вперёд, но не выше последнего состояния
  }, [history.length]);

  return { state, set, undo, redo };
}

export default useUndoRedo;
