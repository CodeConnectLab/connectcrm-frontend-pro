import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ButtonDefault from "../../components/Buttons/ButtonDefault";
import CheckboxTwo from "../../components/FormElements/Checkboxes/CheckboxTwo";
import AllDetailsFields from "../Components/AllDetailsFields";
import AdditionalInformation from "../Components/AdditionalInformation";
import AttachmentTab from "../Components/AttachmentTab";
import CustomAntdTable from "../../components/Tables/CustomAntdTable";
import DateTimePicker from "../../components/FormElements/DatePicker/DateTimePicker";
import SelectGroupOne from "../../components/FormElements/SelectGroup/SelectGroupOne";
import TabPanel from "../../components/TabPanel/TabPanel";
import LeadStatusUI from "../../components/CommonUI/LeadStatus/LeadStatus";
import { API } from "../../api";
import { getStoredAgents } from "../../api/commonAPI";
import MiniLoader from "../../components/CommonUI/Loader/MiniLoader";

interface LeadHistory {
  _id: string;
  COMMENTED_BY: string;
  DATE: string;
  STATUS: string;
  FOLLOWUP_DATE: string;
  COMMENT: string;
}

interface LeadData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  leadSource: { _id: string; name: string };
  productService: { _id: string; name: string };
  assignedAgent: { _id: string; name: string };
  leadStatus: { _id: string; name: string };
  followUpDate: string;
  description: string;
  fullAddress: string;
  website: string;
  companyName: string;
  country: string;
  state: string;
  city: string;
  pinCode: string;
  alternatePhone: string;
  leadCost: number;
  addCalender: boolean;
}

interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  leadSource: string;
  productService: string;
  assignedAgent: string;
  leadStatus: string;
  description: string;
  companyName: string;
  website: string;
  fullAddress: string;
  country: string;
  state: string;
  city: string;
  pinCode: string;
  alternatePhone: string;
  leadCost: number;
  comment: string;
  followUpDate?: string;
  addCalender?: boolean;
}

