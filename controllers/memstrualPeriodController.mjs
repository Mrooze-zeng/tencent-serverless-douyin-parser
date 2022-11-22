import BaseController from "./baseController.mjs";

export class MenstrualPeriodController extends BaseController {
  constructor(options = {}) {
    super(options);
    this.collection_name = "menstrual_period";
    this.set = this.set.bind(this);
    this.list = this.list.bind(this);
    this.remove = this.remove.bind(this);
  }
  isTheSameDate(d1, d2) {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  }
  async set(req, res) {
    let { date } = { ...req.query, ...req.body };
    date = new Date(date);
    if (isNaN(date)) {
      return res.send({
        type: "failure",
        message: date.toString(),
      });
    }
    await this.save(this.collection_name, date.toString());
    res.send({
      type: "success",
      message: date.toString(),
    });
  }
  async list(req, res) {
    let allDate = (await this.read(this.collection_name)) || [];
    res.send({
      type: "success",
      message: "success",
      data: allDate,
    });
  }
  async remove(req, res) {
    let { date } = { ...req.query, ...req.body };
    date = new Date(date);
    let allDate = (await this.read(this.collection_name)) || [];
    let newDateList = [];
    allDate.forEach((d) => {
      if (d !== date.toString()) {
        newDateList.push(d);
      }
    });
    await this.saveAll(this.collection_name, newDateList);
    res.send({
      type: "success",
      message: "success",
      data: newDateList,
    });
  }
}
