import { fetchDate } from "./date-storage";

export default class CalendarDate {
  constructor({
    date = new Date(),
    text = "",
    topInfo = "",
    bottomInfo = "",
    isValid = false,
  } = {}) {
    this.date = date;
    this.text = text;
    this.topInfo = topInfo;
    this.bottomInfo = bottomInfo;
    this.isValid = isValid;
    this.isActive = false;
    this.isMarked = false;
    this.position = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    };

    if (this.isToday(this.date)) {
      this.text = "今";
    }
    const dateMap = fetchDate();

    if (dateMap[this.formatDate()]) {
      this.setMarked(true);
    }
  }
  formatDate() {
    const Y = this.date.getFullYear();
    const M = this.date.getMonth();
    const D = this.date.getDate();
    return `${Y}-${M}-${D}`;
  }
  setMarked(isMarked = false) {
    this.isMarked = isMarked;
  }
  getText() {
    return this.text;
  }
  setBottomInfo(text = "") {
    this.bottomInfo = text;
  }
  getBottomInfo() {
    return this.bottomInfo;
  }
  toggle() {
    this.isActive = !this.isActive;
  }
  setPosition(x = 0, y = 0, w = 0, h = 0) {
    this.position = { x: x, y: y, w: w, h: h };
  }
  getPosition() {
    return this.position;
  }
  isInRegion(x = 0, y = 0) {
    return (
      x > this.position.x &&
      x < this.position.x + this.position.w &&
      y > this.position.y &&
      y < this.position.y + this.position.h
    );
  }
  isToday() {
    return this.isTheSameDay(new Date());
  }
  isTheSameDay(other = new Date()) {
    return (
      other.getFullYear() === this.date.getFullYear() &&
      other.getMonth() === this.date.getMonth() &&
      other.getDate() === this.date.getDate()
    );
  }
  update(name = "", value = "") {
    this[name] = value;
  }
}
