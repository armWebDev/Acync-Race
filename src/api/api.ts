import type { CarType, EngineResponse, WinnerType } from "../types";

const BASE = 'http://localhost:3000';

export const api = {
  getCars: async (page = 1, limit = 7): Promise<{ data: CarType[]; total: number }> => {
    const res = await fetch(`${BASE}/garage?_page=${page}&_limit=${limit}`);
    if (!res.ok) throw new Error("Failed to load cars");

    const total = Number(res.headers.get("X-Total-Count")) || 0;
    const data = (await res.json()) as CarType[];

    return { data, total };
  },

  getCar: async (id: number): Promise<CarType | null> => {
    try {
      const res = await fetch(`${BASE}/garage/${id}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`Failed to fetch car ${id}: ${res.status}`);
      return res.json() as Promise<CarType>;
    } catch (err) {
      console.error(`Error fetching car ${id}:`, err);
      return null;
    }
  },

  createCar: async (car: Omit<CarType, "id">): Promise<CarType> => {
    const res = await fetch(`${BASE}/garage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(car),
    });
    if (!res.ok) throw new Error("Failed to create car");
    return res.json() as Promise<CarType>;
  },

  deleteCar: async (id: number): Promise<void> => {
    const res = await fetch(`${BASE}/garage/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete car");
    await fetch(`${BASE}/winners/${id}`, { method: "DELETE" }).catch(() => {});
  },

  updateCar: async (id: number, car: Omit<CarType, "id"> ): Promise<CarType> => {
    const res = await fetch(`${BASE}/garage/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(car),
    });
    if (!res.ok) throw new Error("Failed to update car");
    return res.json() as Promise<CarType>;
  },

  startEngine: async (id: number): Promise<EngineResponse> => {
    const res = await fetch(`${BASE}/engine?id=${id}&status=started`, {
      method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to start engine");
    return res.json() as Promise<EngineResponse>;
  },

  driveCar: async (id: number): Promise<{ success: boolean }> => {
    const res = await fetch(`${BASE}/engine?id=${id}&status=drive`, {
      method: "PATCH",
    });
    if (res.status === 500) {
      return { success: false };
    }
    if (!res.ok) throw new Error(`Drive request failed: ${res.status}`);
    return res.json() as Promise<{ success: boolean }>;
  },

  stopEngine: async (id: number): Promise<EngineResponse> => {
    const res = await fetch(`${BASE}/engine?id=${id}&status=stopped`, {
      method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to stop engine");
    return res.json() as Promise<EngineResponse>;
  },

  getWinners: async (
    page = 1,
    limit = 10,
    sort = "wins",
    order: "ASC" | "DESC" = "ASC"
  ): Promise<WinnerType[]> => {
    const res = await fetch(
      `${BASE}/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`
    );
    if (!res.ok) throw new Error("Failed to load winners");
    return res.json() as Promise<WinnerType[]>;
  },

  saveWinner: async (winner: WinnerType): Promise<WinnerType | null> => {
    const res = await fetch(`${BASE}/winners`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(winner),
    });
    if (res.status === 500) {
      return null;
    }
    if (!res.ok) throw new Error(`Failed to save winner: ${res.status}`);
    return res.json() as Promise<WinnerType>;
  },

  updateWinner: async (id: number, winner: WinnerType): Promise<WinnerType> => {
    const res = await fetch(`${BASE}/winners/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(winner),
    });
    if (!res.ok) throw new Error("Failed to update winner");
    return res.json() as Promise<WinnerType>;
  },

  deleteWinner: async (id: number): Promise<void> => {
    const res = await fetch(`${BASE}/winners/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete winner");
  },

  getCarsAll: async (): Promise<CarType[]> => {
    const res = await fetch(`${BASE}/garage`);
    if (!res.ok) throw new Error("Failed to fetch all cars");
    return res.json() as Promise<CarType[]>;
  },

  resetAllEngines: async (): Promise<void> => {
    try {
      const cars = await api.getCarsAll();
      await Promise.allSettled(cars.map((c) => api.stopEngine(c.id)));
    } catch (err) {
      console.warn("resetAllEngines error:", err);
    }
  },
};

export async function saveOrUpdateWinner(winner: WinnerType) {
  const res = await fetch(`${BASE}/winners/${winner.id}`);
  if (res.ok) {
    const old = (await res.json()) as WinnerType;
    return api.updateWinner(winner.id, {
      id: winner.id,
      wins: old.wins + 1,
      time: Math.min(old.time, winner.time),
    });
  } else {
    return api.saveWinner({ ...winner, wins: 1 });
  }
}

export async function startingDrive(id: number) {
  try {
    const result = await api.driveCar(id);
    return result.success ? id : null;
  } catch {
    return null;
  }
}
