const SheetApiClientFactory = require("../sheet_api_client_factory");
const SheetDownloader = require("../sheet_downloader");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
// const { json } = require("express");
const spreadsheetId = "10SSTLhZzmHEABvoe4Isy6L258tk4T7GN8YdylUawLB4";
const fileDirectory = "./downloaded";
const serverAddress = "http://localhost:8000";
let sharedItem;

//* product-list페이지 시작과 동시에 get되는 함수
async function getSheetList(req, res) {
  try {
    const sheetApiClient = await SheetApiClientFactory.create();
    const sheets = await sheetApiClient.spreadsheets.get({
      spreadsheetId,
      fields: "sheets.properties.title",
    });

    const sheetList = sheets.data.sheets.map((sheet) => sheet.properties.title);
    console.log("get sheetList", sheetList);
    res.json(sheetList);
  } catch (error) {
    console.error("Error retrieving sheet list:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function postSheetName(req, res) {
  const { item } = req.body;
  console.log("Received item:", item);

  req.session.sharedItem = item; // 서버 측에서 세션을 설정
  const processedItem = returnItemValue(item);
  sharedItem = item;
  res.send({ item: processedItem });
}

function returnItemValue(item) {
  console.log("Using 'item' in returnItemValue:", item);
  return item;
}

// postSheetName의 item값을 returnItemValue함수를 통해 할당 받는다.
async function getJson(req, res) {
  try {
    console.log("Received item in getJson:", sharedItem);
    const range = "A1:Z100";
    const sheetApiClient = await SheetApiClientFactory.create();
    const downloader = new SheetDownloader(sheetApiClient);
    const fileInfo = await downloader.downloadToJson(
      spreadsheetId,
      sharedItem,
      "downloaded/product_list.json"
    );
    const headerRow = downloader.getHeaderRow();

    res.json({ fileInfo: fileInfo, sharedItem: sharedItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

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
function postJson(req, res) {
  const filePath = path.join(__dirname, "../downloaded/product_list.json");
  const jsonData = req.body;
  // console.log("jsondata", jsonData);
  console.log("내가먼저");

  fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

  downloadExcel(filePath, res); // res 객체를 downloadExcel 함수에 전달
  console.log("server filePath:", filePath);
}

//* json을 excel로 변환 후 저장하는 함수
function downloadExcel(filePath, res) {
  console.log("얘가 두번째");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const parsedData = JSON.parse(jsonData);
  const worksheet = XLSX.utils.json_to_sheet(parsedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "my_sheet");

  const excelFileName = `json_to_excel.xlsx`;
  const excelFilePath = path.join(fileDirectory, excelFileName);
  console.log("fileDirectory", fileDirectory);
  XLSX.writeFile(workbook, excelFilePath);

  console.log("변환 완료");

  res.set("Content-Disposition", `attachment; filename="excel_file.xlsx"`);
  res.set(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  // res.download(excelFilePath); // 파일 다운로드 응답 생성

  console.log("zzzzzzzzz", workbook);
  console.log("aaaaaaaaaaaaaa", excelFilePath);
  console.log("qqqqqqqqqqqqq", fileDirectory);
  res.json({
    downloadUrl: `${serverAddress}/downloaded/${excelFileName}`,
  });
}

module.exports = {
  getJson,
  postJson,
  downloadExcel,
  getSheetList, // 추가: 시트 목록을 가져오는 함수
  jsonToExcel,
  postSheetName,
};
