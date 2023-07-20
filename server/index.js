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

  // sheetList출력 및 선택
  app.get("/getSheetList", controller.getSheetList);

  // sheetList name을 불러온다.
  app.post("/postSheetName", controller.postSheetName);

  // product-list/{item}에 json을 표로 출력
  app.get("/getJson/", controller.getJson);

  // product-list/{item} excel로 저장
  app.get("/downloadExcel", controller.downloadExcel);

  app.post("/postJson", controller.postJson);

  const server = app.listen(8080, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`서버가 실행 중입니다. URL: http://${host}:${port}`);
  });
}

launchServer();
