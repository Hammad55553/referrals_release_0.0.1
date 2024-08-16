import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Image} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';
import {sendInvite, resetState} from '../../redux/features/inviteSlice';
import {RootState, AppDispatch} from '../../redux/store';
import {useNavigation} from '@react-navigation/native'; // Import useNavigation hook

const Invitefriendpage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const inviteStatus = useSelector((state: RootState) => state.invite);
  const navigation = useNavigation(); // Get navigation object from hook

  useEffect(() => {
    if (inviteStatus.success) {
      Alert.alert('Success', 'Invite sent successfully!', [
        {text: 'OK', onPress: handleReset},
      ]);
    }
  }, [inviteStatus.success]);

  const handleInvite = () => {
    dispatch(sendInvite({email}));
  };

  const handleReset = () => {
    dispatch(resetState());
    setEmail('');
  };

  const copyInviteLink = () => {
    Clipboard.setString('www.vibesea.com/app');
  };

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
          <Text style={styles.headText}>Invite Friends</Text>
        </View>
        <Text style={styles.containerText}>
          Invite your friends to join this application.
        </Text>
        <View style={styles.inviteBox}>
          <Text style={[styles.headText]}>Invite your friends</Text>
          <Text style={[styles.smallText]}>
            Invite friends to Vibe Sea, Today!
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="example@example.com"
              keyboardType="email-address"
              placeholderTextColor="#ACACAC"
              value={email}
              onChangeText={setEmail}
            />
            <TouchableOpacity
              style={styles.inviteButton}
              onPress={handleInvite}>
              <Text style={styles.inviteButtonText}>Invite</Text>
            </TouchableOpacity>
          </View>
        </View>
        {inviteStatus.loading && (
          <ActivityIndicator
            size="large"
            color="#2441D0"
            style={styles.activityIndicator}
          />
        )}
        {inviteStatus.error && <Text>Error: {inviteStatus.error}</Text>}
        <Image
          source={require('../../assets/images/inviteDashboard.png')}
          style={styles.dashboardImage}
        />
        <View style={styles.inviteButtonBox}>
          <TouchableOpacity
            style={styles.copylinkButton}
            onPress={copyInviteLink}>
            <Image
              source={require('../../assets/icons/copy.png')}
              style={styles.copyIcon}
            />
            <Text style={styles.copylinkText}>Copy Invite link</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
  },
  head: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerText: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: '#2F2F2F',
  },
  inviteBox: {
    marginTop: 26,
    flexDirection: 'column',
    borderRadius: 10,
    borderColor: '#D8DADC',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
  },
  inviteBoxText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'center',
  },
  backButton: {
    marginRight: 12,
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
    width: 9,
    height: 15,
    tintColor: '#000000',
  },
  headText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'left',
  },
  smallText: {
    fontSize: 11.54,
    fontWeight: '400',
    color: '#242424',
    paddingVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  activityIndicator: {
    marginTop: 20,
  },
  input: {
    flex: 1,
    height: 56,
    borderColor: '#D8DADC',
    borderWidth: 1,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderRightWidth: 0,
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: '400',
    color: 'black',
  },
  inviteButton: {
    height: 56,
    backgroundColor: '#2441D0',
    borderRadius: 10,
    borderBottomRightRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  inviteButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
    paddingVertical: 8,
  },
  dashboardImage: {
    width: '100%',
    height: 227,
    marginTop: 51,
  },
  copyIcon: {
    marginRight: 8, // Adjust space between icon and text
    width: 24,
    height: 24,
    color: 'white',
  },
  copylinkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
  copylinkButton: {
    width: 212,
    height: 56,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2441D0',
    paddingHorizontal: 16, // Adjust padding to space the icon and text
  },
  inviteButtonBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 13,
  },
});

export default Invitefriendpage;
