import { useEffect, useState } from "react";
import { api, startingDrive, saveOrUpdateWinner } from "../api/api";
import type { CarType } from "../types";
import Car from "./Car";
import WinnerBanner from "./WinnersBanner";
import "./garage.css";

interface GarageProps {
  onSelectCar: (car: CarType) => void;
}

export default function Garage({ onSelectCar }: GarageProps) {
  const [cars, setCars] = useState<CarType[]>([]);
  const [page, setPage] = useState(1);
  const [totalCars, setTotalCars] = useState(0);
  const [raceRunning, setRaceRunning] = useState(false);
  const [raceTimes, setRaceTimes] = useState<{ [id: number]: number }>({});
  const [winner, setWinner] = useState<{ car: CarType; time: number } | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const PAGE_LIMIT = 7;

  useEffect(() => {
    loadCars();
  }, [page]);

  async function loadCars() {
    try {
      const response = await api.getCars(page, PAGE_LIMIT);
      setCars(response.data);
      setTotalCars(response.total);
    } catch (e) {
      console.error("Failed to load cars:", e);
      setCars([]);
      setTotalCars(0);
    }
  }

  async function startRace() {
    if (raceRunning) return;
    setRaceRunning(true);
    setLoading(true);

    const times: { [id: number]: number } = {};

    const results = await Promise.all(
      cars.map(async (car) => {
        try {
          const { velocity, distance } = await api.startEngine(car.id);
          const time = distance / velocity;
          times[car.id] = time;

          const success = await startingDrive(car.id);
          if (!success) return null;

          return { car, time };
        } catch (err: any) {
          if (err.message?.includes("429")) {
            await new Promise((res) => setTimeout(res, 100));
            try {
              const { velocity, distance } = await api.startEngine(car.id);
              const time = distance / velocity;
              times[car.id] = time;

              const success = await startingDrive(car.id);
              if (!success) return null;

              return { car, time };
            } catch {
              return null;
            }
          }
          return null;
        }
      })
    );

    const finishedCars = results.filter(
      (r): r is { car: CarType; time: number } => r !== null
    );

    setRaceTimes(times);

    const first = finishedCars.length
      ? finishedCars.reduce((a, b) => (a.time < b.time ? a : b))
      : null;

    if (first) {
      setWinner({ car: first.car, time: first.time });

      try {
        await saveOrUpdateWinner({
          id: first.car.id,
          wins: 1,
          time: first.time,
        });
        window.open("/winners", "_blank");
      } catch (err) {
        console.warn(err);
      }
    }

    setRaceRunning(false);
    setLoading(false);
  }

  async function resetRace() {
    await Promise.all(cars.map((car) => api.stopEngine(car.id)));
    setRaceTimes({});
    setRaceRunning(false);
  }

  return (
    <div className="garage-container">
      <h2>
        Garage ({totalCars} cars, Page {page})
      </h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={startRace} disabled={raceRunning || loading}>
          {loading ? "Racing..." : "Race"}
        </button>
        <button
          onClick={resetRace}
          disabled={loading}
          style={{ marginLeft: 8 }}
        >
          Reset
        </button>
      </div>

      <div>
        {cars.map((car) => (
          <Car
            key={car.id}
            car={car}
            raceStarted={raceRunning}
            raceTime={raceTimes[car.id]}
            onSelect={onSelectCar}
            onRemoved={loadCars}
          />
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
        >
          Previous
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={cars.length < PAGE_LIMIT || loading}
          style={{ marginLeft: 8 }}
        >
          Next
        </button>
      </div>

      {winner && (
        <WinnerBanner
          car={winner.car}
          time={winner.time}
          onClose={() => setWinner(null)}
        />
      )}
    </div>
  );
}
