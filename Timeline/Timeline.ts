
import { CanvasOptions, TimelineOptions } from "./types/TimelineType";


const DefaultCanvasOptions: CanvasOptions = {
	width: 640,
	height: 40,
	fontSize: 10,
	fontFamily: 'Roboto'
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
	
	constructor(canvas: HTMLCanvasElement, options: TimelineOptions) {
		
	}

	// setX(newX) {
	// 	this.x = newX;
	// }

	// setY(newY) {
	// 	this.y = newY;
	// }

	// getPosition() {
	// 	return [this.x, this.y];
	// }

	public render() {
		
	}

	public calcDashes (
		width: number,
		minutesCount: number,
		secondsCount: number
	  ) {
		const totalDashes = (minutesCount - 1) * secondsCount + minutesCount;
	  
		return [width / minutesCount / secondsCount, totalDashes];
	  };
}