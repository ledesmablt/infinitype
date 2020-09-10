import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './TextDisplay.css';
import { RootState } from '../../types/storeTypes';

const defaultValidChars = /^([ A-Za-z0-9_@./#&+-]|Backspace|Tab)$/

function TextDisplay() {
  const focusRef = useRef(null);
  useEffect(() => {
    // @ts-ignore
    focusRef.current.focus();
  }, [focusRef])

  const dispatch = useDispatch();
  const currentTypedText = useSelector(
    (state: RootState) => state.typedChars.chars
  );
  const currentWordBank = useSelector(
    (state: RootState) => state.typedChars.wordBank
  );

  function trackKeyPress(event: React.KeyboardEvent): void {
    if (!RegExp(defaultValidChars).test(event.key)) {
      return
    }
    let dispatchContent;
    if (event.key === 'Backspace') {
      dispatchContent = { type: 'DELETE_CHAR' };
    } else if (event.key === 'Tab') {
      dispatchContent = { type: 'CLEAR_TYPED_CHARS' };
    } else {
      dispatchContent = {type: 'APPEND_CHAR', payload: event.key };
    }
    dispatch(dispatchContent);
    dispatch({ type: 'UPDATE_ACCURACY' });
  }

  const typedTextBlocks = currentTypedText.split(' ');
  const wordBlocks = currentWordBank.split(' ').map((targetWord, _wi) => {
    const typedWord = (typedTextBlocks[_wi] || '');
    const longestWordArray = [
      ...Array(Math.max(targetWord.length, typedWord.length))
      .keys()
    ];
    return (
      <div
        className="Word"
        key={_wi}
        tabIndex={0}
        ref={_wi === 0 ? focusRef : null}
      >{
        longestWordArray.map((_li) => {
          const typedChar = typedWord.charAt(_li);
          const targetChar = targetWord.charAt(_li);
          let letterClass = 'Letter';
          if (typedChar === targetChar) {
            letterClass += ' correct';
          } else if (
            typedChar !== targetChar &&
            typedChar.length > 0 &&
            _li < targetWord.length
          ) {
            letterClass += ' wrong';
          } else if (_li >= targetWord.length) {
            letterClass += ' wrong-overtype';
          }

          return (
            <div
              className={letterClass}
              key={_li}
            >
              {targetChar || typedChar}
            </div>
          ) 
        })
      }&nbsp;
      </div>
    )
  });

  return (
    <div
      className="TextDisplay"
      onKeyDown={trackKeyPress}
    >
    {wordBlocks}
    </div>
  )
  
}

export default TextDisplay;
