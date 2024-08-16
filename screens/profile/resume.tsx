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
import axios from 'axios';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigation } from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import { DocumentPickerResponse } from 'react-native-document-picker';

const ResumeProfile = () => {
    const navigation = useNavigation();
    const [currentStep, setCurrentStep] = useState(4); // Manage current step state
    const loggedInUser = useSelector((state: RootState) => state.auth.loggedInUser);

    // const [selectedFile, setSelectedFile] = useState<string | null>(null);
// Change the type of selectedFile to DocumentPickerResponse or null
const [selectedFile, setSelectedFile] = useState<DocumentPickerResponse | null>(null);
       
         const handleFilePicker = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      setSelectedFile(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the picker');
      } else {
        throw err;
      }
    }
  };

        const handleDeleteFile = () => {
            setSelectedFile(null); // Remove the selected file
        };
        const handleSave = async () => {
            if (!selectedFile) {
              Alert.alert('No file selected', 'Please select a resume to upload.');
              return;
            }
        
            try {
              const formData = new FormData();
        
              // Create a new File object
              const fileToUpload: {
                uri: string;
                type: string;
                name: string;
              } = {
                uri: selectedFile.uri,
                type: selectedFile.type || 'application/octet-stream', // Default to 'application/octet-stream' if no type
                name: selectedFile.name || 'resume', // A placeholder name
              };
        
              formData.append('resume', fileToUpload as any); // Type assertion to avoid TypeScript error
        
              const response = await axios.post('https://acea-59-103-217-174.ngrok-free.app/resumes/', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
        
              if (response.status === 201) {
                Alert.alert('Success', 'Resume uploaded successfully.');
                setCurrentStep(4); // Move to next step
                navigation.navigate('Profile/Experience' as never);
              } else {
                Alert.alert('Error', 'Failed to upload resume.');
              }
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'An error occurred while uploading the resume.');
            }
          };
        
        
        const handleSkip = () => {
            setCurrentStep(4);
            navigation.navigate('Profile/Experience' as never);
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
                                <Text style={styles.headerTitle}>Upload resume</Text>
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
                                <TouchableOpacity onPress={handleFilePicker} style={styles.filePickerButton}>
                                    <Icon name="cloud-upload" size={wp('10%')} color="#666" />
                                    <Text style={styles.filePickerText}>
                                        Browse and choose the files you want to upload from your computer
                                    </Text>
                                    <View style={styles.plusButton}>
                                        <Icon name="add" size={wp('6%')} color="#fff" />
                                    </View>
                                </TouchableOpacity>

                                {selectedFile && (
                                    <View style={styles.uploadContainer}>
                                        <View style={styles.fileInfo}>
                                            <Icon name="insert-drive-file" size={wp('6%')} color="#1a73e8" />
                                            <Text style={styles.fileName}>{selectedFile.name}</Text>
                                        </View>
                                        <View style={styles.progressBarContainer}>
                                            <View style={styles.progressBar} />
                                            <Text style={styles.progressText}>100%</Text>
                                        </View>
                                        <TouchableOpacity onPress={handleDeleteFile} style={styles.deleteButton}>
                                            <Icon name="delete" size={wp('6%')} color="#e53935" />
                                        </TouchableOpacity>
                                    </View>
                                )}
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
        filePickerButton: {
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#ddd',
            borderWidth: 1,
            borderStyle: 'dashed',
            borderRadius: wp('2%'),
            paddingVertical: hp('5%'),
            paddingHorizontal: wp('5%'),
            position: 'relative',
            marginBottom: hp('2%'),
        },
        filePickerText: {
            marginTop: hp('2%'),
            fontSize: wp('4%'),
            color: '#666',
            textAlign: 'center',
        },
        plusButton: {
            position: 'absolute',
            bottom: -wp('7%'),
            backgroundColor: '#1a73e8',
            borderRadius: wp('50%'),
            width: wp('14%'),
            height: wp('14%'),
            justifyContent: 'center',
            alignItems: 'center',
        },
        uploadContainer: {
            width: '100%',
            marginTop: hp('2%'),
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: wp('2%'),
            padding: wp('3%'),
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
        },
        fileInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        fileName: {
            marginLeft: wp('2%'),
            fontSize: wp('4%'),
            color: '#333',
        },
        progressBarContainer: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: wp('2%'),
        },
        progressBar: {
            flex: 1,
            height: hp('1%'),
            backgroundColor: '#1a73e8',
            borderRadius: wp('1%'),
        },
        progressText: {
            marginLeft: wp('2%'),
            fontSize: wp('3.5%'),
            color: '#666',
        },
        deleteButton: {
            marginLeft: wp('2%'),
        },
        buttonContainer: {
            marginTop: hp('42%'),
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
            backgroundColor: '#007bff',
        },

    });

    export default ResumeProfile;
