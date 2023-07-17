const SheetApiClientFactory = require("./sheet_api_client_factory");
const SheetDownloader = require("./sheet_downloader");

//
async function main() {
  try {
    const sheetApiClient = await SheetApiClientFactory.create();
    const downloader = new SheetDownloader(sheetApiClient);

    const spreadsheetId = "10SSTLhZzmHEABvoe4Isy6L258tk4T7GN8YdylUawLB4";

    const bistro = await downloader.downloadToJson(
      spreadsheetId,
      "product_list",
      "downloaded/product_list.json"
    );

    console.log(bistro);

    // const countryInfo = await downloader.downloadToJson(
    //   spreadsheetId,
    //   "countryInfo",
    //   "downloaded/countryInfo.json"
    // );

    // console.log(countryInfo);
  } catch (e) {
    console.error(e);
  }
}

main();
