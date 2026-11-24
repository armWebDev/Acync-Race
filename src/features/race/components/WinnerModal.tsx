import { useCallback, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import CarIcon from '../../../components/CarIcon';
import { formatSeconds } from '../../../utils/format';
import { winnerDismissed } from '../raceSlice';
import { selectRaceWinner } from '../raceSelectors';
import './race.css';

export default function WinnerModal() {
  const dispatch = useAppDispatch();
  const winner = useAppSelector(selectRaceWinner);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const close = useCallback(() => dispatch(winnerDismissed()), [dispatch]);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (winner && dialog && !dialog.open) {
      dialog.showModal();
    }
  }, [winner]);

  if (!winner) {
    return null;
  }

  return createPortal(
    <dialog ref={dialogRef} className="modal" aria-labelledby="winner-title" onClose={close}>
      <p className="modal__eyebrow">🏆 Winner</p>
      <CarIcon color={winner.car.color} className="modal__car" />
      <h2 id="winner-title" className="modal__title">
        {winner.car.name}
      </h2>
      <p className="modal__text">finished in {formatSeconds(winner.time)}</p>
      <button type="button" className="button button--primary" onClick={close}>
        Close
      </button>
    </dialog>,
    document.body,
  );
}
