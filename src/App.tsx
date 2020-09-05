import React, { useState, useEffect } from 'react';
import './App.css';

import AppContext from './context';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import { changeTheme } from './utils/themes';

const defaultContext = {
  theme: 'dracula',
};

function App() {
  const [ theme ] = useState('dracula');

  useEffect(() => {
    console.log('changing theme');
    changeTheme(theme);
  }, [theme]);

  return (
    <div className="App">
      <AppContext.Provider value={defaultContext}>
        <Header />
        <Main />
        <Footer />
      </AppContext.Provider>
    </div>
  );
}

export default App;
