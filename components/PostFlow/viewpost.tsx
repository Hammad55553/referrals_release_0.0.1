import React, {useState, useEffect, useCallback} from 'react';
import {Image, ScrollView, Text, View, ActivityIndicator} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useSelector, useDispatch} from 'react-redux';
import {
  fetchPosts,
  selectPosts,
  selectLoading,
  selectError,
  selectHasMore,
  clearPosts,
} from '../../redux/features/viewPostSlice';
import {styles} from '../../styles/subleasestyles';
import {states} from '../../constants/makepostflow/States';
import {AppDispatch} from '../../redux/store';
import PostItem from './posts';
import {viewPostStyles} from '../../styles/viewpoststyles';

export default function ViewPost() {
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector(selectPosts);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const hasMore = useSelector(selectHasMore);
  const [selectedState, setSelectedState] = useState('');
  const categoryMapping = {
    Sublease: 'Sublease',
    Rental: 'Rental',
    'Apartment Mate': 'ApartmentMate',
  };
  const categories = Object.keys(categoryMapping);
  const searchTypes = ['Offering', 'Looking'];
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSearchType, setSelectedSearchType] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(clearPosts());
    dispatch(
      fetchPosts({
        state: selectedState,
        category: categoryMapping[selectedCategory] || '',
        categoryType: selectedSearchType,
        page: 1,
      }),
    );
    setPage(1);
  }, [selectedState, selectedCategory, selectedSearchType, dispatch]);

  const loadMorePosts = useCallback(() => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      dispatch(
        fetchPosts({
          state: selectedState,
          category: categoryMapping[selectedCategory] || '',
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
  ]);

  const handleScroll = (event: any) => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
      loadMorePosts();
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedSearchType('');
  };

  const handleSearchTypeChange = (value: string) => {
    setSelectedSearchType(value);
  };

  const handleStateChange = (value: string) => {
    setSelectedState(value);
  };
  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      onScroll={handleScroll}
      scrollEventThrottle={400}>
      <View style={styles.pickerContainer}>
        <View style={styles.pickerWithIcon}>
          <Image
            source={require('../../assets/icons/search.png')}
            style={styles.dropdownIcon}
          />
          <Picker
            selectedValue={selectedState}
            onValueChange={itemValue => handleStateChange(itemValue)}
            style={styles.picker} //for android
            itemStyle={styles.picker} //for IOS
            dropdownIconColor="gray">
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
      <View style={styles.pickerContainer}>
        <View style={styles.pickerWithIcon}>
          <Image
            source={require('../../assets/icons/search.png')}
            style={styles.dropdownIcon}
          />
          <Picker
            selectedValue={selectedCategory}
            onValueChange={itemValue => handleCategoryChange(itemValue)}
            style={styles.picker} //for android
            itemStyle={styles.picker} //for ios
            dropdownIconColor="gray">
            <Picker.Item label="Search Category" value="" />
            {categories.map((category, index) => (
              <Picker.Item key={index} label={category} value={category} />
            ))}
          </Picker>
        </View>
      </View>
      {(selectedCategory === 'Sublease' || selectedCategory === 'Rental') && (
        <View style={styles.pickerContainer}>
          <View style={styles.pickerWithIcon}>
            <Image
              source={require('../../assets/icons/search.png')}
              style={styles.dropdownIcon}
            />
            <Picker
              selectedValue={selectedSearchType}
              onValueChange={itemValue => handleSearchTypeChange(itemValue)}
              style={styles.picker} //for android
              itemStyle={styles.picker} //for ios
              dropdownIconColor="gray">
              <Picker.Item label="Search Type" value="" />
              {searchTypes.map((type, index) => (
                <Picker.Item key={index} label={type} value={type} />
              ))}
            </Picker>
          </View>
        </View>
      )}
      {/* //container comes here */}
      <View style={styles.line} />
      <View style={viewPostStyles.instructionsContainer}>
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
      {/* {error && (
        <Text style={styles.errorText}>
          {typeof error === 'string' ? error : 'An error occurred'}
        </Text>
      )} */}
      {posts.length === 0 && !loading && (
        <Text style={styles.noPostsText}>No posts yet</Text>
      )}
      {posts.map((post, index) => (
        <PostItem key={index} post={post} />
      ))}
    </ScrollView>
  );
}
