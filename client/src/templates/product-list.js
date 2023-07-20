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
import DeleteIcon from "@material-ui/icons/Delete"

import { useItemContext } from "../itemContext"

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
  const [selectedHeaders, setSelectedHeaders] = useState([])
  const [originalHeaders, setOriginalHeaders] = useState([])

  const { item } = useItemContext()
  console.log("your item :", item)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // templates/product-list.js에서 item 값을 사용할 수 있도록 전달
        console.log("item from context:", item)
        const response = await axios.get("http://localhost:8080/getJson", {
          params: { item }, // 전달받은 item 값을 서버에 전달
        })
        setJsonData(response.data)
        console.log("jsonData:", response.data)

        // 동적으로 헤더 설정
        if (response.data.length > 0) {
          const headers = Object.keys(response.data[0])
          setSelectedHeaders(headers)
          setOriginalHeaders(headers)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [item]) // item 값이 변경될 때마다 useEffect가 호출되도록 변경

  const handleHeaderChange = (e, index) => {
    const newHeaders = [...selectedHeaders]
    newHeaders[index] = e.target.value
    setSelectedHeaders(newHeaders)
  }

  const handleDeleteColumn = header => {
    const updatedData = jsonData.map(item => {
      const updatedItem = { ...item }
      delete updatedItem[header]
      return updatedItem
    })

    const updatedHeaders = selectedHeaders.filter(h => h !== header)

    setJsonData(updatedData)
    setSelectedHeaders(updatedHeaders)
    setOriginalHeaders(updatedHeaders)
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

    // Send updatedJsonData to the backend
    axios
      .post("http://localhost:8080/excelTojson", updatedJsonData)
      .then(response => {
        console.log("Data sent successfully:", response.data)
        // Perform any additional actions if needed
      })
      .catch(error => {
        console.error("Error sending data:", error)
      })
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
      <h1>Product List</h1>
      {/* <button onClick={handleResetData}>Reset Data</button> */}
      <button onClick={handleDownloadData}>Download Data</button>
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
                      <TableCell key={`${header}-${index}`}>
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
        <div>Loading...</div>
      )}
    </div>
  )
}

export default MyComponent