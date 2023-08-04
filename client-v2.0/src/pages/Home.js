import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import "bootstrap/dist/css/bootstrap.min.css";
// import SheetList from "./Sheet-list";

const buttonStyle = {
  textTransform: "none", // 대문자 변환 스타일 제거
};

const Home = () => {
  return (
    <div>
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
          <Link to="SheetList">
            <Button variant="link" style={{ ...buttonStyle, fontSize: "24px" }}>
              googleSheet to Excel
            </Button>
          </Link>
          <Link to={`/ExcelUpload`}>
            <Button
              variant="link"
              style={{ ...buttonStyle, fontSize: "24px", marginTop: "16px" }}
            >
              Excel to Admin
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
