interface ActionType {
  type: string;
  payload: string;
}

const initialState = {
  chars: '',
}


export default function(state=initialState, action: ActionType) {
  switch (action.type) {
    case 'APPEND_CHAR': {
      return {
        ...state,
        chars: state.chars + action.payload,
      }
    }
    case 'DELETE_CHAR': {
      return {
        ...state,
        chars: state.chars.slice(0,-1),
      }
    }
    default:
      return state;
  }
}
