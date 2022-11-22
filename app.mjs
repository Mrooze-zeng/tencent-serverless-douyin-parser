import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import Router, {
  douyinRouter,
  menstrualPeriodRouter,
} from "./routes/index.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

// Routes
if (process.env.NODE_ENV === "prod") {
  app.use("/", express.static(path.join(__dirname, "statics")));
  app.use("/huihui", express.static(path.join(__dirname, "huihui-statics")));
} else {
  app.use((req, res, next) => {
    if (req.url === "/" || path.extname(req.url)) {
      app.use("/", createProxyMiddleware({ target: "http://127.0.0.1:3006" }));
    } else if (req.url === "/huihui" || path.extname(req.url)) {
      app.use("/", createProxyMiddleware({ target: "http://127.0.0.1:3007" }));
    }
    next();
  });
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api", new Router("/douyin", douyinRouter));
app.use("/api/", new Router("/menstrual_period", menstrualPeriodRouter));

app.get("/verison", (req, res) => {
  res.send({
    version: process.version,
  });
});

// Error handler
app.use(function (err, req, res, next) {
  res.status(500).send("Internal Serverless Error");
});

app.listen(process.env.PORT || 9000, () => {
  console.log(`Server start on ${process.env.PORT || 9000}`);
});
