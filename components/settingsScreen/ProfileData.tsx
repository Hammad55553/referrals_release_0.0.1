import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SettingButton} from './SettingButton';

const ProfileData = () => {
  return (
    <>
      <View style={styles.textWrapper}>
        <Text style={{fontWeight: 'bold'}}>Profile data</Text>
      </View>
      <View>
        <SettingButton text={'Delete my profile'} />
      </View>
    </>
  );
};

export default ProfileData;

const styles = StyleSheet.create({
    textWrapper: {
        width: 80,
        position: "relative",
        left: 25,
        paddingBottom: 5
    }
})
