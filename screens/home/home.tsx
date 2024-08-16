import React, { useState, useEffect, useCallback } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchPosts,
  selectPosts,
  selectLoading,
  selectError,
  selectHasMore,
  clearPosts,
  Post,
} from '../../redux/features/viewPostSlice';
import { styles } from '../../styles/subleasestyles';
import { states } from '../../constants/makepostflow/States';
import { AppDispatch, RootState } from '../../redux/store';
import PostItem from '../../components/PostFlow/posts';
import { viewPostStyles } from '../../styles/viewpoststyles';
import MakePostNavigator from '../../components/MakePostNavigator';
import BottomNav from '../../components/BottomNav';
import { logger } from 'react-native-logs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

var log = logger.createLogger();

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector(selectPosts);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const hasMore = useSelector(selectHasMore);
  const [selectedState, setSelectedState] = useState('');
  const categories = ['Sublease', 'Rental', 'Apartment-mate'];
  const searchTypes = ['Offering', 'Looking'];
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSearchType, setSelectedSearchType] = useState('');
  const [page, setPage] = useState(1);
  const [filteredState, setFilteredState] = useState('');
  const [isConnected, setIsConnected] = useState(true); // Track network status
  const firebaseIDToken: string | null = useSelector(
    (state: RootState) => state.auth.firebaseIDToken,
  );

  const postsFetched: Post[] = useSelector(
    (state: RootState) => state.viewPosts.posts,
  );

  useEffect(() => {
    log.info('fetched posts ', JSON.stringify(postsFetched));
  }, [postsFetched]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      // Handle potential null value from state.isConnected
      setIsConnected(state.isConnected ?? false);
    });
  
    // Clean up
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadStoredValues = async () => {
      const savedState = await AsyncStorage.getItem('selectedState');
      const savedCategory = await AsyncStorage.getItem('selectedCategory');
      const savedSearchType = await AsyncStorage.getItem('selectedSearchType');

      if (savedState) {
        setSelectedState(savedState);
        setFilteredState(savedState);
      }
      if (savedCategory) {
        setSelectedCategory(savedCategory);
      }
      if (savedSearchType) {
        setSelectedSearchType(savedSearchType);
      }
      
      if (isConnected) {
        dispatch(fetchPosts({
          state: savedState || '',
          category: savedCategory || '',
          categoryType: savedSearchType || '',
          page: 1,
        }));
      }
    };
    loadStoredValues();
  }, [dispatch, isConnected]);

  useEffect(() => {
    if (selectedState) {
      AsyncStorage.setItem('selectedState', selectedState);
    }
    if (selectedCategory) {
      AsyncStorage.setItem('selectedCategory', selectedCategory);
    }
    if (selectedSearchType) {
      AsyncStorage.setItem('selectedSearchType', selectedSearchType);
    }
    
    if (isConnected) {
      dispatch(clearPosts());
      log.info('firebase token in home ', firebaseIDToken);
      dispatch(
        fetchPosts({
          state: selectedState,
          category: selectedCategory,
          categoryType: selectedSearchType,
          page: 1,
        }),
      );
    }
    setPage(1);
  }, [selectedState, selectedCategory, selectedSearchType, dispatch, isConnected]);

  const loadMorePosts = useCallback(() => {
    if (hasMore && !loading && isConnected) {
      const nextPage = page + 1;
      dispatch(
        fetchPosts({
          state: selectedState,
          category: selectedCategory,
          categoryType: selectedSearchType,
          page: nextPage,
        }),
      );
      setPage(nextPage);
    }
  }, [
    hasMore,
    loading,
    page,
    selectedState,
    selectedCategory,
    selectedSearchType,
    dispatch,
    isConnected,
  ]);

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
      loadMorePosts();
    }
  };

  const handleCategoryChange = (itemValue: string) => {
    if (itemValue === selectedCategory) {
      setSelectedCategory('');
    } else {
      setSelectedCategory(itemValue);
    }
    setSelectedSearchType('');
  };

  const handleSearchTypeChange = (itemValue: string) => {
    if (itemValue === selectedSearchType) {
      setSelectedSearchType('');
    } else {
      setSelectedSearchType(itemValue);
    }
  };

  const onFilterChange = (state: React.SetStateAction<string>) => {
    setFilteredState(state);
    console.log(`Filtered by state: ${state}`);
  };

  const handleStateChange = (itemValue: string) => {
    if (itemValue === selectedState) {
      setSelectedState('');
      onFilterChange('');
      AsyncStorage.removeItem('selectedState');
    } else {
      setSelectedState(itemValue);
      onFilterChange(itemValue);
    }
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        <View style={styles.pickerContainerHome1}>
          <View style={styles.pickerWithIcon}>
            <Image
              source={require('../../assets/icons/search.png')}
              style={styles.dropdownIcon}
            />
            <Picker
              selectedValue={selectedState}
              onValueChange={handleStateChange}
              style={styles.picker} // for Android
              itemStyle={styles.picker} // for iOS
              dropdownIconColor="gray"
            >
              <Picker.Item label="Search State" value="" />
              {states.map((state, index) => (
                <Picker.Item
                  key={index}
                  label={state.label}
                  value={state.value}
                />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.pickerContainerHome2}>
          <View style={styles.pickerWithIcon}>
            <Image
              source={require('../../assets/icons/search.png')}
              style={styles.dropdownIcon}
            />
            <Picker
              selectedValue={selectedCategory}
              onValueChange={handleCategoryChange}
              style={styles.picker} // for Android
              itemStyle={styles.picker} // for iOS
              dropdownIconColor="gray"
            >
              <Picker.Item label="Select a category" value="" />
              {categories.map((category, index) => (
                <Picker.Item key={index} label={category} value={category} />
              ))}
            </Picker>
          </View>
        </View>
        {(selectedCategory === 'Sublease' || selectedCategory === 'Rental') && (
          <View style={styles.pickerContainerHome2}>
            <View style={styles.pickerWithIcon}>
              <Image
                source={require('../../assets/icons/search.png')}
                style={styles.dropdownIcon}
              />
              <Picker
                selectedValue={selectedSearchType}
                onValueChange={handleSearchTypeChange}
                style={styles.picker} // for Android
                itemStyle={styles.picker} // for iOS
                dropdownIconColor="gray"
              >
                <Picker.Item label="Search Type" value="" />
                {searchTypes.map((type, index) => (
                  <Picker.Item key={index} label={type} value={type} />
                ))}
              </Picker>
            </View>
          </View>
        )}
        <MakePostNavigator />
        <View style={viewPostStyles.instructionsContainer2}>
          <View style={viewPostStyles.instructionsHeadingContainer}>
            <Text style={viewPostStyles.instructionsHeading}>Instructions</Text>
            <Image
              source={require('../../assets/icons/instruction.png')}
              style={viewPostStyles.headingIcon}
            />
          </View>
          <View style={viewPostStyles.line} />
          <View style={viewPostStyles.instructionsContent}>
            <View style={viewPostStyles.instructionItem}>
              <Image
                source={require('../../assets/icons/wrong.png')}
                style={viewPostStyles.icon}
              />
              <Text style={viewPostStyles.instructionTextRed}>
                Swipe left to reject
              </Text>
            </View>
            <View style={viewPostStyles.instructionItem}>
              <Image
                source={require('../../assets/icons/right.png')}
                style={viewPostStyles.icon}
              />
              <Text style={viewPostStyles.instructionTextGreen}>
                Swipe right to view details
              </Text>
            </View>
          </View>
        </View>

        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {!isConnected && !loading && (
          <Text style={styles.noPostsText}>Check your internet connection</Text>
        )}
        {isConnected && posts.length === 0 && !loading && (
          <Text style={styles.noPostsText}>No posts yet</Text>
        )}
        {isConnected && posts.map((post, index) => (
          <View key={index} style={viewPostStyles.postContainer}>
            <PostItem key={index} post={post} />
          </View>
        ))}
        <View style={styles.emptyStateContainer} />
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          width: '100%',
        }}
      >
        <BottomNav />
      </View>
    </>
  );
}
