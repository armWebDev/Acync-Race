import type { CarControls } from '../hooks/useCarControls';

interface EngineButtonProps {
  label: string;
  title: string;
  onClick: () => void;
  disabled: boolean;
}

function EngineButton({ label, title, onClick, disabled }: EngineButtonProps) {
  return (
    <button
      type="button"
      className="button button--small button--engine"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
    >
      {label}
    </button>
  );
}

interface CarActionsProps {
  carName: string;
  controls: CarControls;
}

export default function CarActions({ carName, controls }: CarActionsProps) {
  return (
    <div className="car-item__actions">
      <button
        type="button"
        className="button button--small"
        onClick={controls.select}
        disabled={!controls.canSelect}
      >
        Select
      </button>

      <button
        type="button"
        className="button button--small button--danger"
        onClick={controls.remove}
        disabled={!controls.canRemove}
      >
        Remove
      </button>

      <EngineButton
        label="A"
        title={`Start ${carName}`}
        onClick={controls.start}
        disabled={!controls.canStart}
      />

      <EngineButton
        label="B"
        title={`Stop ${carName}`}
        onClick={controls.stop}
        disabled={!controls.canStop}
      />
    </div>
  );
}
