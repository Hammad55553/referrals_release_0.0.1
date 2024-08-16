import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import {Image} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import {editMessage} from '../../redux/features/editQuickMessageSlice';
import {AppDispatch} from '../../redux/store';
import {Alert} from 'react-native';

const EditAMQuickMessage = ({navigation}) => {
  const [message, setMessage] = useState('');
  const dispatch: AppDispatch = useDispatch();

  const handleSave = () => {
    dispatch(editMessage({message: message, category: 'Apartment Mate'}))
      .unwrap()
      .then((originalPromiseResult: any) => {
        console.log('Form submitted successfully:', originalPromiseResult);
        Alert.alert('Success', 'Quick Message Updated');
        navigation.goBack();
      })
      .catch((rejectedValueOrSerializedError: any) => {
        console.error(
          'Failed to submit the form:',
          rejectedValueOrSerializedError,
        );
        Alert.alert('Error', 'Failed to submit form. Please try again.');
      });
  };

  return (
    <SafeAreaView>
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
          <Text style={styles.headText}>Edit Apartment Mates</Text>
        </View>
        <Text style={styles.description}>
          This is a pre-written message sent when you are looking for a
          sublease, rental accommodation, or apartment mates.
        </Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            onChangeText={setMessage}
            value={message}
            placeholder="Hi. I’m looking for apartment mates."
            placeholderTextColor="gray"
            multiline
            textAlignVertical="top"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  input: {
    width: '100%',
    height: 160,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginTop: 10,
    color: 'black',
    backgroundColor: '#FFFFFF',
  },
  inputView: {
    width: '100%',
    marginVertical: 10,
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#2441D0',
    paddingVertical: 17,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default EditAMQuickMessage;
