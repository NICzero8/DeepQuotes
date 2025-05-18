import "./ErrorCard.css";

export default function ErrorCard() {
  return (
    <div className="error-wrapper">
      <div className="error-icon"></div>
      <div>
        <h3>Что-то пошло не так :(</h3>
        <p>Пожалуйста, попробуйте еще раз позже.</p>
      </div>
    </div>
  );
}
