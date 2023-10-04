// hooks/useServiceWorker.ts
import { getCookie } from "cookies-next";
import { useCallback, useEffect } from "react";
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

const useServiceWorker = (
  swPath: string,
  channelName: string
): { requestNotificationPermission: () => Promise<void> } => {
  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey as string);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register(swPath)
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((err) => {
          console.error("Service Worker registration failed:", err);
        });
    }
  }, [swPath]);

  const requestNotificationPermission = useCallback(async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted" && "serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });

        const response = await fetch("/api/chatSubscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subscription,
            conversationId: channelName,
            user_agent_id: getCookie(`user_agent_id`),
          }),
        });

        const data = await response.json();

        if (data.success) {
          console.log("Successfully subscribed!");
        } else {
          console.error("Error subscribing:", data.error);
        }
      }
    } catch (err) {
      console.error("Push subscription failed:", err);
    }
  }, [convertedVapidKey, channelName]);

  return { requestNotificationPermission };
};

export default useServiceWorker;
