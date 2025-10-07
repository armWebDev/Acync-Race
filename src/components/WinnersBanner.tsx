import type { CarType } from "../types";
import "./WinnerBanner.css";

interface WinnerBannerProps {
  car: CarType;
  time: number;
  onClose: () => void;
}

export default function WinnerBanner({ car, time, onClose }: WinnerBannerProps) {
  return (
    <div className="winner-overlay">
      <div className="winner-banner">
        <span className="winner-text">🏆 Winner:</span> 
        <span className="winner-name">
          {car.name} finished in {time.toFixed(2)}s
        </span>
        <button className="winner-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
