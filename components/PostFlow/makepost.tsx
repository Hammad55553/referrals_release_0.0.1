import React, {useState, useEffect} from 'react';
import {View, Image, ScrollView} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import {styles} from '../../styles/subleasestyles';
import {Picker} from '@react-native-picker/picker';
import {ApartmentMateForm} from './apartmentmateform';
import {LookingForm} from './lookingform';
import {OfferingForm} from './offeringform';

const categories = ['Sublease', 'Rental', 'ApartmentMate'];
const searchTypes = ['Offering', 'Looking'];

interface MakePostRouteParams {
  category?: string;
  searchType?: string;
}

export default function MakePost() {
  const route = useRoute<RouteProp<{params: MakePostRouteParams}, 'params'>>();
  const {category: routeCategory, searchType: routeSearchType} =
    route.params || {};
  const [selectedCategory, setSelectedCategory] = useState(
    routeCategory || 'Sublease',
  );
  const [selectedSearchType, setSelectedSearchType] = useState(
    routeSearchType || 'Offering',
  );

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedSearchType(''); // Reset search type when category changes
  };

  const handleSearchTypeChange = (value: string) => {
    setSelectedSearchType(value);
  };

  useEffect(() => {
    setSelectedCategory(routeCategory || 'Sublease');
    setSelectedSearchType(routeSearchType || 'Offering');
  }, [routeCategory, routeSearchType]);

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.line} />
      <View style={styles.pickerContainer}>
        <View style={styles.pickerWithIcon}>
          <Image
            source={require('../../assets/icons/search.png')}
            style={styles.dropdownIcon}
          />
          <Picker
            selectedValue={selectedCategory}
            onValueChange={handleCategoryChange}
            style={styles.pickerForIOS}
            itemStyle={styles.picker}
            mode="dialog"
            dropdownIconColor="gray">
            <Picker.Item label="Select Category" value="" color="gray" />
            {categories.map(item => (
              <Picker.Item key={item} label={item} value={item} />
            ))}
          </Picker>
        </View>
      </View>

      {(selectedCategory === 'Sublease' || selectedCategory === 'Rental') && (
        <View style={styles.pickerContainer}>
          <View style={styles.pickerWithIcon}>
            <Image
              source={require('../../assets/icons/search.png')}
              style={styles.searchIcon}
            />
            <Picker
              selectedValue={selectedSearchType}
              onValueChange={handleSearchTypeChange}
              style={styles.pickerForIOS} // for android
              itemStyle={styles.picker} // for ios
              mode="dialog"
              dropdownIconColor="gray">
              <Picker.Item label="Select Type" value="" color="gray" />
              {searchTypes.map(item => (
                <Picker.Item key={item} label={item} value={item} />
              ))}
            </Picker>
          </View>
        </View>
      )}

      {selectedSearchType === 'Offering' && (
        <OfferingForm category={selectedCategory} />
      )}
      {selectedSearchType === 'Looking' && (
        <LookingForm category={selectedCategory} />
      )}
      {selectedCategory === 'ApartmentMate' && (
        <ApartmentMateForm category={selectedCategory} />
      )}
    </ScrollView>
  );
}
