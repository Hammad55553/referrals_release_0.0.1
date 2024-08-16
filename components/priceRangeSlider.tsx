import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface LabelProps {
  text: string;
}

const Thumb = () => <View style={styles.thumb} />;
const Rail = () => <View style={styles.rail} />;
const RailSelected = () => <View style={styles.railSelected} />;
const Label: React.FC<LabelProps> = ({ text }) => <Text style={styles.label}>{text}</Text>;
const Notch = () => <View style={styles.notch} />;

const styles = StyleSheet.create({
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'blue',
  },
  rail: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'lightgrey',
  },
  railSelected: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'blue',
  },
  label: {
    padding: 8,
    backgroundColor: '#2441D0',
    color: 'white',
    fontSize: 12,
    fontFamily: 'Helvetica',
    borderRadius: 4,
  },
  notch: {
    width: 10,
    height: 10,
    backgroundColor: 'blue',
  },
});

export { Thumb, Rail, RailSelected, Label, Notch };
