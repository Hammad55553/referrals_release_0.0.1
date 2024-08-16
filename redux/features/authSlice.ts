// features/auth/authSlice.ts
// handles all authentication flow redux data and API calls

import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {BACKEND_DEV_URL} from '../../constants/Routes';
import {logger} from 'react-native-logs';

var log = logger.createLogger();
export interface UserState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmpassword: string;
}

export interface LoggedInUserState {
  firstName: string;
  lastName: string;
  email: string;
  uid: string;
  _id: string;
  __v: number;
  otpToken: string;
  picture: string;
}

interface AuthState {
  loading: boolean;
  error: string | null;
  forgotPasswordEmail: string;
  user: UserState;
  loggedInUser: LoggedInUserState;
  emailOTP: string;
  forgotPasswordFlow: string;
  forgotPasswordResetToken: string;
  apiCalled: string;
  firebaseIDToken: string | null;
  emailOfOtpSent: string;
}

const initialState: AuthState = {
  emailOTP: '',
  loading: false,
  error: null,
  emailOfOtpSent: '',
  forgotPasswordEmail: '',
  forgotPasswordFlow: 'false',
  forgotPasswordResetToken: '',
  apiCalled: '',
  firebaseIDToken: null,
  user: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmpassword: '',
  },
  loggedInUser: {
    firstName: '',
    lastName: '',
    email: '',
    uid: '',
    __v: 0,
    _id: '',
    otpToken: '',
    picture: '',
  },
};

// Define the async thunks
export const signupWithEmailPassword = createAsyncThunk(
  'users/auth/signup',
  async (user: UserState) => {
    try {
      const response = await axios.post(
        `${BACKEND_DEV_URL}users/auth/signup`,
        user,
      );
      return response.data;
    } catch (error: any) {
      console.log(error.response);
    }
  },
);

export const getNewIdToken = createAsyncThunk(
  'users/auth/getNewIdToken',
  async (refresh_token: string) => {
    try {
      const response = await axios.post(
        `https://securetoken.googleapis.com/v1/token?key=AIzaSyBtXAMVC8Q5i7SD9vop-fNWxE7ShBGGno0`,
        {
          grant_type: 'refresh_token',
          refresh_token: refresh_token,
        },
      );
      log.info('response in getNewIdToken', response.data);
      return response.data;
    } catch (error: any) {
      console.log(error.response);
    }
  },
);

