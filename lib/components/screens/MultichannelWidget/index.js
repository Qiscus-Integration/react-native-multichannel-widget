import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Keyboard, Clipboard, Modal} from 'react-native';
import * as Qiscus from '../../../services/qiscus';
import xs from 'xstream';
import Loading from '../../common/Loading';
import Bubble from '../../common/Bubble';
import {MessageType} from '../../../constants/messageType';
import {getMoment as moment, isEmpty, qiscusToast} from '../../../utils';
import InputMessage from '../../common/InputMessage';
import * as actions from '../../../contexts/actions';
import {
  removeReplayMessage,
  setReplayMessage,
  setTypingStatus,
} from '../../../contexts/actions';
import ScreenWrapper from '../../common/ScreenWrapper';
import Widget from '../../../';
import AuthRequired from '../../common/AuthRequired';
import {useActionSheet} from '@expo/react-native-action-sheet';
import ImageViewer from 'react-native-image-zoom-viewer';

const MultichannelWidget = (props) => {
  const {
    onSuccessGetRoom,
    onTyping,
    onPressSendAttachment,
    onDownload,
    renderSendAttachment,
    sendAttachment,
    renderSendMessage,
    placeholder
  } = props;

  const [room, setRoom] = useState({});
  const [lastComment, setLastComment] = useState();
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [onLoadRoom, setOnLoadRoom] = useState(false);
  const [onLoad, setOnLoad] = useState(false);
  const [visibleImageModal, setVisibleImageModal] = useState(false);
  const [imageModal, setImageModal] = useState([{
    url: ''
  }]);

  const {state, dispatch, getUnreadCount, currentUser} = Widget();
  const roomId = state.roomId;

  let subscription3 = null;
  const flatListRef = React.useRef();

  const subscriptionNewMessage = useCallback(() => {
    subscription3 = xs.merge(
      Qiscus.newMessage$().map(_onNewMessage),
      Qiscus.messageDelivered$().map(_onMessageDelivered),
      Qiscus.messageRead$().map(_onMessageRead),
      Qiscus.typing$().map(_onTyping),
    )
      .subscribe({
        next: () => {
        },
        error: error => console.log('subscription error', error),
      });
  }, []);
  const {showActionSheetWithOptions} = useActionSheet();

  useEffect(() => {
    setOnLoad(true);
    if (roomId !== 0) {
      try {
        Qiscus.qiscus.getRoomById(roomId)
          .then(room => {
            setLoading(false);
            setRoom(room);
            setLastComment(null);
            if (onSuccessGetRoom) onSuccessGetRoom(room);
            getUnreadCount();
          })
          .catch(e => {
            console.log('error', e);
          });
      } catch (e) {
      }
      subscriptionNewMessage();
    }
  }, [currentUser]);

  useEffect(() => {
    let options = {
      last_comment_id: lastComment,
      after: false,
      limit: 20,
    };
    try {
      if (room?.id != undefined) {
        Qiscus.qiscus.loadComments(room?.id, options)
          .then(msg => {
            const newMessage = msg.reverse();
            const formattedMessages = {};
            newMessage.forEach(item => {
              formattedMessages[item.id] = item;
            });
            let combine = {...Object.assign(messages, formattedMessages)};
            setMessages(combine);
          })
          .catch(e => {
            console.log('loadComments error', e);
          });
      }
    } catch (e) {
    }
  }, [lastComment]);
  const loadNewMessage = () => {
    try {
      if (room?.id != undefined && !onLoadRoom) {
        setOnLoadRoom(true);
        Qiscus.qiscus.loadComments(room?.id)
          .then(msg => {
            setOnLoadRoom(false);
            const newMessage = msg.reverse();
            const formattedMessages = {};
            newMessage.forEach(item => {
              formattedMessages[item.id] = item;
            });

            let combine = {...Object.assign(messages, formattedMessages)};
            setMessages(combine);
          })
          .catch(e => {
            setOnLoadRoom(false);
            console.log('loadComments error', e);
          });
      }
    } catch (e) {
    }
  };

  useEffect(() => {
    return (() => {
      setOnLoad(false);
      //clean up function
      getUnreadCount();
      dispatch(actions.setProgressUploading(''));
      resetPayloadAndMessage();
      setUrlUpload('');
      subscription3?.unsubscribe();
      dispatch(setTypingStatus(false));
      Qiscus.qiscus.exitChatRoom();
    });
  }, []);

  const getMessage = () => {
    let data = Object.values(messages);
    //reverse message
    let _data = data.length > 0 ? data.reverse() : [];
    return _data;
  };
  const onOpenActionMessage = (item) => {
    if (item.type !== MessageType.TEXT &&
      item.type !== MessageType.REPLY &&
      item.type !== MessageType.ATTACHMENT) {
      return;
    }
    const labelCopy = 'Copy';
    const labelReplay = 'Reply';
    const labelDelete = 'Delete';
    const labelCancel = 'Cancel';
    const options = [labelCopy, labelReplay, labelDelete, labelCancel];

    if (item.email !== Qiscus.currentUser().email) options.remove(labelDelete);

    const cancelButtonIndex = options.indexOf(labelCancel);
    const destructiveButtonIndex = options.indexOf(labelDelete);

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      buttonIndex => {
        switch (buttonIndex) {
          case options.indexOf(labelCopy) :
            Clipboard.setString(item.message);
            break;
          case options.indexOf(labelDelete) :
            deleteMessage(item);
            break;
          case options.indexOf(labelReplay) :
            dispatch(actions.setAttachment('', '', ''));
            dispatch(actions.setProgressUploading(''));
            setUrlUpload('');
            dispatch(setReplayMessage(item));
            break;
          default :
            break;
        }
      },
    );
  };
  const removePropery = (propKey, {[propKey]: propValue, ...rest}) => rest;
  const deleteMessage = item => {
    Qiscus.qiscus.deleteComment(item.room_id, [item.unique_temp_id])
      .then(function(message) {
        if (onLoad) {

          setMessages(removePropery(item.id, messages));
        }
      })
      .catch(function(error) {
      });
  };
  const renderItem = ({item, index}) => {
    let beforeMessage = messages[item.comment_before_id];
    return (<Bubble
      openActionMessage={onOpenActionMessage}
      onPressImage={(image, file_name) => {
        setImageModal(image)
        setVisibleImageModal(true)
      }}
      index={index}
      item={item}
      beforeItem={beforeMessage}
      {...props}
    />);
  };

  const _onNewMessage = useCallback((message) => {
    if (message.room_id != Qiscus.qiscus?.selected?.id) return;

    let newMessage = {};
    newMessage[message.id] = message;
    let combine = {...Object.assign(messages, newMessage)};
    setMessages(combine);
  }, []);

  const _onMessageDelivered = useCallback(({comment}) => {
    if (comment.room_id != Qiscus.qiscus?.selected?.id) return;
    let newMessage = {};
    for (const messagesKey in messages) {
      let msg = messages[messagesKey];
      if (msg.status == 'sent') {
        newMessage[msg.id] = msg;
        newMessage[msg.id].status = 'delivered';
      }
    }
    let combine = {...Object.assign(messages, newMessage)};
    setMessages(combine);
  }, []);

  const _onMessageRead = useCallback(({comment}) => {
    if (comment.room_id != Qiscus.qiscus?.selected?.id) return;
    let newMessage = {};
    for (const messagesKey in messages) {
      let msg = messages[messagesKey];
      if (msg.status != 'read') {
        newMessage[msg.id] = msg;
        newMessage[msg.id].status = 'read';
      }
    }
    let combine = {...Object.assign(messages, newMessage)};
    setMessages(combine);
  }, []);

  const _onTyping = useCallback((status) => {
    if (onTyping) onTyping(status);
  }, []);

  const getRoomId = () => room?.id;

  const sendMessage = () => {
    const {payload, type} = state.attachment;
    const isReply = !!(state.replayMessage?.id);
    let newMessage = (message.length > 0) ? message.toString().trim() : message;
    let comment = isReply
      ? Qiscus.qiscus.generateReplyMessage({
        roomId: Qiscus.qiscus.selected.id,
        text: newMessage,
        repliedMessage: state.replayMessage,
      })
      : Qiscus.qiscus.generateMessage({
        roomId: Qiscus.qiscus.selected.id,
        text: newMessage,
      });

    Keyboard.dismiss();
    
    let unixTime = moment().unix();

    dispatch(actions.setAttachment('', ''));

    if (type === MessageType.IMAGE && payload !== '') {
      let newPayload = {
        ...payload,
        caption: newMessage,
      };
      Qiscus.qiscus.sendComment(room?.id, newMessage, unixTime, MessageType.ATTACHMENT, newPayload)
        .then(function(message) {
          _onNewMessage(message);
        })
        .catch(function(error) {
          console.log('error send message', error);
        });
    } else if (type === MessageType.LINK) {
      let content = {
        caption: newMessage,
        ...payload,
      };
      let newPayload = {
        type: MessageType.LINK,
        content: {...content},
      };

      Qiscus.qiscus.sendComment(room?.id, newMessage, unixTime, MessageType.CUSTOM, newPayload)
        .then(function(message) {
          _onNewMessage(message);
        })
        .catch(function(error) {
          console.log('error send message', error);
        });
    } else if (type === MessageType.PRODUCT) {
      let content = {
        caption: newMessage,
        ...payload,
      };
      let newPayload = {
        type: MessageType.PRODUCT,
        content: {...content},
      };

      Qiscus.qiscus.sendComment(room?.id, newMessage, unixTime, MessageType.CUSTOM, newPayload)
        .then(function(message) {
          _onNewMessage(message);
        })
        .catch(function(error) {
          console.log('error send message', error);
        });
    } else {
      if (!isEmpty(newMessage)) {
        Qiscus.qiscus.sendComment(
          room?.id,
          comment.message,
          comment.unique_temp_id,
          comment.type,
          JSON.stringify(comment.payload),
          comment.extras,
        ).then(function(message) {
          _onNewMessage(message);
        })
          .catch(function(error) {
            console.log('error send message', error);
          });
      }
    }
    if (!isEmpty(newMessage) || type != '') {
      resetPayloadAndMessage();
    }
  };

  const setLoadMore = () => {
    //get first Message
    let lastId = Object.keys(messages)[0];
    if (lastId) setLastComment(lastId);
  };

  const _onPressSendAttachment = () => {
    if (!onPressSendAttachment) return null;
    onPressSendAttachment().then(opts => {
      let sizeInMB = parseFloat((opts.size / (1024 * 1024)).toFixed(2));
      if (isNaN(sizeInMB)) {
        qiscusToast('File size required');
        return;
      }
      if (!(sizeInMB <= 20)) {
        qiscusToast('File size lebih dari 20MB');
        return;
      }
      dispatch(actions.setAttachment(MessageType.IMAGE, opts.uri, ''));
      const source = {
        uri: opts.uri,
        name: opts.name,
        type: opts.type,
        caption: message,
      };
      setUrlUpload(source.uri);
      Qiscus.qiscus.upload(source, (error, progress, fileUrl) => {
        if (error != null) {
          dispatch(actions.setAttachment('', '', ''));
          qiscusToast('error while upload attachment');
          console.log('error while upload', error);
          setUrlUpload('');
          return;
        }
        if (fileUrl != null) {
          dispatch(actions.setProgressUploading(-1));
          let payload = {
            caption: message,
            file_name: opts.name,
            file_type: opts.type,
            url: fileUrl,
          };
          if (source.uri === getUrlUpload()) dispatch(actions.setAttachment(MessageType.IMAGE, opts.uri, payload));
          setUrlUpload('');
        }

        if (progress && fileUrl == null) {
          if (progress.percent < 100 && source.uri === getUrlUpload()) dispatch(actions.setProgressUploading(progress.percent));
        }
      });
    })
      .catch(e => {
      });
  };
  const getUrlUpload = () => localStorage.getItem('URL_UPLOAD');
  const setUrlUpload = url => localStorage.setItem('URL_UPLOAD', url);

  const resetPayloadAndMessage = () => {
    if (state.progressUploading === 100 ||
      state.progressUploading === -1 ||
      state.progressUploading === '') {
      dispatch(actions.setAttachment('', '', ''));
    }
    dispatch(actions.setProgressUploading(''));
    dispatch(removeReplayMessage());
    setMessage('');
  };

  return (
    <AuthRequired>
      <ScreenWrapper>
        <FlatList
          ref={flatListRef}
          inverted
          keyExtractor={(item, index) => index.toString()}
          data={getMessage()}
          renderItem={renderItem}
          ListHeaderComponent={(loading) ? <Loading/> : null}
          onEndReached={() => setLoadMore()}
          onEndReachedThreshold={0.5}
        />
        <InputMessage
          renderSendAttachment={renderSendAttachment}
          sendAttachment={sendAttachment}
          renderSendMessage={renderSendMessage}
          message={message}
          placeholder={placeholder}
          onPress={sendMessage}
          onChangeText={setMessage}
          onCloseAttachmentPreview={() => {
            setUrlUpload('');
            dispatch(actions.setAttachment('', '', ''));
            dispatch(actions.setProgressUploading(''));
          }}
          onPressSendAttachment={() => {
            if (state.progressUploading === 100 ||
              state.progressUploading === -1 ||
              state.progressUploading === '' && _onPressSendAttachment) {
              _onPressSendAttachment();
            }
          }}
        />
      </ScreenWrapper>

      <Modal
        visible={visibleImageModal}
        onRequestClose={() => {
          setVisibleImageModal(false);
        }}
        transparent={true}>
          <ImageViewer
            imageUrls={imageModal}
            onSwipeDown={() => setVisibleImageModal(false)}
            enableSwipeDown={true}
            onSave={url => {
              if(onDownload) onDownload(url)
            }}
            menuContext={{
              saveToLocal: 'Download Image',
              cancel: 'Cancel',
            }}
          />
      </Modal>
    </AuthRequired>
  );
};

export default MultichannelWidget;
