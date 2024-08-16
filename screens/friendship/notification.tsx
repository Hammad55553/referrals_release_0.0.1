import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const notifications = [
    { id: '1', name: 'John Smith', role: ' | Designer, Microsoft', type: 'request', time: '15h', image: require('../../assets/images/img-1.png') },
    { id: '2', name: 'Sneha Verma', role: ' | Designer, Microsoft', type: 'request', time: '15h', image: require('../../assets/images/img-2.png') },
    { id: '3', name: 'Illeana Hersbey', role: ' | Designer, Microsoft', type: 'accepted', time: '15h', image: require('../../assets/images/img-3.png') },
    { id: '4', name: 'Varman Hardison', role: ' | Designer, Microsoft', type: 'accepted', time: '15h', image: require('../../assets/images/img-4.png') },
    { id: '5', name: 'Illeana Hersbey', role: ' | Designer, Microsoft', type: 'accepted', time: '15h', image: require('../../assets/images/img-5.png') },
];

const NotificationItem = ({ item, onReject, onAccept }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [isRejected, setIsRejected] = useState(false);
    const [highlightedButton, setHighlightedButton] = useState(null);

    const handlePress = (button) => {
        setHighlightedButton(button);
    };

    const handleReject = () => {
        setIsRejected(true);
        onReject(item.id);
    };

    return (
        <View>
            {isRejected && (
                <View style={styles.rejectedBanner}>
                    <Text style={styles.rejectedText}>Request Rejected</Text>
                </View>
            )}
            <View style={styles.notificationItem}>
                <Image source={item.image} style={styles.profileImage} />

                <View style={styles.notificationDesign}>
                    <View style={styles.notificationText}>
                        <View style={styles.leftMessage}>
                            <View style={styles.flex}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.role}>{item.role}</Text>
                            </View>
                            <Text style={styles.message}>
                                {item.type === 'request' ? 'You got a message request, Accept to start chatting!' : 'Your request got accepted, start messaging here!'}
                            </Text>
                        </View>
                        <View style={styles.rightMessage}>
                            <Text style={styles.time}>{item.time}</Text>
                            <TouchableOpacity style={styles.moreButton} onPress={() => setShowOptions(!showOptions)}>
                                <FontAwesome name="ellipsis-h" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.actionContainer}>
                        <View style={styles.actionButtons}>
                            {item.type === 'request' ? (
                                <>
                                    <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
                                        <Text style={styles.buttonTextReject}>Reject</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.acceptButton} onPress={() => onAccept(item.id)}>
                                        <Text style={styles.buttonTextAccept}>Accept</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <TouchableOpacity style={styles.chatNowButton}>
                                    <Text style={styles.buttonTextChat}>Chat Now</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
                {showOptions && (
                    <View style={styles.optionsContainer}>
                    <TouchableOpacity
                        style={[styles.optionButton, highlightedButton === 'block' && styles.highlighted]}
                        onPress={() => handlePress('block')}
                    >
                        <Image source={require('../../assets/images/block-symbol.png')} style={styles.symbols} />
                        <Text style={styles.optionText}>Block</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.optionButton, highlightedButton === 'delete' && styles.highlighted]}
                        onPress={() => handlePress('delete')}
                    >
                        <Image source={require('../../assets/images/delete-symbol.png')} style={styles.symbols} />
                        <Text style={styles.optionText}>Delete</Text>
                    </TouchableOpacity>
                </View>
                )}
            </View>
        </View>
    );
};

