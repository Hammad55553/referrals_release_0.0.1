import React from 'react';
import {Image, StyleSheet, Text, View, Dimensions, TouchableOpacity} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import HomeDrawerContent, {
  DrawerItem,
} from '../../components/drawer/Home/HomeDrawerContent';
import MessageHome from '../messaging/messageHome';
import Settings from '../../components/settingsScreen/Settings.tsx';
import Dashboard from './Dashboard/dashboard.tsx';
import SubleaseForm from '../sublease/sublease.tsx';
import HomeScreen from './home.tsx';
import {logger} from 'react-native-logs';
import { LoggedInUserState } from '../../redux/features/authSlice.ts';
import { RootState } from '../../redux/store.ts';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

var log = logger.createLogger();

function DrawerContent(props: DrawerContentComponentProps) {
  const group1: DrawerItem[] = [
    {
      label: 'Home',
      route: 'Home',
      icon: (
        <Image source={require('../../assets/images/icons/sidenav/home.png')} />
      ),
    },
    {
      label: 'Dashboard',
      route: 'Dashboard',
      icon: (
        <Image
          source={require('../../assets/images/icons/sidenav/dashboard.png')}
        />
      ),
    },
    {
      label: 'Sublease rental',
      route: 'SubleaseRental',
      icon: (
        <Image
          source={require('../../assets/images/icons/sidenav/sublease.png')}
        />
      ),
      params: {defaultView: 'viewPosts'},
    },
    {
      label: 'Messages',
      route: 'Messages',
      icon: (
        <Image
          source={require('../../assets/images/icons/sidenav/message.png')}
        />
      ),
    },
    {
      label: 'Referral',
      route: 'Referral',
      icon: (
        <Image source={require('../../assets/images/icons/sidenav/referral.png')} tintColor='grey' />
      ),
    },
  ];
  const group2: DrawerItem[] = [
    {
      label: 'Notifications',
      route: 'Notifications',
      icon: (
        <Image
          source={require('../../assets/images/icons/sidenav/notification_bell.png')}
        />
      ),
    },
    {
      label: 'Privacy',
      route: 'Privacy',
      icon: (
        <Image
          source={require('../../assets/images/icons/sidenav/privacy.png')}
        />
      ),
    },
    {
      label: 'Settings',
      route: 'Settings',
      icon: (
        <Image
          source={require('../../assets/images/icons/sidenav/settings.png')}
        />
      ),
    },
  ];
  return <HomeDrawerContent {...props} group1={group1} group2={group2} />;
}

// Logic to set drawer width to 90% of screen width
const screenWidth = Dimensions.get('window').width;
const drawerWidth = 0.9 * screenWidth;

export default function HomeDrawer() {
  const Drawer = createDrawerNavigator();
  const navigation = useNavigation();

  const loggedInUser: LoggedInUserState = useSelector(
    (state: RootState) => state.auth.loggedInUser,
  );

  function CustomHeader() {
    return (
      <View style={{ 
        justifyContent: "space-between",
        flexDirection: "row",
        width: "100%",
        }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10
            }}
          >
            <Text style={{
              fontSize: 22,
              fontFamily: 'HelveticaNowDisplay-Medium',
            }}>
              VibeSea
            </Text>
            <Image
              source={require("../../assets/images/vibesea_logo_1.png")}
              style={{
                width: 25,
                height: 25
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 15
            }}
          >
            <Image
              source={require("../../assets/icons/notification_read.png")}
              style={{
                width: 20,
                height: 20
              }}
            />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Profile/View' as never);
              }}>
              <Image
                source={{
                  uri:
                    loggedInUser.picture ||
                    'https://avatar.iran.liara.run/public/boy?username=Ash',
                }}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#000000',
                }}/>
              </TouchableOpacity>
          </View>
      </View>
    )
  }

  //comment added to check ios deployment

  return (
    <View style={styles.container}>
      <Drawer.Navigator
        drawerContent={DrawerContent}
        screenOptions={{
          drawerStyle: {width: drawerWidth},
          headerTitleAlign: "left",
          headerTitleContainerStyle: {
            left: 0,
            right: 0,
            padding: 0,
            margin: 0,
            width: "100%"
          },
          headerLeftContainerStyle: {
            marginRight: -10,
          }
        }}>
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerTitle: () => CustomHeader()}}/>
        <Drawer.Screen 
          name="Dashboard"
          component={Dashboard} 
          options={{ headerTitle: () => CustomHeader()}}/>
        <Drawer.Screen
          name="SubleaseRental"
          component={SubleaseForm}
          initialParams={{defaultView: 'viewPosts'}}
          options={{ headerTitle: () => CustomHeader()}}
        />
        <Drawer.Screen
          name="Messages"
          component={MessageHome} 
          options={{ headerTitle: () => CustomHeader()}}/>
        <Drawer.Screen name="Referral" component={MessageHome} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
        <Drawer.Screen name="Privacy" component={PrivacyScreen} />
        <Drawer.Screen name="Settings" component={Settings} />
      </Drawer.Navigator>
    </View>
  );
}

// Dummy component
function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <Text>Notifications</Text>
    </View>
  );
}

// Dummy component
function PrivacyScreen() {
  return (
    <View style={styles.container}>
      <Text>Privacy</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
