import store, {RootState} from '../store';

export const getFirebaseToken = (): string => {
  const state: RootState = store.getState();
  if (state.auth.firebaseIDToken) {
    return state.auth.firebaseIDToken;
  } else {
    return '';
  }
};
