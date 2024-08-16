//react and react native imports
import {useState, useRef, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
  Keyboard,
  Alert,
  TouchableOpacity
} from 'react-native';

//custom components imports
import {AuthHeading} from '../../components/auth/AuthHeading';
import {Button} from '../../components/Button';

//react redux imports
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../../redux/store';
import {
  LoggedInUserState,
  resendOTPToEmail,
  updateEmailOfOtpSent,
  updateEmailOTP,
  updateFirebaseIdToken,
  updateForgotPasswordFlow,
  updateLoading,
  updateLoggedInUser,
  verifyEmailAddress,
  verifyEmailAddressForgetPassword,
} from '../../redux/features/authSlice';

//react native navigation imports
import {CommonActions, useNavigation} from '@react-navigation/native';

//react native logger imports
import {logger} from 'react-native-logs';
import React from 'react';
import auth from '@react-native-firebase/auth';
import CustomAlert from '../../components/CustomAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';

var log = logger.createLogger();

export default function VerifyEmailCode() {
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation();

  const forgotPasswordFlow = useSelector(
    (state: RootState) => state.auth.forgotPasswordFlow,
  );
  const forgotPasswordEmail: string = useSelector(
    (state: RootState) => state.auth.forgotPasswordEmail,
  );
  const emailOfOtpSent: string = useSelector(
    (state: RootState) => state.auth.emailOfOtpSent,
  );
  const loading: boolean = useSelector(
    (state: RootState) => state.auth.loading,
  );
  const loggedInUser: LoggedInUserState = useSelector(
    (state: RootState) => state.auth.loggedInUser,
  );
  const [otp, setOtp] = useState(['', '', '', '']);
  const [stringOTP, setStringOTP] = useState('');
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const [alertButtons, setAlertButtons] = useState<
    {label: string; onPress: () => void}[]
  >([]);
  const [seconds, setSeconds] = useState(20);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    dispatch(updateEmailOTP(newOtp.join('')));

    // Focus on the next input
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Automatically dismiss the keyboard if the last input is filled
    if (index === 3 && text) {
      Keyboard.dismiss();
    }
    // If the user is deleting (backspace) and the text is empty
    if (text === '' && index>0) {
      // Move focus to the previous input
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (forgotPasswordFlow === 'true') {
      // for forgot password
      const res = await dispatch(
        verifyEmailAddressForgetPassword({
          emailOTP: stringOTP,
          token: loggedInUser.otpToken,
        }),
      );

      const messageFromAPI = res.payload?.message;
      if (messageFromAPI === 'OTP verified') {
        dispatch(updateForgotPasswordFlow('false'));

        setAlertTitle('OTP Verified');
        setAlertDescription('Your OTP is verified.');
        setAlertButtons([
          {
            label: 'OK',
            onPress: () => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Auth/ResetPassword'}],
                }),
              );
            },
          },
        ]);
        setAlertVisible(true);
      } else {
        setAlertTitle('OTP Verification Failed');
        setAlertDescription(
          'The OTP you entered is incorrect. Please try again.',
        );
        setAlertButtons([
          {label: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
        setAlertVisible(true);
      }
    } else {
      // for signup email verification
      const res = await dispatch(
        verifyEmailAddress({emailOTP: stringOTP, token: loggedInUser.otpToken}),
      );
      const messageFromAPI = res.payload.message;

      if (res.payload.data.custom_token) {
        await AsyncStorage.setItem(
          'loginCustomToken',
          res.payload.data.custom_token,
        );
      }

      if (messageFromAPI === 'Email verified') {
        const firebaseUserCredential = await auth().signInWithCustomToken(
          res.payload.data.custom_token,
        );

        if (firebaseUserCredential.user) {
          const customLoggedInUser: LoggedInUserState = {
            __v: 0,
            _id: '',
            email: '', //email is set here
            firstName: '', //firstName is set here
            lastName: '', //lastName is set here
            otpToken: '',
            uid: '', //uid is set here
            picture: '', //photo url is set here
          };

          if (firebaseUserCredential.user.displayName) {
            let [firstName, lastName] =
              firebaseUserCredential.user.displayName.split(' ');
            customLoggedInUser.firstName = firstName;
            customLoggedInUser.lastName = lastName;
          }
          if (firebaseUserCredential.user.uid) {
            customLoggedInUser.uid = firebaseUserCredential.user.uid;
          }
          if (firebaseUserCredential.user.email) {
            customLoggedInUser.email = firebaseUserCredential.user.email;
          }
          if (firebaseUserCredential.user.photoURL) {
            customLoggedInUser.picture = firebaseUserCredential.user.photoURL;
          }

          const idToken = await firebaseUserCredential.user.getIdToken();
          dispatch(updateFirebaseIdToken(idToken));

          dispatch(updateLoggedInUser(customLoggedInUser));

          await AsyncStorage.setItem('idToken', idToken);

          await AsyncStorage.setItem(
            'userInfo',
            JSON.stringify(customLoggedInUser),
          );

          setAlertTitle('Congratulations!');
          setAlertDescription('Your Email is verified.');
          setAlertButtons([
            {
              label: 'OK',
              onPress: () => {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Auth/ResetPassword'}],
                  }),
                );
              },
            },
          ]);
          setAlertVisible(true);
        }
        dispatch(updateLoading(false));
        dispatch(updateEmailOfOtpSent(''));
      } else {
        setAlertTitle('Signup Failed');
        setAlertDescription('The signup process failed. Please try again.');
        setAlertButtons([
          {label: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
        setAlertVisible(true);
      }
    }
  };

  const handleSendCodeAgain = async () => {
    if (forgotPasswordFlow === 'true') {
      const res = await dispatch(resendOTPToEmail({email: forgotPasswordEmail}));
      if (res.payload && res.payload.data) {
        Alert.alert('OTP Sent Again');
        setSeconds(20);
        setIsTimerActive(true);
      } else {
        Alert.alert('OTP Sent Failed');
      }
    } else {
      const res = await dispatch(resendOTPToEmail({email: loggedInUser.email}));
      console.log(loggedInUser.email);
      console.log(res.payload);

      if (res.payload && res.payload.data) {
        Alert.alert('OTP Sent Again');
        setSeconds(20);
        setIsTimerActive(true);
      } else {
        Alert.alert('OTP Sent Failed');
      }
    }
    
  };

  useEffect(() => {
    const otpString = otp.join('');
    setStringOTP(otpString);
  }, [otp]);

  useEffect(() => {
    let timer;
    if (isTimerActive && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsTimerActive(false);
    }

    return () => clearInterval(timer); // Cleanup the timer on component unmount
  }, [isTimerActive, seconds]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerChild}>
        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          description={alertDescription}
          buttons={alertButtons}
          onClose={() => setAlertVisible(false)}
        />
        <AuthHeading
          firstText="Please check your"
          secondText="email"
          isHelloWaveVisible={false}
          containerHeight={75}
          isLoginPage={false}
        />
        <Text style={styles.descriptionText}>
          We've sent a code to{' '}
          {forgotPasswordFlow === 'true' ? forgotPasswordEmail : emailOfOtpSent}
        </Text>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              placeholder="-"
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={text => handleOtpChange(text, index)}
              autoFocus={index === 0}
            />
          ))}
        </View>
        <Button label={loading ? 'Calling' : 'Verify'} onPress={handleVerify} />
        <View style={styles.sendCodeAgain}>
          <TouchableOpacity onPress={handleSendCodeAgain} disabled={seconds > 0} >
            <Text style={[styles.sendCodeAgainText, { color: seconds > 0 ? 'gray' : 'blue' }]}>
              Send code again
            </Text>
          </TouchableOpacity>
          <Text style={styles.timerText}>{`00:${String(seconds).padStart(2, '0')}`}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 0,
    width: '100%',
    alignSelf: 'center',
  },
  otpInput: {
    height: 77,
    width: 77,
    borderColor: '#D8DADC',
    borderWidth: 1,
    borderRadius: 15,
    fontSize: 32,
    textAlign: 'center',
    color: 'black',
    fontWeight: '500',
  },
  sendCodeAgain: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginTop: 20,
  },
  sendCodeAgainText: {
    color: '#000000B2',
    fontWeight: 'bold',
    fontSize: 16,
  },
  timerText: {
    color: '#000000B2',
    fontWeight: '400',
    fontSize: 16,
  },
  descriptionText: {
    marginTop: 130,
    fontSize: 16,
    fontWeight: '400',
    color: '#000000B2',
    lineHeight: 20,
  },
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
  },
  tickIcon: {
    marginRight: -5,
  },
  icon: {
    color: 'black',
    backgroundColor: 'white',
  },
});
