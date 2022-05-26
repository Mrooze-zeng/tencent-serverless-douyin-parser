import fetch from "node-fetch";
import BaseController from "./baseController.mjs";

export default class DouyinController extends BaseController {
  constructor(options = {}) {
    super(options);
    this.collection_name = "video_logs";
    this.parse = this.parse.bind(this);
    this.download = this.download.bind(this);
    this.log = this.log.bind(this);
  }
  _getUrlFromText(text = "") {
    const regex = /https:\/\/v\.douyin\.com\/[a-z0-9]+\//gi;
    const url = text?.match(regex) && text?.match(regex)[0];
    if (url) {
      return url;
    }
    throw new Error("Invalid URL");
  }
  async _getVideoId(originUrl = "") {
    const regex = /video\/(\d+)\??/;
    const response = await fetch(originUrl);
    const url = response?.url;
    const idMatch = url?.match(regex) || [];
    const videoId = idMatch[1];
    if (videoId) {
      return videoId;
    }
    throw new Error("Couldn't find video");
  }
  async _getVideoInfo(id = "") {
    const url = `https://www.iesdouyin.com/aweme/v1/web/aweme/detail/?aweme_id=${id}`;
    const response = await fetch(url);
    console.log(url);
    const json = await response.json();

    return json;
  }
  async parse(req, res) {
    const { text } = { ...req.query, ...req.body };
    try {
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      const userAgent = req.headers["user-agent"];
      const id = req.headers["visitor-id"];
      const url = this._getUrlFromText(text);
      const videoId = await this._getVideoId(url);
      const videoInfo = await this._getVideoInfo(videoId);
      await this.save(this.collection_name, {
        id,
        ip,
        user_agent: userAgent,
        url,
        datetime: new Date().toUTCString(),
      });
      res.send({
        type: "success",
        message: videoInfo,
      });
    } catch (e) {
      res.send({
        type: "failure",
        message: e.message,
      });
    }
  }
  async download(req, res) {
    const { url } = { ...req.query, ...req.body };
    try {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      res.set("Content-Type", "application/octet-stream");
      res.end(Buffer.from(buffer));
    } catch (e) {
      res.send({
        type: "failure",
        message: e.message,
      });
    }
  }
  async log(req, res) {
    try {
      const data = await this.read(this.collection_name);
      res.send({
        type: "success",
        message: data,
      });
    } catch (e) {
      res.send({
        type: "failure",
        message: e.message,
      });
    }
  }
}
