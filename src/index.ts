import Timeline from './Timeline/Timeline';

const canvas: HTMLCanvasElement = document.getElementById(
  'canvas'
) as HTMLCanvasElement;

const timeline = new Timeline(canvas, {
  startTime: new Date(Date.now()),
  minuteDashes: 8,
  secondsDashes: 5
});
timeline.start();