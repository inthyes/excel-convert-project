import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import SheetList from "./pages/Sheet-list";
import ProductList from "./pages/Product-list";
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
    </Routes>
  );
};

export default App;
