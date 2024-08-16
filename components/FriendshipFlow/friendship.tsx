import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  View,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { styles } from '../../styles/subleasestyles';
import { viewPostStyles } from '../../styles/viewpoststyles';
import { states } from '../../constants/makepostflow/States';
import FriendshipNavigator from '../friendship_post_navigator';

export default function Friendship() {
  const genders = ['Male', 'Female', 'Other'];
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedState, setSelectedState] = useState('');

  const handleGenderChange = (value: string) => {
    setSelectedGender(value);
  };
 
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
       <View style={styles.pickerContainer}>
      <View style={styles.pickerWithIcon}>
      <Image
            source={require('../../assets/icons/search.png')}
            style={styles.dropdownIcon}
          />
        <Picker
          selectedValue={selectedState}
          onValueChange={(itemValue, itemIndex) => {
            setSelectedState(itemValue);
          }}
          style={styles.pickerstate}
          itemStyle={styles.pickerstateForIOS}>
          {states.map((state, index) => (
            <Picker.Item key={index} label={state.label} value={state.value} />
          ))}
        </Picker>
      </View>
      </View>
      <View style={styles.pickerContainer}>
        <View style={styles.pickerWithIcon}>
          <Picker
            selectedValue={selectedGender}
            onValueChange={handleGenderChange}
            style={styles.picker} // for Android
            itemStyle={styles.picker} // for iOS
            dropdownIconColor="gray"
          >
            <Picker.Item label="Select Gender" value="" />
            {genders.map((gender, index) => (
              <Picker.Item key={index} label={gender} value={gender} />
            ))}
          </Picker>
        </View>
      </View>
      <View style={styles.line} />
      <FriendshipNavigator />      
      <View style={viewPostStyles.instructionsContainer}>
        <View style={viewPostStyles.instructionsHeadingContainer}>
          <Text style={viewPostStyles.instructionsHeading}>Instructions</Text>
          <Image
            source={require('../../assets/icons/instruction.png')}
            style={viewPostStyles.headingIcon}
          />
        </View>
        <View style={viewPostStyles.line} />
        
        <View style={viewPostStyles.instructionsContent}>
          <View style={viewPostStyles.instructionItem}>
            <Image
              source={require('../../assets/icons/wrong.png')}
              style={viewPostStyles.icon}
            />
            <Text style={viewPostStyles.instructionTextRed}>
              Swipe left to reject
            </Text>
          </View>
          <View style={viewPostStyles.instructionItem}>
            <Image
              source={require('../../assets/icons/right.png')}
              style={viewPostStyles.icon}
            />
            <Text style={viewPostStyles.instructionTextGreen}>
              Swipe right to view details
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.header2}>Posts</Text>
    </ScrollView>
  );
}
