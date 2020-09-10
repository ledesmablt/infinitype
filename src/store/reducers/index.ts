import { combineReducers } from 'redux';

import theme from './theme';
import typedChars from './typedChars';
import wordBank from './wordBank';

export default combineReducers({
  theme,
  typedChars,
  wordBank,
});
