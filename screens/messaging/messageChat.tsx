import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {logger} from 'react-native-logs';
import {
  Conversation,
  generatePresignedURL,
} from '../../redux/features/chatSlice';
import {AppDispatch, RootState} from '../../redux/store';
import useSocket from '../../hooks/useSocket';
import {LoggedInUserState} from '../../redux/features/authSlice';
import {launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import {BlurView} from '@react-native-community/blur';

var log = logger.createLogger();

export default function MessageChat() {
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation();
  const selectedConversation: Conversation = useSelector(
    (state: RootState) => state.chat.selectedConversation,
  );
  const loggedInUser: LoggedInUserState = useSelector(
    (state: RootState) => state.auth.loggedInUser,
  );
  const firebaseIDToken: string | null = useSelector(
    (state: RootState) => state.auth.firebaseIDToken,
  );

  const newMessages: any[] = useSelector(
    (state: RootState) => state.chat.newMessages,
  );

  const preSignedUrl: string = useSelector(
    (state: RootState) => state.chat.presignedURL,
  );

  const {messages, sendMessage, userGetMessages} = useSocket();
  const [message, setMessage] = useState<string>('');
  const [attachmentURL, setAttachmentURL] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSendMessage = (attachmentUrl = '') => {
    if (message.trim() || attachmentUrl) {
      const recipientPublicKey = selectedConversation.publicKeyOfReceiver;
      sendMessage(
        {
          from: loggedInUser.uid,
          to: selectedConversation?.receiver?.uid,
          message: message,
          attachmentUrl: attachmentUrl,
          chat_id: selectedConversation._id,
        },
        recipientPublicKey,
      );
      setMessage('');
      setPreviewImage(null);
      setIsModalVisible(false);
    } else {
      log.error('Message or recipient details are missing');
    }
  };

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleFilePicker = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      if (result.length > 0) {
        const file = result[0];
        const fileName = file.name;
        const fileType = file.type;

        if (firebaseIDToken) {
          await dispatch(
            generatePresignedURL({
              fileName: fileName!,
              fileType: fileType!,
              firebaseIDToken: firebaseIDToken,
            }),
          );
        }

        log.info('here it is', preSignedUrl);

        const uploadResponse = await axios.put(preSignedUrl, file, {
          headers: {
            'Content-Type': fileType,
            'x-amz-acl': 'public-read',
          },
        });

        if (uploadResponse.status === 200) {
          const attachmentUrl = preSignedUrl.split('?')[0];
          handleSendMessage(attachmentUrl);
        } else {
          Alert.alert('Upload failed');
        }
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        Alert.alert('File picker error', err.message);
      }
    }
  };

  const handleImagePicker = async () => {
    launchImageLibrary({mediaType: 'photo'}, async response => {
      if (response.didCancel) {
        log.info('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Image picker error', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        const fileName = asset.fileName!;
        const fileType = asset.type!;
        const uri = asset.uri!;

        setPreviewImage(uri);
        setIsModalVisible(true);

        if (firebaseIDToken) {
          const presignedURL = await dispatch(
            generatePresignedURL({
              fileName: fileName,
              fileType: fileType,
              firebaseIDToken: firebaseIDToken,
            }),
          );

          const filePath = uri.replace('file://', '');
          const fileContent = await RNFS.readFile(filePath, 'base64');
          const buffer = Buffer.from(fileContent, 'base64');

          try {
            const uploadResponse = await axios.put(
              presignedURL.payload,
              buffer,
              {
                headers: {
                  'Content-Type': fileType,
                },
              },
            );

            log.info('response ', uploadResponse.status);
            if (uploadResponse.status === 200) {
              setAttachmentURL(presignedURL.payload.split('?')[0]);
            }
          } catch (error) {
            log.info('Error in Image Upload');
            log.info(error.message);
          }
        }
      }
    });
  };

  useEffect(() => {
    log.info('presigned url changes detected');
    log.info(JSON.stringify(preSignedUrl));
  }, [preSignedUrl]);

  useEffect(() => {
    log.info('new messges change detected');
    log.info(JSON.stringify(newMessages));
    if (newMessages.length === 0) {
      userGetMessages(0, 10, selectedConversation._id);
    }
  }, [newMessages]);

  useEffect(() => {
    log.info('calling from message chat - changes detected');
    log.info(JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    log.info('sending chat id as ', selectedConversation._id);
    userGetMessages(0, 10, selectedConversation._id);
  }, []);

  // Create a sorted copy of newMessages
  const sortedMessages = [...newMessages].sort(
    (a, b) =>
      new Date(a?.timestamp!).getTime() - new Date(b?.timestamp!).getTime(),
  );

  const renderItem = ({item}: {item: any}) => (
    <View
      style={[
        styles.messageContainer,
        item.from === loggedInUser.uid
          ? styles.outgoingMessage
          : styles.incomingMessage,
      ]}>
      {!(item.from === loggedInUser.uid) && (
        <Image
          source={{
            uri:
              selectedConversation?.receiver?.profilePhoto ||
              'https://png.pngtree.com/png-clipart/20210129/ourmid/pngtree-blue-default-avatar-png-image_2813123.jpg',
          }}
          style={styles.chatAvatarInsideMessage}
        />
      )}
      {item.attachmentUrl ? (
        <View
          style={[
            item.from === loggedInUser.uid
              ? styles.outgoingMessageColor
              : styles.incomingMessageColor,
            {
              paddingHorizontal: 10,
            },
          ]}>
          <Image
            source={{uri: item.attachmentUrl}}
            style={styles.attachmentImage}
          />
          <Text style={[styles.messageText]}>{item.message}</Text>
        </View>
      ) : (
        <Text
          style={[
            styles.messageText,
            item.from === loggedInUser.uid
              ? styles.outgoingMessageColor
              : styles.incomingMessageColor,
          ]}>
          {item.message}
        </Text>
      )}
      {item.from === loggedInUser.uid && (
        <Image
          source={{uri: loggedInUser.picture}}
          style={styles.chatAvatarInsideMessage}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topView}>
        <TouchableOpacity onPress={handleGoBack}>
          <Image
            source={require('../../assets/images/back.png')}
            style={styles.backImage}
          />
        </TouchableOpacity>
        <Image
          source={{
            uri:
              selectedConversation?.receiver?.profilePhoto ||
              'https://png.pngtree.com/png-clipart/20210129/ourmid/pngtree-blue-default-avatar-png-image_2813123.jpg',
          }}
          style={styles.chatAvatar}
        />
        <Text style={styles.name}>
          {selectedConversation?.receiver?.firstName +
            ' ' +
            selectedConversation?.receiver?.lastName}
        </Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={sortedMessages}
        renderItem={renderItem}
        keyExtractor={item => item.mid?.toString() || item.timestamp}
        style={styles.messagesList}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={5}
        style={styles.keyboardAvoidingView}>
        <View style={styles.chatView}>
          <View style={styles.chatSend}>
            <TouchableOpacity onPress={handleImagePicker}>
              <Image
                source={require('../../assets/images/camera.png')}
                style={styles.camImage}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFilePicker}>
              <Image
                source={require('../../assets/images/paperclip.png')}
                style={styles.camImage}
              />
            </TouchableOpacity>
            <TextInput
              onChangeText={setMessage}
              style={styles.chatWrite}
              placeholder="Write message"
              value={message}
            />
            <TouchableOpacity onPress={() => handleSendMessage(attachmentURL)}>
              <MaterialCommunityIcons name="send" size={30} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {previewImage && (
        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={5}
            style={styles.blurryBackground}>
            <BlurView style={styles.blurView} blurType="light" blurAmount={10}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setPreviewImage(null);
                    setIsModalVisible(false);
                    setAttachmentURL('');
                  }}>
                  <MaterialCommunityIcons name="close" size={30} color="#fff" />
                </TouchableOpacity>
                <Image
                  source={{uri: previewImage}}
                  style={styles.previewImage}
                />
                <TextInput
                  style={styles.captionInput}
                  placeholder="Add a caption"
                  value={message}
                  onChangeText={setMessage}
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={() => handleSendMessage(attachmentURL)}>
                  <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </KeyboardAvoidingView>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chatWrite: {
    flex: 1,
    backgroundColor: '#e7eafe',
    width: '100%',
    minWidth: 250,
    borderRadius: 32,
    marginRight: 10,
    paddingLeft: 20,
    height: 40,
  },
  chatSend: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingTop: 20,
  },
  chatView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 5,
    borderTopColor: '#D9D9D9',
    borderTopWidth: 1,
    maxHeight: 80,
  },
  keyboardAvoidingView: {
    width: '100%',
    // height: 70,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  chatAvatar: {
    width: 45,
    height: 45,
    borderRadius: 23,
    resizeMode: 'cover',
    marginRight: 10,
  },
  chatAvatarInsideMessage: {
    width: 35,
    height: 35,
    borderRadius: 23,
    resizeMode: 'cover',
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  backImage: {
    width: 40,
    height: 40,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  camImage: {
    width: 25,
    height: 25,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  text: {
    color: 'black',
    fontSize: 14,
  },
  gradientGG: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  containerOne: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    padding: 20,
  },
  maskContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  maskedText: {
    fontSize: 48,
    lineHeight: 48,
    color: 'black',
  },
  gradient: {
    flex: 1,
  },
  textStyle: {
    fontSize: 20,
  },
  messagesList: {
    flex: 1,
    width: '100%',
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 15,
    maxWidth: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  messageText: {
    fontSize: 16,
    color: '#000',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  incomingMessage: {
    alignSelf: 'flex-start',
  },
  outgoingMessage: {
    alignSelf: 'flex-end',
  },
  incomingMessageColor: {
    backgroundColor: '#e2e7e9',
  },
  outgoingMessageColor: {
    backgroundColor: '#e2e7e9',
  },
  attachmentImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginTop: 10,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    maxHeight: 300,
    marginRight: 10,
    borderRadius: 20,
    objectFit: 'contain',
  },
  blurryBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurView: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
  },
  captionInput: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: '100%',
    marginTop: 20,
    height: 40,
    textAlign: 'center',
  },
  sendButton: {
    backgroundColor: '#2441D0',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
    minWidth: 120,
    height: 40,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});
