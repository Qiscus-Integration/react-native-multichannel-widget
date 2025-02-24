import type { SvgProps } from 'react-native-svg';
import Svg, { Circle, Path } from 'react-native-svg';

export default function IcAddAttachment(props: SvgProps) {
  return (
    <Svg width={24} height={24} fill="none" {...props}>
      <Circle cx={12} cy={12} r={11.5} stroke="currentColor" />
      <Path stroke="currentColor" d="M12 7v10M17 12H7" />
    </Svg>
  );
}
