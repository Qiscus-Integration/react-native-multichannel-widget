import en from "../locales/en";

const defaultState = {
    title: en.title,
    subtitle: en.subtitle,
    isCustomTitle: false,
    isCustomSubtitle: false,
    isCustomAvatar: false,
    avatar: null,
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
    loginMessage: null,
    replayMessage: {},
    messageExtras: null
}

export default defaultState
