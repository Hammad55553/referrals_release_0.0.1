// BottomNav.tsx
import React from 'react';
import { View, ImageSourcePropType } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native-elements';
import Login from '../screens/authentication/login';
import MessageHome from '../screens/messaging/messageHome';
import SubleaseForm from '../screens/sublease/sublease';

const Tab = createBottomTabNavigator();

interface CustomTabIconProps {
  source: ImageSourcePropType;
  focused: boolean;
}

const CustomTabIcon: React.FC<CustomTabIconProps> = ({ source, focused }) => (
  <View
    style={{
      backgroundColor: focused ? '#2441D0' : 'transparent',
      borderRadius: 13,
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginTop: 10,
    }}
  >
    <Image
      source={source}
      style={{
        width: 24.72,
        height: 24.72,
        tintColor: focused ? '#FFFFFF' : '#0030CC',
      }}
    />
  </View>
);

const BottomNav = () => {
  return (
    <Tab.Navigator
      initialRouteName="Auth/Login"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'white',
          width: '90%',
          height: 70,
          alignSelf: 'center',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#ECECEC80',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Auth/Login"
        component={Login}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <CustomTabIcon source={require('../assets/icons/Home.png')} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Screens/subleaseForm"
        component={SubleaseForm}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <CustomTabIcon source={require('../assets/icons/sublease.png')} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Messaging/Home"
        component={MessageHome}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <CustomTabIcon source={require('../assets/icons/MoreSquare.png')} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNav;