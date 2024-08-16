import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  interpolateColor,
} from 'react-native-reanimated';

interface SlideButtonProps {
  onSlideComplete: () => void;
}

const SlideButton: React.FC<SlideButtonProps> = ({ onSlideComplete }) => {
  const translateX = useSharedValue(0);
  const buttonWidth = 300; // Width of the slide button
  const thumbWidth = 50; // Width of the thumb

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      translateX.value = withSpring(translateX.value);
    })
    .onUpdate(event => {
      translateX.value = event.translationX;
      if (translateX.value < 0) {
        translateX.value = 0;
      } else if (translateX.value > buttonWidth - thumbWidth) {
        translateX.value = buttonWidth - thumbWidth;
      }
    })
    .onEnd(() => {
      if (translateX.value > (buttonWidth - thumbWidth) / 2) {
        translateX.value = withSpring(
          buttonWidth - thumbWidth,
          { damping: 15, stiffness: 150 },
          () => {
            runOnJS(onSlideComplete)();
          }
        );
      } else {
        translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const backgroundStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      translateX.value,
      [0, buttonWidth - thumbWidth],
      ['#ddd', '#4caf50']
    );
    return { backgroundColor };
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.slider, { width: buttonWidth }, backgroundStyle]}
      >
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.thumb, animatedStyle]}>
            <Image
              source={require('../assets/icons/right-arrow.png')}
              style={styles.image}
            />
          </Animated.View>
        </GestureDetector>
        <Text style={styles.text}>Swipe right to send request</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    width:"100%"
  },
  slider: {
   width:"100%",
    height: 48,
    borderColor: '#2441D0',
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  thumb: {
    marginLeft:16,
    marginTop: 5,
    backgroundColor: '#2441D0',
    borderRadius: 5,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  image: {
    width: 30,
    height: 30,
  },
  text: {
    position: 'absolute',
    alignSelf: 'center',
    color: '#2441D0',
    fontWeight: 'bold',
  },
});

export default SlideButton;