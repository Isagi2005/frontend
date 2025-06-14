import { GetUser } from "../../hooks/useUser";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import VoiceAssistantButton from "../VoiceAssistantButton";
import { getRoutesForRole, createRouteFuse, cleanTranscript } from "../../voiceRouteMatcher";
import {
  BellIcon,
  UserCircleIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useGetNotifications } from "../../hooks/useNotification";
import { Notification } from "../../types/notification.types";
import { useAuth } from "../../api/AuthContext";
import { useNavigate } from "react-router-dom";

const ProfileUser = () => {
  const nav = useNavigate();
  const { data: user } = GetUser();
  const { logout } = useAuth();

  const handleLogout = async () => {
    logout();
    nav("/login");
  };

  // Notifications dynamiques
  const { data: notifications, isLoading: notifLoading } = useGetNotifications();
  const unreadCount = (notifications as Notification[] | undefined)?.filter(n => !n.is_read).length || 0;

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {/* Bouton Notifications + Assistant vocal */}
      <Menu as="div" className="relative flex items-center gap-2">
        <MenuButton className="relative rounded-full p-1 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
          <span className="absolute -inset-1.5" />
          <span className="sr-only">Notifications</span>
          <BellIcon className="h-6 w-6" aria-hidden="true" />
          {/* Badge de notification */}
          {notifLoading ? null : (
            unreadCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                {unreadCount}
              </span>
            )
          )}
        </MenuButton>
        {/* Bouton Assistant vocal */}
        <VoiceAssistantButton
          onTranscript={(text) => {
            console.log("[Assistant vocal] Texte reconnu :", text);
            // On limite la recherche aux rôles direction et enseignant uniquement
            const userRole = (user?.profile.role || localStorage.getItem("role") || "direction").toLowerCase();
            if (!["direction", "enseignant"].includes(userRole)) {
              alert("La recherche vocale n'est disponible que pour les rôles direction et enseignant.");
              return;
            }
            const routes = getRoutesForRole(userRole);
            const fuse = createRouteFuse(routes);
            const cleanedText = cleanTranscript(text);
            // Détection déconnexion
            const logoutKeywords = ["deconnexion", "déconnexion", "deconnecte toi", "déconnecte toi", "déconnecter", "déconnectes", "déconnectez", "logout", "log out"];
            if (logoutKeywords.some(word => cleanedText.includes(word))) {
              handleLogout();
              nav("/login");
              return;
            }
            // Commande retour (navigation arrière)
            const retourKeywords = ["retour", "revenir", "précédent", "précédente", "back", "précédant", "go back", "previous", "page précédente", "page d'avant"];
            if (retourKeywords.some(word => cleanedText.includes(word))) {
              nav(-1);
              return;
            }
            const results = fuse.search(cleanedText);
            console.log("Commande nettoyée :", cleanedText);
            console.log("Résultats Fuse.js :", results);
            const bestMatch = results.length > 0 ? results[0].item : null;
            
            if (bestMatch) {
              nav("/home/" + bestMatch.path);
            } else {
              alert("Aucune page correspondante trouvée pour votre commande vocale.");
            }
          }}
        />

        <Transition
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="absolute right-0 z-10 mt-2 w-72 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="px-4 py-3">
              <p className="text-sm font-medium text-gray-900">Notifications</p>
            </div>
            <div className="py-1 max-h-60 overflow-y-auto">
              {notifLoading ? (
                <div className="px-4 py-2 text-sm text-gray-500">Chargement...</div>
              ) : notifications && (notifications as Notification[]).length > 0 ? (
                (notifications as Notification[]).map((notif) => (
                  <MenuItem key={notif.id}>
                    {({ focus }) => (
                      notif.link ? (
                        <a
                          href={notif.link}
                          className={`$${focus ? "bg-gray-100" : ""} flex px-4 py-2 text-sm text-gray-700`}
                        >
                          <div className="flex-shrink-0">
                            <BellIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                            <p className="text-xs text-gray-500">{notif.message}</p>
                          </div>
                        </a>
                      ) : (
                        <div
                          className={`$${focus ? "bg-gray-100" : ""} flex px-4 py-2 text-sm text-gray-700`}
                        >
                          <div className="flex-shrink-0">
                            <BellIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                            <p className="text-xs text-gray-500">{notif.message}</p>
                          </div>
                        </div>
                      )
                    )}
                  </MenuItem>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">Aucune notification.</div>
              )}
            </div>
            <div className="py-1">
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={() => nav("/notifications")}
                    className={`$${focus ? "bg-gray-100" : ""} block px-4 py-2 text-sm text-center text-blue-600 w-full`}
                  >
                    Voir toutes les notifications
                  </button>
                )}
              </MenuItem>
            </div>
          </MenuItems>
        </Transition>
      </Menu>

      {/* Menu Profil */}
      <Menu as="div" className="relative">
        <MenuButton className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
          <span className="absolute -inset-1.5" />
          <span className="sr-only">Ouvrir le menu utilisateur</span>
          {user?.profile?.image ? (
            <img
              className="h-8 w-8 rounded-full object-cover"
              src={user.profile.image}
              alt="Photo de profil"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
              <UserCircleIcon className="h-5 w-5 text-white" />
            </div>
          )}
        </MenuButton>

        <Transition
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
            <MenuItem>
              {({ focus }) => (
                <a
                  href={`/home/modif/${user?.id}`}
                  className={`${
                    focus ? "bg-gray-100" : ""
                  } flex items-center px-4 py-2 text-sm text-gray-700`}
                >
                  <UserCircleIcon className="mr-2 h-4 w-4" />
                  Mon profil
                </a>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={handleLogout}
                  className={`${
                    focus ? "bg-gray-100" : ""
                  } flex items-center px-4 py-2 text-sm text-gray-700 border-t border-gray-100`}
                >
                  <ArrowLeftStartOnRectangleIcon className="mr-2 h-4 w-4" />
                  Déconnexion
                </button>
              )}
            </MenuItem>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
};

export default ProfileUser;
