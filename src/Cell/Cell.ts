import { formatTime } from "../helpers";
import { CellOptions } from "./types/CellTypes";

export const MINUTE_DASH_HEIGHT = 20;
export const SECOND_DASH_HEIGHT = 14;
const DASH_COLOR = "#DFDFDF";
const TEXT_COLOR = "#fff";

export default class Cell {
  //Только для чтения для пользования внутри класса
  private readonly _x: number;
  private readonly _y: number;
  private readonly _isMinute: boolean;
  private readonly _timestamp: Date | undefined;

  constructor({ x, y, isMinute, timestamp }: CellOptions) {
    //Устанавливаем данные для внутреннего экземпляра конструктора
    this._x = x;
    this._y = y;
    this._isMinute = isMinute;
    this._timestamp = timestamp;
  }

  /**
   * Метод отрисовки на canvas
   * @param context
   */
  public render(context: CanvasRenderingContext2D): void {
    context.beginPath();
    //переустановка x
    const x = this._x;
    /* 
            Для установки y выше или ниже параметра
            y для так как в в зависимости от того минута у нас 
            или секунда мы должны рисовать выше или ниже
        */
    const y = this._isMinute
      ? this._y
      : this._y + (MINUTE_DASH_HEIGHT - SECOND_DASH_HEIGHT);
    /* 
           Использовать высоту как для минуты или как для секунды
        */
    const height = this._isMinute ? MINUTE_DASH_HEIGHT : SECOND_DASH_HEIGHT;
    context.strokeStyle = DASH_COLOR;
    context.moveTo(x, y);
    context.lineTo(x, height);
    context.stroke();
    context.closePath();
    //Рисовать ли текст для метки - рисуется тока для минуты
    if (this._timestamp && this._isMinute) {
      // Обнуляем пути
      context.beginPath();
      context.fillStyle = TEXT_COLOR;
      //Меряем размер текста чтобы адекватно выставить его метку
      let formattedTime = formatTime(this._timestamp);
      const textSize = context.measureText(formattedTime);
      const textX = x - textSize.width / 2;
      const textY = y + height + 12;
      context.fillText(formattedTime, textX, textY);
      context.closePath();
    }
  }
}
