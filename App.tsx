import React from 'react';
import {Provider} from 'react-redux';
import store from './redux/store';
import RootComponent from './RootComponent';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <RootComponent />
    </Provider>
  );
}

export default App;