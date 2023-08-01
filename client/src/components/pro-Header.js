import React from "react"
import { Row, Col } from "reactstrap"
import { css } from "@emotion/react" // Note the correct import statement

const HeaderCss = css`
  text-align: center;
  div {
    background-color: rgba(116, 172, 62, 0.12);
    border: 1px solid rgba(30, 20, 13, 0.2); // Corrected 'rgba' spelling
  }
  height: 100px;
`

const PHeaders = () => {
  // MyComponent에서 전달받은 jsonData의 item 값을 사용합니다
  // const item = props.sharedItem
  // console.log(item)

  return (
    <div css={HeaderCss} className="mb-3">
      <Row>
        <Col md="6" sm="auto" className="text-center m-auto">
          <br />
          <br />
          <h2>googleSheet List</h2>
          {/* <p>googleSheet to excelFile</p> */}
          <br />
        </Col>
      </Row>
    </div>
  )
}

export default PHeaders
