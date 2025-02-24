import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

export default function IcDoubleTick(props: SvgProps) {
  return (
    <Svg width={14} height={8} fill="none" {...props}>
      <Path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.917.5 3.5 6.917.583 4M13.417.5 7 6.917l-.583-.584"
      />
    </Svg>
  );
}
