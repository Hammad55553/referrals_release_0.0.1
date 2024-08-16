import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  useWindowDimensions,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Conversation} from '../../redux/features/chatSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {logger} from 'react-native-logs';
import {getRequestsForUser, Request} from '../../redux/features/requestSlice';
import {format} from 'date-fns';
import useSocket from '../../hooks/useSocket';
import {Swipeable} from '../../screens/sampleCard';

var log = logger.createLogger();

const {width} = Dimensions.get('window');
const adjustedWidth = width - 30;

export function Requests() {
  const dispatch: AppDispatch = useDispatch();
  const {decryptMessage} = useSocket();

  const messageFlowScreen: 'Messages' | 'Requests' = useSelector(
    (state: RootState) => state.chat.messageFlowScreen,
  );

  const conversationBetweenUsers: any[] = useSelector(
    (state: RootState) => state.chat.conversationBetweenUsers,
  );

  const firebaseIDToken: string | null = useSelector(
    (state: RootState) => state.auth.firebaseIDToken,
  );

  const requests: Request[] = useSelector(
    (state: RootState) => state.request.requestsForUser,
  );

  const {height} = useWindowDimensions();

  const GradientSwipeableItem = ({item}) => {
    const [decryptedMessage, setDecryptedMessage] = useState<string>('');

    const fetchDecryptedMessage = async () => {
      if (item?.messages?.message) {
        log.info(
          'sending encrypted message from request page ',
          item?.messages?.message,
        );
        const getDecryptedMessage = await decryptMessage(
          item?.messages?.message,
        );
        log.info('decrypted string here ', getDecryptedMessage);
        setDecryptedMessage(getDecryptedMessage);
      }
    };

    useEffect(() => {
      fetchDecryptedMessage();
    }, []);

    return (
      <Swipeable item={item}>
        <View style={[styles.mappedRequest, {backgroundColor: 'white'}]}>
          <View style={{flexDirection: 'row', width: '75%'}}>
            <View>
              <Image
                source={{
                  uri:
                    item?.receiver?.profilePhoto !== undefined
                      ? item.receiver.profilePhoto
                      : 'https://png.pngtree.com/png-clipart/20210129/ourmid/pngtree-blue-default-avatar-png-image_2813123.jpg',
                }}
                style={styles.chatAvatar}
              />
            </View>
            <View style={styles.requestInfoView}>
              <Text>
                {item?.receiver?.firstName + ' ' + item?.receiver?.lastName}
              </Text>
              <Text>{decryptedMessage}</Text>
            </View>
          </View>
          <View
            style={{
              width: '25%',
              alignItems: 'flex-end',
              flexDirection: 'column',
            }}>
            <TouchableOpacity>
              <Text>{format(new Date(item?.timestamp), 'dd MMM')}</Text>
            </TouchableOpacity>
            <Icon name="more-horiz" size={24} color="black" />
          </View>
        </View>
      </Swipeable>
    );
  };

  useEffect(() => {
    let unread: Conversation[] = [];
    let read: Conversation[] = [];
    conversationBetweenUsers.map((convo: Conversation) => {
      if (
        convo.messages.status === 'SENT' ||
        convo.messages.status === 'DELIVERED'
      ) {
        unread.push(convo);
      } else {
        read.push(convo);
      }
    });
  }, [conversationBetweenUsers]);

  useEffect(() => {
    if (firebaseIDToken) {
      dispatch(getRequestsForUser(firebaseIDToken));
    }
  }, []);

  return (
    <View style={[styles.container, {height: height - 30}]}>
      {messageFlowScreen === 'Requests' && (
        <View style={styles.requestParentView}>
          <FlatList
            data={requests}
            renderItem={({item}) => <GradientSwipeableItem item={item} />}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.flatListContent}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  leftSwipeParentView: {
    backgroundColor: '#d4f7de',
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftSwipeText: {
    color: '#309c4d',
    fontWeight: '700',
    fontSize: 16,
  },
  rightSwipeParentView: {
    backgroundColor: '#f9d2d2',
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSwipeText: {
    color: '#e33535',
    fontWeight: '700',
    fontSize: 16,
  },
  requestInfoView: {
    width: '50%',
  },
  mappedRequest: {
    width: adjustedWidth,
    backgroundColor: '#f8f8f8',
    borderWidth: 2,
    borderColor: '#2441D024',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    // iOS shadow properties
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 35,
    // Android shadow property
    elevation: 5,
  },
  requestParentView: {
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatAvatar: {
    width: 45,
    height: 45,
    borderRadius: 23, // setting half of width to make circle
    resizeMode: 'cover',
    marginRight: 10,
  },
  flatListContent: {
    paddingBottom: 30, // leaves 30 pixels from the bottom
  },
});
