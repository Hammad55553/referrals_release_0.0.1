import {StyleSheet, View} from 'react-native';

import {ThemedText} from './ThemedText';
import React from 'react';

export function HelloWave() {
  return (
    <View>
      <ThemedText style={styles.text}>👋</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },
});
