import { FC, useEffect, useState, ReactNode } from "react";
import { Link } from "react-router-dom";
import useLocalStorage from "../../hooks/useLocalStorage";
import ClickOutside from "../ClickOutside";
import SidebarItem from "./SidebarItem";
import { LuUserPlus } from "react-icons/lu";
import { LiaPhoneVolumeSolid } from "react-icons/lia";
import { GrDocumentPerformance } from "react-icons/gr";
import { IoSettingsOutline } from "react-icons/io5";
import { LiaSmsSolid } from "react-icons/lia";
import { BsWhatsapp } from "react-icons/bs";
import { GrDocumentUpload } from "react-icons/gr";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoBriefcaseOutline } from "react-icons/io5";
import { PiPlugCharging } from "react-icons/pi";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import useScrollIndicator, {
  ScrollIndicatorButton,
} from "../CommonUI/ScrollIndicator";

interface MenuItem {
  icon: ReactNode;
  label: string;
  route: string;
  children?: Array<{
    label: string;
    route: string;
  }>;
}

interface MenuGroup {
  name: string;
  menuItems: MenuItem[];
}

// Base menu structure
export const menuGroups: MenuGroup[] = [
  {
    name: "MAIN MENU",
    menuItems: [
      {
        icon: <LuLayoutDashboard className="text-2xl" />,
        label: "Dashboard",
        route: "#",
        children: [{ label: "Overview", route: "/" }, { label: "Booking", route: "/booking" }],
      },
      {
        icon: <FaFileInvoiceDollar className="text-2xl" />,
        label: "Booking",
        route: "#",
        children: [
          { label: "Add Booking", route: "/booking/add-booking" },
          { label: "All Booking", route: "/booking/all-booking" },
          { label: "New Booking", route: "/booking/new-booking" },
          { label: "Upcoming Payments", route: "/booking/upcoming-payments" },
          { label: "Reports", route: "/booking/reports" },
        ],
      },
      {
        icon: <LuUserPlus className="text-2xl" />,
        label: "Lead",
        route: "#",
        children: [
          { label: "Add Leads", route: "/leads/add" },
          { label: "All Leads", route: "/leads/all" },
          { label: "Follow Up Leads", route: "/leads/followup" },
          { label: "Imported Leads", route: "/leads/imported-leads" },
          { label: "Outsourced Leads", route: "/leads/outsourced-leads" },
        ],
      },
      {
        icon: <LiaPhoneVolumeSolid className="text-2xl" />,
        label: "Call Manage",
        route: "#",
        children: [
          { label: "Employees List", route: "/call-manage/employee" },
          { label: "Employee report", route: "/call-manage/employees-report" },
        ],
      },
      {
        icon: <IoCalendarNumberOutline className="text-2xl" />,
        label: "Calendar",
        route: "/calendar",
      },
      {
        icon: <LiaSmsSolid className="text-2xl" />,
        label: "SMS Panel",
        route: "#",
        children: [
          { label: "Compose Message", route: "/sms/compose" },
          { label: "SMS Report", route: "/sms/report" },
        ],
      },
      {
        icon: <BsWhatsapp className="text-2xl" />,
        label: "WhatsApp Panel",
        route: "#",
        children: [
          { label: "Compose Message", route: "/whatsapp/compose" },
          { label: "WhatsApp Report", route: "/whatsapp/report" },
        ],
      },
      {
        icon: <GrDocumentUpload className="text-2xl" />,
        label: "Contacts",
        route: "/Upload-contacts",
      },
      {
        icon: <GrDocumentPerformance className="text-2xl" />,
        label: "Reports",
        route: "#",
        children: [
          { label: "Manage report", route: "/reports/manage" },
        ],
      },
    ],
  },
  {
    name: "SETUP",
    menuItems: [
      {
        icon: <PiPlugCharging className="text-2xl" />,
        label: "Api",
        route: "/api-integeration",
      },
      {
        icon: <IoBriefcaseOutline className="text-2xl" />,
        label: "Products & Services",
        route: "/products-service",
      },
      {
        icon: <IoSettingsOutline className="text-2xl" />,
        label: "Setting",
        route: "/settings",
      },
    ],
  },
];

// Function to get role-based menu groups
const getMenuGroups = (userRole: string | null): MenuGroup[] => {
  const clonedGroups: MenuGroup[] = JSON.parse(JSON.stringify(menuGroups));
  
  // Restore React elements for icons after JSON parse
  clonedGroups.forEach(group => {
    group.menuItems.forEach((item, index) => {
      item.icon = menuGroups[clonedGroups.indexOf(group)].menuItems[index].icon;
    });
  });

  if (userRole !== "Super Admin") {
    // Filter MAIN MENU items
    const mainMenu = clonedGroups.find(group => group.name === "MAIN MENU");
    if (mainMenu) {
      mainMenu.menuItems = mainMenu.menuItems.filter(item => 
        !["Contacts", "SMS Panel", "WhatsApp Panel"].includes(item.label)
      );
    }

    // Return only the MAIN MENU group for non-Super Admin users
    return clonedGroups.filter(group => group.name === "MAIN MENU");
  } else {
    // For Super Admin, add call report
    const mainMenu = clonedGroups.find(group => group.name === "MAIN MENU");
    if (mainMenu) {
      const reportsMenuItem = mainMenu.menuItems.find(item => item.label === "Reports");
      if (reportsMenuItem && reportsMenuItem.children) {
        reportsMenuItem.children.push({ label: "Call report", route: "/reports/call" });
      }
    }
  }
  
  return clonedGroups;
};

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const { navRef, isVisible, scrollToBottom } = useScrollIndicator();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const data = JSON.parse(userStr);
        setUserRole(data?.role);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const currentMenuGroups = getMenuGroups(userRole);

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col 
          overflow-y-hidden border-r border-stroke bg-white duration-300 ease-linear 
          dark:border-stroke-dark dark:bg-gray-dark lg:static lg:translate-x-0 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 xl:py-5">
          <Link to="/">
            <img
              src={"/images/logo/crmLogoFull.png"}
              alt="Logo"
              className="dark:hidden"
              style={{ width: "auto", height: "auto", borderRadius: "33px" }}
            />
            <img
              src={"/images/logo/crmLogoFull.png"}
              alt="Logo"
              className="hidden dark:block"
              style={{ width: "auto", height: "auto", borderRadius: "33px" }}
            />
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block lg:hidden"
            aria-label={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z" />
            </svg>
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="relative flex flex-col overflow-y-hidden">
          <nav
            ref={navRef}
            className="no-scrollbar mt-1 flex-1 overflow-y-auto px-4 lg:px-6"
          >
            {currentMenuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-2">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Scroll Indicator */}
          {isVisible && (
            <ScrollIndicatorButton onClick={scrollToBottom} className="z-50" />
          )}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;