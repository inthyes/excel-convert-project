const express = require("express");
const bodyParser = require("body-parser");
const controller = require("./controller/convert.controller");
const cors = require("cors");

async function launchServer() {
  const app = express();

  app.use(cors());

  app.use(bodyParser.json());
  app.get("/", (req, res) => {
    res.json({ message: "hello" });
  });

  app.get("/excelToJson", controller.excelToJson);
  app.get("/json-to-excel", controller.downloadExcel);
  app.get("/getSheetList", controller.getSheetList);

  const server = app.listen(8080, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`서버가 실행 중입니다. URL: http://${host}:${port}`);
  });
}

launchServer();
