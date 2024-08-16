import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import {BACKEND_DEV_URL} from '../../constants/Routes';

export interface EmailVerificationState {
  loading: boolean;
  error: string | null;
  message: string;
  email: string;
  otpToken: string;
}

const initialState: EmailVerificationState = {
  loading: false,
  error: null,
  message: '',
  email: '',
  otpToken: '',
};

interface ErrorResponse {
  message: string;
}

interface SendOtpPayload {
  email: string;
  type: string;
  token: string;
}

export const sendOtp = createAsyncThunk<
  any,
  SendOtpPayload,
  {rejectValue: ErrorResponse}
>(
  'emailVerification/sendOtp',
  async ({email, type, token}, {rejectWithValue}) => {
    try {
      const response = await axios.post(
        `${BACKEND_DEV_URL}users/auth/work-education`,
        {email, type},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log(response.data);
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
  },
);

const emailVerificationSlice = createSlice({
  name: 'emailVerification',
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
        state.email = action.payload.data.email;
        state.otpToken = action.payload.data.otpToken;
        console.log(action.payload.data.otpToken);
        console.log(action.payload);
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
      });
  },
});

export const {setMessage} = emailVerificationSlice.actions;
export default emailVerificationSlice.reducer;
