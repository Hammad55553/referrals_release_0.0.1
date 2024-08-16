import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    TextInput,
    Platform,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
    Alert,
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface CountryData {
    name: string;
    isoCode: string;
}

interface CityData {
    name: string;
}

const ExperienceProfile = () => {
    const navigation = useNavigation();
    const [currentStep, setCurrentStep] = useState(5); // Manage current step state
    const loggedInUser = useSelector((state: RootState) => state.auth.loggedInUser);

    const [title, setTitle] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    const handleStartDateChange = (event: any, selectedDate: Date | undefined) => {
        setShowStartDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setStartDate(selectedDate);
        }
    };

    const handleEndDateChange = (event: any, selectedDate: Date | undefined) => {
        setShowEndDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setEndDate(selectedDate);
        }
    };

    const handleAdd = async () => {
        if (!title || !companyName || !location || !startDate) {
          Alert.alert('Validation Error', 'Please fill in all required fields.');
          return;
        }
      
        try {
          const response = await fetch('https://acea-59-103-217-174.ngrok-free.app/experiences/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title,
              companyName,
              location,
              startDate,
              endDate,
            }),
          });
      
          if (!response.ok) {
            throw new Error('Failed to add experience');
          }
      
          const data = await response.json();
          Alert.alert('Added', 'Experience added successfully');
          setTitle('');
          setCompanyName('');
          setLocation('');
          setStartDate(null);
          setEndDate(null);
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'An error occurred while adding the experience.');
        }
      };
      

    const handleAddMore = () => {
        handleAdd(); // Add the current experience
        Alert.alert('Add More', 'You can add more experiences');
    };

    const handleSaveAndContinue = () => {
        handleAdd(); // Add the current experience
        setCurrentStep(5); // Move to next step
        navigation.navigate('Profile/Skills' as never);
    };
    const handleSkip = () => {
        setCurrentStep(5);
        navigation.navigate('Profile/Skills' as never);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <View style={styles.header}>
                            <TouchableOpacity
                                onPress={() => {
                                    if (navigation.canGoBack()) {
                                        navigation.goBack();
                                    }
                                }}
                                style={styles.backButton}
                            >
                                <Icon name="arrow-back" size={wp('6%')} color="#000" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Experience</Text>
                        </View>

                        {/* Dashed Line Step Indicator */}
                        <View style={styles.stepIndicatorContainer}>
                            <View
                                style={[
                                    styles.stepIndicator,
                                    currentStep >= 1 && styles.completedStep,
                                ]}
                            />
                            <View
                                style={[
                                    styles.stepIndicator,
                                    currentStep >= 2 && styles.completedStep,
                                ]}
                            />
                            <View
                                style={[
                                    styles.stepIndicator,
                                    currentStep >= 3 && styles.completedStep,
                                ]}
                            />
                            <View
                                style={[
                                    styles.stepIndicator,
                                    currentStep >= 4 && styles.completedStep,
                                ]}
                            />
                            <View
                                style={[
                                    styles.stepIndicator,
                                    currentStep >= 5 && styles.completedStep,
                                ]}
                            />
                            <View
                                style={[
                                    styles.stepIndicator,
                                    currentStep >= 6 && styles.completedStep,
                                ]}
                            />
                            <View
                                style={[
                                    styles.stepIndicator,
                                    currentStep >= 7 && styles.completedStep,
                                ]}
                            />
                        </View>

                        <View style={styles.formContainer}>
                            <Text style={styles.label}>
                                Title <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Title"
                                placeholderTextColor="#888"
                                value={title}
                                onChangeText={setTitle}
                                clearButtonMode="while-editing"
                            />

                            <Text style={styles.label}>
                                Company Name <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Company Name"
                                placeholderTextColor="#888"
                                value={companyName}
                                onChangeText={setCompanyName}
                            />

                            <Text style={styles.label}>
                                Location <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Location"
                                placeholderTextColor="#888"
                                value={location}
                                onChangeText={setLocation}
                            />

                            <Text style={styles.label}>
                                Start Date <Text style={styles.required}>*</Text>
                            </Text>
                            <TouchableOpacity
                                style={styles.dateInput}
                                onPress={() => setShowStartDatePicker(true)}
                            >
                                <Text style={styles.dateText}>
                                    {startDate
                                        ? startDate.toDateString()
                                        : 'Select Start Date'}
                                </Text>
                            </TouchableOpacity>

                            {showStartDatePicker && (
                                <DateTimePicker
                                    value={startDate || new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={handleStartDateChange}
                                />
                            )}

                            <Text style={styles.label}>
                                End Date <Text style={styles.required}>*</Text>
                            </Text>
                            <TouchableOpacity
                                style={styles.dateInput}
                                onPress={() => setShowEndDatePicker(true)}
                            >
                                <Text style={styles.dateText}>
                                    {endDate ? endDate.toDateString() : 'Select End Date'}
                                </Text>
                            </TouchableOpacity>

                            {showEndDatePicker && (
                                <DateTimePicker
                                    value={endDate || new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={handleEndDateChange}
                                />
                            )}
                        </View>

                        {/* Add and Add More Buttons */}
                        <View style={styles.buttonContainer1}>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={handleAdd}
                            >
                                <Text style={styles.addButtonText}>Add</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleAddMore}
                                style={styles.moreButton}
                            >
                                <Text style={styles.moreButtonText}>Add more+</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Save & Continue and Skip Buttons */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSaveAndContinue}
                            >
                                <Text style={styles.saveButtonText}>
                                    Save & Continue
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                 onPress={handleSkip}
                                style={styles.skipButton}
                            >
                                <Text style={styles.skipButtonText}>
                                    Skip this step
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: hp('10%'),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: hp('2%'),
        paddingHorizontal: wp('4%'),
        paddingBottom: hp('2%'),
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        padding: wp('2%'),
        borderRadius: wp('2%'),
        borderColor: 'lightgrey',
        borderWidth: 1,
    },
    headerTitle: {
        right: wp(10),
        fontSize: wp('5%'),
        top: hp('8%'),
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'left',
        color: '#000',
    },
    formContainer: {
        padding: wp('4%'),
        paddingTop: wp('18%'),
    },
    label: {
        fontSize: wp('4%'),
        color: '#333',
        marginBottom: hp('1%'),
    },
    required: {
        color: '#FF6347', // Red color for required fields
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: wp('2%'),
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('4%'),
        fontSize: wp('4%'),
        color: '#000',
        marginBottom: hp('2%'),
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: wp('2%'),
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('4%'),
        fontSize: wp('4%'),
        color: '#000',
        marginBottom: hp('2%'),
        justifyContent: 'center',
    },
    dateText: {
        fontSize: wp('4%'),
        color: '#333',
    },
    buttonContainer: {
        marginTop: hp('2%'),
        paddingHorizontal: wp('4%'),
    },
    saveButton: {
        backgroundColor: '#4285F4',
        paddingVertical: hp('1.5%'),
        borderRadius: wp('2%'),
        alignItems: 'center',
        marginBottom: hp('1%'),
    },
    saveButtonText: {
        fontSize: wp('4%'),
        color: '#fff',
        fontWeight: 'bold',
    },
    skipButton: {
        alignItems: 'center',
        paddingVertical: hp('1.5%'),
    },
    skipButtonText: {
        fontSize: wp('3.5%'),
        color: '#888',
    },

    buttonContainer1: {
        marginTop: hp('2%'),
        paddingHorizontal: wp('4%'),
    },
    addButton: {
        backgroundColor: '#858585',
        paddingVertical: hp('1.5%'),
        borderRadius: wp('2%'),
        alignItems: 'center',
        marginBottom: hp('1%'),
    },
    addButtonText: {
        fontSize: wp('4%'),
        color: '#fff',
        fontWeight: 'bold',
    },
    moreButton: {
        backgroundColor: '#858585',
        paddingVertical: hp('1.5%'),
        borderRadius: wp('2%'),
        alignItems: 'center',
        marginBottom: hp('1%'),
    },
    moreButtonText: {
        fontSize: wp('4%'),
        color: '#fff',
        fontWeight: 'bold',
    },
    stepIndicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // marginVertical: hp('2%'),
        width: '100%',
    },
    stepIndicator: {
        flex: 1,
        height: wp('2%'),
        borderRadius: wp('1%'),
        backgroundColor: '#e0e0e0',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        // marginHorizontal: wp('1%'),
    },
    completedStep: {
        backgroundColor: '#007bff',
    },

});

export default ExperienceProfile;
