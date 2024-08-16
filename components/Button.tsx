import React, {ReactNode} from 'react';
import {
  StyleSheet,
  TextProps,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  PixelRatio,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/reducers';

export type ThemedTextProps = TextProps & {
  label?: string | ReactNode;
  onPress?: () => void;
};

export function Button({label, onPress}: ThemedTextProps) {
  const loading: boolean = useSelector(
    (state: RootState) => state.auth.loading,
  );

  // Adjust font size based on screen density
  const fontSize = PixelRatio.get() < 2 ? 14 : 16;

  return (
    <TouchableOpacity
      disabled={loading}
      style={styles.button}
      onPress={onPress}>
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={{...styles.text, fontSize}}>{label}</Text>
      )}
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
    fontFamily: 'HelveticaNowDisplay-Bold',
  },
});
