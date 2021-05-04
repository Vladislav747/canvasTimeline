import { Padding, Radius, RoundedRectOptions } from "./types/RoundedRectTypes";

export default class RoundedRect {
  private readonly _x: number;
  private readonly _y: number;
  private readonly _width: number;
  private readonly _height: number;
  private readonly _radius: Radius;
  private readonly _padding: Padding;

  constructor({
    x,
    y,
    width,
    height,
    radius = 0,
    padding = 0,
  }: RoundedRectOptions) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._radius = {
      topLeft: radius,
      topRight: radius,
      bottomRight: radius,
      bottomLeft: radius,
    };
    this._padding =
      typeof padding === "object"
        ? padding
        : {
            top: padding,
            right: padding,
            bottom: padding,
            left: padding,
          };
  }

  /**
   * Создание формы для отрисовки прямоугольника
   * @param {CanvasRenderingContext2D} context контекст для отрисовки
   */
  public createShape(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.moveTo(this._x, this._y);
    const width = this._width + this._padding.left + this._padding.right;
    const height = this._height + this._padding.top + this._padding.bottom;
    // Верхний правый угол
    context.lineTo(this._x + width - this._radius.topRight, this._y);
    context.quadraticCurveTo(
      this._x + width,
      this._y,
      this._x + width,
      this._y + this._radius.topRight
    );
    // Нижний правый угол
    context.lineTo(
      this._x + width,
      this._y + height - this._radius.bottomRight
    );
    context.quadraticCurveTo(
      this._x + width,
      this._y + height,
      this._x + width - this._radius.bottomRight,
      this._y + height
    );
    // Нижний левый угол
    context.lineTo(this._x + this._radius.bottomLeft, this._y + height);
    context.quadraticCurveTo(
      this._x,
      this._y + height,
      this._x,
      this._y + height - this._radius.bottomLeft
    );
    // Верхний левый угол
    context.lineTo(this._x, this._y + this._radius.topLeft);
    context.quadraticCurveTo(
      this._x,
      this._y,
      this._x + this._radius.topLeft,
      this._y
    );
    context.closePath();
  }
}
