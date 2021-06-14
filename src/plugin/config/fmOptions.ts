import { createAsyncThunk, createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';
import { API_URL } from './appModuleConfiguration';

export interface FMSelectOptions {
  concepts: string[];
  locationTypes: string[];
  error?: string;
  isFetching: boolean;
  isFetched: boolean;
}

export const initialState: FMSelectOptions = {
  concepts: [],
  locationTypes: [],
  isFetching: false,
  isFetched: false,
};

export const loadOptions = createAsyncThunk('selectOptions/loadOptions', async (arg, thunkAPI) => {
  return axios.get<FMSelectOptions>(`${API_URL}/types`);
});

const slice = createSlice({
  name: 'selectOptions',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      loadOptions.pending,
      (state, action: PayloadAction<any>): FMSelectOptions => {
        return {
          ...state,
          isFetched: false,
          isFetching: true,
        };
      }
    );
    builder.addCase(
      loadOptions.fulfilled,
      (state, action: PayloadAction<AxiosResponse<FMSelectOptions>>): FMSelectOptions => {
        return {
          ...action.payload.data,
          isFetched: true,
          isFetching: false,
        };
      }
    );
    builder.addCase(
      loadOptions.rejected,
      (
        state,
        action: PayloadAction<
          any,
          string,
          { arg: void; requestId: string; aborted: boolean; condition: boolean },
          SerializedError
        >
      ): FMSelectOptions => {
        return {
          ...state,
          isFetched: true,
          isFetching: false,
          error: action.error.message,
        };
      }
    );
  },
});

//export const { loadLocations } = slice.actions;
export const FMOptionsReducer = slice.reducer;
