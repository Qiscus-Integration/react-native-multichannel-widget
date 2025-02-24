import { Portal } from '@gorhom/portal';
import { useAtomValue } from 'jotai/utils';
import React, { PropsWithChildren, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Picker, { DocumentPickerResponse } from 'react-native-document-picker';
import IcAttachDocument from '../../icons/attach-document';
import IcAttachImage from '../../icons/attach-image';
import { fieldChatIconColorThemeAtom } from '../../state';

type IAttachmentMenuProps = {
  onClose: () => void;
  onImageSelected: (v: DocumentPickerResponse) => void;
  onDocumentSelected: (v: DocumentPickerResponse) => void;
};
export function AttachmentMenu({
  onClose,
  onImageSelected,
  onDocumentSelected,
}: IAttachmentMenuProps) {
  const iconColor = useAtomValue(fieldChatIconColorThemeAtom);

  const onPressImage = useCallback(() => {
    Picker.pickSingle({
      allowMultiSelection: false,
      type: Picker.types.images,
    })
      .then((v) => onImageSelected(v))
      .then(() => onClose())
      .catch(() => {});
  }, [onClose, onImageSelected]);
  const onPressDocument = useCallback(() => {
    Picker.pickSingle({
      allowMultiSelection: false,
      type: Picker.types.allFiles,
    })
      .then((v) => onDocumentSelected(v))
      .then(() => onClose())
      .catch(() => {});
  }, [onClose, onDocumentSelected]);

  return (
    <Portal name="attachment-menu-child" hostName="attachment-menu">
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            onClose?.();
          }}
        >
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        <View style={styles.popupContainer}>
          <AttachmentItem label="File / Document" onPress={onPressDocument}>
            <IcAttachDocument color={iconColor} />
          </AttachmentItem>
          <AttachmentItem label="Image" onPress={onPressImage}>
            <IcAttachImage color={iconColor} />
          </AttachmentItem>
          {/* Spacer */}
          <View style={styles.spacer} />
        </View>
      </View>
    </Portal>
  );
}

type IAttachmentItemProps = PropsWithChildren<{
  label: string;
  onPress: () => void;
}>;
function AttachmentItem({ label, onPress, children }: IAttachmentItemProps) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.menuItemContainer}>
        {children}
        <Text style={styles.menuItemLabel}>{label}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  backdrop: {
    backgroundColor: '#00000077',
    height: '100%',
    width: '100%',
  },
  popupContainer: {
    backgroundColor: 'white',
    width: '100%',
    bottom: 0,
    position: 'absolute',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
  },
  spacer: { height: 30 },
  menuItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    margin: 3,
  },
  menuItemLabel: { marginLeft: 10 },
});
