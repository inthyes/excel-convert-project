const fs = require("fs");
const path = require("path");

class SheetDownloader {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.headerRow = null;
  }

  async downloadToJson(spreadsheetId, sheetName, filePath = null) {
    const res = await this.apiClient.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: sheetName,
    });

    const rows = res.data.values;
    if (rows.length === 0) {
      const message = "No data found on the sheet";
      console.error(message);
      return {};
    }

    this.headerRow = rows[0]; // headerRow 값을 할당합니다.

    const object = this._rowsToObject(rows);

    if (filePath) {
      const jsonText = JSON.stringify(object, null, 2);

      const directory = path.dirname(filePath);
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
      }
      fs.writeFileSync(filePath, jsonText);
      console.log(`Written to ${filePath}`);
    }
    return object;
  }

  _rowsToObject(rows) {
    const headerRow = this.headerRow;
    const dataRows = rows.slice(1, rows.length);
    console.log("1", headerRow);

    return dataRows.map((row) => {
      const item = {};
      for (let i = 0; i < headerRow.length; i++) {
        const fieldName = headerRow[i];
        const fieldValue = row[i];
        item[fieldName] = fieldValue;
      }
      return item;
    });
  }

  getHeaderRow() {
    return this.headerRow;
  }
}

module.exports = SheetDownloader;
