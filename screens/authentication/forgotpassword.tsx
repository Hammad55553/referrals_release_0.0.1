import {Text, StyleSheet, SafeAreaView, View, Alert} from 'react-native';
import {AuthHeading} from '../../components/auth/AuthHeading';
import {AuthFooter} from '../../components/auth/AuthFooter';
import {InputFieldEmail} from '../../components/InputFieldEmail';
import {Button} from '../../components/Button';
import {
  sendResetPasswordOTP,
  updateForgotPasswordEmail,
  updateForgotPasswordFlow,
} from '../../redux/features/authSlice';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../../redux/store';
import {useNavigation} from '@react-navigation/native';
import React from 'react';

export default function ForgotPassword() {
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation();
  const forgotPasswordEmail = useSelector(
    (state: RootState) => state.auth.forgotPasswordEmail,
  );
  const loading: boolean = useSelector(
    (state: RootState) => state.auth.loading,
  );

  const handleEmailChange = (email: string) => {
    dispatch(updateForgotPasswordEmail(email));
  };

  const handleForgotPassword = async () => {
    console.log(forgotPasswordEmail);
    try {
      const res = await dispatch(sendResetPasswordOTP(forgotPasswordEmail));
      // console.log("Wasssssup Data", res.payload.data);

      if (res.payload && res.payload.data) {
        dispatch(updateForgotPasswordFlow('true'));
        navigation.navigate('Auth/VerifyEmailCode' as never);
      } else {
        Alert.alert('Invalid Email');
      }
    } catch(error) {
      console.error('Error sending reset password OTP:', error);
      Alert.alert('Error', 'An error occurred while sending the reset password email. Please check your internet connection and try again.');
    }
    
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerChild}>
        <AuthHeading
          firstText="Forgot password?"
          secondText=""
          isHelloWaveVisible={false}
          containerHeight={75}
          isLoginPage={false}
        />
        <Text style={styles.descriptionText}>
          Don't worry! It happens. Please enter the email associated with your
          account.
        </Text>
        <InputFieldEmail
          label="Email address"
          placeholder="Enter your email address"
          marginTop={20}
          onEmailChange={handleEmailChange}
        />
        <Button
          onPress={handleForgotPassword}
          label={loading ? 'Calling' : 'Send Code'}
        />
      </View>
      <AuthFooter
        greyText="Remember password?"
        boldText="Log in"
        pushRoute="Auth/ResetPassword"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  descriptionText: {
    marginTop: 95,
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
