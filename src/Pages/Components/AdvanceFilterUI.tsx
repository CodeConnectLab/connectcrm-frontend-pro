import React from "react";
import SelectGroupOne from "../../components/FormElements/SelectGroup/SelectGroupOne";
import ButtonDefault from "../../components/Buttons/ButtonDefault";
import {
  getStoredAgents,
  getStoredProductsServices,
  getStoredSources,
  getStoredStatus,
} from "../../api/commonAPI";
import dayjs from "dayjs";
import AntDateTimePicker from "../../components/FormElements/DatePicker/AntDateTimePicker";

interface AdvanceFilterUIProps {
  onFilter: (filters: {
    leadStatus?: string;
    assignedAgent?: string;
    productService?: string;
    leadSource?: string;
    startDate?: string;
    endDate?: string;
  }) => void;
  onReset: () => void;
  loading?: boolean;
}

const AdvanceFilterUI: React.FC<AdvanceFilterUIProps> = ({
  onFilter,
  onReset,
  loading = false,
}) => {
  const agentList = getStoredAgents(true);
  const serviceList = getStoredProductsServices(true);
  const sourceList = getStoredSources(true);
  const statusList = getStoredStatus(true);

  const [filters, setFilters] = React.useState({
    leadStatus: "",
    assignedAgent: "",
    productService: "",
    leadSource: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (name: string) => (_: Date[], dateStr: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: dateStr,
    }));
  };

  const handleSubmit = () => {
    const validFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value) {
        if (key === "startDate" || key === "endDate") {
          acc[key] = dayjs(value).format("YYYY-MM-DD");
        } else {
          acc[key] = value;
        }
      }
      return acc;
    }, {} as any);

    onFilter(validFilters);
  };

  const handleReset = () => {
    setFilters({
      leadStatus: "",
      assignedAgent: "",
      productService: "",
      leadSource: "",
      startDate: "",
      endDate: "",
    });
    onReset();
  };

  return (
    <div className="rounded-lg bg-white p-6 mb-4 shadow-md dark:bg-gray-800">
      <div className="mb-4 grid sm:grid-cols-6 grid-cols-2 gap-4">
        <SelectGroupOne
          label="Select Status"
          placeholder="Select Status"
          options={statusList}
          selectedOption={filters.leadStatus}
          setSelectedOption={(value) => handleChange("leadStatus", value)}
          allowClear
        />
        <SelectGroupOne
          label="Select Employee"
          placeholder="Select Employee"
          options={agentList}
          selectedOption={filters.assignedAgent}
          setSelectedOption={(value) => handleChange("assignedAgent", value)}
          allowClear
        />
        <SelectGroupOne
          label="Select Product and Service"
          placeholder="Select Product and Service"
          options={serviceList}
          selectedOption={filters.productService}
          setSelectedOption={(value) => handleChange("productService", value)}
          allowClear
        />
        <SelectGroupOne
          label="Select Source"
          placeholder="Select Source"
          options={sourceList}
          selectedOption={filters.leadSource}
          setSelectedOption={(value) => handleChange("leadSource", value)}
          allowClear
        />
        <AntDateTimePicker
          label="Start Date"
          onChange={handleDateChange("startDate")}
          defaultValue={filters.startDate}
        />
        <AntDateTimePicker
          label="End Date"
          onChange={handleDateChange("endDate")}
          defaultValue={filters.endDate}
        />
      </div>
      <div className="w-full flex justify-center gap-4">
        <ButtonDefault
          label={loading ? "Filtering..." : "Apply Filters"}
          onClick={handleSubmit}
          variant="primary"
          customClasses="bg-blue-500 text-white w-full"
          disabled={loading}
        />
        <ButtonDefault
          label="Reset"
          onClick={handleReset}
          variant="secondary"
          customClasses="bg-black text-white w-full"
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default React.memo(AdvanceFilterUI);
