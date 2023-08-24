import {
  AtLeastOneResponsiveValue,
  Breakpoint,
  ResponsiveBaseTheme,
} from '../types';

/**
 * Returns actual value for given `responsiveValue`, `breakpoints`, and current `dimensions`.
 */
export const getValueForScreenSize = <Theme extends ResponsiveBaseTheme, TVal>({
  responsiveValue,
  breakpoints,
  breakpoint,
}: {
  responsiveValue: AtLeastOneResponsiveValue<TVal, Theme['breakpoints']>;
  breakpoints: Theme['breakpoints'];
  breakpoint: string | undefined;
}): TVal | undefined => {
  const sortedBreakpoints = Object.entries(breakpoints)
    .sort((valA, valB) => {
      const valAWidth = getWidth(valA[1]);
      const valBWidth = getWidth(valB[1]);

      return valAWidth - valBWidth;
    })
    .map(([key]) => key);

  const index = sortedBreakpoints.indexOf(breakpoint as string);

  return Object.entries(responsiveValue)
    .filter(([_, value]) => value !== undefined)
    .find(([key]) => sortedBreakpoints.indexOf(key) >= index)?.[1];
};

function getWidth(value: Breakpoint) {
  if (typeof value === 'object') {
    return value.width;
  }

  return value;
}
