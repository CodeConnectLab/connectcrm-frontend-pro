import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import ButtonDefault from "../Buttons/ButtonDefault";

export default function DeleteConfirmModal({
  isDeleteModalOpen,
  selectedCount,
  setIsDeleteModalOpen,
  handleDeleteConfirm,
}: any) {
  return (
    <>
      <Modal
        title={null}
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        footer={null}
        width={400}
        className="delete-confirmation-modal"
        centered
      >
        <div className="flex flex-col items-center p-4 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
            <ExclamationCircleOutlined className="text-3xl text-red-500" />
          </div>

          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            Confirm Deletion
          </h3>

          <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to delete {selectedCount} selected lead
            {selectedCount !== 1 ? "s" : ""}? This action cannot be undone.
          </p>

          <div className="flex w-full gap-3">
            <ButtonDefault
              label="Cancel"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              customClasses="w-1/2"
            />
            <ButtonDefault
              label="Delete"
              variant="primary"
              onClick={handleDeleteConfirm}
              customClasses="w-1/2 !bg-red-500 hover:!bg-red-600"
            />
          </div>
        </div>
      </Modal>

      {/* Add custom styles */}
      <style>
        {`
          .delete-confirmation-modal .ant-modal-content {
            border-radius: 12px;
            overflow: hidden;
          }
          
          .dark .delete-confirmation-modal .ant-modal-content {
            background-color: #1f2937;
            border: 1px solid #374151;
          }
          
          .delete-confirmation-modal .ant-modal-close {
            color: #6B7280;
          }
          
          .dark .delete-confirmation-modal .ant-modal-close {
            color: #9CA3AF;
          }
          
          .delete-confirmation-modal .ant-modal-close:hover {
            background-color: #F3F4F6;
          }
          
          .dark .delete-confirmation-modal .ant-modal-close:hover {
            background-color: #374151;
          }
        `}
      </style>
    </>
  );
}
