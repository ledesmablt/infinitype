interface ActionType {
  type: string;
  payload: any;
}

const defaultText = 'the quick brown fox jumps over the lazy dog '
  .repeat(8).trim();

interface TypedCharsStore {
  currentTypedText: string;
  initialWordBank: string;
  wordBank: string;
  charAccuracy: string[][] | null;
  currentStats: any;
  typedWordsHistory: string[];
}

const initialState: TypedCharsStore = {
  currentTypedText: '',
  initialWordBank: defaultText,
  wordBank: defaultText,
  charAccuracy: null,
  currentStats: {},
  typedWordsHistory: [],
}

function getAccuracyArray(state: TypedCharsStore): string[][] {
  const typedWords = state.currentTypedText.split(' ');
  const targetWords = state.wordBank.split(' ');

  const accuracyArray = typedWords.map((typedWord, _wi) => {
    const targetWord = targetWords[_wi];
    const longestWordArray = [
      ...Array(Math.max(targetWord.length, typedWord.length))
      .keys()
    ];
    return longestWordArray.map((_li): string => {
      const typedChar = typedWord.charAt(_li);
      const targetChar = targetWord.charAt(_li);
      if (typedChar === targetChar) {
        return 'CORRECT';
      } else if (
        typedChar !== targetChar &&
        typedChar.length > 0 &&
        _li < targetWord.length
      ) {
        return 'WRONG';
      } else if (_li >= targetWord.length) {
        return 'OVER';
      }
      return 'MISSING';
    })
  })
  return accuracyArray;
}

export default function(state=initialState, action: ActionType) {
  switch (action.type) {
    case 'UPDATE_ACCURACY': {
      const defaultReduce = {
        totalWords: 0,
        correctWords: 0,
        totalChars: 0,
        correctChars: 0,
      };
      const charAccuracy = getAccuracyArray(state);
      const currentStats = charAccuracy.reduce((acc, wordAcc) => {
          return {
            totalWords: acc.totalWords + 1,
            correctWords: acc.correctWords + (
              wordAcc.filter(stat => stat !== 'CORRECT').length === 0 ? 1 : 0
            ),
            totalChars: acc.totalChars + wordAcc.length,
            correctChars: acc.correctChars + (
              wordAcc.filter(stat => stat === 'CORRECT').length
            ),
          }
        }, defaultReduce)
      return {
        ...state,
        charAccuracy,
        currentStats,
      }
    }
    case 'APPEND_CHAR': {
      const additionalChar = (action.payload as string);
      const lastChar = state.currentTypedText.charAt(state.currentTypedText.length-1);
      if (additionalChar === ' ' && lastChar === ' ') {
        // ignore double space
        return state
      }
      return {
        ...state,
        currentTypedText: state.currentTypedText + additionalChar,
      }
    }
    case 'DELETE_CHAR': {
      return {
        ...state,
        currentTypedText: state.currentTypedText.slice(0,-1),
      }
    }
    case 'POP_TOP_ROW': {
      const topRow = (action.payload ?? []) as string[];
      const sliceRow = (text: string) => text.split(' ').slice(topRow.length,).join(' ');
      return {
        ...state,
        currentTypedText: sliceRow(state.currentTypedText),
        wordBank: sliceRow(state.wordBank),
        typedWordsHistory: state.typedWordsHistory.concat(topRow),
      }
    }
    case 'CLEAR_TYPED_CHARS': {
      return {
        ...state,
        currentTypedText: '',
        typedWordsHistory: [],
        wordBank: state.initialWordBank,
      };
    }

    case 'CHANGE_WORDS': {
      return {
        ...state,
        initialWordBank: (action.payload as string),
        wordBank: (action.payload as string),
      }
    }

    default:
      return state;
  }
}
