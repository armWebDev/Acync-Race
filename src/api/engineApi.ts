import type { EngineParams } from '../types';
import { isApiError, request, requestJson } from './client';

const ENGINE_BROKEN_STATUS = 500;

const engineApi = {
  start(id: number): Promise<EngineParams> {
    return requestJson<EngineParams>('/engine', {
      method: 'PATCH',
      query: { id, status: 'started' },
    });
  },

  async stop(id: number): Promise<void> {
    await request('/engine', {
      method: 'PATCH',
      query: { id, status: 'stopped' },
    });
  },

  async drive(id: number): Promise<boolean> {
    try {
      await request('/engine', {
        method: 'PATCH',
        query: { id, status: 'drive' },
      });
      return true;
    } catch (error) {
      if (isApiError(error, ENGINE_BROKEN_STATUS)) {
        return false;
      }
      throw error;
    }
  },
};

export default engineApi;
