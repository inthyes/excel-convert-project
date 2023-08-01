import React from "react"
import { Row, Col } from "reactstrap"
import { css } from "@emotion/react"

const HeaderCss = css`
  text-align: center;
  div {
    background-color: rgba(116, 172, 62, 0.12);
    border: 1px solid rgba(30, 20, 13, 0.2);
  }
`

const Header = React.memo(props => {
  const item = props.storedSharedItem
  console.log(item)

  return (
    <div css={HeaderCss} className="mb-3">
      <Row>
        <Col md="6" sm="auto" className="text-center m-auto">
          <br />
          <h2>메뉴 리스트 [매장명 : {item}]</h2>
          <p>googleSheet to excelFile</p>
        </Col>
      </Row>
    </div>
  )
})

export default Header
