const router = require("express").Router();
const SheetCtl = require("./SheetController");
const UploadCtl = require("./UploadController");

router.get("/getSheetList", SheetCtl.getSheetList);
router.get("/getJsonData/", SheetCtl.getJson);

router.post("/postSheetName", SheetCtl.postSheetName);
router.post("/setSession", SheetCtl.setSession);

router.get("/downloadExcel", UploadCtl.downloadExcel);

router.post("/postJson", UploadCtl.postJson);

module.exports = router;
