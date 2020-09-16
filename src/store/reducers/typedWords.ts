const DEFAULT_TEXT = 'the quick brown fox jumps over lazy dog';
const MIN_CHARS_WORDBANK = 120 * 5;

interface ActionType {
  type: string;
  payload: any;
}

interface TypedWordsStore {
  currentTypedWords: string;
  wordPool: string;
  currentTargetWords: string;
  charAccuracyArray?: string[][];
  currentStats: any;
  typedWordsHistory: string[];
}

const initialState: TypedWordsStore = {
  currentTypedWords: '',
  wordPool: DEFAULT_TEXT,
  currentTargetWords: generateTargetWords(DEFAULT_TEXT),
  currentStats: {},
  typedWordsHistory: [],
}

function arrUnique<T>(array: T[]): T[] {
  return array.filter((item, i, ar) => ar.indexOf(item) === i);
}

function generateTargetWords(text: string, startingText=''): string {
  const textArr = arrUnique(text.split(' '));
  if (textArr.length < 2) {
    // ensure text array is of sufficient length
    for (let word of DEFAULT_TEXT.split(' ')) {
      textArr.push(word);
    }
  }
  var outputText = startingText;
  var lastRandN = -1;
  while (outputText.length < MIN_CHARS_WORDBANK) {
    let randN = Math.floor(Math.random() * textArr.length);
    if (randN === lastRandN) {
      // disallow duplicate words in succession
      continue;
    }
    outputText += ` ${textArr[randN]}`;
    lastRandN = randN;
  }

  console.log('words', outputText.split(' ').length);
  return outputText.trim();
}

function getAccuracyArray(state: TypedWordsStore): string[][] {
  const typedWords = state.currentTypedWords.split(' ');
  const targetWords = state.currentTargetWords.split(' ');

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
        currentTargetWords: generateTargetWords(
          state.wordPool,
          sliceRow(state.currentTargetWords)
        ),
        charAccuracyArray: state.charAccuracyArray?.slice(topRow.length,),
        typedWordsHistory: state.typedWordsHistory.concat(topRow),
      }
    }
    case 'CLEAR_TYPED_CHARS': {
      return {
        ...initialState,
        currentTargetWords: generateTargetWords(initialState.wordPool),
      }
    }

    case 'CHANGE_WORDS': {
      return {
        ...state,
        wordPool: (action.payload as string),
        currentTargetWords: generateTargetWords(action.payload as string),
      }
    }

    default:
      return state;
  }
}
