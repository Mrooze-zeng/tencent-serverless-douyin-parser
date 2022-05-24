import { DouyinController } from "../controllers/index.mjs";

export default class Routes {
  constructor() {}
  setupRoute(app) {
    const routeMap = this.routeMap();
    Object.keys(routeMap).forEach((path) => {
      routeMap[path].forEach((router) => {
        app[router.type.toLocaleLowerCase()](
          path,
          ...(router.middlewares || []),
          router.handler,
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
    };
  }
}
