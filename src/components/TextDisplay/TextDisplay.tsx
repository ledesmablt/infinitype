import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './TextDisplay.css';
import { RootState } from '../../types/storeTypes';

const defaultValidChars = /^([ A-Za-z0-9_@./#&+-]|Backspace|Tab)$/

function TextDisplay() {
  const firstWordRef = useRef<HTMLDivElement>(null);
  const currentWordRef = useRef<HTMLDivElement>(null);
  const visibleAreaRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const [ wordIndex, setWordIndex ] = useState(0);
  const [ currentRow, setCurrentRow ] = useState(0);
  const {
    currentTypedWords,
    charAccuracyArray,
    wordBank,
    currentStats,
  } = useSelector((state: RootState) => state.typedWords);

  // first render
  useEffect(() => {
    if (!firstWordRef) {
      return;
    }
    // focus on first word to enable typing
    firstWordRef.current?.focus();
  }, [firstWordRef]);
  
  // on type
  useEffect(() => {
    // update word index
    const currentWordIndex = currentTypedWords.split(' ').length - 1;
    if (currentWordIndex !== wordIndex) {
      setWordIndex(currentWordIndex);
    }

    // update row count
    if (!firstWordRef.current || !currentWordRef.current) {
      return;
    }
    const initialRect = firstWordRef.current?.getBoundingClientRect();
    const currentRect = currentWordRef.current?.getBoundingClientRect();
    const rowCount = (
      (currentRect!.top - initialRect!.top)
      / initialRect!.height
    );
    if (currentRow !== rowCount) {
      setCurrentRow(rowCount);
    }

  // eslint-disable-next-line
  }, [currentTypedWords]);

  // on row change
  useEffect(() => {
    // on reaching last row, pop first row
    if (currentRow !== 2) {
      return
    } 
    const topRowOffset = visibleAreaRef.current?.getBoundingClientRect().top;
    let topRowWords = [];
    for (let wordElem of document.getElementsByClassName('Word')) {
      if (wordElem.getBoundingClientRect().top === topRowOffset) {
        topRowWords.push(wordElem.textContent?.trim());
      }
    }
    const topRowTypedWords = currentTypedWords
      .split(' ')
      .slice(0, topRowWords.length);

    dispatch({ type: 'POP_TOP_ROW', payload: topRowTypedWords});
    dispatch({ type: 'UPDATE_ACCURACY' });

  // eslint-disable-next-line
  }, [currentRow]);

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
  const typedTextBlocks = currentTypedWords.split(' ');
  const wordBlocks = wordBank.split(' ').map((targetWord, _wi) => {
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
        ref={
        _wi === 0 ? firstWordRef
          : (_wi === wordIndex ? currentWordRef : null)
        }
      >{
        longestWordArray.map((_li) => {
          const currentAccuracy = ((charAccuracyArray || [])[_wi] || [])[_li];
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
      <div
        className="TextDisplay-inner"
        ref={visibleAreaRef}
      >
        {/* <p>{currentStats.correctChars} / {currentStats.totalChars}</p> */}
        {wordBlocks}
      </div>
    </div>
  )
  
}

export default TextDisplay;
