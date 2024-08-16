import {useEffect, useState} from 'react';

import {
  StyleSheet,
  TextProps,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {ThemedText} from './ThemedText';
import {useSharedValue} from 'react-native-reanimated';
import {RootState} from '../redux/reducers';
import {useSelector} from 'react-redux';
import {UserState} from '../redux/features/authSlice';
import React from 'react';

export type ThemedTextProps = TextProps & {
  label?: string;
  placeholder?: string;
  onPasswordChange?: (email: string) => void;
};

export function InputFieldConfirmPassword({
  label,
  placeholder,
  onPasswordChange,
}: ThemedTextProps) {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const isValidPassword = useSharedValue(0);
  const userL: UserState = useSelector((state: RootState) => state.auth.user);
  const apiCalled: string = useSelector(
    (state: RootState) => state.auth.apiCalled,
  );

  const toggleSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const validatePassword = (password: string) => {
    if (password.length === 8) {
      return true;
    } else {
      return false;
    }
  };

  const handlePasswordChange = (text: string) => {
    setConfirmPassword(text);
    isValidPassword.value = validatePassword(text) ? 1 : 0;
    if (onPasswordChange) {
      onPasswordChange(text);
    }
  };

  useEffect(() => {
    // Update local state when redux state changes
    setConfirmPassword(userL.confirmpassword);
  }, [userL.confirmpassword]);

  useEffect(() => {
    // Check conditions on calling of APIs
    if (apiCalled === 'true') {
      if (confirmPassword === '') {
        Alert.alert('Confirm Password is empty');
      } else if (confirmPassword.length < 8) {
        Alert.alert('Confirm Password is less than 8 characters');
      }
    }
  }, [apiCalled]);

  return (
    <View style={styles.containerRoot}>
      <ThemedText type="default" style={styles.text}>
        {label}
      </ThemedText>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          style={{...styles.input, ...styles.placeholder}}
          placeholderTextColor={'#808080'}
          onChangeText={handlePasswordChange}
          value={confirmPassword}
        />
        <TouchableOpacity
          onPress={toggleSecureTextEntry}
          style={styles.eyeIcon}>
          <Icon
            name={secureTextEntry ? 'eye-off' : 'eye'}
            size={24}
            color="#999999"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerRoot: {
    paddingBottom: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 5,
    marginTop: 10,
  },
  text: {
    fontSize: 14,
    color: '#000000B2',
    fontFamily: 'HelveticaNowDisplay-Regular',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  input: {
    height: 56,
    paddingTop: 18,
    paddingBottom: 18,
    paddingLeft: 16,
    paddingRight: 40,
    borderColor: '#D8DADC',
    borderWidth: 1,
    flex: 1,
    borderRadius: 10,
    fontSize: 16,
    color: 'black',
    fontFamily: 'HelveticaNowDisplay-Medium',
  },
  placeholder: {
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
  },
});
