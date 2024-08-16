import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {CommonActions} from '@react-navigation/native';

const VerificationScreen = ({navigation}) => {
  const handleContinue = () => {
    navigation.navigate('Verification');
  };

  const handleSignout = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Auth/Login'}],
      }),
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={styles.ellipse}>
          <Image
            style={styles.icon}
            source={require('../../../assets/images/Vector.png')}
          />
        </View>
      </View>
      <Text style={styles.title}>Verification Successful!</Text>
      <Text style={styles.message}>
        Your email has been successfully verified. You can now start making
        posts and messaging others. Thank you for helping us keep our community
        secure!
      </Text>
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  ellipse: {
    width: 126.54,
    height: 126.54,
    backgroundColor: '#E5E9FF',
    borderRadius: 63.27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 47,
    height: 47,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000000',
  },
  message: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    color: '#000000',
    marginBottom: 20,
  },
  continueButton: {
    width: 305.79,
    height: 48.51,
    borderRadius: 8.66,
    paddingVertical: 14.73,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2441D0',
    marginBottom: 10,
  },
  continueText: {
    fontSize: 13.86,
    fontWeight: '700',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  signoutButton: {
    width: 305.79,
    height: 48.51,
    borderRadius: 8.66,
    paddingVertical: 14.73,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF4D4D',
  },
  signoutText: {
    fontSize: 13.86,
    fontWeight: '700',
    textAlign: 'center',
    color: '#FFFFFF',
  },
});

export default VerificationScreen;
