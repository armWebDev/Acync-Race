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
  const [page, setPage] = useState<number>(() => {
    const savedPage = localStorage.getItem("garagePage");
    return savedPage ? Number(savedPage) : 1;
  });
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

  useEffect(() => {
    localStorage.setItem("garagePage", String(page));
  }, [page]);

  async function loadCars() {
    try {
      const response = await api.getCars(page, PAGE_LIMIT);
      setCars(response.data);
      setTotalCars(response.total);

      const totalPages = Math.ceil(response.total / PAGE_LIMIT) || 1;
      if (page > totalPages) {
        setPage(totalPages);
      }
    } catch (e) {
      console.error("Failed to load cars:", e);
      setCars([]);
      setTotalCars(0);
      setPage(1);
    }
  }

  async function startRace() {
    if (raceRunning) return;
    setRaceRunning(true);
    setLoading(true);

    setRaceTimes({});
    setWinner(null);

    try {
      const { data: allCars } = await api.getCars(1, 1000);
      if (!allCars.length) return;

      let winnerDeclared = false; 

      await Promise.all(
        allCars.map(async (car) => {
          try {
            const { velocity, distance } = await api.startEngine(car.id);
            const time = distance / velocity;
            setRaceTimes((prev) => ({ ...prev, [car.id]: time }));

            const success = await startingDrive(car.id);
            if (!success) return;

            if (!winnerDeclared) {
              winnerDeclared = true;
              setWinner({ car, time });
              try {
                await saveOrUpdateWinner({ id: car.id, wins: 1, time });
              } catch (err) {
                console.warn("Failed to save winner:", err);
              }
            }
          } catch (err) {
            console.warn(`Car ${car.name} failed to start:`, err);
          }
        })
      );
    } catch (err) {
      console.error("Race failed:", err);
    } finally {
      setRaceRunning(false);
      setLoading(false);
    }
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
            raceTime={raceTimes[car.id]}
            onSelect={onSelectCar}
            onRemoved={loadCars}
          />
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <hr />
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
        >
          Previous
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= Math.ceil(totalCars / PAGE_LIMIT) || loading}
          style={{ marginLeft: 8 }}
        >
          Next
        </button>
      </div>

      {winner && (
        <WinnerBanner
          car={winner.car}
          time={winner.time}
          onClose={() => {
            setWinner(null);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
