import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {BACKEND_DEV_URL} from '../../constants/Routes';
import {AppDispatch} from '../../redux/store';
import {useDispatch} from 'react-redux';
import {
  updateFirebaseIdToken,
  updateLoggedInUser,
} from '../../redux/features/authSlice';
import {CommonActions, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
// import {GoogleSignin} from '@react-native-google-signin/google-signin';
// import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
// import {newWebClientID} from '../../constants/Firebase';

export const SettingButton = ({text}): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation();

  // const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  // const [initializing, setInitializing] = useState(true);

  // const onAuthStateChanged = useCallback(
  //   (user: FirebaseAuthTypes.User | null) => {
  //     setUser(user);
  //     if (initializing) setInitializing(false);
  //   },
  //   [initializing],
  // );

  const settingsButtonClickHandler = async () => {
    switch (text) {
      case 'Signout':
        await logout();
        break;
      case 'Delete my profile':
        deleteProfile();
        break;
      default:
        console.log(`button functionality not available`);
    }
  };

  const deleteProfile = async () => {
    try {
      const response = await axios.delete(`${BACKEND_DEV_URL}users/data`);

      if (response.status === 200) logout();
    } catch (error) {
      console.log(`delete profile failed`, error);
    }
  };

  const logout = async () => {
    const loggedInUser = {
      firstName: '',
      lastName: '',
      email: '',
      uid: '',
      __v: 0,
      _id: '',
      otpToken: '',
    };

    await AsyncStorage.removeItem('idToken');
    await AsyncStorage.removeItem('userInfo');
    dispatch(updateFirebaseIdToken(null));

    dispatch(updateLoggedInUser(loggedInUser));

    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signOut();

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Auth/Login'}],
      }),
    );
  };

  // useEffect(() => {
  //   GoogleSignin.configure({
  //     webClientId: newWebClientID,
  //   });

  //   const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
  //   return subscriber;
  // }, [onAuthStateChanged]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={settingsButtonClickHandler}>
      <Text style={{color: '#2441d0'}}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    width: 300,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#0030cc33',
    backgroundColor: '#eef0fb',
    alignItems: 'center',
    height: 45,
    alignSelf: 'center',
  },
});
