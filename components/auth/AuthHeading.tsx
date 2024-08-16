import {
  PixelRatio,
  StyleSheet,
  TextProps,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ThemedText} from '../ThemedText';
import {HelloWave} from '../HelloWave';
import ChevronLeftIcon from '../ChevronLeftIcon';
import {logger} from 'react-native-logs';

var log = logger.createLogger();

export type ThemedTextProps = TextProps & {
  firstText?: string;
  secondText?: string;
  pushRoute?: string;
  isHelloWaveVisible?: boolean;
  containerHeight?: number;
  isLoginPage: boolean;
};

export function AuthHeading({
  firstText,
  secondText,
  isHelloWaveVisible,
  containerHeight,
  isLoginPage,
}: ThemedTextProps) {
  const navigation = useNavigation();
  const [goBackStatus, setGoBackStatus] = useState<boolean>(
    navigation.canGoBack(),
  );

  let fontSize = 22; //PixelRatio is less than 2

  const pixelRatio = PixelRatio.get();

  if (pixelRatio >= 2 && pixelRatio < 3) {
    //PixelRatio is between 2 and 3
    fontSize = 24;
  } else if (pixelRatio >= 3) {
    //PixelRatio is more than 3
    fontSize = 27;
  }

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View
      style={
        containerHeight === 75 ? styles.containerRoot75 : styles.containerRoot50
      }>
      {!isLoginPage && (
        <TouchableOpacity
          style={{marginTop: 20}}
          onPress={() => {
            handleGoBack();
          }}>
          <ChevronLeftIcon />
        </TouchableOpacity>
      )}
      <ThemedText
        type="title"
        style={
          isLoginPage
            ? {...styles.text, ...styles.marginTop120, fontSize}
            : {...styles.text, ...styles.marginTop90, fontSize}
        }>
        {firstText}
      </ThemedText>
      <View style={styles.secondTextContainer}>
        <ThemedText
          type="title"
          style={{
            fontSize,
            color: 'black',
            fontFamily: 'HelveticaNowDisplay-Regular',
          }}>
          {secondText}
        </ThemedText>
        {isHelloWaveVisible && (
          <View style={styles.helloWaveContainer}>
            <HelloWave />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerRoot75: {
    height: 75,
  },
  containerRoot50: {
    height: 50,
  },
  text: {
    height: 90,
    color: 'black',
    fontFamily: 'HelveticaNowDisplay-Medium',
  },
  marginTop90: {
    marginTop: 65,
  },
  marginTop120: {
    marginTop: 120,
  },
  secondTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -60,
  },
  helloWaveContainer: {
    marginLeft: 5,
  },
});
