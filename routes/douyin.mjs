import { DouyinController } from "../controllers/index.mjs";

export const douyinRouter = () => {
  const douyinController = new DouyinController();
  return {
    "/parser": [
      {
        type: "POST",
        handler: douyinController.parse,
        middlewares: [],
      },
    ],
    "/parser2": [
      {
        type: "POST",
        handler: douyinController.parse2,
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
};
