import React from 'react';
import {Text, type TextProps, StyleSheet, PixelRatio} from 'react-native';
import {useThemeColor} from '../hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color =
    useThemeColor({light: lightColor, dark: darkColor}, 'text') || 'black';
  const fontSize = PixelRatio.get() < 2 ? 14 : 16;

  return (
    <Text
      style={[
        {color},
        type === 'default' ? {...styles.default, fontSize} : undefined,
        type === 'title'
          ? {...styles.title, fontSize: fontSize + 16}
          : undefined,
        type === 'defaultSemiBold'
          ? {...styles.defaultSemiBold, fontSize}
          : undefined,
        type === 'subtitle'
          ? {...styles.subtitle, fontSize: fontSize + 4}
          : undefined,
        type === 'link' ? {...styles.link, fontSize} : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    lineHeight: 24,
  },
  defaultSemiBold: {
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    color: '#0a7ea4',
  },
});