const NotificationsScreen = ({ navigation }) => {
    const [acceptedRequest, setAcceptedRequest] = useState(null);

    const handleAccept = (id) => {
        setAcceptedRequest(id);
    };

    const handleReject = (id) => {
        console.log('Rejected request ID:', id);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backRectangle}>
                    <Image source={require('../../assets/icons/chevronleft.png')} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>
            <View style={styles.instructions}>
                <View style={styles.upperInstruc}>
                    <Text style={styles.instructionTitle}>Instructions</Text>
                    {<Image source={require('../../assets/icons/i-icon.png')} style={styles.Iicon} />}
                </View>
                <View style={styles.line}></View>
                <View style={styles.lowerInstruc}>
                    <Text style={styles.instructionTextLeft}>
                        <FontAwesome name="times-circle" size={11} color="#E64646" /> Swipe Left to reject
                    </Text>
                    <Text style={styles.instructionTextRight}>
                        <FontAwesome name="check-circle" size={11} color="green" /> Swipe Right to Accept
                    </Text>
                </View>
            </View>
            {acceptedRequest && (
                <View style={styles.acceptedBanner}>
                    <Text style={styles.acceptedText}>Request Accepted</Text>
                </View>
            )}
            <FlatList
                data={notifications}
                style={styles.notifications}
                renderItem={({ item }) => <NotificationItem item={item} onAccept={handleAccept} onReject={handleReject} />}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.notificationsList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f1',
        width: '100%',
        padding: 0,
        margin: 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    notifications: {
        marginBottom: 0,
        padding: 0,
        margin: 0,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 38,
        color: 'black',
    },
    moreButton: {
        padding: 8,
        right:-8,
    },
    backRectangle: {
        width: 39,
        height: 39,
        position: 'absolute',
        top: 10,
        left: 10,
        marginRight: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D8DADC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    instructionTitle: {
        color: 'black',
        fontSize: 11.11,
        fontWeight: 'bold',
    },
    Iicon: {
        left: 300,
        top: -10,
        height: 12,
        width: 12,
    },
    instructions: {
        padding: 10,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        color: 'black',
        marginHorizontal: 8,
        borderRadius: 10,
        marginBottom:12,
    },
    upperInstruc: {},
    line: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 0,
    },
    lowerInstruc: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 25,
        paddingVertical: 5,
    },
    instructionTextLeft: {
        fontSize: 12,
        color: '#E64646',
        left: 20,
    },
    instructionTextRight: {
        fontSize: 12,
        color: '#188038',
        left: -20,
    },
    notificationsList: {
        padding: 0,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 0,
        width: '100%',
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
        top: -15,
        left: -2,
    },
    notificationDesign: {
        flex: 1,
        flexDirection: 'column',
    },
    notificationText: {
        flex: 1,
        flexDirection: 'row',
        gap: 25,
    },
    leftMessage: {
        flex: 1,
    },
    flex: {
        flex: 1,
        flexDirection: 'row',
    },
    rightMessage: {
        alignItems: 'flex-end',
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
        top: 2.5,
        left: -10,
    },
    role: {
        fontSize: 12,
        color: '#767F8C',
        top: 2.5,
        left: -10,
    },
    message: {
        fontSize: 10,
        color: '#666',
        marginTop: 5,
        top:-6,
        left: -10,
    },
    time: {
        fontSize: 10,
        color: '#475569',

        top: 6,
        left: -4,
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        gap: 15,
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 15,
        left: -10,
    },
    rejectButton: {
       height:30,
        paddingVertical: 8,
        paddingHorizontal: 25,
        backgroundColor: '#FCE9E9',
        borderRadius: 20,
        borderColor:'#E64646',
        borderWidth:1,
    },
    acceptButton: {
     height:30,
     
        paddingVertical: 8,
        paddingHorizontal: 25,
        backgroundColor: '#E9FBEE',
        borderRadius: 20,
        borderWidth:1,
        borderColor:'#34A853',

    },
    chatNowButton: {
     height:30,
        paddingVertical: 8,
        paddingHorizontal: 25,
        backgroundColor: '#2441D0',
        borderRadius: 20,
    },
    buttonTextReject: {
        color: '#E64646',
        fontSize: 10,
        fontWeight: '400',
    },
    buttonTextAccept: {
        color: '#34A853',
        fontSize: 10,
        fontWeight: '400',
    },
    buttonTextChat: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '400',
    },
    acceptedBanner: {
        backgroundColor: '#E9FBEE',
        padding: 8,
        borderRadius: 5,
        borderColor: '#c3e6cb',
        borderWidth: 1,
        alignItems: 'center',
        width: '100%',
        marginVertical: 10,
        top:9,
        marginTop:-4,
    },
    acceptedText: {
        color: '#155724',
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 23.4,
    },
    rejectedBanner: {
        backgroundColor: '#FFE2E0',
        padding: 8,
        borderRadius: 5,
        borderColor: '#f5c6cb',
        borderWidth: 1,
        alignItems: 'center',
        width: '100%',
        marginVertical: 10,
        top:9,
        marginTop:-4,
    },
    rejectedText: {
        color: '#721c24',
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 23.4,
    },
    optionsContainer: {
     position: 'absolute',
     top: 45,
     right: 7,
     backgroundColor: '#FFFFFF',
     borderRadius: 4,
     borderWidth: 1,
     borderColor: '#ddd',
     shadowColor: '#000',
     shadowOpacity: 0.1,
     shadowRadius: 4,
     elevation: 4,
     zIndex: 1,
     width: 127,
     height: 66,
     padding:4,
 },
 optionButton: {
     flex: 1,
     flexDirection: 'row',
     alignItems: 'center',
     padding: 6,
     backgroundColor: '#FFFFFF',
 },
 optionText: {
     color: 'black',
     fontSize: 12.7,
     marginLeft: 8, // Space between icon and text
 },
 symbols: {
     height: 14.51,
     width: 14.51,
 },
 highlighted: {
     backgroundColor: '#E5E4E4',
 },
});

export default NotificationsScreen;