import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import MiniLoader from "../../components/CommonUI/Loader/MiniLoader";
import { Card } from "antd";
import { FaRegCalendarCheck, FaRegCalendarTimes, FaRupeeSign } from "react-icons/fa";
import { BiCalendar, BiCalendarEvent } from "react-icons/bi";
import { MdPendingActions } from "react-icons/md";

// Booking summary card component
interface BookingSummaryCardProps {
  title: string;
  value: string;
  count: number;
  color: string;
  icon: React.ReactNode;
}

const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({ 
  title, 
  value,
  count,
  color,
  icon
}) => (
  <Card className="bg-white shadow-md dark:bg-gray-700 h-full p-0 overflow-hidden">
      <p className="text-sm font-medium uppercase text-gray-500 dark:text-gray-400 mb-4">
        {title}
      </p>
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <p className="text-4xl font-bold text-gray-800 dark:text-white mb-1">
            {count}
          </p>
          <p className="text-base font-medium text-gray-600 dark:text-gray-300">
            ({value})
          </p>
        </div>
        <div 
          className={`flex h-14 w-14 items-center justify-center rounded-full text-white text-xl`} 
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
    </div>
  </Card>
);

// Performance table component
interface PerformanceRowData {
  name: string;
  thisMonthValue: string;
  thisYearValue: string;
}

interface PerformanceTableProps {
  title: string;
  data: PerformanceRowData[];
}

interface BookingMetrics {
  totalBooking: { count: number; value: string };
  bookingThisYear: { count: number; value: string };
  bookingThisMonth: { count: number; value: string };
  cancelledBooking: { count: number; value: string };
  pendingAmount: { count: number; value: string };
  currentMonthPending: { count: number; value: string };
  performanceOverview: {
    vertical: PerformanceRowData[];
    vp: PerformanceRowData[];
    avp: PerformanceRowData[];
    as: PerformanceRowData[];
    gm: PerformanceRowData[];
    agm: PerformanceRowData[];
    tlcp: PerformanceRowData[];
    employees: PerformanceRowData[];
  }
}

const PerformanceTable: React.FC<PerformanceTableProps> = ({ title, data }) => (
  <div className="rounded-lg bg-white px-5 pb-5 pt-5 shadow-1 dark:bg-gray-dark dark:shadow-card h-full">
    <div className="mb-5">
      <h4 className="text-xl font-bold text-dark dark:text-white">
        {title}
      </h4>
    </div>
    
    <div className="grid grid-cols-3 border-b border-gray-200 pb-3">
      <div className="px-2">
        <h5 className="text-sm font-medium uppercase text-gray-500">
          Name
        </h5>
      </div>
      <div className="px-2 text-center">
        <h5 className="text-sm font-medium uppercase text-gray-500">
          This Month
        </h5>
      </div>
      <div className="px-2 text-center">
        <h5 className="text-sm font-medium uppercase text-gray-500">
          This Year
        </h5>
      </div>
    </div>

    {data.map((row, key) => (
      <div
        className={`grid grid-cols-3 ${
          key === data.length - 1
            ? ""
            : "border-b border-gray-200"
        }`}
        key={key}
      >
        <div className="flex items-center px-2 py-4">
          <p className="font-medium text-gray-800 dark:text-white">
            {row.name}
          </p>
        </div>
        <div className="flex items-center justify-center px-2 py-4">
          <p className="font-medium text-gray-800 dark:text-white">
            {row.thisMonthValue}
          </p>
        </div>
        <div className="flex items-center justify-center px-2 py-4">
          <p className="font-medium text-gray-800 dark:text-white">
            {row.thisYearValue}
          </p>
        </div>
      </div>
    ))}
  </div>
);

