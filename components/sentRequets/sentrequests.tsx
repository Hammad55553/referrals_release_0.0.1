import React, { useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, selectPosts } from '../../redux/features/sentPostReqSlice';
import { AppDispatch } from '../../redux/store';
import SentRequestItem from './sentrequestsview';

export default function SentPosts({ navigation }) {
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector(selectPosts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.head}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <View style={styles.iconContainer}>
            <Image
              source={require('../../assets/icons/back.png')}
              style={styles.iconLeft}
            />
          </View>
        </TouchableOpacity>
        <Text style={styles.headText}>Sent Requests</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {posts.length === 0 && <Text style={styles.noPostsText}>No post requests sent yet</Text>}
        {posts.map((post, index) => (
          <SentRequestItem key={index} post={post} />
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
    flex: 1,
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
    paddingHorizontal: 16, // Add padding horizontal to provide space on the sides
    paddingTop: 12, // Adjust top padding as per your design
    paddingBottom: 16, // Adjust bottom padding as per your design
  },
  iconLeft: {
    width: 7,
    height: 13,
    tintColor: '#000000',
  },
});
