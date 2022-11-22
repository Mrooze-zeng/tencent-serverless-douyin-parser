import db from "../db/index.mjs";

export default class BaseController {
  constructor() {
    this.db = db;
    this.read = this.read.bind(this);
    this.save = this.save.bind(this);
  }
  async read(name = "") {
    await this.db.read();
    this.db.data ||= {};
    if (this.db.data[name]) {
      return this.db.data[name];
    }
    throw new Error(`${name} can't be found.`);
  }
  async save(name = "", data = {}) {
    await this.db.read();
    this.db.data ||= {};
    let current = this.db.data[name] || [];
    current.push(data);
    this.db.data[name] = current;
    await this.db.write();
  }
  async checkExists(name = "", id = "") {
    await this.db.read();
    this.db.data ||= {};
    let current = this.db.data[name] || [];
    let c = current.find((c) => c.id === id);
  }
}
