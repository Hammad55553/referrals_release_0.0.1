//react and react native imports
import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

//react native navigation imports
import {useNavigation, CommonActions} from '@react-navigation/native';

//custom components imports
import {AuthHeading} from '../../components/auth/AuthHeading';
import {AuthFooter} from '../../components/auth/AuthFooter';
import {InputFieldEmail} from '../../components/InputFieldEmail';
import {InputFieldPassword} from '../../components/InputFieldPassword';
import {Button} from '../../components/Button';
import {GoogleButton} from '../../components/GoogleButton';

//react native icons imports
import Icon from 'react-native-vector-icons/Ionicons';

//react native firebase imports
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {newWebClientID} from '../../constants/Firebase';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

//react native logger imports
import {logger} from 'react-native-logs';

//react redux imports
import {AppDispatch, RootState} from '../../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {
  LoggedInUserState,
  signupWithGoogle,
  updateAPICalled,
  updateFirebaseIdToken,
  updateForgotPasswordEmail,
  updateLoading,
  updateLoggedInUser,
  updateUserEmail,
  updateUserPassword,
  UserState,
} from '../../redux/features/authSlice';
import CustomAlert from '../../components/CustomAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';

var log = logger.createLogger();

interface CustomError extends Error {
  code?: string;
}

export default function Login() {
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation();

  const [text, setText] = useState('Hi');
  const [isChecked, setIsChecked] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const userL: UserState = useSelector((state: RootState) => state.auth.user);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const [alertButtons, setAlertButtons] = useState<
    {label: string; onPress: () => void}[]
  >([]);

  const handleNavigateToForgotPassword = () => {
    navigation.navigate('Auth/ForgotPassword' as never);
  };

  const toggleCheckmark = () => {
    setIsChecked(!isChecked);
  };

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  const handleEmailChange = (text: string) => {
    dispatch(updateUserEmail(text));
  };

  const handlePasswordChange = (text: string) => {
    dispatch(updateUserPassword(text));
  };

  const navigateToLoginDone = async () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Auth/LoginDone' as never}],
      }),
    );
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogInUsingEmailPassword = async () => {
    try {
      if (userL.email === '') {
        setAlertTitle('Error');
        setAlertDescription('Please provide email.');
        setAlertButtons([{label: 'OK', onPress: () => log.info('OK Pressed')}]);
        setAlertVisible(true);
        return;
      } else if (!validateEmail(userL.email)) {
        setAlertTitle('Error');
        setAlertDescription('Please provide valid email.');
        setAlertButtons([{label: 'OK', onPress: () => log.info('OK Pressed')}]);
        setAlertVisible(true);
        return;
      } else if (userL.password === '') {
        setAlertTitle('Error');
        setAlertDescription('Please provide password.');
        setAlertButtons([{label: 'OK', onPress: () => log.info('OK Pressed')}]);
        setAlertVisible(true);
        return;
      } else if (userL.password.length < 8) {
        setAlertTitle('Error');
        setAlertDescription('Please provide valid password.');
        setAlertButtons([{label: 'OK', onPress: () => log.info('OK Pressed')}]);
        setAlertVisible(true);
        return;
      }
      dispatch(updateAPICalled('true'));
      dispatch(updateLoading(true));

      const firebaseUserCredential = await auth().signInWithEmailAndPassword(
        userL.email,
        userL.password,
      );

      const idToken = await firebaseUserCredential.user.getIdToken();
      const idTokenResult = await firebaseUserCredential.user.getIdTokenResult(
        true,
      );
      const firebaseClaims = idTokenResult.claims;

      const customLoggedInUser = {
        __v: 0,
        _id: '',
        email: idTokenResult.claims.email || '',
        firstName: idTokenResult.claims.name.split(' ')[0] || '',
        lastName: idTokenResult.claims.name.split(' ')[1] || '',
        otpToken: '',
        uid: idTokenResult.claims.user_id || '',
        picture:
          idTokenResult.claims.picture ||
          'https://png.pngtree.com/png-clipart/20210129/ourmid/pngtree-blue-default-avatar-png-image_2813123.jpg',
      };

      dispatch(updateFirebaseIdToken(idToken));

      if (firebaseClaims.USER !== true) {
        Alert.alert('Login Failed');
        log.debug('Login Using Email Password Failed');
        setAlertTitle('Error');
        setAlertDescription('Login Using Email Password Failed.');
        setAlertButtons([{label: 'OK', onPress: () => log.info('OK Pressed')}]);
        setAlertVisible(true);
      } else {
        dispatch(updateLoggedInUser(customLoggedInUser));
        await AsyncStorage.setItem('userEmail', userL.email);
        await AsyncStorage.setItem('userPassword', userL.password);
        await AsyncStorage.setItem('idToken', idToken);
        await AsyncStorage.setItem(
          'userInfo',
          JSON.stringify(customLoggedInUser),
        );

        await navigateToLoginDone();
        dispatch(updateUserEmail(''));
        dispatch(updateUserPassword(''));
        log.debug('Login Using Email Password Successful');
      }
    } catch (error) {
      log.debug('Login Using Email Password Error', error);
      const refinedError = error.message.split(']')[1] || error.message;
      setAlertTitle('Error');
      setAlertDescription(`${refinedError}`);
      setAlertButtons([{label: 'OK', onPress: () => log.info('OK Pressed')}]);
      setAlertVisible(true);
    } finally {
      dispatch(updateAPICalled('false'));
      dispatch(updateLoading(false));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const {idToken} = userInfo;
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      const firebaseUserCredential = await auth().signInWithCredential(
        googleCredential,
      );

      const idTokenResult =
        await firebaseUserCredential.user.getIdTokenResult();
      const firebase_id_token = idTokenResult.token;
      const firebaseClaims = idTokenResult.claims;

      const customLoggedInUser: LoggedInUserState = {
        __v: 0,
        _id: '',
        email: '', //email is set here
        firstName: '', //firstName is set here
        lastName: '', //lastName is set here
        otpToken: '',
        uid: '', //uid is set here
        picture: '',
      };

      if (idToken) {
        dispatch(updateFirebaseIdToken(firebase_id_token));
      } else {
        log.info('Error during Google Login - idToken missing.');
      }

      customLoggedInUser.email = idTokenResult.claims.email;
      if (idTokenResult.claims.picture) {
        customLoggedInUser.picture = idTokenResult.claims.picture;
      } else {
        customLoggedInUser.picture =
          'https://png.pngtree.com/png-clipart/20210129/ourmid/pngtree-blue-default-avatar-png-image_2813123.jpg';
      }
      let [firstName, lastName] = idTokenResult.claims.name.split(' ');
      customLoggedInUser.firstName = firstName;
      customLoggedInUser.lastName = lastName;
      customLoggedInUser.uid = idTokenResult.claims.user_id;

      //add user claim check here
      if (firebaseClaims.USER !== true) {
        //user is not on our backend, signup first using backend api
        const UID = firebaseUserCredential.user.uid;
        const res = await dispatch(signupWithGoogle(UID));

        if (res.payload.data) {
          dispatch(updateForgotPasswordEmail(customLoggedInUser.email));
          navigation.navigate('Auth/VerifyEmailCode' as never);
        } else {
          Alert.alert('Signup Failed');
        }
      } else {
        //user is already on our backend
        dispatch(updateLoggedInUser(customLoggedInUser));

        await AsyncStorage.setItem('idToken', firebase_id_token);

        await AsyncStorage.setItem(
          'userInfo',
          JSON.stringify(customLoggedInUser),
        );

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Auth/LoginDone'}],
          }),
        );
      }
    } catch (error) {
      const typedError = error as CustomError;
      log.debug('Error during sign-in:', typedError);
      if (typedError.code) {
        if (typedError.code === statusCodes.SIGN_IN_CANCELLED) {
          // user cancelled the login flow
          log.debug('User cancelled the login flow');
          setAlertTitle('Error');
          setAlertDescription(`User cancelled the Google Login flow.`);
          setAlertButtons([
            {
              label: 'OK',
              onPress: () => {
                log.info('OK Pressed');
              },
            },
          ]);
          setAlertVisible(true);
        } else if (typedError.code === statusCodes.IN_PROGRESS) {
          // operation (e.g., sign in) is in progress already
          log.debug('Sign in is in progress');
        } else if (
          typedError.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
        ) {
          // play services not available or outdated
          log.debug('Play services not available or outdated');
        } else {
          // some other error happened
          log.debug(typedError.message);
        }
      } else {
        log.debug('An unknown error occurred', error);
      }
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: newWebClientID,
    });

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={5}
        style={styles.containerChild}>
        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          description={alertDescription}
          buttons={alertButtons}
          onClose={() => setAlertVisible(false)}
        />
        <AuthHeading
          firstText={text}
          secondText="Welcome to VibeSea!"
          isHelloWaveVisible={true}
          containerHeight={75}
          isLoginPage={true}
        />
        <InputFieldEmail
          label="Email address"
          placeholder="Your email"
          marginTop={120}
          onEmailChange={handleEmailChange}
        />
        <InputFieldPassword
          label="Password"
          placeholder="Password"
          onPasswordChange={handlePasswordChange}
        />
        <View style={styles.subContainer}>
          <View style={styles.rememberMeContainer}>
            <TouchableOpacity onPress={toggleCheckmark}>
              <View style={styles.tickIcon}>
                <Icon
                  name={
                    isChecked ? 'checkmark-circle' : 'checkmark-circle-outline'
                  }
                  size={24}
                  style={styles.icon}
                />
              </View>
            </TouchableOpacity>
            <Text style={styles.rememberMeText}>Remember me</Text>
          </View>
          <View style={styles.rememberMeContainer}>
            <Text
              onPress={() => {
                handleNavigateToForgotPassword();
              }}
              style={styles.rememberMeText}>
              Forgot password?
            </Text>
          </View>
        </View>
        <Button onPress={handleLogInUsingEmailPassword} label={'Log In'} />
        <Text style={styles.orText}>Or</Text>
        <GoogleButton onPress={handleGoogleSignIn} label="Log In with Google" />
      </KeyboardAvoidingView>
      <AuthFooter
        greyText="Don't have an account?"
        boldText="Sign up"
        pushRoute="Auth/Signup"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerChild: {
    flexDirection: 'column',
    gap: 10,
    paddingHorizontal: 40,
    width: '100%',
  },
  orText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#b3b3b3',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
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
    color: 'black',
  },
  tickIcon: {
    marginRight: -5,
  },
  icon: {
    color: 'black',
    backgroundColor: 'white',
  },
});
