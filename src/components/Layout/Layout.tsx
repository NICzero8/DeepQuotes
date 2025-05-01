import { Routes, Route } from "react-router-dom";
import Header from "../Header/Header";
import HomePage from "../pages/HomePage/HomePage";
import LibraryPage from "../pages/LibraryPage/LibraryPage";

const Layout = () => {

  return (
    <div className="app">
      <Header/>
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/library" element={<LibraryPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default Layout;
