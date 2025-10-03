import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const RejectModal = ({ show, onConfirm, onClose, isLoading }) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(reason);
    handleReset();
  };

  const handleReset = () => {
    setReason("");
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Body className="px-4 py-4">
        {/* Icon + tiêu đề */}
        <div className="text-center mb-3">
          <i
            className="bi bi-x-circle text-danger"
            style={{ fontSize: "60px" }}
          ></i>
          <h4 className="mt-3 mb-2">Từ chối bài viết</h4>
          <p className="text-muted mb-0">Vui lòng nhập lý do từ chối</p>
        </div>

        {/* Form nhập lý do */}
        <Form>
          <Form.Group controlId="reject-reason">
            <Form.Label>Lý do từ chối</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do..."
            />
          </Form.Group>
        </Form>

        {/* Nút hành động */}
        <div className="d-flex justify-content-end mt-4 gap-4">
          <Button
            variant="secondary"
            className="me-2 px-4"
            onClick={() => {
              onClose();
              handleReset();
            }}
          >
            Hủy
          </Button>
          <Button
            variant="danger"
            className="px-4"
            onClick={handleConfirm}
            disabled={isLoading || !reason.trim()}
          >
            {isLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              "Từ chối"
            )}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RejectModal;
