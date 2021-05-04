import Cell from "../Cell/Cell";
import Tooltip from "../Tooltip/Tooltip";
import { CanvasOptions, TimelineOptions } from "./types/TimelineType";
import { EventEmitter } from "events";
import { debounce } from "../helpers";

const DefaultCanvasOptions: CanvasOptions = {
  width: 640,
  height: 40,
  fontSize: 10,
  fontFamily: "Roboto",
};

/**
 * Класс Timeline
 */
export default class Timeline extends EventEmitter {
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

  private _updateTimer: number;

  private _paused: boolean;
  private _moving: boolean;
  //Это скорость в миллисекндуах таймлайна чем меньше тем быстрее и наоборот
  private _velocityInMs = 1000;

  private _mouseX: number;
  private _mouseY: number;

  private _timeTooltip: Tooltip;

  constructor(canvas: HTMLCanvasElement, options: TimelineOptions) {
    super();
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
    //Координаты мыши
    this._mouseX = 0;
    this._mouseY = 0;
    //Новая tooltip подсказка
    this._timeTooltip = new Tooltip();

    this.init();
  }

  /**
   * Начальная функция запуска анимации
   */
  public start(): void {
    this.tick(0);
    this.emit("started");
  }

  //По сути каждую секунду
  private tick(now: number): void {
    this.update(now);
    this.render();

    requestAnimationFrame((now) => {
      this.tick(now);
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
  public update(now: number): void {
    // if (!this._paused) {
    //   const delta = Date.now() - this._updateTimer.getTime();
    //   if (delta > this._velocityInMs) {
    //     this._updateTimer = new Date();
    //     this._offset += this._pxPerSecond;
    //   }
    // }

    const updateTooltip = () => {
      const timestampMs =
        this._startTime.getTime() +
        (this._offset / this._pxPerSecond) * 1000 +
        (this._mouseX / this._pxPerSecond) * 1000;

      const time = new Date(timestampMs);

      const hours =
        time.getHours() < 10
          ? `0${time.getHours()}`
          : time.getHours().toString();
      const minutes =
        time.getMinutes() < 10
          ? `0${time.getMinutes()}`
          : time.getMinutes().toString();
      const seconds =
        time.getSeconds() < 10
          ? `0${time.getSeconds()}`
          : time.getSeconds().toString();

      this._timeTooltip.text = `${hours}:${minutes}:${seconds}`;
    };

    const translateTimeline = () => {
      const canMove = !this._paused && !this._moving;

      if (canMove) {
        this.emit("tick");
        const delta = now - this._updateTimer;
        if (delta > 1000) {
          this._updateTimer = now - (delta - 1000);
          this._offset += this._pxPerSecond;
        }
      }
    };

    updateTooltip();
    translateTimeline();
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

    this._updateTimer = performance.now();
    this.calcDimensions();
    this.registerCanvasEvents();

    //Eventlistener на canvas при наведении на canvas
    this._context.canvas.onmousedown = (e: MouseEvent) => {
      this._moving = true;
      console.log("onMouseDown");
    };
  }

  /**
   * Посчитать кол-во делений и кол-во gap между делениями
   * Занести значения _dashGap, _dashCount и _pxPerSecond
   */
  private calcDimensions(): void {
    const [dashGap, dashCount] = this.calcDashes(
      this._width,
      this._minuteDashes,
      this._secondsDashes
    );
    console.log(dashGap, "calcDimensions dashGap");
    this._dashGap = dashGap;
    console.log(dashCount, "calcDimensions dashCount");
    this._dashCount = dashCount;
    //Высчитываем кол-во пикселей в секундах
    //в нашем случае (this._dashGap * this._secondsDashes) - это расстояение между большими делениями

    this._pxPerSecond = (this._dashGap * this._secondsDashes) / 60;
    console.log(this._pxPerSecond, "calcDimensions _pxPerSecond");
    console.log(this._secondsDashes, "calcDimensions _secondsDashes");
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
    console.log(width, minutesCount, secondsCount, "calcDashes");
    const totalDashes = (minutesCount - 1) * secondsCount + minutesCount;
    console.log(totalDashes, "totalDashes calcDashes");
    return [width / minutesCount / secondsCount, totalDashes];
  }

  /**
   * Регистрация событий
   *
   */
  private registerCanvasEvents(): void {
    this._canvas.onmouseenter = (e: MouseEvent) => {
      this._timeTooltip.visible = true;

      this._mouseX = e.offsetX;
      this._mouseY = e.offsetY;
    };

    this._canvas.onmousedown = (e: MouseEvent) => {
      this._moving = true;
      this._mouseX = e.offsetX;
      this._mouseY = e.offsetY;

      this.emit("mouseMovingStarted", {
        x: this._mouseX,
        y: this._mouseY,
      });
    };

    this._canvas.onmousemove = (e: MouseEvent) => {
      const dx = e.offsetX - this._mouseX;
      const dy = e.offsetY - this._mouseY;
      this._mouseX = e.offsetX;
      this._mouseY = e.offsetY;

      this._timeTooltip.x = this._mouseX;

      if (this._moving) {
        this._moving = true;
        console.log(
          this._mouseX,
          this._mouseY,
          this._canvas.width,
          this._canvas.height
        );

        if (this._mouseX > this._canvas.width - 10) {
          this._moving = false;
          this._mouseX = e.offsetX;
          this._mouseY = e.offsetY;

          this.emit("mouseMovingStopped", {
            x: this._mouseX,
            y: this._mouseY,
          });
        } else {
          console.log(e.offsetX, e.offsetY, this._mouseX, this._mouseY, dx, dy);
          console.log("emit mousePressedMoving");

          this.emit("mousePressedMoving", {
            x: this._mouseX,
            y: this._mouseY,
            deltaX: dx,
            deltaY: dy,
          });
        }
      } else {
        console.log(
          this._moving,
          this._mouseX,
          this._mouseY,
          "this._canvas.onmousemove"
        );
        //console.log("emit mouseMoving");

        debounce(() => {
          this.emit("mouseMoving", {
            x: this._mouseX,
            y: this._mouseY,
          });
        }, 2000);
      }
    };

    this._canvas.onmouseup = (e: MouseEvent) => {
      this._moving = false;
      this._mouseX = e.offsetX;
      this._mouseY = e.offsetY;

      this.emit("mouseMovingStopped", {
        x: this._mouseX,
        y: this._mouseY,
      });
    };

    this._canvas.onmouseleave = (e: MouseEvent) => {
      this._timeTooltip.visible = false;
    };
  }

  /**
   * Обновить offset
   * @param pixels
   */
  public addOffset(pixels: number): void {
    console.log(this._offset, "berfore addOffset");
    console.log(pixels, "pixels addOffset");
    this._offset += pixels;
  }

  /**
   * Получить время _startTime
   */
  get time(): Date {
    const timestampMs =
      this._startTime.getTime() + (this._offset / this._pxPerSecond) * 1000;
    return new Date(timestampMs);
  }

  /**
   * Установить _minutesDashes
   */
  set minuteDashes(value: number) {
    this._minuteDashes = value;
    this.calcDimensions();
  }

  /**
   * Установить _width и _canvas.width
   */
  set canvasWidth(value: number) {
    this._width = value;
    this.calcDimensions();
    this._canvas.width = this._width;
  }
}
