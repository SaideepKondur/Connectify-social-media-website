import React from 'react';
import './ConfirmationModel.scss';

function ConfirmationModel({ onConfirm, onCancel }) {
    return (
        <div className="confirmation-model">
            <div className="model-content">
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                <div className="modal-actions">
                    <button className="btn btn-confirm" onClick={onConfirm}>Yes, delete</button>
                    <button className="btn btn-cancel" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModel;
