/**
 * Props:
 * @param {string} placeholder
 * @param {string} type
 */

function Input({ placeholder, type }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
    />
  );
}

export default Input;