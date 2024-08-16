import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface CustomDrawerItemProps {
  label: string;
  onPress: () => void;
  icon: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
}

/**
 * This is a single item in the side navigation drawer
 * @param label - The label of the drawer item
 * @param onPress - What happens when it is pressed
 * @param icon - A HTML element for the icon of the drawer item
 * @param selected - Boolean weather the item is selected
 * @param onSelect - What happens when the item is selected
 * @constructor
 */
export default function HomeDrawerItem({
  label,
  onPress,
  icon,
  selected,
  onSelect,
}: CustomDrawerItemProps) {
  const handlePress = () => {
    onSelect();
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.container, selected && styles.pressedContainer]}>
      <View style={styles.icon}>{icon}</View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    margin: 5,
    borderColor: 'transparent',
    borderWidth: 2,
  },
  pressedContainer: {
    borderColor: '#2441D0',
    borderWidth: 2,
    borderRadius: 10,
    borderStyle: 'solid',
    backgroundColor: '#E8EDFF80',
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontSize: 14.69,
    fontFamily: 'Helvetica',
    color: '#242424',
    fontWeight: '400',
    lineHeight: 16.86,
  },
});
