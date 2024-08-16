import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BACKEND_DEV_URL } from '../../constants/Routes';
import { getFirebaseToken } from '../utils/getFirebaseToken';
import { logger } from 'react-native-logs';

const log = logger.createLogger();

export interface EditPostState {
  loading: boolean;
  error: string | null;
  message: string;
}

const initialState: EditPostState = {
  loading: false,
  error: null,
  message: '',
};

interface ErrorResponse {
  message: string;
}

interface EditMessagePayload {
  message: string;
  category: string;
}

const editMessage = createAsyncThunk<
  any,
  EditMessagePayload,
  { rejectValue: ErrorResponse }
>(
  'posts/editMessage',
  async ({ message, category }, { rejectWithValue }) => {
    try {
      const token = await getFirebaseToken();

      const response = await axios.put(
        `${BACKEND_DEV_URL}users/quickmessages/update?category=${encodeURIComponent(category)}`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      let errorMessage = 'Something went wrong';
      
      if (error.response) {
        console.log('Error response data:', error.response.data);
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        console.log('Error request data:', error.request);
        errorMessage = 'No response from server. Please check your network connection.';
      } else {
        console.log('Error message:', error.message);
        errorMessage = error.message;
      }

      console.log('Complete error object:', error);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

const editPostSlice = createSlice({
  name: 'editMessage',
  initialState,
  reducers: {
    setMessage(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(editMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editMessage.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // Add logic for handling successful API call if needed
      })
      .addCase(editMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        log.debug('Error state redux:');
        log.debug(action.payload);
      });
  },
});

export const { setMessage } = editPostSlice.actions;

export { editMessage };

export default editPostSlice.reducer;
