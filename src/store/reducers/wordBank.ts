interface ActionType {
  type: string;
  payload: string;
}

const defaultText = 'the quick brown fox jumps over the lazy dog '
  .repeat(8).trim();

const initialState = {
  words: defaultText,
}

export default function(state=initialState, action: ActionType) {
  switch (action.type) {
    case 'CHANGE_WORDS': {
      return {
        ...state,
        chars: state.words = action.payload,
      }
    }
    default:
      return state;
  }
}

