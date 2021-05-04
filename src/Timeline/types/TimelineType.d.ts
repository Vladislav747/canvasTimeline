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

export type TimelineMouseEvent = {
  x: number;
  y: number;
};

export type TimelineMouseMoveEvent = TimelineMouseEvent & {
  deltaX: number;
  deltaY: number;
};

interface TimelineEvents {
  mouseMovingStarted: (args: TimelineMouseEvent) => void;
  mouseMovingStopped: (args: TimelineMouseEvent) => void;
  mousePressedMoving: (args: TimelineMouseMoveEvent) => void;
  mouseMoving: (args: TimelineMouseEvent) => void;
  started: () => void;
  paused: () => void;
  played: () => void;
  tick: () => void;
}

declare interface Timeline {
  on<U extends keyof TimelineEvents>(
    event: U,
    listener: TimelineEvents[U]
  ): this;
  emit<U extends keyof TimelineEvents>(
    event: U,
    ...args: Parameters<TimelineEvents[U]>
  ): boolean;
}
