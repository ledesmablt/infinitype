import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './TextDisplay.css';
import { RootState } from '../../types/storeTypes';

const defaultValidChars = /^([ A-Za-z0-9_@./#&+-]|Backspace|Tab)$/

function TextDisplay() {
  const currentWordRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const [ wordIndex, setWordIndex ] = useState(0);
  const {
    currentTypedText,
    charAccuracy,
    wordBank,
    currentStats,
  } = useSelector((state: RootState) => state.typedChars);

  useEffect(() => {
    currentWordRef.current?.focus();
  }, [currentWordRef, wordIndex])

  useEffect(() => {
    console.log(wordIndex, currentWordRef.current?.textContent);
  }, [wordIndex]);

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

  // render elements
  const typedTextBlocks = currentTypedText.split(' ');
  const wordBlocks = wordBank.split(' ').map((targetWord, _wi) => {
    const currentWordIndex = typedTextBlocks.length - 1;
    if (currentWordIndex !== wordIndex) {
      setWordIndex(currentWordIndex);
    }
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
        ref={_wi === wordIndex ? currentWordRef : null}
      >{
        longestWordArray.map((_li) => {
          const currentAccuracy = ((charAccuracy || [])[_wi] || [])[_li];
          let letterClass = 'Letter';
          switch (currentAccuracy) {
            case 'CORRECT': {
              letterClass += ' correct';
              break;
            }
            case 'WRONG': {
              letterClass += ' wrong';
              break;
            }
            case 'OVER': {
              letterClass += ' wrong-overtype'
              break;
            }
          }
          const typedChar = typedWord.charAt(_li);
          const targetChar = targetWord.charAt(_li);

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
      {/* <p>{currentStats.correctChars} / {currentStats.totalChars}</p> */}
      {wordBlocks}
    </div>
  )
  
}

export default TextDisplay;
