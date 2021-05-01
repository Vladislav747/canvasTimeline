import Cell from "../Cell/Cell";
import { CanvasOptions, TimelineOptions } from "./types/TimelineType";

const DefaultCanvasOptions: CanvasOptions = {
  width: 640,
  height: 40,
  fontSize: 10,
  fontFamily: "Roboto",
};

/**
 * Класс Timeline
 */
export default class Timeline {
  private _canvas: HTMLCanvasElement;
  private readonly _context: CanvasRenderingContext2D;
  private _width: number;
  private _height: number;
  private readonly _fontSize: number;
  private readonly _fontFamily: string;

  private _offset: number;
  private _startTime: Date | undefined;
  private _minuteDashes: number;
  private _secondsDashes: number;
  private _dashGap: number;
  private _dashCount: number;
  private _pxPerSecond: number;

  private _updateTimer: Date;

  private _paused: boolean;
  private _moving: boolean;
  //Это скорость в миллисекндуах таймлайна чем меньше тем быстрее и наоборот
  private _velocityInMs = 1000;

  constructor(canvas: HTMLCanvasElement, options: TimelineOptions) {
    const {
      startTime,
      minuteDashes,
      secondsDashes,
      canvasOptions = DefaultCanvasOptions,
    } = options;

    this._canvas = canvas;
    this._context = canvas.getContext("2d");
    this._width = canvas.width = canvasOptions.width;
    this._height = canvas.height = canvasOptions.height;
    this._fontSize = canvasOptions.fontSize;
    this._fontFamily = canvasOptions.fontFamily;

    this._offset = 0;
    this._startTime = startTime;
    this._minuteDashes = minuteDashes;
    this._secondsDashes = secondsDashes;

    this._paused = false;
    this._moving = false;

    this.init();
  }

  /**
   * Начальная функция запуска анимации
   */
  public start(): void {
    this.tick();
  }

  //По сути каждую секунду
  private tick(): void {
    this.update();
    this.render();

    requestAnimationFrame(() => {
      this.tick();
    });
  }

  public pause(): void {
    this._paused = true;
  }

  public play(): void {
    this._paused = false;
  }

  /**
   * Для обновления данных updateTimer и _offset каждую секунду
   */
  public update(): void {
    if (!this._paused) {
      const delta = Date.now() - this._updateTimer.getTime();
      if (delta > this._velocityInMs) {
        this._updateTimer = new Date();
        this._offset += this._pxPerSecond;
      }
    }
  }

  /**
   * Отрисовать
   */
  public render(): void {
    /**
     * Отрисовать фон
     * @param context
     */
    const renderBackground = (context: CanvasRenderingContext2D) => {
      context.beginPath();
      context.fillStyle = "#757575";
      context.fillRect(0, 0, this._width, this._height);
      context.closePath();
    };

    /**
     * Отрисовать деления
     * @param context
     */
    const renderDashes = (context: CanvasRenderingContext2D) => {
      //Начальный индекс
      const startIndex = Math.floor(this._offset / this._dashGap);

      for (let i = startIndex; i <= this._dashCount + startIndex; i++) {
        const isMinute = i % this._secondsDashes === 0;
        const timestampMs =
          this._startTime.getTime() + ((i * 60) / this._secondsDashes) * 1000;
        const timestamp = new Date(timestampMs);

        new Cell({
          x: i * this._dashGap - this._offset,
          y: 0,
          isMinute,
          timestamp,
        }).render(context);
      }
    };

    /**
     * Отрисовать линию вверху над делениями там качество и кэш
     */
    const renderQualityLine = (context: CanvasRenderingContext2D) => {
      context.beginPath();
      context.fillStyle = "grey";
      context.fillRect(0, 0, this._width, 10);
      context.closePath();
    };

    renderBackground(this._context);
    renderDashes(this._context);
    renderQualityLine(this._context);
  }

  /**
   * Главная инициализация
   */
  private init(): void {
    // Устанавливаем шрифт
    this._context.font = `${this._fontSize}px ${this._fontFamily}`;
    //Расчитываем количество делений и растояние
    const [dashGap, dashCount] = this.calcDashes(
      this._width,
      this._minuteDashes,
      this._secondsDashes
    );
    this._dashGap = dashGap;
    this._dashCount = dashCount;
    //Высчитываем кол-во пикселей в 1с
    this._pxPerSecond = (this._dashGap * this._secondsDashes) / 60;
    console.log((this._dashGap * this._secondsDashes) / 60);
    //Текущая дата минус 1 секунда
    this._updateTimer = new Date(Date.now() - 1000);
    //Eventlistener на canvas при наведении на canvas
    this._context.canvas.onmousedown = (e: MouseEvent) => {
      this._moving = true;
      console.log("onMouseDown");
    };

    this._context.canvas.ontouchstart = (e: TouchEvent) => {
      console.log("ontouchstart");
    };

    this._context.canvas.ondrag = (e: MouseEvent) => {
      console.log("ondrag");
    };
  }

  /**
   * Посчитать кол-во делений и кол-во gap между делениями
   * @param width
   * @param minutesCount
   * @param secondsCount
   * @returns
   */
  private calcDashes(
    width: number,
    minutesCount: number,
    secondsCount: number
  ) {
    const totalDashes = (minutesCount - 1) * secondsCount + minutesCount;

    return [width / minutesCount / secondsCount, totalDashes];
  }
}
