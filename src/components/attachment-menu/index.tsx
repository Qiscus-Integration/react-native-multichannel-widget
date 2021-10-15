import React from 'react';
import { useCallback } from 'react';
import Picker, { DocumentPickerResponse } from 'react-native-document-picker';
import { Portal } from '@gorhom/portal';
import {
  Image,
  ImageProps,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

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
          <AttachmentItem
            icon={require('../../assets/icon-attach-document.png')}
            label="File / Document"
            onPress={onPressDocument}
          />
          <AttachmentItem
            icon={require('../../assets/icon-attach-image.png')}
            label="Image"
            onPress={onPressImage}
          />
          {/* Spacer */}
          <View style={styles.spacer} />
        </View>
      </View>
    </Portal>
  );
}
function AttachmentItem({
  icon,
  label,
  onPress,
}: {
  icon: ImageProps['source'];
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.menuItemContainer}>
        <Image source={icon} />
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
