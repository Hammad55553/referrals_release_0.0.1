import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import {BACKEND_DEV_URL} from '../../constants/Routes';
import {getFirebaseToken} from '../utils/getFirebaseToken';

export interface phoneverificationState {
  loading: boolean;
  error: string | null;
  message: string;
}

const initialState: phoneverificationState = {
  loading: false,
  error: null,
  message: '',
};

interface ErrorResponse {
  message: string;
}

interface SendOtpPayload {
  email: string;
  type: string; // Add type field
}

export const sendOtp = createAsyncThunk<
  any,
  SendOtpPayload,
  {rejectValue: ErrorResponse}
>('phoneverification/sendOtp', async ({email, type}, {rejectWithValue}) => {
  try {
    const token = await getFirebaseToken();
    const response = await axios.post(
      `${BACKEND_DEV_URL}auth/work-education`,
      {email, type}, // Include type in the request body
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error: any) {
    let errorMessage = 'Something went wrong';

    if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
    } else if (error.request) {
      errorMessage =
        'No response from server. Please check your network connection.';
    } else {
      errorMessage = error.message;
    }

    return rejectWithValue({message: errorMessage});
  }
});

const phoneVerifySlice = createSlice({
  name: 'phoneverification',
  initialState,
  reducers: {
    setMessage(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(sendOtp.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = 'OTP sent successfully';
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
      });
  },
});

export const {setMessage} = phoneVerifySlice.actions;
export default phoneVerifySlice.reducer;
