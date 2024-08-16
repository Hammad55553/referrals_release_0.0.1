import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  useWindowDimensions,
} from 'react-native';
import {
  Conversation,
  getConversationBetweenUsers,
  updateUnreadBadgeCount,
} from '../../redux/features/chatSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {logger} from 'react-native-logs';
import {ChatPreview} from './ChatPreview';
import React from 'react';
import {LoggedInUserState} from '../../redux/features/authSlice';

var log = logger.createLogger();

export function Chats() {
  const dispatch: AppDispatch = useDispatch();

  const messageFlowScreen: 'Messages' | 'Requests' = useSelector(
    (state: RootState) => state.chat.messageFlowScreen,
  );

  const conversationBetweenUsers: Conversation[] = useSelector(
    (state: RootState) => state.chat.conversationBetweenUsers,
  );

  const loggedInUser: LoggedInUserState = useSelector(
    (state: RootState) => state.auth.loggedInUser,
  );

  const {height} = useWindowDimensions();

  const [unreadChatsList, setUnreadChatsList] = useState<Conversation[]>([]);
  const [readChatsList, setReadChatsList] = useState<Conversation[]>([]);

  const firebaseIDToken: string | null = useSelector(
    (state: RootState) => state.auth.firebaseIDToken,
  );

  let counter: number = 0;

  useEffect(() => {
    let unread: Conversation[] = [];
    let read: Conversation[] = [];
    conversationBetweenUsers.map((convo: Conversation) => {
      log.info('this is your convo ', JSON.stringify(convo));
      if (convo.messages.from === loggedInUser.uid) {
        read.push(convo);
      } else {
        if (
          convo.messages.status === 'SENT' ||
          convo.messages.status === 'DELIVERED'
        ) {
          unread.push(convo);
          counter++;
        } else {
          read.push(convo);
        }
      }
    });
    dispatch(updateUnreadBadgeCount(counter));
    setUnreadChatsList(unread);
    setReadChatsList(read);
  }, [conversationBetweenUsers]);

  useEffect(() => {
    if (firebaseIDToken) {
      dispatch(getConversationBetweenUsers(firebaseIDToken));
    }
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      style={[styles.scrollView, {height: height - 30}]}>
      {messageFlowScreen === 'Messages' && (
        <View>
          <Text style={styles.unreadHeading}>
            Unread -{' '}
            {unreadChatsList.length === 0 ? '' : unreadChatsList.length}
          </Text>
          {unreadChatsList.length === 0 ? (
            <Text style={styles.unreadNoMessages}>
              You have no unread messages.
            </Text>
          ) : (
            unreadChatsList.map((chat, index) => (
              <ChatPreview key={index} index={index} chat={chat} />
            ))
          )}
          <Text style={styles.unreadHeading}>Others</Text>
          {readChatsList.length === 0 ? (
            <Text style={styles.unreadNoMessages}>
              You have no read messages.
            </Text>
          ) : (
            readChatsList.map((chat, index) => (
              <ChatPreview key={index} index={index} chat={chat} />
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingBottom: 30, // leaves 30 pixels from the bottom
    marginTop: 10,
    marginHorizontal: 15,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  unreadHeading: {
    fontWeight: '700',
    color: '#090A0A',
    fontSize: 16,
  },
  unreadNoMessages: {
    fontWeight: '400',
    color: '#090A0A',
    fontSize: 18,
    textAlign: 'left',
    marginVertical: 10,
  },
});
