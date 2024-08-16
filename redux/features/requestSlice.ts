// features/auth/chatSlice.ts
// handles all chat flow redux data and API calls

import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {BACKEND_SOCKET_APP_URL} from '../../constants/Routes';
import {logger} from 'react-native-logs';
import {ConversationMessage, Receiver} from './chatSlice';

var log = logger.createLogger();

export interface Request {
  _id: string;
  users: string[];
  receiver_id: string;
  sender_id: string;
  post_id: string;
  status: 'ACCEPTED' | 'PENDING' | 'REJECTED';
  timestamp: string;
  type: string;
  blocked: boolean;
  messages: ConversationMessage;
  receiver: Receiver;
  createdAt: string;
  __v: number;
}

interface RequestState {
  loading: boolean;
  error: string | null;
  apiCalled: string;
  requestsForUser: Request[];
}

const initialState: RequestState = {
  loading: false,
  error: null,
  apiCalled: '',
  requestsForUser: [],
};

// Define the async thunks
export const getRequestsForUser = createAsyncThunk(
  'messages/get',
  async (firebaseIDToken: string) => {
    try {
      const response = await axios.get(
        `${BACKEND_SOCKET_APP_URL}messages?status=PENDING&for=OWN`,
        {
          headers: {
            Authorization: `Bearer ${firebaseIDToken}`,
          },
        },
      );
      console.log('Raw response:', response.request._response);
      const parsedResponse = JSON.parse(response.request._response);
      return parsedResponse;
    } catch (error: any) {
      console.log(error.response);
      throw error; // Ensure the error is propagated to the rejected case
    }
  },
);

export const createSubLeasePostRequest = createAsyncThunk(
  'messages/create',
  async (data: {
    firebaseIDToken: string;
    message: string;
    post_id: string;
    uid: string;
  }) => {
    try {
      const response = await axios.post(
        `${BACKEND_SOCKET_APP_URL}messages`,
        {
          postid: data.post_id,
          uid: data.uid,
          message: data.message,
          messageByMe: data.message,
        },
        {
          headers: {
            Authorization: `Bearer ${data.firebaseIDToken}`,
          },
        },
      );
      console.log('Raw response:', response.request._response);
      const parsedResponse = JSON.parse(response.request._response);
      return parsedResponse;
    } catch (error: any) {
      console.log(error.response);
      throw error; // Ensure the error is propagated to the rejected case
    }
  },
);

export const updateStatusOfRequest = createAsyncThunk(
  'messages/patch',
  async (data: {
    firebaseIDToken: string;
    requestID: string;
    status: Request['status'];
  }) => {
    try {
      const response = await axios.patch(
        `${BACKEND_SOCKET_APP_URL}messages/${data.requestID}`,
        {
          status: data.status,
        },
        {
          headers: {
            Authorization: `Bearer ${data.firebaseIDToken}`,
          },
        },
      );
      console.log('111 ', response.data);
      return response.data;
    } catch (error: any) {
      console.log(error.response);
      throw error; // Ensure the error is propagated to the rejected case
    }
  },
);

const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getRequestsForUser.pending, state => {
        state.loading = true;
        state.error = null;
        log.debug('pending state');
      })
      .addCase(getRequestsForUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        log.debug('fulfilled state payload', action.payload);
        state.requestsForUser = action.payload.data || []; // Ensure a default value if data is undefined
        log.debug('fulfilled state');
        log.debug('conversationBetweenUsers', state.requestsForUser);
      })
      .addCase(getRequestsForUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message; // Fix to correctly access the error message
        log.debug('error state redux');
        log.debug(action.error.message);
      })
      .addCase(updateStatusOfRequest.pending, state => {
        state.loading = true;
        state.error = null;
        log.debug('pending state');
      })
      .addCase(updateStatusOfRequest.fulfilled, state => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateStatusOfRequest.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message; // Fix to correctly access the error message
        log.debug('error state redux');
        log.debug(action.error.message);
      })
      .addCase(createSubLeasePostRequest.pending, state => {
        state.loading = true;
        state.error = null;
        log.debug('pending state');
      })
      .addCase(createSubLeasePostRequest.fulfilled, state => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createSubLeasePostRequest.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message; // Fix to correctly access the error message
        log.debug('error state redux');
        log.debug(action.error.message);
      });
  },
});

export const {} = requestSlice.actions;
export default requestSlice.reducer;
