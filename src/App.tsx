import React, { useEffect } from 'react';

import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './App.css';
import { changeTheme } from './utils/themes';

function App() {
  useEffect(() => {
    // ideally this would be done in the store
    changeTheme('dracula');
  }, [])

  return (
    <div className="App">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

export default App;
