const { google } = require("googleapis");
// 구글 시트 API 인증 정보
const auth = new google.auth.GoogleAuth({
  keyFile: "../credentials.json", // 서비스 계정의 JSON 키 파일 경로
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// 시트 목록 가져오기
async function getSheetList() {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "10SSTLhZzmHEABvoe4Isy6L258tk4T7GN8YdylUawLB4"; // 구글 시트의 ID

  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheetList = response.data.sheets.map(
      (sheet) => sheet.properties.title
    );
    return sheetList;
  } catch (error) {
    console.error("Error retrieving sheet list:", error);
    return [];
  }
}
