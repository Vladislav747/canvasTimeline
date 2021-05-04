export type RoundedRectOptions = {
  // Положение по X
  x: number;
  // Положение по Y
  y: number;
  // Ширина
  width: number;
  // Высота
  height: number;
  // Скругление углов
  radius?: number;
  // Внутренний отступ
  padding?: number | Padding;
};

export type Padding = {
  // Отступ сверху
  top: number;
  // Отступ слева
  left: number;
  // Отступ справа
  right: number;
  // Отступ снизу
  bottom: number;
};

export type Radius = {
  // Скругление сверху слева
  topLeft: number;
  // Скругление сверху справа
  topRight: number;
  // Скругление снизу справа
  bottomRight: number;
  // Скругление снизу слева
  bottomLeft: number;
};
