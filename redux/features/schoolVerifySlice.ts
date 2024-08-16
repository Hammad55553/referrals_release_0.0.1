import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import {BACKEND_DEV_URL} from '../../constants/Routes';

export interface Schoolemailstate {
  loading: boolean;
  error: string | null;
  message: string;
  email: string;
  otpToken: string;
}

const initialState: Schoolemailstate = {
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
}

export const sendOtp = createAsyncThunk<
  any,
  SendOtpPayload,
  {rejectValue: ErrorResponse}
>('Schoolemail/sendOtp', async ({email, type}, {rejectWithValue}) => {
  try {
    const token =
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjU2OTFhMTk1YjI0MjVlMmFlZDYwNjMzZDdjYjE5MDU0MTU2Yjk3N2QiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiUmF2aSBTaW5naGFsIiwiVVNFUiI6dHJ1ZSwiVkVSSUZZIjp0cnVlLCJ3b3JrcGxhY2UiOnRydWUsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS92aWJlc2VhLWQ2ODNlIiwiYXVkIjoidmliZXNlYS1kNjgzZSIsImF1dGhfdGltZSI6MTcyMDE2Mzc2MiwidXNlcl9pZCI6IjJKdWh4WXlPZVJYWFNMRVJkQkpRSEs3R0diYzIiLCJzdWIiOiIySnVoeFl5T2VSWFhTTEVSZEJKUUhLN0dHYmMyIiwiaWF0IjoxNzIwMTYzNzYyLCJleHAiOjE3MjAxNjczNjIsImVtYWlsIjoicmF2aXNpbmdoYWwwMzNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsicmF2aXNpbmdoYWwwMzNAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.QYxGjV9PwnTjz7A4a6jxmQKbh5CFsg0Mz6PzCT_bhd6eVKBSJeZ89M9AwIdGNBPI0VxWbzR6bapG-XWLk5gM-4dk-lQG7MKXr5UeA8jrdCN6p_j3xRyOeCm2ygidkDjjsXJ1-F897Kz9XHQ8jgEz8rmz-MwDiJUMrIfko60bc9rABqqRrrkKBF9wvbf5nuQF9Oe9BBnqU8vmUeOaOFN0m6i2BWFXHng7l9GXA9FN72zE8q4ObufsGEEvCxYohRazBkL7VuOOQwZK13PIBOlY9ZLNC91U-_S0Xhz2NCsdTUEEXZRAE0iYos3mCgIPJlIBHlDth4JHK8iw2mgLUW8Qow'; // Replace this with actual token retrieval logic
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
});

const schoolVerifySlice = createSlice({
  name: 'Schoolemail',
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

export const {setMessage} = schoolVerifySlice.actions;
export default schoolVerifySlice.reducer;
