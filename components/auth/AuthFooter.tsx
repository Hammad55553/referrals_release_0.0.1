import React from 'react';
import {StyleSheet, TextProps, View, PixelRatio} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ThemedText} from '../ThemedText';
import {AppDispatch} from '../../redux/store';
import {useDispatch} from 'react-redux';
import {
  updateUserConfirmPassword,
  updateUserEmail,
  updateUserFirstName,
  updateUserLastName,
  updateUserPassword,
} from '../../redux/features/authSlice';

export type ThemedTextProps = TextProps & {
  greyText?: string;
  boldText?: string;
  pushRoute?: string;
};

export function AuthFooter({greyText, boldText, pushRoute}: ThemedTextProps) {
  const navigation = useNavigation();
  const dispatch: AppDispatch = useDispatch();

  const handleNavigation = () => {
    dispatch(updateUserEmail(''));
    dispatch(updateUserPassword(''));
    dispatch(updateUserConfirmPassword(''));
    dispatch(updateUserFirstName(''));
    dispatch(updateUserLastName(''));
    if (pushRoute !== undefined) {
      navigation.navigate(pushRoute as never);
    }
  };

  // Adjust font size based on screen density
  const fontSize = PixelRatio.get() < 2 ? 14 : 16;

  return (
    <View style={styles.containerRoot}>
      <View>
        <ThemedText type="default" style={{...styles.text, fontSize}}>
          {greyText}
        </ThemedText>
      </View>
      <View>
        <ThemedText
          onPress={handleNavigation}
          type="defaultSemiBold"
          style={{...styles.linkText, fontSize}}>
          {boldText}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerRoot: {
    paddingBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 40,
  },
  text: {
    color: '#000000B2',
  },
  linkText: {
    color: 'black',
  },
});
