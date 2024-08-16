import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  GestureHandlerRootView,
  PanGestureHandlerGestureEvent,
  GestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';

const SWIPE_THRESHOLD = 100;

const SwipableButton = () => {
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });

  const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    translateX.value = event.nativeEvent.translationX;
  };

  const onGestureEnd = (event: GestureHandlerStateChangeEvent) => {
    const {translationX} = event.nativeEvent as unknown as {
      translationX: number;
    }; // Casting to ensure type safety
    if (translationX > SWIPE_THRESHOLD) {
      translateX.value = withSpring(SWIPE_THRESHOLD);
    } else if (translationX < -SWIPE_THRESHOLD) {
      translateX.value = withSpring(-SWIPE_THRESHOLD);
    } else {
      translateX.value = withSpring(0);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onGestureEnd}>
        <Animated.View style={[styles.button, animatedStyle]}>
          <Text style={styles.buttonText}>Swipe Me</Text>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SwipableButton;
