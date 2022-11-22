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
    return this.db.data[name];
  }
  async save(name = "", data = {}) {
    await this.db.read();
    this.db.data ||= {};
    let current = this.db.data[name] || [];
    current.push(data);
    console.log(Array.from(new Set(current)));
    this.db.data[name] = Array.from(new Set(current));
    await this.db.write();
  }
  async saveAll(name = "", data = []) {
    await this.db.read();
    this.db.data ||= {};
    this.db.data[name] = Array.from(new Set(data));
    await this.db.write();
  }
}
