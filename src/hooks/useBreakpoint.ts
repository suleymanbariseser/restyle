import {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';

import {BaseTheme, Breakpoint} from '../types';

import useTheme from './useTheme';

function getWidth(value: Breakpoint) {
  if (typeof value === 'object') {
    return value.width;
  }

  return value;
}

const getBreakpoint = (breakpoints?: {[key: string]: Breakpoint}) => {
  if (!breakpoints) return undefined;

  const {width, height} = Dimensions.get('window');

  const sortedBreakpoints = Object.entries(breakpoints).sort((valA, valB) => {
    const valAWidth = getWidth(valA[1]);
    const valBWidth = getWidth(valB[1]);

    return valAWidth - valBWidth;
  });

  return sortedBreakpoints.reduce<string | undefined>((acc, [key, value]) => {
    if (typeof value === 'object') {
      if (width >= value.width && height >= value.height) {
        return key;
      }
    } else if (width >= value) {
      return key;
    }

    return acc;
  }, undefined);
};

export const useBreakpoint = <Theme extends BaseTheme>() => {
  const theme = useTheme<Theme>();

  const [breakpoint, setBreakpoint] = useState<string | undefined>(() =>
    getBreakpoint(theme.breakpoints),
  );

  useEffect(() => {
    const listener = Dimensions.addEventListener('change', () => {
      setBreakpoint(getBreakpoint(theme.breakpoints));
    });

    return () => {
      listener.remove();
    };
  }, [theme.breakpoints]);

  return breakpoint;
};
