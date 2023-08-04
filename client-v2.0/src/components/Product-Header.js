import React from "react";
import { Row, Col } from "reactstrap";
import { css } from "@emotion/react";

const HeaderCss = css`
  text-align: center;
  div {
    background-color: rgba(116, 172, 62, 0.12);
    border: 1px solid rgba(30, 20, 13, 0.2);
  }
`;

const ProductHeader = React.memo((props) => {
  const { storedSharedItem, customHeaderText } = props; // Destructure the props
  console.log(storedSharedItem);

  return (
    <div css={HeaderCss} className="mb-3">
      <Row>
        <Col md="6" sm="auto" className="text-center m-auto">
          <br />
          {/* Use conditional rendering to show different text */}
          {storedSharedItem ? (
            <div>
              <h2>메뉴 리스트 [매장명 : {storedSharedItem}]</h2>
              <p>googleSheet to excelFile</p>
            </div>
          ) : (
            <div>
              <h2>{customHeaderText}</h2>
              <p>excelFile to admin</p>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
});

export default ProductHeader;
