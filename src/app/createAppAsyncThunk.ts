import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from './store';

const createAppAsyncThunk = createAsyncThunk.withTypes<{ state: RootState }>();

export default createAppAsyncThunk;
