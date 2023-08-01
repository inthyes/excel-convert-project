const { uploadFile } = require("./controller/convert.controller");

// 테스트할 버킷 이름과 파일 경로를 설정합니다.
const bucketName = "exceltoadmin";
const fileName = "c:/Users/sey42/Downloads/excel_file (12).xlsx"; // 업로드할 로컬 파일 경로로 변경해주세요.

// 업로드 함수를 호출합니다.
uploadFile(bucketName, fileName)
  .then((s3Url) => {
    if (s3Url) {
      console.log(`File uploaded successfully. S3 URL: ${s3Url}`);
    } else {
      console.log("File uploaded successfully. But S3 URL is undefined.");
    }
  })
  .catch((error) => {
    console.error("Error uploading file:", error);
  });
