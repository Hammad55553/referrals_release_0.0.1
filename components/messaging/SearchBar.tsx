import {View, TextInput, StyleSheet, Image, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import React from 'react';

export function MessagingSearchBar() {
  const messageFlowScreen: 'Messages' | 'Requests' = useSelector(
    (state: RootState) => state.chat.messageFlowScreen,
  );
  return (
    <View
      style={
        messageFlowScreen === 'Messages'
          ? styles.searchBarMessages
          : styles.searchBarRequests
      }>
      {messageFlowScreen === 'Messages' && (
        <Image
          source={require('../../assets/images/messaging/search.png')}
          style={styles.searchIcon}
        />
      )}
      {messageFlowScreen === 'Messages' && (
        <TextInput
          style={styles.input}
          placeholder={`Search ${messageFlowScreen.toLowerCase()}`}
          placeholderTextColor="#6C7072"
        />
      )}
      {messageFlowScreen === 'Requests' && (
        <View style={styles.requestPageSearchView}>
          <View style={styles.containerOne}>
            <Text style={styles.instructionsText}>Instructions</Text>
            <Image
              source={require('../../assets/images/info.png')}
              style={styles.infoIcon}
            />
          </View>
          <View style={styles.containerTwo}>
            <View style={styles.containerThree}>
              <Image
                source={require('../../assets/images/red_cross.png')}
                style={styles.infoIcon}
              />
              <Text style={styles.instructionsTextDetailsWrong}>
                Swipe Left to reject
              </Text>
            </View>
            <View style={styles.containerThree}>
              <Image
                source={require('../../assets/images/green_tick.png')}
                style={styles.infoIcon}
              />
              <Text style={styles.instructionsTextDetailsRight}>
                Swipe Right to accept
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  instructionsTextDetailsWrong: {
    fontSize: 13,
    fontWeight: '500',
    color: '#E64646',
  },
  instructionsTextDetailsRight: {
    fontSize: 13,
    fontWeight: '500',
    color: '#188038',
  },
  containerThree: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingVertical: 10,
  },
  containerTwo: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  instructionsText: {
    fontSize: 14,
    fontWeight: '500',
  },
  containerOne: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
    borderBottomColor: '#2441D024',
    borderBottomWidth: 2,
  },
  infoIcon: {
    width: 20,
    height: 20,
  },
  requestPageSearchView: {
    width: '100%',
    backgroundColor: 'white',
    height: 80,
    marginTop: 30,
    flexDirection: 'column',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2441D024',
  },
  searchBarMessages: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 7,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 10,
    height: 40,
    backgroundColor: '#F2F4F5',
  },
  searchBarRequests: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 7,
    paddingVertical: 10,
    margin: 10,
    height: 40,
    backgroundColor: '#F2F4F5',
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
});
