import React, {useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  useWindowDimensions,
  TextInput,
  LogBox,
} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Alert} from 'react-native';
import {PostButton} from '../PostButton';
import Slider from '@react-native-community/slider';
import {
  PostFormState,
  generatePresignedURL,
  postForm,
} from '../../redux/features/postSlice';
import RNFS from 'react-native-fs';
import {
  launchImageLibrary,
  ImageLibraryOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';
import {cities} from '../../constants/makepostflow/Cities';
import {states} from '../../constants/makepostflow/States';
import {facilities} from '../../constants/makepostflow/Facilities';
import {apartmentTypes} from '../../constants/makepostflow/ApartmentTypes';
import {styles} from '../../styles/subleasestyles';
import {Picker} from '@react-native-picker/picker';
import {AppDispatch} from '../../redux/store';
import {useDispatch} from 'react-redux';
import {getFirebaseToken} from '../../redux/utils/getFirebaseToken';
import axios from 'axios';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';

interface OfferingFormProps {
  category: string;
}

export const OfferingForm: React.FC<OfferingFormProps> = ({category}) => {
  const dispatch: AppDispatch = useDispatch();
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [dateError, setDateError] = useState('');
  const [cityError, setCityError] = useState('');
  const [stateError, setStateError] = useState('');
  const [zipcodeError, setZipcodeError] = useState('');
  const [streetNameNumberError, setStreetNameNumberError] = useState('');
  const [apartmentNumberError, setApartmentNumberError] = useState('');
  const [apartmentTypeError, setApartmentTypeError] = useState('');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  const onSelectedFacilitiesChange = (selectedItems: string[]) => {
    setSelectedFacilities(selectedItems);
  };
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateText, setDateText] = useState('');
  const {width: windowWidth} = useWindowDimensions();
  const [title, setTitle] = useState('');
  const [streetNameNumber, setStreetNameNumber] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [apartmentType, setApartmentType] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [price, setPrice] = useState(0);
  const handleValueChange = value => {
    setPrice(value);
  };
  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleImagePicker = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };

    launchImageLibrary(options, async (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        if (asset.uri) {
          setSelectedImage(asset.uri);
          try {
            const token = await getFirebaseToken();
            const fileName = asset.fileName || 'defaultFileName.jpg';
            const fileType = asset.type || 'image/jpeg';
            const filePath = asset.uri.replace('file://', '');
            const presignedURL = await dispatch(
              generatePresignedURL({
                firebaseIDToken: token,
                fileName,
                fileType,
              }),
            ).unwrap();
            const cleanURL = presignedURL.data.split('?')[0];
            console.log('Presigned URL:', presignedURL.data);
            const fileContent = await RNFS.readFile(filePath, 'base64');
            const buffer = Buffer.from(fileContent, 'base64');

            try {
              const uploadResponse = await axios.put(
                presignedURL.data,
                buffer,
                {
                  headers: {
                    'Content-Type': fileType,
                  },
                },
              );

              console.log('response ', uploadResponse.status);
              if (uploadResponse.status === 200) {
                console.log('File uploaded successfully');
                setUploadedImageUrl(cleanURL); // Set the uploaded image URL here
              }
            } catch (error) {
              console.error('Error uploading image:', error);
            }
          } catch (error) {
            console.error('Error uploading image:', error);
          }
        }
      } else {
        console.log('No assets found');
      }
    });
  };

  const handleImageDelete = () => {
    setSelectedImage('');
  };

  const validateForm2 = () => {
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
    if (!zipcode) {
      setZipcodeError('Please enter a zipcode.');
      valid = false;
    }
    if (!apartmentType) {
      setApartmentTypeError('Please select a type.');
      valid = false;
    }
    if (!apartmentNumber) {
      setApartmentNumberError('Please enter an apartment number.');
      valid = false;
    }
    if (!streetNameNumber) {
      setStreetNameNumberError('Please enter a street name and number.');
      valid = false;
    }
    return valid;
  };

  const handleFormSubmitOffering = () => {
    if (validateForm2()) {
      const postData: PostFormState = {
        uid: 'test',
        category: category,
        categoryType: 'Offering',
        imgUrl: [uploadedImageUrl],
        titleOfPost: title,
        postDescription: description,
        address: {
          streetNameNumber: streetNameNumber,
          apartMent: apartmentNumber,
          city: selectedCity,
          state: selectedState,
          zipcode: zipcode,
          lat: 0,
          long: 0,
        },
        availableFrom: selectedDate,
        rent: 0,
        apartmentType: apartmentType,
        facilities: selectedFacilities.map(facilityName => facilityName),
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
          setSelectedDate(new Date());
          setDateText('');
          setSelectedCity('');
          setSelectedState('');
          setZipcode('');
          setApartmentType('');
          setStreetNameNumber('');
          setApartmentNumber('');
          setSelectedFacilities([]);
          setPrice(0);
          setSelectedImage('');
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
        Photo<Text style={styles.ministyle}>(Optional)</Text>
      </Text>
      {!selectedImage && (
        <TouchableOpacity
          onPress={handleImagePicker}
          style={styles.uploadButton}>
          <Image
            source={require('../../assets/icons/upload.png')}
            style={styles.uploadIcon}
          />
          <Text style={styles.uploadText}>Upload Image</Text>
        </TouchableOpacity>
      )}

      {selectedImage && (
        <View style={styles.imageContainer}>
          <Image source={{uri: selectedImage}} style={styles.image} />
          <TouchableOpacity
            onPress={handleImageDelete}
            style={styles.deleteButton}>
            <Image
              source={require('../../assets/icons/delete.png')}
              style={styles.deleteIcon}
            />
          </TouchableOpacity>
        </View>
      )}

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
          numberOfLines={10}
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
        Available<Text style={styles.requiredAsterisk}>*</Text>
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
      <Text style={styles.AMformlookHeading}>
        Address<Text style={styles.requiredAsterisk}>*</Text>
      </Text>
      <View style={styles.AddressinputContainer}>
        <TextInput
          style={styles.AMinput}
          placeholder="Street Name and Number"
          placeholderTextColor="gray"
          value={streetNameNumber}
          onChangeText={text => {
            setStreetNameNumber(text);
            if (text.trim()) setStreetNameNumberError('');
          }}
        />
        {streetNameNumberError ? (
          <Text style={styles.errorText}>{streetNameNumberError}</Text>
        ) : null}
      </View>
      <View style={styles.AddressinputContainer}>
        <TextInput
          style={styles.AMinput}
          placeholder="Apartment/Unit & its Number"
          placeholderTextColor="gray"
          value={apartmentNumber}
          onChangeText={text => {
            setApartmentNumber(text);
            if (text.trim()) setApartmentNumberError('');
          }}
        />
        {apartmentNumberError ? (
          <Text style={styles.errorText}>{apartmentNumberError}</Text>
        ) : null}
      </View>

      <View style={styles.AddressinputContainer}>
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

      <View style={styles.pickerWithIcon2}>
        <Picker
          selectedValue={selectedState}
          onValueChange={itemValue => {
            setSelectedState(itemValue);
            if (itemValue) {
              setStateError('');
            }
          }}
          style={styles.picker} //for android
          itemStyle={styles.pickerstate} //for IOS
        >
          {states.map((state, index) => (
            <Picker.Item key={index} label={state.label} value={state.value} />
          ))}
        </Picker>
        {stateError ? (
          <Text style={styles.errorText2}>{stateError}</Text>
        ) : null}
      </View>
      <View style={styles.AddressinputContainer}>
        <TextInput
          style={styles.AMinput}
          placeholder="Zip Code"
          placeholderTextColor="gray"
          value={zipcode}
          onChangeText={text => {
            setZipcode(text);
            if (text.trim()) setZipcodeError('');
          }}
        />
        {zipcodeError ? (
          <Text style={styles.errorText}>{zipcodeError}</Text>
        ) : null}
      </View>
      <Text style={styles.AMformlookHeading}>
        Apartment Type<Text style={styles.requiredAsterisk}>*</Text>
      </Text>
      <View style={styles.pickerWithIcon}>
        <Picker
          selectedValue={apartmentType}
          onValueChange={itemValue => {
            setApartmentType(itemValue);
            if (itemValue) {
              setApartmentTypeError('');
            }
          }}
          style={styles.pickercity} //for android
          itemStyle={styles.pickercity} //for IOS
          mode="dropdown">
          <Picker.Item label="Select" value="" />
          {apartmentTypes.map((type, index) => (
            <Picker.Item key={index} label={type} value={type} />
          ))}
        </Picker>
        {apartmentTypeError ? (
          <Text style={styles.errorText2}>{apartmentTypeError}</Text>
        ) : null}
      </View>
      <Text style={styles.AMformlookHeading}>
        Select Facilities<Text style={styles.ministyle}>(Optional)</Text>
      </Text>
      <View style={[styles.multiSelectContainer, {width: '100%'}]}>
        <MultiSelect
          items={facilities}
          uniqueKey="id"
          onSelectedItemsChange={onSelectedFacilitiesChange}
          selectedItems={selectedFacilities}
          selectText="Pick Facilities"
          searchInputPlaceholderText="Search Facilities..."
          onChangeInput={text => console.log(text)}
          tagRemoveIconColor="#CCC"
          tagBorderColor="#d3d3d3"
          tagTextColor="#2441D0"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#2441D0"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{color: '#CCC'}}
          submitButtonColor="#2441D0"
          submitButtonText="Submit"
          styleDropdownMenuSubsection={{
            borderBottomWidth: 0,
            borderBottomColor: 'transparent',
          }}
          styleDropdownMenu={{
            width: '100%',
            borderWidth: 1,
            borderColor: '#d3d3d3',
            borderRadius: 5,
            paddingHorizontal: 10,
            marginTop: -10,
            height: 50,
          }}
          styleTextDropdown={{
            textAlign: 'left', // Align text to the left
            paddingHorizontal: 10, // Add padding to the text
          }}
        />
      </View>
      <Text style={styles.AMformlookHeading}>
        Price Range<Text style={styles.ministyle}>(Optional)</Text>
      </Text>
      <View style={styles.sliderWrapper}>
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
      </View>
      <View style={styles.rangeLabelContainer}>
        <Text style={styles.rangeLabelText}>${price}</Text>
      </View>
      <PostButton onPress={handleFormSubmitOffering} label={'Post'} />
    </View>
  );
};
