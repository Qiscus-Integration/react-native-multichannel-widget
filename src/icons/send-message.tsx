import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

export default function IcSendMessage(props: SvgProps) {
  return (
    <Svg width={24} height={24} fill="none" {...props}>
      <Path
        fill="currentColor"
        fillRule="evenodd"
        d="M.012 2.041C-.145.604 1.313-.445 2.587.19L22.99 10.35c1.347.67 1.347 2.63 0 3.3L2.587 23.81c-1.274.634-2.732-.415-2.575-1.852l.853-7.844a1.818 1.818 0 0 1 1.564-1.618L6.322 12l-3.893-.497A1.818 1.818 0 0 1 .865 9.885L.012 2.04Zm2.05-.752c-.425-.212-.911.138-.86.617l.854 7.844c.031.28.247.504.522.54l3.893.496c1.4.178 1.4 2.25 0 2.428l-3.893.497a.606.606 0 0 0-.522.54l-.853 7.843c-.052.48.434.829.858.617L22.465 12.55a.618.618 0 0 0 0-1.1L2.061 1.29Z"
        clipRule="evenodd"
      />
    </Svg>
  );
}
