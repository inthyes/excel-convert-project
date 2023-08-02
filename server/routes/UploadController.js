const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const fileDirectory = "../";
const serverAddress = "http://localhost:8000";
const accessKeyId = process.env.AccessKeyId;
const secretAccessKey = process.env.SecretAccessKey;

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
  // console.log("fileDirectory", fileDirectory);
  const file = XLSX.writeFile(workbook, excelFilePath);

  console.log("변환 완료");

  res.set("Content-Disposition", `attachment; filename="excel_file.xlsx"`);
  res.set(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  // res.download(excelFilePath); // 파일 다운로드 응답 생성

  console.log("zzzzzzzzz", workbook);
  // uploadFile("exceltoadmin", file);
  // console.log("aaaaaaaaaaaaaa", excelFilePath);
  // console.log("qqqqqqqqqqqqq", fileDirectory);
  res.json({
    downloadUrl: `${serverAddress}/downloaded/${excelFileName}`,
  });
}

// const { S3Client, PutObjectCommand } = require("aws-sdk");
// const fs = require("fs");

// AWS 인증 정보 설정 (AWS_ACCESS_KEY_ID와 AWS_SECRET_ACCESS_KEY는 환경 변수로 설정하거나 별도의 파일에서 가져와서 사용할 수 있습니다.)
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const credentials = {
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
};

// AWS SDK (v3) S3 클라이언트 생성
const s3Client = new S3Client({ region: "ap-northeast-2", credentials });

// 파일 업로드 함수
const uploadFileToS3 = async (bucketName, fileName, fileContent) => {
  try {
    // S3 업로드 매개변수 설정
    const params = {
      Bucket: bucketName, // 업로드할 버킷 이름
      Key: fileName, // S3에 저장될 파일 이름
      Body: fileContent, // 업로드할 파일 내용
    };

    // S3에 파일 업로드
    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);

    console.log(`File uploaded successfully. Location: ${response.Location}`);
    return response.Location;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};

// 파일을 읽어서 S3에 업로드하는 함수
const uploadFile = async (bucketName, fileName) => {
  try {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName); // 인코딩 옵션 제거

    // 파일 내용 출력 (이 부분은 테스트를 위해 필요하다면 유지하셔도 됩니다)
    console.log("File content:", fileContent);

    // 파일 업로드 함수 호출
    const s3Url = await uploadFileToS3(bucketName, fileName, fileContent);
    return s3Url; // 업로드 성공 시 S3 URL을 반환
  } catch (error) {
    console.error("Error reading file or uploading to S3:", error);
    throw error;
  }
};
module.exports = {
  postJson,
  downloadExcel,
  jsonToExcel,
  uploadFile, // 추가: 파일 업로드 함수
};
