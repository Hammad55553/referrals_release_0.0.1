import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'; 
import Icon from 'react-native-vector-icons/MaterialIcons';
import ModalDropdown from 'react-native-modal-dropdown';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LoggedInUserState } from '../../redux/features/authSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';

const EditProfile = () => {
  const navigation = useNavigation();

  const loggedInUser: LoggedInUserState = useSelector(
    (state: RootState) => state.auth.loggedInUser,
  );
  const [country, setCountry] = useState('Country');
  const [gender, setGender] = useState('Gender');
  const [city, setCity] = useState('City');
  const [state, setState] = useState('State');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [instagramUrl, setInstagramUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [instagramError, setInstagramError] = useState('');
  const [linkedinError, setLinkedinError] = useState('');
  const [firstName, setFirstName] = useState(loggedInUser.firstName || '');
  const [lastName, setLastName] = useState(loggedInUser.lastName || '');
  const [profileImageUri, setProfileImageUri] = useState(loggedInUser.picture || '');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [school, setSchool] = useState('');
  const [workplace, setWorkplace] = useState('');
  const [dateText, setDateText] = useState('');

  const handleSave = async () => {
    try {
      const response = await fetch(`https://acea-59-103-217-174.ngrok-free.app/profiles/66b60e888c18bcf765f3cfb1`, {
        method: 'PUT',  // Changed from POST to PUT
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          country,
          city,
          state,
          gender,
          school, // Replace with actual value
          birthDate: selectedDate,
          workplace, // Replace with actual value
          Instagram: instagramUrl,
          linkedin: linkedinUrl,
        }),
      });
  
      if (response.ok) {
        Alert.alert('Success', 'Profile updated successfully');
        navigation.navigate('Profile/View' as never);
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating profile');
      console.error('Error:', error);
    }
  };
  





  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          if (response.assets && response.assets.length > 0) {
            const { uri } = response.assets[0];
            if (uri) {
              setProfileImageUri(uri);
            } else {
              console.log('Image URI is undefined');
            }
          } else {
            console.log('No assets found in response');
          }
        }
      }
    );
  };

  const validateUrl = (url: string, type: 'instagram' | 'linkedin') => {
    let urlPattern;
    if (type === 'instagram') {
      urlPattern = /^(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9._-]+\/?$/;
    } else if (type === 'linkedin') {
      urlPattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/;
    }
    
    if (!urlPattern.test(url)) {
      if (type === 'instagram') {
        setInstagramError('Please enter a valid Instagram URL');
      } else {
        setLinkedinError('Please enter a valid LinkedIn URL');
      }
    } else {
      if (type === 'instagram') {
        setInstagramError('');
      } else {
        setLinkedinError('');
      }
    }
  };
  

  const onFirstNameChange = (firstName: string) => {
    setFirstName(firstName);
  };

  const onLastNameChange = (lastName: string) => {
    setLastName(lastName);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = format(selectedDate, 'MM/dd/yyyy');
      setSelectedDate(selectedDate);
      setDateText(formattedDate);
      console.log('Selected Date:', formattedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  }
                }}
                style={styles.backButton}
              >
                <Icon name="arrow-back" size={wp('6%')} color="#000" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Edit Profile</Text>
            </View>

            <View style={styles.profileInfo}>
              <TouchableOpacity onPress={pickImage}>
                <Image
                  source={{
                    uri: profileImageUri || 'https://avatar.iran.liara.run/public/boy?username=Ash',
                  }}
                  style={styles.profileImage}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="First name"
                placeholderTextColor="#888"
                value={firstName}
                onChangeText={onFirstNameChange}
                clearButtonMode="while-editing"
              />
              <TextInput
                style={styles.input}
                placeholder="Last name"
                placeholderTextColor="#888"
                value={lastName}
                onChangeText={onLastNameChange}
              />

              <View style={styles.rowContainer}>
                <ModalDropdown
                  options={[
                    'Country',
                    'United States of America',
                    'India',
                    'Canada',
                    'Australia',
                  ]}
                  defaultValue={'Country'}
                  style={styles.dropdown}
                  textStyle={styles.dropdownText}
                  dropdownStyle={styles.dropdownStyle}
                  onSelect={(index, value: string) => setCountry(value)}
                  renderRightComponent={() => (
                    <Icon name="arrow-drop-down" size={wp('5%')} color="#888" />
                  )}
                />
                <ModalDropdown
                  options={['Gender', 'Male', 'Female', 'Other']}
                  defaultValue={'Gender'}
                  style={styles.dropdown}
                  textStyle={styles.dropdownText}
                  dropdownStyle={styles.dropdownStyle}
                  onSelect={(index, value: string) => setGender(value)}
                  renderRightComponent={() => (
                    <Icon name="arrow-drop-down" size={wp('5%')} color="#888" />
                  )}
                />
              </View>

              <View style={styles.rowContainer}>
                <ModalDropdown
                  options={['City', 'City 1', 'City 2']}
                  defaultValue={'City       '}
                  style={styles.dropdown}
                  textStyle={styles.dropdownText}
                  dropdownStyle={styles.dropdownStyle}
                  onSelect={(index, value: string) => setCity(value)}
                  renderRightComponent={() => (
                    <Icon name="arrow-drop-down" size={wp('5%')} color="#888" />
                  )}
                />
                <ModalDropdown
                  options={['State', 'State 1', 'State 2']}
                  defaultValue={'State    '}
                  style={styles.dropdown}
                  textStyle={styles.dropdownText}
                  dropdownStyle={styles.dropdownStyle}
                  onSelect={(index, value: string) => setState(value)}
                  renderRightComponent={() => (
                    <Icon name="arrow-drop-down" size={wp('5%')} color="#888" />
                  )}
                />
              </View>

              <TextInput
                style={styles.input}
                placeholder="School"
                placeholderTextColor="#888"
                value={school}
                onChangeText={setSchool}
              />
              <TextInput
                style={styles.input}
                placeholder="Workplace"
                placeholderTextColor="#888"
                value={workplace}
                onChangeText={setWorkplace}
              />
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {dateText || 'Select Date of Birth'}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onDateChange}
                />
              )}

              <TextInput
                style={styles.input}
                placeholder="Instagram profile URL"
                placeholderTextColor={'#888'}
                value={instagramUrl}
                onChangeText={text => {
                  setInstagramUrl(text);
                  validateUrl(text, 'instagram');
                }}
              />
              {instagramError ? (
                <Text style={styles.errorText}>{instagramError}</Text>
              ) : null}

              <TextInput
                style={styles.input}
                placeholder="LinkedIn URL"
                placeholderTextColor={'#888'}
                value={linkedinUrl}
                onChangeText={text => {
                  setLinkedinUrl(text);
                  validateUrl(text, 'linkedin');
                }}
              />
              {linkedinError ? (
                <Text style={styles.errorText}>{linkedinError}</Text>
              ) : null}
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
    paddingBottom: hp('10%'),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: hp('2%'),
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('2%'),
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: wp('2%'),
    borderRadius: wp('2%'),
    borderColor: 'lightgrey',
    borderWidth: 1,
  },
  headerTitle: {
    right: wp(8),
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginLeft: wp('4%'),
    flex: 1,
    textAlign: 'center',
    color: '#000',
  },
  profileInfo: {
    alignItems: 'center',
    padding: wp('4%'),
  },
  profileImage: {
    width: wp('25%'),
    height: wp('25%'),
    borderRadius: wp('12.5%'),
    marginBottom: hp('1%'),
    borderWidth: 2,
    borderColor: '#FF6347',
  },
  formContainer: {
    padding: wp('4%'),
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1.5%'),
    marginBottom: hp('2%'),
    fontSize: wp('4%'),
    color: 'gray',
    textAlignVertical: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
  },
  dropdown: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: wp('2%'),
    padding: wp('3%'),
    height: hp('6%'),
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  dropdownText: {
    fontSize: wp('4%'),
    color: '#888',
    marginRight: 90,
  },
  dropdownStyle: {
    width: '50%',
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: wp('2%'),
    padding: wp('3%'),
    marginBottom: hp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: wp('4%'),
    color: 'gray',
  },
  saveButton: {
    backgroundColor: '#4285F4',
    padding: wp('4%'),
    borderRadius: wp('2%'),
    margin: wp('4%'),
    alignItems: 'center',
    position: 'absolute',
    bottom: hp('2%'),
    left: 0,
    right: 0,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wp('4%'),
  },
  errorText: {
    color: '#FF6347',
    fontSize: wp('3%'),
    marginTop: hp('-1%'),
    marginBottom: hp('1%'),
  },
});

export default EditProfile;
