import React from "react";
import './Modal.css';

function Modal({isOpen, onClose, children}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
        <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
        >
        <button className="close-button" onClick={onClose}>&times;</button>
        {children}
    </div>
    </div>

    
  );
}
export default Modal;
