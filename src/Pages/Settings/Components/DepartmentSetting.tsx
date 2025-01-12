import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import CustomAntdTable from "../../../components/Tables/CustomAntdTable";
import ButtonDefault from "../../../components/Buttons/ButtonDefault";
import SelectGroupOne from "../../../components/FormElements/SelectGroup/SelectGroupOne";
import InputGroup from "../../../components/FormElements/InputGroup";
import { API } from "../../../api";
import { END_POINT } from "../../../api/UrlProvider";
import SwitcherTwo from "../../../components/FormElements/Switchers/SwitcherTwo";
import TextAreaCustom from "../../../components/FormElements/TextArea/TextAreaCustom";

interface User {
  key: string;
  sNo: number;
  userName: string;
  email: string;
  mobile: string;
  roll: string;
  assignTeamLeader: string;
  isActive: boolean;
  assignedTL?: string;
}

interface FormData {
  userName: string;
  email: string;
  mobile: string;
  password: string;
  isActive: string;
  userType: string;
  assignedTL: string;
}

export default function DepartmentSetting() {
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [teamLeads, setTeamLeads] = useState<
    { value: string; label: string }[]
  >([]);

  const initialFormState: FormData = {
    userName: "",
    email: "",
    mobile: "",
    password: "",
    isActive: "active",
    userType: "",
    assignedTL: "",
  };

  const [formData, setFormData] = useState<FormData>(initialFormState);

  const fetchUsers = async () => {
    try {
      const { data, error } = await API.getAuthAPI(END_POINT.USERS, true);
      if (error) throw new Error(error);

      const transformedData = data.map((user: any, index: number) => ({
        key: user._id,
        sNo: index + 1,
        userName: user.name,
        email: user.email,
        mobile: user.phone,
        roll: user.role,
        assignTeamLeader: user.assignedTL || "",
        isActive: user.isActive,
        assignedTL: user.assignedTL,
      }));

      setTableData(transformedData);

      // Set team leads
      const teamLeadsList = data
        .filter((user: any) => user.role === "Team Leader" && user.isActive)
        .map((lead: any) => ({
          value: lead._id,
          label: lead.name,
        }));
      setTeamLeads(teamLeadsList);
    } catch (error: any) {
      console.error(error.message || "Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const validateForm = () => {
    if (!formData.userName.trim()) {
      toast.error("Please enter user name");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter email");
      return false;
    }
    if (!formData.mobile.trim()) {
      toast.error("Please enter mobile number");
      return false;
    }
    if (!editingUser && !formData.password.trim()) {
      toast.error("Please enter password");
      return false;
    }
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (key: string) => {
    const user = tableData.find((user) => user.key === key);
    if (user) {
      setFormData({
        userName: user.userName,
        email: user.email,
        mobile: user.mobile,
        password: "", // Empty for edit mode
        isActive: user.isActive ? "active" : "inactive",
        userType: user.roll,
        assignedTL: user.assignedTL || "",
      });
      setEditingUser(key);
      setShowForm(true);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const basePayload = {
        name: formData.userName,
        email: formData.email,
        phone: formData.mobile,
        isActive: formData.isActive === "active",
        assignedTL:
          formData.userType === "Employee" ? formData.assignedTL || null : null,
      };

      if (editingUser) {
        // Update existing user
        const updatePayload = {
          ...basePayload,
          ...(formData.password && { password: formData.password }),
        };

        const { error } = await API.updateAuthAPI(
          updatePayload,
          editingUser,
          "updateDepartment",
          true
        );

        if (error) throw new Error(error);
        toast.success("User updated successfully");
      } else {
        // Create new user
        const createPayload = {
          ...basePayload,
          password: formData.password,
          role: formData.userType,
        };

        const { error } = await API.postAuthAPI(
          createPayload,
          END_POINT.USER_REGISTER,
          true
        );

        if (error) throw new Error(error);
        toast.success("User created successfully");
      }

      setFormData(initialFormState);
      setEditingUser(null);
      setShowForm(false);
      fetchUsers();
    } catch (error: any) {
      console.error(error.message || "Operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: boolean) => {
    try {
      const { error } = await API.updateAuthAPI(
        { isActive: status },
        id,
        "updateDepartment",
        true
      );

      if (error) throw new Error(error);

      toast.success(
        `User ${status ? "activated" : "deactivated"} successfully`
      );
      fetchUsers();
    } catch (error: any) {
      console.error(error.message || "Failed to update status");
    }
  };

  const columns = [
    {
      title: "S.No.",
      dataIndex: "sNo",
      key: "sNo",
      width: 80,
    },
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "Role",
      dataIndex: "roll",
      key: "roll",
    },
    {
      title: "Team Leader",
      dataIndex: "assignTeamLeader",
      key: "assignTeamLeader",
      render: (_: any, record: User) => {
        const lead = teamLeads.find((l) => l.value === record.assignedTL);
        return lead?.label || "-";
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: User) => (
        <div className="flex items-center gap-2">
          <SwitcherTwo
            id={record.key}
            defaultChecked={record.isActive}
            onChange={(id: string, checked: boolean) =>
              handleStatusChange(id, checked)
            }
          />
          <Button
            icon={<EditOutlined />}
            className="bg-primary text-white"
            onClick={() => handleEdit(record.key)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Department Management</h2>
        {!showForm && (
          <ButtonDefault
            label="Add New User"
            onClick={() => {
              setShowForm(true);
              setFormData(initialFormState);
              setEditingUser(null);
            }}
            icon={<PlusOutlined />}
          />
        )}
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <InputGroup
              label="User Name"
              name="userName"
              type="text"
              placeholder="Enter user name"
              value={formData.userName}
              onChange={handleInputChange}
              required
            />

            <InputGroup
              label="Email"
              name="email"
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <InputGroup
              label="Mobile"
              name="mobile"
              type="tel"
              placeholder="Enter mobile number"
              value={formData.mobile}
              onChange={handleInputChange}
              required
            />

            <InputGroup
              label="Password"
              name="password"
              type="password"
              placeholder={
                editingUser ? "Leave blank to keep unchanged" : "Enter password"
              }
              value={formData.password}
              onChange={handleInputChange}
              required={!editingUser}
            />

            <SelectGroupOne
              label="Status"
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
              selectedOption={formData.isActive}
              setSelectedOption={(value) =>
                handleSelectChange("isActive", value)
              }
            />

            {!editingUser && (
              <SelectGroupOne
                label="Role"
                options={[
                  { value: "Team Leader", label: "Team Leader" },
                  { value: "Employee", label: "Employee" },
                ]}
                selectedOption={formData.userType}
                setSelectedOption={(value) =>
                  handleSelectChange("userType", value)
                }
                required
              />
            )}

            {formData.userType === "Employee" && (
              <SelectGroupOne
                label="Assign Team Leader"
                options={teamLeads}
                selectedOption={formData.assignedTL}
                setSelectedOption={(value) =>
                  handleSelectChange("assignedTL", value)
                }
                placeholder="Select Team Leader"
              />
            )}
          </div>

          <div className="flex gap-3">
            <ButtonDefault
              label={
                isLoading ? "Processing..." : editingUser ? "Update" : "Add"
              }
              onClick={handleSubmit}
              disabled={isLoading}
            />
            <ButtonDefault
              label="Cancel"
              onClick={() => {
                setShowForm(false);
                setFormData(initialFormState);
                setEditingUser(null);
              }}
              variant="outline"
            />
          </div>
        </div>
      )}

      <CustomAntdTable
        columns={columns}
        dataSource={tableData}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
      />
    </div>
  );
}
