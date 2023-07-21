import React from "react"
import { Row, Col } from "reactstrap"
import { css } from "@emotion/react" // Note the correct import statement

const HeaderCss = css`
  text-align: center;
  div {
    background-color: rgba(116, 172, 62, 0.12);
    border: 1px solid rgba(30, 20, 13, 0.2); // Corrected 'rgba' spelling
  }
`

const Header = () => {
  return (
    <div css={HeaderCss} className="mb-3">
      <Row>
        <Col md="6" sm="auto" className="text-center m-auto">
          <br />
          <h1>Product List</h1>
          <p>googleSheet to excelFile</p>
        </Col>
      </Row>
    </div>
  )
}

export default Header
