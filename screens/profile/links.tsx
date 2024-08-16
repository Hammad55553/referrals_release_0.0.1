import React, { useState } from 'react';
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

// Specific URL validation functions
const isValidLinkedInURL = (url: string) => {
    const regex = /^https:\/\/www\.linkedin\.com\/.*$/;
    return regex.test(url);
};

const isValidGitHubURL = (url: string) => {
    const regex = /^https:\/\/github\.com\/.*$/;
    return regex.test(url);
};

const isValidURL = (url: string) => {
    const regex = /^(http:\/\/|https:\/\/)[^\s$.?#].[^\s]*$/;
    return regex.test(url);
};

const SkillsProfile = () => {
    const navigation = useNavigation();
    const [currentStep, setCurrentStep] = useState(7);
    const loggedInUser = useSelector((state: RootState) => state.auth.loggedInUser);

    const [linkedin, setLinkedin] = useState('');
    const [github, setGithub] = useState('');
    const [portfolio, setPortfolio] = useState('');
    const [other, setOther] = useState('');

    const [linkedinError, setLinkedinError] = useState('');
    const [githubError, setGithubError] = useState('');
    const [portfolioError, setPortfolioError] = useState('');
    const [otherError, setOtherError] = useState('');

    const handleSave = async () => {
        let hasError = false;
    
        // Validate LinkedIn URL if not empty
        if (linkedin && !isValidLinkedInURL(linkedin)) {
            setLinkedinError('Please enter a valid LinkedIn URL.');
            hasError = true;
        } else {
            setLinkedinError('');
        }
    
        // Validate GitHub URL if not empty
        if (github && !isValidGitHubURL(github)) {
            setGithubError('Please enter a valid GitHub URL.');
            hasError = true;
        } else {
            setGithubError('');
        }
    
        // Validate Portfolio URL if not empty
        if (portfolio && !isValidURL(portfolio)) {
            setPortfolioError('Please enter a valid URL.');
            hasError = true;
        } else {
            setPortfolioError('');
        }
    
        // Validate Other URL if not empty
        if (other && !isValidURL(other)) {
            setOtherError('Please enter a valid URL.');
            hasError = true;
        } else {
            setOtherError('');
        }
    
        if (hasError) return;
    
        // Prepare data to send
        const data = {
            linkedin,
            github,
            portfolio,
            other,
        };
    
        try {
            const response = await fetch('https://acea-59-103-217-174.ngrok-free.app/links/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (response.ok) {
                // Successfully saved
                Alert.alert('Success', 'Links have been saved successfully.');
                setCurrentStep(7);
                navigation.navigate('Profile/View' as never);
            } else {
                // Handle server errors
                const errorData = await response.json();
                Alert.alert('Error', `Failed to save links: ${errorData.message}`);
            }
        } catch (error) {
            // Handle network errors
            Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
        }
    };
    
    const handleSkip = () => {
        setCurrentStep(4);
        navigation.navigate('Profile/View' as never);
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
                            <Text style={styles.headerTitle}>Links</Text>
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
                                LinkedIn URL <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={[styles.input, linkedinError ? styles.errorInput : {}]}
                                placeholder="https://"
                                placeholderTextColor="#888"
                                value={linkedin}
                                onChangeText={setLinkedin}
                                clearButtonMode="while-editing"
                            />
                            {linkedinError ? <Text style={styles.errorText}>{linkedinError}</Text> : null}

                            <Text style={styles.label}>
                                Github URL <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={[styles.input, githubError ? styles.errorInput : {}]}
                                placeholder="https://"
                                placeholderTextColor="#888"
                                value={github}
                                onChangeText={setGithub}
                            />
                            {githubError ? <Text style={styles.errorText}>{githubError}</Text> : null}

                            <Text style={styles.label}>
                                Portfolio URL <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={[styles.input, portfolioError ? styles.errorInput : {}]}
                                placeholder="https://"
                                placeholderTextColor="#888"
                                value={portfolio}
                                onChangeText={setPortfolio}
                            />
                            {portfolioError ? <Text style={styles.errorText}>{portfolioError}</Text> : null}

                            <Text style={styles.label}>
                                Other URL <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={[styles.input, otherError ? styles.errorInput : {}]}
                                placeholder="https://"
                                placeholderTextColor="#888"
                                value={other}
                                onChangeText={setOther}
                            />
                            {otherError ? <Text style={styles.errorText}>{otherError}</Text> : null}
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSave}
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
        marginBottom: hp('1%'),
    },
    errorInput: {
        borderColor: '#FF6347', // Red border for errors
    },
    errorText: {
        fontSize: wp('3.5%'),
        color: '#FF6347', // Red color for error messages
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
    },
    completedStep: {
        backgroundColor: '#007bff',
    },
});

export default SkillsProfile;
