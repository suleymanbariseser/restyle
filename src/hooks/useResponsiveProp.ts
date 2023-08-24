import {PropValue, ResponsiveBaseTheme, ResponsiveValue} from '../types';
import {getValueForScreenSize, isResponsiveObjectValue} from '../utilities';

import useTheme from './useTheme';
import {useBreakpoint} from './useBreakpoint';

const useResponsiveProp = <
  Theme extends ResponsiveBaseTheme,
  TVal extends PropValue,
>(
  propValue: ResponsiveValue<TVal, Theme['breakpoints']>,
) => {
  const theme = useTheme<Theme>();
  const breakpoint = useBreakpoint();

  return isResponsiveObjectValue(propValue, theme)
    ? getValueForScreenSize({
        responsiveValue: propValue,
        breakpoints: theme.breakpoints,
        breakpoint,
      })
    : propValue;
};

export default useResponsiveProp;
