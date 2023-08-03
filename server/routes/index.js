const router = require("express").Router();
const SheetCtl = require("./SheetController");
const UploadCtl = require("./UploadController");
const path = require("path");

router.get("/getSheetList", SheetCtl.getSheetList);
router.get("/getJsonData/", SheetCtl.getJson);

router.post("/postSheetName", SheetCtl.postSheetName);
router.post("/setSession", SheetCtl.setSession);

router.get("/downloadExcel", UploadCtl.downloadExcel);

router.post("/postJson", UploadCtl.postJson);

router.get("/downloaded/json_to_excel.xlsx", (req, res) => {
  const filePath = path.join(__dirname, "../downloaded/json_to_excel.xlsx");
  res.sendFile(filePath);
});

module.exports = router;
