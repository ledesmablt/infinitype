interface ActionType {
  type: string;
  payload: string;
}

const defaultText = 'the quick brown fox jumps over the lazy dog '
  .repeat(8).trim();

interface TypedCharsStore {
  currentTypedText: string;
  wordBank: string;
  charAccuracy: string[][] | null;
  currentStats: any;
}

const initialState: TypedCharsStore = {
  currentTypedText: '',
  wordBank: defaultText,
  charAccuracy: null,
  currentStats: {},
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
      const lastChar = state.currentTypedText.charAt(state.currentTypedText.length-1);
      if (action.payload === ' ' && lastChar === ' ') {
        // ignore double space
        return state
      }
      return {
        ...state,
        currentTypedText: state.currentTypedText + action.payload,
      }
    }
    case 'DELETE_CHAR': {
      return {
        ...state,
        currentTypedText: state.currentTypedText.slice(0,-1),
      }
    }
    case 'CLEAR_TYPED_CHARS': {
      return {
        ...state,
        currentTypedText: initialState.currentTypedText,
      };
    }

    case 'CHANGE_WORDS': {
      return {
        ...state,
        wordBank: state.wordBank = action.payload,
      }
    }

    default:
      return state;
  }
}
