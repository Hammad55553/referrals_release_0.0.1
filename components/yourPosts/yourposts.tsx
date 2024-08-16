import React, {useEffect} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {fetchPosts, selectPosts} from '../../redux/features/yourPostsSlice';
import {AppDispatch} from '../../redux/store';
import YourPostItem from './yourpostsview';

export default function YourPosts({navigation, route}) {
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector(selectPosts);
  const fromMakePost = route.params?.fromMakePost || false;
  const handleBackPress = () => {
    if (fromMakePost) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Auth/LoginDone'}],
      });
    } else {
      navigation.goBack();
    }
  };

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.head}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}>
          <View style={styles.iconContainer}>
            <Image
              source={require('../../assets/icons/back.png')}
              style={styles.iconLeft}
            />
          </View>
        </TouchableOpacity>
        <Text style={styles.headText}>Your Posts</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {posts.length === 0 && (
          <Text style={styles.noPostsText}>No posts yet</Text>
        )}
        {posts.map((post, index) => (
          <View style={styles.postItemContainer} key={index}>
            <YourPostItem post={post} />
          </View>
        ))}
        {/* Example additional content to test scroll */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8EE',
  },
  headText: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 29.4,
    color: 'black',
    flex: 1, // Ensures the text takes available space
  },
  backButton: {
    marginRight: 16,
  },
  noPostsText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: 'gray',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: '#E2E8EE',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  iconLeft: {
    width: 7,
    height: 13,
    tintColor: '#000000',
  },
  postItemContainer: {
    paddingHorizontal: 16, // Add padding to the sides of each post item
    marginBottom: 16, // Add margin bottom between each post item
  },
});
