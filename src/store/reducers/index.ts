import { combineReducers } from 'redux';

import theme from './theme';
import typedWords from './typedWords';

export default combineReducers({
  theme,
  typedWords,
});
