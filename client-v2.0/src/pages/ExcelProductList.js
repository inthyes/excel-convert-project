import React, { useEffect, useState } from "react";
import axios from "axios";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
// import ProductHeader from "../components/Product-Header";
import { useParams, useLocation } from "react-router-dom";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.grey[200],
    color: theme.palette.common.white,
    position: "relative",
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
  },
  select: {
    width: "100%",
    color: "black",
  },
  deleteButton: {
    position: "absolute",
    top: "50%",
    right: theme.spacing(-1),
    transform: "translateY(-50%)",
    visibility: "hidden",
  },
  headerCell: {
    "&:hover $deleteButton": {
      visibility: "visible",
    },
  },
}));

const ProductList = () => {
  const classes = useStyles();
  const [jsonData, setJsonData] = useState(null);
  const [sharedItem, setSharedItem] = useState(null); // sharedItem 상태 추가
  const [selectedHeaders, setSelectedHeaders] = useState([]);
  const [originalHeaders, setOriginalHeaders] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState("");
  const location = useLocation(); // Get the location object

  useEffect(() => {
    // Check if location.state exists and has resData
    if (location.state && location.state.resData) {
      console.log("resData:", location.state.resData);
      // Assuming my_sheet is the first sheet in the resData object
      const firstSheet = location.state.resData.my_sheet;
      setJsonData(firstSheet); // jsonData should be an array, not the entire object
      console.log("zzzzzzzzzz", firstSheet);
      if (firstSheet.length > 0) {
        const headers = Object.keys(firstSheet[0]).filter(
          (header) => header.trim() !== ""
        );
        setSelectedHeaders(headers);
        setOriginalHeaders(headers);
      }
    } else {
      setJsonData(null); // Set jsonData to null if resData is not available
    }
  }, [location.state]);
  const handleHeaderChange = (e, index) => {
    // e: 이벤트 객체, index: 수정하려는 헤더의 인덱스
    const newHeaders = [...selectedHeaders];
    newHeaders[index] = e.target.value; // 헤더 변경
    setSelectedHeaders(newHeaders); // selectedHeaders 배열 업데이트
  };

  const handleDeleteColumn = (columnIndex) => {
    const updatedData = jsonData.map((item) => {
      const updatedItem = { ...item };
      delete updatedItem[selectedHeaders[columnIndex]];
      return updatedItem;
    });

    const updatedHeaders = selectedHeaders.filter(
      (_, index) => index !== columnIndex
    );

    const updatedOriginalHeaders = originalHeaders.filter(
      (_, index) => index !== columnIndex
    );

    setJsonData(updatedData);
    setSelectedHeaders(updatedHeaders); // selectedHeaders 배열 업데이트
    setOriginalHeaders(updatedOriginalHeaders); // originalHeaders 배열 업데이트
  };

  const handleDownloadData = async () => {
    // 셀렉트 박스로 변경된 헤더 이름을 반영한 JSON 데이터 생성
    const updatedJsonData = jsonData.map((item) => {
      const updatedItem = {};
      originalHeaders.forEach((header, index) => {
        const selectedHeader = selectedHeaders[index];
        updatedItem[selectedHeader] = item[header];
      });
      return updatedItem;
    });

    try {
      const response = await axios.post(
        "http://localhost:8080/postJson",
        updatedJsonData
      );
      console.log("Data sent successfully:", response.data.downloadUrl);
      console.log(updatedJsonData);
      // 서버로부터 받아온 다운로드 URL을 상태 변수에 설정
      setDownloadUrl(response.data.downloadUrl);

      // handleDownloadExcel 함수 호출 시 downloadUrl 값을 인자로 전달
      await handleDownloadExcel(response.data.downloadUrl);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  // handleDownloadExcel 함수에서 downloadUrl 변수를 사용하도록 수정
  const handleDownloadExcel = async () => {
    const downloadLink = document.createElement("a");
    console.log("downloadLink", downloadLink);

    // 다운로드 URL이 유효한 경우에만 다운로드 시도
    if (downloadUrl) {
      downloadLink.href = downloadUrl;
      console.log("downloadLink.href", downloadLink.href);
      downloadLink.setAttribute("download", "excel_file.xlsx");
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handleAddColumn = () => {
    const newHeader = `New Column ${selectedHeaders.length + 1}`;

    setSelectedHeaders((prevHeaders) => [...prevHeaders, newHeader]);
    setOriginalHeaders((prevHeaders) => [...prevHeaders, newHeader]);

    // 새로운 열을 추가한 후, jsonData에도 빈 값을 추가한다.
    const updatedData = jsonData.map((item) => {
      const updatedItem = { ...item, [newHeader]: "" };
      return updatedItem;
    });

    setJsonData(updatedData);
  };
  const handleResetData = () => {
    setJsonData(null);
    setSelectedHeaders([]);
    setOriginalHeaders([]);
  };

  const selectOptions = [
    "",
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

  return (
    <div>
      {/* <ProductHeader storedSharedItem={sharedItem} /> */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <Button variant="outlined" color="primary" onClick={handleDownloadData}>
          Download Data
        </Button>
        <Button variant="outlined" color="primary" onClick={handleAddColumn}>
          Add Column
        </Button>
      </div>
      <br />
      {jsonData ? (
        <div>
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  {originalHeaders.map((header, index) => (
                    <StyledTableCell
                      key={header}
                      className={classes.headerCell}
                    >
                      <Select
                        className={classes.select}
                        value={selectedHeaders[index]}
                        onChange={(e) => handleHeaderChange(e, index)}
                      >
                        <MenuItem value={header}>{header}</MenuItem>
                        {selectOptions.map((option) => (
                          <MenuItem value={option} key={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                      {header !== "" && (
                        <IconButton
                          className={classes.deleteButton}
                          onClick={() => handleDeleteColumn(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {jsonData.map((product, index) => (
                  <TableRow key={index}>
                    {originalHeaders.map((header) => (
                      <TableCell key={`${header}-${index}`} align="center">
                        {product[header]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
        <div style={{ textAlign: "center", fontSize: "24px" }}>Loading...</div>
      )}
    </div>
  );
};

export default ProductList;
