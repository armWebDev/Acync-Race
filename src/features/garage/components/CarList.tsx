import type { Car } from '../../../types';
import CarItem from './CarItem';

interface CarListProps {
  cars: Car[];
  isLoading: boolean;
}

export default function CarList({ cars, isLoading }: CarListProps) {
  if (cars.length === 0) {
    return (
      <p className="empty-state">
        {isLoading ? 'Loading cars…' : 'The garage is empty. Create a car or generate a few!'}
      </p>
    );
  }

  return (
    <ul className="car-list">
      {cars.map((car) => (
        <CarItem key={car.id} car={car} />
      ))}
    </ul>
  );
}
