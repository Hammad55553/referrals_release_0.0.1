import React, { useState} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {logger} from 'react-native-logs';
import { styles } from '../../styles/subleasestyles';
import Friendship from './friendship';


var log = logger.createLogger();
const FriendshipFlow = () => {
  const [activeButton, setActiveButton] = useState('Friendship');
 

  const handleButtonPress = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  const renderContent = () => {
    if (activeButton === 'Friendship') {
      return <Friendship />;
    } else if (activeButton === 'Friendship++') {
      return <Friendship />;
    } else if (activeButton === 'Dating') {
      return <Friendship />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.buttonOutline}>
          <TouchableOpacity
            style={[
              styles.button,
              activeButton === 'Friendship' ? styles.activeButton : styles.inactiveButton,
            ]}
            onPress={() => handleButtonPress('Friendship')}
          >
            <Text
              style={[
                styles.buttonText,
                activeButton === 'Friendship' ? styles.activeButtonText : styles.inactiveButtonText,
              ]}
            >
              Friendship
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              activeButton === 'Friendship++' ? styles.activeButton : styles.inactiveButton,
              styles.buttonRight,
            ]}
            onPress={() => handleButtonPress('Friendship++')}
          >
            <Text
              style={[
                styles.buttonText,
                activeButton === 'Friendship++' ? styles.activeButtonText : styles.inactiveButtonText,
              ]}
            >
              Friendship++
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              activeButton === 'Dating' ? styles.activeButton : styles.inactiveButton,
              styles.buttonRight,
            ]}
            onPress={() => handleButtonPress('Dating')}
          >
            <Text
              style={[
                styles.buttonText,
                activeButton === 'Dating' ? styles.activeButtonText : styles.inactiveButtonText,
              ]}
            >
              Dating
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.contentContainer}>{renderContent()}</View>
      </View>
    </SafeAreaView>
  );
};

export default FriendshipFlow;
