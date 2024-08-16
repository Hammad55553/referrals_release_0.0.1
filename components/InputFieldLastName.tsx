import React, {useEffect, useState} from 'react';
import {StyleSheet, TextProps, TextInput, View, PixelRatio} from 'react-native';
import Animated from 'react-native-reanimated';
import {ThemedText} from './ThemedText';
import {RootState} from '../redux/reducers';
import {useSelector} from 'react-redux';
import {UserState} from '../redux/features/authSlice';
import {logger} from 'react-native-logs';

var log = logger.createLogger();

export type ThemedTextProps = TextProps & {
  label?: string;
  placeholder?: string;
  marginTop: number;
  onLastNameChange?: (lastName: string) => void;
};

export function InputFieldLastName({
  label,
  placeholder,
  marginTop,
  onLastNameChange,
}: ThemedTextProps) {
  const [lastName, setLastName] = useState('');
  const userL: UserState = useSelector((state: RootState) => state.auth.user);
  const apiCalled: string = useSelector(
    (state: RootState) => state.auth.apiCalled,
  );

  const handleLastNameChange = (text: string) => {
    setLastName(text);
    if (onLastNameChange) {
      onLastNameChange(text);
    }
  };

  useEffect(() => {
    if (userL.lastName === '') {
      setLastName(userL.lastName);
    }
  }, [userL.lastName]);

  useEffect(() => {
    if (apiCalled === 'true') {
      if (lastName === '') {
        log.info('last name is empty');
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
          textContentType="familyName"
          placeholder={placeholder}
          placeholderTextColor={'#808080'}
          autoCapitalize="none"
          keyboardType="default"
          style={{...styles.input, fontSize}}
          onChangeText={handleLastNameChange}
          value={lastName}
        />
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