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
    FlatList,
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const predefinedSuggestions = [
    'JavaScript', 'Python', 'React Native', 'Node.js', 'Java', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin',
];

const SkillsProfile = () => {
    const navigation = useNavigation();
    const [currentStep, setCurrentStep] = useState(6);
    const [title, setTitle] = useState('');
    const [skills, setSkills] = useState<string[]>([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleAddSkill = () => {
        if (skills.length >= 10) {
            Alert.alert('Limit Reached', 'You can only add up to 10 skills.');
            return;
        }
        if (title && !skills.includes(title)) {
            setSkills([...skills, title]);
            setTitle('');
            setFilteredSuggestions([]);
        }
    };

    const handleSaveAndContinue = async () => {
        if (skills.length === 0) {
            Alert.alert('No Skills', 'You need to add at least one skill.');
            return;
        }
        try {
            setLoading(true);
            await axios.post('https://acea-59-103-217-174.ngrok-free.app/skills/', { skills });
            setCurrentStep(6);
            navigation.navigate('Profile/Links' as never);
        } catch (error) {
            console.error('Error saving skills:', error.response ? error.response.data.message : error.message);
            Alert.alert('Error', error.response ? error.response.data.message : 'There was an issue saving the skills.');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    const handleSkip = () => {
        setCurrentStep(6);
        navigation.navigate('Profile/Links' as never);
    };

    const handleInputChange = (text: string) => {
        setTitle(text);
        if (text) {
            setFilteredSuggestions(predefinedSuggestions.filter(suggestion =>
                suggestion.toLowerCase().includes(text.toLowerCase())
            ));
        } else {
            setFilteredSuggestions([]);
        }
    };

    const handleSuggestionPress = (suggestion: string) => {
        setTitle(suggestion);
        setFilteredSuggestions([]);
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
                            <Text style={styles.headerTitle}>Skills <Text style={styles.headerTitle1}>{'(Max 10 skills)'}</Text></Text>
                        </View>

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
                                Skills <Text style={styles.required}>*</Text>
                            </Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Add Skills"
                                placeholderTextColor="#888"
                                value={title}
                                onChangeText={handleInputChange}
                                clearButtonMode="while-editing"
                            />
                            {filteredSuggestions.length > 0 && (
                               <FlatList
                               data={filteredSuggestions}
                               keyExtractor={(item) => item}
                               renderItem={({ item }) => (
                                   <TouchableOpacity
                                       style={styles.suggestion}
                                       onPress={() => handleSuggestionPress(item)}
                                   >
                                       <Icon name="arrow-outward" size={wp('4%')} style={styles.suggestionIcon} />
                                       <Text style={styles.suggestionText}>{item}</Text>
                                   </TouchableOpacity>
                               )}
                               style={styles.suggestionList}
                               nestedScrollEnabled={true} // Allow nested scrolling
                           />
                            )}

                            <View style={styles.skillsListContainer}>
                                {skills.map((skill, index) => (
                                    <View key={index} style={styles.skillItemContainer}>
                                        <Text style={styles.skillItem}>{skill}</Text>
                                        <TouchableOpacity
                                            onPress={() => handleRemoveSkill(skill)}
                                            style={styles.removeButton}
                                        >
                                            <Icon name="close" size={wp('4%')} color="#1A73E8" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>

                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={handleAddSkill}
                            >
                                <Icon name="add" size={wp('5%')} color="#FFF" />
                                <Text style={styles.addButtonText}>Add skill</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSaveAndContinue}
                                disabled={loading}
                            >
                                <Text style={styles.saveButtonText}>
                                    {loading ? 'Saving...' : 'Save & Continue'}
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
    }, headerTitle1: {
        right: wp(10),
        fontSize: wp('5%'),
        top: hp('8%'),
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'left',
        color: 'grey',
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
        color: '#FF6347',
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
    buttonContainer: {
        marginTop: hp('38%'),
        paddingHorizontal: wp('4%'),
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp('4%'),
        justifyContent: 'flex-end',
        marginTop: hp('2%'),
        backgroundColor: '#4285F4',
        paddingVertical: hp('1%'),
        borderRadius: wp('2%'),
        marginRight:wp('65%'),
    },
    addButtonText: {
        fontSize: wp('3.5%'),
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: wp('2%'),
    },
    suggestionList: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: wp('2%'),
        marginTop: hp('-1%'),
        maxHeight: hp('20%'),
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2, // for Android shadow
    },
    suggestion: {
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('4%'),
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        flexDirection: 'row',
        alignItems: 'center',
    },
    suggestionText: {
        fontSize: wp('4%'),
        color: '#000',
    },
    suggestionIcon: {
        marginRight: wp('3%'),
        color: '#007bff',
    },
    skillsListContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: hp('2%'),
        marginBottom: hp('2%'),
    },
    skillItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('1%'),
        borderRadius: wp('5%'),
        marginRight: wp('2%'),
        marginBottom: hp('1%'),
    },
    skillItem: {
        fontSize: wp('4%'),
        color: '#4285F4',
    },
    removeButton: {
        marginLeft: wp('1%'),
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

export default SkillsProfile;





