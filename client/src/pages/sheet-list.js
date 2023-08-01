import React, { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "gatsby"
// import { useItemContext } from "../itemContext"
import PHeaders from "../components/pro-Header"
import Button from "@material-ui/core/Button"

function SheetList() {
  const [sheetList, setSheetList] = useState([])

  // const { setItem } = useItemContext()

  useEffect(() => {
    axios
      .get("http://localhost:8080/getSheetList")
      .then(response => {
        setSheetList(response.data)
        console.log(response.data)
      })
      .catch(error => {
        console.error("Error retrieving sheet list:", error)
      })
  }, [])

  const handleSheetList = async item => {
    try {
      sessionStorage.setItem("sharedItem", item) // 클라이언트 측의 sessionStorage에 값을 설정
      const response = await axios.post("http://localhost:8080/postSheetName", {
        item: item,
        sessionData: sessionStorage.getItem("sharedItem"),
      })
      console.log("Sheet name sent successfully:", response.data)

      // Set the received sharedItem value in sessionStorage
      // sessionStorage.setItem("sharedItem", response.data.sharedItem)
    } catch (error) {
      console.error("Error sending sheet name:", error)
    }
  }

  return (
    <div>
      <PHeaders />
      {/* <br></br> */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <ul>
          {sheetList.map((item, index) => (
            <li key={index}>
              <Link to={`/sheet-list/${item}`}>
                <Button variant="link" onClick={() => handleSheetList(item)}>
                  {item}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default SheetList
