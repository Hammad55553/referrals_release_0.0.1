import {useState} from 'react';
import {Text, StyleSheet, SafeAreaView, View, Alert} from 'react-native';
import {AuthHeading} from '../../components/auth/AuthHeading';
import {AuthFooter} from '../../components/auth/AuthFooter';
import {Button} from '../../components/Button';
import {InputFieldPassword} from '../../components/InputFieldPassword';
import {
  updateUserPassword,
  resetPassword,
  UserState,
  updateUserConfirmPassword,
  updateUserEmail,
} from '../../redux/features/authSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {logger} from 'react-native-logs';
import {InputFieldConfirmPassword} from '../../components/InputFieldConfirmPassword';
import React from 'react';

import CustomAlert from '../../components/CustomAlert';

var log = logger.createLogger();

export default function ResetPassword() {
  const navigation = useNavigation();
  const dispatch: AppDispatch = useDispatch();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null); 

  const user: UserState = useSelector((state: RootState) => state.auth.user);
  const forgotPasswordResetToken: string = useSelector(
    (state: RootState) => state.auth.forgotPasswordResetToken,
  );

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const [alertButtons, setAlertButtons] = useState<
    {label: string; onPress: () => void}[]
  >([]);

  const handlePasswordChange = (text: string) => {
    if (text.length < 8) {
      setError("Password must be at least 8 characters");
    } else {
      setError(null);
    }
    setPassword(text);
    dispatch(updateUserPassword(text));
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    dispatch(updateUserConfirmPassword(text));
  };

  const handleResetPassword = async () => {
    if(password.length < 8) {
      Alert.alert('Password must be more than 8 characters');
      return;
    };
    if (password === confirmPassword) {
      const res = await dispatch(
        resetPassword({
          password: user.password,
          token: forgotPasswordResetToken,
        }),
      );
      const messageFromAPI = res.payload?.message;
      console.log(messageFromAPI);
      
      if (messageFromAPI === 'Password reset successful') {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Auth/PasswordChanged'}],
          }),
        );
        dispatch(updateUserEmail(''));
        dispatch(updateUserPassword(''));
        dispatch(updateUserConfirmPassword(''));
      } else {
        setAlertTitle('Password reset failed!');
        setAlertDescription('Include at least 1 special character, 1 capital letter and 1 small case letter');
        setAlertButtons([
          {label: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
        setAlertVisible(true);
      }
    } else {
      Alert.alert('Oh!', 'Passwords do not match');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          description={alertDescription}
          buttons={alertButtons}
          onClose={() => setAlertVisible(false)}
        />
      <View style={styles.containerChild}>
        <AuthHeading
          firstText="Reset password"
          secondText=""
          isHelloWaveVisible={false}
          containerHeight={75}
          isLoginPage={true}
        />
        <Text style={styles.descriptionText}>
          Please type something you'll remember
        </Text>
        <InputFieldPassword
          label="New password"
          placeholder="must be 8 characters"
          onPasswordChange={handlePasswordChange}
        />
        {error && (
        <Text style={styles.error}>{error}</Text>)}
        <InputFieldConfirmPassword
          label="Confirm new password"
          placeholder="repeat password"
          onPasswordChange={handleConfirmPasswordChange}
        />
        <Button onPress={handleResetPassword} label={`Reset password`} />
      </View>
      <AuthFooter
        greyText="Already have an account?"
        boldText="Log in"
        pushRoute="Auth/Login"
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
  error: {
    fontSize: 12,
    color: 'red',
  },
});
