import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
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
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';

const SetupProfile = () => {
    const navigation = useNavigation();
    const [currentStep, setCurrentStep] = useState(1);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profileImageUri, setProfileImageUri] = useState('');
    const [heading, setHeading] = useState('');
    const [about, setAbout] = useState('');
    const maxCharacters = 2000;

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('headline', heading);
        formData.append('about', about);

        if (profileImageUri) {
            formData.append('picture', {
                uri: profileImageUri,
                type: 'image/jpeg',
                name: 'profile-image.jpg',
            } as any);
        }

        try {
            const response = await fetch(
                'https://acea-59-103-217-174.ngrok-free.app/profiles/',
                {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                console.log('Response:', data);
                Alert.alert('Success', 'Profile updated successfully');
                setCurrentStep(2);
                navigation.navigate('Profile/View' as never);
            } else {
                throw new Error(data.message || 'An error occurred while updating the profile');
            }
        } catch (error) {
            console.error('Fetch error details:', error.message);
            Alert.alert('Error', 'An error occurred while updating the profile');
        }
    };

    const handleSkip = () => {
        setCurrentStep(1);
        navigation.navigate('Profile/basicinfoProfile' as never);
    };

    const pickImage = () => {
        launchImageLibrary(
            { mediaType: 'photo' },
            (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.errorMessage) {
                    console.log('ImagePicker Error: ', response.errorMessage);
                } else {
                    if (response.assets && response.assets.length > 0) {
                        const { uri } = response.assets[0];
                        if (uri) {
                            setProfileImageUri(uri);
                        } else {
                            console.log('Image URI is undefined');
                        }
                    } else {
                        console.log('No assets found in response');
                    }
                }
            }
        );
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
                                onPress={() => navigation.canGoBack() && navigation.goBack()}
                                style={styles.backButton}
                            >
                                <Icon name="arrow-back" size={wp('6%')} color="#000" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Set up your profile</Text>
                        </View>

                        <View style={styles.stepIndicatorContainer}>
                            {Array.from({ length: 7 }, (_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.stepIndicator,
                                        currentStep >= index + 1 && styles.completedStep,
                                    ]}
                                />
                            ))}
                        </View>

                        <View style={styles.profileInfo}>
                            <TouchableOpacity onPress={pickImage}>
                                <Image
                                    source={{ uri: profileImageUri || 'https://avatar.iran.liara.run/public/boy?username=Ash' }}
                                    style={styles.profileImage}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.formContainer}>
                            <Text style={styles.label}>First Name <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter first Name"
                                placeholderTextColor="#888"
                                value={firstName}
                                onChangeText={setFirstName}
                                clearButtonMode="while-editing"
                            />

                            <Text style={styles.label}>Last Name <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter last Name"
                                placeholderTextColor="#888"
                                value={lastName}
                                onChangeText={setLastName}
                            />

                            <Text style={styles.label}>Headline <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Headline"
                                placeholderTextColor="#888"
                                value={heading}
                                onChangeText={setHeading}
                            />

                            <Text style={styles.label}>About <Text style={styles.optional}>(Optional)</Text></Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Type about yourself"
                                placeholderTextColor="#888"
                                value={about}
                                onChangeText={setAbout}
                                multiline
                                maxLength={maxCharacters}
                            />
                            <Text style={styles.characterCount}>{`${about.length}/${maxCharacters} characters`}</Text>
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                <Text style={styles.saveButtonText}>Save & Continue</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
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
    profileInfo: {
        alignItems: 'baseline',
        padding: wp('4%'),
        paddingTop: wp('18%'),
    },
    profileImage: {
        width: wp('25%'),
        height: wp('25%'),
        borderRadius: wp('12.5%'),
        marginBottom: hp('1%'),
        borderWidth: 2,
        borderColor: '#FF6347',
    },
    formContainer: {
        padding: wp('4%'),
    },
    label: {
        fontSize: wp('4%'),
        color: '#333',
        marginBottom: hp('1%'),
    },
    required: {
        color: '#FF6347', // Red color for required fields
    },
    optional: {
        color: '#888', // Gray color for optional fields
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
    textArea: {
        height: hp('20%'),
        textAlignVertical: 'top',  // Ensure text starts at the top
    },
    characterCount: {
        fontSize: wp('3.5%'),
        color: '#888',
        textAlign: 'right',
        marginBottom: hp('2%'),
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
        borderColor: '#4285F4',
    },
});

export default SetupProfile;
