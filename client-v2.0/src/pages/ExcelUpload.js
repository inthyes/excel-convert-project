import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import SheetHeader from "../components/Sheet-Header";
import SendIcon from "@mui/icons-material/Send";
// import Stack from "@mui/material/Stack";
import Button from "@material-ui/core/Button";
import test from "../test.css";

const UploadExcel = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resData, setResData] = useState(null);
  const navigate = useNavigate(); // Get the navigate function

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const onFileUpload = () => {
    const formData = new FormData();
    formData.append("xlsx", selectedFile);

    axios
      .post("http://localhost:8080/excelToJson", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
        setResData(response.data.resData); // Update the resData state with the response data

        // Combine the file name and resData into an object
        const dataWithFileName = {
          fileName: selectedFile.name, // Add the file name to the object
          resData: response.data.resData,
        };

        // Call navigate to move to the target path and pass the combined object as a state
        navigate("/ExcelUpload/ExcelProductList", { state: dataWithFileName });
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  return (
    <div>
      <SheetHeader />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <input type="file" onChange={onFileChange} />
        {/* <div class="filebox">
          <input class="upload-name" value="첨부파일" placeholder="첨부파일" />
          <label for="file">파일찾기</label>
          <input type="file" id="file" />
        </div> */}
        <Button
          variant="contained"
          onClick={onFileUpload}
          endIcon={<SendIcon />}
        >
          Upload
        </Button>
      </div>
      {/* Use button instead of Link */}
    </div>
  );
};

export default UploadExcel;
