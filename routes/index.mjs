import express from "express";
import path from "path";

export { douyinRouter } from "./douyin.mjs";
export { logRouter } from "./log.mjs";
export default class Router {
  constructor(
    prefix = "/",
    routerMap = function () {
      return {};
    },
  ) {
    return this._setupRoute(prefix, routerMap(), express.Router());
  }
  _setupRoute(prefix = "/", routerMap, app) {
    Object.keys(routerMap).forEach((router) => {
      routerMap[router].forEach((method) => {
        app[method.type.toLocaleLowerCase()](
          path.join("/", prefix, router),
          ...(method.middlewares || []),
          method.handler,
        );
      });
    });
    return app;
  }
}
