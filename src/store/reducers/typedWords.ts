interface ActionType {
  type: string;
  payload: any;
}

const defaultText = 'the quick brown fox jumps over the lazy dog '
  .repeat(8).trim();

interface TypedWordsStore {
  currentTypedWords: string;
  initialWordBank: string;
  wordBank: string;
  charAccuracyArray?: string[][];
  currentStats: any;
  typedWordsHistory: string[];
}

const initialState: TypedWordsStore = {
  currentTypedWords: '',
  initialWordBank: defaultText,
  wordBank: defaultText,
  currentStats: {},
  typedWordsHistory: [],
}

function getAccuracyArray(state: TypedWordsStore): string[][] {
  const typedWords = state.currentTypedWords.split(' ');
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
      const charAccuracyArray = getAccuracyArray(state);
      const currentStats = charAccuracyArray.reduce((acc, wordAcc) => {
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
        charAccuracyArray,
        currentStats,
      }
    }
    case 'APPEND_CHAR': {
      const additionalChar = (action.payload as string);
      const lastChar = state.currentTypedWords.charAt(state.currentTypedWords.length-1);
      if (additionalChar === ' ' && lastChar === ' ') {
        // ignore double space
        return state
      }
      return {
        ...state,
        currentTypedWords: state.currentTypedWords + additionalChar,
      }
    }
    case 'DELETE_CHAR': {
      return {
        ...state,
        currentTypedWords: state.currentTypedWords.slice(0,-1),
      }
    }
    case 'POP_TOP_ROW': {
      const topRow = (action.payload ?? []) as string[];
      const sliceRow = (text: string) => text.split(' ').slice(topRow.length,).join(' ');
      return {
        ...state,
        currentTypedWords: sliceRow(state.currentTypedWords),
        wordBank: sliceRow(state.wordBank),
        charAccuracyArray: state.charAccuracyArray?.slice(topRow.length,),
        typedWordsHistory: state.typedWordsHistory.concat(topRow),
      }
    }
    case 'CLEAR_TYPED_CHARS': {
      return initialState;
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
