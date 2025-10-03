import { useEffect, useState } from "react";
import Garage from "./components/Garage";
import Winners from "./components/Winners";
import { api } from "./api/api";
import type { CarType } from "./types";

export default function App() {
  const [page, setPage] = useState<"garage" | "winners">("garage");
  const [carName, setCarName] = useState("");
  const [updatedCarName, setUpdatedCarName] = useState("");
  const [carColor, setCarColor] = useState("#000000");
  const [updatedCarColor, setUpdatedCarColor] = useState("#000000");
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);

  // 🔹 car name + color randomizer
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

  // 🔹 Create one car
  const handleCreate = async () => {
    try {
      const newCar: Omit<CarType, "id"> = {
        name: carName,
        color: carColor,
      };
      await api.createCar(newCar);
      window.location.reload();
      setCarName("");
      setCarColor("#000000");
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Update selected car
  const handleUpdate = async () => {
    if (!selectedCar) {
      alert(`You don’t select any car to update`);
      return;
    }

    await api.updateCar(selectedCar.id, {
      name: updatedCarName,
      color: updatedCarColor,
    });

    window.location.reload();
    setCarName("");
    setCarColor("#000000");
  };

  // 🔹 Generate 100 random cars
  const handleGenerateCars = async () => {
    try {
      const requests = Array.from({ length: 100 }, () =>
        api.createCar({
          name: getRandomName(),
          color: getRandomColor(),
        })
      );

      await Promise.all(requests);
      window.location.reload(); // refresh garage
    } catch (err) {
      console.error("Error generating cars:", err);
    }
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
        {/* 🔹 Navigation buttons */}
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

        {/* 🔹 Create car form */}
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

        {/* 🔹 Update car form */}
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

        {/* 🔹 Generate random cars */}
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
        <Garage onSelectCar={setSelectedCar} />
      ) : (
        <Winners />
      )}
    </div>
  );
}
