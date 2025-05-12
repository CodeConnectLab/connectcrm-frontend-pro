import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker, Button, Card, Row, Col, Typography, InputNumber } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useProductAndService } from '../../CustomHooks/useProductAndService';
import { API } from '../../api';
import { END_POINT } from '../../api/UrlProvider';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Roles hierarchy for reference
const roleHierarchy = {
  "Employee": "Team Leader",
  "Team Leader": "AGM",
  "AGM": "GM",
  "GM": "AVP",
  "AVP": "VP",
  "VP": "AS",
  "AS": "Vertical"
};

// Define user interface
interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  [key: string]: string | boolean | undefined;
}

interface BookingFormValues {
  chooseName: string;
  projectName: string;
  email: string;
  rm: string;
  contactName: string;
  unit: string;
  bookingDate: string;
  size: string;
  employee: string;
  avp: string;
  tlcp: string;
  vp: string;
  agm: string;
  as: string;
  gm: string;
  vertical: string;
  bsp: number;
  paymentReceived: number;
  gst: number;
  nextPayment: number;
  otherCharges: number;
  paymentToDev: number;
  tsp: number;
  totalRevenue: number;
  netRevenue: number;
  remark: string;
}

const AddBooking: React.FC = () => {
  const [form] = Form.useForm<BookingFormValues>();
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [netRevenue, setNetRevenue] = useState<number>(0);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [usersByRole, setUsersByRole] = useState<{
    [role: string]: { value: string; label: string }[];
  }>({});

  // Sample options for dropdowns
  const { 
    optionList,
    fetchProductServices,
  } = useProductAndService(true);
  
  const calculateTotalRevenue = () => {
    const bsp = form.getFieldValue('bsp') || 0;
    const gst = form.getFieldValue('gst') || 0;
    const otherCharges = form.getFieldValue('otherCharges') || 0;
    const tsp = form.getFieldValue('tsp') || 0;
    
    const total = bsp + gst + otherCharges + tsp;
    setTotalRevenue(total);
    
    // Calculate net revenue (simple calculation for demonstration)
    setNetRevenue(total * 0.9); // Assuming 10% deduction for simplicity
    
    form.setFieldsValue({
      totalRevenue: total,
      netRevenue: total * 0.9
    });
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await API.getAuthAPI(END_POINT.USERS, true);
      if (error) throw new Error(error);

      // Group users by their role
      const usersByRoleMap: { [role: string]: { value: string; label: string }[] } = {};
      
      // Get all roles including Vertical
      const roles = [...Object.keys(roleHierarchy), "Vertical"];
      
      // Initialize empty arrays for each role
      roles.forEach(role => {
        usersByRoleMap[role] = [];
      });
      
      // Populate users for each role
      data.forEach((user: User) => {
        if (user.isActive && user.role) {
          usersByRoleMap[user.role] = [
            ...(usersByRoleMap[user.role] || []),
            {
              value: user._id,
              label: user.name
            }
          ];
        }
      });
      
      setUsersByRole(usersByRoleMap);
    } catch (error: unknown) {
      const err = error as Error;
      console.error(err.message || "Failed to fetch users");
    }
  };

  // Handle selection of employee in the Reference section
  const handleEmployeeSelect = (value: string, role: string) => {
    // Set the selected role to control which other selects are enabled
    setSelectedRole(role);
    
    // Convert role name to corresponding form field name
    const roleToFieldMap: {[key: string]: keyof BookingFormValues} = {
      "Employee": "employee",
      "Team Leader": "tlcp",
      "AGM": "agm",
      "GM": "gm",
      "AVP": "avp",
      "VP": "vp",
      "AS": "as",
      "Vertical": "vertical"
    };
    
    // Update the form value for the selected role
    const fieldName = roleToFieldMap[role];
    if (fieldName) {
      form.setFieldsValue({
        [fieldName]: value
      });
    }
  };

  // Check if a select should be disabled based on role hierarchy
  const shouldDisableSelect = (role: string): boolean => {
    if (!selectedRole) return false;
    
    // If no role is selected, or the role in hierarchy is higher than or equal to the selected role
    // Create a map of role positions in the hierarchy for comparison
    const roleOrder: { [role: string]: number } = {};
    const allRoles = ["Employee", ...Object.values(roleHierarchy)];
    
    allRoles.forEach((role, index) => {
      roleOrder[role] = index;
    });
    
    // If selectedRole is higher in hierarchy (smaller index) than current role, disable it
    return roleOrder[selectedRole] > roleOrder[role];
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onFinish = (values: BookingFormValues) => {
    console.log('Form values:', values);
    // Handle form submission here
  };

  const onFieldsChange = () => {
    calculateTotalRevenue();
  };

  useEffect(()=>{
    fetchProductServices()
  },[fetchProductServices])
  
  return (
    <div className="min-h-screen dark:bg-gray-800">
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFieldsChange={onFieldsChange}
        className="rounded-lg"
      >
        {/* Basic Detail Section */}
        <Card className="mb-6 dark:bg-gray-700 dark:border-gray-600" title={<Title level={4} className="dark:text-white">Basic Detail</Title>}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Choose Name"
                name="chooseName"
                rules={[{ required: true, message: 'Please select a name' }]}
              >
                <Select
                  showSearch
                  placeholder="Select a name"
                  optionFilterProp="children"
                >
                  <Option value="name1">Name 1</Option>
                  <Option value="name2">Name 2</Option>
                  <Option value="name3">Name 3</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Project Name"
                name="projectName"
                rules={[{ required: true, message: 'Please select a project' }]}
              >
                <Select placeholder="Select project">
                  {optionList.map(project => (
                    <Option key={project.value} value={project.value}>{project.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ type: 'email', message: 'Please enter a valid email' }]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="R.M."
                name="rm"
              >
                <Input placeholder="Enter RM" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Contact Name"
                name="contactName"
              >
                <Input placeholder="Enter contact name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Unit"
                name="unit"
              >
                <Input placeholder="Enter Unit" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Booking Date"
                name="bookingDate"
                rules={[{ required: true, message: 'Please select a date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Size"
                name="size"
              >
                 <Input placeholder="Enter Size" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Reference Section */}
        <Card className="mb-6 dark:bg-gray-700 dark:border-gray-600" title={<Title level={4} className="dark:text-white">Reference</Title>}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Employee"
                name="employee"
                className="dark:text-white"
              >
                <Select
                  showSearch
                  placeholder="Select employee"
                  optionFilterProp="children"
                  className="dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  onChange={(value) => handleEmployeeSelect(value, "Employee")}
                  disabled={shouldDisableSelect("Employee")}
                >
                  {usersByRole["Employee"]?.map(emp => (
                    <Option key={emp.value} value={emp.value}>{emp.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="AVP"
                name="avp"
                className="dark:text-white"
              >
                <Select
                  showSearch
                  placeholder="Select AVP"
                  optionFilterProp="children"
                  className="dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  onChange={(value) => handleEmployeeSelect(value, "AVP")}
                  disabled={shouldDisableSelect("AVP")}
                >
                  {usersByRole["AVP"]?.map(avp => (
                    <Option key={avp.value} value={avp.value}>{avp.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="TL/CP"
                name="tlcp"
                className="dark:text-white"
              >
                <Select
                  showSearch
                  placeholder="Select TL/CP"
                  optionFilterProp="children"
                  className="dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  onChange={(value) => handleEmployeeSelect(value, "Team Leader")}
                  disabled={shouldDisableSelect("Team Leader")}
                >
                  {usersByRole["Team Leader"]?.map(tl => (
                    <Option key={tl.value} value={tl.value}>{tl.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="VP"
                name="vp"
                className="dark:text-white"
              >
                <Select
                  showSearch
                  placeholder="Select VP"
                  optionFilterProp="children"
                  className="dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  onChange={(value) => handleEmployeeSelect(value, "VP")}
                  disabled={shouldDisableSelect("VP")}
                >
                  {usersByRole["VP"]?.map(vp => (
                    <Option key={vp.value} value={vp.value}>{vp.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="AGM"
                name="agm"
                className="dark:text-white"
              >
                <Select
                  showSearch
                  placeholder="Select AGM"
                  optionFilterProp="children"
                  className="dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  onChange={(value) => handleEmployeeSelect(value, "AGM")}
                  disabled={shouldDisableSelect("AGM")}
                >
                  {usersByRole["AGM"]?.map(agm => (
                    <Option key={agm.value} value={agm.value}>{agm.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="AS"
                name="as"
                className="dark:text-white"
              >
                <Select
                  showSearch
                  placeholder="Select AS"
                  optionFilterProp="children"
                  className="dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  onChange={(value) => handleEmployeeSelect(value, "AS")}
                  disabled={shouldDisableSelect("AS")}
                >
                  {usersByRole["AS"]?.map(as => (
                    <Option key={as.value} value={as.value}>{as.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="GM"
                name="gm"
                className="dark:text-white"
              >
                <Select
                  showSearch
                  placeholder="Select GM"
                  optionFilterProp="children"
                  className="dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  onChange={(value) => handleEmployeeSelect(value, "GM")}
                  disabled={shouldDisableSelect("GM")}
                >
                  {usersByRole["GM"]?.map(gm => (
                    <Option key={gm.value} value={gm.value}>{gm.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Vertical"
                name="vertical"
                className="dark:text-white"
              >
                <Select
                  showSearch
                  placeholder="Select Vertical"
                  optionFilterProp="children"
                  className="dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  onChange={(value) => handleEmployeeSelect(value, "Vertical")}
                  disabled={shouldDisableSelect("Vertical")}
                >
                  {usersByRole["Vertical"]?.map(vert => (
                    <Option key={vert.value} value={vert.value}>{vert.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Payment Detail Section */}
        <Card className="mb-6 dark:bg-gray-700 dark:border-gray-600" title={<Title level={4} className="dark:text-white">Payment Detail</Title>}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="BSP"
                name="bsp"
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="Enter BSP" 
                  formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value ? Number(value.replace(/[^\d.]/g, '')) : 0}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Payment received"
                name="paymentReceived"
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="Enter payment received" 
                  formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value ? Number(value.replace(/[^\d.]/g, '')) : 0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="GST"
                name="gst"
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="Enter GST" 
                  formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value ? Number(value.replace(/[^\d.]/g, '')) : 0}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Next Payment"
                name="nextPayment"
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="Enter next payment" 
                  formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value ? Number(value.replace(/[^\d.]/g, '')) : 0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Other charges"
                name="otherCharges"
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="Enter other charges" 
                  formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value ? Number(value.replace(/[^\d.]/g, '')) : 0}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Payment to Dev"
                name="paymentToDev"
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="Enter payment to dev" 
                  formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value ? Number(value.replace(/[^\d.]/g, '')) : 0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="TSP"
                name="tsp"
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="Enter TSP" 
                  formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value ? Number(value.replace(/[^\d.]/g, '')) : 0}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Total Revenue"
                name="totalRevenue"
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  disabled 
                  value={totalRevenue}
                  formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value ? Number(value.replace(/[^\d.]/g, '')) : 0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Net Revenue"
                name="netRevenue"
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  disabled 
                  value={netRevenue}
                  formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value ? Number(value.replace(/[^\d.]/g, '')) : 0}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Remark Section */}
        <Card className="mb-6 dark:bg-gray-700 dark:border-gray-600" title={<Title level={4} className="dark:text-white">Remark</Title>}>
          <Row>
            <Col span={24}>
              <Form.Item
                name="remark"
                className="dark:text-white"
              >
                <TextArea 
                  rows={4} 
                  placeholder="Enter any remarks here"
                  className="dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large"
            icon={<SaveOutlined />}
            className="float-right"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>

      <style>{`
        .ant-select-selector,
        .ant-input,
        .ant-picker,
        .ant-input-number {
          border-radius: 4px !important;
        }
        .dark .ant-select-selector,
        .dark .ant-input,
        .dark .ant-picker,
        .dark .ant-input-number,
        .dark .ant-picker-panel-container {
          background-color: #374151 !important;
          border-color: #4b5563 !important;
          color: white !important;
        }
        .dark .ant-select-arrow,
        .dark .ant-picker-suffix,
        .dark .ant-picker-icon {
          color: white !important;
        }
        .dark .ant-picker-header,
        .dark .ant-picker-content th {
          color: white !important;
        }
        .dark .ant-picker-cell {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        .dark .ant-picker-cell-in-view {
          color: white !important;
        }
        .dark .ant-picker-cell:hover .ant-picker-cell-inner {
          background-color: #4b5563 !important;
        }
        .dark .ant-picker-cell-selected .ant-picker-cell-inner {
          background-color: #1890ff !important;
        }
        .dark .ant-picker-footer,
        .dark .ant-picker-today-btn {
          color: white !important;
        }
        .dark .ant-card-bordered {
          border: 1px solid #4b5563 !important;
        }
        .dark .ant-form-item-label > label {
          color: white !important;
        }
        .dark .ant-select-dropdown {
          background-color: #374151 !important;
          border-color: #4b5563 !important;
        }
        .dark .ant-select-item {
          color: white !important;
        }
        .dark .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
          background-color: #1890ff !important;
        }
        .dark .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
          background-color: #4b5563 !important;
        }
      `}</style>
    </div>
  );
};

export default AddBooking; 