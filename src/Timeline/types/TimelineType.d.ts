export type CanvasOptions = {
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
};

export type TimelineOptions = {
  startTime?: Date;
  minuteDashes: number;
  secondsDashes: number;
  canvasOptions?: CanvasOptions;
};
