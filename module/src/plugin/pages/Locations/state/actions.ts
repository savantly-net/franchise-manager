import { createAsyncThunk } from '@reduxjs/toolkit';
import { locationService } from '../locationService';

export const loadLocations = createAsyncThunk('franchiseLocations/loadLocations', async (arg, thunkAPI) => {
  return locationService.getLocations();
});
