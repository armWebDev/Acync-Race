import { useEffect, useState, useCallback } from "react";
import { api, startingDrive, saveOrUpdateWinner } from "../api/api";
import type { CarType } from "../types";
import Car from "./Car";
import WinnerBanner from "./WinnersBanner";
import "./garage.css";

interface GarageProps {
  onSelectCar: (car: CarType) => void;
  onAddCar?: (handler: (car: Omit<CarType, "id">) => Promise<void>) => void;
  onUpdateCar?: (handler: (car: CarType) => Promise<void>) => void;
}

export default function Garage({
  onSelectCar,
  onAddCar,
  onUpdateCar,
}: GarageProps) {
  const [cars, setCars] = useState<CarType[]>([]);
  const [page, setPage] = useState<number>(() => {
    const savedPage = localStorage.getItem("garagePage");
    return savedPage ? Number(savedPage) : 1;
  });
  const [totalCars, setTotalCars] = useState(0);
  const [raceRunning, setRaceRunning] = useState(false);
  const [carRunning, setCarRunning] = useState<Record<number, boolean>>({});
  const [raceTimes, setRaceTimes] = useState<Record<number, number>>({});
  const [winner, setWinner] = useState<{ car: CarType; time: number } | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const PAGE_LIMIT = 7;

  const loadCars = useCallback(
    async (pageToLoad?: number) => {
      const p = pageToLoad ?? page;
      try {
        const response = await api.getCars(p, PAGE_LIMIT);
        setCars(response.data);
        setTotalCars(response.total);

        const totalPages = Math.ceil(response.total / PAGE_LIMIT) || 1;
        if (p > totalPages) {
          setPage(totalPages);
          if (p !== totalPages) await loadCars(totalPages);
        }
      } catch (e: unknown) {
        console.error("Failed to load cars:", e);
        setCars([]);
        setTotalCars(0);
        setPage(1);
      }
    },
    [page] 
  );

  useEffect(() => {
    loadCars();
  }, [loadCars, page]);

  useEffect(() => {
    localStorage.setItem("garagePage", String(page));
  }, [page]);

  const startRace = async () => {
    if (raceRunning) return;
    setRaceRunning(true);
    setLoading(true);
    setRaceTimes({});
    setWinner(null);

    try {
      const { data: allCars } = await api.getCars(1, 1000);
      if (!allCars.length) return;

      let winnerFound = false;

      allCars.forEach(async (car) => {
        try {
          setCarRunning((prev) => ({ ...prev, [car.id]: true }));

          const { velocity, distance } = await api.startEngine(car.id);
          const time = distance / velocity;

          setRaceTimes((prev) => ({ ...prev, [car.id]: time }));

          const success = await startingDrive(car.id);
          if (!success) return;

          if (!winnerFound) {
            winnerFound = true;
            const winnerResult = { car, time };
            setWinner(winnerResult);
            await saveOrUpdateWinner({
              id: car.id,
              wins: 1,
              time,
            });
            await api.resetAllEngines();
          }
        } catch (err) {
          console.warn(err);
        } finally {
          setCarRunning((prev) => ({ ...prev, [car.id]: false }));
        }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setRaceRunning(false);
      setLoading(false);
    }
  };

  const resetRace = async () => {
    await Promise.all(cars.map((car) => api.stopEngine(car.id)));
    setRaceTimes({});
    setRaceRunning(false);
  };

  const addCar = useCallback(async (newCar: Omit<CarType, "id">) => {
    try {
      const savedCar = await api.createCar(newCar);
      setCars((prev) => {
        const filtered = prev.filter((c) => c.id !== savedCar.id);
        return [...filtered, savedCar];
      });
      setTotalCars((prev) => prev + 1);
    } catch (err: unknown) {
      console.error(err);
    }
  }, []);

  const updateCar = useCallback(async (updatedCar: CarType) => {
    try {
      await api.updateCar(updatedCar.id, {
        name: updatedCar.name,
        color: updatedCar.color,
      });
      setCars((prev) =>
        prev.map((c) => (c.id === updatedCar.id ? { ...c, ...updatedCar } : c))
      );
    } catch (err: unknown) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (onAddCar) onAddCar(addCar);
    if (onUpdateCar) onUpdateCar(updateCar);
  }, [onAddCar, onUpdateCar, addCar, updateCar]);

  const removeCar = async (carId: number) => {
    try {
      await api.deleteCar(carId);
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        err.message.includes("Failed to delete car")
      ) {
        console.warn(err);
      } else {
        console.error(err);
      }
    } finally {
      const newTotal = Math.max(0, totalCars - 1);
      const lastPageAfterDelete = Math.max(1, Math.ceil(newTotal / PAGE_LIMIT));

      setCars((prev) => prev.filter((c) => c.id !== carId));
      setTotalCars(newTotal);

      if (page > lastPageAfterDelete) {
        setPage(lastPageAfterDelete);
        await loadCars(lastPageAfterDelete);
      } else {
        await loadCars(page);
      }
    }
  };

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
            onRemoved={() => removeCar(car.id)}
            raceRunning={carRunning[car.id]}
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
