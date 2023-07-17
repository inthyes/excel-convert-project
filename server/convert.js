const XLSX = require("xlsx");
const fs = require("fs");

const downloadExcel = (data) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  // const sampleData = require("./downloaded/product_list.json");
  XLSX.utils.book_append_sheet(workbook, worksheet, "my_sheet");
  XLSX.writeFile(workbook, "json_to_excel.xlsx");
};

const jsonData = fs.readFileSync("./downloaded/product_list.json", "utf-8");
const sampleData = JSON.parse(jsonData);

downloadExcel(sampleData);
