import { formatTime } from "../helpers";
import { CursorOptions } from "./types/CursorType";
import RoundedRect from "../shapes/roundedRect/RoundedRect";

export default class Cursor {
  private readonly _x: number;
  private readonly _y: number;
  private readonly _time: Date;

  private readonly _firstHeight: number = 8;
  private readonly _secondHeight: number = 24;
  private readonly _radius: number = 4;
  private static readonly _width: number = 2;
  private readonly _color: string = "#87B3ED";
  private readonly _tooltipRadius: number = 4;
  private readonly _tooltipPadding: number = 2;

  constructor({ x, y, time }: CursorOptions) {
    this._x = x;
    this._y = y;
    this._time = time;
  }

  /**
   * Отрисовка
   * @param {CanvasRenderingContext2D} context контекст для отрисовки
   */
  render(context: CanvasRenderingContext2D): void {
    this.renderUpperLine(context);
    this.renderDownLine(context);
    this.renderCircle(context);

    context.lineWidth = 1;

    this.renderTime(context);
  }

  /**
   * Отрисовка верхней линии
   * @param {CanvasRenderingContext2D} context контекст для отрисовки
   * @private
   */
  private renderUpperLine(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.strokeStyle = context.fillStyle = this._color;
    context.lineWidth = Cursor._width;
    const x = this._x - Cursor._width;
    const y1 = this._y;
    const y2 = y1 + this._firstHeight;
    context.moveTo(x, y1);
    context.lineTo(x, y2);
    context.stroke();
    context.closePath();
  }

  /**
   * Отрисовка нижней линии
   * @param {CanvasRenderingContext2D} context контекст для отрисовки
   * @private
   */
  private renderDownLine(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.strokeStyle = context.fillStyle = this._color;
    context.lineWidth = Cursor._width;
    const x = this._x - Cursor._width;
    const y1 = this._y + this._firstHeight + this._radius * 2;
    const y2 = y1 + this._secondHeight;
    context.moveTo(x, y1);
    context.lineTo(x, y2);
    context.stroke();
    context.closePath();
  }

  /**
   * Отрисовка круга на линии
   * @param {CanvasRenderingContext2D} context контекст для отрисовки
   * @private
   */
  private renderCircle(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.strokeStyle = context.fillStyle = this._color;
    context.lineWidth = Cursor._width;
    const x = this._x - Cursor._width;
    const y = this._y + this._firstHeight + this._radius;
    context.arc(x, y, this._radius, 0, Math.PI * 2);
    context.fill();
    context.closePath();
  }

  /**
   * Отрисовка времени
   * @param {CanvasRenderingContext2D} context контекст для отрисовки
   * @private
   */
  private renderTime(context: CanvasRenderingContext2D): void {
    const formattedTime = formatTime(this._time, true);
    const textHeight = ~~context.font.split(/\s/gm)[0].slice(0, 2);
    const textWidth = context.measureText(formattedTime).width;
    const x = this._x - textWidth / 2 - this._tooltipPadding;
    const y = this._y + this._firstHeight + this._radius * 2 + 6;

    const renderTimeShape = () => {
      context.beginPath();
      new RoundedRect({
        x: x,
        y: y,
        width: textWidth,
        height: textHeight,
        radius: this._tooltipRadius,
        padding: this._tooltipPadding,
      }).createShape(context);
      context.fill();

      context.closePath();
    };

    const renderTimeString = () => {
      const textX = x + this._tooltipPadding;
      const textY = y + textHeight;
      context.beginPath();
      context.fillStyle = "#FFFFFF";
      context.fillText(formattedTime, textX, textY);
      context.closePath();
    };

    renderTimeShape();
    renderTimeString();
  }

  /**
   * Толщина курсора
   */
  static get strokeWidth(): number {
    return Cursor._width;
  }
}
