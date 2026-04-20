/**
 * use-file-picker.ts
 *
 * Example hook that wraps @react-native-documents/picker and returns callbacks
 * compatible with the library's PickedFile type.
 */
import type { PickedFile } from '@qiscus-community/react-native-multichannel-widget';
import {
  errorCodes,
  isErrorWithCode,
  pick,
  types,
} from '@react-native-documents/picker';
import { useCallback } from 'react';

export function useFilePicker(): {
  pickImage: () => Promise<PickedFile | null>;
  pickDocument: () => Promise<PickedFile | null>;
} {
  const pickOne = useCallback(async (type: any): Promise<PickedFile | null> => {
    try {
      const [result] = await pick({
        type: [type],
        allowMultiSelection: false,
      });

      if (!result) return null;

      return {
        uri: result.uri,
        type: result.type ?? null,
        name: result.name ?? null,
      };
    } catch (err) {
      if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
        return null;
      }
      throw err;
    }
  }, []);

  const pickImage = useCallback(async () => {
    return pickOne(types.images);
  }, [pickOne]);

  const pickDocument = useCallback(async () => {
    return pickOne(types.allFiles);
  }, [pickOne]);

  return { pickImage, pickDocument };
}
