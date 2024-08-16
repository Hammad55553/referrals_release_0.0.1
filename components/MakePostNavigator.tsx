import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

interface ImageItem {
  id: string;
  text: string;
  image: any;
  category: string;
  searchType?: string;
}

const images: ImageItem[] = [
  {
    id: '1',
    text: 'Are you looking someone to sublease?',
    image: require('../assets/images/navigation1.png'),
    category: 'Sublease',
    searchType: 'Offering',
  },
  {
    id: '2',
    text: 'Are you looking Tenants for your property?',
    image: require('../assets/images/navigation2.png'),
    category: 'Rental',
    searchType: 'Looking',
  },
  {
    id: '3',
    text: 'Are you looking for Apartment Mates?',
    image: require('../assets/images/navigation3.png'),
    category: 'ApartmentMate',
  },
];

const MakePostNavigator: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList<ImageItem>>(null);
  const windowWidth = Dimensions.get('window').width;
  const containerWidth = windowWidth - 50; // Adjust as needed

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / containerWidth);
    setCurrentIndex(currentIndex);
  };

  const handleDotPress = (index: number) => {
    flatListRef.current?.scrollToIndex({ animated: true, index });
    setCurrentIndex(index);
  };

  const handleButtonPress = () => {
    const { category, searchType } = images[currentIndex];
    navigation.navigate('SubleaseRental', { category, searchType, defaultView: 'makePosts' });
  };

  const renderItem = ({ item }: { item: ImageItem }) => (
    <View style={[styles.itemContainer, { width: containerWidth }]}>
      <View style={styles.leftContainer}>
        <Text style={styles.text}>{item.text}</Text>
        <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
          <Text style={styles.buttonText}>Make a post</Text>
        </TouchableOpacity>
      </View>
      <Image source={item.image} style={styles.image} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={flatListRef}
        keyExtractor={(item) => item.id}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />
      <View style={styles.dotContainer}>
        {images.map((_, index) => (
          <TouchableOpacity key={index} onPress={() => handleDotPress(index)}>
            <View
              style={[
                styles.dot,
                { backgroundColor: currentIndex === index ? '#000' : '#aaa' },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    height: 199, // Adjust based on your design
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2441D0',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
    marginHorizontal: 10,
  },
  text: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20.8,
    marginBottom: 10,
    color: '#FAFAFA',
  },
  button: {
    backgroundColor: '#FAFAFA',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  buttonText: {
    color: '#2441D0',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  dotContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  image: {
    width: 199.14,
    height: 159,
    resizeMode: 'cover',
  },
});

export default MakePostNavigator;
