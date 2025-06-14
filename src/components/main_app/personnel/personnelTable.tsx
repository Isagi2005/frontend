import  { useState } from "react";
import { User } from "../../../api/userApi";
import { useNavigate } from "react-router-dom";
import { Switch } from "@headlessui/react";
import DialogueModal from "../confirmationDialog";
import { useUpdateUser } from "../../../hooks/useUser";
import { Eye } from "lucide-react";
import PersonnelModal from "./PersonnelModal";

interface Props {
  users: User[];
}

const PersonnelTable = ({ users }: Props) => {
  const navigate = useNavigate();
  const updateMutation = useUpdateUser();
  const [selectedUser, setSelectedUser] = useState<User>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPersonnelId, setModalPersonnelId] = useState<string | number | null>(null);
  const [description, setDescription] = useState("");
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleSwitch = (value: User) => {
    if (value) {
      if (value.is_active == true) {
        setDescription("Voulez-vous vraiment desactiver cette utilisateur ?");
      } else {
        setDescription("Voulez-vous vraiment activer cette utilisateur ?");
      }
      value.is_active = !value.is_active;
      setSelectedUser(value);
      setIsOpen(true);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="w-full overflow-x-auto">
        {isOpen && (
          <DialogueModal
            description={description}
            selectedId={selectedUser}
            setSelectedId={setSelectedUser}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            mutation={updateMutation}
          />
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-emerald-50">
            <tr>
              <th
                scope="col"
                className="border px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nom
              </th>
              <th
                scope="col"
                className="border px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
              >
                Identifiant
              </th>
              <th
                scope="col"
                className="border px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
              >
                Fonction et adresse
              </th>
              <th
                scope="col"
                className="border px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
              >
                Date d'arrivée
              </th>
              <th
                scope="col"
                className="border px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Statut
              </th>
              <th
                scope="col"
                className="border px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell"
              >
                Téléphone
              </th>

              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {users === null ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  Chargement...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  Aucun utilisateur trouvé
                </td>
              </tr>
            ) : (
              users?.map((user) => (
                <tr key={user.id} className="border hover:bg-emerald-100">
                  <td className="border px-4 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.profile?.image ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.profile?.image}
                            alt={user.first_name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-medium">
                              {getInitials(user.first_name)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-[150px]">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="border px-4 py-4 text-sm text-gray-500 hidden sm:table-cell">
                    {user.username}
                  </td>

                  <td className="border px-4 py-4 hidden md:table-cell">
                    <div className="text-sm font-medium text-gray-900">
                      {user.profile?.role.toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-[200px]">
                      {user.profile?.adresse}
                    </div>
                  </td>

                  <td className="border px-4 py-4 text-sm text-gray-500 hidden lg:table-cell">
                    {user.dateArrivee}
                  </td>

                  <td className="border px-4 py-4">
                    <Switch
                      checked={user.status === "active" ? true : false}
                      onChange={() => handleSwitch(user)}
                      className={`${
                        user.status === "active" ? "bg-blue-600" : "bg-gray-400"
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform bg-white rounded-full transition-transform duration-200 ${
                          user.status === "active"
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </Switch>

                    {/* </span> */}
                  </td>

                  <td className="border px-4 py-4 text-sm text-gray-500 hidden xl:table-cell">
                    {user.profile.telephone}
                  </td>

                  <td className="border px-4 py-4 text-right text-sm font-medium flex gap-2 items-center">
                    {/* Icône voir */}
                    <button
                      onClick={() => {
                        setModalPersonnelId(user.id);
                        setModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 p-2"
                      title="Voir le profil"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={() => navigate(`/home/modif/${user.id}`)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                      title="Modifier"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Modal d'information personnel */}
      <PersonnelModal
        personnelId={modalPersonnelId}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default PersonnelTable;
