import { useAtomValue } from 'jotai/utils';
import { useMemo, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import IcAddAttachment from '../icons/add-attachment';
import IcSendMessage from '../icons/send-message';
import {
  fieldChatBorderColorThemeAtom,
  fieldChatIconColorThemeAtom,
  fieldChatTextColorThemeAtom,
  sendContainerBackgroundColorThemeAtom,
  sendContainerColorThemeAtom,
} from '../state';

type MessageFormProps = {
  onTapAddAttachment: () => void;
  onSendMessage: (message: string) => void;
};

const FALLBACK_DARK_TEXT = '#1A1A1A';
const FALLBACK_LIGHT_TEXT = '#FFFFFF';
const FALLBACK_DARK_RGB: [number, number, number] = [26, 26, 26];
const FALLBACK_LIGHT_RGB: [number, number, number] = [255, 255, 255];

function clampColorPart(v: number) {
  return Math.max(0, Math.min(255, Math.round(v)));
}

function parseRgbPart(part: string): number | null {
  if (part.endsWith('%')) {
    const percent = parseFloat(part.slice(0, -1));
    if (Number.isNaN(percent)) return null;
    return clampColorPart((percent / 100) * 255);
  }

  const value = parseFloat(part);
  if (Number.isNaN(value)) return null;
  return clampColorPart(value);
}

function parseColorToRgb(color: string): [number, number, number] | null {
  const value = color.trim().toLowerCase();

  if (value.startsWith('#')) {
    const raw = value.slice(1);
    const hex =
      raw.length === 3 || raw.length === 4
        ? raw
            .slice(0, 3)
            .split('')
            .map((it) => `${it}${it}`)
            .join('')
        : raw.length === 6 || raw.length === 8
          ? raw.slice(0, 6)
          : '';
    if (!/^[0-9a-f]{6}$/.test(hex)) return null;

    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }

  const match = value.match(/^rgba?\(([^)]+)\)$/);
  if (!match) return null;

  const channelText = match[1];
  if (channelText == null) return null;

  const parts = channelText
    .split(',')
    .slice(0, 3)
    .map((it) => it.trim());
  const [p1, p2, p3] = parts;
  if (p1 == null || p2 == null || p3 == null) return null;

  const r = parseRgbPart(p1);
  const g = parseRgbPart(p2);
  const b = parseRgbPart(p3);
  if (r == null || g == null || b == null) return null;

  return [r, g, b];
}

function toLuminance([r, g, b]: [number, number, number]) {
  const toLinear = (value: number) => {
    const srgb = value / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  };
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

function getContrastRatio(
  first: [number, number, number],
  second: [number, number, number]
) {
  const l1 = toLuminance(first);
  const l2 = toLuminance(second);
  const bright = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (bright + 0.05) / (dark + 0.05);
}

function resolveReadableTextColor(textColor: string, bgColor: string) {
  const text = textColor.trim();
  const bg = bgColor.trim();
  if (text.length === 0) return FALLBACK_DARK_TEXT;

  const textRgb = parseColorToRgb(text);
  const bgRgb = parseColorToRgb(bg);

  if (!textRgb || !bgRgb) {
    return text.toLowerCase() === bg.toLowerCase() ? FALLBACK_DARK_TEXT : text;
  }

  const contrast = getContrastRatio(textRgb, bgRgb);
  if (contrast >= 3) return text;

  const darkContrast = getContrastRatio(FALLBACK_DARK_RGB, bgRgb);
  const lightContrast = getContrastRatio(FALLBACK_LIGHT_RGB, bgRgb);
  return darkContrast >= lightContrast
    ? FALLBACK_DARK_TEXT
    : FALLBACK_LIGHT_TEXT;
}

export function MessageForm(props: MessageFormProps) {
  const [text, setText] = useState<string>();

  const containerBgColor = useAtomValue(sendContainerBackgroundColorThemeAtom);
  const containerFgBorderColor = useAtomValue(fieldChatBorderColorThemeAtom);
  const containerFgColor = useAtomValue(sendContainerColorThemeAtom);
  const fieldFgColor = useAtomValue(fieldChatTextColorThemeAtom);
  const iconColor = useAtomValue(fieldChatIconColorThemeAtom);
  const readableFieldFgColor = useMemo(
    () => resolveReadableTextColor(fieldFgColor, containerFgColor),
    [containerFgColor, fieldFgColor]
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: containerBgColor,
          borderTopColor: containerFgBorderColor,
        },
      ]}
    >
      <TouchableOpacity onPress={props.onTapAddAttachment} style={styles.btn}>
        <IcAddAttachment color={iconColor} />
      </TouchableOpacity>
      <View
        style={[
          styles.formContainer,
          {
            borderColor: containerFgBorderColor,
            backgroundColor: containerFgColor,
          },
        ]}
      >
        <TextInput
          placeholder="Send a message..."
          placeholderTextColor={readableFieldFgColor}
          selectionColor={readableFieldFgColor}
          value={text}
          onChangeText={setText}
          style={[
            styles.textInput,
            {
              color: readableFieldFgColor,
            },
          ]}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          if (text && text.trim().length > 0) {
            props.onSendMessage(text);
            setText('');
          }
        }}
        style={styles.btn}
      >
        <IcSendMessage color={iconColor} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexBasis: 66,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',

    backgroundColor: '#FAFAFA',
    borderTopColor: '#E3E3E3',
    borderTopWidth: 1,
    minHeight: 66,
  },
  btn: {
    marginHorizontal: 10,
  },
  formContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderColor: '#E3E3E3',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  textInput: { padding: 0 },
});
