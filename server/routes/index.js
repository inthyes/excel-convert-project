const router = require("express").Router();
const controller = require("./controller");

// sheetList출력 및 선택
router.get("/getSheetList", controller.getSheetList);

// sheetList name을 불러온다.
router.post("/postSheetName", controller.postSheetName);

// product-list/{item}에 json을 표로 출력
router.get("/getJsonData/", controller.getJson);
// app.post("/getJsonData/", controller.getJson);

// product-list/{item} excel로 저장
router.get("/downloadExcel", controller.downloadExcel);

router.post("/postJson", controller.postJson);

router.post("/setSession", controller.setSession);

module.exports = router;
