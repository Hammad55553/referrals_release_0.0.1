import React, {useState, useCallback} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Image} from 'react-native-elements';
import axios from 'axios';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {BACKEND_DEV_URL} from '../../constants/Routes';
import {getFirebaseToken} from '../../redux/utils/getFirebaseToken';

interface QuickMessageData {
  looking: string;
  offering: string;
  apartmentMates: string;
}

const QuickMessage = () => {
  const [messageData, setMessageData] = useState<QuickMessageData | null>(null);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const fetchQuickMessages = async () => {
    try {
      const token = await getFirebaseToken();
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get(
        `${BACKEND_DEV_URL}users/quickmessages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = response.data.data.reduce(
        (acc: QuickMessageData, message: any) => {
          if (message.category === 'Looking') acc.looking = message.message;
          if (message.category === 'Offering') acc.offering = message.message;
          if (message.category === 'Apartment Mate')
            acc.apartmentMates = message.message;
          return acc;
        },
        {looking: '', offering: '', apartmentMates: ''},
      );
      setMessageData(data);
    } catch (error) {
      console.error(
        'Error fetching quick messages:',
        error.response || error.message || error,
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchQuickMessages();
    }, []),
  );

  if (!messageData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.head}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <View style={styles.iconContainer}>
              <Image
                source={require('../../assets/icons/back.png')}
                style={styles.iconLeft}
              />
            </View>
          </TouchableOpacity>
          <Text style={styles.headText}>Quick Message</Text>
        </View>
        <Text style={styles.description}>
          This is a pre-written message you can send to start a conversation.
        </Text>

        {/* Container 1 */}
        <View style={styles.messageContainer}>
          <Text style={styles.messageTitle}>Looking</Text>
          <Text style={styles.messageDescription}>
            This is a pre-written message sent when you are looking for a
            sublease or rental accommodation.
          </Text>
          <Text style={styles.smallText}>
            This message will be sent to users when you right-swipe on posts
          </Text>
          <View style={styles.nestedContainer}>
            <Text style={styles.lightText}>{messageData.looking}</Text>
            <TouchableOpacity
              style={styles.editIconContainer}
              onPress={() =>
                navigation.navigate('Screens/Dashboard/EditLookingQuickMessage')
              }>
              <Image
                source={require('../../assets/icons/edit.png')}
                style={styles.editIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Container 2 */}
        <View style={styles.messageContainer}>
          <Text style={styles.messageTitle}>Offering</Text>
          <Text style={styles.messageDescription}>
            This is a pre-written message sent when you are Offering a sublease
            or rental accommodation.
          </Text>
          <Text style={styles.smallText}>
            This message will be sent to users when you right-swipe on posts
          </Text>
          <View style={styles.nestedContainer}>
            <Text style={styles.lightText}>{messageData.offering}</Text>
            <TouchableOpacity
              style={styles.editIconContainer}
              onPress={() =>
                navigation.navigate(
                  'Screens/Dashboard/EditOfferingQuickMessage',
                )
              }>
              <Image
                source={require('../../assets/icons/edit.png')}
                style={styles.editIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Container 3 */}
        <View style={styles.messageContainer}>
          <Text style={styles.messageTitle}>Apartment Mates</Text>
          <Text style={styles.messageDescription}>
            This is a pre-written message sent when you are looking for
            apartment mates.
          </Text>
          <Text style={styles.smallText}>
            This message will be sent to users when you right-swipe on posts.
          </Text>
          <View style={styles.nestedContainer}>
            <Text style={styles.lightText}>{messageData.apartmentMates}</Text>
            <TouchableOpacity
              style={styles.editIconContainer}
              onPress={() =>
                navigation.navigate('Screens/Dashboard/EditAMQuickMessage')
              }>
              <Image
                source={require('../../assets/icons/edit.png')}
                style={styles.editIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5', // dull white background
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  head: {
    flexDirection: 'row',
  },
  headText: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 29.4,
    color: 'black',
  },
  backButton: {
    marginRight: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: '#E2E8EE',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLeft: {
    width: 7,
    height: 13,
    tintColor: '#000000',
  },
  description: {
    width: '100%',
    marginVertical: 12,
    fontSize: 16,
    color: '#2F2F2F',
    lineHeight: 24,
  },
  messageContainer: {
    height: 207,
    marginVertical: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8EE',
    borderRadius: 10,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', // white background for each container
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2441D0',
  },
  messageDescription: {
    fontSize: 14,
    color: '#2F2F2F',
  },
  smallText: {
    fontSize: 12,
    color: '#7B7B7B',
  },
  nestedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    padding: 10,
    backgroundColor: '#F7F8FD', // tint blue color
    borderRadius: 10,
  },
  lightText: {
    fontSize: 14,
    color: 'black',
  },
  editIconContainer: {
    padding: 8,
  },
  editIcon: {
    width: 16,
    height: 16,
  },
});

export default QuickMessage;
