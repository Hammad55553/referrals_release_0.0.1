import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import SlideButton from '../../components/SlideButton';
import {AppDispatch, RootState} from '../../redux/store';
import {useDispatch} from 'react-redux';
import {createSubLeasePostRequest} from '../../redux/features/requestSlice';
import {useSelector} from 'react-redux';
import {logger} from 'react-native-logs';
import CustomAlert from '../CustomAlert';

var log = logger.createLogger();

const facilitiesIcons = {
  Refrigerator: require('../../assets/icons/facility1.png'),
  'Swimming Pool': require('../../assets/icons/facility2.png'),
  'Air Conditioner': require('../../assets/icons/facility3.png'),
  Gym: require('../../assets/icons/facility3.png'),
  Parking: require('../../assets/icons/facility2.png'),
  'Lorem Ipsum': require('../../assets/icons/facility3.png'),
  'Lorem Ipsum 2': require('../../assets/icons/facility2.png'),
  'Lorem Ipsum 3': require('../../assets/icons/facility1.png'),
  'Lorem Ipsum 4': require('../../assets/icons/facility2.png'),
  'Lorem Ipsum 5': require('../../assets/icons/facility3.png'),
};

const OfferingPostDetails = ({route, navigation}) => {
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
    console.log('swiped offering post request');
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
        <View>
          {post.imgUrl[0] ? (
            <Image
              source={{uri: post.imgUrl[0]}}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.noImageContainer}>
              <Text style={styles.noImageText}>No Preview Image</Text>
            </View>
          )}
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
          <TouchableOpacity style={styles.likeButton}>
            <View style={styles.iconContainer}>
              <Image
                source={require('../../assets/icons/like.png')}
                style={styles.iconRight}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.descriptionBox}>
            <View style={styles.headerRow}>
              <Text style={styles.priceText}>
                {post.priceTo.$numberDecimal}$
              </Text>
              <View style={styles.availabilityBox}>
                <Text style={styles.availabilityText}>Availability Status</Text>
                <Text style={styles.dateText}>
                  {new Date(post.availableFrom).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <View style={styles.textBox}>
              <Text style={[styles.title, styles.textSpacing]}>
                {post.titleOfPost}
              </Text>
              <Text style={[styles.subtitle, styles.textSpacing]}>
                {post.apartmentType}
              </Text>
              <Text style={styles.address}>
                {post.address.streetNameNumber}, {post.address.city},{' '}
                {post.address.state}
              </Text>
            </View>
            <View style={styles.iconBox}>
              <FlatList
                data={post.facilities.map(facility => ({
                  id: facility,
                  label: facility,
                  source: facilitiesIcons[facility],
                }))}
                renderItem={({item}) => (
                  <View style={styles.iconItem}>
                    <View style={styles.iconBackground}>
                      <Image
                        source={item.source}
                        style={styles.descriptionIcon}
                      />
                    </View>
                  </View>
                )}
                ListEmptyComponent={() => (
                  <Text style={styles.iconLabel}>No Facilities</Text>
                )}
                keyExtractor={item => item.id}
                horizontal
                style={styles.iconList}
              />
            </View>
            <View style={styles.descriptionTextBox}>
              <Text style={styles.descriptionHeading}>Description</Text>
              <Text style={styles.descriptionTextBottom}>
                {post.postDescription}
              </Text>
            </View>
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
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  bannerImage: {
    width: '100%',
    height: 250,
  },
  buttonBox: {
    width: '100%',
  },
  noImageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 16,
    color: '#555',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 19.5,
    zIndex: 1,
  },
  likeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
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
  iconRight: {
    width: 16.67,
    height: 15.29,
    tintColor: '#fff',
  },
  descriptionBox: {
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#2441D0',
  },
  availabilityBox: {
    alignItems: 'flex-end',
  },
  availabilityText: {
    fontSize: 12,
  },
  dateText: {
    fontSize: 14,
    color: '#2441D0',
  },
  textBox: {
    marginTop: 8,
  },
  textSpacing: {
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 14,
    color: '#7B7B7B',
  },
  address: {
    fontSize: 14,
    color: '#555',
  },
  iconBox: {
    width: '100%',
  },
  iconList: {
    marginTop: 16,
  },
  iconItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 25,
    height: 25,
    justifyContent: 'center',
  },
  iconBackground: {
    padding: 8,
    borderRadius: 5,
  },
  descriptionIcon: {
    width: 25,
    height: 25,
  },
  iconLabel: {
    marginTop: 4,
    fontSize: 10,
    textAlign: 'center',
    color: '#7B7B7B',
  },
  descriptionTextBox: {
    marginTop: 16,
  },
  descriptionHeading: {
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#000000',
  },
  descriptionTextBottom: {
    fontSize: 14,
    color: '#7B7B7B',
  },
});

export default OfferingPostDetails;
