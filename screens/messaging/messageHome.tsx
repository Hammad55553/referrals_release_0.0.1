import {StyleSheet, SafeAreaView} from 'react-native';
import React, {useEffect} from 'react';
// react native navigation imports

// custom components imports
import {CustomTabs} from '../../components/messaging/CustomTabs';
import {MessagingSearchBar} from '../../components/messaging/SearchBar';

// react native logger imports
import {logger} from 'react-native-logs';
import {Chats} from '../../components/messaging/Chats';
import {getConversationBetweenUsers} from '../../redux/features/chatSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {Requests} from '../../components/messaging/Requests';
import {Request} from '../../redux/features/requestSlice';

var log = logger.createLogger();

export default function MessageHome() {
  const dispatch: AppDispatch = useDispatch();

  const firebaseIdToken: string | null = useSelector(
    (state: RootState) => state.auth.firebaseIDToken,
  );

  const messageFlowScreen: 'Messages' | 'Requests' = useSelector(
    (state: RootState) => state.chat.messageFlowScreen,
  );

  const unreadBadgeCount: number = useSelector(
    (state: RootState) => state.chat.unreadChatBadgeCount,
  );

  const requests: Request[] = useSelector(
    (state: RootState) => state.request.requestsForUser,
  );

  useEffect(() => {
    console.log('firebase token ', firebaseIdToken);
    if (firebaseIdToken) {
      dispatch(getConversationBetweenUsers(firebaseIdToken));
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <CustomTabs
        messageCount={unreadBadgeCount}
        requestCount={requests.length || 0}
      />
      <MessagingSearchBar />
      {messageFlowScreen === 'Messages' && <Chats />}
      {messageFlowScreen === 'Requests' && <Requests />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chatHolder: {
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: 'white',
  },
});
