import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCozUySs4wmujXlY_NZl8MKkIu8rZkpgic",
  authDomain: "connectcrm-b29a2.firebaseapp.com",
  projectId: "connectcrm-b29a2",
  storageBucket: "connectcrm-b29a2.firebasestorage.app",
  messagingSenderId: "690967737660",
  appId: "1:690967737660:web:d542a11843a7241c9d5a39",
  measurementId: "G-G3NC1QYNWK"
};

const VAPID_KEY =
  "BN-ecD8jPYjlkB9SssiGilOEiqwdTsBE7vt2MfmJOz9aq2puY20gHpTed_9-DHJA4UECAOcE72Yn63SilnVupvY";

const NotificationSetup: React.FC = () => {
  const [notificationStatus, setNotificationStatus] = useState<string>("");
  const [fcmToken, setFcmToken] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        const isFirebaseSupported = await isSupported();

        if (!isFirebaseSupported) {
          setError("Firebase Messaging is not supported in this browser.");
          return;
        }

        const app = initializeApp(firebaseConfig);
        const messaging = getMessaging(app);

        if (!("serviceWorker" in navigator)) {
          setError("Service Worker is not supported in this browser.");
          return;
        }

        const permission = await Notification.requestPermission();
        setNotificationStatus(permission);

        if (permission === "granted") {
          const serviceWorkerRegistration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js"
          );
          const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration });

          if (token) {
            setFcmToken(token);
            console.log("FCM Token:", token);
          } else {
            setError("Failed to retrieve FCM Token.");
          }

          onMessage(messaging, (payload) => {
            console.log("Message received:", payload);

            if (payload.notification) {
              const title = payload.notification.title;
              new Notification(title || 'Default Title', {
                body: payload.notification.body,
                icon: payload.notification.icon,
              });
            }
          });
        } else {
          setError("Notification permission was denied.");
        }
      } catch (err: unknown) {
        if (typeof err === 'object' && err !== null) {
          console.error("Firebase initialization error:", err);
          setError(String(err));
        } else {
          console.error("Firebase initialization error:", err);
          setError(String(err));
        }
      }
    };

    initializeFirebase();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      {/* <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
        Notification Setup
      </h2> */}

      {error && (
        <div
          style={{
            backgroundColor: "#fee2e2",
            border: "1px solid #ef4444",
            borderRadius: "0.375rem",
            padding: "1rem",
            marginBottom: "1rem",
            color: "#dc2626",
          }}
        >
          {error}
        </div>
      )}

      {notificationStatus && (
        <div style={{ marginBottom: "1rem" }}>
          <p style={{ fontWeight: "600" }}>
            Notification Status:{" "}
            <span
              style={{
                marginLeft: "0.5rem",
                color: notificationStatus === "granted" ? "#16a34a" : "#dc2626",
              }}
            >
              {notificationStatus}
            </span>
          </p>
        </div>
      )}

      {fcmToken && (
        <div style={{ marginTop: "1rem" }}>
          <p style={{ fontWeight: "600", marginBottom: "0.5rem" }}>FCM Token:</p>
          <div
            style={{
              backgroundColor: "#f3f4f6",
              padding: "0.5rem",
              borderRadius: "0.375rem",
              wordBreak: "break-all",
            }}
          >
            {fcmToken}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSetup;
