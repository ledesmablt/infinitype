import React, { useEffect } from 'react';
import { Provider } from 'react-redux';

import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import store from './store';
import './App.css';
import { changeTheme } from './utils/themes';

function App() {
  useEffect(() => {
    // ideally this would be done in the store
    changeTheme('dracula');
  }, [])

  return (
    <div className="App">
      <Provider store={store}>
        <Header />
        <Main />
        <Footer />
      </Provider>
    </div>
  );
}

export default App;
