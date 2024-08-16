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
import RNPickerSelect from 'react-native-picker-select';
import { Country, City } from 'country-state-city';

interface CountryData {
    name: string;
    isoCode: string;
}

interface CityData {
    name: string;
}

const BasicinfoProfile = () => {
    const navigation = useNavigation();
    const [currentStep, setCurrentStep] = useState(2); // Manage current step state
    const loggedInUser = useSelector((state: RootState) => state.auth.loggedInUser);

    const [age, setAge] = useState('');
    const [yearsOfExperience, setYearsOfExperience] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState<string | null>(null);
    const [city, setCity] = useState<string | null>(null);
    const [countries, setCountries] = useState<CountryData[]>([]);
    const [cities, setCities] = useState<CityData[]>([]);

    useEffect(() => {
        const fetchCountries = () => {
            const allCountries = Country.getAllCountries();
            setCountries(allCountries.map((country) => ({
                name: country.name,
                isoCode: country.isoCode,
            })));
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        if (country) {
            const fetchCities = () => {
                const citiesOfCountry = City.getCitiesOfCountry(country);
                if (citiesOfCountry) {
                    setCities(citiesOfCountry.map((city) => ({
                        name: city.name,
                    })));
                } else {
                    setCities([]); // Set to an empty array if there are no cities
                }
            };
            fetchCities();
        }
    }, [country]);
    
    const handleSave = async () => {
        try {
            const response = await fetch('https://acea-59-103-217-174.ngrok-free.app/basics/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    age: parseInt(age, 10),
                    yearsOfExperience: parseInt(yearsOfExperience, 10),
                    phoneNumber,
                    email,
                    country,
                    city,
                }),
            });
    
            if (response.ok) {
                Alert.alert('Success', 'Basic information saved successfully');
                setCurrentStep(2); // Move to next step
                navigation.navigate('Profile/Education' as never);
            } else {
                const errorData = await response.json();
                Alert.alert('Error', `Failed to save information: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'An unexpected error occurred');
        }
    };
    
    const handleSkip = () => {
        setCurrentStep(2);
        navigation.navigate('Profile/Education' as never);
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
                            <Text style={styles.headerTitle}>Basic Info</Text>
                        </View>

                        {/* Dashed Line Step Indicator */}
                        <View style={styles.stepIndicatorContainer}>
                            <View style={[
                                styles.stepIndicator,
                                currentStep >= 1 && styles.completedStep
                            ]} />
                            <View style={[
                                styles.stepIndicator,
                                currentStep >= 2 && styles.completedStep
                            ]} />
                            <View style={[
                                styles.stepIndicator,
                                currentStep >= 3 && styles.completedStep
                            ]} />
                            <View style={[
                                styles.stepIndicator,
                                currentStep >= 4 && styles.completedStep
                            ]} />
                            <View style={[
                                styles.stepIndicator,
                                currentStep >= 5 && styles.completedStep
                            ]} />
                            <View style={[
                                styles.stepIndicator,
                                currentStep >= 6 && styles.completedStep
                            ]} />
                            <View style={[
                                styles.stepIndicator,
                                currentStep >= 7 && styles.completedStep
                            ]} />
                        </View>

                        <View style={styles.formContainer}>
                            <Text style={styles.label}>
                                Age <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Age"
                                placeholderTextColor="#888"
                                value={age}
                                onChangeText={setAge}
                                clearButtonMode="while-editing"
                            />

                            <Text style={styles.label}>
                                Years of Experience <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Eg: 3years"
                                placeholderTextColor="#888"
                                value={yearsOfExperience}
                                onChangeText={setYearsOfExperience}
                            />

                            <Text style={styles.label}>
                                Phone Number <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Phone Number"
                                placeholderTextColor="#888"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                            />

                            <Text style={styles.label}>
                                Email <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Email"
                                placeholderTextColor="#888"
                                value={email}
                                onChangeText={setEmail}
                            />

                            <Text style={styles.label}>
                                Country <Text style={styles.required}>*</Text>
                            </Text>
                            <View style={styles.pickerContainer}>
                                <RNPickerSelect
                                    onValueChange={setCountry}
                                    items={countries.map(country => ({
                                        label: country.name,
                                        value: country.isoCode,
                                    }))}
                                    placeholder={{ label: 'Select a country...', value: null }}
                                    style={pickerStyles}
                                />
                            </View>

                            <Text style={styles.label}>
                                City <Text style={styles.required}>*</Text>
                            </Text>
                            <View style={styles.pickerContainer}>
                                <RNPickerSelect
                                    onValueChange={setCity}
                                    items={cities.map(city => ({
                                        label: city.name,
                                        value: city.name,
                                    }))}
                                    placeholder={{ label: 'Select a city...', value: null }}
                                    style={pickerStyles}
                                    disabled={!country}
                                />
                            </View>

                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                <Text style={styles.saveButtonText}>Save & Continue</Text>
                            </TouchableOpacity>

                            <TouchableOpacity   onPress={handleSkip} style={styles.skipButton}>
                                <Text style={styles.skipButtonText}>Skip this step</Text>
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
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('1.5%'),
        marginBottom: hp('2%'),
        fontSize: wp('4%'),
        color: 'gray',
        textAlignVertical: 'center',
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
        backgroundColor: '#4285F4',
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
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: wp('2%'),
        paddingHorizontal: wp('2%'),
        marginBottom: hp('2%'),
        justifyContent: 'center',
        height: hp('6%'), // Adjust height of picker container here
    },
});

const pickerStyles = StyleSheet.create({
    inputIOS: {
        color: 'black',
    },
    inputAndroid: {
        color: 'black',
    },
    placeholder: {
        color: '#888',
    },
    iconContainer: {
        top: 10,
        right: 12,
    },
    icon: {
        color: '#4285F4',
    },
});

export default BasicinfoProfile;
