import React from 'react';

import './TextDisplay.css';

const defaultValidChars = /^([ A-Za-z0-9_@./#&+-]|Backspace|Tab)$/

function TextDisplay() {
  const text = 'the quick brown fox jumps over the lazy dog '
    .repeat(8).trim();

  function trackKeyPress(event: React.KeyboardEvent): void {
    if (!RegExp(defaultValidChars).test(event.key)) {
      return
    }
    console.log(event.key);
  }

  const wordBlocks = text.split(' ').map((word, _wi) => (
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
