export const title = 'title';
export const subtitle = 'onlineStatus';
export const avatar = 'avatar';
export const attachment = 'attachment';
export const progressUploading = 'progressUploading';
export const loginStatus = 'loginStatus';
export const typingStatus = 'typingStatus';
export const unReadCount = 'unReadCount';
export const roomId = 'roomId';
export const loginChecked = 'loginChecked';
export const currentUser = 'currentUser';
export const loginMessage = 'loginMessage';
export const isCustomTitle = 'isCustomTitle';
export const isCustomSubtitle = 'isCustomSubtitle';
export const isCustomAvatar = 'isCustomAvatar';
export const setResetState = 'setResetState';
export const itemSelected = 'itemSelected';
export const replayMessage = 'replayMessage';

export function setTitle(value) {
    return {
        type: title,
        payload: value
    };
}

export function setSubtitle(value) {
    return {
        type: subtitle,
        payload: value
    };
}

export function setAvatar(url) {
    return {
        type: avatar,
        payload: url
    };
}

export function setAttachment(type, value, payload="") {
    return {
        type: attachment,
        payload: {
            type: type,
            value: value,
            payload: payload
        }
    };
}

export function setTypingStatus(value) {
    return {
        type: typingStatus,
        payload: value
    };
}

export function setProgressUploading(value) {
    return {
        type: progressUploading,
        payload: value
    };
}

export function setLoginStatus(value) {
    return {
        type: loginStatus,
        payload: value
    };
}

export function setUnReadCount(value) {
    return {
        type: unReadCount,
        payload: value
    };
}

export function setRoomId(value) {
    return {
        type: roomId,
        payload: value
    };
}

export function setLoginChecked(value) {
    return {
        type: loginChecked,
        payload: value
    };
}

export function setCurrentUser(value) {
    return {
        type: currentUser,
        payload: value
    };
}

export function setLoginMessage(value) {
    return {
        type: loginMessage,
        payload: value
    };
}

export function setIsCustomTitle(value) {
    return {
        type: isCustomTitle,
        payload: value
    };
}

export function setIsCustomSubtitle(value) {
    return {
        type: isCustomSubtitle,
        payload: value
    };
}

export function resetState() {
    return {
        type: setResetState
    };
}

export function setIsCustomAvatar(value) {
    return {
        type: isCustomAvatar,
        payload: value
    };
}

export function setReplayMessage(value) {
    return {
        type: replayMessage,
        payload: value
    };
}

export function removeReplayMessage() {
    return {
        type: replayMessage,
        payload: {}
    }
}
