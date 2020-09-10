import { combineReducers } from 'redux';

import theme from './theme';
import typedChars from './typedChars';

export default combineReducers({
  theme,
  typedChars,
});
