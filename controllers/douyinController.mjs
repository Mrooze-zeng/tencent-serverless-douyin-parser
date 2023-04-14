import fetch, { Headers } from "node-fetch";
import BaseController from "./baseController.mjs";

export default class DouyinController extends BaseController {
  constructor(options = {}) {
    super(options);
    this.collection_name = "video_logs";
    this.parse = this.parse.bind(this);
    this.parse2 = this.parse2.bind(this);
    this.download = this.download.bind(this);
    this.log = this.log.bind(this);
    this._commonFetch = this._commonFetch.bind(this);
    this._getUrlFromText = this._getUrlFromText.bind(this);
    this._getVideoId = this._getVideoId.bind(this);
    this.api1 =
      "https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=";
    this.api2 =
      "https://www.iesdouyin.com/aweme/v1/web/aweme/detail/?aweme_id=";
  }
  _getUrlFromText(text = "") {
    const regex = /https:\/\/v\.douyin\.com\/[a-z0-9]+/gi;
    const url = text?.match(regex) && text?.match(regex)[0];
    if (url) {
      return url;
    }
    throw new Error("Invalid URL");
  }
  async _commonFetch(url = "") {
    return await fetch(url, {
      headers: new Headers({
        "User-Agent":
          " Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4",
      }),
    });
  }
  async _getVideoId(originUrl = "") {
    const regex = /video\/(\d+)\??/;
    const response = await this._commonFetch(originUrl);
    const url = response?.url;
    const idMatch = url?.match(regex) || [];
    const videoId = idMatch[1];
    if (videoId) {
      return videoId;
    }
    throw new Error("Couldn't find video");
  }
  async _getVideoInfo(api = "", id = "") {
    const url = `${api}${id}`;
    const response = await this._commonFetch(url);
    const json = await response.json();
    return json || {};
  }
  async _getVideoInfo2(videoUrl = "") {
    const url = `https://api.douyin.wtf/douyin_video_data/?douyin_video_url=${videoUrl}`;
    const response = await this._commonFetch(url);
    const json = await response.json();
    return json || {};
  }
  async parse(req, res) {
    const { text } = { ...req.query, ...req.body };
    try {
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      const userAgent = req.headers["user-agent"];
      const id = req.headers["visitor-id"];
      const url = this._getUrlFromText(text);
      const videoInfo = await this._getVideoInfo2(url);
      // const videoId = await this._getVideoId(url);
      // const videoInfo = await this._getVideoInfo(this.api2, videoId);
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
  async parse2(req, res) {
    const { text } = { ...req.query, ...req.body };
    try {
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      const userAgent = req.headers["user-agent"];
      const id = req.headers["visitor-id"];
      const url = this._getUrlFromText(text);
      const videoInfo = await this._getVideoInfo2(url);
      console.log(videoInfo);
      // const videoId = await this._getVideoId(url);
      // const videoInfo = await this._getVideoInfo(this.api1, videoId);
      const aweme_detail = videoInfo?.aweme_list[0] || {};
      const images = aweme_detail?.images;
      const videos = aweme_detail?.video?.play_addr?.url_list;
      const parserImage =
        images &&
        images.map((i) => {
          return i.url_list[0];
        });
      const video =
        videos &&
        videos.map((v) => {
          console.log(v);
          return v.replace("playwm", "play");
        });
      await this.save(this.collection_name, {
        id,
        ip,
        user_agent: userAgent,
        url,
        datetime: new Date().toUTCString(),
      });
      res.send({
        type: "success",
        message: {
          media: parserImage || video,
        },
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
      const response = await this._commonFetch(url);
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
