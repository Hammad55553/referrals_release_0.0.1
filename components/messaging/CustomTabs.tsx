import {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../redux/store';
import {updateMessageFlowScreen} from '../../redux/features/chatSlice';
import React from 'react';

type Tab = 'Messages' | 'Requests';

interface CustomTabsProps {
  messageCount: number;
  requestCount: number;
}

export function CustomTabs({messageCount, requestCount}: CustomTabsProps) {
  const dispatch: AppDispatch = useDispatch();

  const [activeTab, setActiveTab] = useState<Tab>('Messages');

  const handleTabPress = (tab: Tab) => {
    dispatch(updateMessageFlowScreen(tab));
    setActiveTab(tab);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'Messages' && styles.activeTab]}
        onPress={() => handleTabPress('Messages')}>
        <Text
          style={[
            styles.tabText,
            activeTab === 'Messages' && styles.activeTabText,
          ]}>
          {`Messages (${messageCount})`}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'Requests' && styles.activeTab]}
        onPress={() => handleTabPress('Requests')}>
        <Text
          style={[
            styles.tabText,
            activeTab === 'Requests' && styles.activeTabText,
          ]}>
          {`Requests (${requestCount})`}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 10,
    borderRadius: 7,
    borderColor: '#e6e6e6',
    borderWidth: 1,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeTab: {
    backgroundColor: '#2441D0',
    borderRadius: 7,
  },
  tabText: {
    color: 'black',
  },
  activeTabText: {
    color: 'white',
  },
});
