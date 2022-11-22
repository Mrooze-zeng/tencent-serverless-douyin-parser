import CalendarDate from "./date";

function Calendar(C = class {}) {
  return class Calendar extends C {
    constructor() {
      super(...arguments);
      this.date = [];
      this.getAllDate = this.getAllDate.bind(this);
      this.prev = this.prev.bind(this);
      this.next = this.next.bind(this);
      this.currentM = new Date().getMonth();
      this.currentDate = new Date().getDate();
      this.selectedDate = null;
    }
    getCurrentYear() {
      return this.currentDate.getFullYear();
    }
    getCurrentMonth() {
      const month = this.currentDate.getMonth() + 1;
      return month < 10 ? "0" + month : month;
    }
    getSelectedDate() {
      return this.selectedDate;
    }
    setSelectedDate(date) {
      this.selectedDate = date;
    }
    getAllDate(date = new Date()) {
      let calendarDate = [];
      const year = date.getFullYear();
      const month = date.getMonth();
      const offsetLeft = new Date(year, month, 1).getDay();
      const offsetRight = 7 - new Date(year, month + 1, 1).getDay();
      const total = new Date(year, month + 1, 0).getDate();

      for (let i = -offsetLeft + 1; i <= offsetRight + total; i++) {
        const date = new Date(year, month, i);
        calendarDate.push(
          new CalendarDate({
            date: date,
            text: date.getDate(),
            isValid: i > 0 && i <= total,
          }),
        );
      }
      this.currentYear = date.getFullYear();
      this.currentDate = date;
      this.date = calendarDate;
      this.selectedDate = date;
      return this.date;
    }
    updateDate(
      action = function (date, i) {
        return date;
      },
    ) {
      this.date = this.date.map(action);
      console.log(this.date);
      return this.date;
    }
    prev() {
      const year = new Date().getFullYear();
      this.currentM -= 1;
      return this.getAllDate(new Date(year, this.currentM, 1));
    }
    next() {
      const year = new Date().getFullYear();
      this.currentM += 1;
      return this.getAllDate(new Date(year, this.currentM, 1));
    }
  };
}

export default Calendar;
