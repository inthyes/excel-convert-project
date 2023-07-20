const SheetApiClientFactory = require("../sheet_api_client_factory");
const SheetDownloader = require("../sheet_downloader");
const XLSX = require("xlsx");
const fs = require("fs");
const { json } = require("express");
const spreadsheetId = "10SSTLhZzmHEABvoe4Isy6L258tk4T7GN8YdylUawLB4";

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

//*
function postSheetName(req, res) {
  const { item } = req.body;
  console.log("Received item :", item);
  res.json({ message: "Data received successfully", item });
  return item;
}

//* 각각의 json에 맞게 table을 product-list/{item}시작과 동시에 get되는 함수
async function getJson(req, res) {
  try {
    // const item = postSheetName(req, res); // Call postSheetName and get the returned item
    // console.log("Received item in getJson:", item);

    const sheetApiClient = await SheetApiClientFactory.create();
    const downloader = new SheetDownloader(sheetApiClient);

    const fileInfo = await downloader.downloadToJson(
      spreadsheetId,
      "asian",
      // item,
      "downloaded/product_list.json"
    );

    const headerRow = downloader.getHeaderRow();
    // console.log("Header Row:", headerRow);

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
function downloadExcel(req, res) {
  const filePath = "./downloaded/product_list.json";
  jsonToExcel(filePath);

  res.send("Excel 파일 다운로드가 완료되었습니다.");
}

//* 이게 뭐더라..
function postJson(req, res) {
  const filePath = "./downloaded/product_list.json";
  const jsonData = req.body;
  // Process the received JSON data as needed
  // ...

  console.log(jsonData);

  // Write the jsonData to the file
  fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

  // Send a response back to the client
  res.json({ message: "Data received successfully", jsonData });
}

module.exports = {
  getJson,
  postJson,
  downloadExcel,
  getSheetList, // 추가: 시트 목록을 가져오는 함수
  jsonToExcel,
  postSheetName,
};
