import {StyleSheet, TextProps, TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React from 'react';

export type ThemedTextProps = TextProps & {
  label?: string;
  pushRoute: string;
};

export function RoutingButton({label, pushRoute}: ThemedTextProps) {
  const navigation = useNavigation();

  const handleNavigation = () => {
    navigation.navigate(pushRoute as never);
  };

  return (
    <TouchableOpacity
      onPress={() => {
        handleNavigation();
      }}
      style={styles.button}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2441D0',
    height: 56,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
