import Timeline from "./Timeline/Timeline";
import { getMinuteDashesCount } from "./helpers";
import { TimelineMouseMoveEvent } from "./Timeline/types/TimelineType";

const canvas: HTMLCanvasElement = document.getElementById(
  "canvas"
) as HTMLCanvasElement;

const playButton: HTMLButtonElement = document.getElementById(
  "play"
) as HTMLButtonElement;
const pauseButton: HTMLButtonElement = document.getElementById(
  "pause"
) as HTMLButtonElement;
const time: HTMLParagraphElement = document.getElementById(
  "currentTime"
) as HTMLParagraphElement;

/**
 * Установка начальных значений
 */
const timeline = new Timeline(canvas, {
  startTime: new Date(Date.now()),
  minuteDashes: 8,
  secondsDashes: 5,
  canvasOptions: {
    width: 640,
    height: 40,
    fontSize: 10,
    fontFamily: "Roboto",
  },
});
timeline.start();

//Когда зажимаем таймлайн и начинаем его перемещать то добавляем к offset разницу(дельту)
timeline.on("mousePressedMoving", (e: TimelineMouseMoveEvent) => {
  console.log(e.deltaX, "e.deltaX", "mousePressedMoving");
  timeline.addOffset(-e.deltaX);
});
timeline.on("tick", () => {
  time.innerHTML = timeline.time.toTimeString();
});

//При ресайзе пересчитать кол-во делений на таймлайне
window.onresize = () => {
  const { innerWidth: width } = window;
  timeline.canvasWidth = width;
  timeline.minuteDashes = getMinuteDashesCount(width);
};

playButton.onclick = () => {
  timeline.play();
};
pauseButton.onclick = () => {
  timeline.pause();
};
