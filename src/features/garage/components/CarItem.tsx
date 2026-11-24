import { memo } from 'react';
import { useAppSelector } from '../../../app/hooks';
import type { Car } from '../../../types';
import Track from '../../race/components/Track';
import { selectEngine } from '../../race/raceSelectors';
import useCarControls from '../hooks/useCarControls';
import CarActions from './CarActions';

interface CarItemProps {
  car: Car;
}

function CarItem({ car }: CarItemProps) {
  const controls = useCarControls(car);
  const engine = useAppSelector((state) => selectEngine(state, car.id));

  return (
    <li className="car-item">
      <div className="car-item__header">
        <CarActions carName={car.name} controls={controls} />
        <span className="car-item__name">{car.name}</span>
      </div>
      <Track color={car.color} engine={engine} />
    </li>
  );
}

export default memo(CarItem);
