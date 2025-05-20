import { createContext, useContext, useState } from "react";

interface Notification {
  id: string;
  message: string;
  productName: string;
  quantity: number;
  timestamp: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (productName: string, quantity: number) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (productName: string, quantity: number) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      message: `Low stock: ${productName} (${quantity} left)`,
      productName,
      quantity,
      timestamp: new Date(),
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep last 10
  };

  const clearNotifications = () => setNotifications([]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within NotificationProvider");
  return context;
};