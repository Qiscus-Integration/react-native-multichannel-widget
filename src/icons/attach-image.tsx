import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

export default function IcAttachImage(props: SvgProps) {
  return (
    <Svg width={24} height={24} {...props}>
      <Path
        fill="currentColor"
        d="M5 3h13a3 3 0 0 1 3 3v13a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3m0 1a2 2 0 0 0-2 2v11.59l4.29-4.3 2.5 2.5 5-5L20 16V6a2 2 0 0 0-2-2zm4.79 13.21-2.5-2.5L3 19a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-1.59l-5.21-5.2zM7.5 6A2.5 2.5 0 0 1 10 8.5 2.5 2.5 0 0 1 7.5 11 2.5 2.5 0 0 1 5 8.5 2.5 2.5 0 0 1 7.5 6m0 1A1.5 1.5 0 0 0 6 8.5 1.5 1.5 0 0 0 7.5 10 1.5 1.5 0 0 0 9 8.5 1.5 1.5 0 0 0 7.5 7"
      />
    </Svg>
  );
}
