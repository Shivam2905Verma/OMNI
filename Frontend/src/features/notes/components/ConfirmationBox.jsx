import { createPortal } from "react-dom";
import "../style/confirmation.scss";

const ConfirmModal = ({ onConfirm, onCancel, description, warning }) => {
  return createPortal(
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-modal-icon">
          <i className="ri-delete-bin-line" />
        </div>
        <h3 className="confirm-modal-title">Are you sure?</h3>
        <p className="confirm-modal-desc">
          {description}{" "}
          {warning && (
            <>
              <br />
              <span className="confirm-modal-warning">{warning}</span>
            </>
          )}
          <br />
          <span className="confirm-modal-note">
            This action cannot be undone.
          </span>
        </p>
        <div className="confirm-modal-actions">
          <button className="confirm-modal-btn cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-modal-btn confirm" onClick={onConfirm}>
            <i className="ri-delete-bin-line" /> Yes, Delete
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ConfirmModal;
