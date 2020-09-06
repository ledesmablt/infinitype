import React from 'react';

import './TextDisplay.css';

function TextDisplay() {
  const text = 'the quick brown fox jumps over the lazy dog '
    .repeat(8).trim();

  const wordBlocks = text.split(' ').map(word => (
    <div className="Word">{
      word.split('').map(letter => (
        <div className="Letter">{letter}</div>
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
