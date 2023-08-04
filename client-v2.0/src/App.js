import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import SheetList from "./pages/GoogleSheetList";
import ProductList from "./pages/GoogleProductList";
import ExcelUpload from "./pages/ExcelUpload";
import ProductList1 from "./pages/ExcelProductList";
// import About from "./pages/About";
// import Article from "./pages/Article";
// import Articles from "./pages/Articles";

// import Profile from "./pages/Profile";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/SheetList" element={<SheetList />} />
      <Route path="/SheetList/:item" element={<ProductList />} />
      <Route path="/ExcelUpload" element={<ExcelUpload />} />
      <Route path="/ExcelUpload/ExcelProductList" element={<ProductList1 />} />
    </Routes>
  );
};

export default App;