// Mock data for development
const getMockBookingMetrics = (): BookingMetrics => {
  return {
    totalBooking: { count: 700, value: "₹ 50,00,000" },
    bookingThisYear: { count: 250, value: "₹ 10,00,000" },
    bookingThisMonth: { count: 20, value: "₹ 5,00,000" },
    cancelledBooking: { count: 7, value: "₹ 1,00,000" },
    pendingAmount: { count: 300, value: "₹ 90,00,000" },
    currentMonthPending: { count: 50, value: "₹ 70,00,000" },
    performanceOverview: {
      vertical: [
        { name: "Sharukh", thisMonthValue: "₹ 50,00,000", thisYearValue: "₹ 50,00,000" },
        { name: "Amir", thisMonthValue: "₹ 50,00,000", thisYearValue: "₹ 50,00,000" },
        { name: "Amitabh", thisMonthValue: "₹ 50,00,000", thisYearValue: "₹ 50,00,000" }
      ],
      vp: [
        { name: "Sharukh", thisMonthValue: "₹ 50,00,000", thisYearValue: "₹ 50,00,000" },
        { name: "Amir", thisMonthValue: "₹ 50,00,000", thisYearValue: "₹ 50,00,000" },
        { name: "Amitabh", thisMonthValue: "₹ 50,00,000", thisYearValue: "₹ 50,00,000" }
      ],
      avp: [
        { name: "Sharukh", thisMonthValue: "₹ 50,00,000", thisYearValue: "₹ 50,00,000" },
        { name: "Amir", thisMonthValue: "₹ 50,00,000", thisYearValue: "₹ 50,00,000" },
        { name: "Amitabh", thisMonthValue: "₹ 50,00,000", thisYearValue: "₹ 50,00,000" }
      ],
      as: [
        { name: "Sharukh", thisMonthValue: "₹ 50,00,000", thisYearValue: "₹ 50,00,000" },
        { name: "Amir", thisMonthValue: "₹ 50,00,000", thisYearValue: "₹ 50,00,000" },
        { name: "Amitabh", thisMonthValue: "₹ 50,00,000", thisYearValue: "₹ 50,00,000" }
      ],
      gm: [
        { name: "Sharukh", thisMonthValue: "₹ 50,00,000", thisYearValue: "₹ 50,00,000" },
        { name: "Amir", thisMonthValue: "₹ 50,00,000", thisYearValue: "₹ 50,00,000" },
        { name: "Amitabh", thisMonthValue: "₹ 50,00,000", thisYearValue: "₹ 50,00,000" }
      ],
      agm: [
        { name: "Sharukh", thisMonthValue: "₹ 50,00,000", thisYearValue: "₹ 50,00,000" },
        { name: "Amir", thisMonthValue: "₹ 50,00,000", thisYearValue: "₹ 50,00,000" },
        { name: "Amitabh", thisMonthValue: "₹ 50,00,000", thisYearValue: "₹ 50,00,000" }
      ],
      tlcp: [
        { name: "Sharukh", thisMonthValue: "₹ 50,00,000", thisYearValue: "₹ 50,00,000" },
        { name: "Amir", thisMonthValue: "₹ 50,00,000", thisYearValue: "₹ 50,00,000" },
        { name: "Amitabh", thisMonthValue: "₹ 50,00,000", thisYearValue: "₹ 50,00,000" }
      ],
      employees: [
        { name: "Sharukh", thisMonthValue: "₹ 50,00,000", thisYearValue: "₹ 50,00,000" },
        { name: "Amir", thisMonthValue: "₹ 50,00,000", thisYearValue: "₹ 50,00,000" },
        { name: "Amitabh", thisMonthValue: "₹ 50,00,000", thisYearValue: "₹ 50,00,000" }
      ]
    }
  };
};

const BookingDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<BookingMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBookingMetrics = async () => {
    try {
      // In a real application, replace with actual API call
      // const response = await API.getAuthAPI("booking/metrics", true);
      // if (response.error) throw new Error(response.error);
      // setMetrics(response.data);
      
      // Using mock data for now
      setMetrics(getMockBookingMetrics());
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch booking metrics";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingMetrics();
  }, []);

  if (loading) {
    return <MiniLoader />;
  }

  return (
    <div className=" min-h-screen">
      <div className="grid grid-cols-12 gap-4 mb-8">
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 ">
          <BookingSummaryCard 
            title="Total Booking" 
            value={metrics?.totalBooking.value || ""} 
            count={metrics?.totalBooking.count || 0}
            color="#4318FF"
            icon={<BiCalendarEvent className="text-2xl" />}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 ">
          <BookingSummaryCard 
            title="Booking This Year" 
            value={metrics?.bookingThisYear.value || ""} 
            count={metrics?.bookingThisYear.count || 0}
            color="#05CD99"
            icon={<BiCalendar className="text-2xl" />}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 ">
          <BookingSummaryCard 
            title="Booking this Month" 
            value={metrics?.bookingThisMonth.value || ""} 
            count={metrics?.bookingThisMonth.count || 0}
            color="#FFB547"
            icon={<FaRegCalendarCheck className="text-2xl" />}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 ">
          <BookingSummaryCard 
            title="Cancel Booking" 
            value={metrics?.cancelledBooking.value || ""} 
            count={metrics?.cancelledBooking.count || 0}
            color="#EE5D50"
            icon={<FaRegCalendarTimes className="text-2xl" />}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 ">
          <BookingSummaryCard 
            title="Pending Amount" 
            value={metrics?.pendingAmount.value || ""} 
            count={metrics?.pendingAmount.count || 0}
            color="#3E82F7"
            icon={<MdPendingActions className="text-2xl" />}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 ">
          <BookingSummaryCard 
            title="Current Month Pending" 
            value={metrics?.currentMonthPending.value || ""} 
            count={metrics?.currentMonthPending.count || 0}
            color="#6C5DD3"
            icon={<FaRupeeSign className="text-2xl" />}
          />
        </div>
      </div>

      {/* Performance Overview Heading */}
      <div className="mb-5">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Performance Overview</h3>
      </div>

      {/* Performance Tables */}
      <div className="grid grid-cols-12 gap-5 mb-6">
        <div className="col-span-12 md:col-span-6">
          <PerformanceTable 
            title="Vertical" 
            data={metrics?.performanceOverview.vertical || []} 
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PerformanceTable 
            title="AS" 
            data={metrics?.performanceOverview.as || []} 
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 mb-6">
        <div className="col-span-12 md:col-span-6">
          <PerformanceTable 
            title="VP" 
            data={metrics?.performanceOverview.vp || []} 
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PerformanceTable 
            title="AVP" 
            data={metrics?.performanceOverview.avp || []} 
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 mb-6">
        <div className="col-span-12 md:col-span-6">
          <PerformanceTable 
            title="GM" 
            data={metrics?.performanceOverview.gm || []} 
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PerformanceTable 
            title="AGM" 
            data={metrics?.performanceOverview.agm || []} 
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 mb-6">
        <div className="col-span-12 md:col-span-6">
          <PerformanceTable 
            title="TL/CP" 
            data={metrics?.performanceOverview.tlcp || []} 
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <PerformanceTable 
            title="Employees" 
            data={metrics?.performanceOverview.employees || []} 
          />
        </div>
      </div>
    </div>
  );
};

export default BookingDashboard; 