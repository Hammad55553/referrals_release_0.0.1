import React from 'react';
import {View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export function ChevronLeftIcon() {
  return (
    <View style={styles.iconContainer}>
      <Icon name="chevron-back" size={24} color="#000" />
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: '#D8DADC',
    borderRadius: 10,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChevronLeftIcon;
