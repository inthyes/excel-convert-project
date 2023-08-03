// const { uploadFile } = require("./UploadController");
const accessKeyId = "AKIAQODXHTFXJPI6VXNU";
const secretAccessKey = "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";

const credentials = {
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
};
// console.log(process.env.AccessKeyId);
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = new S3Client({ region: "ap-northeast-2", credentials });

const bucketName = "exceltoadmin";
const fileName = "aqw.xlsx"; // 같은 경로에 있는 경우, 따로 경로를 지정할 필요 없음

const fs = require("fs");

// 업로드 함수 호출
// uploadFile(bucketName, fileName)
//   .then((s3Url) => {
//     if (s3Url) {
//       console.log(`in function: File uploaded successfully. S3 URL: ${s3Url}`);
//     } else {
//       console.log(
//         "in function: File uploaded successfully. But S3 URL is undefined."
//       );
//     }
//   })
//   .catch((error) => {
//     console.error("Error uploading file:", error);
//   });

// 파일을 읽어서 S3에 업로드하는 함수
const uploadFile = async (bucketName, fileName) => {
  try {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName); // 인코딩 옵션 제거

    console.log("File content:", fileContent);

    // 파일 업로드 함수 호출
    const s3Url = await uploadFileToS3(bucketName, fileName, fileContent);
    console.log("33333333333333333333");
    return s3Url; // 업로드 성공 시 S3 URL을 반환
  } catch (error) {
    console.error("Error reading file or uploading to S3:", error);
    throw error;
  }
};

// 파일 업로드 함수
const uploadFileToS3 = async (bucketName, fileName, fileContent) => {
  try {
    console.log("111111111111111");
    console.log("aaa", fileName);
    // S3 업로드 매개변수 설정
    const params = {
      Bucket: bucketName, // 업로드할 버킷 이름
      Key: fileName, // S3에 저장될 파일 이름
      Body: fileContent, // 업로드할 파일 내용
    };
    console.log("bbb", params);
    // S3에 파일 업로드
    const command = new PutObjectCommand(params);
    const response = awaits3Client.send(command); // await 사용
    console.log("222222222222222222222");
    console.log(response);
    console.log(`File uploaded successfully. Location: ${response.Location}`);
    return response.Location;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};
module.exports = { uploadFile };
