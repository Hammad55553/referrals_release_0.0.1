import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  TextProps,
  PixelRatio,
} from 'react-native';

export type ThemedTextProps = TextProps & {
  onPress?: () => void;
  label: string;
};

export function GoogleButton({onPress, label}: ThemedTextProps) {
  // Adjust font size based on screen density
  const fontSize = PixelRatio.get() < 2 ? 14 : 16;

  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Image
        source={require('../assets/images/Google.png')}
        style={styles.googleImage}
      />
      <Text style={{...styles.text, fontSize}}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    height: 56,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D8DADC',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
  },
  text: {
    color: 'black',
    fontWeight: '600',
  },
  googleImage: {
    width: 20,
    height: 20,
  },
});
