// Modal.js
import React from 'react';
import '../modal/modal.css'
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">Task Details</h3>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          <button className="footer-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
