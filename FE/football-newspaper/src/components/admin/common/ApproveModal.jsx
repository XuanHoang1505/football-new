import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ApproveModal = ({ show, onConfirm, onClose, isLoading }) => {
  const [publishNow, setPublishNow] = useState(true);
  const [publishDate, setPublishDate] = useState("");

  const handleConfirm = () => {
    onConfirm({
      publishNow,
      publishDate: publishNow ? null : publishDate,
    });
    handleReset();
  };

  const handleReset = () => {
    setPublishNow(true);
    setPublishDate("");
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Body className="px-4 py-4">
        {/* Icon + tiêu đề */}
        <div className="text-center mb-3">
          <i
            className="bi bi-check-circle text-success"
            style={{ fontSize: "60px" }}
          ></i>
          <h4 className="mt-3 mb-2">Duyệt bài viết</h4>
          <p className="text-muted mb-0">Chọn cách xuất bản cho bài viết này</p>
        </div>

        {/* Form chọn cách xuất bản */}
        <Form>
          <Form.Check
            type="radio"
            id="publish-now"
            label="Xuất bản ngay"
            checked={publishNow}
            onChange={() => setPublishNow(true)}
            className="mb-4"
          />
          <Form.Check
            type="radio"
            id="publish-schedule"
            label="Hẹn giờ xuất bản"
            checked={!publishNow}
            onChange={() => setPublishNow(false)}
            className="mb-2"
          />
          {!publishNow && (
            <Form.Control
              type="datetime-local"
              min={Date.now()}
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
            />
          )}
        </Form>

        {/* Nút hành động */}
        <div className="d-flex justify-content-end mt-4">
          <Button
            variant="secondary"
            className="me-2 px-4"
            onClick={() => {
              onClose()
              handleReset();
            }}
          >
            Hủy
          </Button>
          <Button
            variant="success"
            className="px-4"
            onClick={handleConfirm}
            disabled={isLoading || (!publishNow && !publishDate)}
          >
            {isLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              "Duyệt"
            )}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ApproveModal;
