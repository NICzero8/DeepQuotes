import { Link, NavLink } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <nav className="navigation">
        <NavLink to="/" className="nav-link">
          <span>Генератор</span>
        </NavLink>
        <NavLink to="/library" className="nav-link">
          <span>Библиотека</span>
        </NavLink>
      </nav>
      <Link to="/" className="logo-link">
        <div className="logo-wrapper">
          <h1 className="gradient-text">DeepQuotes</h1>
          <div className="logo-mask"></div>
        </div>
      </Link>
    </header>
  );
};

export default Header;
