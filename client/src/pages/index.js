import "bootstrap/dist/css/bootstrap.min.css"
import React from "react"
import { Link } from "gatsby"
import Button from "@material-ui/core/Button"

const buttonStyle = {
  textTransform: "none", // 대문자 변환 스타일 제거
}

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Link to={`/sheet-list`}>
          <Button variant="link" style={{ ...buttonStyle, fontSize: "24px" }}>
            googleSheet to Excel
          </Button>
        </Link>
        <Link to={`/sheet-list`}>
          <Button
            variant="link"
            style={{ ...buttonStyle, fontSize: "24px", marginTop: "16px" }}
          >
            Excel to Admin
          </Button>
        </Link>
      </div>
    </div>
  )
}
