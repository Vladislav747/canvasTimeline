export const minuteBreakpoints = {
  mobile: 1,
  tablet: 5,
  desktop: 8,
};

export const getMinuteDashesCount = (width: number): number => {
  if (width <= 480) return minuteBreakpoints.mobile;
  if (width <= 768) return minuteBreakpoints.tablet;
  return minuteBreakpoints.desktop;
};
