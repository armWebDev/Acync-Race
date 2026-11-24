import { useCreateCarForm, useUpdateCarForm } from '../hooks/useCarForms';
import CarForm from './CarForm';

export default function CarEditor() {
  const createForm = useCreateCarForm();
  const updateForm = useUpdateCarForm();

  return (
    <div className="car-editor">
      <CarForm
        values={createForm.values}
        submitLabel="Create"
        disabled={createForm.isDisabled}
        onChange={createForm.change}
        onSubmit={createForm.submit}
      />
      <CarForm
        values={updateForm.values}
        submitLabel="Update"
        disabled={updateForm.isDisabled}
        onChange={updateForm.change}
        onSubmit={updateForm.submit}
      />
    </div>
  );
}
