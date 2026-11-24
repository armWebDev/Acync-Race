import { useEffect, useLayoutEffect, useRef } from 'react';
import type { EngineState } from '../raceTypes';

const toTransform = (progress: number) => `translateX(${progress * 100}%)`;

const getProgress = (engine: EngineState | undefined): number => {
  if (!engine || engine.duration === 0) {
    return 0;
  }

  if (engine.status === 'finished') {
    return 1;
  }

  if (engine.status === 'driving' || engine.status === 'broken') {
    const endTime = engine.stoppedAt ?? Date.now();
    const progress = (endTime - engine.startedAt) / engine.duration;
    return Math.min(1, Math.max(0, progress));
  }

  return 0;
};

export default function useCarAnimation(engine: EngineState | undefined) {
  const elementRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }

    const animation = animationRef.current;

    if (engine?.status === 'stopping') {
      animation?.pause();
      return;
    }

    if (engine?.status === 'finished' && animation?.playState === 'running') {
      return;
    }

    animation?.cancel();
    animationRef.current = null;

    const progress = getProgress(engine);
    element.style.transform = toTransform(progress);

    if (engine?.status === 'driving' && progress < 1) {
      animationRef.current = element.animate(
        [{ transform: toTransform(progress) }, { transform: toTransform(1) }],
        {
          duration: engine.duration * (1 - progress),
          easing: 'linear',
          fill: 'forwards',
        },
      );
    }
  }, [engine]);

  useEffect(() => () => animationRef.current?.cancel(), []);

  return elementRef;
}
