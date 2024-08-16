// reducers/index.ts
import {combineReducers} from '@reduxjs/toolkit';
import counterReducer from '../features/counterSlice';
import authReducer from '../features/authSlice';
import postReducer from '../features/postSlice';
import viewPostReducer from '../features/viewPostSlice';
import chatReducer from '../features/chatSlice';
import requestReducer from '../features/requestSlice';
import dashboardReducer from '../features/dashboardSlice';
import editReducer from '../features/editQuickMessageSlice';
import inviteReducer from '../features/inviteSlice';
import yourPostsReducer from '../features/yourPostsSlice';
import sentPostsReducer from '../features/sentPostReqSlice';
import emailVerificationReducer from '../features/emailVerifySlice';
import schoolEmailReducer from '../features/schoolVerifySlice';
import phoneVerificationReducer from '../features/phoneVerifySlice';
import otpVerificationReducer from '../features/otpVerificationSlice';
import verificationSliceReducer from '../features/verificationSlice';

const rootReducer = combineReducers({
  counter: counterReducer,
  auth: authReducer,
  post: postReducer,
  viewPosts: viewPostReducer,
  chat: chatReducer,
  request: requestReducer,
  dashboard: dashboardReducer,
  editMessage: editReducer,
  invite: inviteReducer,
  yourPosts: yourPostsReducer,
  sentPosts: sentPostsReducer,
  emailVerification: emailVerificationReducer,
  schoolEmail: schoolEmailReducer,
  phoneVerification: phoneVerificationReducer,
  otpVerification: otpVerificationReducer, // Ensure the key here matches the slice name
  verification: verificationSliceReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
