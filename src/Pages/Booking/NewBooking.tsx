import React, { useEffect, useState, useCallback } from 'react';
import { Card } from 'antd';
import { getStoredStatus } from '../../api/commonAPI';
import CustomAntdTable from '../../components/Tables/CustomAntdTable';
import { API } from '../../api';
import { END_POINT } from '../../api/UrlProvider';
import SearchForm from '../../components/Header/SearchForm';
import { debounce } from 'lodash';

interface LeadResponse {
  _id: string;
  firstName: string;
  contactNumber: string;
  comment: string;
  assignedAgent: {
    _id: string;
    name: string;
  };
  productService: {
    _id?: string;
    name?: string;
  } | null;
  email: string;
  city: string;
  followUpDate: string;
  leadWonAmount: number;
  createdAt: string;
}

interface LeadData extends LeadResponse {
  key: string;
}

const NewBooking: React.FC = () => {
  const leadStatusListRaw = getStoredStatus();
  const [statusIds, setStatusIds] = useState({
    lostStatusId: "",
    wonStatusId: "",
  });
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const findLostWonStatusId = () => {
    const statusId = leadStatusListRaw.find((status) => status.lossStatus);
    const wonStatusId = leadStatusListRaw.find((status) => status.wonStatus);
    setStatusIds({
      lostStatusId: statusId?._id,
      wonStatusId: wonStatusId?._id,
    });
  };

  const columns = [
    {
      title: "Lead Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
      key: "contactNumber",
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      render: (comment: string) => comment || "-",
    },
    {
      title: "Assigned Agent",
      dataIndex: "assignedAgent",
      key: "assignedAgent",
      render: (agent: { name: string }) => agent?.name || "-",
    },
    {
      title: "Product/Service",
      dataIndex: "productService",
      key: "productService",
      render: (product: { name?: string } | null) => product?.name || "-",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email: string) => email || "-",
    },
  ];

  const fetchLeads = useCallback(async () => {
    if (!statusIds.wonStatusId) return;

    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        leadStatus: statusIds.wonStatusId,
        search: searchText,
      };

      const { data, error, options } = await API.getAuthAPI(
        END_POINT.LEADS_DATA,
        true,
        params
      );

      if (error) {
        throw new Error(error);
      }

      if (data) {
        const formattedLeads = data.map((lead: LeadResponse) => ({
          ...lead,
          key: lead._id,
        }));
        
        setLeads(formattedLeads);
        setPagination({
          ...pagination,
          total: options?.pagination?.total || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, statusIds.wonStatusId, searchText]);

  const debouncedSearch = debounce((value: string) => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  }, 100);

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

  useEffect(() => {
    findLostWonStatusId();
  }, []);

  useEffect(() => {
    if (statusIds.wonStatusId) {
      fetchLeads();
    }
  }, [fetchLeads, statusIds.wonStatusId]);

  return (
    <div className="min-h-screen p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">New Bookings</h2>
        {/* <p className="text-gray-600 dark:text-gray-300 mt-2">
          Leads with won status that can be converted to bookings
        </p> */}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center">
            <SearchForm
              onSearch={handleSearch}
              placeholder="Search by name, email or contact number"
              searchTerm={searchText}
            />
          </div>
        </div>
      </div>

      <Card className="bg-white dark:bg-gray-800" bordered={false}>
        <div className="mb-4 flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300">
            Showing {leads.length} leads with won status
          </span>
        </div>

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
          rowClassName="cursor-pointer"
        />
      </Card>
    </div>
  );
};

export default NewBooking; 