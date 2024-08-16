import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import HomeDrawerItem from './HomeDrawerItem.tsx';
import {LoggedInUserState} from '../../../redux/features/authSlice.ts';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store.ts';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

export interface DrawerItem {
  label: string;
  route: string;
  icon: React.ReactNode;
  params?: any;
}

export interface HomeDrawerContentProps extends DrawerContentComponentProps {
  group1: DrawerItem[];
  group2: DrawerItem[];
}

/**
 * This is the full drawer content for the home screen
 * @param p - HomeDrawerContentProps type containing information about the drawer items and the props from react native's base drawer navigation
 * @constructor
 */
export default function HomeDrawerContent(p: HomeDrawerContentProps) {
  const navigation = useNavigation();
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const loggedInUser: LoggedInUserState = useSelector(
    (state: RootState) => state.auth.loggedInUser,
  );
  const {group1, group2, ...props} = p;

  const handleSelect = (label: string) => {
    setSelectedLabel(label);
  };

  return (
    <DrawerContentScrollView {...props}>
      <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
        <Image
          source={require('../../../assets/images/back.png')}
          style={styles.backButton}
        />
      </TouchableOpacity>
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri:
              loggedInUser.picture ||
              'https://avatar.iran.liara.run/public/boy?username=Ash',
          }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{loggedInUser.firstName}</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Profile/View' as never);
          }}>
          <Image
            source={require('../../../assets/icons/edit_profile.png')}
            style={styles.profileEditIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.profileContainer}>
        <Text style={styles.groupHeading}>Account</Text>
      </View>
      {group1.map((item, index) => (
        <HomeDrawerItem
          key={index}
          label={item.label}
          onPress={() => props.navigation.navigate(item.route)}
          icon={item.icon}
          selected={selectedLabel === item.label}
          onSelect={() => handleSelect(item.label)}
        />
      ))}
      <View style={styles.profileContainer}>
        <Text style={styles.groupHeading}>More</Text>
      </View>
      {group2.map((item, index) => (
        <HomeDrawerItem
          key={index}
          label={item.label}
          onPress={() => props.navigation.navigate(item.route)}
          icon={item.icon}
          selected={selectedLabel === item.label}
          onSelect={() => handleSelect(item.label)}
        />
      ))}
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 20,
    marginTop: 20,
  },
  profileContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#000000',
    borderStyle: 'solid',
  },
  profileEditIcon: {
    width: 24,
    height: 24,
    marginLeft: 180,
    justifyContent: 'flex-end',
  },
  profileName: {
    marginLeft: 10,
    fontSize: 14.69,
    fontWeight: 'bold',
    color: '#242424',
  },
  groupHeading: {
    fontWeight: '400',
    fontFamily: 'Helvetica',
    color: '#88909F',
    fontSize: 14.69,
  },
});
