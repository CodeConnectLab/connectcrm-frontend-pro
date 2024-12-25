import React, { useState } from "react";
import { toast } from "react-toastify";
import SelectGroupOne from "../../components/FormElements/SelectGroup/SelectGroupOne";
import ButtonDefault from "../../components/Buttons/ButtonDefault";
import { SearchOutlined } from "@ant-design/icons";
import AdvanceFilterUI from "../Components/AdvanceFilterUI";
import useScreenHook from "../../hooks/useScreenHook";
import SearchForm from "../../components/Header/SearchForm";
import { getStoredAgents, getStoredStatus } from "../../api/commonAPI";
import { Modal } from "antd";
import DeleteConfirmModal from "../../components/Modals/DeleteConfirmModal";

interface LeadsTableHeaderProps {
  handleSearch: (value: string) => void;
  searchTerm: string;
  selectedCount: number;
  onBulkUpdate: (data: {
    agentId?: string;
    statusId?: string;
  }) => Promise<void>;
  disabled?: boolean;
  handleDelete: () => void;
  onAdvancedFilter: (filters: any) => void;
  onResetFilters: () => void;
  loading?: boolean;
}

export default function LeadsTableHeader({
  handleSearch,
  searchTerm,
  selectedCount = 0,
  onBulkUpdate,
  disabled = false,
  handleDelete,
  onAdvancedFilter,
  onResetFilters,
  loading = false,
}: LeadsTableHeaderProps) {
  // Get stored data
  const statusList = getStoredStatus(true);
  const agentList = getStoredAgents(true);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [isAdvanceFilterEnable, setIsAdvanceFilterEnable] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Hooks
  const { deviceType } = useScreenHook();

  const showDeleteConfirmation = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setIsDeleteModalOpen(false);
    handleDelete();
  };

  const handleSubmit = async () => {
    if (!selectedStatus && !selectedAgent) {
      toast.error("Please select either status or agent");
      return;
    }

    if (selectedCount === 0) {
      toast.error("Please select at least one lead");
      return;
    }

    try {
      setIsLoading(true);
      await onBulkUpdate({
        agentId: selectedAgent || undefined,
        statusId: selectedStatus || undefined,
      });

      // Reset selections after successful update
      setSelectedStatus("");
      setSelectedAgent("");
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsLoading(false);
    }
  };

  const deleteButtons = (
    <ButtonDefault
      label="Delete"
      variant="outline"
      customClasses="bg-red-500 text-white"
      disabled={selectedCount === 0}
      onClick={showDeleteConfirmation}
    />
  );

  const renderMobileView = () => {
    return (
      <>
        <div className="mb-3 flex flex-row gap-2">
          <div className="w-full">
            <SearchForm
              customClasses="border-stroke-dark"
              onSearch={handleSearch}
              searchTerm={searchTerm}
              placeholder="Search leads..."
            />
          </div>
          <div className="w-[30%]">
            <ButtonDefault
              label="Advance Filter"
              variant="outline"
              onClick={() => setIsAdvanceFilterEnable(!isAdvanceFilterEnable)}
            />
          </div>
        </div>
        {isAdvanceFilterEnable && (
          <AdvanceFilterUI
            onFilter={onAdvancedFilter}
            onReset={onResetFilters}
            loading={loading}
          />
        )}

        {selectedCount > 0 && (
          <div className="mb-4 flex flex-col gap-2">
            <span className="text-center text-sm font-medium text-dark dark:text-white">
              Bulk Action on {selectedCount} selected rows
            </span>
            <div className="flex flex-col gap-2">
              <SelectGroupOne
                options={statusList}
                placeholder="Select Status"
                setSelectedOption={setSelectedStatus}
                selectedOption={selectedStatus}
                disabled={disabled || isLoading}
              />
              <SelectGroupOne
                options={agentList}
                placeholder="Select Employee"
                setSelectedOption={setSelectedAgent}
                selectedOption={selectedAgent}
                disabled={disabled || isLoading}
              />
              <ButtonDefault
                label={isLoading ? "Updating..." : "Update Selected"}
                variant="primary"
                onClick={handleSubmit}
                disabled={disabled || isLoading}
                fullWidth
              />
            </div>
          </div>
        )}
        <div className="mb-4 flex justify-center gap-2">
          <ButtonDefault
            label="Export PDF"
            variant="outline"
            customClasses="bg-black text-white"
          />
          <ButtonDefault
            label="Export Excel"
            variant="outline"
            customClasses="bg-black text-white"
          />
          {deleteButtons}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="mb-4 hidden justify-between sm:flex">
        <div className="hidden flex-col items-center justify-center gap-3 rounded-md border border-stroke bg-white px-6.5 py-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:flex min-w-[530px]">
          <span className="text-base font-medium text-dark dark:text-white">
            Bulk Action{" "}
            {selectedCount ? `on ${selectedCount} selected rows` : null}
          </span>
          <div className="flex gap-2 w-full">
            <SelectGroupOne
              options={statusList}
              placeholder="Select Status"
              setSelectedOption={setSelectedStatus}
              selectedOption={selectedStatus}
              wrapperClasses="w-full"
              disabled={disabled || isLoading}
            />
            <SelectGroupOne
              options={agentList}
              placeholder="Select Employee"
              setSelectedOption={setSelectedAgent}
              selectedOption={selectedAgent}
              wrapperClasses="w-full"
              disabled={disabled || isLoading}
            />
            <ButtonDefault
              label={isLoading ? "Updating..." : "Submit"}
              variant="primary"
              onClick={handleSubmit}
              disabled={disabled || isLoading || selectedCount === 0}
            />
          </div>
        </div>
        <div className="hidden flex-col gap-2 sm:flex">
          <ButtonDefault
            icon={<SearchOutlined />}
            label="Advance Filter"
            variant="outline"
            onClick={() => setIsAdvanceFilterEnable(!isAdvanceFilterEnable)}
            fullWidth
          />
          <div className="flex gap-2">
            <ButtonDefault
              mode="link"
              link="/import"
              label="↓ Import"
              variant="outline"
            />
            <ButtonDefault
              mode="link"
              link="/leads/add"
              label="+ Add Lead"
              variant="outline"
            />
          </div>
        </div>
      </div>

      {isAdvanceFilterEnable && deviceType !== "mobile" && (
        <AdvanceFilterUI
          onFilter={onAdvancedFilter}
          onReset={onResetFilters}
          loading={loading}
        />
      )}
      <div className="mb-4 hidden justify-between sm:flex">
        <div className="w-full">
          <SearchForm
            customClasses="border-stroke-dark"
            onSearch={handleSearch}
            searchTerm={searchTerm}
            placeholder="Search leads..."
          />
        </div>
        <div className="flex space-x-2">
          <ButtonDefault
            label="Export PDF"
            variant="outline"
            customClasses="bg-black text-white"
          />
          <ButtonDefault
            label="Export Excel"
            variant="outline"
            customClasses="bg-black text-white"
          />
          {deleteButtons}
        </div>
      </div>

      {deviceType === "mobile" && renderMobileView()}
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        selectedCount={selectedCount}
        handleDeleteConfirm={handleDeleteConfirm}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        isDeleteModalOpen={isDeleteModalOpen}
      />
    </>
  );
}
