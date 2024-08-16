import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
 Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Linking} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {LoggedInUserState} from '../../redux/features/authSlice';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {RootState} from '../../redux/reducers';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const openLink = (url: string) => {
  Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
};

const ViewProfile = () => {
  const navigation = useNavigation();

  const loggedInUser: LoggedInUserState = useSelector(
    (state: RootState) => state.auth.loggedInUser,
  );


  

    const [profile, setProfile] = useState({
      firstName: '',
      picture: '',
      gender: '',
      Instagram: '',
      linkedin: '',
      school: '',
      workplace: '',
      location: '',
      phone: '',
    });
  
    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const response = await axios.get('https://acea-59-103-217-174.ngrok-free.app/profiles/66b71e85f58f8ff4531fe5ec');
          setProfile(response.data);
        } catch (error) {
          Alert.alert('Error', 'Failed to fetch profile data');
          console.error('Error:', error);
        }
      };
  
      fetchProfile();
    }, []);
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              }
            }}
            style={styles.backButton}>
            <Icon name="arrow-back" size={wp('6%')} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.profileInfo}>
          <Image
            source={{
              uri: loggedInUser.picture || 'https://placekitten.com/250/250',
            }}
            style={styles.profileImage}
          />
          <View style={styles.locationContainer}>
            <Icon name="location-on" size={wp('4%')} color="#666" />
            <Text style={styles.locationText}>New Delhi, Delhi, India</Text>
          </View>
          <Text style={styles.name}>{loggedInUser.firstName}</Text>
          <Text style={styles.age}>18y</Text>

          <View style={styles.socialIcons}>
            <TouchableOpacity
              onPress={() => openLink(profile.Instagram)}>
              <MaterialCommunityIcons
                name="instagram"
                size={wp('6%')}
                color="#C13584"
                style={styles.socialIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openLink(profile.linkedin)}>
              <MaterialCommunityIcons
                name="linkedin"
                size={wp('6%')}
                color="#0077B5"
                style={styles.socialIcon}
              />
            </TouchableOpacity>
          </View>

          {[
  { icon: 'female', text: profile.gender || 'Gender not provided' },
  // { icon: 'phone', text: profile.phone || 'Phone number not provided' },
  { icon: 'school', text: profile.school || 'School not provided' },
  { icon: 'work', text: profile.workplace || 'Workplace not provided' }
].map((item, index) => (
  <View key={index} style={styles.infoItem}>
    <Icon name={item.icon} size={wp('5%')} color="#666" />
    <Text style={styles.infoText}>{item.text}</Text>
  </View>
))}
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Profile/setupProfile' as never);
        }}
        style={styles.updateButton}>
        <Text style={styles.updateButtonText}>Update Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: hp('4%'),
    padding: wp('4%'),
    backgroundColor: '#e8eeff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: hp('2.5%'),
    left: wp('4%'),
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('2.5%'),
    borderWidth: 1,
    borderColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8eeff',
  },
  headerTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#000',
  },
  profileInfo: {
    // alignItems: 'center',
    padding: wp('4%'),
    backgroundColor: '#e8eeff',
    height: wp(43),
  },
  profileImage: {
    top: wp(25),
    width: wp('25%'),
    height: wp('25%'),
    borderRadius: wp('12.5%'),
    marginBottom: hp('2%'),
    borderWidth: 1,
    borderColor: 'blue',
  },
  locationContainer: {
    top: wp(15),
    left: wp(53),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  locationText: {
    marginLeft: wp('1%'),
    color: '#666',
  },
  name: {
    top: wp(20),
    left: wp(2),
    fontSize: wp('6%'),
    fontWeight: 'bold',
    marginBottom: hp('0.5%'),
    color: '#000',
  },
  age: {
    top: wp(14),
    left: wp(26),
    fontSize: wp('3.5%'),
    color: 'gray',
  },
  socialIcons: {
    left: wp(70),
    top: wp(9),
    flexDirection: 'row',
    marginBottom: hp('2%'),
  },
  socialIcon: {
    marginHorizontal: wp('2%'),
  },
  infoItem: {
    top: wp(10),
    left: wp(2),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
    width: '80%',
    // justifyContent: 'center',
  },
  infoText: {
    marginLeft: wp('2%'),
    fontSize: wp('4%'),
    color: '#666',
  },
  updateButton: {
    backgroundColor: '#4285F4',
    padding: wp('4%'),
    borderRadius: wp('2%'),
    margin: wp('4%'),
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wp('4%'),
  },
});

export default ViewProfile;
