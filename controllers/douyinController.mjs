import fs from "fs";
import fetch from "node-fetch";

export default class DouyinController {
  constructor() {
    this.parse = this.parse.bind(this);
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
      const url = this._getUrlFromText(text);
      const videoId = await this._getVideoId(url);
      const videoInfo = await this._getVideoInfo(videoId);
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
}
