const multiparty = require("multiparty");
const http = require("http");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

function getExcel(req, res) {}

function excelToJson(req, res, next) {
  const resData = {};

  const form = new multiparty.Form({
    autoFiles: true,
  });

  form.on("file", (name, file) => {
    const workbook = xlsx.readFile(file.path);

    const sheetnames = Object.keys(workbook.Sheets);

    let i = sheetnames.length;

    while (i--) {
      const sheetname = sheetnames[i];

      resData[sheetname] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetname]);
    }
  });

  form.on("close", () => {
    // JSON 데이터를 파일로 저장합니다.
    const fileName = `json_data_${Date.now()}.json`;
    const filePath = path.join(__dirname, "..", "downloaded", fileName);
    fs.writeFile(filePath, JSON.stringify(resData, null, 2), (err) => {
      if (err) {
        console.error("Error saving JSON to file:", err);
        res.status(500).send("Failed to save JSON data to file.");
      } else {
        // 파일 저장이 완료되면 파일명을 응답으로 보냅니다.
        console.log("확인", resData);
        res.send({ resData });
      }
    });
    // res.send(resData);
  });

  form.parse(req);
}

module.exports = {
  excelToJson,
};
