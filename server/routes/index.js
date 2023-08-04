const router = require("express").Router();

const SheetCtl = require("./googleSheetController");
const FileCtl = require("./fileController");
const ExcelCtl = require("./excelController");

router.get("/getSheetList", SheetCtl.getSheetList);
router.get("/getJsonData/", SheetCtl.getJson);

router.post("/postSheetName", SheetCtl.postSheetName);
router.post("/setSession", SheetCtl.setSession);

router.get("/downloadExcel", FileCtl.downloadExcel);
router.post("/postJson", FileCtl.postJson);
router.get("/downloaded/json_to_excel.xlsx", FileCtl.getFile);

router.post("/excelToJson", ExcelCtl.excelToJson);

module.exports = router;
