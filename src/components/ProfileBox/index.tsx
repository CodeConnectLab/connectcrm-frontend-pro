"use client";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { MdVerified, MdErrorOutline } from "react-icons/md";
import { Avatar } from "antd";
interface UserData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  companyCode: string;
  role: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  bio: string;
  profilePic: string;
  company: {
    id: string;
    name: string;
    code: string;
    subscription: {
      plan: string;
      startDate: string;
      endDate: string;
      status: string;
      features: string[];
    };
  };
}

const ProfileBox = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const data = JSON.parse(userStr);
        setUserData(data);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  if (!userData) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <>
      <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="relative z-20 h-35 md:h-65">
          <img
            src="/images/cover/cover-01.png"
            alt="profile cover"
            className="h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
            width={970}
            height={260}
            style={{
              width: "auto",
              height: "auto",
            }}
          />
          {/* <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
            <label
              htmlFor="cover"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-[3px] bg-primary px-[15px] py-[5px] text-body-sm font-medium text-white hover:bg-opacity-90"
            >
              <input
                type="file"
                name="coverPhoto"
                id="coverPhoto"
                className="sr-only"
                accept="image/png, image/jpg, image/jpeg"
              />
              <span>
                <svg
                  className="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.69882 3.365C5.89894 2.38259 6.77316 1.6875 7.77475 1.6875H10.2252C11.2268 1.6875 12.1011 2.38259 12.3012 3.36499C12.3474 3.59178 12.5528 3.75814 12.7665 3.75814H12.7788L12.7911 3.75868C13.8437 3.80471 14.6521 3.93387 15.3271 4.37668C15.7524 4.65568 16.1182 5.01463 16.4033 5.43348C16.7579 5.9546 16.9143 6.55271 16.9893 7.27609C17.0625 7.98284 17.0625 8.86875 17.0625 9.99079V10.0547C17.0625 11.1767 17.0625 12.0626 16.9893 12.7694C16.9143 13.4927 16.7579 14.0909 16.4033 14.612C16.1182 15.0308 15.7524 15.3898 15.3271 15.6688C14.7995 16.0149 14.1947 16.1675 13.461 16.2408C12.7428 16.3125 11.8418 16.3125 10.6976 16.3125H7.30242C6.15824 16.3125 5.25725 16.3125 4.53897 16.2408C3.80534 16.1675 3.20049 16.0149 2.67289 15.6688C2.24761 15.3898 1.88179 15.0308 1.59674 14.612C1.24209 14.0909 1.08567 13.4927 1.01072 12.7694C0.937488 12.0626 0.937494 11.1767 0.9375 10.0547V9.9908C0.937494 8.86875 0.937488 7.98284 1.01072 7.27609C1.08567 6.55271 1.24209 5.9546 1.59674 5.43348C1.88179 5.01463 2.24761 4.65568 2.67289 4.37668C3.34787 3.93387 4.15635 3.80471 5.20892 3.75868L5.2212 3.75814H5.2335C5.44716 3.75814 5.65262 3.59179 5.69882 3.365ZM7.77475 2.8125C7.29392 2.8125 6.89179 3.14475 6.80118 3.58955C6.65443 4.30994 6.01575 4.8764 5.24725 4.88308C4.23579 4.92802 3.69402 5.05227 3.28998 5.31733C2.98732 5.51589 2.72814 5.77058 2.52679 6.06643C2.31968 6.37076 2.19522 6.75994 2.12973 7.39203C2.06321 8.03405 2.0625 8.8617 2.0625 10.0227C2.0625 11.1838 2.06321 12.0114 2.12973 12.6534C2.19522 13.2855 2.31968 13.6747 2.5268 13.979C2.72814 14.2749 2.98732 14.5296 3.28998 14.7281C3.60313 14.9336 4.00383 15.0567 4.65078 15.1213C5.30662 15.1868 6.15145 15.1875 7.33333 15.1875H10.6667C11.8486 15.1875 12.6934 15.1868 13.3492 15.1213C13.9962 15.0567 14.3969 14.9336 14.71 14.7281C15.0127 14.5296 15.2719 14.2749 15.4732 13.979C15.6803 13.6747 15.8048 13.2855 15.8703 12.6534C15.9368 12.0114 15.9375 11.1838 15.9375 10.0227C15.9375 8.8617 15.9368 8.03405 15.8703 7.39203C15.8048 6.75994 15.6803 6.37076 15.4732 6.06643C15.2719 5.77058 15.0127 5.51589 14.71 5.31733C14.306 5.05227 13.7642 4.92802 12.7528 4.88308C11.9843 4.8764 11.3456 4.30994 11.1988 3.58955C11.1082 3.14475 10.7061 2.8125 10.2252 2.8125H7.77475ZM9 8.0625C8.06802 8.0625 7.3125 8.81802 7.3125 9.75C7.3125 10.682 8.06802 11.4375 9 11.4375C9.93198 11.4375 10.6875 10.682 10.6875 9.75C10.6875 8.81802 9.93198 8.0625 9 8.0625ZM6.1875 9.75C6.1875 8.1967 7.4467 6.9375 9 6.9375C10.5533 6.9375 11.8125 8.1967 11.8125 9.75C11.8125 11.3033 10.5533 12.5625 9 12.5625C7.4467 12.5625 6.1875 11.3033 6.1875 9.75ZM12.9375 7.5C12.9375 7.18934 13.1893 6.9375 13.5 6.9375H14.25C14.5607 6.9375 14.8125 7.18934 14.8125 7.5C14.8125 7.81066 14.5607 8.0625 14.25 8.0625H13.5C13.1893 8.0625 12.9375 7.81066 12.9375 7.5Z"
                    fill=""
                  />
                </svg>
              </span>
              <span>Edit</span>
            </label>
          </div> */}
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
            <div className="relative drop-shadow-2">
              <Avatar
                size={152}
                src={
                  userData?.profilePic
                    ? userData?.profilePic
                    : "https://api.dicebear.com/7.x/miniavs/svg?seed=1"
                }
                style={{ background: "lightblue" }}
              />
            </div>

            {/* <label
              htmlFor="profilePhoto"
              className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
            >
              <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.69882 3.365C5.89894 2.38259 6.77316 1.6875 7.77475 1.6875H10.2252C11.2268 1.6875 12.1011 2.38259 12.3012 3.36499C12.3474 3.59178 12.5528 3.75814 12.7665 3.75814H12.7788L12.7911 3.75868C13.8437 3.80471 14.6521 3.93387 15.3271 4.37668C15.7524 4.65568 16.1182 5.01463 16.4033 5.43348C16.7579 5.9546 16.9143 6.55271 16.9893 7.27609C17.0625 7.98284 17.0625 8.86875 17.0625 9.99079V10.0547C17.0625 11.1767 17.0625 12.0626 16.9893 12.7694C16.9143 13.4927 16.7579 14.0909 16.4033 14.612C16.1182 15.0308 15.7524 15.3898 15.3271 15.6688C14.7995 16.0149 14.1947 16.1675 13.461 16.2408C12.7428 16.3125 11.8418 16.3125 10.6976 16.3125H7.30242C6.15824 16.3125 5.25725 16.3125 4.53897 16.2408C3.80534 16.1675 3.20049 16.0149 2.67289 15.6688C2.24761 15.3898 1.88179 15.0308 1.59674 14.612C1.24209 14.0909 1.08567 13.4927 1.01072 12.7694C0.937488 12.0626 0.937494 11.1767 0.9375 10.0547V9.9908C0.937494 8.86875 0.937488 7.98284 1.01072 7.27609C1.08567 6.55271 1.24209 5.9546 1.59674 5.43348C1.88179 5.01463 2.24761 4.65568 2.67289 4.37668C3.34787 3.93387 4.15635 3.80471 5.20892 3.75868L5.2212 3.75814H5.2335C5.44716 3.75814 5.65262 3.59179 5.69882 3.365ZM7.77475 2.8125C7.29392 2.8125 6.89179 3.14475 6.80118 3.58955C6.65443 4.30994 6.01575 4.8764 5.24725 4.88308C4.23579 4.92802 3.69402 5.05227 3.28998 5.31733C2.98732 5.51589 2.72814 5.77058 2.52679 6.06643C2.31968 6.37076 2.19522 6.75994 2.12973 7.39203C2.06321 8.03405 2.0625 8.8617 2.0625 10.0227C2.0625 11.1838 2.06321 12.0114 2.12973 12.6534C2.19522 13.2855 2.31968 13.6747 2.5268 13.979C2.72814 14.2749 2.98732 14.5296 3.28998 14.7281C3.60313 14.9336 4.00383 15.0567 4.65078 15.1213C5.30662 15.1868 6.15145 15.1875 7.33333 15.1875H10.6667C11.8486 15.1875 12.6934 15.1868 13.3492 15.1213C13.9962 15.0567 14.3969 14.9336 14.71 14.7281C15.0127 14.5296 15.2719 14.2749 15.4732 13.979C15.6803 13.6747 15.8048 13.2855 15.8703 12.6534C15.9368 12.0114 15.9375 11.1838 15.9375 10.0227C15.9375 8.8617 15.9368 8.03405 15.8703 7.39203C15.8048 6.75994 15.6803 6.37076 15.4732 6.06643C15.2719 5.77058 15.0127 5.51589 14.71 5.31733C14.306 5.05227 13.7642 4.92802 12.7528 4.88308C11.9843 4.8764 11.3456 4.30994 11.1988 3.58955C11.1082 3.14475 10.7061 2.8125 10.2252 2.8125H7.77475ZM9 8.0625C8.06802 8.0625 7.3125 8.81802 7.3125 9.75C7.3125 10.682 8.06802 11.4375 9 11.4375C9.93198 11.4375 10.6875 10.682 10.6875 9.75C10.6875 8.81802 9.93198 8.0625 9 8.0625ZM6.1875 9.75C6.1875 8.1967 7.4467 6.9375 9 6.9375C10.5533 6.9375 11.8125 8.1967 11.8125 9.75C11.8125 11.3033 10.5533 12.5625 9 12.5625C7.4467 12.5625 6.1875 11.3033 6.1875 9.75ZM12.9375 7.5C12.9375 7.18934 13.1893 6.9375 13.5 6.9375H14.25C14.5607 6.9375 14.8125 7.18934 14.8125 7.5C14.8125 7.81066 14.5607 8.0625 14.25 8.0625H13.5C13.1893 8.0625 12.9375 7.81066 12.9375 7.5Z"
                  fill=""
                />
              </svg>

              <input
                type="file"
                name="profilePhoto"
                id="profilePhoto"
                className="sr-only"
                accept="image/png, image/jpg, image/jpeg"
              />
            </label> */}
          </div>
          <div className="mt-4">
            <h3 className="mb-1 text-heading-6 font-bold text-dark dark:text-white">
              {userData.name}
            </h3>
            <p className="font-medium">
              {userData.role}{" "}
              <span className=" text-sm">@{userData.company.name}</span>
            </p>
            {/* <div className="mx-auto mb-5.5 mt-5 grid max-w-[370px] grid-cols-3 rounded-[5px] border border-stroke py-[9px] shadow-1 dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3 xsm:flex-row">
                <span className="font-medium text-dark dark:text-white">
                  259
                </span>
                <span className="text-body-sm">Posts</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3 xsm:flex-row">
                <span className="font-medium text-dark dark:text-white">
                  129K
                </span>
                <span className="text-body-sm">Followers</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                <span className="font-medium text-dark dark:text-white">
                  2K
                </span>
                <span className="text-body-sm-sm">Following</span>
              </div>
            </div> */}

            <div className="mx-auto mt-6 max-w-[720px]">
              <h4 className="font-medium text-dark dark:text-white">
                About Me
              </h4>
              <p className="mt-1">{userData.bio}</p>
            </div>
            <div className="flex justify-center gap-6 mt-6">
              <div>
                <h4 className="mb-1 font-medium text-dark dark:text-white">
                  Contact Information
                </h4>
                <div className="space-y-1 text-gray-600 dark:text-gray-400">
                  <p>{userData.email}</p>
                  <p>{userData.phone}</p>
                </div>
              </div>
              <div>
                <h4 className="mb-1 font-medium text-dark dark:text-white">
                  Company Details
                </h4>
                <div className="space-y-1 text-gray-600 dark:text-gray-400">
                  <p>{userData?.company?.name}</p>
                  <p>{userData.companyCode}</p>
                </div>
              </div>
              <div>
                <h4 className="mb-1 font-medium text-dark dark:text-white">
                  Subscription Details
                </h4>
                <div className="space-y-1 text-gray-600 dark:text-gray-400">
                  <p>Plan Name: {userData.company?.subscription?.plan}</p>
                  <p>
                    Expires:{" "}
                    {formatDate(userData.company?.subscription?.endDate)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4.5">
              {/* Social Links */}
              <div className="mt-6">
                <div className="flex items-center justify-center gap-3.5">
                  <Link
                    to="#"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke text-gray-600 hover:border-primary hover:text-primary dark:border-dark-3 dark:text-white"
                  >
                    <FaFacebookF />
                  </Link>
                  <Link
                    to="#"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke text-gray-600 hover:border-primary hover:text-primary dark:border-dark-3 dark:text-white"
                  >
                    <FaTwitter />
                  </Link>
                  <Link
                    to="#"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke text-gray-600 hover:border-primary hover:text-primary dark:border-dark-3 dark:text-white"
                  >
                    <FaLinkedinIn />
                  </Link>
                  <Link
                    to="#"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke text-gray-600 hover:border-primary hover:text-primary dark:border-dark-3 dark:text-white"
                  >
                    <FaGithub />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileBox;
