const SheetApiClientFactory = require("../model/sheet_api_client_factory");
const SheetDownloader = require("../model/sheet_downloader");
const dotenv = require("dotenv");
dotenv.config();
// const { json } = require("express");
const spreadsheetId = "10SSTLhZzmHEABvoe4Isy6L258tk4T7GN8YdylUawLB4";
let sharedItem;
let sharedItemValue = null;

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
  console.log("asdf", req.session.sharedItem);
  const processedItem = returnItemValue(item);
  sharedItem = item;
  res.send({ item: processedItem, sharedItem: req.session.sharedItem });
}

function returnItemValue(item) {
  console.log("Using 'item' in returnItemValue:", item);
  return item;
}

// postSheetName의 item값을 returnItemValue함수를 통해 할당 받는다.
async function getJson(req, res) {
  try {
    console.log("sharedItemValue", sharedItemValue); // sharedItemValue 값 출력
    // const x = req.session.sharedItem;
    // console.log("Received item in getJson:", req.session.sharedItem);

    const range = "A1:Z100";
    const sheetApiClient = await SheetApiClientFactory.create();
    const downloader = new SheetDownloader(sheetApiClient);
    const fileInfo = await downloader.downloadToJson(
      spreadsheetId,
      sharedItemValue, // 전역 변수 사용
      "downloaded/product_list.json"
    );
    const headerRow = downloader.getHeaderRow();

    res.json({ fileInfo: fileInfo, sharedItem: sharedItemValue }); // 전역 변수 사용
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function setSession(req, res) {
  try {
    const { sharedItem } = req.body;
    sharedItemValue = sharedItem; // 전역 변수에 값을 저장
    console.log("Session value successfully set on server:", sharedItem);
    res.json({ message: "Session value set on server" });
  } catch (error) {
    console.error("Error setting session value on server:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getJson,
  getSheetList, // 추가: 시트 목록을 가져오는 함수
  postSheetName,
  setSession,
};
