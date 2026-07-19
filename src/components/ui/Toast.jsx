/**
 * Props:
 * @param {string} message
 * @param {string} type - 'error' | 'success' | 'info'
 */

function Toast({ message, type = 'error' }) {
  const bgColor = type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6';
  
  return (
    <div
      style={{
        padding: "16px 20px",
        borderRadius: "8px",
        backgroundColor: bgColor,
        color: "white",
        marginBottom: "20px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {message}
    </div>
  );
}

export default Toast;