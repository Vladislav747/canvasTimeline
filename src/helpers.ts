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

/**
 * Форматирование времени
 * @param {Date} time - объект времени
 * @param {boolean} withSeconds - добавление секунд
 */
export const formatTime = (time: Date, withSeconds = false): string => {
  const hours = (): string => {
    return time.getHours() < 10
      ? `0${time.getHours()}`
      : time.getHours().toString();
  };

  const minutes = (): string => {
    return time.getMinutes() < 10
      ? `0${time.getMinutes()}`
      : time.getMinutes().toString();
  };

  const seconds = (): string => {
    return time.getSeconds() < 10
      ? `0${time.getSeconds()}`
      : time.getSeconds().toString();
  };

  if (withSeconds) return `${hours()}:${minutes()}:${seconds()}`;

  return `${hours()}:${minutes()}`;
};

/**
 * Вызов функции в определенное кол-во секунд
 * @param {Function} func функция для вызова
 * @param {number} timeout кол-во мс
 */
export const debounce = (
  func: () => unknown,
  timeout: number
): (() => unknown) => {
  let innerTimeout: NodeJS.Timeout;
  return function () {
    clearTimeout(innerTimeout);
    innerTimeout = setTimeout(func, timeout);
  };
};
