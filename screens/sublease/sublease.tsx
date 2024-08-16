import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {logger} from 'react-native-logs';
import { styles } from '../../styles/subleasestyles';
import ViewPost from '../../components/PostFlow/viewpost';
import MakePost from '../../components/PostFlow/makepost';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

type SubleaseFormRouteProp = RouteProp<{ params: { defaultView?: string } }, 'params'>;

var log = logger.createLogger();
const SubleaseForm = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<SubleaseFormRouteProp>();
  const defaultView = route.params?.defaultView || 'makePosts';
  
  const [activeButton, setActiveButton] = useState<string>(defaultView);

  useEffect(() => {
    if (defaultView) {
      setActiveButton(defaultView);
    }
  }, [defaultView]);

  const handleButtonPress = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  const renderContent = () => {
    if (activeButton === 'viewPosts') {
      return <ViewPost />;
    } else if (activeButton === 'makePosts') {
      return <MakePost />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.buttonOutline}>
          <TouchableOpacity
            style={[
              styles.button,
              activeButton === 'viewPosts' ? styles.activeButton : styles.inactiveButton,
            ]}
            onPress={() => handleButtonPress('viewPosts')}
          >
            <Text
              style={[
                styles.buttonText,
                activeButton === 'viewPosts' ? styles.activeButtonText : styles.inactiveButtonText,
              ]}
            >
              View Posts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              activeButton === 'makePosts' ? styles.activeButton : styles.inactiveButton,
              styles.buttonRight,
            ]}
            onPress={() => handleButtonPress('makePosts')}
          >
            <Text
              style={[
                styles.buttonText,
                activeButton === 'makePosts' ? styles.activeButtonText : styles.inactiveButtonText,
              ]}
            >
              Make Posts
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.contentContainer}>{renderContent()}</View>
      </View>
    </SafeAreaView>
  );
};

export default SubleaseForm;
