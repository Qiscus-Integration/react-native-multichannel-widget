import defaultState from './defaultState';
import * as actions from './actions';

export default function reducer(state = {...defaultState}, {type, payload}) {
  switch (type) {
    case actions.title:
      return {...state, title: payload};
    case actions.subtitle:
      return {...state, subtitle: payload};
    case actions.avatar:
      return {...state, avatar: payload};
    case actions.attachment:
      return {...state, attachment: payload};
    case actions.progressUploading:
      return {...state, progressUploading: payload};
    case actions.loginStatus:
      return {...state, loginStatus: payload};
    case actions.typingStatus:
      return {...state, typingStatus: payload};
    case actions.unReadCount:
      return {...state, unReadCount: payload};
    case actions.roomId:
      return {...state, roomId: payload};
    case actions.loginChecked:
      return {...state, loginChecked: payload};
    case actions.currentUser:
      return {...state, currentUser: payload};
    case actions.loginMessage:
      return {...state, loginMessage: payload};
    case actions.isCustomTitle:
      return {...state, isCustomTitle: payload};
    case actions.isCustomSubtitle:
      return {...state, isCustomSubtitle: payload};
    case actions.replayMessage:
      return {...state, replayMessage: payload};
    case actions.messageExtras:
      return {...state, messageExtras: payload};
    case actions.setResetState: {
      let _state = {...defaultState};
      if (state.isCustomTitle) {
        _state.title = state.title;
        _state.isCustomTitle = state.isCustomTitle;
      }

      if (state.isCustomSubtitle) {
        _state.subtitle = state.subtitle;
        _state.isCustomSubtitle = state.isCustomSubtitle;
      }

      _state.avatar = state.avatar;
      _state.isCustomAvatar = state.isCustomAvatar;

      return _state;
    }
    default:
      return state;
  }
}
