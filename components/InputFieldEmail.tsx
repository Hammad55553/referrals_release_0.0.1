import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  TextProps,
  TextInput,
  View,
  Alert,
  PixelRatio,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {ThemedText} from './ThemedText';
import Icon from 'react-native-vector-icons/Ionicons';
import {RootState} from '../redux/reducers';
import {useSelector} from 'react-redux';
import {UserState} from '../redux/features/authSlice';
import {logger} from 'react-native-logs';

var log = logger.createLogger();

export type ThemedTextProps = TextProps & {
  label?: string;
  placeholder?: string;
  marginTop: number;
  onEmailChange?: (email: string) => void;
};

export function InputFieldEmail({
  label,
  placeholder,
  marginTop,
  onEmailChange,
}: ThemedTextProps) {
  const [email, setEmail] = useState('');
  const isValidEmail = useSharedValue(0);
  const userL: UserState = useSelector((state: RootState) => state.auth.user);
  const apiCalled: string = useSelector(
    (state: RootState) => state.auth.apiCalled,
  );

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    isValidEmail.value = validateEmail(text) ? 1 : 0;
    if (onEmailChange) {
      onEmailChange(text);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isValidEmail.value, {duration: 500}),
  }));

  useEffect(() => {
    if (userL.email === '') {
      setEmail(userL.email);
      isValidEmail.value = 0;
    }
  }, [userL.email]);

  useEffect(() => {
    if (apiCalled === 'true') {
      if (email === '') {
        log.info('email is empty');
      } else if (isValidEmail.value === 0) {
        Alert.alert('Email is invalid');
      }
    }
  }, [apiCalled]);

  // Adjust font size based on screen density
  const fontSize = PixelRatio.get() < 2 ? 14 : 16;

  return (
    <Animated.View style={{...styles.containerRoot, marginTop}}>
      <ThemedText type="default" style={styles.text}>
        {label}
      </ThemedText>
      <View style={styles.inputContainer}>
        <TextInput
          textContentType="emailAddress"
          placeholder={placeholder}
          placeholderTextColor={'#808080'}
          autoCapitalize="none"
          keyboardType="email-address"
          style={{...styles.input, fontSize}}
          onChangeText={handleEmailChange}
          value={email}
        />
        <Animated.View style={[styles.tickIcon, animatedStyle]}>
          <Icon name="checkmark-outline" size={20} color="white" />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  containerRoot: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 5,
  },
  text: {
    fontSize: 14,
    color: '#000000',
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
    color: 'black',
    fontFamily: 'HelveticaNowDisplay-Medium',
  },
  tickIcon: {
    position: 'absolute',
    right: 10,
    backgroundColor: 'black',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
