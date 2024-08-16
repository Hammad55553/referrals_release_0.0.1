import {Text, StyleSheet, SafeAreaView, View, Image} from 'react-native';
import {
  LoggedInUserState,
  updateLoading,
  updateLoggedInUser,
} from '../../redux/features/authSlice';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {Button} from '../../components/Button';
import React from 'react';

export default function SignupDone() {
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation();
  const loggedInUser: LoggedInUserState = useSelector(
    (state: RootState) => state.auth.loggedInUser,
  );

  const handleLogout = async () => {
    dispatch(updateLoading(true));

    const customLoggedInUser: LoggedInUserState = {
      __v: 0,
      _id: '',
      email: '',
      firstName: '',
      lastName: '',
      otpToken: '',
      uid: '',
      picture: '',
    };

    dispatch(updateLoggedInUser(customLoggedInUser));

    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signOut();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Auth/Login'}],
      }),
    );

    dispatch(updateLoading(false));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerChild}>
        <Image
          source={require('../../assets/images/PasswordChanged.png')}
          style={styles.passwordChangedImage}
        />
        <Text style={styles.passwordChangedText}>Signup Successful</Text>
        <Text style={styles.descriptionText}>
          Your signup has been successful
        </Text>
        <Text style={styles.descriptionText}>{loggedInUser.email}</Text>
      </View>
      <View style={{width: '100%', paddingHorizontal: 40}}>
        <Button label={`Log Out`} onPress={handleLogout} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  passwordChangedText: {
    fontWeight: 'bold',
    fontSize: 30,
    color: 'black',
    marginTop: 20,
    marginBottom: 20,
  },
  passwordChangedImage: {
    width: 127,
    height: 127,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000B2',
    lineHeight: 20,
    marginTop: -10,
  },
  containerChild: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    paddingHorizontal: 40,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  orText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#b3b3b3',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rememberMeText: {
    fontSize: 14,
  },
  tickIcon: {
    marginRight: -5,
  },
  icon: {
    color: 'black',
    backgroundColor: 'white',
  },
});
