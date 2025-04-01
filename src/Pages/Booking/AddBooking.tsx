import React, { useState } from 'react';
import { Form, Input, Select, DatePicker, Button, Card, Row, Col, Typography, InputNumber } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Dummy data for dropdowns
const dummyData = {
  employees: [
    { value: 'emp1', label: 'John Doe' },
    { value: 'emp2', label: 'Jane Smith' },
    { value: 'emp3', label: 'Mike Johnson' },
    { value: 'emp4', label: 'Sarah Williams' },
  ],
  avpList: [
    { value: 'avp1', label: 'David Brown' },
    { value: 'avp2', label: 'Emily Davis' },
    { value: 'avp3', label: 'Robert Wilson' },
  ],
  tlcpList: [
    { value: 'tl1', label: 'Michael Lee' },
    { value: 'tl2', label: 'Jennifer Taylor' },
    { value: 'tl3', label: 'William Anderson' },
  ],
  vpList: [
    { value: 'vp1', label: 'Thomas Moore' },
    { value: 'vp2', label: 'Elizabeth Clark' },
    { value: 'vp3', label: 'Daniel White' },
  ],
  agmList: [
    { value: 'agm1', label: 'Joseph Martin' },
    { value: 'agm2', label: 'Margaret Thompson' },
    { value: 'agm3', label: 'Christopher Garcia' },
  ],
  asList: [
    { value: 'as1', label: 'Kevin Rodriguez' },
    { value: 'as2', label: 'Lisa Martinez' },
    { value: 'as3', label: 'Brian Lee' },
  ],
  gmList: [
    { value: 'gm1', label: 'George Wright' },
    { value: 'gm2', label: 'Helen Adams' },
    { value: 'gm3', label: 'Edward Baker' },
  ],
  verticals: [
    { value: 'vert1', label: 'Residential' },
    { value: 'vert2', label: 'Commercial' },
    { value: 'vert3', label: 'Industrial' },
    { value: 'vert4', label: 'Retail' },
  ],
};

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

  // Sample options for dropdowns
  const projectOptions = ['Project A', 'Project B', 'Project C'];
  const unitOptions = ['Unit 1', 'Unit 2', 'Unit 3'];
  const sizeOptions = ['1 BHK', '2 BHK', '3 BHK', '4 BHK'];

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

  const onFinish = (values: BookingFormValues) => {
    console.log('Form values:', values);
    // Handle form submission here
  };

  const onFieldsChange = () => {
    calculateTotalRevenue();
  };

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
                  {projectOptions.map(project => (
                    <Option key={project} value={project}>{project}</Option>
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
                <Select placeholder="Select unit">
                  {unitOptions.map(unit => (
                    <Option key={unit} value={unit}>{unit}</Option>
                  ))}
                </Select>
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
                <Select placeholder="Select size">
                  {sizeOptions.map(size => (
                    <Option key={size} value={size}>{size}</Option>
                  ))}
                </Select>
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
                >
                  {dummyData.employees.map(emp => (
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
                >
                  {dummyData.avpList.map(avp => (
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
                >
                  {dummyData.tlcpList.map(tl => (
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
                >
                  {dummyData.vpList.map(vp => (
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
                >
                  {dummyData.agmList.map(agm => (
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
                >
                  {dummyData.asList.map(as => (
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
                >
                  {dummyData.gmList.map(gm => (
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
                >
                  {dummyData.verticals.map(vert => (
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