import React, {useState, useRef, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
  Keyboard,
  Image,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../../../redux/store';
import {Button} from '../../../components/Button';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {verifyOtp} from '../../../redux/features/otpVerificationSlice';

const OtpVerification = () => {
  const dispatch: AppDispatch = useDispatch();
  const route = useRoute();
  const {email} = route.params as {email: string; otpToken: string};

  const navigation = useNavigation<StackNavigationProp<any>>();

  const {loading, error, success} = useSelector(
    (state: RootState) => state.otpVerification,
  );

  const {otpToken} = useSelector((state: RootState) => state.emailVerification);
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Focus on the next input
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Automatically dismiss the keyboard if the last input is filled
    if (index === 3 && text) {
      Keyboard.dismiss();
    }
  };

  const handleVerifyOtp = () => {
    const otpString = otp.join('');
    dispatch(verifyOtp({email, otp: otpString, token: otpToken}));
  };
  useEffect(() => {
    if (success) {
      navigation.navigate('verificationsuccess');
    }
  }, [navigation, success]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.head}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <View style={styles.iconContainer}>
            <Image
              source={require('../../../assets/icons/chevronleft.png')}
              style={styles.iconLeft}
            />
          </View>
        </TouchableOpacity>
        <Text style={styles.headText}>Verification</Text>
      </View>
      <View style={styles.containerChild}>
        <Text style={styles.descriptionText}>We've sent a code to {email}</Text>
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
        <Button label="Verify" onPress={handleVerifyOtp} />
        <View style={styles.sendCodeAgain}>
          <Text style={styles.sendCodeAgainText}>Send code again</Text>
          <Text style={styles.timerText}>00:20</Text>
        </View>
        {loading && <Text>Loading...</Text>}
        {error && <Text style={styles.errorText}>{error}</Text>}
        {success && (
          <Text style={styles.successText}>Verification successful!</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

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
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  head: {
    flexDirection: 'row',
    padding: 16,
  },
  headText: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 29.4,
    color: 'black',
  },
  backButton: {
    marginRight: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: '#E2E8EE',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLeft: {
    width: 7,
    height: 13,
    tintColor: '#000000',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  successText: {
    color: 'green',
    marginTop: 10,
  },
});

export default OtpVerification;
