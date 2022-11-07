import { Button as ButtonNativeBase, IButtonProps, Text } from 'native-base';

interface Props extends IButtonProps {
  title: string;
  type?: 'primary' | 'secondary';
}

export function Button({ title, type = 'primary', ...rest }: Props) {
  const BG_COLOR = { primary: 'yellow.500', secondary: 'red.500' }
  const PRESS_COLOR = { primary: 'yellow.600', secondary: 'red.400' }
  const COLOR = { primary: 'black', secondary: 'white' }

  return (
    <ButtonNativeBase
      w="full"
      h={14}
      rounded="sm"
      fontSize="md"
      bg={BG_COLOR[type]}
      _pressed={{ bg: PRESS_COLOR[type] }}
      _loading={{ _spinner: { color: "black" } }}
      {...rest}
    >
      <Text fontSize="sm" textTransform="uppercase" fontFamily="heading" color={COLOR[type]}>
        {title}
      </Text>
    </ButtonNativeBase >
  );
}