// import RoundedRect from "./shapes/RoundedRect";

export type TooltipOptions = {
  x: number;
  y: number;
  text: string;
  visible: boolean;
};

const DefaultTooltipOptions: TooltipOptions = {
  x: -1,
  y: -1,
  text: "",
  visible: false,
};

export default class Tooltip {
  private _x: number;
  private _y: number;
  private _text: string;
  private _visible: boolean;
  private readonly _tooltipRadius: number;
  private readonly _tooltipPadding: number;

  constructor({ x, y, text, visible }: TooltipOptions = DefaultTooltipOptions) {
    this._x = x;
    this._y = y;
    this._text = text;
    this._visible = visible;
    this._tooltipRadius = 4;
    this._tooltipPadding = 4;
  }

  render(context: CanvasRenderingContext2D) {
    if (!this._visible) return;
    context.beginPath();
    const textHeight = ~~context.font.split(/\s/gm)[0].slice(0, 2);
    const textWidth = context.measureText(this._text).width;
    const x = this._x - textWidth / 2;
    const y = this._y;

    const textX = x + this._tooltipPadding;
    const textY = y + this._tooltipPadding + textHeight;
    context.fillStyle = "#333333";
    // new RoundedRect({
    //   x: x,
    //   y: y,
    //   width: textWidth,
    //   height: textHeight,
    //   radius: this._tooltipRadius,
    //   padding: this._tooltipPadding,
    // }).createShape(context);
    context.fill();
    context.closePath();
    context.beginPath();
    context.fillStyle = "#FFFFFF";
    context.fillText(this._text, textX, textY);
    context.closePath();
  }

  set y(value: number) {
    this._y = value;
  }
  get y(): number {
    return this._y;
  }

  set x(value: number) {
    this._x = value;
  }
  get x(): number {
    return this._x;
  }

  set text(value: string) {
    this._text = value;
  }
  get text(): string {
    return this._text;
  }

  set visible(value: boolean) {
    this._visible = value;
  }
  get visible(): boolean {
    return this._visible;
  }
}
