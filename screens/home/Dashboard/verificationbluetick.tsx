import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {GestureResponderEvent} from 'react-native/Libraries/Types/CoreEventTypes';

const VerificationBluetick = () => {
  function handleBack(event: GestureResponderEvent): void {
    // Implement the back navigation here
  }

  return (
    <View style={styles.container}>
      <Text style={styles.verificationText}>Verification</Text>
      <TouchableOpacity style={styles.backRectangle} onPress={handleBack}>
        <Image source={require('../../../assets/icons/chevronleft.png')} />
      </TouchableOpacity>
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
          To be able to post and use the messages feature on the app, please
          verify your work email, school email and phone number. Choose anyone
          to get started.
        </Text>
      </View>
      <View style={styles.emailsection}>
        <TouchableOpacity style={styles.optionContainer}>
          <View style={styles.workemailleft}>
            <Image
              source={require('../../../assets/images/outline-email.png')}
              style={styles.workemailicon}
            />
            <Text style={styles.optionText}>Work Email</Text>
          </View>
          <View style={styles.workemailRight}>
            <TouchableOpacity>
              <Image
                source={require('../../../assets/icons/Checkboxbase.png')}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionContainer}>
          <View style={styles.workemailleft}>
            <Image
              source={require('../../../assets/images/outline-email.png')}
              style={styles.workemailicon}
            />
            <Text style={styles.optionText}>School Email</Text>
          </View>
          <View style={styles.workemailRight}>
            <TouchableOpacity>
              <Image
                source={require('../../../assets/icons/Checkboxbase.png')}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionContainer}>
          <View style={styles.workemailleft}>
            <Image
              source={require('../../../assets/images/round-phone.png')}
              style={styles.workemailicon}
            />
            <Text style={styles.optionText}>Phone</Text>
          </View>
          <View style={styles.workemailRight}>
            <TouchableOpacity>
              <Image
                source={require('../../../assets/icons/Checkboxbase.png')}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  verificationText: {
    width: 140,
    height: 40,
    position: 'absolute',
    top: 54,
    left: '35%', // Center horizontally
    transform: [{translateX: -47.5}], // Adjust by half the width to center
    fontFamily: 'Helvetica',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 31.2,
    textAlign: 'center',
    color: '#000000',
  },
  backRectangle: {
    width: 39,
    height: 35,
    position: 'absolute',
    top: 50,
    left: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D8DADC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionContainer: {
    marginTop: 120, // Add margin to avoid absolute positioning
    paddingRight: 2, // Add padding to the right
  },
  descriptionText: {
    width: '100%',
    height: 80,
    opacity: 1,

    paddingRight: 2,
    backgroundColor: '#FFFFFF', // Change background to white
    fontFamily: 'Helvetica Now Display', // Note: You need to ensure the font is properly linked/available in your project
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
    textAlign: 'left',
    color: '#000000', // Change text color to black
  },
  emailsection: {
    marginTop: 30, // Add margin to avoid absolute positioning
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    borderWidth: 1,
    borderColor: '#D8DADC',
    opacity: 1,
  },
  optionContainer: {
    width: '100%', // 'Fill' implies taking full width, so we use '100%'
    height: 64,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#DEDEDE',
    opacity: 1,
    flexDirection: 'row', // Ensure children are laid out horizontally
    alignItems: 'center', // Center items vertically
    justifyContent: 'space-between', // Space out items
  },
  workemailleft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workemailicon: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: '#F7F8FA',
    marginBottom: 10, // Adjust the icon position upwards
    marginRight: 10, // Adjust the icon position rightwards
    marginLeft: 10,
  },
  workemailRight: {
    paddingRight: 10, // Adjust padding as needed
  },
  optionText: {
    marginLeft: 10, // Add margin to separate text from icon
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
    paddingBottom: 15,
  },
});

export default VerificationBluetick;
