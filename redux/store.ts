// store.ts
import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import rootReducer, { RootState } from './reducers';

const store = configureStore({
  reducer: rootReducer,
});

export type { RootState };
export type AppDispatch = typeof store.dispatch;
export default store;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
