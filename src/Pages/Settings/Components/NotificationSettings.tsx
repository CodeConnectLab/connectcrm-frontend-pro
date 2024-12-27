import React, { useState } from "react";
import dayjs from "dayjs";
import { getStoredStatus } from "../../../api/commonAPI";
import DateTimePicker from "../../../components/FormElements/DatePicker/DateTimePicker";
import Heading from "../../../components/CommonUI/Heading";

// SwitcherTwo Component
const SwitcherTwo = ({
  id,
  defaultChecked,
  onChange = () => {},
  idForAPI = "",
}: {
  id: string;
  defaultChecked?: boolean;
  onChange?: any;
  idForAPI?: string;
}) => {
  const [enabled, setEnabled] = useState(defaultChecked);
  return (
    <div>
      <label
        htmlFor={id}
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            id={id}
            type="checkbox"
            className="sr-only"
            onChange={() => {
              onChange(idForAPI ? idForAPI : id, !enabled);
              setEnabled(!enabled);
            }}
          />
          <div className="h-5 w-14 rounded-full bg-gray-3 dark:bg-[#5A616B]"></div>
          <div
            className={`dot shadow-switch-2 absolute -top-1 left-0 h-7 w-7 rounded-full bg-white transition ${
              enabled &&
              "!right-0 !translate-x-full !bg-primary dark:!bg-green-light"
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
};

interface NotificationTime {
  time: string;
  enabled: boolean;
}

interface Status {
  _id: string;
  name: string;
  wonStatus: boolean;
  lossStatus: boolean;
}

interface NotificationTemplateProps {
  title: string;
  defaultTimes?: NotificationTime[];
  recipients?: {
    admin: boolean;
    teamLead: boolean;
    regularUser: boolean;
  };
}

// Individual notification section component
const NotificationTemplate: React.FC<NotificationTemplateProps> = ({
  title,
  defaultTimes = [
    { time: "09:00 AM", enabled: false },
    { time: "02:00 PM", enabled: false },
  ],
  recipients = {
    admin: false,
    teamLead: false,
    regularUser: false,
  },
}) => {
  const [enabled, setEnabled] = useState(false);
  const [notificationTimes, setNotificationTimes] = useState(defaultTimes);
  const [recipientSettings, setRecipientSettings] = useState(recipients);
  const [notificationTitle, setNotificationTitle] = useState(
    `Meeting: {${title.toLowerCase()}_title}`
  );
  const [notificationBody, setNotificationBody] = useState(
    `Your ${title.toLowerCase()} {${title.toLowerCase()}_title} is scheduled for {time}. Location: {location}`
  );

  const handleMainToggle = (_: string, checked: boolean) => {
    setEnabled(checked);
  };

  return (
    <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title} Notifications
        </h2>
        <SwitcherTwo
          id={`${title.toLowerCase()}-notifications`}
          defaultChecked={enabled}
          onChange={handleMainToggle}
        />
      </div>
      <p className="mb-1 text-gray-600 dark:text-gray-300">
        Reminder settings for upcoming {title.toLowerCase()}s and updates
      </p>

      {enabled && (
        <>
          {/* Notification Content Section */}
          <div className="mb-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <span className="text-blue-500">📝</span> Notification Content
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title Template
                </label>
                <input
                  type="text"
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm dark:text-white dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Body Template
                </label>
                <textarea
                  value={notificationBody}
                  onChange={(e) => setNotificationBody(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm dark:text-white dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Notification Times Section */}
          <div className="mb-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <span className="text-blue-500">⏰</span> Notification Times
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-300">
                    * Same as Follow-Up Time and Date:
                  </span>
                </div>
                <SwitcherTwo
                  id={`${title.toLowerCase()}-followup-time`}
                  defaultChecked={true}
                  onChange={() => {}}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-300">
                    * Custom Time:
                    <div className="mt-2">
                      <DateTimePicker
                        onChange={() => {}}
                        defaultValue={""}
                        enableTime
                      />
                    </div>
                  </span>
                </div>
                <SwitcherTwo
                  id={`${title.toLowerCase()}-custom-time`}
                  defaultChecked={true}
                  onChange={() => {}}
                />
              </div>
            </div>
          </div>

          {/* Recipients Section */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <span className="text-blue-500">👥</span> Recipients
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Admin</span>
                <SwitcherTwo
                  id={`${title.toLowerCase()}-admin`}
                  defaultChecked={recipientSettings.admin}
                  onChange={(_: any, checked: any) =>
                    setRecipientSettings({
                      ...recipientSettings,
                      admin: checked,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Team Lead
                </span>
                <SwitcherTwo
                  id={`${title.toLowerCase()}-teamlead`}
                  defaultChecked={recipientSettings.teamLead}
                  onChange={(_: any, checked: any) =>
                    setRecipientSettings({
                      ...recipientSettings,
                      teamLead: checked,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Regular User
                </span>
                <SwitcherTwo
                  id={`${title.toLowerCase()}-regularuser`}
                  defaultChecked={recipientSettings.regularUser}
                  onChange={(_: any, checked: any) =>
                    setRecipientSettings({
                      ...recipientSettings,
                      regularUser: checked,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const statuses = getStoredStatus();

// Main component that renders notification settings for all statuses
const StatusNotificationSettings: React.FC<{ statuses?: Status[] }> = () => {
  return (
    <div className="space-y-6">
      <Heading title="Manage Your Reminders" />
      {statuses.map((status) => (
        <NotificationTemplate key={status._id} title={status.name} />
      ))}
    </div>
  );
};

export default StatusNotificationSettings;
