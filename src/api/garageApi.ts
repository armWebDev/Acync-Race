import type { Car, CarDraft, Page } from '../types';
import { readTotalCount, request, requestJson } from './client';

const garageApi = {
  async getPage(page: number, limit: number): Promise<Page<Car>> {
    const response = await request('/garage', { query: { _page: page, _limit: limit } });
    return { items: (await response.json()) as Car[], total: readTotalCount(response) };
  },

  getByIds(ids: number[]): Promise<Car[]> {
    if (ids.length === 0) {
      return Promise.resolve([]);
    }
    return requestJson<Car[]>('/garage', { query: { id: ids } });
  },

  create(car: CarDraft): Promise<Car> {
    return requestJson<Car>('/garage', { method: 'POST', body: car });
  },

  update(id: number, car: CarDraft): Promise<Car> {
    return requestJson<Car>(`/garage/${id}`, { method: 'PUT', body: car });
  },

  async remove(id: number): Promise<void> {
    await request(`/garage/${id}`, { method: 'DELETE' });
  },
};

export default garageApi;
