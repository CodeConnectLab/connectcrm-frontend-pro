import { useState, useEffect, useCallback } from "react";
import { Button, Tooltip } from "antd";
import { EditFilled } from "@ant-design/icons";
import CustomAntdTable from "../../components/Tables/CustomAntdTable";
import CheckboxTwo from "../../components/FormElements/Checkboxes/CheckboxTwo";
import LeadsTableHeader from "./LeadsTableHeader";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../../api";
import { END_POINT } from "../../api/UrlProvider";
import { debounce } from "lodash";
import QuickEditModal from "../../components/Modals/QuickEdit";
import { toast } from "react-toastify";

interface Lead {
  key: string;
  name: string;
  number: string;
  leadSource: string;
  agent: string;
  status: string;
  service: string;
  leadWonAmount: number;
  addCalender: boolean;
  followUpDate: any;
  statusData: any;
  leadLostReasonId: string;
  comment: string;
}

interface APILead {
  _id: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  leadSource: { name: string } | null;
  assignedAgent: { name: string } | null;
  leadStatus: { name: string } | null;
  productService: { name: string } | null;
  leadWonAmount: number;
  addCalender: boolean;
  followUpDate: any;
  leadLostReasonId: string;
  comment: string;
}

const AllLeads = ({ derivativeEndpoint = "" }) => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<any>({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const transformLeadData = (apiLeads: APILead[]): Lead[] => {
    return apiLeads.map((lead) => ({
      key: lead?._id,
      name: `${lead?.firstName} ${lead?.lastName}`.trim(),
      number: lead?.contactNumber,
      leadSource: lead?.leadSource?.name || "-",
      agent: lead?.assignedAgent?.name || "-",
      status: lead?.leadStatus?.name || "-",
      service: lead?.productService?.name || "-",
      statusData: lead?.leadStatus || {},
      leadWonAmount: lead?.leadWonAmount,
      addCalender: lead?.addCalender,
      followUpDate: new Date(lead?.followUpDate),
      leadLostReasonId: lead.leadLostReasonId,
      comment: lead.comment,
    }));
  };

  const handleQuickUpdate = async (updateData: any) => {
    if (!selectedLead) return;

    try {
      setIsUpdating(true);
      const response = await API.updateAuthAPI(
        updateData,
        selectedLead.key,
        "lead",
        true
      );

      if (response.error) return;
      toast.success("Lead updated successfully");
      setIsQuickEditOpen(false);
      fetchLeads(); // Refresh the leads list
    } catch (error: any) {
      console.error(error.message || "Failed to update lead");
    } finally {
      setIsUpdating(false);
    }
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        search: debouncedSearchTerm,
        ...advancedFilters,
      };

      const { data, error, options } = await API.getAuthAPI(
        `${END_POINT.LEADS_DATA}${derivativeEndpoint}`,
        true,
        params
      );

      if (error) throw new Error(error);

      const transformedLeads = transformLeadData(data);
      setLeads(transformedLeads);
      setPagination({
        ...pagination,
        total: options?.pagination?.total,
      });
    } catch (error: any) {
      console.error(error.message || "Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [
    pagination.current,
    pagination.pageSize,
    debouncedSearchTerm,
    advancedFilters,
  ]);

  const handleAdvancedFilter = useCallback((filters: any) => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    setAdvancedFilters(filters);
  }, []);

  const handleResetFilters = useCallback(() => {
    setAdvancedFilters({});
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleTableChange = (page: number, pageSize: number) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize,
    });
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
      setPagination({ ...pagination, current: 1 });
    }, 500),
    []
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Handle select all checkbox
  const handleSelectAll = ({ isChecked }: { isChecked: boolean }) => {
    if (isChecked) {
      const visibleKeys = leads.map((lead) => lead.key);
      setSelectedRowKeys((prevSelected) => {
        const uniqueKeys = new Set([...prevSelected, ...visibleKeys]);
        return Array.from(uniqueKeys);
      });
    } else {
      const visibleKeys = new Set(leads.map((lead) => lead.key));
      setSelectedRowKeys((prevSelected) =>
        prevSelected.filter((key) => !visibleKeys.has(key))
      );
    }
  };

  const handleBulkUpdate = async (data: {
    agentId?: string;
    statusId?: string;
  }) => {
    if (selectedRowKeys.length === 0) return;

    try {
      const payload = {
        leadIds: selectedRowKeys,
        ...(data.agentId && { assignedAgent: data.agentId }),
        ...(data.statusId && { leadStatus: data.statusId }),
      };

      const { data: response, error } = await API.updateAuthAPI(
        payload,
        "",
        END_POINT.BULK_UPDATE,
        true
      );

      if (error) throw new Error(error);

      toast.success(
        response.message ||
          `Successfully updated ${response.modifiedCount} leads`
      );

      // Reset selected rows and refresh data
      setSelectedRowKeys([]);
      fetchLeads();
    } catch (error: any) {
      console.error(error.message || "Failed to update leads");
    }
  };

  const handleDelete = async () => {
    if (selectedRowKeys.length === 0) {
      toast.error("Select alteast one lead.");
      return;
    }

    try {
      const payload = {
        leadIds: selectedRowKeys,
      };

      const { data: response, error } = await API.DeleteAuthAPI(
        "",
        END_POINT.BULK_DELETE,
        true,
        payload
      );

      if (error) throw new Error(error);
      // handleTableChange(1, 10);
      toast.success(
        response.message ||
          `Successfully updated ${response.modifiedCount} leads`
      );

      // Reset selected rows and refresh data
      setSelectedRowKeys([]);
      fetchLeads();
    } catch (error: any) {
      console.error(error.message || "Failed to update leads");
    }
  };

  const areAllVisibleRowsSelected = () => {
    if (leads.length === 0) return false;
    return leads.every((lead) => selectedRowKeys.includes(lead.key));
  };

  const columns = [
    {
      title: (
        <div>
          <CheckboxTwo
            id="selectAllLeads"
            onChange={handleSelectAll}
            checked={areAllVisibleRowsSelected()}
            // name="selectAllLeads"
          />
        </div>
      ),
      dataIndex: "key",
      key: "checkbox",
      render: (key: string) => (
        <div>
          <CheckboxTwo
            id={key}
            onChange={({ value: checkboxValue, isChecked }) =>
              rowSelection({ value: checkboxValue, isChecked })
            }
            checked={selectedRowKeys.includes(key)}
            // name={`checkbox-${key}`}
          />
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Number",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Lead Source",
      dataIndex: "leadSource",
      key: "leadSource",
      minWidth: 123,
    },
    {
      title: "Agent",
      dataIndex: "agent",
      key: "agent",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "Action",
      key: "action",
      render: (record: any) => {
        return (
          <div className="flex space-x-2">
            <Link to={`/leads/${record.key}`}>
              <Button
                icon={<EditFilled />}
                className="bg-transparent text-primary dark:text-blue-400"
              />
            </Link>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedLead(record);
                setIsQuickEditOpen(true);
              }}
              className="bg-primary text-white hover:bg-primary/90"
            >
              Quick Edit
            </Button>
            {record?.statusData?.name && (
              <Tooltip title={`Stands for : ${record?.statusData?.name}`}>
                <Button
                  icon={record?.statusData?.name[0]}
                  className={`text-sm font-semibold text-white`}
                  style={{
                    background: record?.statusData?.color
                      ? record?.statusData?.color
                      : "green",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLead(record);
                    setIsQuickEditOpen(true);
                  }}
                />
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  const rowSelection = ({
    value,
    isChecked,
  }: {
    value: string;
    isChecked: boolean;
  }) => {
    if (isChecked) {
      setSelectedRowKeys((prev) => [...prev, value]);
    } else {
      setSelectedRowKeys((prev) => prev.filter((key) => key !== value));
    }
  };

  const handleRowClick = (record: any) => {
    navigate(`/leads/${record.key}`);
  };

  useEffect(() => {
    console.log("Selected rows:", selectedRowKeys);
  }, [selectedRowKeys]);

  return (
    <div className="space-y-4">
      <LeadsTableHeader
        handleSearch={handleSearch}
        searchTerm={searchTerm}
        selectedCount={selectedRowKeys.length}
        onBulkUpdate={handleBulkUpdate}
        disabled={loading}
        handleDelete={handleDelete}
        onAdvancedFilter={handleAdvancedFilter}
        onResetFilters={handleResetFilters}
        loading={loading}
      />

      <CustomAntdTable
        columns={columns}
        dataSource={leads}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: handleTableChange,
          pageSizeOptions: ["10", "20", "50", "100"],
          showSizeChanger: true,
        }}
        isLoading={loading}
        onRow={(record: any) => ({ onClick: () => handleRowClick(record) })}
      />

      {selectedLead && (
        <QuickEditModal
          isOpen={isQuickEditOpen}
          onClose={() => {
            setIsQuickEditOpen(false);
            setSelectedLead(null);
          }}
          onSubmit={handleQuickUpdate}
          initialData={{
            id: selectedLead.key,
            status: selectedLead.statusData?._id || "",
            followUpDate: selectedLead.followUpDate,
            leadWonAmount: selectedLead.leadWonAmount,
            addCalender: selectedLead.addCalender,
            leadLostReasonId: selectedLead.leadLostReasonId, // You might want to get this from your lead data
            comment: selectedLead.comment, // You might want to get this from your lead data
            leadName: selectedLead.name,
          }}
          isLoading={isUpdating}
        />
      )}
    </div>
  );
};

export default AllLeads;
