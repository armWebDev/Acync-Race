import { WINNERS_PAGE_LIMIT } from '../constants';
import type { Page, Winner, WinnersQuery } from '../types';
import { readTotalCount, request, requestJson } from './client';

const winnersApi = {
  async getPage({ page, sort, order }: WinnersQuery): Promise<Page<Winner>> {
    const response = await request('/winners', {
      query: { _page: page, _limit: WINNERS_PAGE_LIMIT, _sort: sort, _order: order },
    });
    return { items: (await response.json()) as Winner[], total: readTotalCount(response) };
  },

  async find(id: number): Promise<Winner | null> {
    const [winner] = await requestJson<Winner[]>('/winners', { query: { id } });
    return winner ?? null;
  },

  create(winner: Winner): Promise<Winner> {
    return requestJson<Winner>('/winners', { method: 'POST', body: winner });
  },

  update({ id, wins, time }: Winner): Promise<Winner> {
    return requestJson<Winner>(`/winners/${id}`, { method: 'PUT', body: { wins, time } });
  },

  async remove(id: number): Promise<void> {
    await request(`/winners/${id}`, { method: 'DELETE' });
  },
};

export default winnersApi;
