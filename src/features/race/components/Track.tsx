import CarIcon from '../../../components/CarIcon';
import useCarAnimation from '../hooks/useCarAnimation';
import type { EngineState } from '../raceTypes';
import './race.css';

interface TrackProps {
  color: string;
  engine: EngineState | undefined;
}

export default function Track({ color, engine }: TrackProps) {
  const runnerRef = useCarAnimation(engine);
  const isBroken = engine?.status === 'broken';

  return (
    <div className="track">
      <div className="track__lane">
        <div ref={runnerRef} className="track__runner">
          <CarIcon
            color={color}
            className={isBroken ? 'track__car track__car--broken' : 'track__car'}
          />
        </div>
      </div>
      <div className="track__finish" aria-hidden="true" />
    </div>
  );
}
