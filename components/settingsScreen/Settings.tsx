import React from 'react';
import {SettingButton} from './SettingButton';
import {StyleSheet, View} from 'react-native';
import ProfileData from './ProfileData';

const Settings = () => {
  return (
    <View style={[styles.container]}>
      <View style={styles.profileFrameContainer}>
        <ProfileData />
      </View>
      <View style={styles.signOutButtonContainer}>
        <SettingButton text={'Signout'} />
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 40
  },
  profileFrameContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 40,
    backgroundColor: "white",
    borderRadius: 7,
    width: 350,
    padding: 10,
  },
});
