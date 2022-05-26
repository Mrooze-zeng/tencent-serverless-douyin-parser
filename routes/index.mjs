import path from "path";
import { DouyinController } from "../controllers/index.mjs";

export default class Routes {
  constructor({ prefix = "/api" } = {}) {
    this.prefix = prefix;
  }
  setupRoute(app) {
    const routeMap = this.routeMap();
    Object.keys(routeMap).forEach((router) => {
      routeMap[router].forEach((method) => {
        app[method.type.toLocaleLowerCase()](
          path.join("/", this.prefix, router),
          ...(method.middlewares || []),
          method.handler,
        );
      });
    });
  }
  routeMap() {
    const douyinController = new DouyinController();
    return {
      "/parser": [
        {
          type: "POST",
          handler: douyinController.parse,
          middlewares: [],
        },
      ],
      "/download": [{ type: "POST", handler: douyinController.download }],
      "/log": [
        {
          type: "GET",
          handler: douyinController.log,
        },
      ],
    };
  }
}
