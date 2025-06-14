import React from "react";
import { useGetNotifications } from "../../hooks/useNotification";
import { Notification } from "../../types/notification.types";
import { BellIcon } from "@heroicons/react/24/outline";

const NotificationBox: React.FC = () => {
  const { data, isLoading, error } = useGetNotifications();
  const notifications: Notification[] = Array.isArray(data) ? data : [];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <BellIcon className="h-6 w-6 text-blue-500" />
        Toutes les notifications
      </h2>
      {isLoading && <div>Chargement...</div>}
      {error && <div className="text-red-500">Erreur lors du chargement des notifications.</div>}
      {!isLoading && notifications.length === 0 && (
        <div className="text-gray-500">Aucune notification.</div>
      )}
      <ul className="divide-y divide-gray-200">
        {!isLoading && notifications.map((notif) => (
          <li key={notif.id} className={`flex items-start gap-3 py-4 ${!notif.is_read ? 'bg-blue-50' : ''}`}>
            <BellIcon className={`h-5 w-5 mt-1 ${notif.is_read ? 'text-gray-400' : 'text-blue-500'}`} />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={`font-semibold ${!notif.is_read ? 'text-blue-700' : 'text-gray-800'}`}>{notif.title}</span>
                {notif.created_at && <span className="text-xs text-gray-400">{new Date(notif.created_at).toLocaleString()}</span>}
              </div>
              <div className="text-sm text-gray-700 mb-1">{notif.message}</div>
              {notif.link && (
                <a href={notif.link} className="text-xs text-blue-600 hover:underline">Voir le détail</a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationBox;
