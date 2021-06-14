import { createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { FranchiseLocation, FranchiseLocationState } from '../types';
import { loadLocations } from './actions';

export const initialState: FranchiseLocationState = {
  locations: [],
  isFetched: false,
  isFetching: false,
};

const slice = createSlice({
  name: 'franchiseLocations',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      loadLocations.pending,
      (state, action: PayloadAction<any>): FranchiseLocationState => {
        return {
          ...state,
          isFetched: false,
          isFetching: true,
        };
      }
    );
    builder.addCase(
      loadLocations.fulfilled,
      (state, action: PayloadAction<AxiosResponse<FranchiseLocation[]>>): FranchiseLocationState => {
        return {
          ...state,
          locations: action.payload.data,
          isFetched: true,
          isFetching: false,
        };
      }
    );
    builder.addCase(
      loadLocations.rejected,
      (
        state,
        action: PayloadAction<
          any,
          string,
          { arg: void; requestId: string; aborted: boolean; condition: boolean },
          SerializedError
        >
      ): FranchiseLocationState => {
        return {
          ...state,
          isFetched: true,
          isFetching: true,
          error: action.error.message,
        };
      }
    );
  },
});

//export const { loadLocations } = slice.actions;
export const FranchiseLocationsReducer = slice.reducer;
