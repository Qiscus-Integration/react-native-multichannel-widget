import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Keyboard, Clipboard, Modal, View, Linking} from 'react-native';
import * as Qiscus from '../../../services/qiscus';
import xs from 'xstream';
import Bubble from '../../common/Bubble';
import {MessageType} from '../../../constants/messageType';
import {
  getMoment as moment,
  isEmpty,
  qiscusLogger,
  qiscusToast,
} from '../../../utils';
import InputMessage from '../../common/InputMessage';
import * as actions from '../../../contexts/actions';
import {
  removeReplayMessage,
  setReplayMessage,
  setTypingStatus,
} from '../../../contexts/actions';
import ScreenWrapper from '../../common/ScreenWrapper';
import Widget from '../../../contexts/WidgetContext';
import AuthRequired from '../../common/AuthRequired';
import {useActionSheet} from '@expo/react-native-action-sheet';
import ImageViewer from 'react-native-image-zoom-viewer';
import MessageTyping from '../../common/MessageTyping';
import LoadMore from "../../common/LoadMore";
const MultichannelWidget = (props) => {
  const {
    onSuccessGetRoom,
    onTyping,
    onPressSendAttachment,
    onDownload,
    renderSendAttachment,
    sendAttachment,
    renderSendMessage,
    filterMessage,
    placeholder,
  } = props;

  const [room, setRoom] = useState({});
  const [lastComment, setLastComment] = useState();
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [visibleImageModal, setVisibleImageModal] = useState(false);
  const [imageModal, setImageModal] = useState([{
    url: '',
  }]);
  const {state, dispatch, getUnreadCount, currentUser, updateRoomInfo} = Widget();
  const roomId = state.roomId;

  let subscription3 = null;
  let uploadUrl = '';
  const flatListRef = React.useRef(null);

  const subscriptionNewMessage = useCallback(() => {
    subscription3 = xs.merge(
        Qiscus.newMessage$().map(_onNewMessage),
        Qiscus.messageDelivered$().map(_onMessageDelivered),
        Qiscus.messageRead$().map(_onMessageRead),
    )
      .subscribe({
        error: error => qiscusLogger(error, 'subscription error'),
      });
  }, []);
  const {showActionSheetWithOptions} = useActionSheet();

  useEffect(() => {
    if (isLogin()) {
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
            qiscusLogger(e);
          });
      } catch (e) {
        qiscusLogger(e);
      }
      subscriptionNewMessage();
    }
  }, [currentUser]);

  useEffect(() => {
    setLoading(true)
    let options = {
      last_comment_id: lastComment,
      after: false,
      limit: 20,
    };
    try {
      if (isLogin()) {
        Qiscus.qiscus.loadComments(room?.id, options)
          .then(msg => {
            const newMessage = msg.reverse();
            const formattedMessages = {};
            newMessage.forEach(item => {
              formattedMessages[item.id] = item;
            });
            let combine = {...Object.assign(messages, formattedMessages)};
            setMessages(combine);
            setLoading(false)
          })
          .catch(e => {
            setLoading(false)
            qiscusLogger(e, 'loadComments error');
          });
      }
    } catch (e) {
      setLoading(false)
      qiscusLogger(e);
    }
  }, [lastComment]);

  const isLogin = () => roomId !== 0 && roomId !== null && Qiscus.qiscus.userData?.token

  useEffect(() => {
    Qiscus.onLoad = true
    if(isLogin()){
      updateRoomInfo(Qiscus.selectedRoomId)
    }
    return (() => {
      Qiscus.onLoad = false
      //clean up function
      getUnreadCount();
      dispatch(actions.setProgressUploading(''));
      resetPayloadAndMessage();
      setUrlUpload('');
      subscription3?.unsubscribe();
      dispatch(setTypingStatus(false));
      dispatch(actions.setLoginMessage(null));
      Qiscus.qiscus.exitChatRoom();
    });
  }, []);

  const getMessage = () => {
    let data = Object.values(messages);
    //reverse and filter message
    if (filterMessage && typeof filterMessage === 'function') {
      return data.length > 0 ? data.reverse().filter(filterMessage) : [];
    } else {
      return data.length > 0 ? data.reverse() : [];
    }
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
        if (Qiscus.onLoad) {
          setMessages(removePropery(item.id, messages));
        }
      })
  };

  const renderItem = ({item, index}) => {
    let beforeMessage = messages[item.comment_before_id];
    let afterMessage = getMessage()[index - 1];
    return (<Bubble
      openActionMessage={onOpenActionMessage}
      onPressImage={(image, file_name) => {
        setImageModal(image);
        setVisibleImageModal(true);
      }}
      index={index}
      item={item}
      beforeItem={beforeMessage}
      afterItem={afterMessage}
      scrollDown={scrollDown}
      btnCallback={btnCallback}
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

  const sendMessage = () => {
    if(!Qiscus.qiscus?.selected?.id) return;

    const {payload, type} = state.attachment;
    const isReply = !!(state.replayMessage?.id);

    let newMessage = (message.length > 0) ? message.toString().trim() : message;

    if (isEmpty(newMessage) && type !== MessageType.IMAGE) return

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
    dispatch(actions.setAttachment('', ''));

    if(type === MessageType.IMAGE){
      comment.payload = {
        ...payload,
        caption: newMessage,
      };
      comment.type = MessageType.ATTACHMENT
    }

    if(state.messageExtras) comment.extras = state.messageExtras

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
          qiscusLogger(error, 'error send message');
        });

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
        if(!Qiscus.onLoad) return;
        if (error != null) {
          dispatch(actions.setAttachment('', '', ''));
          qiscusToast('error while upload attachment');
          qiscusLogger(error, 'error while upload');
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
        qiscusLogger(e,"upload_attachment")
      });
  };
  const getUrlUpload = () => uploadUrl;
  const setUrlUpload = url => {
    uploadUrl = url;
  };

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

  const scrollDown = () =>{
    flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 })
  }
  const sendMessagePostBack = (postback_text, payload) => {
    let roomId = Qiscus.qiscus.selected?.id
    let unixTime = moment().unix();
    Qiscus.qiscus.sendComment(roomId, postback_text, unixTime, MessageType.BUTTON_POSTBACK_RESPONSE, payload)
  }

  const btnCallback = ({type, postback_text, payload, label})=>{
    const {url} = payload

    if(type === "link"){
      Linking.openURL(url);
    }
    if(type === "postback"){
      scrollDown()
      sendMessagePostBack(!isEmpty(postback_text)? postback_text : label, payload)
    }

  }
  const showLoadMore = ()=> {
    let arrayId = Object.keys(messages);
    if(arrayId.length <= 20) return false
    return messages[arrayId[0]]?.comment_before_id !== 0
  }
  return (
    <View style={{
      flex: 1,
    }}>
      <ScreenWrapper>
        <AuthRequired>
          <FlatList
            ref={flatListRef}
            inverted
            keyExtractor={(item, index) => index.toString()}
            data={getMessage()}
            renderItem={renderItem}
            ListFooterComponent={showLoadMore() && <LoadMore onPress={()=>{setLoadMore()}}/>}
            ListHeaderComponent={state.typingStatus && <MessageTyping/>}
            onEndReached={() => setLoadMore()}
            onEndReachedThreshold={0.5}
          />
        </AuthRequired>
        <InputMessage
          renderSendAttachment={renderSendAttachment}
          sendAttachment={sendAttachment}
          renderSendMessage={renderSendMessage}
          message={message}
          placeholder={placeholder}
          onPress={sendMessage}
          onChangeText={text => {
            if (onTyping) onTyping(text);
            setMessage(text)
          }}
          onCloseAttachmentPreview={() => {
            setUrlUpload('');
            dispatch(actions.setAttachment('', '', ''));
            dispatch(actions.setProgressUploading(''));
          }}
          onPressSendAttachment={() => {
            _onPressSendAttachment()
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
            if (onDownload) onDownload(url);
          }}
          menuContext={{
            saveToLocal: 'Download Image',
            cancel: 'Cancel',
          }}
        />
      </Modal>
    </View>
  );
};

export default MultichannelWidget;
