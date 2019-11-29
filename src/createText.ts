import {Text, TextProps as RNTextProps} from 'react-native';
import createRestyleComponent from './createRestyleComponent';
import {BaseTheme} from './types';
import {
  color,
  opacity,
  spacing,
  typography,
  textShadow,
  visible,
  ColorProps,
  OpacityProps,
  SpacingProps,
  TextShadowProps,
  TypographyProps,
  VisibleProps,
} from './restyleFunctions';
import createVariant, {VariantProps} from './createVariant';

export type TextProps<Theme extends BaseTheme> = ColorProps<Theme> &
  OpacityProps<Theme> &
  VisibleProps<Theme> &
  TypographyProps<Theme> &
  SpacingProps<Theme> &
  TextShadowProps<Theme> &
  VariantProps<Theme, 'textVariants'> &
  RNTextProps;

export const textRestyleFunctions = [
  color,
  opacity,
  visible,
  typography,
  spacing,
  textShadow,
  createVariant({themeKey: 'textVariants'}),
];

const createText = <Theme extends BaseTheme>(
  BaseComponent: React.ComponentType = Text,
) => {
  return createRestyleComponent<TextProps<Theme>>(
    textRestyleFunctions,
    BaseComponent,
  );
};

export default createText;
