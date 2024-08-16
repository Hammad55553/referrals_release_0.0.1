import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import {Image} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';

import {StackNavigationProp} from '@react-navigation/stack';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../../../redux/store';
import {sendOtp} from '../../../redux/features/emailVerifySlice';

const Schoolemail = () => {
  const [email, setEmail] = useState('');
  const [type, setType] = useState('workplace');
  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch = useDispatch<AppDispatch>();

  const {
    loading,
    error,
    message,
    email: verifiedEmail,
    otpToken,
  } = useSelector((state: RootState) => state.schoolEmail);

  const handleSendOtp = () => {
    dispatch(sendOtp({email, type}));
  };

  useEffect(() => {
    if (message === 'OTP sent successfully') {
      navigation.navigate('OtpVerification', {email: verifiedEmail, otpToken});
    }
  }, [message, navigation, verifiedEmail]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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
        <Text style={styles.description}>
          Enter your school email address to receive a{' '}
          <Text style={styles.boldText}>One-Time password</Text> for
          verification.
        </Text>
        <View style={styles.inputView}>
          <Text style={styles.emailText}>Email your school email address</Text>
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="example@example.com"
            keyboardType="email-address"
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSendOtp}
          disabled={loading}>
          <Text style={styles.buttonText}>Send Verification Code</Text>
        </TouchableOpacity>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {message && <Text style={styles.successText}>{message}</Text>}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
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
  description: {
    width: '100%',
    marginVertical: 12,
    fontSize: 16,
    color: '#2F2F2F',
    lineHeight: 24,
  },
  boldText: {
    fontWeight: '700',
  },
  input: {
    width: '100%',
    height: 56,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    color: 'black',
  },
  inputView: {
    width: '100%',
    marginVertical: 10,
  },
  emailText: {
    fontFamily: 'Helvetica Now Display',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 17.5,
    textAlign: 'left',
    color: 'black',
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#2441D0',
    paddingVertical: 17,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
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

export default Schoolemail;
