// handles all dashboard data flow and API calls

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {BACKEND_DEV_URL} from '../../constants/Routes';
import {logger} from 'react-native-logs';

var log = logger.createLogger();

export interface DashboardData {
  requestSent: number;
  requestReceived: number;
  requestRejected: number;
  postsMade: number;
}

interface DashboardState {
  loading: boolean;
  error: string | null;
  apiCalled: string;
  dashboardData: DashboardData;
}

const initialState: DashboardState = {
  loading: false,
  error: null,
  apiCalled: '',
  dashboardData: {
    requestSent: 0,
    requestReceived: 0,
    requestRejected: 0,
    postsMade: 0,
  },
};

// Define the async thunks
export const getDashboardDataForUser = createAsyncThunk(
  'data/dashboard',
  async (firebaseIDToken: string) => {
    log.info('1 -');
    try {
      log.info('2 -');
      log.info('token ', firebaseIDToken);
      const response = await axios.get(
        `${BACKEND_DEV_URL}users/data/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${firebaseIDToken}`,
          },
        },
      );
      log.info('3 -');
      console.log('Raw response:', response.data);
      return response.data;
    } catch (error: any) {
      log.info('4 -');
      console.log(error.response);
      throw error; // Ensure the error is propagated to the rejected case
    }
  },
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getDashboardDataForUser.pending, state => {
        state.loading = true;
        state.error = null;
        log.debug('pending state');
      })
      .addCase(getDashboardDataForUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        log.debug('fulfilled state payload', action.payload);
        state.dashboardData = action.payload.data; // Ensure a default value if data is undefined
        log.debug('fulfilled state');
      })
      .addCase(getDashboardDataForUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message; // Fix to correctly access the error message
        log.debug('error state redux');
        log.debug(action.error.message);
      });
  },
});

export const {} = dashboardSlice.actions;
export default dashboardSlice.reducer;
