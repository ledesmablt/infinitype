import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import './App.css';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import { changeTheme } from './utils/themes';
import { RootState } from './types/storeTypes';

function App() {
  const theme = useSelector((state: RootState) => state.theme.name);

  useEffect(() => {
    // ideally this would be done in the store
    changeTheme(theme);
  }, [theme])

  return (
    <div className="App">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

export default App;
