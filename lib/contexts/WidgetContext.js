import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useReducer,
} from 'react';
import defaultState from './defaultState';
import reducer from './reducer';
import {RootSiblingParent} from 'react-native-root-siblings';
import debounce from 'xstream/extra/debounce';
import * as Qiscus from '../services/qiscus';
import xs from 'xstream';
import axios from 'axios';
import * as actions from './actions';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';
import {resolveChat, isEmpty, qiscusLogger} from '../utils';

const initialState = {...defaultState};
const WidgetContext = createContext(initialState);
import i18n from '../services/i18n';
import en from "../locales/en";
import dropRepeats from 'xstream/extra/dropRepeats'

export const MultichannelWidgetProvider = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    let firebaseDeviceId = null;
    let subscription = null;
    let subscription2 = null;
    let subscription4 = null;
    let timeOutTyping = null;
    let timeOutStatus = null;

    const subscriptionMessage = useCallback(() => {
        subscription = Qiscus.newMessage$()
            .subscribe({
                next: data => {
                    getUnreadCount();
                },
            });

        subscription2 = Qiscus.typing$()
            .compose(debounce(50))
            .subscribe({
                next: data => {
                    _onTyping(data);
                },
            });

        subscription4 = xs.merge(Qiscus.login$())
            .compose(dropRepeats())
            .subscribe({
                next: data => {
                    onSuccessLogin()
                },
            });
    }, []);
    const _onTyping = (status) => {
        if (timeOutTyping != null) {
            clearTimeout(timeOutTyping);
        }
        if (!state.typingStatus) dispatch(actions.setTypingStatus(true));
        timeOutTyping = setTimeout(
            () => {
                dispatch(actions.setTypingStatus(false));
            },
            5000,
        );
    };
    let registerDeviceToken = () => {
        return new Promise((resolve, reject) => {
            if (isEmpty(firebaseDeviceId)) {
                resolve()
                return
            }
            Qiscus.qiscus.registerDeviceToken(firebaseDeviceId)
                .then(data => {
                    resolve(data)
                })
                .catch(e => {
                    reject(e)
                })
        })
    }
    let onSuccessLogin = () => {
        registerDeviceToken()
            .then(() => {
                return updateRoomInfo(Qiscus.selectedRoomId);
            })
            .then(() => {
                dispatch(actions.setCurrentUser(Qiscus.qiscus.userData));
                dispatch(actions.setLoginChecked(true));
            })
            .catch(error => {
                dispatch(actions.setLoginChecked(true));
                dispatch(actions.setLoginMessage(error.message));
            });
    }

    const updateRoomInfo = roomId => new Promise((resolve, reject) => {
        Qiscus.qiscus.getRoomById(roomId)
            .then(room => {
                let subtitle = [];
                let userEmail = Qiscus.qiscus.userData.email;

                let avatarRoom = null;
                let avatarAgent = null;

                avatarRoom = room.avatar

                if (room?.participants?.length > 0) {
                    room.participants.forEach(participant => {

                        if (userEmail === participant.email) {
                            subtitle.unshift('You');
                        } else {
                            const {type} = participant?.extras;
                            if (type === 'agent') {
                                const {avatar_url} = participant
                                avatarAgent = avatar_url
                            }
                            subtitle.push(participant.username);
                        }
                    });
                } else {
                    subtitle.push(en.subtitle);
                }

                if (avatarAgent) {
                    dispatch(actions.setAvatar(avatarAgent));
                } else {
                    dispatch(actions.setAvatar(avatarRoom));
                }

                dispatch(actions.setSubtitle(subtitle.join(', ')));
                resolve(room);
            })
            .catch(e => {
                reject(e);
            });
    });

    useEffect(() => {
        subscriptionMessage();
        return (() => {
            subscription?.unsubscribe();
            subscription2?.unsubscribe();
            subscription4?.unsubscribe();
            if (timeOutTyping) clearTimeout(timeOutTyping);
        });
    }, []);

    //Export function

    const getUnreadCount = () => new Promise((resolve, reject) => {
        Qiscus.qiscus.getTotalUnreadCount()
            .then(unreadCount => {
                dispatch(actions.setUnReadCount(unreadCount));
                resolve(unreadCount);
            })
            .catch(function (error) {
                // On error
                reject(error);
            });
    });

    const initiateChat = async (options) => {
        let userId = "";
        let name = "";
        let extras = null;
        let additionalInfo = null;
        let messageExtras = null;
        let channelId = null;

        if (options?.userId) userId = options?.userId
        if (options?.name) name = options?.name
        if (options?.deviceId) firebaseDeviceId = options?.deviceId
        if (options?.extras) extras = options?.extras
        if (options?.additionalInfo) additionalInfo = options?.additionalInfo
        if (options?.messageExtras) messageExtras = options?.messageExtras
        if (options?.channelId) channelId = options?.channelId

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                Qiscus.qiscus.getNonce()
                    .then(async ({nonce}) => {
                        let data = {
                            'app_id': Qiscus.qiscus.AppId,
                            'nonce': nonce,
                            'user_id': userId,
                            'name': name,
                            'sdk_user_extras': extras,
                            'user_properties': additionalInfo,
                        };

                        if (channelId) data.channel_id = channelId

                        let config = {
                            method: 'post',
                            url: `${Qiscus.baseURLMultichannel}/api/v2/qiscus/initiate_chat`,
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            data: JSON.stringify(data),
                        };

                        return axios(config);
                    })
                    .then(function (data) {
                        const {identity_token, customer_room} = data.data.data;
                        const {room_id} = customer_room;
                        dispatch(actions.setRoomId(room_id));
                        Qiscus.selectedRoomId = room_id;
                        state.roomId = room_id;
                        return Qiscus.qiscus.verifyIdentityToken(identity_token);
                    })
                    .then((userData) => {
                        // Set user with user data from identity token
                        Qiscus.qiscus.setUserWithIdentityToken(userData);
                        if (messageExtras) dispatch(actions.setMessageExtras(messageExtras));
                        resolve(userData)
                    })
                    .catch(error => {
                        dispatch(actions.setLoginChecked(true));
                        dispatch(actions.setLoginMessage(error.message));
                        reject(error);
                    });
            }, 1000);
        });
    };

    const currentUser = state.currentUser;

    const endSession = () => {
        return new Promise((resolve, reject) => {
            state.loginMessage = null
            dispatch(actions.resetState());

            try {
                Qiscus.qiscus.disconnect();
            } catch (e) {
                qiscusLogger(e);
            }

        })

    };

    const removeNotification = deviceId => Qiscus.qiscus.removeDeviceToken(deviceId);

    const changeLanguage = lang => i18n.changeLanguage(lang)

    const _store = {
        state,
        dispatch,
        getUnreadCount,
        initiateChat,
        currentUser,
        endSession,
        removeNotification,
        updateRoomInfo,
        changeLanguage
    };
    const store = React.useMemo(() => (_store), [state]);

    return (
        <RootSiblingParent>
            <ActionSheetProvider>
                <WidgetContext.Provider value={store}>
                    {props.children}
                </WidgetContext.Provider>
            </ActionSheetProvider>
        </RootSiblingParent>
    );
};

export const MultichannelWidgetConsumer = WidgetContext.Consumer;

export const MultichannelWidgetContext = () => {
    const ctx = useContext(WidgetContext);
    if (ctx === undefined) {
        throw Error('MultichannelWidget can only be used within MultichannelWidgetProvider');
    }
    return ctx;
};

export default MultichannelWidgetContext;