const LeadAction: React.FC = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const agendList = getStoredAgents(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [leadData, setLeadData] = useState<{
    lead: LeadData;
    history: LeadHistory[];
  } | null>(null);
  const [formData, setFormData] = useState({
    status: "",
    description: "",
    addToCalendar: false,
    followup: "",
    comment: "",
    assignedAgent: "",
    leadWonAmount: 0,
    leadLostReasonId: "",
  });

  const fetchLeadData = async () => {
    try {
      setIsLoading(true);
      const response = await API.getAuthAPI(`lead/${leadId}`, true);
      if (response.error || !response) return;

      const { leadDetails } = response?.data;
      setLeadData(leadDetails);

      setFormData({
        status: leadDetails?.lead?.leadStatus?._id,
        description: leadDetails?.lead?.description,
        addToCalendar: leadDetails?.lead?.addCalender,
        followup: leadDetails?.lead?.followUpDate,
        comment: leadDetails?.lead?.comment || "",
        assignedAgent: leadDetails?.lead?.assignedAgent?._id || "",
        leadWonAmount: leadDetails?.lead?.leadWonAmount || 0,
        leadLostReasonId: leadDetails?.lead?.leadLostReasonId || "",
      });
    } catch (error: any) {
      console.error(error.message || "Failed to fetch lead details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (leadId) {
      fetchLeadData();
    }
  }, [leadId]);

  const handleUpdateLead = async (updateData: Partial<LeadFormData>) => {
    try {
      setIsUpdating(true);

      const response = await API.updateAuthAPI(
        updateData,
        leadId!,
        "lead",
        true
      );

      if (response.error) return;

      toast.success(response.message || "Lead updated successfully");
      fetchLeadData(); // Refresh data after update
    } catch (error: any) {
      console.error(error.message || "Failed to update lead");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (_selectedDates: Date[], dateStr: string) => {
    setFormData((prev) => ({ ...prev, followup: dateStr }));
  };

  const handleCheckboxChange = ({
    value,
    isChecked,
  }: {
    value: string;
    isChecked: boolean;
  }) => {
    setFormData((prev) => ({ ...prev, [value]: isChecked }));
  };

  const handleMainFormSubmit = async () => {
    if (!formData.comment.trim()) {
      toast.error("Please add a comment");
      return;
    }

    const updateData = {
      leadStatus: formData.status,
      description: formData.description,
      addCalender: formData.addToCalendar,
      followUpDate: formData.followup,
      comment: formData.comment,
      assignedAgent: formData.assignedAgent,
      leadWonAmount: formData.leadWonAmount,
      leadLostReasonId: formData.leadLostReasonId || null,
    };

    await handleUpdateLead(updateData);
  };

  const historyColumns = [
    {
      title: "COMMENTED BY",
      dataIndex: "COMMENTED_BY",
      key: "COMMENTED_BY",
    },
    {
      title: "DATE",
      dataIndex: "DATE",
      key: "DATE",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "STATUS",
      dataIndex: "STATUS",
      key: "STATUS",
    },
    {
      title: "FOLLOWUP DATE",
      dataIndex: "FOLLOWUP_DATE",
      key: "FOLLOWUP_DATE",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "COMMENT",
      dataIndex: "COMMENT",
      key: "COMMENT",
    },
  ];

  const staticData = leadData?.lead
    ? [
        {
          fieldName: "Full Name",
          fieldNameValue: `${leadData.lead?.firstName} ${leadData.lead?.lastName}`,
        },
        {
          fieldName: "Email",
          fieldNameValue: leadData.lead?.email,
        },
        {
          fieldName: "Contact Number",
          fieldNameValue: leadData.lead?.contactNumber,
        },
        {
          fieldName: "Region",
          fieldNameValue: `${leadData.lead?.city}, ${leadData.lead?.state}`,
        },
        {
          fieldName: "Lead Source",
          fieldNameValue: leadData.lead?.leadSource?.name,
        },
        {
          fieldName: "Service",
          fieldNameValue: leadData.lead?.productService?.name,
        },
      ]
    : [];

  const tabsData = [
    {
      tabName: "History",
      component: (
        <CustomAntdTable
          columns={historyColumns}
          dataSource={leadData?.history || []}
        />
      ),
    },
    {
      tabName: "All Details",
      component: (
        <AllDetailsFields
          leadData={leadData?.lead}
          onUpdate={handleUpdateLead}
          leadStatus={formData.status}
        />
      ),
    },
    {
      tabName: "Additional Information",
      component: (
        <AdditionalInformation
          leadData={leadData?.lead}
          onUpdate={handleUpdateLead}
          leadStatus={formData.status}
        />
      ),
    },
    {
      tabName: "Geo-Location Record",
      component: <AttachmentTab />,
    },
  ];

  if (isLoading) {
    return <MiniLoader />;
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-dark">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-dark dark:text-white">
          Basic Details
        </h2>
      </div>

      <div className="mb-8 flex w-full flex-col justify-between gap-4 sm:flex-row sm:gap-8">
        <div className="flex w-full flex-col gap-4 border-r-0 pr-0 text-dark dark:text-white sm:border-r-2 sm:pr-8">
          {staticData?.map((item) => (
            <div
              key={item.fieldName}
              className="flex w-full items-center border-b-2 border-solid border-gray py-2"
            >
              <span className="w-[220px] text-lg font-medium">
                {item.fieldName}
              </span>
              <span className="text-base">{item.fieldNameValue}</span>
            </div>
          ))}
          <SelectGroupOne
            label="Agent Name"
            options={agendList}
            selectedOption={leadData?.lead?.assignedAgent?._id || ""}
            setSelectedOption={(value) =>
              handleSelectChange("assignedAgent", value)
            }
          />
        </div>

        <div className="flex w-full flex-col gap-4">
          <LeadStatusUI
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            formData={formData}
            defaultValue={formData.status}
            value={formData.status}
            lostReasonValue={formData.leadLostReasonId}
          />

          <DateTimePicker
            label="Followup"
            onChange={handleDateChange}
            defaultValue={formData.followup}
            enableTime
          />

          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Notes about Lead"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              rows={2}
            />
          </div>

          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              Comment
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              placeholder="Add your comment"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              rows={2}
            />
          </div>

          <div className="flex items-center">
            <CheckboxTwo
              label="Add to Calendar"
              onChange={handleCheckboxChange}
              checked={formData.addToCalendar}
              id="addToCalendar"
            />
          </div>
        </div>
      </div>

      <div className="flex w-full justify-center">
        <ButtonDefault
          onClick={handleMainFormSubmit}
          label={isUpdating ? "Updating..." : "Update Lead"}
          variant="primary"
          disabled={isUpdating}
        />
      </div>

      <TabPanel
        tabsData={tabsData}
        type="card"
        defaultActiveKey="1"
        customClassName="mt-6"
      />
    </div>
  );
};

export default LeadAction;
