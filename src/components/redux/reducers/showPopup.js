// Reducer for popup state
import { SET_POPUP } from '../actions/actionTypes';

// Set showPopup flag
export default (state = false, action) => {
  switch (action.type) {
    case SET_POPUP:
      return action.payload.showPopup;
    default:
      return state;
  }
};
