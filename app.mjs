import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import Routes from "./routes/index.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const routes = new Routes(app);

// Routes
if (process.env.NODE_ENV === "prod") {
  app.use("/", express.static(path.join(__dirname, "statics")));
} else {
  app.use((req, res, next) => {
    if (req.url === "/" || path.extname(req.url)) {
      app.use("/", createProxyMiddleware({ target: "http://127.0.0.1:3006" }));
    }
    next();
  });
}

routes.setupRoute(app);

app.get("/verison", (req, res) => {
  res.send({
    version: process.version,
    path: process.env.PATH,
  });
});

// Error handler
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).send("Internal Serverless Error");
});

app.listen(process.env.PORT || 9000, () => {
  console.log(`Server start on ${process.env.PORT || 9000}`);
});
