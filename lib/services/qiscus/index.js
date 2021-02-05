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

export const init = (appId, baseURL, mqttURL,brokerLbURL, uploadURL) => {
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
            presenceCallback(data) {
                event.emit('event', {kind: 'online-presence', data});
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
