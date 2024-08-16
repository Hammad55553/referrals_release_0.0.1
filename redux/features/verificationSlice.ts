import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for the verification status response
interface VerificationStatus {
  verified: boolean;
  firebaseUser: {
    uid: string;
    email: string;
    emailVerified: boolean;
    displayName: string;
    disabled: boolean;
    metadata: {
      lastSignInTime: string;
      creationTime: string;
      lastRefreshTime: string;
    };
    customClaims: {
      USER: boolean;
      VERIFY: boolean;
      workplace: boolean;
      school: boolean;
    };
    tokensValidAfterTime: string;
    providerData: {
      uid: string;
      displayName: string;
      email: string;
      providerId: string;
    }[];
  };
}

// Define the type for the error
interface FetchError {
  message: string;
}

// Async thunk to fetch verification status
export const fetchVerificationStatus = createAsyncThunk<
  VerificationStatus,
  void,
  {rejectValue: FetchError}
>('verification/fetchVerificationStatus', async (_, {rejectWithValue}) => {
  try {
    const response = await axios.get(
      'https://api.example.com/verificationStatus',
    );
    return response.data;
  } catch (error) {
    return rejectWithValue({message: 'Failed to fetch verification status.'});
  }
});

const verificationSlice = createSlice({
  name: 'verification',
  initialState: {
    verified: false,
    workEmailVerified: false,
    schoolEmailVerified: false,
    loading: false,
    error: null as FetchError | null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchVerificationStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVerificationStatus.fulfilled, (state, action) => {
        state.loading = false;
        const {verified, firebaseUser} = action.payload;
        state.verified = verified;
        state.workEmailVerified = firebaseUser.customClaims.workplace;
        state.schoolEmailVerified = firebaseUser.customClaims.school;
      })
      .addCase(fetchVerificationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as FetchError;
      });
  },
});

export default verificationSlice.reducer;
