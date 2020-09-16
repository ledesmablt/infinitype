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
  const [ currentRect, setCurrentRect ] = useState<DOMRect | undefined>();
  const {
    currentTypedText,
    charAccuracy,
    wordBank,
    currentStats,
  } = useSelector((state: RootState) => state.typedChars);

  // get current word & rect
  useEffect(() => {
    setCurrentRect(
      currentWordRef.current?.getBoundingClientRect()
    );
  }, [currentWordRef, wordIndex])

  // focus on first word
  useEffect(() => {
    if (firstWordRef) {
      firstWordRef.current?.focus();
    }
  }, [firstWordRef]);

  // update current word
  useEffect(() => {
    const currentWordIndex = currentTypedText.split(' ').length - 1;
    if (currentWordIndex !== wordIndex) {
      console.log(currentWordIndex);
      setWordIndex(currentWordIndex);
    }
  }, [currentTypedText]);

  // adjust row count based on current vs first word rect
  useEffect(() => {
    if (!firstWordRef) {
      return;
    }
    const initialRect = firstWordRef.current?.getBoundingClientRect();
    if (!currentRect || !initialRect) {
      return;
    }
    const rowCount = (
      (currentRect!.top - initialRect!.top)
      / initialRect!.height
    );
    if (currentRow !== rowCount) {
      setCurrentRow(rowCount);
    }
  }, [currentRow, currentRect]);

  // on reaching last row, pop first row
  useEffect(() => {
    if (currentRow !== 2 || !visibleAreaRef) {
      return
    } 
    const topRowOffset = visibleAreaRef.current?.getBoundingClientRect().top;
    let topRowWords = [];
    for (let wordElem of document.getElementsByClassName('Word')) {
      if (wordElem.getBoundingClientRect().top === topRowOffset) {
        topRowWords.push(wordElem.textContent?.trim());
      }
    }
    const topRowTypedWords = currentTypedText
      .split(' ')
      .slice(0, topRowWords.length);

    dispatch({ type: 'POP_TOP_ROW', payload: topRowTypedWords});
    dispatch({ type: 'UPDATE_ACCURACY' });

  }, [currentRow, visibleAreaRef]);

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
