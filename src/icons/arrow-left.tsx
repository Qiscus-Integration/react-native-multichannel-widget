import * as React from 'react'
import Svg, {Path, SvgProps} from 'react-native-svg';

export default function IcArrowLeft(props: SvgProps) {
  return (
    <Svg width={17} height={16} fill="none" {...props}>
      <Path
        fill="currentColor"
        d="M.293 7.293a1 1 0 0 0 0 1.414l6.364 6.364a1 1 0 0 0 1.414-1.414L2.414 8l5.657-5.657A1 1 0 0 0 6.657.93L.293 7.293ZM17 7H1v2h16V7Z"
      />
    </Svg>
  );
}
