import "./AuthorSelector.css";

type AuthorSelectorProps = {
  children: React.ReactNode;
};

const AuthorSelector: React.FC<AuthorSelectorProps> = ({ children }) => {
  return (
    <>
      <div className="author-selector-container">
        <div className="author-selector-shadow"></div>
        <div className="author-selector-wrapper">
          <div className="scroll-container">{children}</div>
        </div>
      </div>
      <div className="arrows"></div>
    </>
  );
};

export default AuthorSelector;
