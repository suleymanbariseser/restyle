import {useMemo} from 'react';
import {StyleProp} from 'react-native';

import {BaseTheme, RNStyle} from '../types';

import useTheme from './useTheme';
import {useBreakpoint} from './useBreakpoint';

const filterRestyleProps = <
  TRestyleProps,
  TProps extends {[key: string]: unknown} & TRestyleProps,
>(
  componentProps: TProps,
  omitPropertiesMap: {[key in keyof TProps]: boolean},
) => {
  const cleanProps: TProps = {} as TProps;
  const restyleProps: TProps & {variant?: unknown} = {} as TProps;
  let serializedRestyleProps = '';
  if (omitPropertiesMap.variant) {
    restyleProps.variant = componentProps.variant ?? 'defaults';
  }
  for (const key in componentProps) {
    if (omitPropertiesMap[key as keyof TProps]) {
      restyleProps[key] = componentProps[key];
      serializedRestyleProps += `${String(key)}:${componentProps[key]};`;
    } else {
      cleanProps[key] = componentProps[key];
    }
  }

  const keys = {cleanProps, restyleProps, serializedRestyleProps};
  return keys;
};

const useRestyle = <
  Theme extends BaseTheme,
  TRestyleProps extends {[key: string]: any},
  TProps extends TRestyleProps & {style?: StyleProp<RNStyle>},
>(
  composedRestyleFunction: {
    buildStyle: <TInputProps extends TProps>(
      props: TInputProps,
      {
        theme,
        breakpoint,
      }: {
        theme: Theme;
        breakpoint: string | undefined;
      },
    ) => RNStyle;
    properties: (keyof TProps)[];
    propertiesMap: {[key in keyof TProps]: boolean};
  },
  props: TProps,
) => {
  const theme = useTheme<Theme>();

  const breakpoint = useBreakpoint<Theme>();

  const {cleanProps, restyleProps, serializedRestyleProps} = filterRestyleProps(
    props,
    composedRestyleFunction.propertiesMap,
  );

  const calculatedStyle: StyleProp<RNStyle> = useMemo(() => {
    const style = composedRestyleFunction.buildStyle(restyleProps as TProps, {
      theme,
      breakpoint,
    });

    const styleProp: StyleProp<RNStyle> = props.style;
    if (typeof styleProp === 'function') {
      return ((...args: any[]) =>
        [style, styleProp(...args)].filter(Boolean)) as StyleProp<RNStyle>;
    }
    return [style, styleProp].filter(Boolean);

    // We disable the exhaustive deps rule here in order to trigger the useMemo
    // when the serialized string of restyleProps changes instead of the object
    // reference which will change on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    theme,
    breakpoint,
    props.style,
    serializedRestyleProps,
    composedRestyleFunction,
  ]);

  cleanProps.style = calculatedStyle;
  return cleanProps;
};

export default useRestyle;
