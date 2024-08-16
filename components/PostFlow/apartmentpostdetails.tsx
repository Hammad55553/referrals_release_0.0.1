import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import SlideButton from '../SlideButton';
import {AppDispatch, RootState} from '../../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {createSubLeasePostRequest} from '../../redux/features/requestSlice';
import CustomAlert from '../CustomAlert';
import {logger} from 'react-native-logs';

var log = logger.createLogger();

const AMPostDetails = ({route}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch: AppDispatch = useDispatch();
  const {post} = route.params;

  const firebaseIDToken: string | null = useSelector(
    (state: RootState) => state.auth.firebaseIDToken,
  );

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const [alertButtons, setAlertButtons] = useState<
    {label: string; onPress: () => void}[]
  >([]);

  function handleSlideComplete() {
    // logic here
    console.log('swiped apartment post request');
    if (firebaseIDToken) {
      const response = dispatch(
        createSubLeasePostRequest({
          firebaseIDToken,
          message: 'Hello!',
          post_id: post._id,
          uid: post.uid,
        }),
      );

      if (response.requestId) {
        navigation.navigate('Screens/RequestSuccess');
      } else {
        setAlertTitle('Error');
        setAlertDescription('Request Failed.');
        setAlertButtons([{label: 'OK', onPress: () => log.info('OK Pressed')}]);
        setAlertVisible(true);
      }
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          description={alertDescription}
          buttons={alertButtons}
          onClose={() => setAlertVisible(false)}
        />
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
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>{post.titleOfPost}</Text>
            <View style={styles.address}>
              <Text style={styles.TextCity}>{post.address.city}</Text>
              <Text style={styles.oblique}>|</Text>
              <Text style={styles.TextState}>{post.address.state}</Text>
            </View>
            <Text style={styles.description}>{post.postDescription}</Text>
            <View style={styles.footer}>
              <View style={styles.footerView}>
                <Text style={styles.footerText}>Looking from</Text>
                <Text style={styles.footerTextBlue}>
                  {new Date(post.availableFrom).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.iconBox}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Apartment Mate</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonBox}>
          <SlideButton onSlideComplete={handleSlideComplete} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  buttonBox: {
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 19.5,
    zIndex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLeft: {
    width: 5.63,
    height: 11.25,
    tintColor: '#fff',
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
  },
  content: {},
  title: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 29.4,
    maxWidth: '100%',
    color: '#242424',
  },
  address: {
    marginTop: 6,
    flexDirection: 'row',
  },
  TextCity: {
    fontSize: 12,
    lineHeight: 17.64,
    fontWeight: '500',
    color: '#242424',
  },
  oblique: {
    marginHorizontal: 2,
    fontSize: 12,
    lineHeight: 17.64,
    fontWeight: '500',
    color: '#242424',
  },
  TextState: {
    fontSize: 12,
    lineHeight: 17.64,
    fontWeight: '500',
    color: '#242424',
  },
  description: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 14.4,
    color: '#242424',
    maxWidth: '85%',
  },
  footer: {
    marginTop: 8,
    flexDirection: 'column',
  },
  footerView: {
    paddingVertical: 2,
    flexDirection: 'row',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 14.4,
    color: '#4F4F4F',
  },
  footerViewBottom: {
    marginTop: 4,
    paddingVertical: 2,
    flexDirection: 'row',
  },
  footerTextBlue: {
    lineHeight: 17.64,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 8,
    color: '#2441D0',
  },
  iconBox: {
    width: '18%',
    height: 54,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#2441D0',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 14.7,
  },
});
export default AMPostDetails;
