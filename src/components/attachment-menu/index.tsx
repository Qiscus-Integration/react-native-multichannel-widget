import {
  errorCodes,
  isErrorWithCode,
  pick,
  types,
} from '@react-native-documents/picker';
import type { DocumentPickerOptionsBase } from '@react-native-documents/picker';
import { Portal } from '@gorhom/portal';
import { useAtomValue } from 'jotai/utils';
import type { PropsWithChildren } from 'react';
import { useCallback } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import type { PickedFile } from '../../types/file-picker';
import IcAttachDocument from '../../icons/attach-document';
import IcAttachImage from '../../icons/attach-image';
import {
  fieldChatBorderColorThemeAtom,
  fieldChatIconColorThemeAtom,
  fieldChatTextColorThemeAtom,
  sendContainerBackgroundColorThemeAtom,
} from '../../state';

type IAttachmentMenuProps = {
  onClose: () => void;
  /** Called after the user picks an image. */
  onImageSelected: (v: PickedFile) => void;
  /** Called after the user picks a document. */
  onDocumentSelected: (v: PickedFile) => void;
};

const documentTypes = [
  types.pdf,
  types.doc,
  types.docx,
  types.xls,
  types.xlsx,
  types.ppt,
  types.pptx,
  'text/csv',
  types.plainText,
  types.json,
  types.zip,
] satisfies Exclude<DocumentPickerOptionsBase['type'], undefined>;

async function pickSingleFile(params: {
  type: Exclude<DocumentPickerOptionsBase['type'], undefined>;
}) {
  try {
    const result = await pick({
      allowMultiSelection: false,
      type: params.type,
    });
    const first = result[0];
    if (!first) return null;

    return {
      uri: first.uri,
      type: first.type,
      name: first.name,
    } satisfies PickedFile;
  } catch (error) {
    if (
      isErrorWithCode(error) &&
      error.code === errorCodes.OPERATION_CANCELED
    ) {
      return null;
    }
    throw error;
  }
}

export function AttachmentMenu({
  onClose,
  onImageSelected,
  onDocumentSelected,
}: IAttachmentMenuProps) {
  const containerBgColor = useAtomValue(sendContainerBackgroundColorThemeAtom);
  const containerFgBorderColor = useAtomValue(fieldChatBorderColorThemeAtom);
  const iconColor = useAtomValue(fieldChatIconColorThemeAtom);

  const onPressImage = useCallback(() => {
    pickSingleFile({ type: types.images })
      .then((v) => {
        if (!v) return;
        onImageSelected(v);
        onClose();
      })
      .catch(() => {});
  }, [onClose, onImageSelected]);
  const onPressDocument = useCallback(() => {
    pickSingleFile({ type: documentTypes })
      .then((v) => {
        if (!v) return;
        onDocumentSelected(v);
        onClose();
      })
      .catch(() => {});
  }, [onClose, onDocumentSelected]);

  return (
    <Portal name="attachment-menu-child" hostName="attachment-menu">
      <View
        style={[
          styles.container,
          {
            backgroundColor: containerBgColor,
            borderColor: containerFgBorderColor,
          },
        ]}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            onClose?.();
          }}
        >
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        <View
          style={[
            styles.popupContainer,
            {
              backgroundColor: containerBgColor,
              borderColor: containerFgBorderColor,
            },
          ]}
        >
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
  const containerFgColor = useAtomValue(fieldChatTextColorThemeAtom);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.menuItemContainer}>
        {children}
        <Text style={[styles.menuItemLabel, { color: containerFgColor }]}>
          {label}
        </Text>
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
