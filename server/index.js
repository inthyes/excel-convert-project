const express = require("express");
const bodyParser = require("body-parser");
const controller = require("./controller/convert.controller");

async function launchServer() {
  const app = express();

  app.use(bodyParser.json());
  app.get("/", (req, res) => {
    res.json({ message: "hello" });
  });
  // try {
  //   await sequelize.sync();
  //   console.log("Database is ready!");
  // } catch (error) {
  //   console.log("Unable to connect to the database");
  //   console.log(error);
  //   process.exit(1);

  // app.get("/global-stats", globalStatController.getAll);
  // app.post("/global-stats", globalStatController.insertOrUpdate);
  // app.delete("/global-stats", globalStatController.remove);

  // app.get("/key-value", keyValueController.get);
  // app.post("/key-value", keyValueController.insertOrUpdate);
  // app.delete("/key-value", keyValueController.remove);

  app.get("/excel-to-json", controller.downloadBistro);
  app.get("/json-to-excel", controller.downloadExcelController);

  const server = app.listen(8080, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`서버가 실행 중입니다. URL: http://${host}:${port}`);
  });
}

launchServer();
