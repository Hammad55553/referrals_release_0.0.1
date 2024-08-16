import React from 'react';
import { View, Text, Image, TextProps } from 'react-native';
import { viewPostStyles } from '../../styles/viewpoststyles';
import moment from 'moment'; // Import moment library
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export interface Address {
  streetNameNumber: string;
  apartMent: string;
  city: string;
  state: string;
  zipcode: string;
  lat: number;
  long: number;
}

export interface PostItemProps {
    post: {
      _id: string;
      category: string;
      categoryType?: string;
      imgUrl: string[];
      titleOfPost: string;
      postDescription?: string; // Example of optional field from backend
      address: Address;
      availableFrom: string;
      priceFrom: { $numberDecimal: string };
      priceTo: { $numberDecimal: string };
      apartmentType?: string;
      facilities: string[];
      id: string; // This should map to _id from backend
    };
  }

const facilitiesIcons = {
  Refrigerator: require('../../assets/icons/facility1.png'),
  'Swimming Pool': require('../../assets/icons/facility2.png'),
  'Air Conditioner': require('../../assets/icons/facility3.png'),
  Gym: require('../../assets/icons/facility3.png'),
  Parking: require('../../assets/icons/facility2.png'),
  'Lorem Ipsum': require('../../assets/icons/facility3.png'),
  'Lorem Ipsum 2': require('../../assets/icons/facility2.png'),
  'Lorem Ipsum 3': require('../../assets/icons/facility1.png'),
  'Lorem Ipsum 4': require('../../assets/icons/facility2.png'),
  'Lorem Ipsum 5': require('../../assets/icons/facility3.png'),
};

const SentRequestItem = ({ post }: PostItemProps) => {
    const dispatch = useDispatch();
    const navigation = useNavigation<StackNavigationProp<any>>();
  
    const imageUrl = post.imgUrl && post.imgUrl.length > 0 ? post.imgUrl[0] : null;
    const formattedDate = moment(post.availableFrom).format('MMMM D, YYYY');
  
    const renderFacilities = () => (
      <View style={viewPostStyles.facilitiesContainer}>
        <View style={viewPostStyles.facilities}>
          {post.facilities.map((facility, index) => (
            <View key={index} style={viewPostStyles.facilityItem}>
              {facilitiesIcons[facility] ? (
                <Image
                  source={facilitiesIcons[facility]}
                  style={viewPostStyles.facilityIcon}
                />
              ) : (
                <Text>{facility}</Text>
              )}
            </View>
          ))}
        </View>
        <View style={viewPostStyles.availabilityContainer}>
          <Text style={viewPostStyles.availability}>Availability</Text>
          <Text style={viewPostStyles.date}>{formattedDate}</Text>
        </View>
      </View>
    );
      if (!post || !post.priceFrom || !post.priceTo) {
      return null; 
    }
  
    if (post.category === 'ApartmentMate') {
      return (
        <View style={viewPostStyles.container}>
          <View style={viewPostStyles.labelContainer}>
            <Text style={viewPostStyles.label}>Apartment Mates</Text>
          </View>
          <View style={viewPostStyles.detailsContainer}>
            <Text style={viewPostStyles.title}>{post.titleOfPost}</Text>
            <Text style={viewPostStyles.smallText3}>{post.address.city} | {post.address.state}</Text>
            <Text style={viewPostStyles.smallText}>Looking From:  <Text style={viewPostStyles.date2}>{formattedDate}</Text></Text>
          </View>
        </View>
      );
    }
  
    if (post.categoryType === 'Looking') {
      return (
        <View style={viewPostStyles.container}>
          <View style={viewPostStyles.labelContainer}>
            <Text style={viewPostStyles.label}>{post.category}</Text>
          </View>
          <View style={viewPostStyles.labelContainer2}>
            <Text style={viewPostStyles.label}>Looking</Text>
          </View>
          <View style={viewPostStyles.detailsContainer}>
            <Text style={viewPostStyles.title}>{post.titleOfPost}</Text>
            <Text style={viewPostStyles.smallText3}>{post.address.city} | {post.address.state}</Text>
            <Text style={viewPostStyles.smallText}>Looking From:  <Text style={viewPostStyles.date2}>{formattedDate}</Text></Text>
            <Text style={viewPostStyles.smallText}>Price range: <Text style={viewPostStyles.price2}>${post.priceFrom.$numberDecimal} - ${post.priceTo.$numberDecimal} per month</Text></Text>
          </View>
        </View>
      );
    }
  
    return (
      <View style={viewPostStyles.container}>
        <View style={viewPostStyles.imageContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={viewPostStyles.image} />
          ) : (
            <View style={viewPostStyles.noImageContainer}>
              <Text style={viewPostStyles.noImageText}>No image available</Text>
            </View>
          )}
          <View style={viewPostStyles.offeringLabelContainer}>
            <Text style={viewPostStyles.offeringLabel}>{post.category}</Text>
          </View>
          <View style={viewPostStyles.offeringLabelContainer2}>
            <Text style={viewPostStyles.offeringLabel}>Offering</Text>
          </View>
        </View>
        <View style={viewPostStyles.detailsContainer}>
          <View style={viewPostStyles.header}>
            <Text style={viewPostStyles.title}>{post.titleOfPost}</Text>
            <Text style={viewPostStyles.price}>${post.priceTo.$numberDecimal}</Text>
          </View>
          <View style={viewPostStyles.header}>
            <Text style={viewPostStyles.smallText}>{post.apartmentType}</Text>
            <Text style={viewPostStyles.smallText}>/month</Text>
          </View>
          <Text style={viewPostStyles.smallText2}>{`${post.address.streetNameNumber}, ${post.address.city}, ${post.address.state}, ${post.address.zipcode}`}</Text>
          {renderFacilities()}
        </View>
      </View>
    );
  };
  
export default SentRequestItem;
