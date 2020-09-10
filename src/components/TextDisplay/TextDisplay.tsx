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
    let dispatchContent;
    if (event.key === 'Backspace') {
      dispatchContent = { type: 'DELETE_CHAR'};
    } else {
      dispatchContent = {type: 'APPEND_CHAR', payload: event.key };
    }
    dispatch(dispatchContent);
  }

  const typedTextBlocks = currentTypedText.split(' ');
  const wordBlocks = currentWordBank.split(' ').map((word, _wi) => {
    const targetWord = typedTextBlocks[_wi];
    const charBlocks = (targetWord || '').split('');
    return (
      <div
        className="Word"
        key={_wi}
        tabIndex={0}
        onKeyDown={trackKeyPress}
      >{
        word.split('').map((letter, _li) => {
          let letterClass = 'Letter';
          const targetChar = charBlocks[_li];
          if (letter === targetChar) {
            letterClass += ' correct';
          } else if (
            typeof targetChar !== 'undefined' &&
            typeof targetWord !== 'undefined'
          ) {
            letterClass += ' wrong';
          }

          return (
            <div className={letterClass} key={_li}>{letter}</div>
          ) 
        })
      }&nbsp;
      </div>
    )
  });

  return (
    <div className="TextDisplay">
      {wordBlocks}
    </div>
  )
  
}

export default TextDisplay;
