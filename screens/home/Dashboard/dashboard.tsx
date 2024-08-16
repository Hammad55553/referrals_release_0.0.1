import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {LoggedInUserState} from '../../../redux/features/authSlice';
import {AppDispatch, RootState} from '../../../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {
  DashboardData,
  getDashboardDataForUser,
} from '../../../redux/features/dashboardSlice';
import {logger} from 'react-native-logs';
import {fetchPostsTwo, Post} from '../../../redux/features/viewPostSlice';
import PostItem from '../../../components/PostFlow/posts'; // Ensure correct import
import {StackNavigationProp} from '@react-navigation/stack';

var log = logger.createLogger();

const Dashboard = props => {
  const dispatch: AppDispatch = useDispatch();
  const isFocused = useIsFocused();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const loggedInUser: LoggedInUserState = useSelector(
    (state: RootState) => state.auth.loggedInUser,
  );

  const firebaseIDToken: string | null = useSelector(
    (state: RootState) => state.auth.firebaseIDToken,
  );

  const dashboardData: DashboardData = useSelector(
    (state: RootState) => state.dashboard.dashboardData,
  );

  const posts: Post[] = useSelector(
    (state: RootState) => state.viewPosts.posts,
  );

  const startingFunctions = () => {
    if (firebaseIDToken) {
      dispatch(getDashboardDataForUser(firebaseIDToken));
      dispatch(
        fetchPostsTwo({
          firebaseIDToken: firebaseIDToken,
        }),
      );
    }
  };

  useEffect(() => {
    if (isFocused) {
      startingFunctions();
    }
  }, [props, isFocused]);

  const handleNavigateToSubleaseForm = () => {
    navigation.navigate('SubleaseRental', {defaultView: 'viewPosts'}); // Adjust screen name if needed
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Hi {loggedInUser.firstName}</Text>
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{dashboardData.requestSent}</Text>
          <Text style={styles.statLabel}>Requests sent</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{dashboardData.postsMade}</Text>
          <Text style={styles.statLabel}>Posts made</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{dashboardData.requestReceived}</Text>
          <Text style={styles.statLabel}>Requests received</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{dashboardData.requestRejected}</Text>
          <Text style={styles.statLabel}>Requests rejected</Text>
        </View>
      </View>
      <View style={styles.actionsContainer}>
        <Action text="Verification" icon="info" navigation={navigation} />
        <Action text="Quick message" icon="message" navigation={navigation} />
        <Action text="Your posts" icon="edit" navigation={navigation} />
        <Action text="Sent requests" icon="send" navigation={navigation} />
        <Action
          text="Invite friends"
          icon="person-add"
          navigation={navigation}
        />
      </View>
      <View style={styles.exploreheader}>
        <Text style={styles.header2}>Explore</Text>
        <TouchableOpacity onPress={handleNavigateToSubleaseForm}>
          <Text style={styles.header3}>Go to sublease rental</Text>
        </TouchableOpacity>
      </View>
      <View>
        {posts.length > 0 &&
          posts.map((post, index) => <PostItem key={index} post={post} />)}
      </View>
      <View style={styles.emptyspace} />
    </ScrollView>
  );
};

const Action = ({text, icon, navigation}) => {
  const handlePress = () => {
    switch (text) {
      case 'Verification':
        navigation.navigate('Screens/Dashboard/Verification');
        break;
      case 'Quick message':
        navigation.navigate('Screens/QuickMessage');
        break;
      case 'Your posts':
        navigation.navigate('Screens/Dashboard/YourPosts');
        break;
      case 'Sent requests':
        navigation.navigate('Screens/Dashboard/SentRequests');
        break;
      case 'Invite friends':
        navigation.navigate('Screens/Dashboard/InviteFriend');
        break;
      // Add other cases here for different actions
      default:
        // Default navigation or alert if no specific screen
        alert(`No screen for ${text}`);
    }
  };

  return (
    <TouchableOpacity style={styles.action} onPress={handlePress}>
      <Icon name={icon} size={20} color="#2441D0" />
      <Text style={styles.actionText}>{text}</Text>
      <Icon name="arrow-forward-ios" size={20} color="#2441D0" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  emptyspace: {
    height: 50,
  },
  exploreheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    color: 'black',
  },
  header2: {
    fontSize: 20,
    marginBottom: 10,
    marginTop: 10,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: 'black',
  },
  header3: {
    fontSize: 12,
    marginBottom: 10,
    marginTop: 10,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: '#2441D0',
    textDecorationLine: 'underline', // Add underline style here
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    shadowColor: '#000',
  },
  statNumber: {
    fontSize: 24,
    color: '#2441D0',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
  },
  actionsContainer: {
    width: '100%',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: '#2441D0',
    marginLeft: 10,
  },
  chevron: {
    marginLeft: 'auto',
  },
});

export default Dashboard;
