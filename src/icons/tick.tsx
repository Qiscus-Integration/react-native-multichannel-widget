import * as React from 'react'
import Svg, {Path, SvgProps} from 'react-native-svg';

export default function IcTick(props: SvgProps) {
  return (
    <Svg width={12} height={8} fill="none" {...props}>
      <Path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.667.5 4.25 6.917 1.333 4"
      />
    </Svg>
  );
}
