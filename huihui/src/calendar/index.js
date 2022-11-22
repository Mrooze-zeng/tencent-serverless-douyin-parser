import { Component, createRef } from "react";
import Calendar from "./calendar";
import { saveDate } from "./date-storage";
import "./index.scss";

export default class CalendarComponent extends Calendar(Component) {
  constructor({ size = 400 } = {}) {
    super(...arguments);

    this.width = size;
    this.height = size;

    this.canvas = createRef();
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);

    this.ctx = null;

    this.state = {
      isAdd: true,
    };
  }
  componentDidMount() {
    this.setCanvas();
    this.renderCurrentMonth(this.getAllDate());
  }
  setCanvas() {
    this.canvas.current.style.width = this.width + "px";
    this.canvas.current.style.height = this.height + "px";
    this.canvas.current.width = this.width * window.devicePixelRatio;
    this.canvas.current.height = this.height * window.devicePixelRatio;
    this.ctx = this.canvas.current.getContext("2d");
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  renderTop() {
    const fontSize = 28;
    let space = Math.floor(this.width / 7 - 7);

    const year = this.getCurrentYear();
    const month = this.getCurrentMonth();
    const text = `${year} / ${month}`;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = "#111";
    const mT = this.ctx.measureText(text);
    const x = (this.width - mT.width) / 2 + mT.width / 2;
    this.ctx.fillText(text, x, (space * 2) / 3);
  }
  renderWeek() {
    const fontSize = 20;
    this.ctx.fillStyle = "#111";
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.textAlign = "center";
    let weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    let space = Math.floor(this.width / 7 - 7);

    for (let i = 0; i < weeks.length; i++) {
      this.ctx.fillText(weeks[i], space * ((i % 7) + 1), (space * 3) / 2);
    }
  }
  renderDate(date = [], px = 0, py = 0) {
    const fontSize = 24;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.textAlign = "center";
    let line = 0;
    let space = Math.floor(this.width / 7 - 7);
    for (let i = 0; i < date.length; i++) {
      if (i % 7 === 0) {
        line += 1;
      }
      let x = space * ((i % 7) + 1) - space / 2,
        y = space * line + space - fontSize / 2,
        w = space,
        h = space;
      //save position
      date[i].setPosition(x, y, w, h);

      if (
        (date[i].isInRegion(px, py) && date[i].isValid) ||
        date[i].isTheSameDay(this.getSelectedDate())
      ) {
        this.setSelectedDate(date[i].date);
        this.setState({
          isAdd: !date[i].isMarked,
        });
      }

      //draw box
      if (date[i].isInRegion(px, py) && date[i].isValid) {
        this.drawSelectedBox(x, y, w, h);
      }

      if (date[i].isToday()) {
        this.drawToday(x, y, w, h);
      }
      //inValid date
      if (date[i].isValid) {
        this.ctx.fillStyle = "#111";
      } else {
        this.ctx.fillStyle = "#bbb";
      }
      //draw text
      this.drawText(date[i], space, line, i);
      date[i].isMarked && this.drawBottomInfo(x, y + h - 10, w, 10);
    }
  }
  drawSelectedBox(x, y, w, h) {
    this.ctx.shadowBlur = 20;
    this.ctx.shadowColor = "black";
    this.ctx.fillStyle = "white";
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, w, h, [10]);
    this.ctx.fill();
    this.ctx.shadowBlur = 0;
  }
  drawToday(x, y, w, h) {
    this.ctx.fillStyle = "red";
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, w, h, [10]);
    this.ctx.fill();
  }
  drawText(date, space, line, i) {
    const fontSize = 24;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      date.getText(),
      space * ((i % 7) + 1),
      space * line + (space * 3) / 2,
    );
  }
  drawBottomInfo(x, y, w, h) {
    this.ctx.fillStyle = "pink";
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, w, h, [10]);
    this.ctx.fill();
  }
  renderCurrentMonth(date = [], x = 0, y = 0) {
    this.resetView();
    this.renderWeek();
    this.renderTop();
    this.renderDate(date, x, y);
  }
  resetView() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  handlePrev() {
    this.renderCurrentMonth(this.prev());
  }
  handleNext() {
    this.renderCurrentMonth(this.next());
  }
  handleClick(e) {
    const bounding = e.target.getBoundingClientRect();
    let x = e.clientX - bounding.left;
    let y = e.clientY - bounding.top;
    this.renderCurrentMonth(this.date, x, y);
  }
  handleMarkDate() {
    const { isAdd } = this.state;
    this.renderCurrentMonth(
      this.updateDate((date) => {
        if (date.isTheSameDay(this.getSelectedDate())) {
          date.setMarked(isAdd);
          saveDate(date.formatDate(), isAdd);
        }
        return date;
      }),
    );
  }
  render() {
    const { isAdd } = this.state;
    return (
      <div className="calendar">
        <canvas
          ref={this.canvas}
          onClick={this.handleClick.bind(this)}
        ></canvas>
        <div className="navigate-button-group">
          <button
            className="navigate-button"
            onClick={this.handleMarkDate.bind(this)}
          >
            {isAdd ? "+" : "-"}
          </button>

          <button className="navigate-button" onClick={this.handlePrev}>
            上一个月
          </button>
          <button className="navigate-button" onClick={this.handleNext}>
            下一个月
          </button>
        </div>
      </div>
    );
  }
}
