import React, {useRef, useState} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {
  PanGestureHandler,
  ScrollView,
  State,
  RectButton,
  LongPressGestureHandler,
} from 'react-native-gesture-handler';
import {
  getRequestsForUser,
  Request,
  updateStatusOfRequest,
} from '../redux/features/requestSlice';
import {AppDispatch, RootState} from '../redux/store';
import {useDispatch, useSelector} from 'react-redux';

const RATIO = 3;

interface SwipeableProps {
  children: React.ReactNode;
  item: any;
}

export const Swipeable: React.FC<SwipeableProps> = ({children, item}) => {
  const dispatch: AppDispatch = useDispatch();

  const firebaseIDToken: string | null = useSelector(
    (state: RootState) => state.auth.firebaseIDToken,
  );

  const [width, setWidth] = useState(0);
  const dragX = useRef(new Animated.Value(0)).current;
  const transX = dragX.interpolate({
    inputRange: [0, RATIO],
    outputRange: [0, 1],
  });
  const showLeftAction = dragX.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });
  const showRightAction = dragX.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [1, 0, 0],
  });
  const onGestureEvent = Animated.event(
    [{nativeEvent: {translationX: dragX}}],
    {useNativeDriver: true},
  );
  const handleUpdateRequest = async (
    status: Request['status'],
    requestID: string,
  ) => {
    if (firebaseIDToken) {
      await dispatch(
        updateStatusOfRequest({
          firebaseIDToken,
          requestID,
          status,
        }),
      );
      await dispatch(getRequestsForUser(firebaseIDToken));
    }
  };

  const onHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const dragToss = 0.05;
      const endOffsetX =
        event.nativeEvent.translationX + dragToss * event.nativeEvent.velocityX;

      let toValue = 0;
      if (endOffsetX > width / 2) {
        toValue = width * RATIO;
        handleUpdateRequest('ACCEPTED', item._id);
        alert(`Swiped Right: Accepted`);
      } else if (endOffsetX < -width / 2) {
        toValue = -width * RATIO;
        handleUpdateRequest('REJECTED', item._id);
        alert(`Swiped Right: Rejected`);
      }

      Animated.spring(dragX, {
        velocity: event.nativeEvent.velocityX,
        tension: 15,
        friction: 5,
        toValue,
        useNativeDriver: true,
      }).start();
    }
  };

  const onLayout = event => {
    setWidth(event.nativeEvent.layout.width);
  };

  const reset = () => {
    Animated.spring(dragX, {
      toValue: 0,
      useNativeDriver: true,
      tension: 15,
      friction: 5,
    }).start();
  };

  return (
    <View>
      <Animated.View style={[styles.rowAction, {opacity: showLeftAction}]}>
        <RectButton
          style={[styles.rowAction, styles.leftAction]}
          onPress={reset}>
          <Text style={styles.actionButtonTextGreen}>Accepted</Text>
        </RectButton>
      </Animated.View>
      <Animated.View style={[styles.rowAction, {opacity: showRightAction}]}>
        <RectButton
          style={[styles.rowAction, styles.rightAction]}
          onPress={reset}>
          <Text style={styles.actionButtonTextRed}>Rejected</Text>
        </RectButton>
      </Animated.View>
      <PanGestureHandler
        activeOffsetX={[-10, 10]}
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}>
        <Animated.View
          style={{
            backgroundColor: 'white',
            transform: [{translateX: transX}],
          }}
          onLayout={onLayout}>
          {children}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const InfoButton = props => (
  <RectButton
    {...props}
    style={styles.infoButton}
    onPress={() => alert(`${props.name} info button clicked`)}>
    <View style={styles.infoButtonBorders}>
      <Text style={styles.infoButtonText}>i</Text>
    </View>
  </RectButton>
);

const Example = () => {
  const dragboxRef = useRef(null);
  const imagePinchRef = useRef(null);
  const imageRotationRef = useRef(null);
  const imageTiltRef = useRef(null);

  return (
    <View style={styles.container}>
      <ScrollView
        waitFor={[dragboxRef, imagePinchRef, imageRotationRef, imageTiltRef]}
        style={styles.scrollView}>
        <Swipeable item="First Item">
          <RectButton
            style={styles.rectButton}
            onPress={() => alert('First row clicked')}>
            <Text style={styles.buttonText}>
              Swipe this row & observe highlight delay
            </Text>
            <InfoButton name="first" />
          </RectButton>
        </Swipeable>
        <View style={styles.buttonDelimiter} />
        <RectButton
          style={styles.rectButton}
          onPress={() => alert('Second row clicked')}>
          <Text style={styles.buttonText}>
            Second info icon will block scrolling
          </Text>
          <InfoButton disallowInterruption name="second" />
        </RectButton>
        <View style={styles.buttonDelimiter} />
        <RectButton
          rippleColor="red"
          style={styles.rectButton}
          onPress={() => alert('Third row clicked')}>
          <Text style={styles.buttonText}>
            This one will cancel when you drag outside
          </Text>
          <InfoButton shouldCancelWhenOutside name="third" />
        </RectButton>
        <View style={styles.buttonDelimiter} />
        <Swipeable item="Fourth Item">
          <RectButton
            enabled={false}
            style={styles.rectButton}
            onPress={() => alert('Fourth row clicked')}>
            <Text style={styles.buttonText}>
              This row is "disabled" but you can swipe it
            </Text>
            <InfoButton name="fourth" />
          </RectButton>
        </Swipeable>
        <View style={styles.buttonDelimiter} />
        <Swipeable item="Proper Item">
          <RectButton
            style={styles.rectButton}
            onPress={() => alert('Proper row clicked')}>
            <Text style={styles.buttonText}>Proper row</Text>
            <InfoButton name="proper" />
          </RectButton>
        </Swipeable>
        <LongPressGestureHandler
          onHandlerStateChange={({nativeEvent}) =>
            nativeEvent.state === State.ACTIVE && alert('Long')
          }>
          <RectButton
            rippleColor="red"
            style={styles.rectButton}
            onPress={() => alert('Fifth row clicked')}>
            <Text style={styles.buttonText}>
              Clickable row with long press handler
            </Text>
          </RectButton>
        </LongPressGestureHandler>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rectButton: {
    flex: 1,
    height: 60,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  rowAction: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftAction: {
    backgroundColor: '#d4f7de',
  },
  rightAction: {
    backgroundColor: '#f9d2d2',
  },
  actionButtonTextGreen: {
    color: '#309c4d',
    fontSize: 16,
    fontWeight: '700',
  },
  actionButtonTextRed: {
    color: '#e33535',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDelimiter: {
    height: 1,
    backgroundColor: '#999',
  },
  buttonText: {
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    color: 'black',
  },
  infoButton: {
    width: 40,
    height: 40,
  },
  infoButtonBorders: {
    borderColor: '#467AFB',
    borderWidth: 2,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    margin: 10,
  },
  infoButtonText: {
    color: 'black',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
});

export default Example;
