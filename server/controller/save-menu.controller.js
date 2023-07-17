const fs = require("fs");

const defaultMenuKeys = [
  "메뉴코드",
  "메뉴명",
  "가격",
  "할인가격",
  "포장추가비용",
  "이미지명",
  "메뉴 표시명(한글)",
  "메뉴 표시명(영문)",
  "메뉴 표시명(일문)",
  "메뉴 표시명(중문)",
  "메뉴 표시명(KDS)",
  "메뉴 표시명(Print)",
];

// 'downloaded/product_list.json' 파일을 읽어서 jsonData로 저장
const filePath = "./downloaded/product_list.json";
const jsonData = fs.readFileSync(filePath, "utf-8");
const parsedData = JSON.parse(jsonData);

const selectedKeys = Object.keys(jsonData); // 모든 key 값들

console.log(selectedKeys);
// console.log(keys);

// console.log(jsonData);
// console.log(extractedData);
