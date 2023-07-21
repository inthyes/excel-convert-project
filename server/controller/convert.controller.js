const SheetApiClientFactory = require("../sheet_api_client_factory");
const SheetDownloader = require("../sheet_downloader");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const { json } = require("express");
const spreadsheetId = "10SSTLhZzmHEABvoe4Isy6L258tk4T7GN8YdylUawLB4";
const fileDirectory = "./downloaded";

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
// Function to handle the POST request and return the received item
function postSheetName(req, res) {
  const { item } = req.body;
  console.log("Received item :", item);
  // return { item }; // 반환할 객체를 만들어서 item을 포함하여 리턴
  res.send({ item });
}

// Function to get the JSON data
async function getJson(req, res) {
  try {
    // Call the postSheetName function and get the returned item
    // const postResponse = await postSheetName(req, res);
    // const item = postResponse.item;
    // console.log("Received item in getJson:", item);

    // Continue with your existing code here
    const sheetApiClient = await SheetApiClientFactory.create();
    const downloader = new SheetDownloader(sheetApiClient);
    const fileInfo = await downloader.downloadToJson(
      spreadsheetId,
      "asian",
      "downloaded/product_list.json"
    );
    const headerRow = downloader.getHeaderRow();

    res.json(fileInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

//* json을 excel로 변환하는 함수(downloadExcel을 통해 작동)
function jsonToExcel(filePath) {
  const jsonData = fs.readFileSync(filePath, "utf-8");

  const parsedData = JSON.parse(jsonData);

  const worksheet = XLSX.utils.json_to_sheet(parsedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "my_sheet");
  XLSX.writeFile(workbook, "json_to_excel.xlsx");
}

//* json을 excel로 변환 후 저장하는 함수
function downloadExcel(filePath, res) {
  // Update the file path to match the correct location
  console.log("얘가 두번째");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const parsedData = JSON.parse(jsonData);
  const worksheet = XLSX.utils.json_to_sheet(parsedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "my_sheet");

  // 생성할 엑셀 파일 이름을 현재 시간을 기반으로 설정
  const excelFileName = `json_to_excel_${Date.now()}.xlsx`;
  const excelFilePath = path.join(fileDirectory, excelFileName);
  XLSX.writeFile(workbook, excelFilePath);

  console.log("변환 완료");

  // 클라이언트로 엑셀 파일의 다운로드 URL을 제공
  res.json({
    downloadUrl: `http://localhost:8000/downloaded/${excelFileName}`,
  });
}
//${excelFileName}

//* json server에 저장.
function postJson(req, res) {
  const filePath = path.join(__dirname, "../downloaded/product_list.json");
  const jsonData = req.body;
  // console.log("jsondata", jsonData);
  console.log("내가먼저");
  // Process the received JSON data as needed
  // ...

  // Write the jsonData to the file
  fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

  // Call the downloadExcel function to convert and download the Excel file
  downloadExcel(filePath, res); // res 객체를 downloadExcel 함수에 전달
  console.log("server filePath:", filePath);

  // 이제 downloadExcel 함수에서 응답을 보내기 때문에 아래 코드는 제거합니다.
  // res.json({ message: "Data received successfully and Excel file downloaded" });
}

module.exports = {
  getJson,
  postJson,
  downloadExcel,
  getSheetList, // 추가: 시트 목록을 가져오는 함수
  jsonToExcel,
  postSheetName,
};
