import React from 'react';
import Svg, {Rect, Text} from 'react-native-svg';

interface InitialsAvatarProps {
  firstName: string;
  lastName: string;
  size?: number;
}
const InitialsAvatar: React.FC<InitialsAvatarProps> = ({
  firstName,
  lastName,
  size = 24,
}) => {
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
  return (
    <Svg height={size} width={size}>
      <Rect width={size} height={size} fill="#D02462" rx={6} ry={6} />
      <Text
        x={size / 2}
        y={size / 2 + size / 4}
        fontSize={size / 2}
        fill="#FFFFFF"
        textAnchor="middle"
        fontWeight="bold">
        {initials}
      </Text>
    </Svg>
  );
};
export default InitialsAvatar;
