import { changeTheme } from '../../utils/themes';

interface ActionType {
  type: string;
  payload: string;
}

const initialState = {
  name: 'dracula',
}


export default function(state=initialState, action: ActionType) {
  switch (action.type) {
		case 'CHANGE_THEME_PRESET': {
      changeTheme(action.type);
      return {
        ...state,
        name: action.payload,
      };
    }
    default:
      return state;
	}
}
