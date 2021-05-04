export const minuteBreakpoints = {
  mobile: 1,
  tablet: 5,
  desktop: 8,
};

export const getMinuteDashesCount = (width: number): number => {
  if (width <= 420) return minuteBreakpoints.mobile;
  if (width <= 768) return minuteBreakpoints.tablet;
  return minuteBreakpoints.desktop;
};

export const debounce = (func: Function, timeout: number) => {
  let innerTimeout: any;
  return function () {
    const fnCall = () => {
      func.apply(this, arguments);
    };
    clearTimeout(innerTimeout);
    innerTimeout = setTimeout(fnCall, timeout);
  };
};
