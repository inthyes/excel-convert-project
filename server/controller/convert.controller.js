const SheetApiClientFactory = require("../sheet_api_client_factory");
const SheetDownloader = require("../sheet_downloader");
const XLSX = require("xlsx");
const fs = require("fs");

async function downloadBistro(req, res) {
  try {
    const sheetApiClient = await SheetApiClientFactory.create();
    const downloader = new SheetDownloader(sheetApiClient);

    const spreadsheetId = "10SSTLhZzmHEABvoe4Isy6L258tk4T7GN8YdylUawLB4";

    const bistro = await downloader.downloadToJson(
      spreadsheetId,
      "product_list",
      "downloaded/product_list.json"
    );

    res.json(bistro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function convertToJsonAndDownloadExcel(filePath) {
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const parsedData = JSON.parse(jsonData);

  const worksheet = XLSX.utils.json_to_sheet(parsedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "my_sheet");
  XLSX.writeFile(workbook, "json_to_excel.xlsx");
}

function downloadExcelController(req, res) {
  const filePath = "./downloaded/product_list.json";
  convertToJsonAndDownloadExcel(filePath);

  res.send("Excel 파일 다운로드가 완료되었습니다.");
}

module.exports = {
  downloadBistro,
  downloadExcelController,
};