export const verifyEmailAddress = createAsyncThunk(
  'users/auth/verify-email',
  async (data: {emailOTP: string; token: string}) => {
    try {
      const response = await axios.post(
        `${BACKEND_DEV_URL}users/auth/verify-email`,
        {
          otp: data.emailOTP,
        },
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      console.log('hi ', error);
      console.log(error.response);
    }
  },
);

export const resendOTPToEmail = createAsyncThunk(
  'users/auth/generate-otp/email-verification',
  async (data: {email: string}) => {
    try {
      const response = await axios.post(
        `${BACKEND_DEV_URL}users/auth/generate-otp/email-verification`,
        {
          email: data.email,
        },
      );
      return response.data;
    } catch (error: any) {
      console.log('hi ', error);
      console.log(error.response.data.message);
    }
  },
);

export const signupWithGoogle = createAsyncThunk(
  'users/auth/signup-uid',
  async (uid: string) => {
    try {
      const response = await axios.post(
        `${BACKEND_DEV_URL}users/auth/signup-uid`,
        {
          uid: uid,
        },
      );
      return response.data;
    } catch (error: any) {
      console.log('hi ', error);
      console.log(error.response);
    }
  },
);

export const getUserProfile = createAsyncThunk(
  'users/data/profile',
  async (firebaseIDToken: string) => {
    try {
      const response = await axios.get(`${BACKEND_DEV_URL}users/data/profile`, {
        headers: {
          Authorization: `Bearer ${firebaseIDToken}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.log(error.response);
    }
  },
);

export const sendResetPasswordOTP = createAsyncThunk(
  'users/auth/send-reset-password-otp',
  async (email: string) => {
    try {
      const response = await axios.post(
        `${BACKEND_DEV_URL}users/auth/send-reset-password-otp`,
        {
          email: email,
        },
      );
      console.log('SAAC', response.data);
      return response.data;
    } catch (error: any) {
      console.log('hi ', error);
      console.log(error.response);
    }
  },
);

export const verifyEmailAddressForgetPassword = createAsyncThunk(
  'users/auth/verify-reset-password-otp',
  async (data: {emailOTP: string; token: string}) => {
    console.log('this is used ', data.token);
    try {
      const response = await axios.post(
        `${BACKEND_DEV_URL}users/auth/verify-reset-password-otp`,
        {
          otp: data.emailOTP,
        },
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      console.log('hi ', error);
      console.log(error.response);
    }
  },
);

export const resetPassword = createAsyncThunk(
  'users/auth/reset-password',
  async (data: {password: string; token: string}) => {
    try {
      const response = await axios.post(
        `${BACKEND_DEV_URL}users/auth/reset-password`,
        {
          password: data.password,
        },
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      console.log('hi ', error);
      console.log(error.response);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateEmailOfOtpSent: (state, action: PayloadAction<string>) => {
      state.emailOfOtpSent = action.payload;
    },
    updateFirebaseIdToken: (state, action: PayloadAction<string | null>) => {
      state.firebaseIDToken = action.payload;
    },
    updateAPICalled: (state, action: PayloadAction<string>) => {
      state.apiCalled = action.payload;
    },
    updateForgotPasswordFlow: (state, action: PayloadAction<string>) => {
      state.forgotPasswordFlow = action.payload;
    },
    updateEmailOTP: (state, action: PayloadAction<string>) => {
      state.emailOTP = action.payload;
    },
    updateUserFirstName: (state, action: PayloadAction<string>) => {
      state.user.firstName = action.payload;
    },
    updateUserLastName: (state, action: PayloadAction<string>) => {
      state.user.lastName = action.payload;
    },
    updateUserEmail: (state, action: PayloadAction<string>) => {
      state.user.email = action.payload;
    },
    updateUserPassword: (state, action: PayloadAction<string>) => {
      state.user.password = action.payload;
    },
    updateUserConfirmPassword: (state, action: PayloadAction<string>) => {
      state.user.confirmpassword = action.payload;
    },
    updateForgotPasswordEmail: (state, action: PayloadAction<string>) => {
      state.forgotPasswordEmail = action.payload;
    },
    updateLoading(state, action) {
      state.loading = action.payload;
    },
    updateLoggedInUser(state, action) {
      state.loggedInUser = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getNewIdToken.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNewIdToken.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // state.loggedInUser = action.payload.data;
      })
      .addCase(getNewIdToken.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload.error[0].message as string;
        log.debug('error state redux');
        log.debug(action.payload);
      })
      .addCase(signupWithEmailPassword.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupWithEmailPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.loggedInUser = action.payload.data;
      })
      .addCase(signupWithEmailPassword.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload.error[0].message as string;
        log.debug('error state redux');
        log.debug(action.payload);
      })
      .addCase(verifyEmailAddress.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmailAddress.fulfilled, state => {
        // state.loading = false;
        state.error = null;
      })
      .addCase(verifyEmailAddress.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload.error[0].message as string;
        log.debug('error state redux');
        log.debug(action.payload);
      })
      .addCase(resendOTPToEmail.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOTPToEmail.fulfilled, state => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resendOTPToEmail.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload.error[0].message as string;
        log.debug('error state redux');
        log.debug(action.payload);
      })
      .addCase(signupWithGoogle.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.loggedInUser = action.payload.data;
      })
      .addCase(signupWithGoogle.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload.error[0].message as string;
        log.debug('error state redux');
        log.debug(action.payload);
      })
      .addCase(getUserProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.loggedInUser = action.payload.data;
      })
      .addCase(getUserProfile.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload.error[0].message as string;
        log.debug('error state redux');
        log.debug(action.payload);
      })
      .addCase(sendResetPasswordOTP.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendResetPasswordOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.loggedInUser.otpToken = action.payload?.data?.otpToken;
        if (action.payload && action.payload.data) {
          console.log('otp token ', action.payload.data.otpToken);
        }
      })
      .addCase(sendResetPasswordOTP.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload.error[0].message as string;
        log.debug('error state redux');
        log.debug(action.payload);
      })
      .addCase(verifyEmailAddressForgetPassword.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmailAddressForgetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.forgotPasswordResetToken = action.payload?.data?.resetPasswordToken;
      })
      .addCase(
        verifyEmailAddressForgetPassword.rejected,
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload.error[0].message as string;
          log.debug('error state redux');
          log.debug(action.payload);
        },
      )
      .addCase(resetPassword.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, state => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload.error[0].message as string;
        log.debug('error state redux');
        log.debug(action.payload);
      });
  },
});

export const {
  updateFirebaseIdToken,
  updateForgotPasswordEmail,
  updateUserEmail,
  updateUserFirstName,
  updateUserLastName,
  updateUserPassword,
  updateUserConfirmPassword,
  updateEmailOTP,
  updateForgotPasswordFlow,
  updateAPICalled,
  updateLoading,
  updateLoggedInUser,
  updateEmailOfOtpSent,
} = authSlice.actions;
export default authSlice.reducer;
