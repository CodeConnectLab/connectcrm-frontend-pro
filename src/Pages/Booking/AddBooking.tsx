import React, { useState } from 'react';
import { Form, Input, Select, DatePicker, Button, Card, Row, Col, Typography, InputNumber } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

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
    <div className="min-h-screen">
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFieldsChange={onFieldsChange}
        className="rounded-lg"
      >
        {/* Basic Detail Section */}
        <Card className="mb-6" title={<Title level={4}>Basic Detail</Title>}>
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
        <Card className="mb-6" title={<Title level={4}>Reference</Title>}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Employee"
                name="employee"
              >
                <Select
                  showSearch
                  placeholder="Select employee"
                  optionFilterProp="children"
                >
                  <Option value="employee1">Employee 1</Option>
                  <Option value="employee2">Employee 2</Option>
                  <Option value="employee3">Employee 3</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="AVP"
                name="avp"
              >
                <Input placeholder="AVP" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="TL/CP"
                name="tlcp"
              >
                <Input placeholder="TL/CP" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="VP"
                name="vp"
              >
                <Input placeholder="VP" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="AGM"
                name="agm"
              >
                <Input placeholder="AGM" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="AS"
                name="as"
              >
                <Input placeholder="AS" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="GM"
                name="gm"
              >
                <Input placeholder="GM" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Vertical"
                name="vertical"
              >
                <Input placeholder="Vertical" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Payment Detail Section */}
        <Card className="mb-6" title={<Title level={4}>Payment Detail</Title>}>
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
        <Card className="mb-6" title={<Title level={4}>Remark</Title>}>
          <Row>
            <Col span={24}>
              <Form.Item
                name="remark"
              >
                <TextArea rows={4} placeholder="Enter any remarks here" />
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
    </div>
  );
};

export default AddBooking; 