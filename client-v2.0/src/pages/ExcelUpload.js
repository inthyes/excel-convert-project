import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import ProductList from "./ExcelProductList";

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
      .post("http://localhost:8080/aqw", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
        setResData(response.data.resData); // Update the resData state with the response data
        // Call navigate to move to the target path and pass resData as a state object
        navigate("/ExcelUpload/ExcelProductList", {
          state: { resData: response.data.resData },
        });
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  return (
    <div>
      <h1>Excel File Uploader</h1>
      <input type="file" onChange={onFileChange} />
      <button onClick={onFileUpload}>Upload</button>{" "}
      {/* Use button instead of Link */}
    </div>
  );
};

export default UploadExcel;
