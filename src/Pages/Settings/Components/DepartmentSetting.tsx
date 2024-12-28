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
import Heading from "../../../components/CommonUI/Heading";

interface ApiUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  isActive: boolean;
  deleted: boolean;
  createdAt: string;
  assignedTL?: string;
}

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
  userType: string | number;
  assignedTL?: string;
}

export default function DepartmentSetting() {
  const [isLoading, setIsLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
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
      setTableLoading(true);
      const { data, error } = await API.getAuthAPI(END_POINT.USERS, true);
      if (error) throw new Error(error);

      // Transform data for table
      const transformedData: User[] = data.map(
        (user: ApiUser, index: number) => ({
          key: user._id,
          sNo: index + 1,
          userName: user.name,
          email: user.email,
          mobile: user.phone,
          roll: user.role,
          assignTeamLeader: user.assignedTL || "",
          isActive: user.isActive,
          assignedTL: user.assignedTL,
        })
      );
      setTableData(transformedData);

      // Filter and set team leads
      const teamLeadsList = data
        .filter((user: ApiUser) => user.role === "Team Leader" && user.isActive)
        .map((lead: ApiUser) => ({
          value: lead._id,
          label: lead.name,
        }));
      setTeamLeads(teamLeadsList);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const validateForm = () => {
    if (!formData.userName.trim()) return toast.error("Please enter user name");
    if (!formData.email.trim()) return toast.error("Please enter email");
    if (!formData.mobile.trim())
      return toast.error("Please enter mobile number");
    if (!editingUser && !formData.password.trim())
      return toast.error("Please enter password");
    if (!formData.userType) return toast.error("Please select user type");
    if (formData.userType.toString() === "Employee" && !formData.assignedTL) {
      return toast.error("Please select a team lead");
    }
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | number) => {
    if (name === "userType" && value.toString() !== "Employee") {
      setFormData((prev) => ({ ...prev, [name]: value, assignedTL: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const payload = {
        name: formData.userName,
        email: formData.email,
        phone: formData.mobile,
        password: formData.password,
        role: formData.userType,
        assignedTL: formData.assignedTL,
      };

      if (editingUser) {
        const { error } = await API.updateAuthAPI(
          payload,
          editingUser,
          END_POINT.USERS,
          true
        );
        if (error) throw Error(error);
        toast.success("User updated successfully!");
      } else {
        const { error } = await API.postAuthAPI(
          payload,
          END_POINT.USER_REGISTER,
          true
        );
        if (error) throw Error(error);
        toast.success("User registered successfully!");
      }

      setFormData(initialFormState);
      setEditingUser(null);
      setShowForm(false);
      fetchUsers();
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (key: string) => {
    const user = tableData.find((user) => user.key === key);
    if (user) {
      setFormData({
        userName: user.userName,
        email: user.email,
        mobile: user.mobile,
        password: "",
        isActive: user.isActive ? "active" : "inactive",
        userType: user.roll,
        assignedTL: user.assignedTL || "",
      });
      setEditingUser(key);
      setShowForm(true);
    }
  };

  const handleStatusChange = async (id: string, status: boolean) => {
    try {
      const { error } = await API.updateAuthAPI(
        { isActive: status },
        id,
        END_POINT.USERS,
        true
      );
      if (error) throw new Error(error);
      toast.success(
        `User ${status ? "activated" : "deactivated"} successfully`
      );
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const columns = [
    {
      title: "S.No.",
      dataIndex: "sNo",
      key: "sNo",
      sorter: (a: User, b: User) => a.sNo - b.sNo,
    },
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
      sorter: (a: User, b: User) => a.userName.localeCompare(b.userName),
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
      render: (teamLead: string, record: User) => {
        const lead = teamLeads.find((l) => l.value === record.assignedTL);
        return lead ? lead.label : "-";
      },
    },
    {
      title: "Action",
      dataIndex: "key",
      key: "action",
      render: (key: string, record: User) => (
        <div className="flex justify-start items-center gap-2">
          <SwitcherTwo
            id={key}
            defaultChecked={record.isActive}
            onChange={(checked: boolean) => handleStatusChange(key, checked)}
          />
          <Button
            icon={<EditOutlined />}
            className="bg-primary text-white"
            onClick={() => handleEdit(key)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col justify-start items-start mb-4">
        <div className="w-full">
          <Heading title="Manage Your Department" />
        </div>
        {!showForm && (
          <ButtonDefault
            label={showForm ? "Hide Form" : "Add New User"}
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) {
                setFormData(initialFormState);
                setEditingUser(null);
              }
            }}
            icon={<PlusOutlined />}
          />
        )}
      </div>

      {showForm && (
        <>
          <div className="mb-4 grid grid-cols-4 gap-4">
            <InputGroup
              label="User Name"
              name="userName"
              type="text"
              placeholder="User Name"
              value={formData.userName}
              onChange={handleInputChange}
            />
            <InputGroup
              label="Email"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <InputGroup
              label="Mobile"
              name="mobile"
              type="text"
              placeholder="Mobile"
              value={formData.mobile}
              onChange={handleInputChange}
            />
            <InputGroup
              label="Password"
              name="password"
              type="password"
              placeholder={
                editingUser ? "Leave blank to keep unchanged" : "Password"
              }
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4 grid grid-cols-3 gap-4">
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
            <SelectGroupOne
              label="User Role"
              options={[
                { value: "Team Leader", label: "Team Leader" },
                { value: "Employee", label: "Employee" },
              ]}
              placeholder="Select User Role"
              selectedOption={formData.userType}
              setSelectedOption={(value) =>
                handleSelectChange("userType", value)
              }
            />
            {formData.userType === "Employee" && (
              <SelectGroupOne
                label="Assign Team Leader (TL)"
                options={teamLeads}
                placeholder={
                  teamLeads.length
                    ? "Select Team Leader"
                    : "No team leaders available"
                }
                selectedOption={formData.assignedTL}
                setSelectedOption={(value) =>
                  handleSelectChange("assignedTL", value)
                }
                disabled={!teamLeads.length}
              />
            )}
          </div>

          <div className="flex gap-3 mb-4">
            <ButtonDefault
              label={
                isLoading ? "Processing..." : editingUser ? "Update" : "Add"
              }
              onClick={handleAdd}
              disabled={isLoading}
            />
            <ButtonDefault
              label={"Cancel"}
              onClick={() => {
                setShowForm(!showForm);
              }}
              disabled={isLoading}
            />
          </div>
        </>
      )}

      <CustomAntdTable
        columns={columns}
        dataSource={tableData}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        className="w-full"
        loading={tableLoading}
      />
    </div>
  );
}
