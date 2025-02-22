import { FC, useEffect, useState } from "react";
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
import useScrollIndicator, {
  ScrollIndicatorButton,
} from "../CommonUI/ScrollIndicator";
// Base menu structure
export const menuGroups = [
  {
    name: "MAIN MENU",
    menuItems: [
      {
        icon: <LuLayoutDashboard className="text-2xl" />,
        label: "Dashboard",
        route: "#",
        children: [{ label: "Overview", route: "/" }],
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
        icon: (
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Calendar SVG paths */}
            <path d="M17 14C17.5523 14 18 13.5523 18 13C18 12.4477 17.5523 12 17 12C16.4477 12 16 12.4477 16 13C16 13.5523 16.4477 14 17 14Z" fill="" />
            <path d="M17 18C17.5523 18 18 17.5523 18 17C18 16.4477 17.5523 16 17 16C16.4477 16 16 16.4477 16 17C16 17.5523 16.4477 18 17 18Z" fill="" />
            <path d="M13 13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13C11 12.4477 11.4477 12 12 12C12.5523 12 13 12.4477 13 13Z" fill="" />
            <path d="M13 17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17C11 16.4477 11.4477 16 12 16C12.5523 16 13 16.4477 13 17Z" fill="" />
            <path d="M7 14C7.55229 14 8 13.5523 8 13C8 12.4477 7.55229 12 7 12C6.44772 12 6 12.4477 6 13C6 13.5523 6.44772 14 7 14Z" fill="" />
            <path d="M7 18C7.55229 18 8 17.5523 8 17C8 16.4477 7.55229 16 7 16C6.44772 16 6 16.4477 6 17C6 17.5523 6.44772 18 7 18Z" fill="" />
            <path fillRule="evenodd" clipRule="evenodd" d="M7 1.75C7.41421 1.75 7.75 2.08579 7.75 2.5V3.26272C8.412 3.24999 9.14133 3.24999 9.94346 3.25H14.0564C14.8586 3.24999 15.588 3.24999 16.25 3.26272V2.5C16.25 2.08579 16.5858 1.75 17 1.75C17.4142 1.75 17.75 2.08579 17.75 2.5V3.32709C18.0099 3.34691 18.2561 3.37182 18.489 3.40313C19.6614 3.56076 20.6104 3.89288 21.3588 4.64124C22.1071 5.38961 22.4392 6.33855 22.5969 7.51098C22.75 8.65018 22.75 10.1058 22.75 11.9435V14.0564C22.75 15.8941 22.75 17.3498 22.5969 18.489C22.4392 19.6614 22.1071 20.6104 21.3588 21.3588C20.6104 22.1071 19.6614 22.4392 18.489 22.5969C17.3498 22.75 15.8942 22.75 14.0565 22.75H9.94359C8.10585 22.75 6.65018 22.75 5.51098 22.5969C4.33856 22.4392 3.38961 22.1071 2.64124 21.3588C1.89288 20.6104 1.56076 19.6614 1.40314 18.489C1.24997 17.3498 1.24998 15.8942 1.25 14.0564V11.9436C1.24998 10.1058 1.24997 8.65019 1.40314 7.51098C1.56076 6.33855 1.89288 5.38961 2.64124 4.64124C3.38961 3.89288 4.33856 3.56076 5.51098 3.40313C5.7439 3.37182 5.99006 3.34691 6.25 3.32709V2.5C6.25 2.08579 6.58579 1.75 7 1.75Z" fill="" />
          </svg>
        ),
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
const getMenuGroups = (userRole: string | null) => {
  const groups = JSON.parse(JSON.stringify(menuGroups)); // Deep clone the menu groups
  
  // Find the Reports menu item
  const mainMenu = groups.find((group:any) => group.name === "MAIN MENU");
  if (mainMenu) {
    const reportsMenuItem = mainMenu.menuItems.find((item:any) => item.label === "Reports");
    if (reportsMenuItem && reportsMenuItem.children) {
      // Add call report only for Super Admin
      if (userRole === "Super Admin") {
        reportsMenuItem.children.push({ label: "Call report", route: "/reports/call" });
      }
    }
  }
  
  return groups;
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
            {menuGroups.map((group, groupIndex) => (
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
