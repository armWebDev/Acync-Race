import type { FormEvent } from 'react';
import { CAR_NAME_MAX_LENGTH } from '../../../constants';
import type { CarFormValues } from '../carFormsSlice';

interface CarFormProps {
  values: CarFormValues;
  submitLabel: string;
  disabled?: boolean;
  onChange: (patch: Partial<CarFormValues>) => void;
  onSubmit: () => void;
}

export default function CarForm({
  values,
  submitLabel,
  disabled = false,
  onChange,
  onSubmit,
}: CarFormProps) {
  const canSubmit = !disabled && values.name.trim().length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canSubmit) {
      onSubmit();
    }
  };

  return (
    <form className="car-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="input"
        placeholder="Car name"
        aria-label={`${submitLabel}: car name`}
        maxLength={CAR_NAME_MAX_LENGTH}
        value={values.name}
        disabled={disabled}
        onChange={(event) => onChange({ name: event.target.value })}
      />
      <input
        type="color"
        className="color-input"
        aria-label={`${submitLabel}: car color`}
        value={values.color}
        disabled={disabled}
        onChange={(event) => onChange({ color: event.target.value })}
      />
      <button type="submit" className="button button--primary" disabled={!canSubmit}>
        {submitLabel}
      </button>
    </form>
  );
}
