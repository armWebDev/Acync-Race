import { useEffect, useRef, useState } from "react";
import Garage from "./components/Garage";
import Winners from "./components/Winners";
import type { CarType } from "./types";

type GarageRef = {
  addCar?: (car: Omit<CarType, "id">) => Promise<void>;
  updateCar?: (car: CarType) => Promise<void>;
};

export default function App() {
  const [page, setPage] = useState<"garage" | "winners">("garage");
  const [carName, setCarName] = useState("");
  const [updatedCarName, setUpdatedCarName] = useState("");
  const [carColor, setCarColor] = useState("#000000");
  const [updatedCarColor, setUpdatedCarColor] = useState("#000000");
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);
  const garageRef = useRef<GarageRef>({});

  const brands = [
    "Tesla",
    "BMW",
    "Mercedes",
    "Audi",
    "Ford",
    "Toyota",
    "Honda",
    "Nissan",
    "Chevy",
    "Kia",
  ];
  const models = [
    "X",
    "Y",
    "Z",
    "S",
    "GT",
    "Sport",
    "Turbo",
    "Pro",
    "Prime",
    "Coupe",
  ];

  const getRandomName = () => {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const model = models[Math.floor(Math.random() * models.length)];
    return `${brand} ${model}`;
  };

  const getRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;

  useEffect(() => {
    if (selectedCar) {
      setUpdatedCarName(selectedCar.name);
      setUpdatedCarColor(selectedCar.color);
    }
  }, [selectedCar]);

  const handleCreate = async () => {
    if (!garageRef.current.addCar) return;

    const newCar: Omit<CarType, "id"> = { name: carName, color: carColor };
    await garageRef.current.addCar(newCar);
    setCarName("");
    setCarColor("#000000");
  };

  const handleUpdate = async () => {
    if (!selectedCar) {
      return;
    }
    if (!garageRef.current.updateCar) return;

    await garageRef.current.updateCar({
      ...selectedCar,
      name: updatedCarName,
      color: updatedCarColor,
    });

    setUpdatedCarName("");
    setUpdatedCarColor("#000000");
  };

  const handleGenerateCars = async () => {
    if (!garageRef.current.addCar) return;

    const requests = Array.from({ length: 100 }, () => {
      const newCar = { name: getRandomName(), color: getRandomColor() };
      return garageRef.current.addCar!(newCar);
    });

    await Promise.all(requests);
  };

  return (
    <div>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          backgroundColor: "#f0f0f0",
          borderBottom: "2px solid #ccc",
          gap: "20px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setPage("garage")}
            style={{
              padding: "6px 12px",
              borderRadius: "5px",
              border: "1px solid #888",
              backgroundColor: page === "garage" ? "#ccc" : "#fff",
              cursor: "pointer",
            }}
          >
            Garage
          </button>
          <button
            onClick={() => setPage("winners")}
            style={{
              padding: "6px 12px",
              borderRadius: "5px",
              border: "1px solid #888",
              backgroundColor: page === "winners" ? "#ccc" : "#fff",
              cursor: "pointer",
            }}
          >
            Winners
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="color"
            value={carColor}
            onChange={(e) => setCarColor(e.target.value)}
          />
          <input
            type="text"
            placeholder="Car name"
            value={carName}
            onChange={(e) => setCarName(e.target.value)}
            style={{
              padding: "5px",
              borderRadius: "5px",
              border: "1px solid #888",
            }}
          />
          <button
            onClick={handleCreate}
            style={{
              padding: "6px 12px",
              borderRadius: "5px",
              border: "1px solid #888",
              backgroundColor: "#4CAF50",
              color: "white",
              cursor: "pointer",
            }}
          >
            Create
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="color"
            value={updatedCarColor}
            onChange={(e) => setUpdatedCarColor(e.target.value)}
          />
          <input
            type="text"
            placeholder="Car name"
            value={updatedCarName}
            onChange={(e) => setUpdatedCarName(e.target.value)}
            style={{
              padding: "5px",
              borderRadius: "5px",
              border: "1px solid #888",
            }}
          />
          <button
            onClick={handleUpdate}
            style={{
              padding: "6px 12px",
              borderRadius: "5px",
              border: "1px solid #888",
              backgroundColor: "#4CAF50",
              color: "white",
              cursor: "pointer",
            }}
          >
            Update
          </button>
        </div>

        <div>
          <button
            onClick={handleGenerateCars}
            style={{
              padding: "6px 12px",
              borderRadius: "5px",
              border: "1px solid #888",
              backgroundColor: "#4CAF50",
              color: "white",
              cursor: "pointer",
            }}
          >
            Generate cars
          </button>
        </div>
      </header>

      {page === "garage" ? (
        <Garage
          onSelectCar={setSelectedCar}
          onAddCar={(fn) => {
            garageRef.current.addCar = fn;
          }}
          onUpdateCar={(fn) => {
            garageRef.current.updateCar = fn;
          }}
        />
      ) : (
        <Winners />
      )}
    </div>
  );
}
