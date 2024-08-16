import React, {useCallback, useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {AuthHeading} from '../../components/auth/AuthHeading';
import {AuthFooter} from '../../components/auth/AuthFooter';
import {InputFieldEmail} from '../../components/InputFieldEmail';
import {InputFieldPassword} from '../../components/InputFieldPassword';
import {Button} from '../../components/Button';
import {GoogleButton} from '../../components/GoogleButton';
import {InputFieldConfirmPassword} from '../../components/InputFieldConfirmPassword';
import {InputFieldFirstName} from '../../components/InputFieldFirstName';
import {InputFieldLastName} from '../../components/InputFieldLastName';
import {
  LoggedInUserState,
  signupWithEmailPassword,
  signupWithGoogle,
  updateEmailOfOtpSent,
  updateFirebaseIdToken,
  updateForgotPasswordEmail,
  updateLoggedInUser,
  updateUserConfirmPassword,
  updateUserEmail,
  updateUserFirstName,
  updateUserLastName,
  updateUserPassword,
  updateLoading,
  UserState,
} from '../../redux/features/authSlice';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {logger} from 'react-native-logs';
import {CommonActions, useNavigation} from '@react-navigation/native';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {newWebClientID} from '../../constants/Firebase';
import CustomAlert from '../../components/CustomAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';

var log = logger.createLogger();

interface CustomError extends Error {
  code?: string;
}

export default function Signup() {
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation();
  const userL: UserState = useSelector((state: RootState) => state.auth.user);
  const loading: boolean = useSelector(
    (state: RootState) => state.auth.loading,
  );
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const [alertButtons, setAlertButtons] = useState<
    {label: string; onPress: () => void}[]
  >([]);

  const onAuthStateChanged = useCallback(
    (user: FirebaseAuthTypes.User | null) => {
      setUser(user);
      if (initializing) setInitializing(false);
    },
    [initializing],
  );

  const handleEmailChange = useCallback(
    (text: string) => {
      dispatch(updateUserEmail(text));
    },
    [dispatch],
  );

  const handleFirstNameChange = useCallback(
    (text: string) => {
      dispatch(updateUserFirstName(text));
    },
    [dispatch],
  );

  const handleLastNameChange = useCallback(
    (text: string) => {
      dispatch(updateUserLastName(text));
    },
    [dispatch],
  );

  const handlePasswordChange = useCallback(
    (text: string) => {
      setPassword(text);
      dispatch(updateUserPassword(text));
    },
    [dispatch],
  );

  const handleConfirmPasswordChange = useCallback(
    (text: string) => {
      setConfirmPassword(text);
      dispatch(updateUserConfirmPassword(text));
    },
    [dispatch],
  );

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = useCallback(async () => {
    dispatch(updateLoading(true));
    if (userL.firstName === '') {
      setAlertTitle('Error');
      setAlertDescription('Please provide first name.');
      setAlertButtons([
        {
          label: 'OK',
          onPress: () => {
            log.info('OK Pressed');
          },
        },
      ]);
      setAlertVisible(true);
      return;
    } else if (userL.lastName === '') {
      setAlertTitle('Error');
      setAlertDescription('Please provide last name.');
      setAlertButtons([
        {
          label: 'OK',
          onPress: () => {
            log.info('OK Pressed');
          },
        },
      ]);
      setAlertVisible(true);
      return;
    } else if (validateEmail(userL.email) === false) {
      setAlertTitle('Error');
      setAlertDescription('Please provide valid email.');
      setAlertButtons([
        {
          label: 'OK',
          onPress: () => {
            log.info('OK Pressed');
          },
        },
      ]);
      setAlertVisible(true);
      return;
    } else if (userL.password === '') {
      setAlertTitle('Error');
      setAlertDescription('Please provide password.');
      setAlertButtons([
        {
          label: 'OK',
          onPress: () => {
            log.info('OK Pressed');
          },
        },
      ]);
      setAlertVisible(true);
      return;
    } else if (userL.password.length < 8) {
      setAlertTitle('Error');
      setAlertDescription('Please provide valid password.');
      setAlertButtons([
        {
          label: 'OK',
          onPress: () => {
            log.info('OK Pressed');
          },
        },
      ]);
      setAlertVisible(true);
      return;
    } else if (userL.confirmpassword === '') {
      setAlertTitle('Error');
      setAlertDescription('Please provide confirm password.');
      setAlertButtons([
        {
          label: 'OK',
          onPress: () => {
            log.info('OK Pressed');
          },
        },
      ]);
      setAlertVisible(true);
      return;
    } else if (userL.confirmpassword.length < 8) {
      setAlertTitle('Error');
      setAlertDescription('Please provide valid confirm password.');
      setAlertButtons([
        {
          label: 'OK',
          onPress: () => {
            log.info('OK Pressed');
          },
        },
      ]);
      setAlertVisible(true);
      return;
    }
    if (password === confirmPassword) {
      try {
        const res = await dispatch(signupWithEmailPassword(userL));
        const messageFromAPI = res.payload?.message;
  
        if (messageFromAPI === 'Signup successfully') {
          log.debug('Signup using email password success');
          dispatch(updateEmailOfOtpSent(userL.email));
          navigation.navigate('Auth/VerifyEmailCode' as never);
  
          // Clear redux for login credentials after login
          dispatch(updateUserEmail(''));
          dispatch(updateUserPassword(''));
          dispatch(updateUserConfirmPassword(''));
        } else {
          log.debug('Signup using email password failed');
          setAlertTitle('Error');
          setAlertDescription(messageFromAPI || 'Signup Failed');
          setAlertButtons([
            {
              label: 'OK',
              onPress: () => {
                log.info('OK Pressed');
              },
            },
          ]);
          setAlertVisible(true);
        }
      } catch (error) {
        log.error('Error during signup:', error);
        setAlertTitle('Error');
        setAlertDescription(error.payload?.message || 'Signup Failed');
        setAlertButtons([
          {
            label: 'OK',
            onPress: () => {
              log.info('OK Pressed');
            },
          },
        ]);
        setAlertVisible(true);
      }
    } else {
      setAlertTitle('Error');
      setAlertDescription('Passwords do not match.');
      setAlertButtons([
        {
          label: 'OK',
          onPress: () => {
            log.info('OK Pressed');
          },
        },
      ]);
      setAlertVisible(true);
    }
    dispatch(updateLoading(false));
  }, [password, confirmPassword, dispatch, navigation, userL]);
  
  const handleGoogleSignIn = useCallback(async () => {
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
        //user is not on backend, signup first using backend api
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
          setAlertDescription(`User cancelled the Google Signup flow.`);
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
  }, [dispatch, navigation]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: newWebClientID,
    });

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, [onAuthStateChanged]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={5}
        style={styles.container}>
        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          description={alertDescription}
          buttons={alertButtons}
          onClose={() => setAlertVisible(false)}
        />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.innerContainer}>
            <AuthHeading
              firstText="Sign up"
              secondText=""
              isHelloWaveVisible={false}
              containerHeight={50}
              isLoginPage={false}
            />
            <InputFieldFirstName
              label="First Name"
              placeholder="John"
              marginTop={120}
              onFirstNameChange={handleFirstNameChange}
            />
            <InputFieldLastName
              label="Last Name"
              placeholder="Doe"
              marginTop={0}
              onLastNameChange={handleLastNameChange}
            />
            <InputFieldEmail
              label="Email"
              placeholder="example@gmail.com"
              marginTop={0}
              onEmailChange={handleEmailChange}
            />
            <InputFieldPassword
              label="Create a password"
              placeholder="must be 8 characters"
              onPasswordChange={handlePasswordChange}
            />
            <InputFieldConfirmPassword
              label="Confirm password"
              placeholder="repeat password"
              onPasswordChange={handleConfirmPasswordChange}
            />
            <Button label={'Sign Up'} onPress={handleSignup} />
            <Text style={styles.orText}>Or</Text>
            <GoogleButton
              onPress={handleGoogleSignIn}
              label="Sign Up with Google"
            />
          </View>
          <AuthFooter
            greyText="Already have an account?"
            boldText="Log in"
            pushRoute="Auth/Login"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  innerContainer: {
    flexDirection: 'column',
    gap: 10,
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
});
