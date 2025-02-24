import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export default function IcAttachDocument(props: SvgProps) {
  return (
    <Svg width={24} height={24} fill="none" viewBox="0 0 32 32" {...props}>
      <Path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M18.667 2.667H8a2.667 2.667 0 0 0-2.667 2.666v21.334A2.667 2.667 0 0 0 8 29.333h16a2.667 2.667 0 0 0 2.667-2.666v-16l-8-8Z"
      />
      <Path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M18.667 2.667v8h8M21.333 17.333H10.667M21.333 22.667H10.667M13.333 12h-2.666"
      />
    </Svg>
  );
}
