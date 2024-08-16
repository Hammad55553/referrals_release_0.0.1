import React, {useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../redux/store'; // Ensure correct paths to your store file
import {fetchVerificationStatus} from '../../../redux/features/verificationSlice';

import {StackNavigationProp} from '@react-navigation/stack';

const Verification = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch = useDispatch<AppDispatch>();
  const {loading, workEmailVerified, schoolEmailVerified} = useSelector(
    (state: RootState) => state.verification,
  );

  useEffect(() => {
    dispatch(fetchVerificationStatus());
  }, [dispatch]);

  function handleBack() {
    navigation.goBack();
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
          verify your work email, school email, and phone number. Choose anyone
          to get started.
        </Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.emailsection}>
          <TouchableOpacity
            style={styles.optionContainer}
            disabled={workEmailVerified}>
            <View style={styles.workemailleft}>
              <Image
                source={require('../../../assets/images/outline-email.png')}
                style={styles.workemailicon}
              />
              <Text style={styles.optionText}>Work Email</Text>
            </View>
            <View style={styles.workemailRight}>
              <TouchableOpacity
                onPress={() => navigation.navigate('EmailVerification')}
                disabled={workEmailVerified}>
                <Image
                  source={require('../../../assets/icons/baseline-chevron-right.png')}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionContainer}
            disabled={schoolEmailVerified}>
            <View style={styles.workemailleft}>
              <Image
                source={require('../../../assets/images/outline-email.png')}
                style={styles.workemailicon}
              />
              <Text style={styles.optionText}>School Email</Text>
            </View>
            <View style={styles.workemailRight}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Schoolemail')}
                disabled={schoolEmailVerified}>
                <Image
                  source={require('../../../assets/icons/baseline-chevron-right.png')}
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
              <TouchableOpacity
                onPress={() => navigation.navigate('phoneverification')}>
                <Image
                  source={require('../../../assets/icons/baseline-chevron-right.png')}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 13,
  },
  verificationText: {
    width: 140,
    height: 40,
    position: 'absolute',
    top: 54,
    left: '35%',
    transform: [{translateX: -47.5}],
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
    marginTop: 120,
    paddingRight: 2,
  },
  descriptionText: {
    width: '100%',
    height: 80,
    opacity: 1,
    paddingRight: 2,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica Now Display',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
    textAlign: 'left',
    color: '#000000',
  },
  emailsection: {
    marginTop: 30,
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    borderWidth: 1,
    borderColor: '#D8DADC',
    opacity: 1,
  },
  optionContainer: {
    width: '100%',
    height: 64,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#DEDEDE',
    opacity: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
  },
  workemailRight: {
    paddingRight: 10,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
    paddingBottom: 15,
  },
});

export default Verification;
