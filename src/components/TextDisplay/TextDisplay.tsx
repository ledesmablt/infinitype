import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './TextDisplay.css';
import { RootState } from '../../types/storeTypes';

const defaultValidChars = /^([ A-Za-z0-9_@./#&+-]|Backspace|Tab)$/

function TextDisplay() {
  const dispatch = useDispatch();
  const currentTypedText = useSelector(
    (state: RootState) => state.typedChars.chars
  );
  const currentWordBank = useSelector(
    (state: RootState) => state.wordBank.words
  )
  console.log(currentTypedText);

  function trackKeyPress(event: React.KeyboardEvent): void {
    if (!RegExp(defaultValidChars).test(event.key)) {
      return
    }
    if (event.key === 'Backspace') {
      dispatch({ type: 'DELETE_CHAR'});
    } else {
      dispatch({type: 'APPEND_CHAR', payload: event.key });
    }
  }

  const wordBlocks = currentWordBank.split(' ').map((word, _wi) => (
    <div
      className="Word"
      key={_wi}
      tabIndex={0}
      onKeyDown={trackKeyPress}
    >{
      word.split('').map((letter, _li) => (
        <div className="Letter" key={_li}>{letter}</div>
      ))
    }&nbsp;
    </div>
  ));

  return (
    <div className="TextDisplay">
      {wordBlocks}
    </div>
  )
  
}

export default TextDisplay;
