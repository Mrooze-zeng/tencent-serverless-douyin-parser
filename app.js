const express = require("express");
const path = require("path");
// const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();

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

app.get("/user", (req, res) => {
  res.send([
    {
      title: "serverless framework",
      link: "https://serverless.com",
    },
  ]);
});

app.get("/user/:id", (req, res) => {
  const id = req.params.id;
  res.send({
    id: id,
    title: "serverless framework",
    link: "https://serverless.com",
  });
});

app.get("/404", (req, res) => {
  res.status(404).send("Not found");
});

app.get("/500", (req, res) => {
  res.status(500).send("Server Error");
});

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
