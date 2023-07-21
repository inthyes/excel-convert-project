import React, { useEffect, useState } from "react"
import axios from "axios"
// import { Link } from "react-router-dom"
// import { useItemContext } from "../itemContext"

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
      console.log("asdfasdfaSDF", item)
      const response = await axios.post("http://localhost:8080/postSheetName", {
        item: item,
      })
      console.log("Sheet name sent successfully:", response.data)

      // 서버로부터 값을 받은 후에 페이지를 이동시킵니다.
      window.location.href = `/product-list/${item}`
    } catch (error) {
      console.error("Error sending sheet name:", error)
    }
  }

  return (
    <div>
      <h1>Sheet List</h1>
      <ul>
        {sheetList.map((item, index) => (
          <li key={index}>
            <button onClick={() => handleSheetList(item)}>{item}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SheetList
