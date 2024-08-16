import {Platform} from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';

const androidConfig = {
  clientId:
    '621558975147-ff53hnc64qli47la27h0astti1i2mn6h.apps.googleusercontent.com',
  appId: '1:621558975147:android:f58a28aa68941251f3c5ee',
  apiKey: 'AIzaSyCp15W9-bYgPxzTXw9B7Rso4m9-iiAQ5oQ',
  storageBucket: 'vibesea-d683e.appspot.com',
  messagingSenderId: '621558975147',
  projectId: 'vibesea-d683e',
};

const iOSConfig = {
  clientId:
    '621558975147-4gnnrqi4ok38gs2ltl2t6r3qacrbri7o.apps.googleusercontent.com',
  appId: '1:621558975147:ios:aeced5451c845749f3c5ee',
  apiKey: 'AIzaSyBXIu4axPc7jBKzh2JLHk7_wzxedD4L-Qs',
  storageBucket: 'vibesea-d683e.appspot.com',
  messagingSenderId: '621558975147',
  projectId: 'vibesea-d683e',
};

if (Platform.OS === 'android' && !firebase.apps.length) {
  firebase.initializeApp(androidConfig);
} else if (Platform.OS === 'ios' && !firebase.apps.length) {
  firebase.initializeApp(iOSConfig);
}

export default firebase;
