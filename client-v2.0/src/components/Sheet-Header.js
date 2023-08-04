import React from "react";
import { Row, Col } from "reactstrap";
import { css } from "@emotion/react"; // Note the correct import statement

const HeaderCss = css`
  text-align: center;
  div {
    background-color: rgba(116, 172, 62, 0.12);
    border: 1px solid rgba(30, 20, 13, 0.2);
  }
  /* height: 100px; */ // Remove or comment out this line
`;

const SheetHeader = (props) => {
  // MyComponent에서 전달받은 jsonData의 item 값을 사용합니다
  // const item = props.sharedItem
  // console.log(item)
  const { googlesheet } = props;
  return (
    <div css={HeaderCss} className="mb-3">
      <Row>
        <Col md="6" sm="auto" className="text-center m-auto">
          <br />
          <br />
          {googlesheet ? (
            <h2>googleSheet List</h2>
          ) : (
            <h2>Excel File Uploader</h2>
          )}

          {/* <p>googleSheet to excelFile</p> */}
          <br />
        </Col>
      </Row>
    </div>
  );
};

export default SheetHeader;
