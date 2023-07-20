import React, { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { useItemContext } from "../itemContext"

function SheetList() {
  const [sheetList, setSheetList] = useState([])
  const { setItem } = useItemContext()

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

  const handleSheetList = item => {
    axios
      .post("http://localhost:8080/postSheetName", { item: item })
      .then(response => {
        console.log("Sheet name sent successfully:", response.data)
        // Perform any additional actions if needed
      })
      .catch(error => {
        console.error("Error sending sheet name:", error)
      })

    setItem(item)
    window.location.href = `/product-list/${item}`
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
