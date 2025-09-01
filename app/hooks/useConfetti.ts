import { useCallback } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiOptions {
  spread?: number;
  startVelocity?: number;
  decay?: number;
  scalar?: number;
  particleCount?: number;
  origin?: {
    x?: number;
    y?: number;
  };
  colors?: string[];
}

export const useConfetti = () => {
  const defaultOptions: ConfettiOptions = {
    spread: 70,
    startVelocity: 30,
    decay: 0.95,
    scalar: 0.8,
    particleCount: 150,
    origin: { y: 0.6 },
    colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d']
  };

  const fireConfetti = useCallback((customOptions?: ConfettiOptions) => {
    const options = { ...defaultOptions, ...customOptions };
    
    // Adjust origin.x if not provided
    if (!options.origin?.x) {
      options.origin = { ...options.origin, x: Math.random() * 0.5 + 0.25 };
    }

    confetti({
      ...options
    });

    // Fire a second burst for a more impressive effect
    setTimeout(() => {
      confetti({
        ...options,
        particleCount: options.particleCount ? options.particleCount / 2 : 75,
        origin: { ...options.origin, x: options.origin?.x ? 1 - options.origin.x : 0.2 }
      });
    }, 250);
  }, []);

  return { fireConfetti };
};
