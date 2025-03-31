import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card, Tag, Space, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
import { Link, useNavigate } from "react-router-dom";
import CustomAntdTable from "../../components/Tables/CustomAntdTable";
import SearchForm from "../../components/Header/SearchForm";
import BookingAdvanceFilterUI from "./BookingAdvanceFilterUI";
import ButtonDefault from "../../components/Buttons/ButtonDefault";

interface BookingData {
  key: string;
  name: string;
  contactNumber: string;
  bookingAmount: number;
  status: string;
}

interface BookingFilters {
  status?: string;
  vertical?: string;
  as?: string;
  vp?: string;
  avp?: string;
  gm?: string;
  agm?: string;
  tlcp?: string;
  employee?: string;
  startDate?: string;
  endDate?: string;
}

// Mock data for demonstration
const mockBookings: BookingData[] = [
    {
      key: "1",
      name: "Anurag",
      contactNumber: "9999999654",
      bookingAmount: 1000000,
      status: "Pending",
    },
    {
      key: "2",
      name: "Anurag",
      contactNumber: "9999999654",
      bookingAmount: 1000000,
      status: "Complete",
    },
    {
      key: "3",
      name: "Anurag",
      contactNumber: "9999999654",
      bookingAmount: 1000000,
      status: "Pending",
    },
    {
      key: "4",
      name: "Anurag",
      contactNumber: "9999999654",
      bookingAmount: 1000000,
      status: "Pending",
    },
    {
      key: "5",
      name: "Anurag",
      contactNumber: "9999999654",
      bookingAmount: 1000000,
      status: "Complete",
    },
    {
      key: "6",
      name: "Anurag",
      contactNumber: "9999999654",
      bookingAmount: 1000000,
      status: "Pending",
    },
    {
      key: "7",
      name: "Anurag",
      contactNumber: "9999999654",
      bookingAmount: 1000000,
      status: "Pending",
    },
    {
      key: "8",
      name: "Anurag",
      contactNumber: "9999999654",
      bookingAmount: 1000000,
      status: "Complete",
    },
    {
      key: "9",
      name: "Anurag",
      contactNumber: "9999999654",
      bookingAmount: 1000000,
      status: "Pending",
    },
    {
      key: "10",
      name: "Anurag",
      contactNumber: "9999999654",
      bookingAmount: 1000000,
      status: "Pending",
    },
  ];

const AllBooking: React.FC = () => {
  // State for table data
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isAdvanceFilterOpen, setIsAdvanceFilterOpen] = useState(false);
 const navigate=useNavigate()
  // State for filters
  const [advancedFilters, setAdvancedFilters] = useState<BookingFilters>({});

  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
      key: "contactNumber",
    },
    {
      title: "Booking Amount",
      dataIndex: "bookingAmount",
      key: "bookingAmount",
      render: (amount: number) => `₹${amount.toLocaleString("en-IN")}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "Complete"
              ? "green"
              : status === "Pending"
              ? "gold"
              : "red"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: BookingData) => (
        // <Space size="middle">
        //   <Link
        //     to={`/booking/edit/${record.key}`}
        //     className="text-blue-500 hover:text-blue-700"
        //   >
        //     Edit/Add Payment
        //   </Link>
        // </Space>
        <Button
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="bg-primary text-white hover:bg-primary/90"
      >
        Quick Edit
      </Button>
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
        (booking) =>
          booking.name.toLowerCase().includes(searchText.toLowerCase()) ||
          booking.contactNumber.includes(searchText)
      );
    }

    // Apply advanced filters
    if (advancedFilters.status) {
      filteredData = filteredData.filter(
        (booking) => booking.status === advancedFilters.status
      );
    }

    // Apply other filters (just for demonstration - in a real app, these would filter based on the relevant fields)
    // For vertical, as, vp, avp, gm, agm, tlcp, employee, etc.

    setTimeout(() => {
      setBookings(filteredData);
      setPagination((prev) => ({
        ...prev,
        total: filteredData.length,
      }));
      setLoading(false);
    }, 500); // Simulate API call delay
  }, [searchText, advancedFilters, mockBookings]);

  // Debounced search handler
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
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

  const handleAdvancedFilter = (filters: BookingFilters) => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    setAdvancedFilters(filters);
    setIsAdvanceFilterOpen(false);
  };

  const handleResetFilters = () => {
    setAdvancedFilters({});
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleRowClick = (record: BookingData) => {
    console.log("Row clicked:", record);
    // Navigate to detail or open edit modal
  };

  const handleAddBooking = () => {
    navigate("/booking/add-booking");
  };

  const toggleAdvanceFilter = () => {
    setIsAdvanceFilterOpen(!isAdvanceFilterOpen);
  };

  // Apply filters when they change
  useEffect(() => {
    filterBookings();
  }, []);

  return (
    <div className="min-h-screen p-4 space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          All Bookings
        </h2>
      </div>

      {/* Header with search and buttons */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center">
            <SearchForm
              onSearch={handleSearch}
              placeholder="Search by name or contact number"
              searchTerm={searchText}
            />
          </div>
          <div className="flex gap-3">
            <ButtonDefault
              label="Advanced Filter"
              onClick={toggleAdvanceFilter}
            />
            <ButtonDefault
              label="Add Booking"
              variant="secondary"
              icon={<PlusOutlined />}
              onClick={handleAddBooking}
            />
          </div>
        </div>

        {/* Advanced Filter UI */}
        {isAdvanceFilterOpen && (
          <BookingAdvanceFilterUI
            onFilter={handleAdvancedFilter}
            onReset={handleResetFilters}
            loading={loading}
            setIsAdvanceFilterEnable={setIsAdvanceFilterOpen}
          />
        )}
      </div>

      {/* Table Section */}
      <Card className="bg-white dark:bg-gray-800" bordered={false}>
        <div className="mb-4 flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300">
            Showing {bookings.length} bookings
          </span>
        </div>

        <CustomAntdTable
          columns={columns}
          dataSource={bookings}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: handleTableChange,
            pageSizeOptions: ["10", "20", "50", "100"],
            showSizeChanger: true,
          }}
          isLoading={loading}
          onRow={(record: BookingData) => ({
            onClick: () => handleRowClick(record),
          })}
          rowClassName="cursor-pointer"
        />
      </Card>
    </div>
  );
};

export default AllBooking;
