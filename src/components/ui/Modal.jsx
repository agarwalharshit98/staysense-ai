/**
 * Props:
 * @param {boolean} isOpen
 * @param {React.ReactNode} children
 */

function Modal({ isOpen, children }) {
  if (!isOpen) return null;

  return (
    <div>
      {children}
    </div>
  );
}

export default Modal;