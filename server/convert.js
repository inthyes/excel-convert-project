const XLSX = require("xlsx");
const fs = require("fs");

function convertToJsonAndDownloadExcel(filePath) {
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const parsedData = JSON.parse(jsonData);

  const worksheet = XLSX.utils.json_to_sheet(parsedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "my_sheet");
  XLSX.writeFile(workbook, "json_to_excel.xlsx");
}

const filePath = "./downloaded/product_list.json";
convertToJsonAndDownloadExcel(filePath);
