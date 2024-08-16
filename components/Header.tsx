import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Image} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import InitialsAvatar from './InitialsAvatar';

interface HeaderNavProps {
  firstName: string;
  lastName: string;
}
const HeaderNav: React.FC<HeaderNavProps> = ({firstName, lastName}) => {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const toggleNavPanel = () => {
    setIsNavVisible(!isNavVisible);
  };
  const goToHome = () => {};
  const goToNotifications = () => {
    // Assuming you have a Notifications screen
  };
  const goToProfile = () => {
    // Assuming you have a Profile screen
  };
  return (
    // <SafeAreaView>
    <View>
      <View style={styles.container}>
        <View style={styles.left}>
          <TouchableOpacity style={styles.backButton} onPress={toggleNavPanel}>
            <View style={styles.iconContainer}>
              <Image
                source={require('../assets/icons/burgermenu.png')}
                style={styles.iconLeft}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoContainer} onPress={goToHome}>
            <Text style={styles.lT}>VibeSea</Text>
            <View style={styles.logoImage}>
              <Image
                source={require('../assets/icons/VibeSeaLogo.png')}
                style={styles.logo}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.right}>
          <TouchableOpacity onPress={goToNotifications}>
            <Image
              source={require('../assets/icons/bellicon.png')}
              style={styles.notification}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={goToProfile} style={styles.profile}>
            {/* Replace with InitialsAvatar */}
            <InitialsAvatar
              firstName={firstName}
              lastName={lastName}
              size={24}
            />
          </TouchableOpacity>
        </View>
      </View>
      {isNavVisible && (
        <View style={styles.navigationPanel}>
          <Text>Navigation Panel</Text>
          {/* Add your navigation panel content here */}
        </View>
      )}
    </View>
    // </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  left: {flexDirection: 'row'},
  right: {flexDirection: 'row', alignItems: 'center'},
  backButton: {},
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLeft: {
    width: 24,
    height: 24,
    tintColor: '#000000',
  },
  navigationPanel: {
    position: 'absolute',
    top: 50, // Adjust according to your layout
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  logoContainer: {
    marginLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lT: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 24,
  },
  logo: {
    width: 20,
    height: 20,
  },
  logoImage: {
    marginLeft: 8,
  },
  notification: {
    width: 24,
    height: 24,
  },
  profile: {
    width: 24,
    height: 24,
    marginLeft: 12,
  },
});
export default HeaderNav;
