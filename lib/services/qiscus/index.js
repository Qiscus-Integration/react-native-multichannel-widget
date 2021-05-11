import xs from 'xstream';
import mitt from 'mitt';
import SDKCore from 'qiscus-sdk-core';

const distinct = (stream) => {
    let subscription = null;
    let lastData = null;
    return xs.create({
        start(listener) {
            subscription = stream.subscribe({
                next(data) {
                    if (data === lastData) {
                        return;
                    }
                    lastData = data;
                    listener.next(data);
                },
                error(error) {
                    listener.error(error);
                },
                complete() {
                    listener.complete();
                },
            });
        },
        stop() {
            subscription.unsubscribe();
        },
    });
};

export const qiscus = new SDKCore()
export let selectedRoomId = 0
export let onLoad = false
export let baseURLMultichannel = 'https://multichannel.qiscus.com';
const event = mitt();
export const event$ = xs.create({
    start(emitter) {
        event.on('event', (data) => {
            emitter.next({
                kind: data.kind,
                data: data.data,
            });
        });
    },
    stop() {
    },
});

export const setup = (appId, options) => {
    let baseURL = null;
    let mqttURL = null;
    let brokerLbURL = null;
    let uploadURL = null;

    if (options?.baseURLMultichannel) baseURLMultichannel = options?.baseURLMultichannel;

    if (options?.baseURLSdk) baseURL = options?.baseURLSdk;
    if (options?.mqttURLSdk) mqttURL = options?.mqttURLSdk;
    if (options?.brokerLbURLSdk) brokerLbURL = options?.brokerLbURLSdk;
    if (options?.uploadURLSdk) uploadURL = options?.uploadURLSdk;
    if (options?.resolveApiURL) resolveApiURL = options?.resolveApiURL;

    qiscus.init({
        AppId: appId,
        baseURL: baseURL,
        mqttURL: mqttURL,
        brokerLbURL: brokerLbURL,
        uploadURL: uploadURL,
        options: {
            loginSuccessCallback(authData) {
                event.emit('event', {kind: 'login-success', data: authData});
            },
            typingCallback(data) {
                event.emit('event', {kind: 'typing', data});
            },
            presenceCallback(data, userId) {
                const dataPresence = {
                    userId: userId,
                    data: data
                }
                event.emit('event', {kind: 'online-presence', data: dataPresence});
            },
            newMessagesCallback(messages) {
                messages.forEach((messages) => {
                    event.emit('event', {kind: 'new-message', data: messages});
                });
            },
            commentDeliveredCallback(data) {
                event.emit('event', {kind: 'comment-delivered', data});
            },
            commentReadCallback(data) {
                event.emit('event', {kind: 'comment-read', data});
            },
        },
    });
};

export const currentUser = () => qiscus.userData;
export const login$ = () =>
    event$.filter((it) => it.kind === 'login-success').map((it) => it.data);
export const isLogin$ = () =>
    xs
        .periodic(300)
        .map(() => qiscus.isLogin)
        .compose(distinct)
        .filter((it) => it === true);

export const newMessage$ = () =>
    event$.filter((it) => it.kind === 'new-message').map((it) => it.data);
export const messageRead$ = () =>
    event$.filter((it) => it.kind === 'comment-read').map((it) => it.data);
export const messageDelivered$ = () =>
    event$.filter((it) => it.kind === 'comment-delivered').map((it) => it.data);
export const onlinePresence$ = () =>
    event$.filter((it) => it.kind === 'online-presence').map((it) => it.data);
export const typing$ = () =>
    event$.filter((it) => it.kind === 'typing').map((it) => it.data);
