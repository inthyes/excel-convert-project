import React, { useEffect, useState } from "react"
import axios from "axios"
import { withStyles, makeStyles } from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import IconButton from "@material-ui/core/IconButton"
// import IconButton from "@material-ui/core/IconButton"
import DeleteIcon from "@material-ui/icons/Delete"
import Button from "@material-ui/core/Button"
import Header from "../components/Header"

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.grey[200],
    color: theme.palette.common.white,
    position: "relative",
  },
  body: {
    fontSize: 14,
  },
}))(TableCell)

const useStyles = makeStyles(theme => ({
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
}))

const MyComponent = () => {
  const classes = useStyles()
  const [jsonData, setJsonData] = useState(null)
  const [sharedItem, setSharedItem] = useState(null) // sharedItem 상태 추가
  const [selectedHeaders, setSelectedHeaders] = useState([])
  const [originalHeaders, setOriginalHeaders] = useState([])
  const [downloadUrl, setDownloadUrl] = useState("")

  // const { item } = useItemContext()
  // console.log("your item :", item)
  // useEffect(() => {
  //   const storedSharedItem = sessionStorage.getItem("sharedItem")
  //   if (storedSharedItem) {
  //     setSharedItem(JSON.parse(storedSharedItem))
  //   }
  // }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // templates/product-list.js에서 item 값을 사용할 수 있도록 전달
        // console.log("item from context:", item)
        const response = await axios.get("http://localhost:8080/getJson")
        setJsonData(response.data.fileInfo)
        console.log("jsonData:", response.data.fileInfo)
        setSharedItem(response.data.sharedItem)
        console.log("item?:", response.data.sharedItem)

        // 동적으로 헤더 설정
        if (response.data.fileInfo.length > 0) {
          const headers = Object.keys(response.data.fileInfo[0]).filter(
            header => header.trim() !== ""
          )
          setSelectedHeaders(headers)
          setOriginalHeaders(headers)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, []) // item 값이 변경될 때마다 useEffect가 호출되도록 변경

  const handleHeaderChange = (e, index) => {
    //e: 이벤트 객체, index: 수정하려는 헤더의 인덱스
    const newHeaders = [...selectedHeaders]
    console.log("aaaaaaa", newHeaders)
    newHeaders[index] = e.target.value //헤더 변경
    console.log("bbbbbbb", newHeaders)
    setSelectedHeaders(newHeaders)
    console.log(newHeaders[index], index)
  }

  const handleDeleteColumn = header => {
    const updatedData = jsonData.map(item => {
      const updatedItem = { ...item }
      delete updatedItem[header]

      return updatedItem
    })

    console.log(["dddddd", ...selectedHeaders])
    console.log("eeeeeeeee", header)
    const updatedHeaders = selectedHeaders.filter(h => h !== header)

    console.log(updatedHeaders, header) //헤더값 삭제
    setJsonData(updatedData)
    console.log(updatedData)
    setSelectedHeaders(updatedHeaders)
    setOriginalHeaders(updatedHeaders)
    console.log(updatedData)
  }

  const handleDownloadData = () => {
    // 셀렉트 박스로 변경된 헤더 이름을 반영한 JSON 데이터 생성
    const updatedJsonData = jsonData.map(item => {
      const updatedItem = {}
      originalHeaders.forEach((header, index) => {
        const selectedHeader = selectedHeaders[index]
        updatedItem[selectedHeader] = item[header]
      })
      return updatedItem
    })

    axios
      .post("http://localhost:8080/postJson", updatedJsonData)
      .then(response => {
        console.log("Data sent successfully:", response.data)
        // 서버로부터 받아온 다운로드 URL을 상태 변수에 설정
        setDownloadUrl(response.data.downloadUrl)
        handleDownloadExcel(response.data.downloadUrl) // 엑셀 파일 다운로드 함수 호출
      })
      .catch(error => {
        console.error("Error sending data:", error)
      })
  }

  const handleDownloadExcel = downloadUrl => {
    // 파일 다운로드를 위해 엑셀 파일의 URL을 클릭하여 다운로드

    const link = document.createElement("a")
    link.href = downloadUrl // response에서 직접 URL을 가져와서 사용
    link.download = "excel_file.xlsx"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    console.log("handleDownloadExcel", downloadUrl)
  }

  const handleAddColumn = () => {
    const newHeader = `New Column ${selectedHeaders.length + 1}`

    setSelectedHeaders(prevHeaders => [...prevHeaders, newHeader])
    setOriginalHeaders(prevHeaders => [...prevHeaders, newHeader])

    // 새로운 열을 추가한 후, jsonData에도 빈 값을 추가한다.
    const updatedData = jsonData.map(item => {
      const updatedItem = { ...item, [newHeader]: "" }
      return updatedItem
    })

    setJsonData(updatedData)
  }

  const handleResetData = () => {
    setJsonData(null)
    setSelectedHeaders([])
    setOriginalHeaders([])
  }

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
  ]

  return (
    <div>
      <Header sharedItem={sharedItem} />
      {/* <h1>Product List</h1> */}
      {/* <button onClick={handleResetData}>Reset Data</button> */}
      {/* <Button variant="outlined" color="neutral">
        Outlined
      </Button> */}

      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <Button variant="outlined" color="primary" onClick={handleDownloadData}>
          Download Data
        </Button>
        <Button variant="outlined" color="primary" onClick={handleAddColumn}>
          Add Column
        </Button>
      </div>
      {/* {downloadUrl && (
        <button onClick={handleDownloadExcel}>Download Excel</button>
      )} */}
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
                        onChange={e => handleHeaderChange(e, index)}
                      >
                        <MenuItem value={header}>{header}</MenuItem>
                        {selectOptions.map(option => (
                          <MenuItem value={option} key={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                      {header !== "" && (
                        <IconButton
                          className={classes.deleteButton}
                          onClick={() => handleDeleteColumn(header)}
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
                    {originalHeaders.map(header => (
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
  )
}

export default MyComponent
