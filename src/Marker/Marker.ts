import { EventEmitter } from "events";

import { MarkerOptions } from "./types/MarkerType";

const DefaultMarkerOptions: MarkerOptions = {
  x: -Infinity,
  y: -Infinity,
  size: 5,
  color: "#2C6BBE",
  timestamp: new Date(Date.now()),
};

export default class Marker extends EventEmitter {
  private readonly _x: number;
  private readonly _y: number;
  private readonly _size: number;
  private readonly _timestamp: Date;
  private readonly _color: string;

  constructor(options: MarkerOptions = DefaultMarkerOptions) {
    super();

    this._x = options.x;
    this._y = options.y;
    this._size = options.size;
    this._color = options.color;

    this._timestamp = options.timestamp;
  }

  public render(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.fillStyle = this._color;
    context.arc(this._x, this._y, this._size, 0, Math.PI);
    context.fill();
    context.closePath();
  }
}
