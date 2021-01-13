import * as config from '../constants/config';

const defaultState = {
    title: config.DEFAULT_TITLE,
    subtitle: config.DEFAULT_SUBTITLE,
    isCustomTitle: false,
    isCustomSubtitle: false,
    isCustomAvatar: false,
    avatar: config.DEFAULT_AVATAR,
    progressUploading: '',
    attachment:{
        type:'',
        value: '',
        payload: ''
    },
    loginStatus:'loading',
    typingStatus: false,
    unReadCount: 0,
    roomId: null,
    loginChecked: false,
    currentUser: {},
    loginMessage: '',
    replayMessage: {},
}

export default defaultState
