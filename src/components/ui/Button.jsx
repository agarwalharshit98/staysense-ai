/**
 * Props:
 * @param {string} text - Button text
 * @param {Function} onClick - Click handler
 */

function Button({ text, onClick }) {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;