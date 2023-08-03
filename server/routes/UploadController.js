const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const fileDirectory = "./";
const serverAddress = "http://localhost:8000";
// const dotenv = require("dotenv");
// dotenv.config({ path: "../" });

// const accessKeyId = "AKIAQODXHTFXJPI6VXNU";
// const secretAccessKey = "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";

// const credentials = {
//   accessKeyId: accessKeyId,
//   secretAccessKey: secretAccessKey,
// };
// console.log(process.env.AccessKeyId);
// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
// const s3Client = new S3Client({ region: "ap-northeast-2", credentials });
// const { uploadFile } = require("./create-bucket");

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
  const filePath = path.join(__dirname, "../downloaded/product_list.json");
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

  const excelFileName = `json_to_excel.xlsx`;
  const excelFilePath = path.join(fileDirectory, excelFileName);
  // console.log("fileDirectory", fileDirectory);

  const file = XLSX.writeFile(workbook, excelFilePath);
  console.log("aaaaaaaaa", file);
  console.log("변환 완료");

  res.set("Content-Disposition", `attachment; filename="excel_file.xlsx"`);
  res.set(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.json({
    downloadUrl: `${serverAddress}/downloaded/${excelFileName}`,
  });
  // console.log(s3Url_1);
}

module.exports = {
  postJson,
  downloadExcel,
  jsonToExcel,
  // uploadFile, // 추가: 파일 업로드 함수
};
