import {
  View,
  StyleSheet,
  Text,
  Image,
  TextProps,
  TouchableOpacity,
} from 'react-native';
import {
  Conversation,
  updateSelectedConversation,
} from '../../redux/features/chatSlice';
import {logger} from 'react-native-logs';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import React, {useEffect, useState} from 'react';
import useSocket from '../../hooks/useSocket';
import {RootState} from '../../redux/store';
import {LoggedInUserState} from '../../redux/features/authSlice';

var log = logger.createLogger();

export type ThemedTextProps = TextProps & {
  chat?: Conversation;
  index: number;
};

export function ChatPreview({chat, index}: ThemedTextProps) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {decryptMessage, userGetMessages} = useSocket();
  const [decryptedMessage, setDecryptedMessage] = useState<string>('');

  const selectedConversation: Conversation = useSelector(
    (state: RootState) => state.chat.selectedConversation,
  );

  const loggedInUser: LoggedInUserState = useSelector(
    (state: RootState) => state.auth.loggedInUser,
  );

  const handleChatPress = () => {
    if (chat) {
      dispatch(updateSelectedConversation(chat));
      userGetMessages(0, 10, selectedConversation._id);
    }
    navigation.navigate('Messaging/Chat' as never);
  };

  const formatChatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();

    const adjustForTimezone = (date: Date): Date => {
      const timezoneOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
      return new Date(date.getTime() - timezoneOffset);
    };

    const adjustedDate = adjustForTimezone(date);
    const adjustedNow = adjustForTimezone(now);

    log.debug('adjusted date ', adjustedDate);
    log.debug('adjusted current date ', adjustedNow);

    const isToday =
      adjustedDate.getDate() === adjustedNow.getDate() &&
      adjustedDate.getMonth() === adjustedNow.getMonth();

    const yesterday = new Date(adjustedNow);
    yesterday.setDate(adjustedNow.getDate() - 1);
    const isYesterday =
      adjustedDate.getDate() === yesterday.getDate() &&
      adjustedDate.getMonth() === yesterday.getMonth();
    if (isToday) {
      return adjustedDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (isYesterday) {
      return 'yesterday';
    } else {
      return adjustedDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
      });
    }
  };

  const fetchDecryptedMessage = async () => {
    if (chat?.messages.to === loggedInUser.uid) {
      //msg sent by someone else
      //msg is encrypted by loggedin user public key - decrypting message property
      if (chat?.messages?.message) {
        log.info('sending encrypted message ', chat?.messages?.message);
        const getDecryptedMessage = await decryptMessage(
          chat?.messages?.message,
        );
        log.info('decrypted string here ', getDecryptedMessage);
        setDecryptedMessage(getDecryptedMessage);
      }
    } else {
      //msg sent by me
      //msg is encrypted by receipent's public key - decrypting messageByMe property
      if (chat?.messages?.message) {
        log.info('sending encrypted message ', chat?.messages?.messageByMe);
        const getDecryptedMessage = await decryptMessage(
          chat?.messages?.message,
        );
        log.info('decrypted string here ', getDecryptedMessage);
        setDecryptedMessage(getDecryptedMessage);
      }
    }
  };

  useEffect(() => {
    fetchDecryptedMessage();
  }, []);

  return (
    <TouchableOpacity key={index} style={styles.chat} onPress={handleChatPress}>
      <Image
        source={{
          uri:
            chat?.receiver?.profilePhoto ||
            'https://png.pngtree.com/png-clipart/20210129/ourmid/pngtree-blue-default-avatar-png-image_2813123.jpg',
        }}
        style={styles.chatAvatar}
      />

      <View style={styles.chatInfo}>
        <View style={styles.chatInfoFirstRow}>
          <Text style={styles.chatInfoPerson}>
            {chat?.receiver?.firstName! + ' ' + chat?.receiver?.lastName!}
          </Text>
          <Text style={styles.chatTimeStamp}>
            {formatChatDate(chat?.messages?.timestamp!)}
          </Text>
        </View>
        <Text style={styles.chatInfoMessage}>{decryptedMessage}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chat: {
    marginVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  chatAvatar: {
    width: 45,
    height: 45,
    borderRadius: 23, // setting half of width to make circle
    resizeMode: 'cover',
    marginRight: 10,
  },
  chatInfo: {
    flexDirection: 'column',
    flex: 1,
  },
  chatInfoFirstRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chatInfoPerson: {
    fontSize: 14,
    color: '#090A0A',
    fontWeight: '500',
  },
  chatInfoMessage: {
    color: '#6C7072',
    fontSize: 14,
    fontWeight: '400',
    maxWidth: 260,
    marginTop: 5,
  },
  chatTimeStamp: {
    color: '#6C7072',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
  },
});
