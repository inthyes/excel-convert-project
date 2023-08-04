const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
let ExcelName;
const fileDirectory = path.join(__dirname, "../downloaded/");
console.log("fileDirectory", fileDirectory);
const serverAddress = "http://localhost:8080";
const JsonAddress = "../downloaded/product_list.json";
//* json을 excel로 변환하는 함수(downloadExcel을 통해 작동) - 사용 안 함
function jsonToExcel(filePath) {
  const jsonData = fs.readFileSync(filePath, "utf-8");

  const parsedData = JSON.parse(jsonData);

  const worksheet = XLSX.utils.json_to_sheet(parsedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "my_sheet");
  XLSX.writeFile(workbook, "json_to_excel.xlsx");
}

//* json server에 저장.
async function postJson(req, res) {
  const filePath = path.join(__dirname, JsonAddress);
  const jsonData = req.body;
  console.log("내가먼저");

  fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

  await downloadExcel(filePath, res); // res 객체를 downloadExcel 함수에 전달
  console.log("server filePath:", filePath);
}

//* json을 excel로 변환 후 저장하는 함수
async function downloadExcel(filePath, res) {
  console.log("얘가 두번째");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const parsedData = JSON.parse(jsonData);
  const worksheet = XLSX.utils.json_to_sheet(parsedData);
  const workbook = XLSX.utils.book_new();
  console.log(workbook);
  XLSX.utils.book_append_sheet(workbook, worksheet, "my_sheet");

  ExcelName = `json_to_excel.xlsx`;
  const excelFilePath = path.join(fileDirectory, ExcelName);
  console.log("fileDirectory", excelFilePath);

  const file = XLSX.writeFile(workbook, excelFilePath);
  console.log("aaaaaaaaa", file);
  console.log("변환 완료");

  res.set("Content-Disposition", `attachment; filename="excel_file.xlsx"`);
  res.set(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.json({
    downloadUrl: `${serverAddress}/downloaded/${ExcelName}`,
  });
  // console.log(s3Url_1);
}

function getFile(req, res) {
  const filePath = path.join(__dirname, "../downloaded/json_to_excel.xlsx");
  res.sendFile(filePath);
}

module.exports = {
  postJson,
  downloadExcel,
  jsonToExcel,
  getFile,
};
