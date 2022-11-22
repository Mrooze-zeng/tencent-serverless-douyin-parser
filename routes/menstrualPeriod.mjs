import { MenstrualPeriodController } from "../controllers/index.mjs";

export const menstrualPeriodRouter = () => {
  const menstrualPeriodController = new MenstrualPeriodController();
  return {
    "/set": [
      {
        type: "POST",
        handler: menstrualPeriodController.set,
        middlewares: [],
      },
    ],
    "/list": [
      {
        type: "GET",
        handler: menstrualPeriodController.list,
      },
    ],
    "/remove": [
      {
        type: "POST",
        handler: menstrualPeriodController.remove,
      },
    ],
  };
};
