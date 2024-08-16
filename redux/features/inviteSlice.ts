import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { BACKEND_DEV_URL } from '../../constants/Routes';
import { getFirebaseToken } from '../utils/getFirebaseToken';
import { RootState } from '../store';

interface InviteState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: InviteState = {
  loading: false,
  error: null,
  success: false,
};

interface ErrorResponse {
  message: string;
}

interface InvitePayload {
  email: string;
}

export const sendInvite = createAsyncThunk<
  void,
  InvitePayload,
  { rejectValue: ErrorResponse }
>(
  'invite/sendInvite',
  async ({ email }, { rejectWithValue }) => {
    try {
      const token = await getFirebaseToken();

      const response = await axios.post(
        `${BACKEND_DEV_URL}users/data/invite`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Log the response status and headers for debugging
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response data:', response.data);

      // Check for the success message in the response
      if (response.data.message === 'Invite send successfully.') {
        console.log('Invite was sent successfully');
        return;
      } else {
        throw new Error('Failed to send invite');
      }
    } catch (error: any) {
      let errorMessage = 'Something went wrong';

      if (error.response) {
        console.error('Error response data:', error.response.data);
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        console.error('Error request data:', error.request);
        errorMessage = 'No response from server. Please check your network connection.';
      } else {
        console.error('Error message:', error.message);
        errorMessage = error.message;
      }

      console.error('Complete error object:', error);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

const inviteSlice = createSlice({
  name: 'invite',
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendInvite.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(sendInvite.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(sendInvite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.success = false;
      });
  },
});

export const { resetState } = inviteSlice.actions;

export default inviteSlice.reducer;
