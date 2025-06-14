import React, { useState } from "react";
import PersonnelTable from "./personnelTable";
import { UseGetUsers } from "../../../hooks/useUser";
import SearchBar from "../SearchBar";
import Filter from "../Filter";
import Pagination from "../Pagination";
import { userFilter } from "../../../dataMenu/filterItem";
import { useNavigate } from "react-router-dom";
import Loading from "../../Loading";

const ListPersonnel = () => {
  const { data: listUser, isLoading, isError } = UseGetUsers();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("");

  const itemsPerPage = 5;

  const filteredUser = listUser?.filter((user) => {
    if (user.profile != null) {
      const matchesSearch =
        `${user.username} ${user.first_name} ${user.profile.role} ${user.email}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesClass = selectedFilter
        ? user.profile.role === selectedFilter.toLowerCase()
        : true;
      return matchesSearch && matchesClass;
    }
    return false;
  });

  const totalPages = Math.ceil((filteredUser?.length || 0) / itemsPerPage);
  const displayedData = filteredUser?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Gestion des utilisateurs
        </h1>
        <p className="text-gray-600">
          Liste et gestion des utilisateurs du système
        </p>
      </div>

      {/* Toolbar Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="w-full md:w-auto">
          <SearchBar search={search} setSearch={setSearch} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Filter
            listData={userFilter}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />

          <button
            onClick={() => navigate("/home/createUser/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Nouvel utilisateur
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        {isLoading || isError ? (
          <div className="flex justify-center items-center py-12">
            <Loading />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <PersonnelTable users={displayedData} />
            </div>
          </>
        )}
      </div>

      {/* Pagination Section */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default ListPersonnel;
