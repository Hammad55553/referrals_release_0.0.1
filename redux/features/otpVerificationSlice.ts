import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {BACKEND_DEV_URL} from '../../constants/Routes';

export interface OtpVerificationState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: OtpVerificationState = {
  loading: false,
  error: null,
  success: false,
};

interface ErrorResponse {
  message: string;
}

interface VerifyOtpPayload {
  email: string;
  otp: string;
  token: string;
}

export const verifyOtp = createAsyncThunk<
  any,
  VerifyOtpPayload,
  {rejectValue: ErrorResponse}
>(
  'otpVerification/verifyOtp',
  async ({email, otp, token}, {rejectWithValue}) => {
    try {
      console.log(email, otp, token);
      const response = await axios.put(
        `${BACKEND_DEV_URL}users/auth/work-education`,
        {email, otp},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error: any) {
      console.log(error);
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
  },
);

const otpVerificationSlice = createSlice({
  name: 'otpVerification',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(verifyOtp.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(verifyOtp.fulfilled, state => {
        state.loading = false;
        state.success = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
      });
  },
});

export default otpVerificationSlice.reducer;
