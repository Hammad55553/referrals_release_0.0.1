import {useEffect, useState} from 'react';
import {logger} from 'react-native-logs';
import {RSA} from 'react-native-rsa-native';
import {Alert} from 'react-native';
import {io, Socket} from 'socket.io-client';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Conversation, updateNewMessages} from '../redux/features/chatSlice';

const log = logger.createLogger();

interface Message {
  from: string;
  to: string;
  message: string;
  mid?: string;
  timestamp?: string;
  attachmentUrl: string;
  chat_id: string;
}

const SOCKET_URL: string = 'wss://chat-app.scrobits.com/';

const useSocket = () => {
  const dispatch: AppDispatch = useDispatch();

  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket>();
  const firebaseIDToken: string | null = useSelector(
    (state: RootState) => state.auth.firebaseIDToken,
  );

  const newMessages: any[] = useSelector(
    (state: RootState) => state.chat.newMessages,
  );

  const selectedConversation: Conversation = useSelector(
    (state: RootState) => state.chat.selectedConversation,
  );

  const connectSocket = async () => {
    let PUBLIC_KEY: string = '';
    let PRIVATE_KEY: string = '';

    // const existingPublicKey = await AsyncStorage.getItem('publicKey');
    // const existingPrivateKey = await AsyncStorage.getItem('pvtKey');
    // if (existingPrivateKey !== null && existingPublicKey !== null) {
    //   // keys already exist in storage
    //   PUBLIC_KEY = existingPublicKey;
    //   PRIVATE_KEY = existingPrivateKey;
    //   log.info('existing public key ', existingPublicKey);
    // } else {
    //   let keyPair = await RSA.generateKeys(4096); //4096 Is the key size
    //   await AsyncStorage.setItem('publicKey', keyPair.public);
    //   await AsyncStorage.setItem('pvtKey', keyPair.private);
    //   PRIVATE_KEY = keyPair.private;
    //   PUBLIC_KEY = keyPair.public;
    //   log.info('new public key ', keyPair.public);
    // }

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      auth: {
        token: firebaseIDToken,
        publickey: PUBLIC_KEY, // Send public key as part of the connection authentication
      },
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      log.info('Connected to Socket.IO server.');
    });

    newSocket.on('disconnected', data => {
      log.info('Disconnected from Socket.IO server.');
      log.info('data ', data);
    });

    newSocket.on('PRIVATE_MESSAGE', async (encryptedMessage, ackCallback) => {
      // log.info('Received encrypted message', encryptedMessage);
      try {
        // const getPvtKey = await AsyncStorage.getItem('pvtKey');
        // if (!getPvtKey) {
        //   throw new Error('Private key not found');
        // }

        // Ensure no line breaks or unwanted characters
        // const modifiedMessage = encryptedMessage.msg.replace(/\r\n|\n|\r/g, '');
        // log.info('Modified message', modifiedMessage);

        // Decrypt the message
        // const decryptedMessage = await RSA.decrypt(modifiedMessage, getPvtKey);
        // log.info(`Received and decrypted message: ${decryptedMessage}`);
        // const decryptedMessage = await RSA.decrypt(modifiedMessage, getPvtKey);
        // log.info(`Received and decrypted message: ${decryptedMessage}`);

        setMessages(prevMessages => [
          ...prevMessages,
          {...encryptedMessage, msg: encryptedMessage.msg},
        ]);

        // setMessages(prevMessages => [
        //   ...prevMessages,
        //   {...encryptedMessage, message: decryptedMessage},
        // ]);

        ackCallback();
      } catch (error) {
        log.error('Decryption failed:', error);
        Alert.alert('Decryption failed:', error.message);
      }
    });

    newSocket.on('GET_MESSAGES', data => {
      log.info('get messages event.');
      log.info('get messages ', JSON.stringify(data));
      setMessages(data);
      dispatch(updateNewMessages(data));
    });

    newSocket.on('ACKNOWLEDGEMENT', data => {
      log.info('Acknowledgement connected');
      log.info(data);
    });

    newSocket.on('READ_RECEIPTS', data => {
      log.info('read receipts connected');
      log.info(data);
    });

    return () => {
      newSocket.off('connect');
      newSocket.off('disconnected');
      newSocket.off('PRIVATE_MESSAGE');
      newSocket.off('GET_MESSAGES');
      newSocket.off('ACKNOWLEDGEMENT');
      newSocket.off('READ_RECEIPTS');
      newSocket.disconnect();
      log.info('Socket connection and event listeners cleaned up.');
    };
  };

  useEffect(() => {
    log.info('firebase id token ', firebaseIDToken);

    const initializeSocket = async () => {
      connectSocket();
    };

    initializeSocket();
  }, []);

  const decryptMessage = async (messageBody: string) => {
    try {
      // const getPvtKey = await AsyncStorage.getItem('pvtKey');
      // if (!getPvtKey) {
      //   throw new Error('Private key not found');
      // }
      const modifiedMessage = messageBody.replace(/\r\n|\n|\r/g, '');

      // Decrypt the message
      log.info('received message body ', messageBody);
      // log.info('using pvt key ', getPvtKey);
      // const decryptedMessage = await RSA.decrypt(modifiedMessage, getPvtKey);
      // log.info(`Received and decrypted message: ${decryptedMessage}`);
      return messageBody;
    } catch (error) {
      log.error('Decryption failed:', error);
      Alert.alert('Decryption failed:', error.message);
    }
    return '';
  };

  const updateReadReceipt = async (message: any) => {
    if (socket) {
      socket.emit('READ_RECEIPTS', message);
    }
  };

  const userGetMessages = async (
    fromIndex: number = 0,
    count: number = 10,
    request_id: string = '',
  ) => {
    const chat_id = request_id;
    if (socket) {
      socket.emit('GET_MESSAGES', {chat_id, fromIndex, count});
    }
  };

  const sendMessage = async (message: Message, recipientPublicKey: string) => {
    if (message.message.trim()) {
      try {
        // Encrypt the message using the recipient's public key with RSA
        // const encryptedMessage = await RSA.encrypt(
        //   message.msg,
        //   recipientPublicKey,
        // );

        const msgObject: Message = {
          from: message.from,
          to: message.to,
          message: message.message, // Assuming RSA.encrypt returns base64 encoded string
          mid: message.mid || Date.now().toString(), // Generate a unique ID if not provided
          attachmentUrl: message.attachmentUrl,
          chat_id: message.chat_id,
        };

        log.info(`Sending encrypted message: ${JSON.stringify(msgObject)}`);
        if (socket) {
          socket.emit('PRIVATE_MESSAGE', msgObject, acknowledgement => {
            //callback method
            log.info('logging acknowledgement ', acknowledgement);
          });
        }

        // Update messages array with the outgoing message
        setMessages(prevMessages => [
          ...prevMessages,
          {...message, message: message.message},
        ]);

        dispatch(updateNewMessages([...newMessages, message]));
      } catch (error) {
        log.error('Encryption or sending failed:', error);
        // Optionally, handle the error in a user-friendly way
        Alert.alert('Failed to send message:', error.message);
      }
    }
  };

  return {
    messages,
    sendMessage,
    userGetMessages,
    updateReadReceipt,
    decryptMessage,
  };
};

export default useSocket;
