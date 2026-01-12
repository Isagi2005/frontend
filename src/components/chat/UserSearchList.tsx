import React, { useState } from "react";
import { UseGetUsers } from "../../hooks/useUser";
import { User } from "../../api/userApi";

interface Props {
  onUserSelect: (user: User) => void;
  excludeIds?: number[];
}

const UserSearchList: React.FC<Props> = ({ onUserSelect, excludeIds = [] }) => {
  const { data: users, isLoading } = UseGetUsers();
  const [search, setSearch] = useState("");

  const filtered = (users || []).filter(
    (u) =>
      u.id !== undefined && !excludeIds.includes(u.id) &&
      (u.first_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.last_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.username?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-2">
      <input
        type="text"
        className="w-full p-2 border rounded mb-2"
        placeholder="Rechercher un utilisateur..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="max-h-64 overflow-y-auto">
        {isLoading ? (
          <div>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-400">Aucun utilisateur trouvé.</div>
        ) : (
          filtered.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
              onClick={() => onUserSelect(user)}
            >
              <span className="rounded-full bg-blue-200 w-7 h-7 flex items-center justify-center text-sm font-bold">
                {user.first_name?.[0] || user.username?.[0]}
              </span>
              <span>{user.first_name} {user.last_name} <span className="text-xs text-gray-400">({user.username})</span></span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserSearchList;
