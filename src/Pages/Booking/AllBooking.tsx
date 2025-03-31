import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Input, Row, Col, Select, Button, Table, Tag, Space } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import { Link } from 'react-router-dom';

const { Option } = Select;
const { Search } = Input;

interface BookingData {
  key: string;
  name: string;
  contactNumber: string;
  bookingAmount: number;
  status: string;
}

const AllBooking: React.FC = () => {
  // State for table data
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  // State for filters
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [verticalFilter, setVerticalFilter] = useState<string | undefined>(undefined);
  const [asFilter, setAsFilter] = useState<string | undefined>(undefined);
  const [vpFilter, setVpFilter] = useState<string | undefined>(undefined);
  const [avpFilter, setAvpFilter] = useState<string | undefined>(undefined);
  const [gmFilter, setGmFilter] = useState<string | undefined>(undefined);
  const [agmFilter, setAgmFilter] = useState<string | undefined>(undefined);
  const [tlcpFilter, setTlcpFilter] = useState<string | undefined>(undefined);
  const [employeeFilter, setEmployeeFilter] = useState<string | undefined>(undefined);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Mock data for demonstration
  const mockBookings: BookingData[] = [
    {
      key: '1',
      name: 'Anurag',
      contactNumber: '9999999654',
      bookingAmount: 1000000,
      status: 'Pending',
    },
    {
      key: '2',
      name: 'Anurag',
      contactNumber: '9999999654',
      bookingAmount: 1000000,
      status: 'Complete',
    },
    {
      key: '3',
      name: 'Anurag',
      contactNumber: '9999999654',
      bookingAmount: 1000000,
      status: 'Pending',
    },
    {
      key: '4',
      name: 'Anurag',
      contactNumber: '9999999654',
      bookingAmount: 1000000,
      status: 'Pending',
    },
    {
      key: '5',
      name: 'Anurag',
      contactNumber: '9999999654',
      bookingAmount: 1000000,
      status: 'Complete',
    },
    {
      key: '6',
      name: 'Anurag',
      contactNumber: '9999999654',
      bookingAmount: 1000000,
      status: 'Pending',
    },
    {
      key: '7',
      name: 'Anurag',
      contactNumber: '9999999654',
      bookingAmount: 1000000,
      status: 'Pending',
    },
    {
      key: '8',
      name: 'Anurag',
      contactNumber: '9999999654',
      bookingAmount: 1000000,
      status: 'Complete',
    },
    {
      key: '9',
      name: 'Anurag',
      contactNumber: '9999999654',
      bookingAmount: 1000000,
      status: 'Pending',
    },
    {
      key: '10',
      name: 'Anurag',
      contactNumber: '9999999654',
      bookingAmount: 1000000,
      status: 'Pending',
    },
  ];

  // Mock options for dropdowns
  const statusOptions = ['Pending', 'Complete', 'Canceled'];
  const verticalOptions = ['Residential', 'Commercial', 'Industrial'];
  const asOptions = ['AS 1', 'AS 2', 'AS 3'];
  const vpOptions = ['VP 1', 'VP 2', 'VP 3'];
  const avpOptions = ['AVP 1', 'AVP 2', 'AVP 3'];
  const gmOptions = ['GM 1', 'GM 2', 'GM 3'];
  const agmOptions = ['AGM 1', 'AGM 2', 'AGM 3'];
  const tlcpOptions = ['TL/CP 1', 'TL/CP 2', 'TL/CP 3'];
  const employeeOptions = ['Employee 1', 'Employee 2', 'Employee 3'];

  // Table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Contact Number',
      dataIndex: 'contactNumber',
      key: 'contactNumber',
    },
    {
      title: 'Booking Amount',
      dataIndex: 'bookingAmount',
      key: 'bookingAmount',
      render: (amount: number) => `₹${amount.toLocaleString('en-IN')}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Complete' ? 'green' : status === 'Pending' ? 'gold' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, record: BookingData) => (
        <Space size="middle">
          <Link to={`/booking/edit/${record.key}`} className="text-blue-500 hover:text-blue-700">
            Edit/Add Payment
          </Link>
        </Space>
      ),
    },
  ];

  // Filter function for search and dropdown filters
  const filterBookings = useCallback(() => {
    setLoading(true);
    
    let filteredData = [...mockBookings];
    
    // Apply search filter
    if (searchText) {
      filteredData = filteredData.filter(
        booking => booking.name.toLowerCase().includes(searchText.toLowerCase()) ||
                  booking.contactNumber.includes(searchText)
      );
    }
    
    // Apply dropdown filters
    if (statusFilter) {
      filteredData = filteredData.filter(booking => booking.status === statusFilter);
    }
    
    // For demonstration, we're not implementing filtering for all dropdowns
    // In a real implementation, you would filter based on all selected values
    
    setTimeout(() => {
      setBookings(filteredData);
      setPagination(prev => ({
        ...prev,
        total: filteredData.length,
      }));
      setLoading(false);
    }, 500); // Simulate API call delay
  }, [searchText, statusFilter, mockBookings]);

  // Debounced search handler
  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      setSearchText(value);
    }, 500),
    []
  );

  const handleSearch = (value: string) => {
    debouncedSearch(value);
  };

  const handleTableChange = (page: number, pageSize: number) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize,
    });
  };

  const handleReset = () => {
    setStatusFilter(undefined);
    setVerticalFilter(undefined);
    setAsFilter(undefined);
    setVpFilter(undefined);
    setAvpFilter(undefined);
    setGmFilter(undefined);
    setAgmFilter(undefined);
    setTlcpFilter(undefined);
    setEmployeeFilter(undefined);
    setSearchText('');
  };

  // Apply filters when they change
  useEffect(() => {
    filterBookings();
  }, []);

  return (
    <div className="min-h-screen p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">All Bookings</h2>
      </div>
      
      {/* Filters Section */}
      <Card className="mb-6" bordered={false}>
        <div className="mb-4">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Select
                placeholder="Select Status"
                allowClear
                style={{ width: '100%' }}
                value={statusFilter}
                onChange={setStatusFilter}
              >
                {statusOptions.map(option => (
                  <Option key={option} value={option}>{option}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Select
                placeholder="Select Vertical"
                allowClear
                style={{ width: '100%' }}
                value={verticalFilter}
                onChange={setVerticalFilter}
              >
                {verticalOptions.map(option => (
                  <Option key={option} value={option}>{option}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Select
                placeholder="Select AS"
                allowClear
                style={{ width: '100%' }}
                value={asFilter}
                onChange={setAsFilter}
              >
                {asOptions.map(option => (
                  <Option key={option} value={option}>{option}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Select
                placeholder="Select VP"
                allowClear
                style={{ width: '100%' }}
                value={vpFilter}
                onChange={setVpFilter}
              >
                {vpOptions.map(option => (
                  <Option key={option} value={option}>{option}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Select
                placeholder="Select AVP"
                allowClear
                style={{ width: '100%' }}
                value={avpFilter}
                onChange={setAvpFilter}
              >
                {avpOptions.map(option => (
                  <Option key={option} value={option}>{option}</Option>
                ))}
              </Select>
            </Col>
          </Row>
        </div>
        
        <div className="mb-4">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Select
                placeholder="Select GM"
                allowClear
                style={{ width: '100%' }}
                value={gmFilter}
                onChange={setGmFilter}
              >
                {gmOptions.map(option => (
                  <Option key={option} value={option}>{option}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Select
                placeholder="Select AGM"
                allowClear
                style={{ width: '100%' }}
                value={agmFilter}
                onChange={setAgmFilter}
              >
                {agmOptions.map(option => (
                  <Option key={option} value={option}>{option}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Select
                placeholder="Select TL/CP"
                allowClear
                style={{ width: '100%' }}
                value={tlcpFilter}
                onChange={setTlcpFilter}
              >
                {tlcpOptions.map(option => (
                  <Option key={option} value={option}>{option}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Select
                placeholder="Select Employee"
                allowClear
                style={{ width: '100%' }}
                value={employeeFilter}
                onChange={setEmployeeFilter}
              >
                {employeeOptions.map(option => (
                  <Option key={option} value={option}>{option}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                className="mr-2"
                onClick={() => window.location.href = '/booking/add-booking'}
              >
                Add Booking
              </Button>
              <Button 
                onClick={handleReset}
                className="ml-2"
              >
                Reset
              </Button>
            </Col>
          </Row>
        </div>
        
        <div>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Search
                placeholder="Search by name or contact number"
                allowClear
                enterButton={<SearchOutlined />}
                size="middle"
                onSearch={handleSearch}
                style={{ maxWidth: 400 }}
              />
            </Col>
          </Row>
        </div>
      </Card>
      
      {/* Table Section */}
      <Card bordered={false}>
        <div className="mb-4 flex justify-between items-center">
          <span>Showing {bookings.length} bookings</span>
          <div>
            <Button className="mr-2">Customize Column</Button>
          </div>
        </div>
        
        <Table
          columns={columns}
          dataSource={bookings}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, pageSize) => handleTableChange(page, pageSize || 10),
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          rowClassName="cursor-pointer"
          onRow={(record: BookingData) => ({
            onClick: () => {
              // Handle row click (e.g., navigate to detail page)
              console.log('Row clicked:', record);
            },
          })}
        />
      </Card>
    </div>
  );
};

export default AllBooking; 