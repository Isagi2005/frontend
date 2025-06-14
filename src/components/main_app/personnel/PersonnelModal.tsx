import React from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { UseRetrieve } from "../../../hooks/useUser";

interface PersonnelModalProps {
  personnelId: string | number | null;
  open: boolean;
  onClose: () => void;
}

const PersonnelModal: React.FC<PersonnelModalProps> = ({ personnelId, open, onClose }) => {
  const { data: user, isLoading } = UseRetrieve(personnelId ? String(personnelId) : "");

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-40" aria-hidden="true" />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto p-8 z-50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-2xl font-bold focus:outline-none"
            aria-label="Fermer"
          >
            <X />
          </button>
          {isLoading || !user ? (
            <div className="text-center py-12">Chargement...</div>
          ) : (
            <div className="flex flex-col items-center gap-6 w-full">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="font-bold text-gray-700">Nom</div>
                  <div>{user.last_name}</div>
                </div>
                <div>
                  <div className="font-bold text-gray-700">Prénom</div>
                  <div>{user.first_name}</div>
                </div>
                <div>
                  <div className="font-bold text-gray-700">Nom d'utilisateur</div>
                  <div>{user.username}</div>
                </div>
                <div>
                  <div className="font-bold text-gray-700">Email</div>
                  <div>{user.email}</div>
                </div>
                <div>
                  <div className="font-bold text-gray-700">Téléphone</div>
                  <div>{user.profile?.telephone || "-"}</div>
                </div>
                <div>
                  <div className="font-bold text-gray-700">Adresse</div>
                  <div>{user.profile?.adresse || "-"}</div>
                </div>
                <div>
                  <div className="font-bold text-gray-700">Sexe</div>
                  <div>{user.profile?.sexe || "-"}</div>
                </div>
                <div>
                  <div className="font-bold text-gray-700">Rôle</div>
                  <div>{user.profile?.role || "-"}</div>
                </div>
                <div>
                  <div className="font-bold text-gray-700">Date de naissance</div>
                  <div>{user.profile?.birthDate || "-"}</div>
                </div>
                <div>
                  <div className="font-bold text-gray-700">Religion</div>
                  <div>{user.profile?.religion || "-"}</div>
                </div>
                <div>
                  <div className="font-bold text-gray-700">Statut</div>
                  <div>{user.is_active ? "Actif" : "Inactif"}</div>
                </div>
                <div>
                  <div className="font-bold text-gray-700">Date d'arrivée</div>
                  <div>{user.dateArrivee || "-"}</div>
                </div>
              </div>
              {/* Historique photo */}
              <div className="flex flex-col items-center w-full">
                <div className="font-bold text-indigo-700 mb-2">Historique photo de connexion</div>
                <div className="w-48 h-48 rounded-xl overflow-hidden border-2 border-indigo-400 flex items-center justify-center bg-gray-100">
                  {user.profile?.historique ? (
                    <img
                      src={user.profile.historique}
                      alt={user.first_name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-indigo-600 font-bold text-4xl">
                      {user.first_name?.[0]}
                    </span>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default PersonnelModal;
