import React, { useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';

const FriendshipFlowHome = () => {
  const [category, setCategory] = React.useState('Friendship');
  const [state, setState] = React.useState(null);
  const [gender, setGender] = React.useState(null);

  const [dropdownVisible, setDropdownVisible] = useState(null); // Track which dropdown is visible
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedState, setSelectedState] = useState(null); // State for the state dropdown
  const [selectedGender, setSelectedGender] = useState(null); // State for the gender dropdown

  const handleDropdownPress = (dropdown) => {
    if (dropdownVisible === dropdown) {
      setDropdownVisible(null); // Close the dropdown if it's already open
    } else {
      setDropdownVisible(dropdown); // Open the selected dropdown
    }
  };

  const handleOptionPress = (option) => {
    setSelectedOption(option.id);
    setDropdownVisible(null); // Hide dropdown after selection
  };

  const handleStatePress = (state) => {
    setSelectedState(state.id);
    setDropdownVisible(null); // Hide dropdown after selection
  };

  const handleGenderPress = (gender) => {
    setSelectedGender(gender.id);
    setDropdownVisible(null); // Hide dropdown after selection
  };

  const options = [
    { id: 1, text: 'Friendship,Friendship++,Dating' },
    { id: 2, text: 'Shadow' },
    { id: 3, text: 'Sublease Rental' },
    { id: 4, text: 'Referrals' },
  ];

  const states = [
    { id: 1, text: 'USA' },
    { id: 2, text: 'India' },
    { id: 3, text: 'America' },
    { id: 4, text: 'Others' },
  ];

  const genders = [
    { id: 1, text: 'Male' },
    { id: 2, text: 'Female' },
    { id: 3, text: 'Others' },
  ];




  return (
     <ScrollView contentContainerStyle={styles.scrollViewContent}>
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.menuIcon}>
        {/* <Image source={require('../../assets/icons/burger-menu.png')} /> */}
        </TouchableOpacity>
        <Text style={styles.title}>VibeSea</Text>
        {/* <Image source={require('../../assets/icons/Logo.png')} style={styles.logo} /> */}
        <View style={styles.rightContainer}>
          <TouchableOpacity style={styles.notificationIcon}>
          {/* <Image source={require('../../assets/icons/bellicon.png')} style={styles.bellicon} /> */}
         
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileIcon}>
            <Text style={styles.profileText}>SK</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdowns */}
      <View style={styles.dropdownContainer}>
        <TouchableOpacity style={styles.dropdownButton} onPress={() => handleDropdownPress('option')}>
          <Text style={styles.dropdownButtonText}>
            {selectedOption ? options.find(o => o.id === selectedOption)?.text || 'Friendship, Friendship++ & Dating' : 'Friendship, Friendship++ & Dating'}
          </Text>
          <Icon name="chevron-down" size={20} color="#000" />
        </TouchableOpacity>
        {dropdownVisible === 'option' && (
          <View style={styles.optionsContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  selectedOption === option.id && styles.selectedOption,
                ]}
                onPress={() => handleOptionPress(option)}
              >
                <Text style={styles.optionText}>{option.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
     
      {/* buttonrow */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.activeButton}>
          <Text style={styles.buttonText}>Friendship</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.midbutton}>
          <Text style={styles.buttonTexts}>Friendship++</Text>
        </TouchableOpacity>
        <TouchableOpacity style={ styles.button}>
          <Text style={styles.buttonTexts}>Dating</Text>
        </TouchableOpacity>
      </View>
       
          {/* State dropdown */}
          <View style={styles.dropdownContainer}>
      <TouchableOpacity style={styles.dropdownButton} onPress={() => handleDropdownPress('state')}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Image source={require('../../assets/icons/search.png')} style={styles.searchIcon} />
      <Text style={styles.dropdownButtonText}>
        {selectedState ? states.find(o => o.id === selectedState)?.text || 'Select State' : 'Select State'}
      </Text>
    </View>
    <Icon name="chevron-down" size={20} color="#000" />
    </TouchableOpacity>
      {dropdownVisible === 'state' && (
    <View style={styles.optionsContainer}>
      {states.map((state) => (
        <TouchableOpacity
          key={state.id}
          style={[
            styles.optionButton,
            selectedState === state.id && styles.selectedOption,
          ]}
          onPress={() => handleStatePress(state)}
        >
          <Text style={styles.optionText}>{state.text}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )}
</View>
      {/* Gender Dropdown */}
      <View style={styles.dropdownContainer}>
        <TouchableOpacity style={styles.dropdownButton} onPress={() => handleDropdownPress('gender')}>
          <Text style={styles.dropdownButtonText}>
            {selectedGender ? genders.find(o => o.id === selectedGender)?.text || 'Select Gender' : 'Select Gender'}
          </Text>
          <Icon name="chevron-down" size={20} color="#000" />
        </TouchableOpacity>
        {dropdownVisible === 'gender' && (
          <View style={styles.optionsContainer}>
            {genders.map((gender) => (
              <TouchableOpacity
                key={gender.id}
                style={[
                  styles.optionButton,
                  selectedGender === gender.id && styles.selectedOption,
                ]}
                onPress={() => handleGenderPress(gender)}
              >
                <Text style={styles.optionText}>{gender.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
   

      {/* Slider */}
     
      {/* Instructions */}
      <View style={styles.instructions}>
        <View style={styles.upperInstruc}>
          <Text style={styles.instructionTitle}>Instructions</Text>
          <Image source={require('../../assets/icons/i-icon.png')} style={styles.Iicon} />
        </View>
        <View style={styles.line}></View>
        <View style={styles.lowerInstruc}>
          <Text style={styles.instructionTextLeft}>
            <FontAwesome name="times-circle" size={11} color="#E64646" /> Swipe Left to reject
          </Text>
          <Text style={styles.instructionTextRight}>
            <FontAwesome name="check-circle" size={11} color="green" /> Swipe Right to Accept
          </Text>
        </View>
      </View>
      <View style={styles.editcontainer}>
      <TouchableOpacity style={styles.editbutton}>
        {/* <Image source={require('../../assets/icons/edit-white-logo.png')} style={styles.editprofile} /> */}
      </TouchableOpacity>
    </View>

      {/* Posts */}
      <Text style={styles.exploreTitle}>Posts</Text>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    // paddingBottom: 130, // Make space for the bottom navigation
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    
  },
  ScrollView:{
    paddingBottom: 60, 
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
    
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    width: '100%',
  },
  menuIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    color:'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    left:-36,
  },
  logo:{
    left:-75
  },
  bellicon:{
    width:24,
    height:24,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    right: -8,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: 'white',
    fontSize: 10,
  },
  profileIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b33b72',
    borderRadius: 10,
    width: 30,
    height: 30,
    marginLeft: 10,
  },
  profileText: {
    fontSize: 14,
    fontWeight: 'bold',
    color:'white',

  },
 
  dropdownContainer: {
    marginTop:10,
    margin:4,
    marginLeft:10,
  
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    backgroundColor:'#FAFAFA',
   
  },
  dropdownButtonText: {
    fontSize: 14,
    
    color: '#3C3C4399',
  },
  optionsContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    maxHeight: 150,
    padding:7,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  selectedOption: {
    backgroundColor: '#EBEBEB',
  },
  optionText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight:'400',
    color: 'black',
  },
  searchIcon: {
    width: 14,
    height: 14,
    marginRight: 8,
  },

  
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    
    marginVertical: 5,
    marginHorizontal:10,
    
    top:3,

    backgroundColor: '#FFFFFF',
    borderWidth:1,
    borderColor: '#2441D024',
    
    borderRadius: 8.98,
    width: 340,
    height: 38,
    
  },
  midbutton:{
    padding: 10,
    marginHorizontal:0,
    backgroundColor: '#FFFFFF',
    borderRadius: 9,
    width: 110,
    color:'black',

  },
  button: {
    padding: 10,
    marginHorizontal:0,
    backgroundColor: '#FFFFFF',
    borderRadius: 9,
    width: 100,
    color:'black',
  },
  activeButton: {
    backgroundColor: '#2441D0',
    padding: 8,
    borderRadius: 9,
     color:'white',
     width:120,
    flex: 1,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 13,
    left: 20,
  },
  buttonTexts:{
    color: 'black',
    fontSize: 13,
    left: 17,
  },
  // activeButtonText: {
  //   color: '#fff',
  // },
  wrapper: {
    marginTop:10,
    height:195,
    
  },
  slide: {
    
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  slider: {
    width: 350,
    height: 142,
    resizeMode: 'cover',
    borderRadius:8,
  },
  dot: {
    backgroundColor: '#D3D9F6',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  activeDot: {
    backgroundColor: '#2441D0',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
   
 
 
  instructions: {
    top:-30,
    padding: 10,
    backgroundColor: 'white',
   
    borderWidth:1,
    borderColor: '#2441D024',
    // color: 'black',
    marginHorizontal: 10,
    borderRadius: 10,
    marginBottom: 12,
    marginTop: 18,
  },
  upperInstruc: {},
  line: {
    height: 1,
    width:'100%',
    backgroundColor: '#ddd',
    marginVertical: 0,
  },
  lowerInstruc: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 26,
    paddingVertical: 5,
  },
  instructionTextLeft: {
    fontSize: 12,
    color: '#E64646',
    left: 20,
  },
  instructionTextRight: {
    fontSize: 12,
    color: '#188038',
    left: -20,
  },
  instructionTitle: {
    color: 'black',
    fontSize: 11.11,
    fontWeight: 'bold',
  },
  Iicon: {
    left: 300,
    top: -10,
    height: 14,
    width: 14,
  },
  exploreTitle: {
    fontSize: 20,
    marginTop: -20,
    marginBottom: 8,
    color:'black',
    fontWeight:'700',
    left:16,
    top:-16,
    lineHeight:30,
  },
  editcontainer: {
    position: 'absolute',
   
   top:600,
   left:290,
   width: 56,
   height: 56,
  },
  editbutton: {
     width: 56,
     height: 56,
    
     borderRadius: 30,
     opacity:2,
     zIndex:1000,
     backgroundColor: '#2441D0',
     shadowColor: '#000',
     shadowOffset: {
       width: 0,
       height: 4,
     },
     shadowOpacity: 0.25,
    shadowRadius: 4,
     elevation: 5,
  },
  editprofile: {
    width: 24,
    height:24 ,
    top:13,
    left:17,
    resizeMode: 'contain',
  },
});

export default FriendshipFlowHome;
