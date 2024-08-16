import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {styles} from '../../styles/subleasestyles';
import {useDispatch} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {AppDispatch} from '../../redux/store';
import {PostButton} from '../PostButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import {cities} from '../../constants/makepostflow/Cities';
import {states} from '../../constants/makepostflow/States';
import {Picker} from '@react-native-picker/picker';
import {PostFormState, postForm} from '../../redux/features/postSlice';
import Slider from '@react-native-community/slider';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
interface LookingFormProps {
  category: string;
}
export const LookingForm: React.FC<LookingFormProps> = ({category}) => {
  const dispatch: AppDispatch = useDispatch();
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [dateError, setDateError] = useState('');
  const [cityError, setCityError] = useState('');
  const [stateError, setStateError] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateText, setDateText] = useState('');
  const {width: windowWidth} = useWindowDimensions();
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [price, setPrice] = useState(0);
  const handleValueChange = value => {
    setPrice(value);
  };
  const navigation = useNavigation<StackNavigationProp<any>>();

  useEffect(() => {
    setTitleError('');
    setDescriptionError('');
    setDateError('');
    setCityError('');
    setStateError('');
  }, []);
  const validateForm = () => {
    let valid = true;
    if (!title.trim()) {
      setTitleError('Please enter the title.');
      valid = false;
    } else if (title.trim().length > 100) {
      setTitleError('Title should not exceed 100 characters.');
      valid = false;
    }
    if (!description.trim() || description.trim().split(/\s+/).length < 20) {
      setDescriptionError('Description must be at least 20 words.');
      valid = false;
    }
    if (!dateText) {
      setDateError('Please select a date.');
      valid = false;
    }
    if (!selectedCity) {
      setCityError('Please select a city.');
      valid = false;
    }
    if (!selectedState) {
      setStateError('Please select a state.');
      valid = false;
    }
    return valid;
  };
  const handleFormSubmitLooking = () => {
    let valid = true;
    if (validateForm()) {
      const postData: PostFormState = {
        uid: 'test',
        category: category,
        categoryType: 'Looking',
        imgUrl: [''],
        titleOfPost: title,
        postDescription: description,
        address: {
          streetNameNumber: '',
          apartMent: '',
          city: selectedCity,
          state: selectedState,
          zipcode: '123',
          lat: 0,
          long: 0,
        },
        availableFrom: selectedDate,
        rent: 0,
        apartmentType: '',
        facilities: ['', ''],
        priceFrom: 0,
        priceTo: price,
        isDelete: false,
        loading: false,
        error: null,
      };
      dispatch(postForm(postData))
        .unwrap()
        .then((originalPromiseResult: any) => {
          console.log('Form submitted successfully:', originalPromiseResult);
          Alert.alert('Success', 'Form submitted successfully');
          setTitle('');
          setDescription('');
          setSelectedCity('');
          setSelectedState('');
          setDateText('');
          setSelectedDate(new Date());
          setPrice(0);
          navigation.navigate('Screens/Dashboard/YourPosts',{ fromMakePost: true });
        })
        .catch((rejectedValueOrSerializedError: any) => {
          console.error(
            'Failed to submit the form:',
            rejectedValueOrSerializedError,
          );
          Alert.alert('Error', 'Failed to submit form. Please try again.');
        });
    }
  };
  return (
    <View style={styles.AMformContainer}>
      <Text style={styles.AMformHeading}>
        Title of the post<Text style={styles.requiredAsterisk}>*</Text>
      </Text>
      <View style={styles.AMinputContainer}>
        <TextInput
          style={styles.AMinput}
          placeholder="Enter Title"
          placeholderTextColor="gray"
          value={title}
          onChangeText={text => {
            setTitle(text);
            if (text.trim()) setTitleError('');
          }}
        />
        {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}
      </View>
      <Text style={styles.AMformHeading}>
        Post Description<Text style={styles.requiredAsterisk}>*</Text>
        <Text style={styles.ministyle}>(Minimum 20 words)</Text>
      </Text>
      <View style={styles.AMdescinputContainer}>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Enter Description"
          placeholderTextColor="gray"
          value={description}
          multiline={true}
          numberOfLines={4}
          onChangeText={text => {
            setDescription(text);
            if (text.trim()) setDescriptionError('');
          }}
        />
        {descriptionError ? (
          <Text style={styles.errorText}>{descriptionError}</Text>
        ) : null}
      </View>
      <Text style={styles.AMformlookHeading}>
        Looking<Text style={styles.requiredAsterisk}>*</Text>
      </Text>
      <View style={styles.dateInputContainer}>
  <TouchableOpacity
    onPress={() => setShowDatePicker(true)}
    style={styles.dateTouchable}>
    <TextInput
      style={styles.dateInput}
      placeholder="From"
      placeholderTextColor="gray"
      value={dateText}
      editable={false} // Prevents manual editing
    />
    <Image
      source={require('../../assets/icons/calendar.png')}
      style={styles.calendarIcon}
    />
  </TouchableOpacity>
</View>
      {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) {
              setSelectedDate(date);
              setDateText(date.toDateString());
              setDateError('');
              console.log('Selected Date:', date);
            }
          }}
        />
      )}
      <Text style={styles.AMformHeading}>
        Select City<Text style={styles.requiredAsterisk}>*</Text>
      </Text>
      <View style={styles.AddressinputContainercity}>
        <TextInput
          style={styles.AMinput}
          placeholder="Enter City"
          placeholderTextColor="gray"
          value={selectedCity}
          onChangeText={text => {
            setSelectedCity(text);
            if (text.trim()) setCityError('');
          }}
        />
        {cityError ? <Text style={styles.errorText}>{cityError}</Text> : null}
      </View>
      <Text style={styles.AMstateformHeading}>
        Select State<Text style={styles.requiredAsterisk}>*</Text>
      </Text>
      <View style={styles.pickerWithIcon}>
        <Picker
          selectedValue={selectedState}
          onValueChange={(itemValue, itemIndex) => {
            setSelectedState(itemValue);
            if (itemValue) {
              setStateError('');
            }
          }}
          style={styles.pickerstate}
          itemStyle={styles.pickerstateForIOS}>
          {states.map((state, index) => (
            <Picker.Item key={index} label={state.label} value={state.value} />
          ))}
        </Picker>
        {stateError ? (
          <Text style={styles.errorText2}>{stateError}</Text>
        ) : null}
      </View>
      <Text style={styles.AMformHeading}>Price Range</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={4000}
        step={10}
        value={price}
        onValueChange={handleValueChange}
        minimumTrackTintColor="#2441D0"
        maximumTrackTintColor="#2441D0"
        thumbTintColor="#2441D0"
      />
      <View style={styles.rangeLabelContainer}>
        <Text style={styles.rangeLabelText}>${price}</Text>
      </View>
      <PostButton onPress={handleFormSubmitLooking} label={'Post'} />
    </View>
  );
};
